import imConfig from "@/config/imConfig.js"
export default {
	get(url, param) {
		const imUserInfo = uni.getStorageSync('imUserInfo');
		//console.log(imUserInfo.token);
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'GET',
				url: imUserInfo.baseUrl + url,
				data: param,
				header: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Bearer' + ' ' + imUserInfo.token,
					'api-version': imConfig.VERSION,
					'json-naming': imConfig.CamelCase
				}
			}).then(res => {
				// console.log(res);
				switch (res[1].statusCode) {
					case 200:
						//以防业务的报错
						let data = res[1].data;
						if (data.Status == 0) {
							resolve(data ? data.Data : []);
						} else {
							uni.showToast({
								title: "" + data.Message,
								icon: "none"
							})
						}
						break
					case 400:
						resolve(res[1])
						break
					case 401:
						// #ifdef APP-PLUS
						uni.reLaunch({
							url: '/univerifyLogin/univerifyLogin'
						})
						// #endif
						// #ifndef APP
						uni.reLaunch({
							url: '/pages/user/login'
						})
						// #endif
						reject(res)
						break
					default:
						uni.showToast({
							title: "" + res[1].errMsg,
							icon: "none"
						})
						reject(res)
				}
			}).catch(
				(response) => {
					console.log(response)
					reject(response)
				}
			)
		})
	},

	post(url, param) {
		const imUserInfo = uni.getStorageSync('imUserInfo');
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'POST',
				url: imUserInfo.baseUrl + url,
				data: param,
				header: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Authorization': 'Bearer' + ' ' + imUserInfo.token,
					'api-version': imConfig.VERSION,
					'json-naming': imConfig.CamelCase
				}
			}).then(res => {
				switch (res[1].statusCode) {
					case 200:
						//以防业务的报错
						let data = res[1].data;
						if (data.Status == 0) {
							resolve(data ? data.Data : []);
						} else {
							uni.showToast({
								title: "" + data.Message,
								icon: "none"
							})
						}
						break;
					case 400:
						resolve(res[1])
						break;
					case 401:
						// #ifdef APP-PLUS
						uni.reLaunch({
							url: '/univerifyLogin/univerifyLogin'
						})
						// #endif
						// #ifdef H5
						uni.reLaunch({
							url: '/pages/user/login'
						})
						// #endif
						break;
					default:
						uni.showToast({
							title: "" + res[1].errMsg,
							icon: "none"
						})
						reject(res)
						break;
				}
			}).catch((response) => {
				console.log(response)
				reject(response)
			})
		})
	},
}
