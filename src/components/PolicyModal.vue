<template>
  <Transition name="modal">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-white mb-4">创建存储策略</h3>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">业务类型 *</label>
              <input v-model="form.bizType" type="text" placeholder="avatar"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">供应商</label>
              <select v-model="form.provider" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="local">LOCAL</option>
                <option value="cos">COS</option>
                <option value="oss">OSS</option>
                <option value="kodo">KODO</option>
                <option value="tos">TOS</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Bucket *</label>
            <select v-model="form.bucket" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">选择 Bucket</option>
              <option v-for="b in buckets" :key="b.name" :value="b.name">{{ b.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">最大文件 (MB)</label>
              <input v-model.number="form.maxFileSizeMB" type="number" placeholder="10"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">生命周期 (天)</label>
              <input v-model.number="form.lifecycleDays" type="number" placeholder="30"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">允许类型 (逗号分隔)</label>
            <input v-model="form.allowedTypesStr" type="text" placeholder="image/png, image/jpeg"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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

defineProps({ visible: Boolean, buckets: { type: Array, default: () => [] } })
const emit = defineEmits(['close', 'created'])

const form = reactive({ bizType: '', provider: 'local', bucket: '', maxFileSizeMB: 10, lifecycleDays: 30, allowedTypesStr: 'image/png, image/jpeg' })
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { createPolicy } = await import('../api/policies.js')
    const types = form.allowedTypesStr.split(',').map(s => s.trim()).filter(Boolean)
    await createPolicy({
      bizType: form.bizType,
      provider: form.provider,
      bucket: form.bucket,
      maxFileSize: form.maxFileSizeMB * 1024 * 1024,
      lifecycleDays: form.lifecycleDays || undefined,
      allowedTypes: types,
    })
    Object.assign(form, { bizType: '', provider: 'local', bucket: '', maxFileSizeMB: 10, lifecycleDays: 30, allowedTypesStr: 'image/png, image/jpeg' })
    emit('created')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
