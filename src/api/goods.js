import request from '@/api/request.js';
// 商品分类数据列表
const reqCategories = (data) => request({
  url: 'categories',
  method: 'GET',
  params:data
});


// 添加分类
const reqAddCategories = (data) => request({
  url: 'categories',
  method: 'POST',
  data
});

export{
  reqCategories,
  reqAddCategories
}