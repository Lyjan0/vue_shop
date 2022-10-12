import {
  reqOrderList,
  reqProgress
} from '@/api/order';


const state = {
  // 订单列表
  orderList: [],
  // 列表总数
  total: 0,
};
const mutations = {
  GETORDERLIST: function(state,data){
    state.orderList = data.goods;
    state.total = data.total;
  }
};
const actions = {
  // 获取订单数据
  getOrderList:async function({commit},params){
    const result = await reqOrderList(params);
    const msg = result.meta.msg;
    if(result.meta.status == 200){
      commit('GETORDERLIST',result.data);
      return msg;
    }else{
      return Promise.reject(msg);
    }
  },
  // 获取物流进度: 访问不了
  // getProgress:async function({commit},id){
  //   const result = await reqProgress(id);
  //   console.log(result);
  // }

};
const getters = {};


export default {
  state,
  mutations,
  actions,
  getters
};