<template>
	<view>
		<view class="tab-contain">
			<u-tabs :list="listStatus" :is-scroll="false" :current="currentNew" @change="clickOrderStatus"
				:scrollable="false" inactive-color="#909299" active-color="#002FA5" font-size="30"></u-tabs>
		</view>
		<view class="order-list">
			<view class="acceptance-item" v-for="(item,index) in dataList" :key="index" @click="goDetial(item)">
				<view class="item-title">
					<view class="title-text">{{item.applyDesc}}</view>
					<!-- <view class="title-text">{{item.name}}</view> -->
					<view class="title-status" v-if="item.statusFlag==1">通过</view>
					<view class="title-status status0" v-if="item.statusFlag==0" @click.stop="getAcceptance(item)">待验收
					</view>
					<view class="title-status status2" v-if="item.statusFlag==2">未通过</view>
					<image src="../../../static/icon/home/home_button9.png" v-if="item.statusFlag==0"
						class="home_button"></image>
				</view>
				<view class="item-person">
					<view class="item-person-contain" >
						<u-avatar class="node" size="36" :src="$util.thumbnailImage(item.applyPersonAvatar,true)">
						</u-avatar>
						<view class="person-worker-type" v-if="item.applySkillName">
							{{item.applySkillName}}（{{item.applyPersonName}}）</view>
						<view class="person-date" v-if="item.applyTime">
							{{item.applyTime && item.applyTime.substring(0,16)}} 发起</view>
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
					name: '全部',
					status: -1
				}, {
					name: '待验收',
					status: 0
				}, {
					name: '已通过',
					status: 1
				}, {
					name: '未通过',
					status: 2
				}],
				status: -1,
				dataList: [],
				userPersonIdList: []
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getData()
		},
		computed: {
		},
		methods: {
			goDetial(item) {
				if (item.statusFlag == 0) {
					uni.navigateTo({
						url: `/pages/orderReceiving/acceptance/acceptanceManagement?id=${this.option.id}&skillId=${item.applySkillId}&itemId=${item.id}&productIds=${item.productIds}`
					})
				} else {
					uni.navigateTo({
						url: '/pages/orderReceiving/acceptance/acceptanceDetails?detialId=' + item.id
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
				this.status = this.listStatus[item].status
				this.getData()
			},
			changeTitle(index) {
				this.titleIndex = index;
				this.form.checkType = index + 1;
				this.getData()
			},
			getAcceptance(data) {
				this.toPage(
					`/pages/orderReceiving/acceptance/acceptanceManagement?id=${this.option.id}&skillId=${data.applySkillId}&itemId=${data.id}&productIds=${data.productIds}`
				)
			},
			getData() {
				this.$http.get("order/customer/bizorderacceptance/getByOrderId", {
					orderId: this.option.id,
					status: this.status,
				}).then(res => {
					if(res){
						this.dataList = res
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-list {
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
