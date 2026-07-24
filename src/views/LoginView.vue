<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 mb-4 shadow-lg shadow-brand-600/30">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">UFS Console</h1>
        <p class="text-slate-400 mt-1 text-sm">统一文件服务管理平台</p>
      </div>
      <div class="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">App Key</label>
            <input v-model="form.appKey" type="text" @keyup.enter="login"
              class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="app_demo" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">App Secret</label>
            <input v-model="form.appSecret" type="password" @keyup.enter="login"
              class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="secret_demo" />
          </div>
          <div v-if="errorMsg" class="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg px-4 py-2">
            {{ errorMsg }}
          </div>
          <button @click="login" :disabled="loading"
            class="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center justify-center gap-2">
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
        <p class="text-center text-xs text-slate-500 mt-4">dev-local 模式 / 默认凭据已填入</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { doLogin } from '../api/auth.js'
import { useAuth } from '../composables/useAuth'

const { setAuth } = useAuth()

const form = reactive({ appKey: 'app_demo', appSecret: 'secret_demo' })
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  loading.value = true
  errorMsg.value = ''
  try {
    const token = await doLogin(form.appKey, form.appSecret)
    setAuth(token, form.appKey)
    window.location.hash = '#/dashboard'
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
