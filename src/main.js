import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js';
import store from '@/store/index.js';
import '@/assets/fonts/iconfont.css';

import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;

import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
} from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// Vue.use(Message);


Vue.prototype.$message = Message;





Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
