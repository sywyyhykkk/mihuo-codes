import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import wsCache from '@/cache'
const imConfig = {
  VERSION: '2.0',
  CamelCase: 'false'
}
// 默认超时设置
const imrequest: AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: '',
})

//http request 拦截器
imrequest.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 设置参数格式
    const token = wsCache.get('imToken');
    const imUser = wsCache.get('imUserInfo');
    config.baseURL = imUser.baseUrl;
    config.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'api-version': imConfig.VERSION,
      'CamelCase': imConfig.CamelCase
    };
    // 添加token到headers
    if (token) {
      config.headers.token = token
    }
    // 鉴权参数设置
    return config;
  },
  (error: AxiosError) => {
    // Do something with request error
    Promise.reject(error)
  }
);
imrequest.interceptors.response.use(
  (response: AxiosResponse) => {
    //一些统一code的返回处理
    if (response.data.status != 0) {

    }
    return Promise.resolve(response.data);
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
);
export default imrequest;