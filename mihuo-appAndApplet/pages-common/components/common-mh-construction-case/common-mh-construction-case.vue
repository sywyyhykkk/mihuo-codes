<template>
	<view class="public-item" @click="getDetails">
		<image class="case-item" :src="getImg" mode="aspectFill"></image>
		<view class="text-contain">
			<view>
				<text class="title-name">{{ formData.name }}</text>
				<text class="title-type">{{ getHouseType }} I {{ getHouseArea }} I {{ formData.houseCost }}万</text>
			</view>
			<view class="company">
				<view class="company-contain">
					<image class="company-log" :src="formData.url" mode="aspectFill"></image>
					<text class="company-name">{{ formData.companyName }}</text>
				</view>
				<view class="company-other">
					<uni-icons type="star" size="22"></uni-icons>
					<text class="num">收藏{{ formData.holdNum || 0}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/static/js/util.js'
	
	export default {
		props:{
			formData:{
				type:Object,
				default: {}
			}
		},
		data() {
			return {
				houseType: [],
				houseArea: []
			}
		},
		mounted() {
			this.houseType = uni.getStorageSync('House_Type')
			this.houseArea = uni.getStorageSync('House_Area')
		},
		methods:{
			getDetails(){
				this.$emit('toPageConstruction', this.formData.id)
			}
		},
		computed:{
			getImg(){
				return util.thumbnailImage(this.formData.coverPic, true, 182) 
			},
			getHouseType(){
				let str = ''
				this.houseType.forEach(item => {
					if(item.value === this.formData.houseTypeId){
						str = item.label
					}
				})
				return str
			},
			getHouseArea(){
				let str = ''
				this.houseArea.forEach(item => {
					if(item.value === this.formData.houseAreaId){
						str = item.label
					}
				})
				return str
			}
		}
	}
</script>

<style lang="scss" scoped>
	.public-item {
		background: #fff;
		color: #303133;
		height: 246rpx;
		margin: 8rpx;
		box-shadow: 0rpx 4rpx 4rpx rgba(217, 217, 217, 0.25);
		border-radius: 5rpx;
		padding: 32rpx 30rpx;
		display: flex;
		flex-direction: row;

		.case-item {
			width: 182rpx;
			height: 182rpx;
			border-radius: 10rpx;
		}

		.text-contain {
			width: 400rpx;
			margin-left: 30rpx;
			display: flex;
			justify-content: space-between;
			padding: 16rpx 0;

			.title-name {
				width: 500rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				font-weight: bold;
				font-size: 28rpx;
				color: #303133;
			}

			.title-type {
				font-weight: bold;
				font-size: 24rpx;
				color: #FF5D35;
			}

			.company {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.company-contain {
					display: flex;
					flex-direction: row;
					align-items: center;

					.company-log {
						width: 44rpx;
						height: 44rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}

					.company-name {
						font-weight: bold;
						font-size: 24rpx;
						color: #909199;
					}
				}

				.company-other {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					.num {
						padding-left: 8rpx;
						padding-top: 4rpx;
						font-weight: bold;
						font-size: 28rpx;
						color: #909199;
					}
				}

			}
		}
	}
</style>
