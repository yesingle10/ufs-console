<template>
  <div class="space-y-4" :key="refreshKey">
    <!-- Tabs -->
    <div class="flex gap-1 bg-slate-900 rounded-lg p-1 w-fit border border-slate-800">
      <button v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        :class="['px-4 py-2 text-sm rounded-md transition', activeTab === tab.key ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200']">
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 1: 预签名上传 -->
    <div v-if="activeTab === 'presign'" class="space-y-4">
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
        <h3 class="text-sm font-medium text-green-400 mb-3">预签名成功</h3>
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

    <!-- Tab 2: 对象浏览 -->
    <div v-if="activeTab === 'browse'" class="space-y-4">
      <div class="flex flex-wrap gap-3 items-center">
        <select v-model="browseBucket" class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">选择 Bucket</option>
          <option v-for="b in buckets" :key="b.name" :value="b.name">{{ b.name }}</option>
        </select>
        <input v-model="browsePrefix" type="text" placeholder="前缀筛选 (可选)" 
          class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-48" />
        <button @click="loadObjects" :disabled="!browseBucket || objLoading"
          class="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm rounded-lg transition">
          {{ objLoading ? '加载中...' : '查询' }}
        </button>
        <span v-if="objTotal > 0" class="text-xs text-slate-500 ml-2">共 {{ objTotal }} 条</span>
      </div>

      <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-800 text-slate-400 text-xs">
              <th class="text-left py-3 px-4 font-medium">Object Key</th>
              <th class="text-left py-3 px-4 font-medium">文件名</th>
              <th class="text-left py-3 px-4 font-medium">大小</th>
              <th class="text-left py-3 px-4 font-medium">类型</th>
              <th class="text-left py-3 px-4 font-medium">状态</th>
              <th class="text-left py-3 px-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in objList" :key="o.fileId" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
              <td class="py-3 px-4 font-mono text-xs text-slate-300 max-w-xs truncate" :title="o.objectKey">{{ o.objectKey }}</td>
              <td class="py-3 px-4 text-slate-200">{{ o.fileName }}</td>
              <td class="py-3 px-4 text-slate-400">{{ formatBytes(o.fileSize) }}</td>
              <td class="py-3 px-4 text-slate-500 text-xs">{{ o.contentType || '-' }}</td>
              <td class="py-3 px-4">
                <span :class="o.status === 1 ? 'text-green-400' : 'text-red-400'" class="text-xs">{{ o.status === 1 ? '正常' : '已删除' }}</span>
              </td>
              <td class="py-3 px-4">
                <button @click="deleteObj(o.objectKey)" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-950/50 transition">删除</button>
              </td>
            </tr>
            <tr v-if="objList.length === 0 && !objLoading">
              <td colspan="6" class="py-8 text-center text-slate-500">选择 Bucket 后点击查询</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="objHasMore" class="flex justify-center">
        <button @click="loadMoreObjects" :disabled="objLoading"
          class="px-4 py-2 text-sm text-brand-400 hover:text-brand-300 disabled:opacity-50">加载更多 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { doPresign, listObjects, deleteObject } from '../api/objects.js'
import { listBuckets } from '../api/buckets.js'
import { useToast } from '../composables/useToast'
import { formatTime, formatBytes } from '../utils/format.js'

const props = defineProps({ refreshKey: Number })
const { show: showToast } = useToast()

const tabs = [
  { key: 'presign', label: '预签名上传' },
  { key: 'browse', label: '对象浏览' },
]
const activeTab = ref('presign')

// Presign
const buckets = ref([])
const form = reactive({ bucket: '', objectKey: '', fileName: '', fileSize: null, bizType: '', partCount: 0 })
const result = ref(null)
const presignError = ref('')
const presignLoading = ref(false)

async function presign() {
  presignLoading.value = true; presignError.value = ''; result.value = null
  try {
    const body = { bucket: form.bucket, objectKey: form.objectKey, fileName: form.fileName, fileSize: form.fileSize, bizType: form.bizType, method: 'PUT', expiresIn: 3600 }
    if (form.partCount > 0) body.partCount = form.partCount
    result.value = await doPresign(body)
    showToast('预签名 URL 生成成功')
  } catch (e) { presignError.value = e.message } finally { presignLoading.value = false }
}

// Browse
const browseBucket = ref('')
const browsePrefix = ref('')
const objList = ref([])
const objCursor = ref(null)
const objHasMore = ref(false)
const objTotal = ref(0)
const objLoading = ref(false)

async function loadObjects() {
  objLoading.value = true; objCursor.value = null
  try {
    const params = { limit: 20 }
    if (browseBucket.value) params.bucket = browseBucket.value
    if (browsePrefix.value) params.prefix = browsePrefix.value
    const data = await listObjects(params)
    objList.value = data.list || []
    objHasMore.value = data.hasMore || false
    objCursor.value = data.nextCursor || null
    objTotal.value = data.list ? data.list.length : 0
  } catch (e) { showToast(e.message, 'error') } finally { objLoading.value = false }
}

async function loadMoreObjects() {
  if (!objCursor.value) return
  objLoading.value = true
  try {
    const params = { limit: 20, cursor: objCursor.value }
    if (browseBucket.value) params.bucket = browseBucket.value
    if (browsePrefix.value) params.prefix = browsePrefix.value
    const data = await listObjects(params)
    objList.value.push(...(data.list || []))
    objHasMore.value = data.hasMore || false
    objCursor.value = data.nextCursor || null
  } catch (e) { showToast(e.message, 'error') } finally { objLoading.value = false }
}

async function deleteObj(objectKey) {
  if (!confirm('确认删除 ' + objectKey + '？')) return
  try {
    await deleteObject(objectKey)
    showToast('已删除')
    loadObjects()
  } catch (e) { showToast(e.message, 'error') }
}

onMounted(async () => {
  try { buckets.value = (await listBuckets()) || [] } catch (_) {}
})
</script>
