<template>
	<view>
		<z-nav-bar type="transparent">
			<view class="nav-bar" slot="default">优惠券</view>
		</z-nav-bar>
		<view class="main-container">
			<view class="page-tabs flex-center">
				<u-tabs :list="tabList" itemWidth="150" :gutter="8" inactiveColor="#808080" font-size="24"
					:is-show-count="true" bg-color="rgba(0, 0, 0, 0)" active-color="#000000" :current="currentTab"
					@change="onChangeTab" :isScroll="true" />
			</view>
			<scroll-view class="coupon-list" scroll-y>
				<view v-if="couponList.length">
					<mine-mh-coupon v-for="item, index in couponList" :key="index" :coupon="item"></mine-mh-coupon>
				</view>
				<mh-empty v-else fontColor="#333333" title="暂时没有相关的优惠券～"></mh-empty>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				useStatus: '', // -1->待领取 0->待使用 1->已使用 2->已过期
				currentTab: 0,
				couponList: [], // 优惠券列表
				tabList: [{
						name: '全部',
						count: 0,
						prop: 'allCount',
						status: '',
					},
					{
						name: '待领取',
						count: 0,
						prop: 'pickedCount',
						status: -1
					},
					{
						name: '待使用',
						count: 0,
						prop: 'waitCount',
						status: 0
					},
					{
						name: '已使用',
						count: 0,
						prop: 'usedCount',
						status: 1
					},
					{
						name: '已过期',
						count: 0,
						prop: 'expiredCount',
						status: 2
					}
				],
				current: 1,
				total: 0
			}
		},
		onLoad() {},
		onShow(){
			this.getCouponCount()
			this.getMyCouponList()
		},
		methods: {
			onChangeTab(current) {
				this.currentTab = current
				this.useStatus = this.tabList[current].status
				this.current = 1
				this.getMyCouponList()
			},
			// 获取优惠券数量
			getCouponCount() {
				this.$httpApi.getCouponCount().then(res => {
					this.tabList.forEach(item => {
						const count = res[item.prop]
						if(count > 99){
							item['count'] = '99+'
						} else if(!count){
							item['count'] = '0'
						} else {
							item['count'] = count
						}
					})
				})
			},
			// 获取我的优惠券列表
			getMyCouponList(){
				this.$httpApi.getMyCouponList({
					useStatus: this.useStatus,
					current: this.current,
					status: 1
				}).then(res => {
					this.total = res.total
					this.couponList = res.records || res
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		width: 100vw;
		padding: 88rpx 0rpx 30rpx 0rpx;
		/* #ifdef APP-PLUS */
		padding: 144rpx 0rpx 30rpx 0rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding: 164rpx 0rpx 30rpx 0rpx;
		/* #endif */

		.page-tabs {
			width: 100%;
		}

		.coupon-list {
			height: calc(100vh - 188rpx);
			/* #ifdef APP-PLUS */
			height: calc(100vh - 288rpx);
			/* #endif */
			padding: 0 30rpx;
			@include safearea();
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>

<style>
	page {
		background: linear-gradient(0deg, #F7EBCD, #EECD89);
	}
</style>
