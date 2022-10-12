import Vuex,{Store} from 'vuex';
import Vue from 'vue';
import user from '@/store/user';
import permissions from '@/store/permissions';
import goods from '@/store/goods';
import order from '@/store/order';
import reports from '@/store/reports';

Vue.use(Vuex);

export default new Store({
  modules:{
    user,
    permissions,
    goods,
    order,
    reports
  }
});