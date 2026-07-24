<template>
  <component :is="isLoggedIn ? 'MainLayout' : 'LoginView'" />
  <AppToast />
</template>

<script setup>
import { computed } from 'vue'
import LoginView from './views/LoginView.vue'
import MainLayout from './views/MainLayout.vue'
import AppToast from './components/AppToast.vue'
import { useAuth } from './composables/useAuth'

const { isLoggedIn } = useAuth()
</script>
