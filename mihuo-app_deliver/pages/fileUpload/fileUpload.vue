<template>
	<view>
		<web-view :src="'/hybrid/html/index.html?info=' + info " @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import base from '@/config/baseUrl';

	export default {
		data() {
			return {
				info: encodeURIComponent(JSON.stringify({
					url: base.baseUrl + 'admin/sys-file/upload',
					header: {
						"Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryaNeDHcaXcRAuGjKU",
						'Authorization': uni.getStorageSync('userInfo').token_type + ' ' + uni.getStorageSync(
							'userInfo').access_token,
						'VERSION': base.apiVersion
					}
				}))
			}
		},
		onLoad() {

		},
		methods: {
			handleMessage(evt) {
				let msg = '@message传递数据：' + JSON.stringify(evt.detail.data)
				console.log("evt.detail.data", evt.detail.data);
				let fileData = evt.detail.data[0].action
				uni.showModal({
					content: msg,
					showCancel: false
				});
				console.log("tempUrL", tempUrL);
				
				// todo 写入到store中
			}
		}
	}
</script>
