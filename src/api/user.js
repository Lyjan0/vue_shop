import request from './request';

// 登录
const reqUserLogin = (data) => request({
  url:'login',
  method: 'POST',
  data
});

// 用户数据列表
const reqUserList = (data) => request({
  url:'users',
  method: 'GET',
  params: data
});

// 修改用户状态
const reqUserState = (id,type) => request({
  url: `users/${id}/state/${type}`,
  method: 'PUT'
});

// 添加用户
const addUser = (data) => request({
  url:'users',
  method: 'POST',
  data
});

// 编辑用户信息
const reqEditUser = (userInfo) => request({
  url:`users/${userInfo.id}`,
  method: 'PUT',
  data:{
    email: userInfo.email,
    mobile: userInfo.mobile,
  }
});

// 删除单个用户
const reqDeleteUser = (id) => request({
  url:`users/${id}`,
  method: 'DELETE'
});

export {
  reqUserLogin,
  reqUserList,
  reqUserState,
  addUser,
  reqEditUser,
  reqDeleteUser
}

