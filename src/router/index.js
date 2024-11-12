import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AssistantView from '../views/AssistantView.vue'
import AssistantDetail from '@/views/AssistantDetail.vue'
import store from '@/store';
import EstateView from '@/views/EstateView.vue';
import ContractView from '@/views/ContractView.vue';
import CourseView from '@/views/CourseView.vue';
import CourseDetail from '@/views/CourseDetail.vue';
import ContractCreate from '@/views/ContractCreate.vue';
import ChatDetail from '@/views/ChatDetail.vue';
import ContractReview from '@/views/ContractReview.vue';
import NotFound from '@/views/NotFound.vue';
import IntroducingPage from '@/views/IntroducingPage.vue';
import PackageView from '@/views/PackageView.vue';
import UserDetail from '@/views/UserDetail.vue';
import CheckProcessPage from '@/views/checkProcessPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        if (store.getters.isLogin) {
          next('/assistant');
        } else {
          next();
        }
      }
    },
    {
      path: '/assistant',
      name: 'assistant',
      component: AssistantView,
      meta: { requiresAuth: true }
    },
    {
      path: '/assistant/:id',
      name: 'assistantDetail',
      component: AssistantDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat/:id',
      name: 'chatDetail',
      component: ChatDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/contract',
      name: 'contract',
      component: ContractView,
      meta: { requiresAuth: true }
    },
    {
      path: '/contract/review',
      name: 'contractReview',
      component: ContractReview,
      meta: { requiresAuth: true }
    },
    {
      path: '/contract/create',
      name: 'contractCreate',
      component: ContractCreate,
      meta: { requiresAuth: true }
    },
    {
      path: '/estate',
      name: 'estate',
      component: EstateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/course',
      name: 'course',
      component: CourseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/course/:id',
      name: 'courseDetail',
      component: CourseDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/check_process',
      name: 'checkProcess',
      component: CheckProcessPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/introducing_page',
      name: 'introducingPage',
      component: IntroducingPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/package',
      name: 'packageView',
      component: PackageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user_detail',
      name: 'userDetail',
      component: UserDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogin = store.getters.isLogin;
  if (to.meta.requiresAuth && !isLogin) {
    localStorage.setItem('intendedRoute', to.fullPath);
    next('/');
  } else {
    next();
  }
});

export default router
