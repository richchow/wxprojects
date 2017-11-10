import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import CollectDetail from '@/components/CollectDetail'

import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/collect',
      name: 'Collect',
      component: CollectDetail
    },
   {
      path: '/',
      name: 'Index',
      component: Index
    }
  /*   {
      path: '/',
      name: 'Test',
      component: Test
    }*/
  ]
})
