import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/layout/index'
import login from '@/views/login'
import parkingHome from '@/views/layout/parking/parkingHome'
import personalManagement from '@/views/layout/components/personalManagement'
import channelManagement from '@/views/layout/components/channelManagement'
import monthlyCar from '@/views/layout/parking/monthlycar'
import parkinfo from '@/views/layout/parking/parkinfo'
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
          path: 'parking/parkinfo.php',
          name: 'parkinfo',
          component: parkinfo
        }, {
          path: 'parking/personal_management.php',
          name: 'personalManagement',
          component: personalManagement
        }, {
          path: 'parking/channel_management.php',
          name: 'channelManagement',
          component: channelManagement
        }, {
          path: 'parking/parkingHome.php',
          name: 'parkingHome',
          component: parkingHome
        }, {
          path: 'parking/monthlycar.php',
          name: 'monthlyCar',
          component: monthlyCar
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
