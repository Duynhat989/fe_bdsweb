import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AssistantView from '../views/AssistantView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/assistant',
      name: 'assistant',
      component: AssistantView,
      meta: { requiresAuth: true } 
    }
  ]
})

export default router
