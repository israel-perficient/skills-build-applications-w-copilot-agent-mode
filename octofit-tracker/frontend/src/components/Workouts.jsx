import { useEffect, useState } from 'react'
import { fetchResource, normalizeResourceData } from './api'

function Workouts() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadWorkouts = async () => {
      try {
        const payload = await fetchResource('workouts')
        const nextItems = normalizeResourceData(payload)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
        setCount(payload?.count ?? nextItems.length)
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load workouts.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card resource-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Plans</p>
            <h2 className="h3 mb-0">Workouts</h2>
          </div>
          <span className="badge text-bg-secondary rounded-pill">{count} plans</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading workouts...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No workout plans are available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Focus</th>
                </tr>
              </thead>
              <tbody>
                {items.map((workout) => (
                  <tr key={workout._id ?? workout.name}>
                    <td>{workout.name}</td>
                    <td>{workout.category}</td>
                    <td>{workout.difficulty}</td>
                    <td>{workout.durationMinutes} min</td>
                    <td>{workout.focusAreas?.join(', ') || 'General'}</td>
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

export default Workouts
