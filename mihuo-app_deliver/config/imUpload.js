import imConfig from "@/config/imConfig.js"
export function imUpload(temp) {
	const imUserInfo = uni.getStorageSync('imUserInfo');
	return new Promise((resolve, rej) => {
		uni.uploadFile({
			url: imUserInfo.baseUrl + '/api/Common/UploadSmallFile',
			filePath: temp,
			name: 'file',
			header: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Authorization': 'Bearer' + ' ' + imUserInfo.token,
				'VERSION': imConfig.VERSION
			},
			success: (res) => {
				let data=JSON.parse(res.data);
				resolve(data.data)
			},
			fail: (res) => {
				resolve(0)
				uni.showToast({
					title: "发送失败,请检查网络",
					icon: "none"
				});
			},
		});

	})
}
