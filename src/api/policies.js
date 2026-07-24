import { api } from './index.js'

export function listPolicies() { return api('GET', '/policies') }
export function createPolicy(data) { return api('POST', '/policies', data) }
