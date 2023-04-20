<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				{{ navBarTitle }}
			</view>
		</z-nav-bar>
		<view class="detail-item flex-center" v-for="item, index in costItemList" :key="index">
			<!-- <myHome-mh-mihuo-image src="" class="item-img"></myHome-mh-mihuo-image> -->
			<view class="item-info">
				<view class="title">
					{{ item.bookkeepingTypeName || '' }}
				</view>
				<view class="des">
					{{ item.remark || '' }}
				</view>
				<view class="time">
					{{ item.updated || '' }}
				</view>
			</view>
			<view class="item-money">
				¥ {{ item.money || 0 }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navBarTitle: '',
				costId: '',
				costItemList: [],
				myHomeInfo: uni.getStorageSync('roomAddress')
			}
		},
		onLoad(options) {
			this.navBarTitle = options.title
			this.costId = options.id
			this.getCostDetail()
		},
		methods: {
			getCostDetail() {
				this.$httpApi.getCostDetailByTypeId({
					typeId: this.costId,
					addressId: this.myHomeInfo.id
				}).then(res => {
					if (res && res.length) {
						this.costItemList = res.filter((item)=> item.bookkeepingTypeId == this.costId)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		@include nav-bar-title(#000000);
	}

	.detail-item {
		width: 100vw;
		height: 170rpx;
		padding: 30rpx;
		border-bottom: 2rpx solid #F7F7F7;
		justify-content: space-between;

		.item-img {
			width: 64rpx;
			height: 64rpx;
			border-radius: 10rpx;
			border: 1px red solid;
		}

		.item-info {
			flex: 1;

			.title {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.des {
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #A8A8A8;
				line-height: 34rpx;
			}

			.time {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #A8A8A8;
				line-height: 34rpx;
			}
		}

		.item-money {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #FE6E32;
			line-height: 34rpx;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
