<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>

		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				我的反馈
			</view>
		</z-nav-bar>
		<u-gap height="2" bg-color="#f5f5f5"></u-gap>
		<view class="list" v-for="(item, index) in itemList" :key="index">
			<view class="top_view">
				<view class="dot" />
				<view class="title">{{item.head}}</view>
				<image class="arrow" src="/static/images/mine/list_right_arrow.png"
					:style="item.open?'transform:rotate(90deg);':''" @click="open(index)" />
			</view>
			<view class="body" v-if="item.open">{{item.body}}</view>
		</view>

		<view class="submit" @click="addFeedBack">新增反馈</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList: [{
					head: "111",
					body: "1111111111111111111111",
					open: true,
				}, {
					head: "111",
					body: "1111111111111111111111",
					open: true,
				}, {
					head: "111",
					body: "1111111111111111111111",
					open: true,
				}],

			}
		},
		
		methods: {
			addFeedBack(){
				
			},
			open(i){
				this.itemList[i].open = !this.itemList[i].open
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
	.list{
		padding: 40rpx 0;
		margin: 0 46rpx;
		border-bottom: 1px dashed #E7E7E7;
		&:nth-last-child(1){
			border-bottom: none;
		}
		.top_view{
			display: flex;
			align-items: center;
			.dot{
				width: 12rpx;
				height: 12rpx;
				margin-right: 12rpx;
				border-radius: 50%;
				background: $themeColor;
			}
			.title{
				width: calc(100% - 12rpx - 16rpx);
				font-weight: 400;
				font-size: $middleFontSize;
				color: $seconFontColor;
				@include toe()
			}
			.arrow{
				width: 16rpx;
				height: 30rpx;
				transition: all .2s;
			}
		}
		
		.body{
			font-size: $smiddleFontSize;
			line-height: 18px;
			color: $viceFontColor;
			margin: 26rpx 28rpx 0 12rpx;
		}
	}

	.submit {
		margin: 80rpx 60rpx 0 60rpx;
		line-height: 90rpx;
		background: $themeColor;
		border-radius: 10rpx;
		text-align: center;
		font-weight: bold;
		font-size: 28rpx;
		color: #FFFFFF;

	}

	.feedback {
		// height: 120rpx;
		margin: 0 44rpx 0 44rpx;
		border-bottom: 2rpx dashed #E7E7E7;

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
			background: $themeColor;
			width: 12rpx;
			height: 12rpx;
			border-radius: 12rpx;
			float: left;
			margin-top: 54rpx;
		}
	}

	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		text-align: center;
		color: #333333;
	}

	page {
		background-color: #FFFFFF;
	}
</style>
