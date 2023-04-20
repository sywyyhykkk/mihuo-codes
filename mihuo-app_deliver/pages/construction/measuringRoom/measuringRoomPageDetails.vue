<template>
	<view class="details-page">
		<public-module></public-module>
		<z-nav-bar backState="1000" bgColor="#FFF" fontColor="#979797">
			<view slot="default" class="nav-bar-title">
				量房详情
			</view>
			<view slot="right" class="nav-bar-right" @click="cutView">
				编辑
			</view>
		</z-nav-bar>
		<view class="information-contain">
			<measuring-room-information :key="roomKey" :info="info" :jumpStatus="false"></measuring-room-information>
		</view>
		<view class="space-information">
			<u-tabs height="104" class="u-tabs-contain" :list="drawingsType" font-size="26" bar-height="4"
				inactive-color="#606166" :is-scroll="false" :current="current" @change="change"></u-tabs>

			<view class="space-contain-all" v-if="current === 0">
				<!-- <u-sticky  offset-top="140" class="space-list-sticky"> -->
					<view class="space-grouping">
						<view class="space-grouping-list">
							<text class="item-spaec" :class="[index === selectSpaecIndex ? 'active':'no-active' ]"
								v-for="(item,index) in spaceList" :key="index"
								@click="selectSpaec(index)">{{item.attributeName}}</text>
						</view>
					</view>
				<!-- </u-sticky> -->
				<view class="grouping-details">
					<!-- <scroll-view class="grouping-details-scroll-view" :scroll-y="true" :scroll-with-animation="true" :scroll-into-view="intoView"> -->
					<view class="item-grouping-details" v-for="(item,index) in spaceList" :key="index"
						:id=" 'item_'+ index">
						<view class="item-title public-flex">
							<view class="left">{{item.attributeName}}</view>
							<view class="right public-flex-center" @click="clickOpen(index)">
								<text>点击{{item.showStatus?'收起':'展开'}}</text>
								<image :class="[item.showStatus ? 'block':'none']" src="/static/images/bottom-icon.png">
								</image>
							</view>
						</view>
						<!-- 	<view class="item-contain" :style="{'display':item.showStatus ? 'block':'none'}"
							v-for="(el,num) in item.newGrouping" :key="num">
							<view class="list-item-contain">
								<view class="list-item title-top public-flex">
									<view class="left">{{el.name}}</view>
									<view class="right"></view>
								</view>
								<view class="list-item public-flex" v-for="(ev,nums) in el.list" :key="nums">
									<view class="left">{{ev.attributeName}}</view>
									<view class="right">{{ev.attributeValue}}{{ev.attributeUnit}}</view>
								</view>
							</view>
						</view> -->
						<view class="item-contain" :style="{'display':item.showStatus ? 'block':'none'}"
							v-for="(el,num) in item.children" :key="num">
							<view class="list-item-contain">
								<view v-if="el.attributeName.includes('空间名称')" class="list-item title-top public-flex">
									<view class="left">{{el.attributeValue}}</view>
									<view class="right"></view>
								</view>
								<view class="list-item public-flex" v-for="(ev,nums) in el.children" :key="nums">
									<view class="left">{{ev.attributeName}}</view>
									<view class="right">{{ev.attributeValue}}{{ev.attributeUnit}}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- </scroll-view> -->
				</view>
			</view>
			<view v-else class="housing-information">
				<view v-for="(item,index) in questionnaireList" :key="index">
					<view class="item-housing" v-for="(el,num) in item.surveyTemplateQuesDTOList" :key="num">
						<view class="left">0{{num+1}}</view>
						<view class="right">
							<text class="title">{{el.quesName}}</text>
							<view class="desc">
								<text class="desc-item" v-if="el.quesType !== '4'">{{ el.answer}}</text>
								<view class="image-contian" v-if="el.answer && el.quesType=== '4'">
									<image-show :imgSrc="el.answer" right="20" open></image-show>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="housing-information-no">
					<mh-empty v-show="questionnaireList.length === 0" icon="/static/images/no_recommend.png"
						title="您还没有数据～～" />
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
				details: {},
				detailsShow: true,
				jobNameAll: '',
				info: {},
				current: 0,
				selectSpaecIndex: 0,
				intoView: '',
				personId: '', // 当前登录人员personId
				nodeId: '', // 任务编号
				projectId: '', //项目编号
				drawingsType: [{
						name: '空间信息',
						value: -1
					},
					{
						name: '房屋信息',
						value: 0
					},
				],
				groupingList: [{
					label: '卧室',
					value: 1
				}, {
					label: '客厅',
					value: 2
				}, {
					label: '厨房',
					value: 3
				}, {
					label: '卫生间',
					value: 4
				}],
				spaceList: [],
				questionnaireList: [],
				navigationBarHeight: 50,
				informationContainHeight: 0,
				roomKey:0,
			}
		},
		onLoad() {},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo', 'nodeInfo'])
		},
		onShow() {
			this.setParameters()
			this.getSpatialInformation()
			this.getHousingInformation()
			this.roomKey++
		},
		onReady() {
			this.setHeight()
		},
		methods: {
			setParameters() {
				this.personId = this.userPersonInfo.personId
				this.nodeId = this.nodeInfo.nodeId
				this.projectId = this.projectInfo.projectId
			},
			setHeight() {
				setTimeout(() => {
					uni.createSelectorQuery().select('.information-contain').boundingClientRect(data => {
						this.informationContainHeight = data.height;
					}).exec();
				}, 300);
			},
			getSpatialInformation() { // 空间信息
				if (!this.projectId) {
					return
				}

				this.$httpApi.getRoomTypeAndSpaceList({
					id: this.projectId
				}).then(res => {
					if (res) {
						this.spaceList = res
						this.spaceList.map(item => {
							item['showStatus'] = true
						})
						this.spaceList = this.spaceList.filter(item => Number(item.attributeValue) !== 0)
					}
				})
			},
			unique(arr, key) {
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[key])) {
						map.set(item[key], item)
					}
				})
				return [...map.values()]
			},
			getHousingInformation() { // 房屋信息
				if (!this.nodeId) {
					return
				}
				this.$httpApi.selectRoomGet({
					nodeId: this.nodeId,
				}).then(res => {
					if (res) {
						this.surveyTemplateId = res.answer.surveyTemplateId
						this.questionnaireList = res.answer.answerContent !== '' && JSON.parse(res.answer
							.answerContent)
					}
				})
			},
			getJumpPage(val) {
				switch (val) {
					case '录入量房信息':
						this.toPage(`/pages/construction/disclosure/addDisclosure`)
						break
					case '查看详情':
						this.toPage(`/pages/construction/disclosure/initiatePage`)
						break
				}
			},
			change(index) {
				this.current = index
			},
			selectSpaec(index) {
				this.selectSpaecIndex = index
				this.intoView = 'item_' + index
				uni.createSelectorQuery().select('.grouping-details').boundingClientRect(data => {
					uni.createSelectorQuery().select("#item_" + index).boundingClientRect(res => {
						uni.pageScrollTo({
							duration: 150,
							scrollTop: res.top - data.top + this.navigationBarHeight + this
								.informationContainHeight
						})
					}).exec()
				}).exec()
			},
			clickOpen(index) {
				this.spaceList[index].showStatus = !this.spaceList[index].showStatus
				this.$forceUpdate()
			},
			cutView() {
				this.toPage('/pages/construction/measuringRoom/measuringRoomForm')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-tab-bar {
		bottom: -4rpx;
	}

	/deep/ .u-empty {
		margin-top: 100rpx !important;
	}

	.public-flex {
		display: flex;
		align-items: center;
	}

	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.public-bg-mg {
		margin: 0 20rpx;
		background-color: $bgColor;
	}

	.nav-bar-right {
		font-weight: bold;
		font-size: $middleFontSize;
		color: $viceFontColor;
		padding-right: 56rpx;
	}

	.details-page {
		margin: 16rpx 20rpx 12rpx 20rpx;
		padding-bottom: 40rpx;

		.information-contain {
			margin-bottom: 12rpx;
		}

		.space-information {

			.u-tabs-contain {
				margin-bottom: 6rpx;
				border-radius: $miniBorderRadius;
			}

			.space-grouping {
				background-color: $bgColor;
				padding: 32rpx 64rpx;
				border-top-left-radius: $miniBorderRadius;
				border-top-right-radius: $miniBorderRadius;
				margin-bottom: 2rpx;
				// position: sticky;
				// top: 0rpx;
				
				position: -webkit-sticky;
				position: sticky;
				width: 100%;
				top: calc(88rpx + var(--status-bar-height));
				z-index: 99;
			}

			.space-grouping-list {
				background-color: $bgColor;
				white-space: nowrap;
				overflow-x: scroll;


				&::-webkit-scrollbar {
					display: none;
				}

				.item-spaec {
					font-size: $smiddleFontSize;
					margin-right: 110rpx;
				}

				.active {
					color: $themeColor;
					font-weight: bold;
				}
			}

			.grouping-details {
				.grouping-details-scroll-view {
					// height: 100%;
				}

				.item-grouping-details {
					margin-bottom: 10rpx;
					// padding-bottom: 30rpx;
					background-color: $bgColor;

					&:nth-of-type(1) {
						border-top-left-radius: 0 !important;
						border-top-right-radius: 0 !important;
					}

					&:nth-of-type(1n) {
						border-radius: $miniBorderRadius;
					}
				}

				.item-title {
					padding: 32rpx 22rpx 32rpx 32rpx;
					justify-content: space-between;

					.left {
						font-weight: bold;
						font-size: 30rpx;
						color: $seconFontColor;
					}

					.right {
						text {
							font-size: $smiddleFontSize;
							color: $viceFontColor;
						}

						image {
							margin-left: 10rpx;
							width: 16rpx;
							height: 16rpx;
							transform: rotate(90deg)
						}

						.none {
							transition: all .2s;
							transform: rotate(0deg);
						}

						.block {
							transition: all .2s;
							transform: rotate(90deg);
						}
					}
				}

				.item-contain {
					justify-content: space-between;
					margin: 0 20rpx;
					padding-bottom: 30rpx;


					.list-item-contain {
						background: #F7F9FF;
						opacity: 0.8;
						padding: 0 16rpx 0 16rpx;

						.list-item {
							&:last-child {
								border-bottom: 0;
							}
						}

						.title-top {
							font-weight: bold;
							font-size: $middleFontSize;
							color: $seconFontColor;
						}
					}

					.list-item {
						padding: 36rpx 44rpx 40rpx 18rpx;
						justify-content: space-between;
						border-bottom: 2rpx dashed #EEEEEE;


					}
				}
			}



			.housing-information {


				.item-housing {
					display: flex;
					padding: 30rpx 0 30rpx 30rpx;
					background-color: $bgColor;
					margin-bottom: 2rpx;
					border-radius: $miniBorderRadius;

					.left {
						color: $themeColor;
						opacity: 0.3;
						font-size: $smallFontSize;
						margin-right: 12rpx;
						padding-top: 2rpx;
					}

					.right {
						display: flex;
						flex-direction: column;

						.title {
							font-size: $smiddleFontSize;
							color: $seconFontColor;
							margin-bottom: 14rpx;
						}

						.desc {


							.desc-item {
								color: $themeColor;
								font-size: $middleFontSize;
							}
						}
					}
				}
			}
		}
	}
	
	.space-list-sticky{
		
	}
</style>
