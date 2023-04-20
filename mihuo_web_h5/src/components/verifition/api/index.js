/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

 import { fetch } from '_@/axios-config/axios'
 //获取验证图片  以及token
 export function reqGet(data) {
     console.log(data)
     return  fetch({
         url: "/code",
         data,
         method:"POST"
     })
 }
 
 //滑动或者点选验证
 export function reqCheck(data) {
     return  fetch({
         url: `/code/check?captchaType=${data.captchaType}&pointJson=${encodeURIComponent(data.pointJson)}&token=${data.token}`,
         method: 'post',
         data
     })
 }
 
 
 