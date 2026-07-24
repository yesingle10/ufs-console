import { getAuthHeaders } from '../composables/useAuth'

const BASE = '/v1'

export async function api(method, path, body, queryParams) {
  const opts = {
    method,
    headers: getAuthHeaders(),
  }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }

  let url = BASE + path
  if (queryParams) {
    const qs = Object.entries(queryParams)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')
    if (qs) url += '?' + qs
  }

  const resp = await fetch(url, opts)
  const json = await resp.json()
  if (json.code !== '0000') throw new Error(json.message || json.code)
  return json.data
}
