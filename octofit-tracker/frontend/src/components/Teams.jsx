import { useEffect, useState } from 'react'
import { fetchResource, normalizeResourceData } from './api'

function Teams() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadTeams = async () => {
      try {
        const payload = await fetchResource('teams')
        const nextItems = normalizeResourceData(payload)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
        setCount(payload?.count ?? nextItems.length)
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load teams.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card resource-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Groups</p>
            <h2 className="h3 mb-0">Teams</h2>
          </div>
          <span className="badge text-bg-success rounded-pill">{count} teams</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading teams...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No teams are available right now.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sport</th>
                  <th>City</th>
                  <th>Motto</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {items.map((team) => (
                  <tr key={team._id ?? team.name}>
                    <td>{team.name}</td>
                    <td>{team.sport}</td>
                    <td>{team.city}</td>
                    <td>{team.motto || '—'}</td>
                    <td>{team.members?.length ?? 0}</td>
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

export default Teams
