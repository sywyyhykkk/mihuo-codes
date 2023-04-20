<template>
	<view class="complaint-list-contain">
		<public-module></public-module>
		<view class="top-nav-bar">
			<view class="nav-view">
				<image class="arrow_back" src="/static/icon/arrow_back.png" mode="" @click="goBack"></image>
				<view>
					<message-tabs :items="itemList" :current="currentIndex" @clickItem="onClickItem" />
				</view>
			</view>
		</view>
		<u-tabs class="u-tabs-contain" :active-color="$styleColor.themeColor"
			:list="typeNameStatus === true ? applyTypeList : drawingsType" font-size="26" bar-height="4"
			inactive-color="#606166" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="list-contain">
			<view class="item-contain" v-for="(item,index) in  list" @click="getDetais(item)" :key="index">
				<view class="top">
					<view class="left">{{item.applyTypeName}}</view>
					<view class="right">
						<text class="status"
							:style="{color: getOrderStatus(item).color,background:getOrderStatus(item).bgColor}">{{getOrderStatus(item).text}}</text>
					</view>
				</view>
				<view class="desc-contain">
					<view class="personnel-information">
						<u-avatar class="node" size="32" :src="$util.thumbnailImage(item.person.avatar,true)">
						</u-avatar>
						<view class="name">{{item.person && item.person.name}}({{item.person.skillName}})
							{{item.applyTime}}
						</view>
					</view>
					<view class="information-desc">{{item.comment}}</view>
				</view>
				<view class="bottom" :style="{color: getOrderStatus(item).color}">
					<!-- -1->查询全部 0->已发起待处理 1->撤销 2->同意 3->驳回 -->
					{{item.status === 0 ? '等待':''}}{{item.dealPerson && item.dealPerson.name}}
					({{item.dealPerson && item.dealPerson.skillName}})
					{{[2,3].includes(item.status) === true ? item.dealTime && item.dealTime.substring(0,16) :''}}
					{{item.status === 2 ? '审核通过':''}}
					{{item.status === 3 ? '审核不通过':''}}
					{{item.status === 0 ? '处理':''}}
				</view>
			</view>
			<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
		</view>


		<!-- <bottom-button :title="typeNameStatus ? '发起申请':'发起申述'" @click="submit()">
		</bottom-button> -->

		<mihuo-bottom-button :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				current: 0,
				currentIndex: 0,
				titleIndex: 0,
				drawingsType: [{
						name: '全部',
						value: -1
					},
					{
						name: '已发起',
						value: 0
					},
					{
						name: '申诉成功',
						value: 2
					},
					{
						name: '申诉失败',
						value: 3
					}
				],
				applyTypeList: [{
						name: '全部',
						value: -1
					},
					{
						name: '已发起',
						value: 0
					},
					{
						name: '已拒绝',
						value: 3
					},
					{
						name: '已通过',
						value: 2
					}
				],
				itemList: ['我发起的', '发送给我的'],
				list: [],
				pageType: '我发起的',
				typeNameStatus: false,
				applyTypes: '',
				total: 0,
				personId: '',
				pageCurrent: 1,
				size: 10,
				projectId: ''
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.pageCurrent = 1
			this.parameterType()
		},
		onReachBottom() {
			if (this.list.length === this.total) return
			this.getData()
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'remainingDays']),
			buttonList() {
				return [{
					name: this.typeNameStatus ? '发起申请' : '发起申述',
					status: true
				}]
			}
		},
		methods: {
			parameterType() {
				if (['申请', '申述'].includes(this.option.type)) {
					if (!this.option.noticeType) {
						this.$notificationsJump(this.option)
					}
					uni.setStorageSync('typeName', this.option.type)
					this.projectId = this.option.projectId
				} else {
					this.projectId = this.projectInfo.projectId
				}
				this.personId = this.userPersonInfo.personId
				this.getTypeName()
			},
			goBack() {
				uni.navigateBack()
			},
			getTypeName() {
				if (uni.getStorageSync('typeName') === '申请') {
					this.typeNameStatus = true
				} else {
					this.typeNameStatus = false
				}
				this.getData()
			},
			getOrderStatus(val, type) {
				switch (val.status) {
					case 0:
						return {
							text: '已发起',
								color: '#002FA5',
								bgColor: ' #E1EEFF'
						}
						case 1:
							return {
								text: '撤销',
									color: '#FF5D35',
									bgColor: ' #FFE9D9'
							}
							case 2:
								return {
									text: this.typeNameStatus === true ? '申请成功' : '申述成功',
										color: '#10C57D',
										bgColor: ' #D5FFEE'
								}
								case 3:
									return {
										text: this.typeNameStatus === true ? '申请失败' : '申述失败',
											color: '#FF5D35',
											bgColor: ' #FFE9D9'
									}
				}
			},
			getStatus() {
				let tempStaus = -1
				if (this.current) {
					tempStaus = this.typeNameStatus === true ? this.applyTypeList[this.current].value : this.drawingsType[
						this.current].value
				} else {
					tempStaus = -1
				}
				return tempStaus
			},
			getData() {
				this.$httpApi.getBizapplyPage({
					status: this.getStatus(),
					cuStatus: this.titleIndex,
					projectId: this.projectId, // 项目id,
					classification: this.typeNameStatus === true ? 1 : 2, //分类（申请=1；申诉=2）
					size: this.size,
					current: this.pageCurrent,
					personId: this.personId
				}).then(res => {
					if (res) {
						this.total = res.total
						this.list = this.pageCurrent > 1 ? this.list.concat(res.records) : res.records
						this.pageCurrent += 1
					}
				})
			},
			onClickItem(e) {
				this.titleIndex = e.currentIndex;
				this.pageType = e.currentIndex === 0 ? '我发起的' : '发送给我的'
				this.list = []
				this.pageCurrent = 1
				this.getData()

			},
			change(index) {
				this.current = index
				this.pageCurrent = 1
				this.getData()
			},
			submit() {
				this.toPage(`/pages/construction/complaint/complaintForm`)
			},
			getDetais(item) {
				this.toPage(
					`/pages/construction/complaint/complaintDetails?id=${item.id}&pageType=${this.pageType}`
				)
			},
			imgPreview(url) {
				uni.previewImage({
					current: url,
					urls: [url],
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.complaint-list-contain {
		padding-bottom: 140rpx;

		.top-nav-bar {
			width: 100%;
			background: #FFFFFF;
			position: fixed;
			top: 0;
			z-index: 20;

			.nav-view {
				position: relative;

				.arrow_back {
					position: absolute;
					left: 0;
					top: calc(14rpx + var(--status-bar-height));
					width: 44rpx;
					height: 44rpx;
					z-index: 999;
					margin-left: 24rpx;
				}
			}
		}

		.tab-title-contain {
			display: flex;

			.title-left {
				margin-right: 44rpx;
			}

			.title-wire {
				background: linear-gradient(90deg, #013E75 1.72%, rgba(255, 255, 255, 0) 97.41%);
				border-radius: 110rpx;
				height: 12rpx;
				width: 134rpx;
			}

			.title-wire2 {
				height: 12rpx;
				width: 134rpx;
			}

			.title-text {
				font-style: normal;
				font-weight: bold;
				font-size: 36rpx;
				text-align: center;
				color: $themeColor;
			}

			.title-text2 {
				font-style: normal;
				font-weight: bold;
				font-size: 32rpx;
				text-align: center;
				color: $seconFontColor;
				// transition: all .3s;
			}
		}

		.u-tabs-contain {
			box-shadow: 0px 3px 4px rgba(183, 183, 183, 0.25);
			// position: -webkit-sticky;
			// position: sticky;
			// top: 88rpx;
			width: 100%;
			position: fixed;
			top: calc(84rpx + var(--status-bar-height));
			z-index: 10;
		}

		.list-contain {
			margin: 14rpx 20rpx 0 20rpx;
			padding-top: calc(86rpx + 86rpx + var(--status-bar-height));

			.item-contain {
				background-color: #FFFFFF;
				padding: 52rpx 36rpx 28rpx 46rpx;
				border-radius: 16rpx;
				margin-bottom: 6rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.top {
					display: flex;
					justify-content: space-between;
					margin-bottom: 8rpx;

					.left {
						font-weight: bold;
						font-size: 30rpx;
						color: $seconFontColor;
					}

					.status {
						font-size: 24rpx;
						color: $themeColor;
						padding: 4rpx 14rpx;
						background: #E1EEFF;
						border-radius: 0px 20rpx 20rpx 20rpx;
					}
				}

				.desc-contain {
					padding-bottom: 28rpx;
					border-bottom: 1px dashed #EEEEEE;
					margin-bottom: 28rpx;

					.personnel-information {
						display: flex;
						align-items: center;
						margin-bottom: 16rpx;

						.name {
							margin-left: 6rpx;
							font-size: 24rpx;
							color: #606166;

						}
					}

					.information-desc {
						font-size: 26rpx;
						color: #606166;
					}
				}

				.bottom {
					font-size: 24rpx;
					color: $themeColor;
				}
			}
		}

		.submit-text {
			display: flex;
			position: fixed;
			bottom: 0;
			justify-content: center;
			width: 624rpx;
			margin: 20rpx 64rpx 20rpx 64rpx;
			background: $themeColor;
			color: #FFFFFF;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 88rpx;
			border-radius: 10rpx;
		}

		/deep/ .u-tab-bar {
			bottom: -4rpx;
		}
	}
</style>
