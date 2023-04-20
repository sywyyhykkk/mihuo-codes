// 网络请求的配置
let configdata
let processDev = {
	imageGlobal: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/',
	apiUrl: 'http://dev.51mihuo.com:9999/',
	env: 'dev',
	apiVersion: 'A',
	appletVersion: 1, // 小程序版本  0-正式版 1-开发版 2-体验版
	envVersion:'develop', // 正式版 release，体验版 trial，开发版 develop // 生成小程序码
	data: {
		coid: '38' // 昆明运营商
	}
}
let processTest = {
	imageGlobal: 'https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/',
	apiUrl: 'https://api-test.51mihuo.com/',
	env: 'test',
	apiVersion: 'A',
	appletVersion: 2, // 小程序版本  0-正式版 1-开发版 2-体验版
	envVersion:'trial', // 正式版 release，体验版 trial，开发版 develop // 生成小程序码
	data: {
		coid: '1'
	}
}
let processUAT = {
	imageGlobal: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/',
	apiUrl: 'https://api-uat.51mihuo.com/',
	apiVersion: 'A',
	env: 'uat',
	appletVersion: 2, // 小程序版本  0-正式版 1-开发版 2-体验版
	envVersion:'trial', // 正式版 release，体验版 trial，开发版 develop // 生成小程序码
	data: {
		coid: '2'
	}
}
let processPro = {
	imageGlobal: 'https://mihuo.obs.cn-east-3.myhuaweicloud.com/',
	apiUrl: 'https://api.51mihuo.com/',
	apiVersion: 'A',
	env: 'pro',
	appletVersion: 0, // 小程序版本  0-正式版 1-开发版 2-体验版
	envVersion:'release', // 正式版 release，体验版 trial，开发版 develop // 生成小程序码
	data: {
		coid: '2' // 昆明运营商
	}
}
if (process.env.NODE_ENV === 'development') {
	configdata = processDev
} else if (process.env.NODE_ENV === 'production') {
	configdata = processPro
}
//ios的相关配置 iosAppid等
const iosAppid = '1598048941'
//安卓包名
const androidBuildName = 'uni.UNIC86B2B9'
//ios包名 打包时候的
const iosBuildName = 'uni.UNIC86B2B9'
//未登录的token
// #ifdef APP-PLUS || H5
const header = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Authorization: 'Basic Y2FwcDpjYXBw',
	'Accept-Language': 'zh-CN',
	VERSION: ''
}
// #endif
// #ifdef MP-WEIXIN
const header = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Authorization: 'Basic Y21pbmk6Y21pbmk=',
	'Accept-Language': 'zh-CN',
	VERSION: ''
}
// #endif
// #ifdef MP-TOUTIAO
const header = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Authorization: 'Basic Y3R0OmN0dA==',
	VERSION: ''
}
// #endif

export default {
	...configdata,
	iosAppid,
	androidBuildName,
	iosBuildName,
	header
}
