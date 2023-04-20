<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">拼团抢购</view>
		</z-nav-bar>
		<mihuo-search class="search-bar" :mode="2" button="none" :disabled="false" @confirm="onConfirmSearch"
			:clearable="false">
		</mihuo-search>
		<scroll-view :scroll-y="true" class="scroll-view" @scrolltolower="loadMore">
			<mall-mh-group-deal-item v-for="item, index in dataList" :key="index" :item="item">
			</mall-mh-group-deal-item>
			<mh-empty v-if="!dataList.length" title="暂时没有相关商品～"></mh-empty>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				keyword: '',
				current: 1,
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				this.$httpApi.getProductActivityPage({
					type: 0, // 团购
					keyword: this.keyword,
					current: this.current
				}).then(res => {
					this.total = res.total
					if (this.current === 1) {
						this.dataList = res.records
					} else {
						this.dataList = this.dataList.contact(res.records)
					}
				})
			},
			onConfirmSearch(keyword) {
				this.keyword = keyword
				this.current = 1
				this.dataList = []
				this.getData()
			},
			loadMore() {
				if (this.dataList.length > +this.total) {
					return
				} else {
					this.current++
					this.getData()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar {
		width: 690rpx;
		margin: 0 30rpx;
		height: 62rpx;
	}

	.scroll-view {
		width: 690rpx;
		height: calc(100vh - 88rpx - 62rpx - 60rpx - var(--status-bar-height));
		margin: 30rpx 30rpx 0 30rpx;
		@include safearea();
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
