import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js';
import store from '@/store/index.js';

import {Button} from 'element-ui';
Vue.component(Button.name,Button);



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
