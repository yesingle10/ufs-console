import { api } from './index.js'

export function getMonitor() { return api('GET', '/monitor') }

export function getAudit(params) {
  return api('GET', '/audit', null, params)
}

export function getRecycle(limit = 20) {
  return api('GET', '/recycle', null, { limit })
}

export function restoreFile(fileId) {
  return api('POST', '/recycle/restore', { fileId })
}

export function purgeFile(fileId) {
  return api('DELETE', `/recycle/${encodeURIComponent(fileId)}`)
}
