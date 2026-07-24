<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="stat in data" :key="stat.label" class="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-slate-400">{{ stat.label }}</span>
        <span class="text-lg">{{ stat.icon }}</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
      <div class="text-xs mt-1" :class="stat.trend >= 0 ? 'text-green-400' : 'text-red-400'">
        {{ stat.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% vs 上期
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
})
</script>
