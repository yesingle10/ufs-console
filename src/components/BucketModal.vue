<template>
  <Transition name="modal">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-white mb-4">创建存储桶</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Bucket 名称 *</label>
            <input v-model="form.name" type="text" placeholder="my-bucket"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">供应商 *</label>
              <select v-model="form.vendor" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="local">LOCAL</option>
                <option value="cos">COS (腾讯云)</option>
                <option value="oss">OSS (阿里云)</option>
                <option value="kodo">KODO (七牛)</option>
                <option value="tos">TOS (火山)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">区域</label>
              <input v-model="form.region" type="text" placeholder="cn-hangzhou"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">ACL</label>
              <select v-model="form.acl" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="private">private</option>
                <option value="public-read">public-read</option>
                <option value="public-read-write">public-read-write</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">生命周期 (天)</label>
              <input v-model.number="form.lifecycleDays" type="number" placeholder="30"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div v-if="error" class="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">{{ error }}</div>
        </div>
        <div class="flex gap-3 mt-5">
          <button @click="$emit('close')" class="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition">取消</button>
          <button @click="submit" :disabled="loading" class="flex-1 py-2 text-sm bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg transition">
            {{ loading ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'created'])

const form = reactive({ name: '', vendor: 'local', region: 'cn-hangzhou', acl: 'private', lifecycleDays: 30 })
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { createBucket } = await import('../api/buckets.js')
    await createBucket({
      name: form.name,
      vendor: form.vendor,
      region: form.region || undefined,
      acl: form.acl,
      lifecycleDays: form.lifecycleDays || undefined,
    })
    Object.assign(form, { name: '', vendor: 'local', region: 'cn-hangzhou', acl: 'private', lifecycleDays: 30 })
    emit('created')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
