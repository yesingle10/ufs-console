<template>
  <div class="flex h-screen overflow-hidden bg-slate-950">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <header class="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <h2 class="text-lg font-semibold text-white">{{ pageTitle }}</h2>
        <div class="flex items-center gap-3">
          <button @click="refreshKey++" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition" title="刷新">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
          <span class="text-xs text-slate-500">API: localhost:8080</span>
        </div>
      </header>
      <div class="p-6">
        <router-view :refreshKey="refreshKey" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'

const route = useRoute()
const refreshKey = ref(0)

const pageTitle = computed(() => {
  return route.meta?.title || 'UFS Console'
})

provide('refreshKey', refreshKey)
</script>
