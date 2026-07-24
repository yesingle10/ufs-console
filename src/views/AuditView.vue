<template>
  <div class="space-y-4" :key="refreshKey">
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 items-center">
      <input v-model="filterOperator" type="text" placeholder="操作者筛选"
        class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-40" />
      <select v-model="filterAction" class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">全部动作</option>
        <option value="UPLOAD">上传</option>
        <option value="DOWNLOAD">下载</option>
        <option value="DELETE">删除</option>
        <option value="COPY">复制</option>
        <option value="MOVE">移动</option>
        <option value="RESTORE">恢复</option>
        <option value="PURGE">彻底删除</option>
      </select>
      <select v-model="pageSize" @change="resetAndLoad" class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option :value="10">10 条/页</option>
        <option :value="20">20 条/页</option>
        <option :value="50">50 条/页</option>
      </select>
      <button @click="resetAndLoad" :disabled="loading"
        class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm rounded-lg transition">
        {{ loading ? '查询中...' : '查询' }}
      </button>
    </div>

    <!-- Table -->
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
            <td class="py-3 px-4 text-slate-500 text-xs font-mono">{{ a.id?.substring(0, 8) }}</td>
            <td class="py-3 px-4">
              <div class="text-slate-200">{{ a.operatorId }}</div>
              <div class="text-xs text-slate-500">{{ a.operatorType }}</div>
            </td>
            <td class="py-3 px-4">
              <span :class="actionBadge(a.action)">{{ a.action }}</span>
            </td>
            <td class="py-3 px-4 font-mono text-xs text-slate-400 max-w-[120px] truncate">{{ a.fileId || '-' }}</td>
            <td class="py-3 px-4 text-slate-400 text-xs max-w-[200px] truncate">{{ a.objectKey || '-' }}</td>
            <td class="py-3 px-4 text-slate-500 text-xs">{{ a.clientIp || '-' }}</td>
            <td class="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">{{ formatTime(a.createdAt) }}</td>
          </tr>
          <tr v-if="list.length === 0 && !loading">
            <td colspan="7" class="py-10 text-center text-slate-500">暂无审计记录</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4">
      <button @click="page--; load()" :disabled="page <= 1 || loading"
        class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 transition">上一页</button>
      <span class="text-sm text-slate-400">第 {{ page }} 页</span>
      <button @click="page++; load()" :disabled="!hasMore || loading"
        class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 transition">下一页</button>
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
const filterOperator = ref('')
const filterAction = ref('')

async function load() {
  loading.value = true
  try {
    const params = { limit: pageSize.value }
    if (filterOperator.value) params.operatorId = filterOperator.value
    if (filterAction.value) params.action = filterAction.value
    const data = await getAudit(params)
    list.value = data.list || []
    hasMore.value = data.hasMore || false
  } catch (e) {
    showError('加载审计日志失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

function resetAndLoad() {
  page.value = 1
  list.value = []
  load()
}

onMounted(load)
</script>
