<template>
	<view class="list-content">
		<view class="journal_view" v-if="journalList&&journalList.length>0">
			<view class="journal_item" v-for="(item,index) in journalList" :key="item.id">
				<view class="in_time align-items">
					<view class="display-left">
						<image class="tick_icon" src="/static/icon/tick.png" mode=""></image>
						<view class="name">{{item.status==1?'开工':item.status==2?'完工':''}}</view>
					</view>
					<view class="info">{{item.created.slice(0,item.created.length-3)}}</view>
				</view>
				<view class="other_post_style">
					<view class="item_con" :style="index===0?'margin-bottom: 16rpx':''">
						<text class="text">{{item.desc}}</text>
						<view class="image_show" v-if="item.pic">
							<image-show :imgSrc="item.pic" />
						</view>
		
						<view v-if="item.audio">
							<journal-audio :formDate="JSON.parse(item.audio)" />
						</view>
						<view class="address display-left" v-if="item.status==1">
							<image class="position" src="/static/icon/position.png" />
							<view class="address_name">位置:{{item.address}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else icon="/static/images/no_recommend.png" title="您还没有数据～～" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				personId: '',
				journalList: [],
				orderId: ''
			}
		},

		onLoad(option) {
			this.orderId = option.orderId
			this.personId = option.personId
			this.getJournal()
		},
		methods: {
			getJournal() {
				this.$httpApi.getConstructionJournalByOrderId(this.orderId).then(res => {
					if (res) {
						this.journalList = res;
					}
				}).catch(e => console.log(e))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-content {
		padding-top: 12rpx;
	}
	.other_post_style{
		margin-left: 42rpx;
		padding: 28rpx 20rpx 28rpx 40rpx;
		border-left: 2rpx dashed #C4C4C4;
		overflow: hidden;
	}
	.journal_view{
		background: #FFFFFF;
		padding: 50rpx 0;
		border-radius: 10rpx;
	}
	.journal_item {
		& :last-child{
			padding-bottom: 0;
		}
		.in_time {
			margin-left: 24rpx;
			position: relative;
			.name{
				font-size: 28rpx;
				color: #303;
			}
			.info {
				font-size: 26rpx;
				color: #909199;
				margin-right: 50rpx;
			}
			.tick_icon {
				width: 39rpx;
				height: 39rpx;
				margin-right: 16rpx;
			}
		}
		.item_con {
			.text {
				text-align: justify;
				font-size: 26rpx;
				color: #606166;
				@include bov(3);
			}

		}

		.image_show {
			margin: 28rpx 0;
		}
		
		.address{
			margin-top: -20rpx;
			.position{
				width: 30rpx;
				height: 30rpx;
				margin-right: 8rpx;
			}
			.address_name{
				font-size: 28rpx;
				color: #303133;
			}
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.display-left {
		display: flex;
		justify-content: left;
		align-items: center;
	}
</style>
