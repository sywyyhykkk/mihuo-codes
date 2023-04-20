<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="2000" bgColor="#ffffff">
			<view slot="left" class="nav-bar-left" @click="goBack">
				<image :src="'../../../static/icon/arrow_left.png'" style="height: 36rpx; width: 24rpx;"></image>
			</view>
			<view slot="default" class="nav-bar-title">
				验收详情
			</view>
			<view slot="right">
				<!-- <image src="../../../static/icon/share3.png" style="height: 56rpx; width: 56rpx;margin-right: 20rpx;">
				</image> -->
			</view>
		</z-nav-bar>
		<view class="detial-title">
			<view>
				<view class="title-text">
					<view class="title-name">{{data.name}}</view>
					<view class="title-grade">{{data.score}}分</view>
				</view>
				<view class="detial-title-date">
					{{data.acceptanceCreateTime && data.acceptanceCreateTime.substring(0,10)}} {{address && address}}
				</view>
			</view>
			<view class="results-contain">
				<view class="top">
					<text class="left">本次验收结果</text>
					<text :class="[Number(data.statusFlag) == 2 ? 'right-error':'right']">{{setStatusFlag}}</text>
				</view>
				<view class="desc-contain">
					{{data.checkDesc}}
				</view>
				<view class="image-contain" v-if="data.picFiles">
					<image-show :imgSrc="data.picFiles" width="136" height="136" :enable="true" quantityPerLine="4">
					</image-show>
				</view>
				<view class="audio-contain" v-if="data.voiceFiles">
					<mihuo-audio :formData="data.voiceFiles"></mihuo-audio>
				</view>
			</view>
			<view class="title-item">
				<view class="flex-item">
					<view class="item-number">{{data.unqualifiedCount+data.qualifiedCount+data.notCount}}</view>
					<view class="item-text">验收项</view>
				</view>
				<view class="flex-item">
					<view class="item-number num-color">{{data.qualifiedCount}}</view>
					<view class="item-text">合格项</view>
				</view>
				<view class="flex-item">
					<view class="item-number num-color2">{{data.unqualifiedCount}}</view>
					<view class="item-text">不合格项</view>
				</view>
				<view class="flex-item">
					<view class="item-number num-color3">{{data.notCount}}</view>
					<view class="item-text">未验收项</view>
				</view>
			</view>
		</view>
		<view class="non-conformance" v-if="unItems&&unItems.length>0">
			<view class="non-conformance-title">
				<image :src="'../../../static/icon/Group8813.png'" class="title-image"></image>
				<view class="title-text">不合格项</view>
			</view>
			<view v-for="(item,index) in unItems" :key="index">
				<view class="non-conformance-item">
					<view class="item-index">{{index<9?'0'+(index+1):index+1}}</view>
					<view class="item-center">
						<view class="item-title">{{item.itemName}}</view>
						<view class="item-problem" v-if="item.appendQues">存在问题：{{item.appendQues}}</view>
						<view class="item-problem" v-if="item.appendPlan">整改方案：{{item.appendPlan}}</view>
						<view class="item-image-list">
							<view class="image-contain" v-if="item.appendPicFiles">
								<image-show :imgSrc="item.appendPicFiles" width="104" height="104"></image-show>
							</view>
							<view class="audio-contain" v-if="item.appendVoiceFile">
								<mihuo-audio :formData="item.appendVoiceFile" :key="item.appendVoiceFile"></mihuo-audio>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="non-conformance">
			<view class="non-conformance-title">
				<image :src="'../../../static/icon/Group8813.png'" class="title-image"></image>
				<view class="title-text">验收项明细</view>
			</view>
			<view class="eligible-item">
				<view class="eligible-item-title">
					{{data.name}}
				</view>
				<view class="item-center" v-for="(item,index) in items" :key="index">
					<view class="item-center-index">
						<text class="star" v-if="Number(item.checkFlag)=== 1">* </text>
						<text class="name">{{index<9?'0'+(index+1):index+1}}</text>
					</view>
					<view class="item-center-center">
						<view class="center-title">{{item.itemName}}</view>
						<view class="center-text">{{item.standard}}</view>
					</view>
					<image src="../../../static/icon/pass.png" class="pass-image" v-if="item.passFlag==1"></image>
					<image src="../../../static/icon/noPass.png" class="pass-image" v-if="item.passFlag==0"></image>
					<!-- <view v-if="item.passFlag==0" class="rectification" @click="getRectificationDetails(item)">
						整改
					</view> -->
				</view>
			</view>
		</view>


		<mihuo-bottom-button :buttonList="setButtonList" @click="getButton"> </mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				data: {},
				detailsShow: false,
				items: [],
				unItems: [],
				address: '',
				option: {},
				reviewList: [],
				reviewStaus: [],
				buttonList: [{
					name: '撤销验收',
					status: true
				}]
			}
		},
		onLoad(option) {
			this.option = option
			this.setParameter()
			this.getDetial()
			this.getReviewList()
		},
		computed: {
			...mapState(['orderInfo', 'nodeInfo']),
			setStatusFlag() {
				switch (Number(this.data.statusFlag)) {
					case 0:
						return '待验收'
					case 1:
						return '验收通过'
					case 2:
						return '验收未通过'
				}
			},
			setButtonList() {
				// 接口未加载
				if (!this.detailsShow) {
					return []
				}
				// #29738
				// 1.如果验收节点配置了审查，且已审查，则不允许撤回
				if (this.reviewStaus.length) {
					return []
				}
				
				if (this.orderInfo.orderStatus >= '50') {
					return []
				}

				// 2.如是验收节点未配置审核，但其是结算节点，当结算并支付完成时，不允许撤回(后台处理)
				// 3.未配置审查人员，不允许撤销	
				// if(!this.reviewList.length){
				// 	// return []
				// }
				// 4.已配置审查人员，验收未通过，不允许撤销 ， 验收通过，允许撤销 
				// if([2].includes(Number(this.data.statusFlag))){
				// 	// return []
				// }
				return this.buttonList
			}
		},
		methods: {
			setParameter() {
				this.address = this.orderInfo.address
			},
			getDetial(id) {
				if (!this.option.detialId) {
					return
				}
				this.$httpApi.getAcceptanceId({
					id: this.option.detialId
				}).then(
					res => {
						this.data = res
						this.detailsShow = true
						this.items = res.items
						res.items.map(data => {
							if (data.passFlag == 0) {
								this.unItems.push(data)
							}
						})


					})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			getRectificationDetails(item) {
				// this.toPage(`/pages/construction/rectification/rectificationDetails?id=${item.id}`)
			},
			getReviewList() {
				if (!this.nodeInfo.nodeId) {
					return
				}
				this.$httpApi.getReviewList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						this.reviewList = res
						this.reviewStaus = res.filter(item => item.status !== 0)
					}
				})
			},
			getButton() {
				if (!this.option.detialId) {
					return
				}
				this.$httpApi.revokeAcceptance({
					acceptanceId: this.option.detialId
				}).then(res => {
					if (res) {
						this.$util.toast('撤销成功')
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.non-conformance-item {
		margin: 30rpx 0 0 40rpx;
		display: flex;

		.item-index {
			font-weight: bold;
			font-size: 24rpx;
			color: #909199;
			line-height: 40rpx;
		}

		.item-center {
			width: 100%;
			margin: 0rpx 40rpx 0rpx 10rpx;


			.item-problem {
				font-weight: normal;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #909199;

			}

			.item-image-list {
				margin-top: 10rpx;

				.item-image {
					border-radius: 10rpx;
					width: 76rpx;
					height: 76rpx;
					margin-right: 12rpx;
				}
			}

			.item-title {
				font-weight: normal;
				font-size: 28rpx;
				color: $seconFontColor;
				margin-bottom: 20rpx;
			}
		}
	}

	.eligible-item {
		margin: 40rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx dashed #EEEEEE;

		.eligible-item-title {
			font-weight: bold;
			font-size: 28rpx;
			line-height: 40rpx;
			color: $seconFontColor;

		}

		.item-center {
			display: flex;
			padding-bottom: 30rpx;
			margin-top: 20rpx;
			position: relative;

			.item-center-index {
				margin-left: 10rpx;

				.name {
					font-weight: bold;
					font-size: 24rpx;
					line-height: 42rpx;
					color: #909199;
				}

				.star {
					color: $errorColor;
				}
			}

			.pass-image {
				width: 30rpx;
				height: 30rpx;

			}

			.rectification {
				position: absolute;
				right: 0;
				bottom: 0;
				font-size: $smallFontSize;
				color: $themeColor;
				width: 88rpx;
				height: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx solid #002FA5;
				border-radius: 50rpx;
			}

			.item-center-center {
				margin-left: 2rpx;
				flex: 1;

				.center-title {
					font-weight: normal;
					font-size: 28rpx;
					color: $seconFontColor;
				}

				.center-text {
					font-weight: normal;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;
					margin-top: 20rpx;

				}
			}
		}
	}

	.non-conformance {
		margin: 10rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding-bottom: 20rpx;

		.non-conformance-title {
			display: flex;
			height: 110rpx;
			align-items: center;
			border-bottom: 2rpx solid #EEEEEE;

			.title-image {
				width: 44rpx;
				height: 32rpx;
				margin-left: 40rpx;
			}

			.title-text {
				font-weight: bold;
				font-size: 30rpx;
				color: $seconFontColor;
				margin-left: 10rpx;
			}
		}
	}

	.detial-title {
		margin: 8rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 40rpx;
		display: flex;
		flex-direction: column;

		.results-contain {
			padding-top: 36rpx;

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10rpx;

				.left {
					font-weight: bold;
					font-size: $middleFontSize;
					color: $seconFontColor;
				}

				.right {
					color: $successNewFontColor;
					font-size: $middleFontSize;
				}

				.right-error {
					color: $errorFontColor;
					font-size: $middleFontSize;
				}
			}

			.desc-contain {
				color: $viceFontColor;
				font-size: $smiddleFontSize;
				margin-bottom: 26rpx;
			}
		}

		.title-item {
			display: grid;
			grid-template-columns: auto auto auto auto;
			align-items: center;

			.flex-item {
				margin-top: 20rpx;

				.item-text {
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: center;
					letter-spacing: -0.6rpx;
					color: #909199;
				}

				.item-number {
					font-weight: 900;
					font-size: 40rpx;
					line-height: 56rpx;
					text-align: center;
					letter-spacing: -0.6rpx;
					color: $seconFontColor;
				}

				.num-color {
					color: $themeColor;
				}

				.num-color2 {
					color: #FF5D35;
				}

				.num-color3 {
					color: #aaa4a4;
				}
			}
		}

		.title-text {
			display: flex;
			height: 50rpx;
			align-items: center;

			.detial-title-date {
				font-weight: normal;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #606166;
				margin-top: 4rpx;
			}

			.title-name {
				font-weight: bold;
				font-size: 36rpx;
				text-align: center;
				letter-spacing: -0.6rpx;
				color: $seconFontColor;
			}

			.title-grade {
				flex: 1;
				font-weight: 900;
				font-size: 40rpx;
				text-align: right;
				letter-spacing: -0.6rpx;
				color: $themeColor;
			}
		}
	}

	.nav-bar-left {
		margin-left: 40rpx;
	}

	.nav-bar-title {
		font-weight: 900;
		font-size: 36rpx;
		text-align: center;
		color: #333333;

	}
</style>
