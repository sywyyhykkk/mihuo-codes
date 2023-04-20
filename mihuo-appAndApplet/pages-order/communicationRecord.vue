<template>
	<view class="order-communication">
		<z-nav-bar fontColor="#141414" bgColor="#FFFFFF" title="沟通记录"></z-nav-bar>
		<view v-if="communicationRecord && communicationRecord.length">
			<view v-for="(item,index) in communicationRecord" :key="index" class="order-communication_item">
				<view class="item-left">
					<view class="node">
						<u-avatar size="52" :src="$util.avatarImage(currentUser,true)"></u-avatar>
					</view>
				</view>
				<view class="item-rigth">
					<view class="tags-time">{{item.created && item.created.substring(0,16)}}</view>
					<view class="tags-content">
						<view class="flex-Record">
							<u-avatar class="avatar" size="50" :src="$util.avatarImage(communicationRecordInfo.bidUserId)"/>
							<view class="name">{{ communicationRecordInfo.personName }}</view>
							<text class="skillName">{{ communicationRecordInfo.skillName }}</text>
						</view>
						<view class="order-communication_tags">
							<view>
								<text class="tags-tag">{{ item.type==0?"线上沟通":"线下沟通" }}</text>
								<text v-if="item.intention == 1">
									<text class="tags-tag">{{ setResult(item.intention) }}</text>
									<text class="tags-tag" v-if="item.requirementTypeName"> {{ item.requirementTypeName}}</text>
									<text class="tags-tag" v-if="item.abandonedReason">{{ item.abandonedReason}}</text>
								</text>
							</view>
						</view>
						<view class="order-communication_content">
							{{ item.intention == 1?
							`[${communicationRecordInfo.skillName || ''}]${communicationRecordInfo.personName || ''}
							已经和您进行了详细沟通，如果您觉得他还不错，请确认选择他作为您的${communicationRecordInfo.skillName || ''}帮您落地装修事宜。`:
							`[${communicationRecordInfo.skillName || ''}]${communicationRecordInfo.personName || ''}
							已经和您进行了详细沟通，平台数据分析判断他不适合您，您可以重新发布订单再选择！`
							}}
						</view>
						<view class="communication-image" v-if="item.annexImage">
							<image-show :imgSrc="item.annexImage" width="160" height="160" ></image-show>
						</view>
						<view class="communication-audio" v-if="item.annexAudio">
							<mihuo-audio :formDate="item.annexAudio" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="communicationRecord.length == 0" title="暂无沟通记录～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options:{},
				communicationRecord:[],
				communicationRecordInfo:{},
				orderInfo:{},
				currentUser: uni.getStorageSync('userData').sysUser.userId, // 当前用户userId
			}
		},
		onLoad(options) {
			this.options = options;
			this.getDataList()
		},
		methods: {
			async getDataList() {
				this.$http.get(`order/bidorder/list?orderId=${this.options.orderId}`).then(res => {
					if (res) {
						this.orderInfo = res.bizOrder
						if (res.offerList && res.offerList.length) {
							this.communicationRecord = res.offerList[0].communications || []
							this.communicationRecordInfo = res.offerList[0]
							res.offerList.some((v) => {
								if(v.communications && v.communications.length){
									v.communications.forEach(el => {
										if(el.annex){
											el['annexImage'] = JSON.stringify(JSON.parse(el.annex).filter(item => item.type == 'img'))
											el['annexAudio'] = JSON.parse(el.annex).find(item => item.type == 'audio')
										}
									});
								}
							})
						}
					}
				})
			},
			setResult(intention) {
				const tempResultMap = {
					'1': '愿意接单',
					'0': '不是平台单',
					'-1': '个人弃单',
				}
				return tempResultMap[intention] ?? ''
			},
		}
	}
</script>

<style lang="scss" scoped>
page{
	background: #F7F7F7;
}
.order-communication{
	padding: 0 30rpx 30rpx;
	.order-communication_item{
		display: flex;
		margin-top: 20rpx;
		.item-left {
			width: 40rpx;
			border-left: 2rpx dashed #C4C4C4;
			position: relative;
			margin-left: 30rpx;
			.node {
				position: absolute;
				left: -28rpx;
				width: 26rpx;
				height: 26rpx;
			}
		}
		.item-rigth{
			flex: 1;
		}
	}
	.tags-time{
		color: #999999;
		font-size: 24rpx;
		font-family: MicrosoftYaHei;
		padding: 10rpx 0 20rpx 0;
	}
	.tags-content{
		background: #FFFFFF;
		padding: 30rpx;
		border-radius: 10rpx;
	}
	.order-communication_tags{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.tags-tag{
			color: #FE6E32;
			font-size: 24rpx;
			font-family: NotoSansHans;
			padding: 10rpx;
			background: #FFF0EA;
			border-radius: 12rpx;
			font-weight: 550;
			margin-right: 20rpx;
		}
	}
	.order-communication_content{
		color: #000000;
		font-size: 28rpx;
		font-family: NotoSansHans-Regular;
		padding-top: 20rpx;
	}
	.communication-image{
		margin-top: 20rpx;
	}
	.flex-Record{
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
		.name{
			color: #141414;
			font-size: 28rpx;
			font-weight: bold;
			padding-right:9rpx;
			padding: 0 10rpx;
		}
		.skillName{
			color: #FE6E32 !important;
			border: 2rpx solid #FE6E32;
			font-size: 16rpx !important;
			font-weight: bold;
			padding: 0 10rpx;
			border-radius: 6rpx;
			font-family: HuXiaoBo-NanShen;
			height: 30rpx;
			line-height: 30rpx;
		}
	}
}
</style>
