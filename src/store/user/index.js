import {
  reqUserLogin,
  reqUserList,
  reqUserState,
  addUser,
  reqEditUser,
  reqDeleteUser
} from '@/api/user.js';
import {setToken,getToken,removeToken} from '@/utils/token';


const state = {
  // 当前登录用户的信息
  userInfo:{},

  token: getToken(),

  // 用户列表数据
  userList:[],
  // 用户总数
  total: 0,


};
const mutations = {
  // 存储用户数据
  LOGIN:function(store,data){
    store.userInfo = data;
    store.token = data.token;
  },

  // 退出登录，清除用户数据
  CLEARUSERINFO: function(store){
    removeToken();
    store.userInfo = {};
    store.token = '';
  },

  // 存储用户列表数据
  GETUSERLIST: function(state,data){
    state.userList = data.users;
    state.total = data.total;
  }
};
const actions = {
  // 登录请求，获取用户信息和token
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

  // 获取用户数据列表
  getUserList: async function({commit},data){
    let result = await reqUserList(data);
    // console.log(result);
    if(result.meta.status == 200){
      commit('GETUSERLIST',result.data);
      return 'ok'
    }else{
      console.log(result.meta.msg);
      return Promise.reject(result.meta.msg);
    }
  },

  // 修改用户状态
  changeUserState: async function({commit},{id,mg_state}){
    let result = await reqUserState(id,mg_state);
    if(result.meta.status == 200){
      return result.meta.msg;
    }else{
      return  Promise.reject(result.meta.msg);
    }
  },

  // 添加用户
  addUsers: async function({commit},data){
    let result =await  addUser(data);
    if(result.meta.status == 201){
      return 'ok'
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 编辑用户信息
  editUser: async function({commit},data){
    let result = await reqEditUser(data);
    if(result.meta.status == 200){
      return 'ok';
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 删除用户
  deleteUser: async function({commit},id){
    const result = await reqDeleteUser(id);
    if(result.meta.status == 200){
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  }



};
const getters = {

};


export default {
  state,
  mutations,
  actions,
  getters
};