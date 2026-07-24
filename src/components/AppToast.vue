<template>
  <Transition name="fade">
    <div v-if="toast.show" :class="[
      'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-sm',
      toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
    ]">
      {{ toast.msg }}
    </div>
  </Transition>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toast } = useToast()
</script>
