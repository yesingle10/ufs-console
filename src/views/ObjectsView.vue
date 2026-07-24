<template>
  <div class="space-y-4" :key="refreshKey">
    <div class="bg-slate-900 rounded-xl p-6 border border-slate-800 max-w-2xl">
      <h3 class="text-sm font-medium text-slate-300 mb-4">预签名上传</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Bucket *</label>
            <select v-model="form.bucket" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">选择 Bucket</option>
              <option v-for="b in buckets" :key="b.name" :value="b.name">{{ b.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">文件名 *</label>
            <input v-model="form.fileName" type="text" placeholder="photo.jpg"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Object Key *</label>
            <input v-model="form.objectKey" type="text" placeholder="test/photo.jpg"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">文件大小 (bytes) *</label>
            <input v-model.number="form.fileSize" type="number" placeholder="102400"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">业务类型 *</label>
            <input v-model="form.bizType" type="text" placeholder="avatar"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">分片数 (0=简单上传)</label>
            <input v-model.number="form.partCount" type="number" placeholder="0"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <button @click="presign" :disabled="presignLoading"
          class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm rounded-lg transition">
          {{ presignLoading ? '生成中...' : '生成预签名 URL' }}
        </button>
      </div>
    </div>

    <div v-if="result" class="bg-slate-900 rounded-xl p-5 border border-slate-800 max-w-2xl">
      <h3 class="text-sm font-medium text-green-400 mb-3">✓ 预签名成功</h3>
      <div class="space-y-2 text-sm">
        <div class="flex gap-2"><span class="text-slate-400 w-20">File ID:</span><span class="text-slate-200 font-mono">{{ result.fileId }}</span></div>
        <div class="flex gap-2"><span class="text-slate-400 w-20">Method:</span><span class="text-slate-200">{{ result.method }}</span></div>
        <div class="flex gap-2"><span class="text-slate-400 w-20">过期时间:</span><span class="text-slate-200">{{ formatTime(result.expiresAt) }}</span></div>
        <div class="flex gap-2"><span class="text-slate-400 w-20 shrink-0">URL:</span>
          <div class="flex-1 min-w-0">
            <code class="text-xs text-brand-400 break-all bg-slate-800 px-2 py-1 rounded block">{{ result.url }}</code>
          </div>
        </div>
      </div>
    </div>

    <div v-if="presignError" class="bg-red-950/50 rounded-xl p-4 border border-red-900 text-red-400 text-sm max-w-2xl">
      {{ presignError }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { doPresign } from '../api/objects.js'
import { listBuckets } from '../api/buckets.js'
import { useToast } from '../composables/useToast'
import { formatTime } from '../utils/format.js'

const props = defineProps({ refreshKey: Number })
const { show: showToast } = useToast()

const buckets = ref([])
const form = reactive({ bucket: '', objectKey: '', fileName: '', fileSize: null, bizType: '', partCount: 0 })
const result = ref(null)
const presignError = ref('')
const presignLoading = ref(false)

async function presign() {
  presignLoading.value = true
  presignError.value = ''
  result.value = null
  try {
    const body = { bucket: form.bucket, objectKey: form.objectKey, fileName: form.fileName, fileSize: form.fileSize, bizType: form.bizType, method: 'PUT', expiresIn: 3600 }
    if (form.partCount > 0) body.partCount = form.partCount
    result.value = await doPresign(body)
    showToast('预签名 URL 生成成功')
  } catch (e) {
    presignError.value = e.message
  } finally {
    presignLoading.value = false
  }
}

onMounted(async () => {
  try { buckets.value = (await listBuckets()) || [] } catch (_) {}
})
</script>
