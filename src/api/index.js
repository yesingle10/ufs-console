import { getAuthHeaders } from '../composables/useAuth'

const BASE = '/v1'

export async function api(method, path, body) {
  const opts = {
    method,
    headers: getAuthHeaders(),
  }
  if (body) opts.body = JSON.stringify(body)

  const resp = await fetch(BASE + path, opts)
  const json = await resp.json()
  if (json.code !== '0000') throw new Error(json.message || json.code)
  return json.data
}
