<template>
	<view>
		<z-nav-bar :backState="3000" @backClick="goBack" title="服务日志"></z-nav-bar>
		<view>
			<view class="content">
				<view class="log">
					<mh-order-person-info :personInfo="checkedData">
						<view>
							<text class="dateInfo">{{checkedData.created || ''}}</text>
							<text class="dateInfo" style="margin-left: 5rpx;">发起</text>
						</view>
					</mh-order-person-info>
					<view v-if="checkedData.hasOrderList">
						<view class="describe">今日施工内容</view>
						<view style="margin: 30rpx 0 0 0;">
							<view v-for="(mini,index) in checkedData.detailList" :key="index" class="describe-item">
								<view :class="{ 'active': mini.status == 1, 'end': mini.status == 2}">
									<view v-if="checkedData.hasOrderList" class="icon"></view>
									<view v-else class="sort">{{index+1>9?(index+1):('0'+(index+1))}}</view>
									<text class="conInfo">{{mini.name || ''}}</text>
									<view v-if="checkedData.hasOrderList" class="label">{{mini.status > 1?'已完工':'已开工'}}</view>
								</view>
								<view class="image_show" v-if="mini.pic">
									<order-mh-image-show :imgSrc="mini&&mini.pic" width="196" height="196" right="12" />
								</view>
							</view>
							<view class="image_show" v-if="checkedData.pic">
								<order-mh-image-show :imgSrc="checkedData&&checkedData.pic" width="196" height="196"
									right="12" />
							</view>
							<view v-if="checkedData.audio">
								<order-mh-mihuo-audio :formDate="JSON.parse(checkedData.audio)" />
							</view>
						</view>
						<view class="remark" v-if="checkedData.desc">{{checkedData.desc}}</view>
					</view>
					<view class="remark" v-else>{{checkedData.desc||''}}</view>
				</view>
				<view class="feature" v-if="checkedData.futures && checkedData.futures != '[]'">
					<view class="label">明日施工计划</view>
					<view style="margin: 30rpx 0 0 0;">
						<view v-for="las,sn in JSON.parse(checkedData.futures)" :key="sn" class="feature-item">
							<view class="content">
								<view class="icon"></view>
								<view class="value">{{las.name || ''}}</view>
							</view>
						</view>
					</view>
					<view class="image_show" v-if="checkedData.futurePic && checkedData.futurePic!='[]'">
						<order-mh-image-show :imgSrc="checkedData.futurePic" width="196" height="196"
							right="12" />
					</view>
					<view class="remark-last" v-if="checkedData.futureDesc">{{checkedData.futureDesc || ''}}</view>
				</view>
				<view class="feature" v-if="checkedData.supplementaryContent && checkedData.supplementaryContent !='[]'">
					<view class="label">补充内容</view>
					<view v-for="con,ind in JSON.parse(checkedData.supplementaryContent)" :key="ind" class="supplement">
						<view class="supplement-item">
							<view>{{ind + 1}}、</view>
							<view>{{ con.name || ''}}</view>
						</view>
						<order-mh-image-show class="image-show"  :imgSrc="con && con.pic" width="196" height="196"
						right="12" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkedData: {},
				id: 0,
				options: {}
			};
		},

		onLoad(options) {
			this.options = options;
			this.getData()
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: `${this.options.skillName || ''}服务日志`
			})
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			//获取施工报告
			getData() {
				this.$http.get(`order/construction_journal/view/${this.options.id}`)
					.then((res) => {
						if (res) {
							const data = res;
							if (data.detailList) {
								for (let list of data.detailList) {
									if (list.status != -1) {
										data.hasOrderList = 1;
										break;
									}
								}
							}
							this.checkedData = data;
						}
					})
			},
		},
	}
</script>
<style>
	page {
		background: #f7f7f7;
	}
</style>

<style lang="scss" scoped>
	
	.feature {
		background: #FFFFFF;
		padding: 30rpx;
		margin-top: 20rpx;
		.feature-item{
			padding-bottom: 20rpx;
		}
		.remark-last {
			font-size: 24rpx;
			font-weight: 400;
			color: #808080;
			line-height: 34rpx;
			padding: 0 0;
			margin-top: 20rpx;
		}
		.label {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			color: #000000;
			line-height: 34rpx;
			margin-bottom: 20rpx;
		}

		.content {
			display: flex;
			align-items: center;
			.icon {
				width: 22rpx;
				height: 22rpx;
				background: none;
				border: 4rpx solid #B3B3B3;
				border-radius: 50%;
			}
			.value{
				margin-left: 12rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #808080;
				line-height: 34rpx;
			}
		}
	}

	.log {
		padding: 20rpx 30rpx;
		background: #FFFFFF;


		// border-bottom: 1.5rpx solid #E6E6E6;
		&:last-child {
			border: none;
		}

		.log-top {
			display: flex;
			align-checkedDatas: center;

			.dateInfo {
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #999999;
			}

			.log_name {
				color: #141414;
				font-size: 28rpx;
				font-weight: bold;
				padding: 0 20rpx;
			}

			.log_skill-name {
				color: #FE6E32;
				border: 2rpx solid #FE6E32;
				font-size: 22rpx;
				font-weight: 800;
				padding: 0 10rpx;
				border-radius: 6rpx;
			}
		}

		.submit_time {
			margin: 20rpx 0;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
		}

		.describe {
			font-size: $fontSize28;
			font-family: PingFang SC;
			margin: 30rpx 0 0 0;
			color: $mainFontColor14;
			@include bov(3);
		}
		.describe-item{
			margin-bottom: 20rpx;
			&:last-child{
				margin-bottom: 0;
			}
		}

		.image_show {
			margin-top: 20rpx;
		}

		.active,
		.end {
			display: flex;
			align-items: center;

			.conInfo {
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 12rpx;
				max-width: 500rpx;
			}

			.icon {
				width: 22rpx;
				height: 22rpx;
				background: none;
				border: 4rpx solid #15A50A;
				border-radius: 50%;
			}
		}

		.active {
			.icon {
				border: 4rpx solid #F9703A;
			}

			.label {
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: #F9703A;
				border-radius: 32rpx;
				padding: 6rpx 12rpx;
				margin-left: 12rpx;
			}
		}

		.end {
			.icon {
				border: 4rpx solid #15A50A;
			}

			.label {
				margin-left: 12rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				background: #15A50A;
				border-radius: 32rpx;
				padding: 6rpx 12rpx;
			}
		}
		.remark {
			font-size: 24rpx;
			font-weight: 400;
			color: #808080;
			line-height: 34rpx;
			padding: 0 0;
			margin-top: 20rpx;
		}
	}

	.action {
		display: flex;
		padding: 24rpx 30rpx;
		padding: 30rpx;
		background-color: #FFFFFF;
		justify-content: flex-end;
		border-top: 1rpx solid #F0F0F0;

		.buttonLook {
			background: #000000;
			border-radius: 30rpx;
			color: #FFFFFF;
			height: 60rpx;
			padding: 0 37rpx;
			line-height: 60rpx;
			font-size: 24rpx;

		}
	}
	.supplement{
		margin-bottom: 20rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.supplement-item{
			display: flex;
			align-items: center;
			view{
				font-size: 14px;
				font-weight: 500;
				color: #000000;
			}
		}
		.image-show{
			margin-top: 20rpx;
		}
	}
</style>
