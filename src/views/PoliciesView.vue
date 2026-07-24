<template>
  <div class="space-y-4" :key="refreshKey">
    <div class="flex justify-between items-center">
      <p class="text-sm text-slate-400">共 {{ policies.length }} 条存储策略</p>
      <button @click="showModal = true"
        class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg transition flex items-center gap-2">
        <span>+</span> 创建策略
      </button>
    </div>

    <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 text-xs">
            <th class="text-left py-3 px-4 font-medium">策略 ID</th>
            <th class="text-left py-3 px-4 font-medium">业务类型</th>
            <th class="text-left py-3 px-4 font-medium">供应商</th>
            <th class="text-left py-3 px-4 font-medium">Bucket</th>
            <th class="text-right py-3 px-4 font-medium">最大文件</th>
            <th class="text-left py-3 px-4 font-medium">允许类型</th>
            <th class="text-center py-3 px-4 font-medium">生命周期</th>
            <th class="text-center py-3 px-4 font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in policies" :key="p.policyId" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
            <td class="py-3 px-4 font-mono text-xs text-slate-300">{{ p.policyId }}</td>
            <td class="py-3 px-4 text-white font-medium">{{ p.bizType }}</td>
            <td class="py-3 px-4">
              <span :class="vendorBadge(p.provider)">{{ p.provider?.toUpperCase() }}</span>
            </td>
            <td class="py-3 px-4 text-slate-300">{{ p.bucket }}</td>
            <td class="py-3 px-4 text-right text-slate-300">{{ formatBytes(p.maxFileSize) }}</td>
            <td class="py-3 px-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="t in p.allowedTypes" :key="t" class="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{{ t }}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-center text-slate-400">{{ p.lifecycleDays }}天</td>
            <td class="py-3 px-4 text-center">
              <span :class="p.active ? 'text-green-400' : 'text-slate-600'">{{ p.active ? '● 启用' : '○ 停用' }}</span>
            </td>
          </tr>
          <tr v-if="policies.length === 0 && !loading">
            <td colspan="8" class="py-8 text-center text-slate-500">暂无策略，点击右上角创建</td>
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

    <PolicyModal :visible="showModal" :buckets="buckets" @close="showModal = false" @created="onCreated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listPolicies } from '../api/policies.js'
import { listBuckets } from '../api/buckets.js'
import { useToast } from '../composables/useToast'
import { formatBytes, vendorBadge } from '../utils/format.js'
import PolicyModal from '../components/PolicyModal.vue'

const props = defineProps({ refreshKey: Number })
const { show: showToast, showError } = useToast()

const policies = ref([])
const buckets = ref([])
const loading = ref(false)
const showModal = ref(false)

async function load() {
  loading.value = true
  try {
    policies.value = (await listPolicies()) || []
  } catch (e) {
    showError('加载策略失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

async function loadBuckets() {
  try { buckets.value = (await listBuckets()) || [] } catch (_) {}
}

function onCreated() {
  showModal.value = false
  showToast('策略创建成功')
  load()
}

onMounted(() => { load(); loadBuckets() })
</script>
