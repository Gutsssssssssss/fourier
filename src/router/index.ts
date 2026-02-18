import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AnimationPage from '../views/AnimationPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/animation',
    name: 'animation',
    component: AnimationPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

