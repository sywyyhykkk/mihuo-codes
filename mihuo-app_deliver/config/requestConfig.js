import request from "@/uni_modules/mihuo-request/js_sdk/request";
import store from '@/store';
import baseConfig from '@/config/common.js';
import imsdk from '@/plugins/im/imsdk.js'
// #ifdef H5
import {
	h5Login
} from '@/config/html5Utils';
// #endif
// #ifdef MP-WEIXIN
import {
	onLogin
} from '@/config/login';
// #endif
let version_code = '';
// #ifdef APP-PLUS
import {
	encryption,
	debounce
} from '@/plugins/utils.js'
// #endif
import api from '@/config/api'
import utils from '@/static/js/util.js'
//可以new多个request来支持多个域名请求
const currentMode = uni.getStorageSync('devModeApi')
let base = baseConfig
if (currentMode) {
	base = currentMode
}
let $http = new request({
	//接口请求地址
	// #ifdef APP-PLUS
	baseUrl: base.apiUrl,
	// #endif
	// #ifdef H5
	baseUrl: base.apiUrl,
	// #endif
	//服务器本地上传文件地址
	fileUrl: base.apiUrl,
	// 服务器上传图片默认url
	defaultUploadUrl: "",
	// 服务器上传文件名称
	defaultFileName: "",
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	header: base.header
});
let requestList = []; //请求队列；这里只接受post的请求队列
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
	uni.removeTabBarBadge({
		index: 2
	})
	// #ifdef APP-PLUS
	plus.runtime.setBadgeNumber(0)
	// #endif
	utils.removeTabBarBadge("all")
	store.commit("emptyUserInfo");
	uni.removeStorageSync('userData')
	uni.removeStorageSync('userInfo')
	uni.removeStorageSync('imUserInfo')
	uni.removeStorageSync('userPersonId')
	uni.removeStorageSync('userRole')
	// uni.removeStorageSync('userAddress')
	uni.removeStorageSync('userSetting')
	// uni.removeStorageSync('cityOperatorId')
	// uni.removeStorageSync('oldLocation')
	uni.removeStorageSync('sqliteDataVersion')
	imsdk.onclose()
	// 判断是否已经跳转过一次了
	let pages = getCurrentPages()
	let url = pages[pages.length - 1] && pages[pages.length - 1].route
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/univerifyLogin/univerifyLogin'
	});
	// #endif
	// #ifdef H5
	if (url == '/pages/user/login') {
		return
	}
	uni.navigateTo({
		url: '/pages/user/login'
	});
	// #endif
}
$http.requestStart = function(options) {
	getNetStatus()
	if (options.method.toLowerCase() == 'post') {
		const request = requestList.find(item => item.url == options.url) || {};
		let currentTime = new Date().getTime();
		if (!request.url) {
			requestList.push({
				url: options.url,
				data: options.data,
				time: currentTime
			})
		} else {
			if (JSON.stringify(request.data) == JSON.stringify(options.data)) {
				//这里写两个if吧  写&&太长了
				if (currentTime - request.time < 1000) {
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
			'Authorization': (userInfo ? userInfo.token_type : 'Basic') + ' ' + (userInfo ? userInfo
				.access_token : 'YXBwOmFwcA=='),
			'VERSION': base.header.VERSION,
			uaToken: store.state.uabModule || '',
			webUmidToken: store.state.webUmidToken || '',
			deviceToken: uni.getStorageSync("deviceToken") || '',
			// #ifdef APP-PLUS
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
			// #endif
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
	// console.log("kais",options)
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
	options.header = {
		...options.header,
		deviceId: store.state.uuid || uni.getStorageSync('APP-UUID')
	}
	return options;
}
//请求结束
$http.requestEnd = function(options) {
	// 20s后还是把请求列表清空一下
	setTimeout(() => requestList = [], 20000);
}
let loginPopupNum = 0;
//所有接口数据处理（此方法需要开发者根据各自的接口返回类型修改，以下只是模板）
$http.dataFactory = async function(res) {
	if ((res.response.statusCode && res.response.statusCode == 200) || res.response.access_token) {
		let httpData = res.response.data;
		if (typeof(httpData) == "string") {
			//console.log("httpData", httpData)
			httpData = JSON.parse(httpData);
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
				return Promise.resolve(httpData.code);
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
				uni.showModal({
					title: "提示",
					content: "您还未绑定手机号，请先绑定~",
					confirmText: "去绑定",
					cancelText: "再逛会",
					success: (res) => {
						loginPopupNum--;
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/user/bindPhone'
							});
						}
						if (res.cancel) {
							uni.setStorageSync('usernotlogin', '1');
						}
					}
				});
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
					mData: httpData.mData
				}
			} else {
				obj = {
					statusCode: 0,
					errMsg: (httpData.info || httpData.msg),
					isShowMessage: res.header.isShowMessage,
					data: res.data,
					response: res.response.data,
				}
			}
			if (httpData.code == 1 && httpData.msg) {
				uni.showToast({
					title: httpData.msg,
					icon: "none",
					duration: 3000
				});
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject(obj);
		}
	} else {
		if (res.response.statusCode == 424) {
			let loginUrl =
				`${base.apiUrl}auth/oauth/token ${base.apiUrl}mobile/token/sms ${base.apiUrl}auth/mobile/token/sms`;

			let routes = getCurrentPages()
			let url = routes[routes.length - 1] && routes[routes.length - 1].route
			if (url !== 'pages/user/login') {
				// token过期处理,不存在则跳转到登录页
				if (!isRefreshing) {
					// 将刷新token的方法放在vuex中处理了, 可见下面区块代码
					refreshToken(res);
				}
			}

			//这里还有一层判断 token刷新的时候不能更新hearder
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo && loginUrl.indexOf(res.url.split('?')[0]) < 0) {
				return Promise.reject({
					statusCode: 0,
					errMsg: "未登陆",
					data: res.data
				});
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
			const errorCode = [400, 404, 502, 426, 500, 403, 503]
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
	uni.hideLoading()
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
	if (!refresh_token || isRefreshing) {
		outLogin()
		return
	}
	isRefreshing = true;
	let res = await uni.request({
		url: base.apiUrl + 'auth/oauth/token',
		method: 'POST',
		header: base.header,
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

const getNetStatus = () => {
	// #ifdef APP
	debounce(() => {
		uni.getNetworkType({
			success: (res) => {
				if(res.networkType == 'none'){
					uni.showToast({
						title: "网络不给力，请检查网络",
						icon: "none",
					});
				}
			}
		});
	}, 200)
	// #endif
}

export default $http;
