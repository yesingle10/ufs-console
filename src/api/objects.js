import { api } from './index.js'

export function doPresign(data) { return api('POST', '/objects/presign', data) }
