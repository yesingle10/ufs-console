<template>
  <aside class="w-60 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 h-full">
    <div class="h-14 flex items-center gap-2.5 px-5 border-b border-slate-800">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
        </svg>
      </div>
      <span class="font-bold text-white text-sm">UFS Console</span>
    </div>

    <nav class="flex-1 py-3 space-y-0.5 overflow-y-auto">
      <router-link v-for="item in navItems" :key="item.key" :to="item.route"
        :class="['w-full flex items-center gap-3 px-5 py-2.5 text-sm transition block',
                 isActive(item.key) ? 'bg-brand-600/10 text-brand-400 border-r-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50']">
        <span class="text-base">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>

    <div class="p-3 border-t border-slate-800">
      <div class="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{{ appKey }} · {{ envLabel }}</span>
      </div>
      <button @click="doLogout"
        class="w-full mt-1 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition flex items-center gap-2">
        <span>⏻</span> 退出登录
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { computed } from 'vue'

const route = useRoute()
const { appKey, logout } = useAuth()

const navItems = [
  { key: 'dashboard', label: '监控大盘', icon: '📊', route: '/dashboard' },
  { key: 'buckets',  label: '存储桶',   icon: '🪣', route: '/buckets' },
  { key: 'objects',  label: '对象上传', icon: '📁', route: '/objects' },
  { key: 'policies', label: '存储策略', icon: '📋', route: '/policies' },
  { key: 'audit',    label: '审计日志', icon: '📜', route: '/audit' },
]

const envLabel = computed(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return 'dev-local'
  return 'production'
})

function isActive(key) {
  return route.path.startsWith('/' + key)
}

function doLogout() {
  logout()
  window.location.hash = '#/dashboard'
}
</script>
