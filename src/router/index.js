import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: '监控大盘', icon: '📊' },
  },
  {
    path: '/buckets',
    name: 'Buckets',
    component: () => import('../views/BucketsView.vue'),
    meta: { title: '存储桶', icon: '🪣' },
  },
  {
    path: '/objects',
    name: 'Objects',
    component: () => import('../views/ObjectsView.vue'),
    meta: { title: '对象上传', icon: '📁' },
  },
  {
    path: '/policies',
    name: 'Policies',
    component: () => import('../views/PoliciesView.vue'),
    meta: { title: '存储策略', icon: '📋' },
  },
  {
    path: '/audit',
    name: 'Audit',
    component: () => import('../views/AuditView.vue'),
    meta: { title: '审计日志', icon: '📜' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value && to.name !== 'Login') {
    return next()
  }
  next()
})

export default router
