'use strict';
exports.main = async (event) => {
	let body = event.body
	  if(event.isBase64Encoded) {
	    body = Buffer.from(body,'base64')
	  }
	  const {
	    access_token,
	    openid
	  } = JSON.parse(body)
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__183C0D4',
		provider: 'univerify',
		apiKey: '5c361a38baabafc09a25705b630e9d7a', 
		apiSecret: 'e3c2e31268801cf5060cab3301c6ecb1',
		access_token: access_token,
		openid: openid
	})
	// 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
	// 如果数据库在uniCloud上，可以直接入库
	// 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient API，将手机号通过http方式传递给其他服务器的接口，详见：https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=httpclient
	return res
	return {
		code: 0,
		...res,
		message: '获取手机号成功'
	}
}
