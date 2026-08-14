export function getApiBaseUrl(resource) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${resource}/`
  }

  return `http://localhost:8000/api/${resource}/`
}

export function normalizeResourceData(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  if (Array.isArray(payload?.records)) {
    return payload.records
  }

  return []
}

export async function fetchResource(resource) {
  const url = getApiBaseUrl(resource)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed for ${resource}: ${response.status}`)
  }

  return response.json()
}
