
// let baseUrl = "https://captcha.anji-plus.com/captcha-api"
import baseConfig from '@/config/common.js';
let baseUrl = baseConfig.apiUrl.substring(0,baseConfig.apiUrl.length-1);

export const myRequest = (option={})=>{
	return new Promise((reslove,reject)=>{
		uni.request({
			url: baseUrl + option.url, 
			data :option.data,
			method:option.method || "GET",
			success: (result) => {
				reslove(result)
			},
			fail:(error)=>{
				reject(error)
			}
		})
	})
}
