import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js';
import store from '@/store/index.js';
import '@/assets/fonts/iconfont.css';
import 'element-ui/lib/theme-chalk/index.css'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import axios from 'axios';

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// Vue.prototype.$http = axios;

import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Row,
  Col,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui';

import TreeTable from 'vue-table-with-tree-grid';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Step);
Vue.use(Steps);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);

Vue.use(VueQuillEditor);

// 注册时间过滤器
Vue.filter('dateFormat',function(time){
  const dt = new Date(time);
  const yyyy = dt.getFullYear();
  // 不足的用0补充
  const mm = (dt.getMonth() + 1 + '').padStart(2,'0');
  const dd = (dt.getDate() + '').padStart(2,'0');
  const hh = (dt.getHours() + '').padStart(2,'0');
  const m = (dt.getMinutes() + '').padStart(2,'0');
  const ss = (dt.getSeconds() + '').padStart(2,'0');

  return `${yyyy}-${mm}-${dd} ${hh}:${m}:${ss}`
})



Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.component('tree-table',TreeTable);




Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
