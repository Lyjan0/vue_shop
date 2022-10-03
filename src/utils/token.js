// 本地存储token
const setToken = (token)=>{
  window.localStorage.setItem('TOKEN',token);
};
const getToken = ()=>{
  return window.localStorage.getItem('TOKEN');
};
const removeToken = ()=>{
  window.localStorage.removeItem('TOKEN');
};

export{
  setToken,
  getToken,
  removeToken
}

