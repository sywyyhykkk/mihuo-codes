import {
	styleColor
} from "@/style/mixin.js"
export const univerifyStyle = {
	"fullScreen": true, // 是否全屏显示，默认值： false
	"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
	"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）  
	"icon": {
		"path": "/static/logo_ip.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
		"width": "60px",
		"size": "60px"
	},
	"phoneNum": {
		"color": "#202020" // 手机号文字颜色 默认值：#202020  
	},
	"slogan": {
		"color": "#BBBBBB" //  slogan 字体颜色 默认值：#BBBBBB  
	},
	"authButton": {
		"normalColor": styleColor.themeColor, // 授权按钮正常状态背景颜色 默认值：#3479f5  
		"highlightColor": styleColor.auxiliaryColor, // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
		"disabledColor": "#909199", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
		"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff  
		"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
		"borderRadius": "10px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
	},
	"otherLoginButton": {
		"visible": true, // 是否显示其他登录按钮，默认值：true  
		"normalColor": "", // 其他登录按钮正常状态背景颜色 默认值：透明 
		"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明 
		"textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565  
		"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”  
		"borderColor": "", //边框颜色 默认值：透明（仅iOS支持）  
		"borderRadius": "0px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
	},
	"privacyTerms": {
		"defaultCheckBoxState": false, // 条款勾选框初始状态 默认值： true
		"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
		"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
		"checkBoxSize": 24, // 可选 条款勾选框大小，仅android支持
		"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
		"termsColor": styleColor.themeColor, //  协议文字颜色 默认值： #5496E3  
		"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
		"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”  
		"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
			{
				"url": "https://www.51mihuo.com/Server.html", // 点击跳转的协议详情页面  
				"title": "用户服务协议" // 协议名称  
			},
			{
				"url": "https://www.51mihuo.com/Privacy.html", // 点击跳转的协议详情页面  
				"title": "隐私条款" // 协议名称  
			}
		]
	},
	"buttons": { // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
		"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
		"list": [

		]
	}
}
