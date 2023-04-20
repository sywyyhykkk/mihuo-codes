<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="2000" bgColor="#ffffff">
			<view slot="left" class="nav-bar-left" @click="goBack">
				<image :src="'../../../static/icon/arrow_left.png'" style="height: 36rpx; width: 24rpx;"></image>
			</view>
			<view slot="default">
				<view class="tab-title title-left" @click="changeTitle(0)">
					<view :class="titleIndex==0?'title-text':'title-text2'">内验</view>
					<view :class="titleIndex==0?'title-wire':'title-wire2'"></view>
				</view>
				<view class="tab-title title-right" @click="changeTitle(1)">
					<view :class="titleIndex==1?'title-text':'title-text2'">外验</view>
					<view :class="titleIndex==1?'title-wire':'title-wire2'"></view>
				</view>
			</view>
		</z-nav-bar>
		<view style="position:fixed;width: 100%;z-index: 200;">
			<u-tabs :list="listStatus" :is-scroll="false" :current="currentNew" @change="clickOrderStatus"
				:scrollable="false" inactive-color="#909299" active-color="#002FA5" font-size="30"></u-tabs>
		</view>
		<view class="order-list">
			<!-- <acceptanceItem v-for="(item,index) in dataList" :data="item" :key="index" :bottomType="false">
			</acceptanceItem> -->
			<view class="acceptance-item" v-for="(item,index) in dataList" :key="index" @click="goDetial(item)">

				<view class="item-title">
					<view class="title-text">{{item.name}}</view>
					<view class="title-status" v-if="item.statusFlag==1">通过</view>
					<view class="title-status status0" v-if="item.statusFlag==0" @click.stop="getAcceptance(item)">待验收
					</view>
					<view class="title-status status2" v-if="item.statusFlag==2">未通过</view>
					<image src="../../../static/icon/home/home_button9.png" v-if="item.statusFlag==0"
						class="home_button"></image>
				</view>
				<view class="item-status">
					<view class="status-dot1">{{item.qualifiedCount+item.unqualifiedCount}}项验收</view>
					<view class="status-dot2">{{item.qualifiedCount}}项合格</view>
					<view class="status-dot3">{{item.unqualifiedCount}}项不合格</view>
				</view>
				<view class="item-person">
					<view class="item-person-contain" v-if="Number(item.checkType) === 1">
						<u-avatar class="node" size="36" :src="$util.thumbnailImage(item.applyAvatar,true)">
						</u-avatar>
						<view class="person-worker-type" v-if="item.applySkillName">
							{{item.applySkillName}}（{{item.applyName}}）</view>
						<view class="person-date" v-if="item.applyTime">
							{{item.applyTime && item.applyTime.substring(0,16)}} 发起</view>
					</view>
					<view class="item-person-contain" v-if="Number(item.checkType) === 2">
						<u-avatar class="node" size="36" :src="$util.thumbnailImage(item.acceptanceAvatar,true)">
						</u-avatar>
						<view class="person-worker-type" v-if="item.acceptanceSkillName">
							{{item.acceptanceSkillName}}（{{item.acceptanceName}}）</view>
						<view class="person-date" v-if="item.acceptanceCreateTime">
							{{item.acceptanceCreateTime && item.acceptanceCreateTime.substring(0,16)}} 发起</view>
					</view>
				</view>
			</view>
			<mh-empty v-show="dataList.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
			<!-- <u-loadmore :status="status" /> -->
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
				status: 'loadmore',
				titleIndex: 0,
				currentNew: 0,
				listStatus: [{
					name: '全部'
				}, {
					name: '待验收'
				}, {
					name: '已通过'
				}, {
					name: '未通过'
				}],
				form: {
					checkType: 1,
					projectId: '',
					status: null
				},
				dataList: [],
				userPersonIdList: []
			}
		},
		onLoad() {
			this.setParameter()

		},
		onShow() {
			this.getData()
		},
		computed: {
			...mapState(['projectInfo'])
		},
		methods: {
			setParameter() {
				this.form.projectId = this.projectInfo.projectId
			},
			goDetial(item) {
				if (item.status == 0) {
					uni.navigateTo({
						url: '/pages/construction/acceptance/acceptanceManagement',
						success: (res) => {
							res.eventChannel.emit('getAcceptanceManagement', {});
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/construction/acceptance/acceptanceDetails?detialId=' + item.id
					})
				}
			},

			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			clickOrderStatus(item) {
				this.currentNew = item
				if (item == 0) {
					this.form.status = null
				} else {
					this.form.status = item - 1
				}
				this.getData()
			},
			changeTitle(index) {
				this.titleIndex = index;
				this.form.checkType = index + 1;
				this.getData()
			},
			getAcceptance(data) {
				let parameter = {}
				if (this.titleIndex == 1) {
					parameter = {
						id: data.id,
						applyPersonId: data.applyPersonId,
						avatar: data.acceptanceAvatar,
						skillName: data.acceptanceSkillName,
						name: data.acceptanceName,
						time: data.applyTime,
						skillId: data.acceptanceSkillId
					}
				} else {
					parameter = {
						id: data.id,
						applyPersonId: data.applyPersonId,
						avatar: data.applyAvatar,
						skillName: data.applySkillName,
						name: data.applyName,
						time: data.applyTime,
						skillId: data.applySkillId
					}
				}
				uni.navigateTo({
					url: '/pages/construction/acceptance/acceptanceManagement',
					success: (res) => {
						res.eventChannel.emit('getAcceptanceManagement', parameter);
					}
				})
			},
			getData() {
				this.$http.get('order/bizorderacceptance/getAcceptancesByProjectId', this.form).then(res => {
					let tempPersonIdListNew = []
					res.map(item => {
						if (item.applyPersonId) {
							tempPersonIdListNew.push(item.applyPersonId)
						}
						if (item.acceptanceCreatePersonId) {
							tempPersonIdListNew.push(item.acceptanceCreatePersonId)
						}
					})
					this.userPersonIdList = [...new Set(tempPersonIdListNew)]
					this.dataList = res
					this.setUser()
				})
			},
			setUser() {
				if (this.userPersonIdList.length === 0) {
					return
				}
				this.$getPersonIdUser(this.userPersonIdList, (res) => {
					this.dataList.map(item => {
						res.map(el => {
							if (Number(item.applyPersonId) === Number(el.personId)) { // 内验
								item['applyAvatar'] = el.avatar
								item['applyName'] = el.name
								item['applySkillName'] = el.skillName
								item['applySkillId'] = el.skillId
							}
							if (Number(item.acceptanceCreatePersonId) === Number(el
								.personId)) { // 外验
								item['acceptanceAvatar'] = el.avatar
								item['acceptanceName'] = el.name
								item['acceptanceSkillName'] = el.skillName
								item['acceptanceSkillId'] = el.skillId
							}
						})
					})
					this.dataList = result
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-list {
		margin-top: 100rpx;

		.acceptance-item {
			margin: 20rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			padding: 40rpx;

			.item-person {
				display: flex;
				align-items: center;
				margin-top: 24rpx;
				height: 32rpx;
				align-items: center;

				.item-person-contain {
					display: flex;
					align-items: center;
				}

				.person-image {
					width: 32rpx;
					height: 32rpx;
					border-radius: 32rpx;
				}

				.person-worker-type {
					font-weight: normal;
					font-size: 24rpx;
					color: $seconFontColor;
					margin-left: 10rpx;
				}

				.person-date {
					font-weight: normal;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.item-status {
				display: flex;
				align-items: center;
				height: 90rpx;
				border-bottom: 2rpx dashed #EEEEEE;

				.status-dot1 {
					background: #EFF6FF;
					border-radius: 50rpx;
					line-height: 40rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: $themeColor;
					padding-left: 10rpx;
					padding-right: 10rpx;
					margin-right: 20rpx;

				}

				.status-dot2 {
					background: #D8FFF0;
					border-radius: 50rpx;
					line-height: 40rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: #3BC548;
					padding-left: 10rpx;
					padding-right: 10rpx;
					margin-right: 20rpx;

				}

				.status-dot3 {
					background: #FFF2E9;
					border-radius: 50rpx;
					line-height: 40rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: #FF5D35;
					padding-left: 10rpx;
					padding-right: 10rpx;
					margin-right: 20rpx;

				}
			}

			.item-title {
				display: flex;
				height: 42rpx;
				align-items: center;

				.title-text {
					flex: 1;
					font-style: normal;
					font-weight: bold;
					font-size: 30rpx;
					text-align: left;
					color: $seconFontColor;
				}

				.title-status {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: normal;
					font-size: 24rpx;
					text-align: right;
					color: #3BC548;
					margin-right: 12rpx;
				}

				.status0 {
					color: $themeColor;
				}

				.status2 {
					color: #FF5D35;
				}

				.home_button {
					width: 16rpx;
					height: 16rpx;
				}
			}
		}

	}

	.nav-bar-left {
		margin-left: 40rpx;
	}

	.tab-title {
		float: left;
		width: 50%;
	}

	.title-wire {
		background: linear-gradient(90deg, $themeColor 1.72%, rgba(255, 255, 255, 0) 97.41%);
		border-radius: 110rpx;
		height: 12rpx;
		width: 134rpx;
	}

	.title-wire2 {
		height: 12rpx;
		width: 134rpx;
	}

	.title-text {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		text-align: center;
		color: $themeColor;
	}

	.title-text2 {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 32rpx;
		text-align: center;
		color: $seconFontColor;

	}

	.title-left {
		padding-right: 46rpx;

	}

	.title-right {
		padding-left: 46rpx;
	}
</style>
