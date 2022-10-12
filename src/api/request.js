import axios from 'axios';
import {getToken} from '@/utils/token';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

const requests = axios.create({
  baseURL:'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000,
});

// 请求拦截器
requests.interceptors.request.use((config)=>{
  nprogress.start();
  config.headers.Authorization = getToken();
  return config;
});
// 响应拦截器
requests.interceptors.response.use((res)=>{
  nprogress.done();
  return res.data;
},(err)=>{
  return Promise.reject(new Error(err));
});


export default requests;