<template>
	<view>
		<u-tabs v-if="resultList.length > 1" class="u-tabs-contain" :list="resultList" font-size="26"
			active-color="#002FA5" inactive-color="#606166" bar-height="4" :current="current" @change="change"></u-tabs>
		<view class="list-contain" v-if="resultList.length > 0">
			<view class="detial-title" v-for="(item,index) in setListContain" :key="index">
				<view class="current_skill" v-if="currentSkill">
					{{currentSkill}}
				</view>
				<view>
					<view class="title-text">
						<view class="title-name">{{item.data.name}}</view>
						<view class="title-grade">{{item.data.score}}分</view>
					</view>
					<view class="detial-title-date">
						{{item.data.acceptanceCreateTime && item.data.acceptanceCreateTime.substring(0,10)}}
						{{address && address}}
					</view>
				</view>
				<view class="results-contain">
					<view class="top">
						<text class="left">本次验收结果</text>
						<!-- <text
							:class="[Number(item.data.statusFlag) == 2 ? 'right-error':'right']">{{setStatusFlag}}</text> -->
					</view>
					<view class="desc-contain">
						{{item.data.checkDesc}}
					</view>
					<view class="image-contain" v-if="item.data.acceptancePicFiles">
						<image-show :imgSrc="item.data.acceptancePicFiles" :key="item.data.acceptancePicFiles" width="136" height="136" :enable="true"
							quantityPerLine="4">
						</image-show>
					</view>
					<view class="audio-contain" v-if="item.data.acceptanceVoiceFiles">
						<mihuo-audio :formData="item.data.acceptanceVoiceFiles" :audioIndex="item.data.id" ></mihuo-audio>
					</view>
				</view>
				<view class="title-item">
					<view class="flex-item">
						<view class="item-number">{{item.total}}
						</view>
						<view class="item-text">验收项</view>
					</view>
					<view class="flex-item">
						<view class="item-number num-color">{{item.data.qualifiedCount}}</view>
						<view class="item-text">合格项</view>
					</view>
					<view class="flex-item">
						<view class="item-number num-color2">{{item.data.unqualifiedCount}}</view>
						<view class="item-text">不合格项</view>
					</view>
					<view class="flex-item">
						<view class="item-number num-color3">{{item.data.notCount}}</view>
						<view class="item-text">未验收项</view>
					</view>
				</view>
			</view>
			<view class="non-conformance" v-if="setUnItems&&setUnItems.length>0">
				<view class="non-conformance-title">
					<image :src="'../../../static/icon/Group8813.png'" class="title-image"></image>
					<view class="title-text">不合格项</view>
				</view>
				<view v-for="(item,index) in setUnItems" :key="index">
					<view class="non-conformance-item">
						<view class="item-index">{{index<9?'0'+(index+1):index+1}}</view>
						<view class="item-center">
							<view class="item-title">{{item.itemName}}</view> 
							<view class="item-problem" v-if="item.appendQues">存在问题：{{item.appendQues}}</view>
							<view class="item-problem" v-if="item.appendPlan">整改方案：{{item.appendPlan}}</view>
							<view class="item-image-list">
								<view class="image-contain" v-if="item.appendPicFiles">
									<image-show :imgSrc="item.appendPicFiles" :key="item.appendPicFiles" width="104" height="104"></image-show>
								</view>
								<view class="audio-contain" v-if="item.appendVoiceFile">
									<mihuo-audio :formData="item.appendVoiceFile" :key="item.appendVoiceFile" :audioIndex="index">
									</mihuo-audio>
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
						<!-- {{data.name}} -->
					</view>
					<view class="item-center" v-for="(ev,num) in setDetailList" :key="num">
						<view class="item-center-index">
							<text class="star" v-if="Number(ev.checkFlag)=== 1">* </text>
							<text class="name">{{num<9?'0'+(num+1):num+1}}</text>
						</view>
						<view class="item-center-center">
							<view class="center-title">{{ev.itemName}}</view>
							<view class="center-text">{{ev.standard}}</view>
						</view>
						<image src="../../../static/icon/pass.png" class="pass-image" v-if="ev.passFlag==1"></image>
						<image src="../../../static/icon/noPass.png" class="pass-image" v-if="ev.passFlag==0"></image>
					</view>
				</view>
			</view>
		</view>
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
				items: [],
				unItems: [],
				currentSkill: '',
				address: '',
				option: '',
				current: 0,
				resultList: [],
			}
		},
		onLoad(option) {
			this.option = option
			this.getDetial()
		},
		computed: {
			...mapState(['orderInfo']),
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
			setUnItems() {
				return this.resultList[this.current].unItems
			},
			setListContain() {
				if (this.resultList.length > 0) {
					return [this.resultList[this.current]]
				} else {
					return []
				}
			},
			setDetailList() {
				if (this.resultList.length > 0) {
					if (this.resultList[this.current].data) {
						if (this.resultList[this.current].data.items && this.resultList[this.current].data.items.length >
							0) {
							return this.resultList[this.current].data.items
						} else {
							return []
						}
					} else {
						return []
					}
				} else {
					return []
				}

			}
		},
		methods: {
			setParameter() {
				// this.address = this.orderInfo.address
			},
			getDetial(id) {
				let acceptanceIds = JSON.parse(this.option.acceptanceIds)
				this.resultList = []
				if (acceptanceIds.length > 0) {
					this.$customForeach(acceptanceIds, async (el, index) => {
						await this.$http.get(`order/bizorderacceptance/getAcceptance/${el.itemId}`).then(
							res => {
								if (res) {
									this.data = res
									this.items = res.items
									this.unItems = []
									res.items.map(data => {
										if (data.passFlag == 0) {
											this.unItems.push(data)
										}
									})
									this.resultList.push({
										skillId: el.skillId,
										skillName: el.skillName,
										name: el.skillName,
										// value: el.skillId,
										data: res,
										unItems: this.unItems,
										total: res.unqualifiedCount + res.qualifiedCount + res
											.notCount
									})
									this.currentSkill = this.resultList[0].skillName
								}
							})
					})
				}
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			change(e) {
				this.current = e
				this.currentSkill = this.resultList[e].skillName
			},
			getRectificationDetails(item) {
				// this.toPage(`/pages/construction/rectification/rectificationDetails?id=${item.id}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-tab-bar {
		bottom: -4rpx;
	}

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
		margin: 16rpx 20rpx 0 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		position: relative;

		.current_skill {
			position: absolute;
			left: 0px;
			top: 0px;
			background: rgba(0, 47, 165, 0.1);
			border-radius: 8px 0px;
			font-size: 24rpx;
			color: #002FA5;
			padding: 2rpx 18rpx;
			display: flex;
		}

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
