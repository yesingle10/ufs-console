<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h3 class="text-sm font-medium text-slate-300 mb-4">延迟趋势 (ms)</h3>
        <div style="position:relative;height:200px;"><canvas ref="latencyRef"></canvas></div>
      </div>
      <div class="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h3 class="text-sm font-medium text-slate-300 mb-4">请求 QPS</h3>
        <div style="position:relative;height:200px;"><canvas ref="qpsRef"></canvas></div>
      </div>
    </div>
    <div class="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <h3 class="text-sm font-medium text-slate-300 mb-4">月度存储用量</h3>
      <div style="position:relative;height:150px;"><canvas ref="usageRef"></canvas></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({ data: Object })

const latencyRef = ref(null)
const qpsRef = ref(null)
const usageRef = ref(null)

let latencyChart = null
let qpsChart = null
let usageChart = null

function destroyCharts() {
  latencyChart?.destroy()
  qpsChart?.destroy()
  usageChart?.destroy()
}

function render() {
  if (!props.data) return
  destroyCharts()

  const textColor = '#94a3b8'
  const gridColor = '#1e293b'

  // Latency
  const lat = props.data.latency || []
  const latLabels = lat.map(d => new Date(d.ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
  latencyChart = new Chart(latencyRef.value, {
    type: 'line',
    data: {
      labels: latLabels,
      datasets: [
        { label: 'P50', data: lat.map(d => d.p50), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.3, pointRadius: 0 },
        { label: 'P95', data: lat.map(d => d.p95), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.3, pointRadius: 0 },
        { label: 'P99', data: lat.map(d => d.p99), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.3, pointRadius: 0 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } }
      }
    }
  })

  // QPS
  const req = props.data.requests || []
  const reqLabels = req.map(d => new Date(d.ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
  qpsChart = new Chart(qpsRef.value, {
    type: 'line',
    data: {
      labels: reqLabels,
      datasets: [
        { label: 'QPS', data: req.map(d => d.qps), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.3, pointRadius: 0, yAxisID: 'y' },
        { label: '错误率%', data: req.map(d => (d.errorRatio * 100).toFixed(2)), borderColor: '#ef4444', tension: 0.3, pointRadius: 0, yAxisID: 'y1' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: gridColor } },
        y: { position: 'left', ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
        y1: { position: 'right', ticks: { color: textColor, font: { size: 10 } }, grid: { drawOnChartArea: false } }
      }
    }
  })

  // Usage
  const usage = props.data.usage || []
  usageChart = new Chart(usageRef.value, {
    type: 'bar',
    data: {
      labels: usage.map(d => d.month),
      datasets: [{
        label: '存储量 (GB)',
        data: usage.map(d => (d.totalBytes / 1024 / 1024 / 1024).toFixed(2)),
        backgroundColor: 'rgba(99,102,241,0.5)',
        borderColor: '#6366f1',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  })
}

watch(() => props.data, render, { deep: true })

onBeforeUnmount(destroyCharts)
</script>
