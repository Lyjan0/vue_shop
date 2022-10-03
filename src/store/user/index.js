import {reqUserLogin} from '@/api/user.js';
import {setToken,getToken,removeToken} from '@/utils/token';


const state = {
  userInfo:{},
  token: getToken()
};
const mutations = {
  // 存储用户数据
  LOGIN:function(store,data){
    store.userInfo = data;
  }
};
const actions = {
  // 登录请求，获取用户数据和token
   login: async function({commit},data){
    let result = await reqUserLogin(data);
    // console.log(result);

    if(result.meta.status == '200'){
      commit('LOGIN',result.data);
      setToken(result.data.token);
      return 'ok';
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 退出登录
  logout: function(){
    // 清除token
    removeToken();
    return 'ok';
  }
};
const getters = {};


export default {
  state,
  mutations,
  actions,
  getters
};