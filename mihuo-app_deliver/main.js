import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/store'
import Util from 'static/js/util.js'
import api from '@/config/api'
import Validate from 'static/js/validate.js'
import moment from "@/static/js/moment.js"
import {
	isLogin
} from 'static/js/userInfo.js'
import sj_show_modal from '@/components/G_show_modal'
import {
	styleColor
} from '@/style/mixin.js'
Vue.prototype.messageAlert = (op = {}) => {
	return new Promise((resolve, reject) => {
		let ssm = new sj_show_modal({
			...op,
			$event: function(e) {
				if (e.res) {
					resolve(e);
				} else {
					reject(e);
				}
			}
		})
		ssm.show();
		Vue.prototype.$hide = function() {
			ssm.hide();
		}
	})
}
/**
 * 日期格式化工具
 * @param fmt  日期
 * @returns {number} 返回对应格式的日期
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
		}
	}
	return fmt;
}
Vue.config.productionTip = false;
Vue.prototype.$util = Util;
Vue.prototype.$validate = Validate;
Vue.prototype.$isLogin = isLogin;
Vue.prototype.$httpApi = new api();
Vue.prototype.$styleColor = styleColor;
Vue.prototype.goBack = () => {
	uni.navigateBack()
}
Vue.prototype.toPage = (url) => {
	uni.navigateTo({
		url
	})
}
Vue.prototype.toTab = (url) => {
	uni.switchTab({
		url
	})
}
Vue.prototype.$store = store;

/**
 * 计算两个日期之间的天数
 * @param startTime  开始日期 yyyy-MM-dd
 * @param endTime  结束日期 yyyy-MM-dd
 * @param status  节点任务状态
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
Vue.prototype.getDateNumber = (startTime, endTime, status) => {

	// 预计完成时间跟实际完成时间对比
	// 1.若没有实际完成时间，则取当前时间
	// 2.若没有预计完成时间，则取项目预计完成时间


	let newTime = moment().format('YYYY-MM-DD')
	let finishTime
	if (endTime) {
		finishTime = moment(endTime)
	} else {
		finishTime = moment(newTime)
	}

	if (!startTime) {
		startTime = store.state.projectInfo.expectFinishTime + ' 23:59'
	}
	let remainingDays = moment(startTime).diff(endTime ? endTime : newTime, 'day')
	let itemResults = {
		time: '',
		status: false,
		timeNum: Math.abs(remainingDays),
		timeNums: '',
	}
	if (remainingDays < 0) {
		if (status) {
			itemResults.time = ''
		} else {
			itemResults.time = '超' + Math.abs(remainingDays) + '天'
			itemResults.status = false
		}
	} else {
		itemResults.status = true
		if (remainingDays == 0) {
			if (status) {
				itemResults.time = ''
			} else {
				startTime += ' 23:59'
				if (endTime) {
					finishTime = moment(endTime)
				} else {
					finishTime = moment(moment().format('YYYY-MM-DD HH:mm'))
				}

				// 实际完成时间跟当前时间做比较
				let difference = moment(finishTime).diff(newTime, 'day')
				if (difference < 0) {
					if (difference == 0) {
						itemResults.time = ''
					} else {
						itemResults.status = false
						itemResults.time = '超' + Math.abs(difference) + '天'
					}
				} else {
					remainingDays = moment(startTime).diff(finishTime, 'hours')
					if (remainingDays <= 0) {
						itemResults.status = false
						itemResults.time = ''
					} else {
						itemResults.time = (remainingDays > 0 ? '剩' : '超') + Math.abs(remainingDays) + '小时'
					}
				}
			}
		} else {
			if (status) {
				itemResults.time = ''
			} else {
				itemResults.timeNums = remainingDays
				if (remainingDays == 0) {
					itemResults.time = ''
				} else {
					itemResults.time = '剩' + Math.abs(remainingDays) + '天'
				}
			}
		}
	}
	return itemResults
};

//全局图片路径
import common from 'config/common.js'
const devMode = uni.getStorageSync('devModeApi')
if (devMode) {
	Vue.prototype.$image = devMode;
} else {
	Vue.prototype.$image = common;
}

// // 底部菜单
import tabBarList from 'config/tabBarList.js'
Vue.prototype.$tabBarList = tabBarList;

// 工具
import '@/plugins/utils.js';
//权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;
//挂载全局http请求
import $http from '@/config/requestConfig'
Vue.prototype.$http = $http;
//im的请求
// #ifdef MP-WEIXIN
//挂载全局微信分享
Vue.prototype.wxShare = wxShare;
// #endif
import {
	getOriginator,
	getPersonIdUser,
	remainingDays,
	getListJobByIds,
	getOrderDetails,
	notificationsJump,
	storeSetProjectInfo,
	storeOrderInfo,
	checkUploadProcess,
	questionnaireVerification,
	trimSpecial,
	setInput,
	setBlur,
	CustomForeach,
	getNodeDetails,
	getLogTypeName,
	isJSON,
	setNodeSkipStatus,
	remarksVerification,
	throttle,
	setFileType,
	serviceInfo,
	compressImage,
	debounce
} from '@/plugins/utils'
import {
	CommonUpload
} from '@/plugins/uploadPic.js';

// import {
// 	permissionRouting
// } from '@/plugins/permissionRouting.js';
import permissionRouting from '@/plugins/permissionRouting'

Vue.prototype.$CommonUpload = CommonUpload;
Vue.prototype.debounce = debounce;
Vue.prototype.$getOriginator = getOriginator;
Vue.prototype.$getPersonIdUser = getPersonIdUser;
Vue.prototype.$remainingDays = remainingDays;
Vue.prototype.$getListJobByIds = getListJobByIds;
Vue.prototype.$getOrderDetails = getOrderDetails;
Vue.prototype.$notificationsJump = notificationsJump;
Vue.prototype.$storeSetProjectInfo = storeSetProjectInfo;
Vue.prototype.$storeOrderInfo = storeOrderInfo;
Vue.prototype.$checkUploadProcess = checkUploadProcess;
Vue.prototype.$questionnaireVerification = questionnaireVerification;
Vue.prototype.$trimSpecial = trimSpecial;
Vue.prototype.$setInput = setInput;
Vue.prototype.$setBlur = setBlur;
Vue.prototype.$customForeach = CustomForeach;
Vue.prototype.$getNodeDetails = getNodeDetails;
Vue.prototype.$getLogTypeName = getLogTypeName;
Vue.prototype.$isJSON = isJSON;
Vue.prototype.$setNodeSkipStatus = setNodeSkipStatus;
Vue.prototype.$remarksVerification = remarksVerification;
Vue.prototype.$throttle = throttle;
Vue.prototype.$setFileType = setFileType;
Vue.prototype.$serviceInfo = serviceInfo;
Vue.prototype.$compressImage = compressImage;
Vue.prototype.$permissionRouting = permissionRouting;
//判断是否登录
import {
	judgeLogin
} from '@/config/login';
Vue.prototype.judgeLogin = judgeLogin;
//view
import uView from 'uview-ui';
Vue.use(uView);

Vue.config.productionTip = false;
// #ifdef H5
//微信SDK
//import '@/plugins/wxJsSDK.js';
// #endif
//全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
Vue.component("mescroll-body", MescrollBody);
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount();
