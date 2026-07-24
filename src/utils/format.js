/**
 * 格式化字节数为可读字符串
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化时间戳为简短本地时间字符串
 */
export function formatTime(ts) {
  if (!ts) return '-'
  return new Date(ts).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

/**
 * 厂商徽章样式类
 */
export function vendorBadge(vendor) {
  const map = {
    local: 'bg-slate-700 text-slate-300',
    cos: 'bg-indigo-950 text-indigo-400 border border-indigo-900',
    oss: 'bg-orange-950 text-orange-400 border border-orange-900',
    kodo: 'bg-green-950 text-green-400 border border-green-900',
    tos: 'bg-blue-950 text-blue-400 border border-blue-900',
  }
  return 'text-xs px-2 py-0.5 rounded font-medium ' + (map[vendor] || map.local)
}

/**
 * ACL 徽章样式类
 */
export function aclBadge(acl) {
  const map = {
    'private': 'bg-red-950 text-red-400',
    'public-read': 'bg-green-950 text-green-400',
    'public-read-write': 'bg-blue-950 text-blue-400',
  }
  return 'text-xs px-2 py-0.5 rounded ' + (map[acl] || 'bg-slate-800 text-slate-400')
}

/**
 * 审计动作徽章样式类
 */
export function actionBadge(action) {
  if (!action) return 'text-xs text-slate-400'
  const type = action.split('.')[0]
  const map = {
    bucket: 'bg-indigo-950 text-indigo-400',
    object: 'bg-cyan-950 text-cyan-400',
    policy: 'bg-purple-950 text-purple-400',
    auth: 'bg-amber-950 text-amber-400',
  }
  return 'text-xs px-2 py-0.5 rounded font-mono ' + (map[type] || 'bg-slate-800 text-slate-400')
}
