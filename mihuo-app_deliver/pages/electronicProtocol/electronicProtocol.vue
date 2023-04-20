<template>
	<view class="page_bg">
		<view class="nav_custom">
			<image class="back_arrow" src="/static/icon/arrow_back.png" @click="goBack"></image>
			电子协议
		</view>
		<!-- 开通账户流程组件 -->
		<account-step />
		
		<!-- #ifdef APP-PLUS -->
		<web-view :src="electronicProtocol"></web-view>
		<!-- #endif -->
	</view>
</template>
<script>
	export default {
		components: {
			
		},
		data() {
			return {
				electronicProtocol: '',
			}
		},
		onReady() {
		    var currentWebview = this.$scope.$getAppWebview().children()[0];
		    //监听注入的js
		    currentWebview.addEventListener("loaded", function() {
		        currentWebview.evalJS(
		          "$('#burlcl .liveHeader').hide();"
		        );
		    });
		   //设置位置样式
		    currentWebview.setStyle({
		        top: 260,
				bottom: 0
		    })
		},
		onLoad() {
			const currentWebview = this.$mp.page.$getAppWebview();
			setTimeout(() => {
				const ws = currentWebview.children()[0];
				ws.overrideUrlLoading({
					mode: "reject"
				}, (event) => {
					//在这里做跳转就可以
					uni.showModal({
						title: '提示',
						content: '签订成功',
						showCancel: false,
						success: res => {
							if (res.confirm) {
								uni.switchTab({
									url:'/pages/mine/personalCenter'
								})
							}
						}
					});
				})
			}, 2000)
			this.getAgreementUrl()
		},
		methods:{
			getAgreementUrl(){
				uni.showLoading({
					duration: 2000
				})
				this.$httpApi.signPaymentAccountContract().then(res => {
					if(res){
						this.electronicProtocol = res.url
					}
				}).catch(err => console.log(err))
			},
			goBack(){
				uni.switchTab({
					url:'/pages/mine/personalCenter'
				})
			}
		},
		onBackPress() {
			uni.switchTab({
				url:'/pages/mine/personalCenter'
			})
			return true;
		}
	}
</script>

<style lang="scss" scoped>
	.page_bg{
		min-height: 660rpx;
		padding-top: var(--status-bar-height);
		background: linear-gradient(180deg, rgba(7,59,188,.1) 0%, rgba(201, 217, 255, .1) 100%);
		.nav_custom{
			height: 96rpx;
			font-size: 36rpx;
			color: $fontColor33;
			text-align: center;
			line-height: 96rpx;
			position: fixed;
			position: relative;
			.back_arrow{
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				left: 34rpx;
				top: 24rpx;
				z-index: 999;
			}
		}
	}
</style>
