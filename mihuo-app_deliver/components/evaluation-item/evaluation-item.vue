<template>
	<view class="evaluation-list">
		<view class="item-evaluation" @click="getDetails" v-if="info">
			<view class="top">
				<u-avatar size="74" :src="$util.thumbnailImage(info.avatar,true)" mode="circle">
				</u-avatar>
				<view class="personnel">
					<view class="item-personnel">
						<text class="item-name">{{ info.name}}({{info.jobName}})</text>
						<text class="item-status">已评价</text>
					</view>
					<mihuo-rate v-if="this.allNumShow" title="" v-model="allNum" show></mihuo-rate>
				</view>
			</view>
			<view class="tab-list">
				<text class="item-tab" v-for="(item,index) in info.labelsList":key="index" >{{item}}</text>
			</view>
			<view class="describe">
				{{info.contents}}
			</view>
			<view class="image-contain" v-if="info.pics">
				<image-show :imgSrc="info.pics" right="20"></image-show>
			</view>
			<slot></slot>
			<view class="bottom-contain">
				<u-avatar size="36" :src="$util.thumbnailImage(info.dealAvatar,true)" mode="circle">
				</u-avatar>
				<text class="item-name">{{info.dealRealName}}({{info.dealJobName}}) </text>
				<text class="item-time" v-if="info.created">{{info.created.substring(0,16)}}评价</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'evaluation-item',
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				},
			},
			jump: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				rateNum: 5,
				allNum:0,
				allNumShow:false
			}
		},
		onLoad() {

		},
		mounted() {
			this.setAllNum()
		},
		methods: {
			setAllNum(){
				let temp = this.info.deliveryScore + this.info.serveScore + this.info.nodeScore
				if(temp > 0){
					this.allNum = Math.round(temp / 3)
					this.allNumShow = true
				}
			},
			getDetails() {
				if (!this.jump) {
					this.toPage(`/pages/construction/evaluation/evaluationDetails?personId=${this.info.execPersonId}`)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluation-list {

		.item-evaluation {
			margin: 0rpx 20rpx 6rpx 20rpx;
			background-color: $bgColor;
			padding: 44rpx 0rpx 42rpx 60rpx;
			border-bottom-left-radius: $miniBorderRadius;
			border-bottom-right-radius: $miniBorderRadius;

			&:last-child {
				margin: 0rpx 20rpx 0rpx 20rpx;
			}

			.top {
				display: flex;
				margin-bottom: 28rpx;
				padding-right: 40rpx;

				.personnel {
					width: 100%;
					margin-left: 12rpx;

					.item-personnel {
						display: flex;
						justify-content: space-between;
						margin-bottom: 6rpx;

						.item-name {
							font-weight: bold;
							font-size: $middleFontSize;
							color: $seconFontColor;
						}

						.item-status {
							font-size: $smiddleFontSize;
							color: $themeColor;
						}

					}
				}
			}

			.tab-list {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 14rpx;

				.item-tab {
					padding: 8rpx 18rpx;
					background-color: rgba(29, 70, 175, 0.1);
					font-size: $smiddleFontSize;
					color: $themeColor;
					border-radius: $miniBorderRadius;
					margin-right: 14rpx;
					margin-bottom: 14rpx;
				}
			}

			.describe {
				font-size: $smiddleFontSize;
				color: $mainFontColor;
				margin-bottom: 20rpx;
				padding-right: 40rpx;
			}

			.image-contain {
				margin-bottom: 30rpx;
			}

			.bottom-contain {
				display: flex;
				align-items: center;
				padding-right: 40rpx;

				text {
					font-size: $smallFontSize;
				}

				.item-name {
					margin: 0 10rpx 0 10rpx;
					color: $mainFontColor;
				}

				.item-time {
					color: $viceFontColor;
				}
			}
		}
	}
</style>
