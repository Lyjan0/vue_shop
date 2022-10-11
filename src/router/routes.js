
let routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/home',
    name:'Home',
    component: () => import('@/views/Home/index'),
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        name:'Welcome',
        component: () => import('@/views/Home/Welcome/index'),
      },
      {
        path:'/users',
        name:'Users',
        component: () => import('@/views/Home/Users/index'),
      },
      {
        path:'/roles',
        name:'Roles',
        component: () => import('@/views/Home/Roles/index'),
      },
      {
        path:'/rights',
        name:'Rights',
        component: () => import('@/views/Home/Rights/index'),
      },
      {
        path:'/goods',
        name:'Goods',
        component: () => import('@/views/Home/Goods/index'),

      },
      {
        path:'/params',
        name:'Params',
        component: () => import('@/views/Home/Params/index'),
      },
      {
        path:'/categories',
        name:'Categories',
        component: () => import('@/views/Home/Categories/index'),
      },
      {
        path:'/orders',
        name:'Orders',
        component: () => import('@/views/Home/Orders/index'),
      },
      {
        path:'/reports',
        name:'Reports',
        component: () => import('@/views/Home/Reports/index'),
      },
      {
        path:'/goods/add',
        name:'Add',
        component: ()=> import('@/views/Home/Goods/Add/index'),
      }
    ]
  },
  {
    path:'/login',
    name:'Login',
    component:() => import('@/views/Login/index')
  }
]
export default routes;