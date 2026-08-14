import { useEffect, useState } from 'react'
import { fetchResource, normalizeResourceData } from './api'

function Users() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        const payload = await fetchResource('users')
        const nextItems = normalizeResourceData(payload)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
        setCount(payload?.count ?? nextItems.length)
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load users.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card resource-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Members</p>
            <h2 className="h3 mb-0">Users</h2>
          </div>
          <span className="badge text-bg-primary rounded-pill">{count} total</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading users...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No users were returned by the API.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Fitness</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user._id ?? user.email ?? user.name}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.city}</td>
                    <td>
                      <span className="status-badge">{user.fitnessLevel}</span>
                    </td>
                    <td>{user.age}</td>
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

export default Users
