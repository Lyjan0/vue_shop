import VueRouter from 'vue-router';
import Vue from 'vue';
import routes from './routes.js';

import store from '@/store';


Vue.use(VueRouter);

let router = new VueRouter({
  routes,
  //滚动行为
  scrollBehavior(){
    return {y:0}
  }
})
router.beforeEach((to,from,next)=>{
  const name = store.state.user.userInfo.name;
  const token = store.state.user.token;
  if(token){
    // token存在，登录过了，不能再去login
    if(to.path == '/login'){
      // 想跳转到login,返回到首页
      next('/');
    }
  }
  next();

})

export default router;
