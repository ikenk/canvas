import { createRouter, createWebHistory, RouterOptions, Router, RouteRecordRaw } from 'vue-router'


//静态路由
const constRoutes:RouteRecordRaw[] = [
  {
    path:"/",
    redirect:"/canvas",
  },
  {
    path:"/canvas",
    name:"canvas",
    component:() => import("@/views/canvas.vue")
  },
  {
    path:"/canvas/explosionparticles",
    name:"explosionparticles",
    component: () => import("@/views/canvas_explosionparticles.vue")
  },
  {
    path:"/canvas/followmouse",
    name:"followmouse",
    component: () => import("@/views/canvas_followmouse.vue")
  },
  {
    path:"/canvas/particleclock",
    name:"particleclock",
    component: () => import("@/views/canvas_particleclock.vue")
  },
  {
    path:"/canvas/randomparticles",
    name:"randomparticles",
    component: () => import("@/views/canvas_randomparticles.vue")
  },
]

const router:Router = createRouter({
  history: createWebHistory(),
  routes: constRoutes,
});

export default router