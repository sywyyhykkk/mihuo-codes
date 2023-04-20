<template>
	<view>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				我的反馈
			</view>
		</z-nav-bar>
		<view class="feedback" v-for="(item,index) in buttonList" :key="index">
			<view @click="cutType(index)">
				<view class="dot"></view>
				<view class="suppose">{{item.name}}</view>
				<image :class="item.buttonType?'icon_right2':'icon_right'"
					:src="item.buttonType?'https://www.51mihuo.com/static/icon/arrow_buttom.png':'https://www.51mihuo.com/static/icon/arrow_right.png'">
				</image>
				<view style="clear: both;"></view>
				<!-- <image src="."></image> -->
			</view>
			<view class="opinion" v-if="item.buttonType" v-for="item2, index2 in item.problemList" :key="index2">
				<view class="feedback_time">{{item2.created}}</view>
				<view class="feedback_text">{{item2.description}}</view>
				<view v-if="item2.urls">
					<u-lazy-load class="lazy_load" v-for="(item3, index3) in item2.urls" :key="index3"
						:image="$image.imageGlobal+item3.replace('/admin/sys-file/mihuo-test/', '')">
					</u-lazy-load>
					<view style="clear: both;"></view>
				</view>

			</view>
		</view>


		<view class="submit" @click="addFeedBack">新增反馈</view>
		<view style="height: 60rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonList: [{
					name: '功能异常',
					buttonType: false,
					problemType: '1001',
					problemList: []
				}, {
					name: '优化建议',
					buttonType: false,
					problemType: '1002',
					problemList: []
				}, {
					name: '其他反馈',
					buttonType: false,
					problemType: '1003',
					problemList: []
				}],

			}
		},
		onLoad() {
			console.log(this.$image.imageGlobal)
			this.getData(this.buttonList[0].problemType, 0)
		},
		methods: {
			addFeedBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			cutType(index) {
				this.buttonList[index].buttonType = this.buttonList[index].buttonType ? false : true
				this.getData(this.buttonList[index].problemType, index)
			},
			getData(problemType, index) {
				this.$http.get('mall/pmsfeedback/page', {
					current: 1,
					pages: 100,
					problemType: problemType
				}).then(res => {
					if (res) {
						this.buttonList[index].problemList = res.records
						this.buttonList[index].problemList.forEach(item => {
							item.urls = item.urls == null ? [] : item.urls.split(',')
							console.log(item.urls)
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.opinion {
		margin-bottom: 40rpx;
	}

	.lazy_load {
		width: 140rpx;
		height: 140rpx;
		float: left;
		margin-right: 20rpx;
	}

	.submit {
		margin: 80rpx 60rpx 0 60rpx;
		line-height: 90rpx;
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
		border-radius: 10rpx;
		text-align: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #FFFFFF;

	}

	.feedback_text {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #909199;
		margin: 10rpx 40rpx 10rpx 0;

	}

	.feedback_time {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;
		margin: 10rpx 40rpx 10rpx 0;

	}

	.feedback {
		// height: 120rpx;
		margin: 0 44rpx 0 44rpx;
		border-bottom: 2rpx solid #E7E7E7;

		.icon_right2 {
			float: right;
			width: 30rpx;
			height: 18rpx;
			margin-top: 50rpx;
		}

		.icon_right {
			float: right;
			width: 16rpx;
			height: 28rpx;
			margin-top: 46rpx;
		}

		.suppose {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 120rpx;
			color: #303133;
			margin-left: 20rpx;
			float: left;

		}

		.dot {
			background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
			width: 12rpx;
			height: 12rpx;
			border-radius: 12rpx;
			float: left;
			margin-top: 54rpx;
		}
	}

	.nav-bar-right {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 28rpx;
		color: #909199;
		margin-right: 20rpx;
	}

	page {
		background-color: #FFFFFF;
	}
</style>
