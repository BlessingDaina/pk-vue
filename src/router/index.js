import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/layout/index'
import login from '@/views/login'
import parkingHome from '@/views/layout/parking/parkingHome'
import parkInfo from '@/views/layout/parking/park-info'
import personalManagement from '@/views/layout/parking/personal-management'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: 'parking/park-info',
          name: 'park-info',
          component: parkInfo
        },
        {
          path: 'parking/personal-management',
          name: 'personal-management',
          component: personalManagement
        }, {
          path: 'parking/parkingHome.php',
          name: 'parkingHome',
          component: parkingHome
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})

// 路由拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
    let token = sessionStorage.getItem('token')
    if (token === null || token === '') {
      console.log(34)
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
