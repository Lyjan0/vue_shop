import {
  reqCategories,
  reqAddCategories,
  reqTabsPaneList,
  reqAddAttributes,
  reqEditAttributes,
  reqDeleteAttributes
} from '@/api/goods';


const state = {
  // 商品分类数据列表
  cateList: [],
  total: 0,
  addCateList: [],
  // 参数列表
  tabsPaneList: [],
};
const mutations = {
  // 分类列表
  GETCATELIST: function(state,data){
    state.cateList = data.result;
    state.total = data.total;
  },
  // 分类列表
  GETADDCATELIST: function(state,data){
    state.addCateList = data;
  },
  // 参数列表
  GETTABSPANELIST: function(state,data){
    if(data.length>0){
      data.forEach((item)=>{
        item.attr_vals =  item.attr_vals ? item.attr_vals.split(' '): [];
        // 为每个参数加上tag中：添加input和btn切换的标签，以及输入框输入的值
        item.inputVisible = false;
        item.inputValue = '';
      })
    }

    state.tabsPaneList = data;
  }
};
const actions = {
  // 商品分类数据列表
  getCateList: async function({commit},queryInfo){
    const result = await reqCategories(queryInfo);
    if(result.meta.status == 200){
      if(queryInfo.type == 2 || !queryInfo.type){
        commit('GETADDCATELIST',result.data);
      }else{
        // 加载全部分级
        console.log(result);
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
  },
  // 参数列表
  getTabsPaneList: async function({commit},data){
    const result = await reqTabsPaneList(data);
    if(result.meta.status == 200){
      commit('GETTABSPANELIST',result.data);
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 添加动态参数或者静态属性
  addAttributes: async function({commit},data){
    const result = await reqAddAttributes(data);
    if(result.meta.status == 201){
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },

  // 编辑提交参数
  subitEditAttributes: async function({commit},data){
    const result = await reqEditAttributes(data);
    if(result.meta.status == 200){
      return result.meta.msg;
    }else{
      return Promise.reject(result.meta.msg);
    }
  },
  // 删除参数
  deleteAttributes:async function({commit},data){
    const result = await reqDeleteAttributes(data);
    if(result.meta.status == 200){
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