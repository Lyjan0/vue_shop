import axios from 'axios';

const requests = axios.create({
  baseURL:'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000,
});

// 请求拦截器
requests.interceptors.request.use((config)=>{
  console.log('正在发请求');
  return config;
});
// 响应拦截器
requests.interceptors.response.use((res)=>{
  console.log('请求结束');
  return res.data;
},(err)=>{
  return Promise.reject(new Error(err));
});


export default requests;