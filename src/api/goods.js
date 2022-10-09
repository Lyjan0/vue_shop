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

// 获取tabs标签页参数列表
const reqTabsPaneList = ({id,params}) => request({
  url:`categories/${id}/attributes`,
  method: 'GET',
  params
});

// 添加动态参数或者静态属性
const reqAddAttributes = ({id,data}) => request({
  url:`categories/${id}/attributes`,
  method: 'POST',
  data
});
// 编辑提交参数
const reqEditAttributes = ({id,attrId,data}) => request({
  url:`categories/${id}/attributes/${attrId}`,
  method:'PUT',
  data
});

// 删除参数
const reqDeleteAttributes = ({id,attrid}) => request({
  url:`categories/${id}/attributes/${attrid}`,
  method:'DELETE',
})
export{
  reqCategories,
  reqAddCategories,
  reqTabsPaneList,
  reqAddAttributes,
  reqEditAttributes,
  reqDeleteAttributes
}