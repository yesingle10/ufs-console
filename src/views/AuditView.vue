<template>
  <div class="space-y-4" :key="refreshKey">
    <div class="flex items-center gap-3">
      <input v-model.number="page" type="number" min="1" @change="load"
        class="w-20 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      <span class="text-sm text-slate-400">页 / 每页</span>
      <input v-model.number="pageSize" type="number" min="1" max="100" @change="load"
        class="w-20 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      <span class="text-sm text-slate-400">条</span>
    </div>

    <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 text-xs">
            <th class="text-left py-3 px-4 font-medium">ID</th>
            <th class="text-left py-3 px-4 font-medium">操作者</th>
            <th class="text-left py-3 px-4 font-medium">动作</th>
            <th class="text-left py-3 px-4 font-medium">资源 ID</th>
            <th class="text-left py-3 px-4 font-medium">Object Key</th>
            <th class="text-left py-3 px-4 font-medium">IP</th>
            <th class="text-left py-3 px-4 font-medium">时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in list" :key="a.id" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
            <td class="py-3 px-4 text-slate-500">{{ a.id }}</td>
            <td class="py-3 px-4">
              <div class="text-slate-200">{{ a.operatorId }}</div>
              <div class="text-xs text-slate-500">{{ a.operatorType }}</div>
            </td>
            <td class="py-3 px-4">
              <span :class="actionBadge(a.action)">{{ a.action }}</span>
            </td>
            <td class="py-3 px-4 font-mono text-xs text-slate-400">{{ a.fileId || '-' }}</td>
            <td class="py-3 px-4 text-slate-400">{{ a.objectKey || '-' }}</td>
            <td class="py-3 px-4 text-slate-500 text-xs">{{ a.clientIp || '-' }}</td>
            <td class="py-3 px-4 text-slate-400 text-xs">{{ formatTime(a.createdAt) }}</td>
          </tr>
          <tr v-if="list.length === 0 && !loading">
            <td colspan="7" class="py-8 text-center text-slate-500">暂无审计记录</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasMore" class="flex justify-center">
      <button @click="page++; load()" class="px-4 py-2 text-sm text-brand-400 hover:text-brand-300">加载更多 →</button>
    </div>

    <div v-if="loading" class="text-center text-slate-500 py-8">
      <svg class="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      加载中...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAudit } from '../api/monitor.js'
import { useToast } from '../composables/useToast'
import { formatTime, actionBadge } from '../utils/format.js'

const props = defineProps({ refreshKey: Number })
const { showError } = useToast()

const list = ref([])
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(false)
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const data = await getAudit(page.value, pageSize.value)
    list.value = data.list || []
    hasMore.value = data.hasMore || false
  } catch (e) {
    showError('加载审计日志失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
