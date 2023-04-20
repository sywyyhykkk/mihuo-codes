<template>
	<view class="sendOrderSuccess-page">
		<z-nav-bar :bgColor="['$themeColor','$themeColor']" fontColor="#FFF" title="任务详情"></z-nav-bar>
		<view class="order-steps">
			<view class="item-contain" v-for="(item,index) in stepsList" :key="index">
				<view class="item-interval" :class="{intervalActive:index === 1 ||  index === 2}"></view>
				<view class="item-steps">
					<view class="item-number-contain">
						<view>
							<view class="item-number" :class="{active:index === 0 || index === 1 }">{{item.lable}}</view>
						</view>
					</view>
					<view class="item-text">{{item.text}}</view>
				</view>
			</view>
		</view>
		<view class="customer-information">
			<image :src="addressUrl" class="address-url" ></image>
			<view class="information">
				<text class="information-name">李先生</text>
				<text class="information-address">云南省昆明市 西山区云纺国际商厦</text>
			</view>
		</view>


		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				addressUrl:require("@/static/images/adder-max.png"),
				stepsList: [{
						lable: '1',
						text: '发布订单'
					},
					{
						lable: '2',
						text: '等待报价'
					},
					{
						lable: '3',
						text: '订单确认'
					},
					{
						lable: '4',
						text: '接单完成'
					},
				],
			}
		},
		onLoad(option) {
			this.option = option
			this.orederDetails()
		},
		methods: {
			orederDetails() {

			}
		},
	}
</script>

<style lang="scss" scoped>
	$orangeColor:linear-gradient(90deg, $themeColor 1%, $themeColor 100%);
	$componentBg:#fff;
	$componentMg:0 20rpx 8rpx 20rpx;
	.order-steps {
		display: flex;
		justify-content: space-around;
		background: $orangeColor;
		padding: 50rpx 34rpx 140rpx 38rpx;

		.item-steps {
			text-align: center;
			flex: 1;
			color: #FFFFFF;
		}

		.item-contain {
			display: flex;
			position: relative;

			&:first-child {
				.item-interval {
					display: none;
				}
			}
		}
		.item-interval {
			height: 2rpx;
			width: 72rpx;
			background-color: #FFB887;
			position: relative;
			top: 50rpx;
			top: 8px;
			left: -8px;
		}

		.item-number-contain {
			display: flex;
			justify-content: center;
		}

		.item-number {
			color: #FF8061;
			width: 40rpx;
			height: 40rpx;
			background-color: #FFDAC1;
			border-radius: 50%;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 8rpx;

		}

		.active {
			color: $themeColor;
			background-color: #FFFFFF;
			font-size: 28rpx;
		}

		.intervalActive {
			background-color: #FFFFFF;
		}

		.item-text {
			white-space: nowrap;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
		}

	}

	.customer-information{
		padding: 36rpx 0 42rpx 36rpx;
		margin: $componentMg;
		background-color:$componentBg;
		border-radius: 16rpx;
		.address-url{
			width: 80rpx;
			height: 80rpx;
		}
	}

</style>
