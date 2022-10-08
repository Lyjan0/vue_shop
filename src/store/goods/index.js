import {
  reqCategories,
  reqAddCategories
} from '@/api/goods';


const state = {
  // 商品分类数据列表
  cateList: [],
  total: 0,
  addCateList: []
};
const mutations = {
  GETCATELIST: function(state,data){
    state.cateList = data.result;
    state.total = data.total;
  },
  GETADDCATELIST: function(state,data){
    state.addCateList = data;
  }
};
const actions = {
  // 商品分类数据列表
  getCateList: async function({commit},queryInfo){
    const result = await reqCategories(queryInfo);
    if(result.meta.status == 200){
      if(queryInfo.type == 2){
        commit('GETADDCATELIST',result.data);
      }else{
        // 加载全部分级
        commit('GETCATELIST',result.data);
      }
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },
  // 添加分类
  addCategories: async function({commit},cateForm){
    const result = await reqAddCategories(cateForm);
    if(result.meta.status == 201){
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  }

};
const getters = {};


export default {
  state,
  mutations,
  actions,
  getters
};