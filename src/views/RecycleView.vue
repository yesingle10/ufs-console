<template>
  <div class="space-y-4" :key="refreshKey">
    <div class="flex items-center gap-3">
      <span class="text-sm text-slate-400">已删除对象列表</span>
      <button @click="load" :disabled="loading" class="px-3 py-1.5 text-xs text-brand-400 hover:text-brand-300 hover:bg-brand-950/30 rounded transition">
        刷新
      </button>
    </div>

    <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 text-xs">
            <th class="text-left py-3 px-4 font-medium">File ID</th>
            <th class="text-left py-3 px-4 font-medium">文件名</th>
            <th class="text-left py-3 px-4 font-medium">Object Key</th>
            <th class="text-left py-3 px-4 font-medium">大小</th>
            <th class="text-left py-3 px-4 font-medium">类型</th>
            <th class="text-left py-3 px-4 font-medium">删除时间</th>
            <th class="text-left py-3 px-4 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in list" :key="o.fileId" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
            <td class="py-3 px-4 font-mono text-xs text-slate-400 max-w-[120px] truncate" :title="o.fileId">{{ o.fileId?.substring(0, 12) }}</td>
            <td class="py-3 px-4 text-slate-200">{{ o.fileName }}</td>
            <td class="py-3 px-4 font-mono text-xs text-slate-400 max-w-[200px] truncate" :title="o.objectKey">{{ o.objectKey }}</td>
            <td class="py-3 px-4 text-slate-400">{{ formatBytes(o.fileSize) }}</td>
            <td class="py-3 px-4 text-slate-500 text-xs">{{ o.contentType || '-' }}</td>
            <td class="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">{{ formatTime(o.updatedAt || o.createdAt) }}</td>
            <td class="py-3 px-4 flex gap-2">
              <button @click="restore(o.fileId)" :disabled="restoring === o.fileId"
                class="text-xs text-green-400 hover:text-green-300 disabled:opacity-50 px-2 py-1 rounded hover:bg-green-950/30 transition">
                {{ restoring === o.fileId ? '恢复中...' : '恢复' }}
              </button>
              <button @click="purge(o.fileId)" :disabled="purging === o.fileId"
                class="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 px-2 py-1 rounded hover:bg-red-950/30 transition">
                {{ purging === o.fileId ? '清除中...' : '彻底删除' }}
              </button>
            </td>
          </tr>
          <tr v-if="list.length === 0 && !loading">
            <td colspan="7" class="py-10 text-center text-slate-500">回收站为空</td>
          </tr>
        </tbody>
      </table>
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
import { getRecycle, restoreFile, purgeFile } from '../api/monitor.js'
import { useToast } from '../composables/useToast'
import { formatTime, formatBytes } from '../utils/format.js'

const props = defineProps({ refreshKey: Number })
const { show: showToast } = useToast()

const list = ref([])
const loading = ref(false)
const restoring = ref(null)
const purging = ref(null)

async function load() {
  loading.value = true
  try {
    const data = await getRecycle(50)
    list.value = data.list || []
  } catch (e) {
    showToast('加载回收站失败: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}

async function restore(fileId) {
  restoring.value = fileId
  try {
    await restoreFile(fileId)
    showToast('文件已恢复')
    load()
  } catch (e) { showToast(e.message, 'error') } finally { restoring.value = null }
}

async function purge(fileId) {
  if (!confirm('彻底删除后将无法恢复，确认？')) return
  purging.value = fileId
  try {
    await purgeFile(fileId)
    showToast('已彻底删除')
    load()
  } catch (e) { showToast(e.message, 'error') } finally { purging.value = null }
}

onMounted(load)
</script>
