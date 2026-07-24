<template>
  <div class="space-y-6" :key="refreshKey">
    <StatCards :data="stats" />
    <MonitorCharts v-if="monitorData" :data="monitorData" />
    <div v-if="loading" class="text-center text-slate-500 py-8">
      <svg class="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      加载监控数据...
    </div>
    <div v-if="error" class="bg-red-950/50 rounded-xl p-4 border border-red-900 text-red-400 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMonitor } from '../api/monitor.js'
import StatCards from '../components/StatCards.vue'
import MonitorCharts from '../components/MonitorCharts.vue'
import { useToast } from '../composables/useToast'

const props = defineProps({ refreshKey: Number })
const { showError } = useToast()

const monitorData = ref(null)
const loading = ref(false)
const error = ref('')

const stats = computed(() => {
  if (!monitorData.value) return [
    { label: 'Bucket 数量', value: '—', trend: 0, icon: '🪣' },
    { label: '当前 QPS', value: '—', trend: 0, icon: '⚡' },
    { label: 'P95 延迟', value: '—', trend: 0, icon: '⏱' },
    { label: '错误率', value: '—', trend: 0, icon: '⚠' },
  ]
  const req = monitorData.value.requests || []
  const lat = monitorData.value.latency || []
  const lastReq = req[req.length - 1] || {}
  const lastLat = lat[lat.length - 1] || {}
  return [
    { label: 'Bucket 数量', value: '—', trend: 0, icon: '🪣' },
    { label: '当前 QPS', value: lastReq.qps || 0, trend: 2.3, icon: '⚡' },
    { label: 'P95 延迟', value: (lastLat.p95 || 0) + 'ms', trend: -5.1, icon: '⏱' },
    { label: '错误率', value: ((lastReq.errorRatio || 0) * 100).toFixed(2) + '%', trend: -0.3, icon: '⚠' },
  ]
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    monitorData.value = await getMonitor()
  } catch (e) {
    error.value = e.message
    showError('加载监控数据失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
