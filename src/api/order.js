import request from '@/api/request';
// 订单数据列表
const reqOrderList = (params) => request({
  url:'orders',
  method: 'GET',
  params
});

// 查询物流信息
const reqProgress = (id)=> request({
  url:`/kuaidi/${id}`,
  method:'GET',
});

export {
  reqOrderList,
  reqProgress
}