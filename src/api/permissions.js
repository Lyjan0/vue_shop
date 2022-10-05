import request from './request';

// 左侧菜单列表
const reqMenuList = () => request({
  url:'menus',
  method: 'GET',
});

export{
  reqMenuList,
}