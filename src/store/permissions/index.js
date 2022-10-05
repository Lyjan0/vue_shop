import {reqMenuList} from '@/api/permissions';


const state = {
  menuList:[],
};
const mutations = {
  // 保存左侧菜单列表
  SETMENULIST: function(state,menuList){
    state.menuList = menuList;
  }
};
const actions = {
  // 请求左侧菜单列表
  reqMenuList: async function({commit}){
    let result = await reqMenuList();
    if(result.meta.status == 200){
      commit('SETMENULIST',result.data);
    }else{
      return  Promise.reject(new Error(result.meta.msg));
    }
  },
  
};
const getters = {};


export default {
  state,
  mutations,
  actions,
  getters
};