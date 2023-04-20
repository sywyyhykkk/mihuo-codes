<template>
	<view>
		<z-nav-bar fontColor="black" title="设计图纸"></z-nav-bar>
		<view class="case-image" v-if="details.images && details.images.length">
			<view v-for="(item,index) in details.images" :key="index" class="case-tabs-item_img">
				<view class="item_title">
					<text>{{ item.groupName }}</text>
				</view>
				<common-mh-swiper :src-list="item.images"></common-mh-swiper>
			</view>
		</view>
		<mh-empty v-else title="暂无设计图纸~"></mh-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option:{},
				details:{},
			}
		},
		onLoad(options) {
			this.option = options;
			this.getDetails();
		},
		methods: {
			getDetails() {
				let params = {
					id: this.option.id,
				}
				if (uni.getStorageSync('userData')) {
					params.userId  = uni.getStorageSync('userData').sysUser.userId
				}
				this.$httpApi.getConstruCaseDetail(params).then(res => {
					if (res) {
						// 设计
						res.images = JSON.parse(res.images);
						if(res.images && res.images.length){
							res.images.map((item)=>{
								item.images = item.images.split(",") || []
							})
						}
						this.details = res;
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.case-image{
	padding: 0 30rpx 30rpx;
}
.case-tabs-item_img {
	.item_title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
		text {
			color: #000000;
			font-size: 28rpx;
			font-weight: bold;
			padding: 0 12rpx;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				top: 0;
				left: 0;
				border-top: 4rpx solid #000000;
				border-left: 4rpx solid #000000;
			}
			&::after {
				content: '';
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				bottom: 0;
				right: 0;
				border-bottom: 4rpx solid #000000;
				border-right: 4rpx solid #000000;
			}
		}
	}
}
</style>
