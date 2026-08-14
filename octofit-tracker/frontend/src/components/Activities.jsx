import { useEffect, useState } from 'react'
import { fetchResource, normalizeResourceData } from './api'

const activitiesApiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

function Activities() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadActivities = async () => {
      try {
        const payload = await fetchResource('activities')
        const nextItems = normalizeResourceData(payload)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
        setCount(payload?.count ?? nextItems.length)
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load activities.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card resource-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Recent work</p>
            <h2 className="h3 mb-0">Activities</h2>
          </div>
          <span className="badge text-bg-warning rounded-pill">{count} logs</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading activities...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No activity entries have been logged yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Minutes</th>
                  <th>Calories</th>
                  <th>Distance</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((activity) => (
                  <tr key={activity._id ?? `${activity.userId}-${activity.date}`}>
                    <td>{activity.type}</td>
                    <td>{activity.durationMinutes}</td>
                    <td>{activity.caloriesBurned}</td>
                    <td>{activity.distanceKm} km</td>
                    <td>{formatDate(activity.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Activities
