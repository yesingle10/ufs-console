<template>
  <div class="space-y-4" :key="refreshKey">
    <div class="flex justify-between items-center">
      <p class="text-sm text-slate-400">共 {{ buckets.length }} 个存储桶</p>
      <button @click="showModal = true"
        class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm rounded-lg transition flex items-center gap-2">
        <span>+</span> 创建存储桶
      </button>
    </div>

    <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 text-xs">
            <th class="text-left py-3 px-4 font-medium">名称</th>
            <th class="text-left py-3 px-4 font-medium">供应商</th>
            <th class="text-left py-3 px-4 font-medium">区域</th>
            <th class="text-left py-3 px-4 font-medium">ACL</th>
            <th class="text-right py-3 px-4 font-medium">对象数</th>
            <th class="text-right py-3 px-4 font-medium">存储量</th>
            <th class="text-center py-3 px-4 font-medium">版本控制</th>
            <th class="text-center py-3 px-4 font-medium">生命周期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in buckets" :key="b.name" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
            <td class="py-3 px-4 font-medium text-white">{{ b.name }}</td>
            <td class="py-3 px-4">
              <span :class="vendorBadge(b.vendor)">{{ b.vendor?.toUpperCase() }}</span>
            </td>
            <td class="py-3 px-4 text-slate-400">{{ b.region || '-' }}</td>
            <td class="py-3 px-4">
              <span :class="aclBadge(b.acl)">{{ b.acl }}</span>
            </td>
            <td class="py-3 px-4 text-right text-slate-300">{{ b.objectCount ?? 0 }}</td>
            <td class="py-3 px-4 text-right text-slate-300">{{ formatBytes(b.storageBytes) }}</td>
            <td class="py-3 px-4 text-center">
              <span :class="b.versioning ? 'text-green-400' : 'text-slate-600'">{{ b.versioning ? '✓' : '—' }}</span>
            </td>
            <td class="py-3 px-4 text-center text-slate-400">{{ b.lifecycleDays ? b.lifecycleDays + '天' : '-' }}</td>
          </tr>
          <tr v-if="buckets.length === 0 && !loading">
            <td colspan="8" class="py-8 text-center text-slate-500">暂无存储桶</td>
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

    <BucketModal :visible="showModal" @close="showModal = false" @created="onCreated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listBuckets } from '../api/buckets.js'
import { useToast } from '../composables/useToast'
import { formatBytes, vendorBadge, aclBadge } from '../utils/format.js'
import BucketModal from '../components/BucketModal.vue'

const props = defineProps({ refreshKey: Number })
const { show: showToast, showError } = useToast()

const buckets = ref([])
const loading = ref(false)
const showModal = ref(false)

async function load() {
  loading.value = true
  try {
    buckets.value = (await listBuckets()) || []
  } catch (e) {
    showError('加载 Bucket 失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

function onCreated() {
  showModal.value = false
  showToast('Bucket 创建成功')
  load()
}

onMounted(load)
</script>
