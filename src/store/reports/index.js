import {reqLineData} from '@/api/reports';


const state = {
  lineData:{},
  option:{
    title: {
      text: '用户来源'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ]
  },
};
const mutations = {
  // 保存折线图数据
  GETLINEDATA: function(state,data){
    state.lineData = Object.assign(state.option,data);
  }
};
const actions = {
  // 获取折线图数据
  getLineData: async function({commit}){
    const result = await reqLineData();
    if(result.meta.status == 200){
      commit('GETLINEDATA',result.data);
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