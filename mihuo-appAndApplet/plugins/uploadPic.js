import baseConfig from '@/config/baseUrl';
const currentMode = uni.getStorageSync('devModeApi')
let base = baseConfig
if (currentMode) {
	base = currentMode
}
//app的上传
//其他平台的上传参考文档。
//头像的上传这里有点特别所以区分开
export function CommonUpload(pic, isAvatar = false) {
	const userInfo = uni.getStorageSync('userInfo');
	let urlList = [];
	return new Promise((resolve, rej) => {
		uni.uploadFile({
			url: isAvatar ? (base.apiUrl + 'admin/sys-file/upload/avatar') : (base.apiUrl +
				'admin/sys-file/upload'),
			filePath: pic,
			name: 'file',
			header: {
				'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
				'VERSION': base.apiVersion
			},
			success: (res) => {
				if (res.statusCode === 500) {
					console.log("error", res)
					resolve('');
				} else {
					if (res.data) {
						let response = JSON.parse(JSON.stringify(res.data));
						let parsedResponse = JSON.parse(response)
						if (parsedResponse.data && parsedResponse.data.check) {
							let err = JSON.parse(parsedResponse.data.check)
							console.error('图片不合规', err.data)
							if (err.conclusion !== '') {
								uni.showToast({
									icon: 'none',
									title: `${err.data[0] && err.data[0].msg}，请重新上传~`,
									duration: 3000
								})
							}
							resolve('');
						} else {
							if (parsedResponse.code == 1) {
								console.error('图片上传失败', parsedResponse)
								uni.showToast({
									icon: 'none',
									title: `${parsedResponse.msg}，请重新上传~`,
									duration: 3000
								})
								resolve('');
							} else {
								if (parsedResponse.data) {
									resolve(parsedResponse.data.url);
								}
							}
						}
					}
				}
			},
			fail: (res) => {
				uni.showToast({
					title: "失败",
					icon: "none"
				});
				console.log("error", res)
			}
		});
	})
}

// 封装公共上传图片
// export function CommonUpload(picData, isAvatar = false) {
// 	const userInfo = uni.getStorageSync('userInfo');
// 	let uploads = [];
// 	let pic = []
// 	if (typeof picData === 'string') {
// 		pic.push(picData)
// 	} else {
// 		pic = picData
// 	}

// 	return new Promise(function(presolve, preject) {
// 		for (var i = 0; i < pic.length; i++) {
// 			uploads[i] = new Promise(function(resolve, reject) {
// 				uni.uploadFile({
// 					url: isAvatar ? (base.apiUrl + 'admin/sys-file/upload/avatar') : (base
// 						.apiUrl +
// 						'admin/sys-file/upload'),
// 					filePath: pic[i],
// 					name: 'file',
// 					header: {
// 						'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
// 						'VERSION': base.apiVersion
// 					},
// 					success(res) {
// 						if (res.statusCode === 500) {
// 							reject({
// 								code: 1
// 							})
// 						} else {
// 							let response = JSON.parse(JSON.stringify(res.data));
// 							let parsedResponse = JSON.parse(response)
// 							if (parsedResponse.data && parsedResponse.data.check) {
// 								let err = JSON.parse(parsedResponse.data.check)
// 								if (err.conclusion !== '') {
// 									uni.showToast({
// 										icon: 'none',
// 										title: `${err.data[0] && err.data[0].msg}，请重新上传~`,
// 										duration: 3000
// 									})
// 								}
// 								reject({
// 									code: 1,
// 									msg: `${err.data[0] && err.data[0].msg}，请重新上传~`
// 								})
// 							} else {
// 								if (parsedResponse.data) {
// 									resolve(parsedResponse.data.url);
// 								}
// 							}
// 						}
// 					},
// 					fail(err) {
// 						reject({
// 							code: 1
// 						})
// 					}
// 				})
// 			})
// 		}
// 		Promise.all(uploads).then(res => {
// 			//图片上传完成
// 			presolve(res)
// 		}).catch(err => {
// 			preject(err)
// 		})
// 	})
// }

export function imageRecogn(path, type = 'bankcard') {
	const userInfo = uni.getStorageSync('userInfo');
	var base64Str = '';
	return new Promise((resolve, rej) => {
		// #ifdef MP-WEIXIN
		uni.showLoading()
		wx.getImageInfo({
			src: path,
			success: (imageInfo) => {
				var imgType = imageInfo.type;
				wx.getFileSystemManager().readFile({
					filePath: path, //选择图片返回的相对路径
					encoding: "base64", //这个是很重要的
					success: info => { //成功的回调
						var base64Str = 'data:image/' + imgType + ';base64,' + info.data
						uni.request({
							url: base.apiUrl + 'admin/sys-file/token',
							method: 'get',
							header: {
								'Authorization': userInfo.token_type + ' ' +
									userInfo.access_token,
								'VERSION': base.apiVersion
							},
							success: (res) => {
								uni.hideLoading()
								let baiduUrl;
								switch (type) {
									case 'bankcard':
										baiduUrl =
											"https://aip.baidubce.com/rest/2.0/ocr/v1/bankcard?access_token=";
										break;
									case 'idcard':
										baiduUrl =
											"https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=";
										break;
									default:
										baiduUrl =
											"https://aip.baidubce.com/rest/2.0/ocr/v1/bankcard?access_token=";
										break;
								}
								console.log(baiduUrl + res.data.data)
								uni.request({
									url: baiduUrl + res.data.data,
									method: 'POST',
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									data: {
										image: base64Str,
										id_card_side: 'front',
									},
									success: (data) => {
										resolve(data.data);
									},
									fail: (error) => {
										rej(error)
									}
								})
							},
							fail: (res) => {
								uni.showToast({
									title: res.msg + '',
									icon: 'none'
								})
							}
						});
					}
				})
			}
		})
		// #endif
		// #ifdef APP-PLUS
		const bitmap = new plus.nativeObj.Bitmap();
		bitmap.load(path, () => {
			uni.showLoading()
			uni.request({
				url: base.apiUrl + 'admin/sys-file/token',
				method: 'get',
				header: {
					'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
					'VERSION': base.apiVersion
				},
				success: (res) => {
					uni.hideLoading()
					let baiduUrl;
					switch (type) {
						case 'bankcard':
							baiduUrl =
								"https://aip.baidubce.com/rest/2.0/ocr/v1/bankcard?access_token=";
							break;
						case 'idcard':
							baiduUrl =
								"https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=";
							break;
						default:
							baiduUrl =
								"https://aip.baidubce.com/rest/2.0/ocr/v1/bankcard?access_token=";
							break;
					}
					// console.log(baiduUrl + res.data.data)
					uni.request({
						url: baiduUrl + res.data.data,
						method: 'POST',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						data: {
							image: bitmap.toBase64Data(),
							id_card_side: 'front',
						},
						success: (data) => {
							bitmap.recycle();
							resolve(data.data);
						},
						fail: (error) => {
							rej(error)
						}
					})
				},
				fail: (res) => {
					uni.showToast({
						title: res.msg + '',
						icon: 'none'
					})
				}
			})
		});
		// #endif
	})
}
