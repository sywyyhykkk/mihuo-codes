import axios from 'axios';

// 默认超时设置
const request=axios.create({
    timeout:5000,
    baseURL:'https://imapibeta.erpstrong.com/',
})
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJZCI6IjE5ODE4ODM3MjI1NTQxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiSW1fVXNlciIsIlVzZXJJZCI6IjIwNjE2MTg2Njc1MjY5IiwiZXhwIjoxNjMwMzEwOTQ3LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxIiwiYXVkIjoiWFNvZnQuSU0ifQ.6TnsdlYPlzSl6WurK6X_qnJtnjvcrFVLd5T4JgAj1go';
//http request 拦截器
request.interceptors.request.use(
    config => {
        // 设置参数格式
            config.headers = {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            };
        // 添加token到headers
        if(token){
            config.headers.token = token
        }
        // 鉴权参数设置
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
request.interceptors.response.use(
    response => {
        //一些统一code的返回处理
        if(response.data.status != 0){

        }
        return response.data;
    },
    error => {
        return Promise.reject(error)
    }
);
export default request;
