import { api } from './index.js'

export function getMonitor() { return api('GET', '/monitor') }
export function getAudit(page, pageSize) {
  return api('GET', `/audit?page=${page}&pageSize=${pageSize}`)
}
