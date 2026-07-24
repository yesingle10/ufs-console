import { ref } from 'vue'

const state = ref({ show: false, msg: '', type: 'success' })
let timer = null

export function useToast() {
  function show(msg, type = 'success') {
    state.value = { show: true, msg, type }
    clearTimeout(timer)
    timer = setTimeout(() => { state.value.show = false }, 3000)
  }

  function showError(msg) { show(msg, 'error') }

  return { toast: state, show, showError }
}
