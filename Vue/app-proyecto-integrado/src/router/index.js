import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue')
    },
    {
      path: '/converter',
      name: 'converter',
      component: () => import('../views/ConverterView.vue')
    },
    {
      path: '/password-generator',
      name: 'password-generator',
      component: () => import('../views/PasswordView.vue')
    },
    {
      path: '/surveys',
      name: 'surveys',
      component: () => import('../views/SurveysView.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue')
    }
  ]
})

export default router