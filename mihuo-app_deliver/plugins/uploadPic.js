import baseConfig from '@/config/baseUrl';
import {
	GUID
} from './utils.js'
const currentMode = uni.getStorageSync('devModeApi')
let base = baseConfig
if (currentMode) {
	base = currentMode
}
//app的上传
//其他平台的上传参考文档。
//头像的上传这里有点特别所以区分开
export function CommonUpload(pic, isAvatar = false, fileName) {
	const userInfo = uni.getStorageSync('userInfo');
	let urlList = [];
	// 避免有时候中文文件名被转码了获取不到文件
	const picSrc = decodeURIComponent(pic)
	return new Promise((resolve, rej) => {
		uni.uploadFile({
			url: isAvatar ? (base.apiUrl + 'admin/sys-file/upload/avatar') : (base.apiUrl +
				'admin/sys-file/upload'),
			filePath: picSrc,
			name: 'file',
			formData: {
				// 'filename':GUID()+'.jpg'
			},
			header: {
				'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
				'VERSION': base.apiVersion,
			},
			success: (res) => {
				console.log(res);
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
									if (fileName) {
										resolve(parsedResponse.data);
									} else {
										resolve(parsedResponse.data.url);
									}
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
export function CommonWaterMarkUpload(pic, fileName, form) {
	console.log(form)
	const userInfo = uni.getStorageSync('userInfo');
	let urlList = [];
	// 避免有时候中文文件名被转码了获取不到文件
	const picSrc = decodeURIComponent(pic)
	return new Promise((resolve, rej) => {
		uni.uploadFile({
			url: base.apiUrl + 'admin/sys-file/watermark/upload',
			filePath: picSrc,
			name: 'file',
			formData: {
				...form
			},
			header: {
				'Authorization': userInfo.token_type + ' ' + userInfo.access_token,
				'VERSION': base.apiVersion,
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
									if (fileName) {
										resolve(parsedResponse.data);
									} else {
										resolve(parsedResponse.data.url);
									}
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
	const bitmap = new plus.nativeObj.Bitmap();
	return new Promise((resolve, rej) => {
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
	})
}
