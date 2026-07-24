import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('ufs_token') || '')
const appKey = ref(localStorage.getItem('ufs_appKey') || 'app_demo')
const isLoggedIn = computed(() => !!token.value)

export function useAuth() {
  function setAuth(t, key) {
    token.value = t
    if (key) {
      appKey.value = key
      localStorage.setItem('ufs_appKey', key)
    }
    localStorage.setItem('ufs_token', t)
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('ufs_token')
  }

  return { token, appKey, isLoggedIn, setAuth, logout }
}

export function getAuthHeaders() {
  return {
    'Authorization': 'Bearer ' + token.value,
    'Content-Type': 'application/json',
  }
}
