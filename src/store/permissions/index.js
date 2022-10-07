import {
  reqMenuList,
  reqRigthsList,
  reqRolesList,
  reqDeleteRigthsRoles,
  reqAllotRights
} from '@/api/permissions';


const state = {
  menuList:[],
  rightsList:[],
  rolesList:[],
};
const mutations = {
  // 保存左侧菜单列表
  SETMENULIST: function(state,menuList){
    state.menuList = menuList;
  },

  // 保存权限列表数据
  GETRIGHTSLIST:function(state,data){
    state.rightsList = data;
  },

  // 保存角色列表数据
  GETROLESLIST: function(state,data){
    state.rolesList = data;
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

  // 请求所有权限列表数据
  getRightsList: async function({commit},type){
    const result = await reqRigthsList(type);
    if(result.meta.status == 200){
      commit('GETRIGHTSLIST',result.data);
      return 'ok';
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 请求角色列表
  getRolesList:async function({commit}){
    const result = await reqRolesList();
    if(result.meta.status == 200){
      commit('GETROLESLIST',result.data);
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 删除角色指定权限
  removeRightsById: async function({commit},idData){
    const result = await reqDeleteRigthsRoles(idData);
    if(result.meta.status == 200){
      return result;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 分配权限
  allotRights:async  function({commit},data){
    const {rolesId,rids} = data;
    const ridData = {rids};
    const result =await reqAllotRights(rolesId,ridData);
    if(result.meta.status == 200){
      return result.meta.msg;
    }else{
      return Promise.reject(result.meata.msg);
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