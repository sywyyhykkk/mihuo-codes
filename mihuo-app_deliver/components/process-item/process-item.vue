<template>
	<view class="process-item-contain">
		<view class="group-name">
			<view class="left">
				{{data.groupName}}
			</view>
			<view v-if="isRecord" class="right" @click="getRecord">
				<text>施工记录</text>
				<image src="/static/images/jiantou2.png" mode=""></image>
			</view>
		</view>
		<view class="process-item" v-for="(item,index) in data.details" :key="index" @click="getDetails(item)">
			<view class="left">
				<u-lazy-load height="132" imgMode="aspectFill" class="record-item-img" border-radius="10"
					:image="$util.thumbnailImage(item.coverImg,false)">
				</u-lazy-load>
				<view class="information">
					<view class="title">
						{{item.name}}
					</view>
					<view class="instructions">
						{{item.description}}
					</view>
				</view>
			</view>
			<view class="right">
				<!-- <view class="item-status"
					:style="{ color: getStatus(item.status,'color'),background:getStatus(item.status,'bg')}">
					{{getStatus(item.status,'text')}}
				</view> -->
				<view class="title" v-if="$setNodeSkipStatus('status')">
					<text class="title-text">查看详细</text>
					<image src="/static/images/shouqi.png">
					</image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: {}
			},
			isRecord:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				colorList: [{
						status: 0,
						name: '未开始',
						color: '#FFFFFF',
						bgColor: '#C0C0C0'
					},
					{
						status: 1,
						name: '进行中',
						color: '#FF5D35',
						bgColor: '#FEF1E3'
					},
					{
						status: 2,
						name: '已完成',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				]
			}
		},
		methods: {
			getStatus(status, typeName) {
				switch (typeName) {
					case 'text':
						return this.colorList.find(item => item.status === status).name
					case 'color':
						return this.colorList.find(item => item.status === status).color
					case 'bg':
						return this.colorList.find(item => item.status === status).bgColor
				}

			},
			getRecord(){
				this.toPage(
					`/pages/construction/processList/operationRecords?servicePackId=${this.data.groupId}`)
			},
			getDetails(item) {
				if(!this.$setNodeSkipStatus('status')){
					return
				}
				this.toPage(
					`/pages/construction/processList/processDetails?id=${item.productId}&groupId=${this.data.groupId}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.group-name {
		display: flex;
		justify-content: space-between;
		padding: 26rpx 0rpx 22rpx 46rpx;
		font-weight: 600;

		.left {
			font-size: $smiddleFontSize;
			color: $seconFontColor;
		}

		.right {
			display: flex;
			align-items: center;
			margin-right: 40rpx;
			text {
				color: #909199;
				font-size: 26rpx;
				margin-right: 8rpx;
			}

			image {
				width: 16rpx;
				height: 15rpx;
			}
		}
	}

	.process-item {
		margin: 6rpx 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 36rpx 32rpx 34rpx 34rpx;
		display: flex;


		&:last-child {
			margin-bottom: 0;
		}

		.left {
			display: flex;
			flex: 4;

			.information {
				padding-top: 8rpx;

				.title {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
					margin-bottom: 8rpx;

				}

				.instructions {
					font-size: 26rpx;
					color: #909199;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 360rpx;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

			}

			.record-item-img {
				width: 132rpx;
				margin-right: 26rpx;
			}
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				display: flex;
				position: relative;

				image {
					position: absolute;
					right: 0;
					top: 10rpx;
					transform: rotate(-90deg);
				}
			}

			.title-text {
				font-size: 26rpx;
				color: #A7A7A7;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.item-status {
				width: 100rpx;
				font-size: 24rpx;
				// color: #FFFFFF;
				// background: linear-gradient(113.12deg, #FF3F40 -6.3%, #FFA4A4 91.92%);
				border-radius: 0px 20rpx 20rpx 20rpx;
				text-align: center;
				padding: 4rpx 0;
				margin-left: 10rpx;
			}

			image {
				width: 16rpx;
				height: 16rpx;
			}
		}

	}
</style>
