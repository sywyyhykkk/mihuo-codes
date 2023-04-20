<template>
	<view>
		<z-nav-bar fontColor="black" title="交付记录"></z-nav-bar>
		<view class="log">
			<view class="log-item" v-for="(item,index) in deliveryData" :key="index">
				<view class="flex-box">
					<u-avatar class="avatar" size="80" :src="$util.avatarImage(item.userId)"/>
					<view class="log-top">
						<view class="flex-box">
							<text class="log_name">{{ item.personName }}</text>
							<text class="log_skill-name">{{ item.personSkillName }}</text>
						</view>
						<view class="submit_title">{{item.time || ''}}</view>
					</view>
				</view>
				<view class="log-type">#{{ item.logType == 0 ?'施工': item.logType == 1?'巡检':''}}#</view>
				<view class="log-content">{{item.content || ''}}</view>
				<view class="describe">{{item.desc || ''}}</view>
				<view class="image_show" v-if="item.logImg && item.logImg.length">
					<image v-for="(v,i) in item.logImg" 
					:key="i" :src="$util.thumbnailImage(v, false)"
					@click="preview(item.logImg , $util.thumbnailImage(v, false))"
					class="image_show-item" mode="aspectFill"></image>
				</view>
				<view class="log-bottom">
					<view>
						<image src="https://www.51mihuo.com/static/icon/button_6.png" class="icon"></image>
						<text>{{ item.likeNum || 0 }}</text>
					</view>
					<view @click="lookEvaluate(item)">
						<image src="https://www.51mihuo.com/static/icon/button_4.png" class="icon"></image>
						<text>{{ item.logComment && item.logComment.length }}</text>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore style="margin:20rpx 0"  v-if="deliveryData.length" status="nomore" />
		<mh-empty v-else title="暂无交付记录～～" />

		<!-- 查看评价 -->
		<sku-popup v-model="showPopup" title="日志评价">
			<view class="content-sku" v-if="evaluateList && evaluateList.length">
				<view class="content-sku_item" v-for="(item,index) in evaluateList" :key="index">
					<view class="content-sku_top flex-box">
						<image :src="$util.thumbnailImage(item.reviewerAvatar, false)" class="img-user"></image>
						<text>{{ item.reviewer }}</text>
					</view>
					<view class="content-sku_main">{{ item.comment }}</view>
					<view class="content-sku_buttom">{{ item.time }}</view>
				</view>
			</view>
			<mh-empty v-else title="暂无评价"></mh-empty>
		</sku-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option:{},
				deliveryData:[],
				evaluateList:[],
				showPopup:false
			}
		},
		onLoad(option) {
			this.option = option;
			this.getDetails()
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
						res.journal = JSON.parse(res.journal);
						res.journal.map(item=>{
							if(item.logImg){
								item.logImg = item.logImg.split(',')
							}
						})
						this.deliveryData = res.journal;
					}
				})
			},
			lookEvaluate(item){
				this.showPopup = true;
				if(item.logComment && item.logComment.length){
					this.evaluateList = item.logComment;
				}
			},
			preview(data, url) {
				if (data && data.length) {
					let images = data.map(item => {
						return this.$util.thumbnailImage(item, false)
					})
					uni.previewImage({
						current: url,
						urls: images,
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.log{
	margin: 30rpx 0;
	padding: 0 30rpx;
	&:last-child{
		border: none;
	}
	.log-item{
		margin-bottom: 60rpx;
	}
	.log-top{
		margin-left: 20rpx;
		.log_name{
			color: #141414;
			font-size: 28rpx;
			font-weight: bold;
			padding-right:9rpx;
		}
		.log_skill-name{
			color: #FE6E32;
			border: 2rpx solid #FE6E32;
			font-size: 16rpx;
			font-weight: bold;
			padding: 5rpx 10rpx;
			border-radius: 6rpx;
			font-family: HuXiaoBo-NanShen;
		}
	}
	.submit_title{
		margin-top: 20rpx;
		font-size: 20rpx;
		font-family: PingFang SC;
		color: #808080;
	}
	.log-type{
		color: #000000;
		font-size: 24rpx;
		margin-top: 20rpx;
		font-family: NotoSansHans-Medium;
		font-weight: bold;
	}
	.log-content{
		margin: 20rpx 0;
		font-size: 24rpx;
		color: #4D4D4D;
		font-family: NotoSansHans-Regular;
	}
	.describe{
		font-size: $fontSize26;
		font-family: PingFang SC;
		font-weight: 500;
		color: $mainFontColor14;
		@include bov(3);
	}
	.image_show{
		display: flex;
		flex-wrap: wrap;
		.image_show-item{
			width: 210rpx;
			height: 210rpx;
			margin: 0 20rpx 20rpx 0;
			border-radius: 10rpx;
		}
	}
	.open_btn {
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: $miniBorderRadius;
		.btn_title {
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $fontColor80;
		}
		image {
			width: 14rpx;
			height: 8rpx;
			transition: all .2s;
			margin-left: 12rpx;
		}
		.open_btn-is{
			border: 1rpx solid #141414;
			border-radius: 40rpx;
			padding: 16rpx 25rpx;
			display: flex;
			align-items: center;
		}
		text{
			color: #141414;
			font-size: 20rpx;
			font-weight: bold;
		}
	}
	.log-bottom{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		view{
			display: flex;
			align-items: center;
			margin-left: 20rpx;
		}
		.icon{
			width: 28rpx;
			height: 28rpx;
		}
		text{
			color: #000000;
			font-size: 20rpx;
			padding-left: 5rpx;
		}
	}
}
.flex-box{
	display: flex;
	align-items: center;
}
.content-sku_item{
	margin-bottom: 30rpx;
	.content-sku_top{
		.img-user{
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
		}
		text{
			font-size: 28rpx;
			margin-left: 10rpx;
			color: #000000;
		}
	}
	.content-sku_main{
		padding: 10rpx;
		font-size: 28rpx;
	}
	.content-sku_buttom{
		display: flex;
		justify-content: flex-end;
		color: #808080;
		font-size: 24rpx;
	}
}
</style>
