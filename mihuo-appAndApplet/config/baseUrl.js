import configdata from "@/config/common.js"
const courtConfig = {
	//微信公众号APPID
	publicAppId: "",
	//请求接口
	apiUrl: configdata.apiUrl,
	apiVersion: 'A',
	//webSocket地址
	socketUrl: '',
	//平台名称
	platformName: "觅活",
	//项目logo
	logoUrl: "",
	//页面分享配置
	share: {
		title: '',
		// #ifdef MP-WEIXIN
		path: '/pages/home/home', //小程序分享路径
		// #endif
		// #ifdef H5 || APP-PLUS
		//公众号||APP分享
		desc: "", // 分享描述
		link: "", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl: "", // 分享图标
		// #endif
	}
};
//手机号验证正则表达式
const phoneRegular = /^1[3456789]\d{9}$/;
//手机号验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;
//ios appid
export default Object.assign({
	phoneRegular,
	mailRegular,
	passwordRegular,
}, courtConfig);
