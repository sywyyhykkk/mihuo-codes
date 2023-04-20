// 网络请求的配置
let configdata;
let processDev = {
	imageGlobal: "https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/",
	apiUrl: "http://dev.51mihuo.com:9999/",
	fileUpload: "http://dev.51mihuo.com:9001/#/sopFileUpload",
	apiVersion: "A",
	env:"dev",
	appletVersion: 2, //小程序版本  0-正式版； 1-开发版； 2-体验版。  // 分享使用
	envVersion:'trial',//正式版 release，体验版为 trial，开发版为 develop。// 生产小程序码
	data: {
		coid: '37', // 重庆运营商
		// coid: '38', // 昆明运营商
	}
}
let processTest = {
	imageGlobal: "https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/",
	apiUrl: "https://api-test.51mihuo.com/",
	fileUpload: "http://e-test.51mihuo.com/#/sopFileUpload",
	apiVersion: "A",
	env:"test",
	appletVersion: 2, 
	envVersion:'trial',
	data: {
		coid: '3' // 重庆运营商
	}
}
let processUAT = {
	imageGlobal: "https://mihuo.obs.cn-east-3.myhuaweicloud.com/",
	apiUrl: "https://api-uat.51mihuo.com/",
	fileUpload: "https://api-uat.51mihuo.com/#/sopFileUpload",
	apiVersion: "A",
	env:"uat",
	appletVersion: 2, 
	envVersion:'trial',
	data: {
		coid: '2' // 昆明运营商 
	}
}
let processPro = {
	imageGlobal: "https://mihuo.obs.cn-east-3.myhuaweicloud.com/",
	apiUrl: "https://api.51mihuo.com/",
	fileUpload: "https://e.51mihuo.com/#/sopFileUpload",
	apiVersion: "A",
	env:"pro",
	appletVersion: 0, 
	envVersion:'release',
	data: {
		coid: '2' // 昆明运营商
	}
}

if (process.env.NODE_ENV === 'development') {
	configdata = processDev
} else if (process.env.NODE_ENV === 'production') {
	configdata = processPro
}
// ios的相关配置 iosAppid等
const iosAppid = '1593851265';
// 安卓包名
const androidBuildName = 'uni.UNI183C0D4'
// ios包名 打包时候的
const iosBuildName = 'uni.UNI183C0D4'
// 未登录的token
const header = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': 'Basic YXBwOmFwcA==',
	'Accept-Language': 'zh-CN',
	'VERSION': configdata.apiVersion
}

// 小程序原始ID
const WeChatApplet ={
	site:'gh_b091d7f9d23e' // 工地协作小程序
}
export default {
	...configdata,
	iosAppid,
	androidBuildName,
	iosBuildName,
	WeChatApplet,
	header
}
