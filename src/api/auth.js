import { api } from './index.js'

export function doLogin(appKey, appSecret) {
  return fetch('/v1/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appKey, appSecret }),
  }).then(r => r.json()).then(json => {
    if (json.code !== '0000') throw new Error(json.message)
    return json.data.token
  })
}
