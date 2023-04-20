<template>
	<!-- 首页隐私政策 -->
	<view style="background: tranparent;">
		<!-- 背景图 -->
		<!-- <image src="../../static/img/xybg.png" :style="`width: ${windowWidth}px;height: ${windowHeight}px;`"></image> -->
		<view class="center_content" :style="`width: 750rpx;height: ${windowHeight}px;`">
			<view class="flex flex-column bg-white rounded-3" style="width: 600rpx;height: 550rpx;">
				<view class="flex align-center justify-center border-bottom " style="height: 120rpx;">
					<text style="color:#FF9A52;">用户协议和隐私政策</text>
				</view>
				<view class="flex-1" style="padding: 0 40rpx;">
					<view class="text-muted font">请你务必审慎阅读、充分理解觅活相关的<text class="textcolor"
							@click.stop="toPage('/pages/privacy/privacy')">《隐私政策》</text>和<text class="textcolor"
							@click.stop="toPage('/pages/serviceAgreement/serviceAgreement')">《用户协议》</text>各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、位置等信息用于给您提供优质服务。你可阅读服务协议和隐私政策了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。
					</view>
				</view>
				<view class="flex " style="height: 30rpx;"></view>
				<view style="width:100%;height:80rpx;display: flex;background-color:">
					<view style="flex:1;line-height: 80rpx;text-align: center;border-right: 1px solid #eee;"
						@click="quit"><text class="text-muted">退出应用</text></view>
					<view style="flex:1;line-height: 80rpx;text-align: center;" @click="submit"><text class="text-white"
							style="color:#ff5d35;">同意</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowHeight: 0,
				windowWidth: 0
			}
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			this.windowWidth = res.windowWidth
			this.windowHeight = res.windowHeight
		},
		methods: {
			// 同意隐私
			submit() {
				plus.runtime.agreePrivacy();
				uni.navigateBack();
			},
			// 退出应用
			quit() {
				plus.runtime.disagreePrivacy();
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						plus.runtime.quit();
						break;
					case 'ios':
						plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
						break;
				}
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: rgba($color: #000000, $alpha: 0.3);
	}
	.center_content {
		margin: 450rpx 75rpx;
		border-radius: 15rpx;
		overflow: hidden;
		background: transparent;

		.text-muted {
			color: #666;
			font-size: 28rpx;
		}

		.bg-white {
			overflow: hidden;
			border-radius: 15rpx;
			overflow: hidden;
			background-color: #fff;
		}

		.textcolor {
			color: $themeColor;
			font-size: 30rpx;
		}
	}
</style>
