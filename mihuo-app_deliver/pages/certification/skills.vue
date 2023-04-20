<template>
	<view class="skills-page">
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<z-nav-bar bgColor="#002FA5" fontColor="#FFFFFF">
			<view class="nav-bar" slot="default">
				技能认证
			</view>
		</z-nav-bar>
		<view class="contain">
			<view class="contain-top"></view>
			<view class="contain-details">
				<view class="item workers">
					<view class="item-left">
						<view class="item-page-contain">
							<image class="item-image" src="/static/images/worker2.png"></image>
						</view>
						<view class="item-information">
							<view class="item-title">我是工人</view>
							<view class="item-introduce">{{introduce}}</view>
						</view>
					</view>
					<view class="item-operation" @click="certification('工人','JOB_WORKER')">去认证</view>
				</view>
				<view class="list-contain" v-if="workTypeList.length > 0">
					<view class="item workers" v-for="(item,index) in workTypeList" :key="index">
						<view class="item-left">
							<view class="item-page-contain">
								<image class="item-image" :src="item.src"></image>
							</view>
							<view class="item-information">
								<view class="item-title">我是{{item.skillName}}</view>
								<view class="item-introduce">{{item.introduce}}</view>
							</view>
						</view>
						<view class="item-operation" @click="certification(item)">去认证</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// threeDImgUrl: require("@/static/imgs/common/100x60rpx.png"),
				option: {},
				introduce: '新增工种技能认证',
				hasManager: false,
				hasSupervision: false,
				workTypeList: [],
				personInfo: '',
				workType: [{
						code: 'JOB_MANAGER',
						url: '/static/images/manager2.png',
						introduce: '新增技能认证',
					},
					{
						code: 'JOB_DESIGNER',
						url: '/static/images/shejishi.png',
						introduce: '新增技能认证',
					},
					{
						code: 'JOB_SUPERVISION',
						url: '/static/images/supervisor2.png',
						introduce: '新增技能认证',
					}
				]
			}
		},
		onLoad(option) {
			this.getTypeList()
		},
		onShow() {
			this.getPersonInfo()
		},
		methods: {
			getTypeList() {
				this.$httpApi.getWorkType({
					type: 1,
					clientType: 'platform',
					size: 99
				}).then(res => {
					if (res) {
						res.records = res.records.filter(item =>!['JOB_DEFAULT','JOB_OUTSOURCING'].includes(item.jobCode))
						this.workTypeList = res.records
						this.workTypeList.map(item => {
							item['src'] = this.setSrc(item)
							item['introduce'] = this.setIntroduce(item)
						})
					}
				})
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.personInfo = res;
					}
				})
			},
			certification(item) {
				let tempUser = this.personInfo.personageList.find(el => el.skillId == item.skillId)
				if (tempUser && tempUser.auditStatus == 2) {
					this.$util.toast(`您已经拥有${tempUser.skillName}的技能认证了~`)
					return
				} else {
					this.toPage(
						`/pages/certification/information?jobCode=${item.jobCode}&name=${item.skillName ? '其他':item}&skillId=${item.skillId}&skillName=${item.skillName} `
						)
				}
			},
			setSrc(item) {
				let tempSrc = this.workType.find(el => el.code == item.jobCode)
				if (tempSrc) {
					return tempSrc.url
				} else {
					return '/static/images/manager2.png'
				}
			},
			setIntroduce(item) {
				let tempSrc = this.workType.find(el => el.code == item.jobCode)
				if (tempSrc) {
					return tempSrc.introduce
				} else {
					return '新增技能认证'
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	$orangeColor:linear-gradient(90deg, $themeColor 10%, $themeColor 100%);
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title(#FFFFFF)
	}

	.item-image {
		width: 98rpx;
		height: 98rpx;
	}

	.skills-page {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item-left {
				display: flex;
			}

		}

		.workers {
			background: #FFFFFF;
			padding: 32rpx 52rpx 34rpx;
			margin: 20rpx 14rpx;
			border-radius: 16rpx;
		}

		.contain-top {
			height: 224rpx;
			background: $orangeColor;
		}

		.contain-details {
			margin-top: -160rpx;
		}

		.item-page-contain {
			margin-right: 24rpx;
			border-radius: 50%;

		}

		.item-information {
			.item-title {
				margin-bottom: 10rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #333333;
			}

			.item-introduce {
				font-size: 24rpx;
				color: #999999;
				margin-right: 54rpx;
				line-height: 1.5;
				// width: 312rpx;
			}
		}

		.item-operation {
			color: #FFFFFF;
			background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
			border-radius: 10rpx;
			font-size: 24rpx;
			padding: 16rpx 24rpx 14rpx 24rpx;
			white-space: nowrap;
		}
	}
</style>
