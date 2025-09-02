import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      props: true
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue')
    }
  ]
})

export default router