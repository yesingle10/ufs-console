import { api } from './index.js'

export function doPresign(data) { return api('POST', '/objects/presign', data) }

export function listObjects(params) { return api('GET', '/objects', null, params) }

export function headObject(objectKey) { return api('GET', '/objects/head', null, { objectKey }) }

export function deleteObject(objectKey) { return api('DELETE', '/objects', null, { objectKey }) }
