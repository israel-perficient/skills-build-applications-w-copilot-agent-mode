import { useEffect, useState } from 'react'
import { fetchResource, normalizeResourceData } from './api'

const leaderboardApiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadLeaderboard = async () => {
      try {
        const payload = await fetchResource('leaderboard')
        const nextItems = normalizeResourceData(payload)

        if (!isMounted) {
          return
        }

        setItems(nextItems)
        setCount(payload?.count ?? nextItems.length)
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load leaderboard.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card resource-card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Ranking</p>
            <h2 className="h3 mb-0">Leaderboard</h2>
          </div>
          <span className="badge text-bg-info rounded-pill">{count} ranked</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading leaderboard...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No leaderboard rankings are available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Score</th>
                  <th>Streak</th>
                  <th>User ID</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry) => (
                  <tr key={entry._id ?? `${entry.userId}-${entry.rank}`}>
                    <td>#{entry.rank}</td>
                    <td>{entry.score}</td>
                    <td>{entry.streak}</td>
                    <td>{entry.userId}</td>
                    <td>{new Date(entry.updatedAt).toLocaleDateString()}</td>
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

export default Leaderboard
