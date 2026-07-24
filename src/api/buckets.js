import { api } from './index.js'

export function listBuckets() { return api('GET', '/buckets') }
export function createBucket(data) { return api('POST', '/buckets', data) }
