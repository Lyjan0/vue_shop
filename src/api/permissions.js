import request from './request';
// 权限列表
// 获取所有权限列表
const reqRigthsList = (type) => request({
  url: `rights/${type}`,
  method:'GET'
});

// 左侧菜单列表
const reqMenuList = () => request({
  url:'menus',
  method: 'GET',
});

// 角色列表
// 获取角色列表
const reqRolesList = () => request({
  url:'roles',
  method: 'GET'
});

// 删除角色指定权限
const reqDeleteRigthsRoles = ({rightsId,rolesId}) => {
  return request({
  url:`roles/${rolesId}/rights/${rightsId}`,
  method: 'DELETE'
})
};

// 角色授权
const reqAllotRights = (roleId,data)=> request({
  url: `roles/${roleId}/rights`,
  method: 'POST',
  data
})

export{
  reqRigthsList,
  reqMenuList,
  reqRolesList,
  reqDeleteRigthsRoles,
  reqAllotRights
}