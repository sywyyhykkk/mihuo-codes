<template>
	<view>
		<public-module></public-module>
		<view class="staff">
			<view class="staff_bg"></view>
			<view class="staff_info">
				<view class="avatar_view">
					<u-avatar class="avatar" size="112" :src="$util.avatarImage(detailData.person && detailData.person.userId)"
					  v-if="detailData.person && detailData.person.userId" />
				</view>
				<view class="name_job">
					<text class="name">{{detailData.person && detailData.person.name}}</text>
					<text class="job">{{detailData.person && detailData.person.skillName}}</text>
				</view>
				<view class="punish_detail_view">
					<view class="punish_detail">
						<view class="total">总计</view>
						<view class="public">
							金额 <text>{{detailData.total && detailData.total.totalMoney}} 元</text>
						</view>
						<view class="public">
							积分 <text>{{detailData.total && detailData.total.totalIntegral}} 分</text>
						</view>
						<view class="public">
							禁单 <text>{{detailData.total && detailData.total.totalDay}} 天</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="punish_me" @click="toPunishDetails">
			<view class="punish_me_item" v-for="(item,index) in detailData.forfeitLogList" :key="index">
				<view class="top">
					<text class="left">{{detailData.reason}}</text>
				</view>
				<view class="myself">
					 <u-avatar class="avatar" size="32" :src="$util.avatarImage(detailData.dealPerson && detailData.dealPerson.userId)"
					   v-if="detailData.dealPerson && detailData.dealPerson.userId" />
					<text class="name_job">{{detailData.dealPerson && detailData.dealPerson.name}}（{{detailData.dealPerson && detailData.dealPerson.skillName}}）</text>
					<text class="time">{{item.created}}</text>
				</view>
				<view class="punish_detail">
					<view class="public">
						处罚金额 <text>{{item.money}} 元</text>
					</view>
					<view class="public">
						积分 <text>{{item.integral}} 分</text>
					</view>
					<view class="public">
						禁单天数 <text>{{item.day}} 天</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				detailId:'',
				detailData:{},
				imageGlobal:this.$image.imageGlobal,
			}
		},
		
		onShow() {
			this.getDetail(this.detailId)
		},
		
		onLoad(option) {
			this.detailId = Number(option.detailId)
		},
		
		methods:{
			getDetail(id){
				this.$http.get(`order/bizorderforfeit/${id}`).then(res => {
					this.detailData = res;
					// for (let key in this.detailData) {
					// 	switch(key){
					// 		case 'pics':
					// 		case 'audio':
					// 			if(typeof this.detailData[key] === 'string'){
					// 				this.detailData[key] = JSON.parse(this.detailData[key]);
					// 			}
					// 		break;
					// 	}
					// }
				})
			},
			toPunishDetails(){
				uni.navigateTo({
					url: `./punishDetails?detailId=${this.detailData.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.staff{
		height: 328rpx;
		position: relative;
		.staff_bg{
			height: 220rpx;
			background-color: $themeColor;
			border-radius: 0px 0px 46rpx 46rpx;
			position: relative;
		}
		.staff_info{
			width: 95%;
			height: 282rpx;
			position: absolute;
			top: 50rpx;
			left: 20rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			.avatar_view{
				width: 100%;
				text-align: center;
				margin: 22rpx 0;
			}
		}
		.name_job{
			text-align: center;
			.name{
				font-weight: bold;
				font-size: 26rpx;
				color: #606166;
				margin-right: 2rpx;
			}
			.job{
				font-size: 25rpx;
				color: #909199;
			}
		}
		.punish_detail_view{
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.punish_detail{
		display: flex;
		padding: 20rpx 0 28rpx 0;
		.total{
			color: $seconFontColor;
			font-size: 26rpx;
			margin-right: 24rpx;
		}
		.public{
			font-size: 22rpx;
			color: #606166;
			margin-right: 17px;
			text{
				margin-left: 4rpx;
				font-size: 26rpx;
				font-weight: bold;
				color: #ff5d35;
			}
		}
	}
	
	.punish_me{
		margin: 12rpx 20rpx;
		.punish_me_item{
			height: 208rpx;
			padding: 39rpx 0 28rpx 32rpx;
			margin-bottom: 8rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			.top{
				.left{
					font-size: 26rpx;
					color: $seconFontColor;
				}
				.right{
					font-size: 22rpx;
					margin-right: 56rpx;
					color: $themeColor;
				}
			}
			.myself{
				display: flex;
				align-items: center;
				margin-top: 14rpx;
				.avatar{
					margin-right: 6rpx;
				}
				.name_job{
					font-size: 22rpx;
					color: #606166;
				}
				.time{
					font-size: 22rpx;
					color: #909199;
				}
			}
		}
	}
</style>
