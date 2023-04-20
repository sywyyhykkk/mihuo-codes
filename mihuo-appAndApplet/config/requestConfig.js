import request from "@/uni_modules/mihuo-request/js_sdk/request";
import store from '@/store';
import baseConfig from '@/config/common.js';
import imsdk from '@/plugins/im/imsdk.js'
let version_code = '';
import {
	encryption
} from '@/plugins/utils.js'
import utils from '@/static/js/util.js'
import api from '@/config/api'
import util from "@/static/js/util.js";
//可以new多个request来支持多个域名请求
const currentMode = uni.getStorageSync('devModeApi')
let base = baseConfig
if (currentMode) {
	base = currentMode
}
let $http = new request({
	//接口请求地址
	timeout:60000,
	baseUrl: base.apiUrl,
	//服务器本地上传文件地址
	fileUrl: base.apiUrl,
	// 服务器上传图片默认url
	defaultUploadUrl: "",
	// 服务器上传文件名称
	defaultFileName: "",
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	header: base.header
});
let requestList = []; // 请求队列；这里只接受post的请求队列
let allRequestList = []; // 所有请求队列
let isRefreshing = false;
// 失效后同时发送请求的容器 -- 缓存接口
let subscribers = [];
// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched(newToken) {
	subscribers.forEach((callback) => {
		callback(newToken);
	});
	// 清空缓存接口
	subscribers = [];
}
// 添加缓存接口
function addSubscriber(callback) {
	subscribers.push(callback);
}
//logout
function outLogin() {
	//清楚cid的相关信息
	// #ifdef APP-PLUS
	plus.runtime.setBadgeNumber(0)
	// #endif
	utils.removeTabBarBadge('all');
	// 这一行会影响token过期后的跳转
	// imsdk.onclose()
	store.commit("emptyUserInfo");
	uni.removeStorageSync("noticeNum")
	uni.removeStorageSync('COUPON-ARRAY')
	uni.removeStorageSync('userData')
	uni.removeStorageSync('userInfo')
	uni.removeStorageSync('imUserInfo')
	uni.removeStorageSync('userRole')
	uni.removeStorageSync('userSetting')
	uni.removeStorageSync('sqliteDataVersion')
	uni.removeStorageSync('roomAddress')
	uni.removeStorageSync('myHomeInfo');
	// 判断是否已经跳转过一次了
	let pages = getCurrentPages()
	let url = pages[pages.length - 1].route
	// #ifdef APP
	if (url == '/pages-appInfo/univerifyLogin/univerifyLogin' || url == 'pages-user/appLogin/appLogin') {
		return
	}
	setTimeout(() => {
		utils.goToLoginPage()
	}, 500)
	// #endif
	// #ifdef H5
	if (url == '/pages-user/appLogin/appLogin') {
		return
	}
	utils.goToLoginPage()
	// #endif

}
$http.requestStart = function(options) {
	//console.log(options)
	let currentTime = new Date().getTime();
	allRequestList.push({
		url: options.url,
		data: options.data,
		time: currentTime
	})
	if (options.method.toLowerCase() == 'post') {
		// #ifdef APP-PLUS
		!options.header.hideLoading && uni.showLoading({
			duration: 500
		})
		// #endif
		const request = requestList.find(item => item.url == options.url) || {};
		if (!request.url) {
			// 如果没找到相同url的请求 就正常请求
			requestList.push({
				url: options.url,
				data: options.data,
				time: currentTime
			})
		} else {
			if (JSON.stringify(request.data) == JSON.stringify(options.data)) {
				//这里写两个if吧  写&&太长了
				if (currentTime - request.time < 1000) {
					// 直接返回false 取消该次请求
					return false;
				}
			}
		}
	}
	const userInfo = uni.getStorageSync('userInfo');
	const userAddress = uni.getStorageSync('userAddress');
	let loginUrl =
		`${base.apiUrl}auth/oauth/token ${base.apiUrl}mobile/token/sms ${base.apiUrl}auth/mobile/token/sms`;
	//这里还有一层判断 token刷新的时候不能更新hearder
	if (options.data && options.data.refresh_token) {
		return options;
	}
	if (userInfo || loginUrl.indexOf(options.url.split('?')[0]) < 0) {
		options.header = {
			...options.header,
			'Content-Type': 'application/json;charset=UTF-8',
			'Authorization': (userInfo ? userInfo.token_type : '') + ' ' + (userInfo ? userInfo
				.access_token : base.header.Authorization),
			'VERSION': base.apiVersion,
			uaToken: store.state.uabModule || '',
			webUmidToken: store.state.webUmidToken || '',
			deviceId:uni.getStorageSync('APP-UUID'),
			'COID': userAddress ? encryption({
				data: {
					coid: userAddress.id
				},
				key: 'pigxpigxpigxpigx',
				param: ['coid']
			}).coid : encryption({
				data: base.data,
				type: 'password',
				key: 'pigxpigxpigxpigx',
				param: ['coid']
			}).coid
		}
	}
	// 图片、视频上传大小限制
	if (options.method == "FILE") {
		// 文件最大字节: options.maxSize 可以在调用方法的时候加入参数
		let maxSize = options.maxSize || '';
		for (let item of options.files) {
			if (item.fileType == 'image') {
				if (maxSize && item.size > maxSize) {
					setTimeout(() => {
						uni.showToast({
							title: "图片过大，请重新上传",
							icon: "none"
						});
					}, 500);
					return false;
				}
			} else if (item.fileType == "video") {
				if (item.duration < 3) {
					setTimeout(() => {
						uni.showToast({
							title: "视频长度不足3秒，请重新上传",
							icon: "none"
						});
					}, 500);
					return false;
				}
			}
		}
	}
	// #ifdef APP-PLUS
	// 添加当前版本号
	if (version_code) {
		options.header['version_code'] = version_code;
	}
	// #endif
	//请求前加入token
	let storeUserInfo = store.state.userInfo;
	if (!storeUserInfo.token) { // nvue页面读取不到vuex里面数据，将取缓存
		storeUserInfo = uni.getStorageSync("userInfo");
	}
	if (storeUserInfo.token) {
		options.header['user_token'] = storeUserInfo.token;
	};
	if (options.header.isShowMessage == false) {
		options.header.isShowMessage = false
	} else {
		options.header.isShowMessage = true
	}
	options.header = {...options.header,deviceId: store.state.uuid || uni.getStorageSync('APP-UUID')}
	return options;
}
//请求结束
/** 为了适配小程序使用uni.hideLoading()方法导致错误提示一闪而过，所以加上定时器 **/
$http.requestEnd = function(options) {
	if (allRequestList.length == 0) {
		// 所有请求结束后再隐藏loading
		setTimeout(() => uni.hideLoading(), 4000)
	} else if (allRequestList.length == 1) {
		// 只有最后一个请求 结束请求时隐藏loading
		allRequestList = allRequestList.filter(item => item.url !== options.url)
		setTimeout(() => uni.hideLoading(), 4000)
	} else {
		// 每结束一个请求就从所有请求里移除
		allRequestList = allRequestList.filter(item => item.url !== options.url)
	}
	// 20s后还是把请求列表清空一下
	setTimeout(() => requestList = [], 20000);
}
let loginPopupNum = 0;
//所有接口数据处理（此方法需要开发者根据各自的接口返回类型修改，以下只是模板）
$http.dataFactory = async function(res) {
	//console.log(res);
	if ((res.response.statusCode && res.response.statusCode == 200) || res.response.access_token) {
		let httpData = res.response.data;
		if (typeof(httpData) == "string") {
			try {
				httpData = JSON.parse(httpData);
			} catch {
				console.log(httpData)
			}
		}
		//判断数据是否请求成功
		if (httpData.access_token) {
			return Promise.resolve(httpData);
		}

		if (httpData.success || httpData.code == 0) {
			if (httpData.data === false) {
				//console.log('接口错误信息:', res)
				// uni.showToast({
				// 	title: httpData.msg || "操作失败",
				// 	icon: "none",
				// 	duration: 3000
				// });
			} else {
				if (httpData.data == null) {
					return Promise.resolve(httpData.code);
				} else {
					return Promise.resolve(httpData.data);
				}
				// 返回正确的结果(then接受数据)
			}
		} else if (httpData.code == 1100 || httpData.code == 402 || httpData.code == 400) {
			return Promise.reject({
				statusCode: 0,
				errMsg: "【request】" + (httpData.info || httpData.msg),
				data: res.data
			});
		} else if (httpData.code == 1004) {
			if (loginPopupNum <= 0) {
				loginPopupNum++;
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject({
				statusCode: 0,
				errMsg: "【request】" + (httpData.info || httpData.msg),
				data: res.data
			});
		} else {
			let obj;
			if (httpData.mData) {
				obj = {
					statusCode: 0,
					errMsg: (httpData.info || httpData.msg),
					data: res.data,
					isShowMessage: res.header.isShowMessage,
					mData: httpData.mData,
					codeData: httpData
				}
			} else {
				obj = {
					statusCode: 0,
					errMsg: (httpData.info || httpData.msg),
					isShowMessage: res.header.isShowMessage,
					data: res.data,
					codeData: httpData
				}
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject(obj);
		}
	} else {
        if (res.response.statusCode == 403){
			 uni.showToast({
			 	title:'无权访问',
				icon:"error",
			 })
			 return;
		}
		if (res.response.statusCode == 424) {
			let loginUrl =
				`${base.apiUrl}auth/oauth/token ${base.apiUrl}mobile/token/sms ${base.apiUrl}auth/mobile/token/sms`;
			//这里还有一层判断 token刷新的时候不能更新hearder
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo && loginUrl.indexOf(res.url.split('?')[0]) < 0) {
				isRefreshing = false;
				return Promise.reject({
					statusCode: 0,
					errMsg: "未登录",
					data: res.data
				});
			}
			// token过期处理,不存在则跳转到登录页
			// console.log(isRefreshing)
			if (!isRefreshing) {
				// 将刷新token的方法放在vuex中处理了, 可见下面区块代码
				refreshToken(res);
			}
			// 将其他接口缓存起来 -- 这个Promise函数很关键
			const retryOriginalRequest = new Promise((resolve) => {
				// 这里是将其他接口缓存起来的关键, 返回Promise并且让其状态一直为等待状态, 
				// 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口, 
				// 此时, Promise的状态就会变成resolve
				addSubscriber((newToken) => {
					// 表示用新的token去替换掉原来的token
					// 替换掉url -- 因为baseURL会扩展请求url
					let url = res.url.replace(base.apiUrl, '');
					// 用重新封装的config去请求, 就会将重新请求后的返回
					resolve($http.request({
						url: res.url,
						data: res.data,
						method: res.method,
						header: {
							...res.header,
							'Authorization': (newToken ? newToken.token_type :
								'Basic') + ' ' + (newToken ? newToken
								.access_token : 'Y2FwcDpjYXBw'),
						}
					}));
				});
			});
			return retryOriginalRequest;
		} else {
			const errorCode = [502, 426, 500, 403, 503, 404, 400]
			if (errorCode.includes(res.response.statusCode)) {
				// console.log("requestError", res)
				if (res.response.statusCode == 404 || res.response.statusCode == 400 || res.response
					.statusCode == 500) {
					uni.showToast({
						title: (res.response.data.msg || res.response.statusCode) + '',
						icon: 'none',
					})
				} else {
					res.header.isShowMessage && uni.showToast({
						title: (res.response.data.msg || res.response.statusCode) + '',
						icon: 'none',
					})
					Promise.reject({
						statusCode: res.response.statusCode || 200,
						errMsg: (res.response.data.msg || res.response.statusCode) + '',
						data: res.data
					})
				}
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject({
				statusCode: res.response.statusCode || 200,
				errMsg: (res.response.data.msg || res.response.statusCode) + '',
				data: res.data
			});
		}
	}
};
// 错误回调
$http.requestError = function(e) {
	// 隐藏加载框, 避免超时或接口报错时一直显示加载框
	setTimeout(() => uni.hideLoading(), 4000)
	if (e.statusCode === 0) {
		if (e.isShowMessage) {
			uni.showToast({
				title: e.errMsg || '请求错误',
				icon: "none"
			});
		}
		return;
	}
	throw e
}
// token的刷新
const refreshToken = async (response) => {
	const grant_type = 'refresh_token';
	const scope = 'server';
	const userInfo = uni.getStorageSync('userInfo');
	const refresh_token = userInfo.refresh_token;
	// 如果没有说明是第一次使用
	if (!refresh_token || isRefreshing){
		util.goToLoginPage();
		return;
	};
	isRefreshing = true;
	let res = await uni.request({
		url: base.apiUrl + 'auth/oauth/token',
		method: 'POST',
		header: {...base.header,deviceId:uni.getStorageSync('APP-UUID'),},
		data: {
			"refresh_token": refresh_token,
			"grant_type": grant_type,
			"scope": scope
		},
	});
	let dataInit = res[1];
	if (dataInit.data && dataInit.data.refresh_token) {
		const data = dataInit.data;
		const userInfo = uni.getStorageSync('userInfo');
		userInfo.access_token = data.access_token;
		userInfo.refresh_token = data.refresh_token;
		userInfo.token_type = data.token_type;
		uni.setStorageSync('userInfo', userInfo);
		onAccessTokenFetched(data);
		setTimeout(() => {
			isRefreshing = false
		}, 1000)
	} else {
		isRefreshing = false
		outLogin()
	}
}

export default $http;
