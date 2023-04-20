<template>
	<view class="measuring-room-information">
		<view class="information-title public-flex" :class="[jumpStatus && 'show-title']">
			<view class="left">{{spaceName}}</view>
			<view class="right public-flex" v-if="jumpStatus">
				<text class="details" @click="viewShow()">查看详情</text>
				<image src="/static/images/bottom-icon.png"></image>
			</view>
		</view>
		<view class="information-top-contain public-flex-center">
			<view class="item-contain" v-for="(item,index) in info.list" :key="index">
				<text>{{item.attributeValue}}{{item.attributeUnit}}</text>
				<text>{{item.attributeName}}</text>
			</view>
		</view>
		<view class="image-contain public-flex-center">
			<view class="image-list-no" v-if="info.roomImg.length === 0">
				<image src="/static/images/no-house-type.png"></image>
				<text>暂未上传户型图</text>
			</view>
			<view v-if="info.roomImg.length > 0" style="width: 100%;" class="image-swiper-contain">
				<u-swiper :list="info.roomImg" name="url" height="428" :autoplay="false" @change="imageChange"
					@click="preview"></u-swiper>
				<text class="num-contain">
					<text class="left">{{imageCount}}/</text>
					<text class="right">{{roomImgNum}}</text>
				</text>
			</view>
		</view>

		<view class="bottom-contain public-flex-center" v-if="nodeInfo.avatar">
			<u-avatar class="node" size="32" :src="$util.thumbnailImage(nodeInfo.avatar,true)">
			</u-avatar>
			<view class="personnel-contain" v-if="nodeInfo.personName">
				<text>{{nodeInfo.personName}}</text>
				<text>({{nodeInfo.skillName}})</text>
				<text
					class="heterogeneous">{{nodeInfo.actuallyEndTime && nodeInfo.actuallyEndTime.substring(0,10)}}录入了量房信息</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 详细量房信息
	 */
	import {
		mapState,
	} from 'vuex'
	export default {
		props: {
			jumpStatus: {
				default: true,
				type: [String, Boolean],
			},
		},
		data() {
			return {
				spaceList: [],
				spaceName: '',
				spaceNameList: [{
						label: '卧室',
						value: '室',
						sort: 0,
					},
					{
						label: '客厅',
						value: '厅',
						sort: 1,
					},
					{
						label: '卫生间',
						value: '卫',
						sort: 2,
					},
					{
						label: '厨房',
						value: '厨',
						sort: 3,
					}
				],
				roomImgNum: 0,
				imageCount: 1,
				imageCountNew: 0,
				projectId: '',
				info: {
					list: [],
					status: false,
					roomImg: []
				},
			}
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo'])
		},
		mounted() {
			this.projectId = this.projectInfo.projectId
			this.getDetails()
		},
		methods: {
			imageChange(ev) {
				this.imageCount = ev + 1
				this.imageCountNew = ev
			},
			getDetails() {
				if (this.projectId) {
					this.$httpApi.getBuildTypeList({
						id: this.projectId
					}).then(res => {
						if (res) {
							this.info.list = res
							this.info.status = true
						}
					})
					
					this.$httpApi.getProjectDetails({
						id: this.projectId 
					}).then(res => {
						if (res) {
							if (res.roomImg) {
								this.roomImgNum = res.roomImg !== '' && JSON.parse(res.roomImg).length
								this.info.roomImg = res.roomImg !== '' && JSON.parse(res.roomImg)
								this.info.roomImg.map(item => {
									item.url = this.$util.thumbnailImage(item.url, true)
								})
							} else {
								this.info.roomImg = []
							}
						}
					})
					
					this.$httpApi.getRoomTypeAndSpaceList({
						id: this.projectId
					}).then(res => {
						if (res) {
							this.spaceList = res
							this.parsingSpaceList()
						}
					})
				}
			
			},
			viewShow() {
				this.toPage('/pages/construction/measuringRoom/measuringRoomPageDetails')
			},
			preview(current) {
				let imageList = []
				this.info.roomImg.map(item => {
					imageList.push(item.url)
				})
				uni.previewImage({
					current: this.imageCountNew,
					urls: imageList,
				});
			},
			parsingSpaceList() {
				let tempName = []
				let tempNewNameList = []
				this.spaceList.map((item, index) => {
					if (Number(item.attributeValue)) {
						tempName.push({
							name: item.attributeName,
							num: item.attributeValue,
							sort: this.spaceList.length + index,
						})
					}
				})
				tempName.map(item => {
					this.spaceNameList.map(el => {
						if (item.name.includes(el.label)) {
							item.name = el.value
							item.sort = el.sort
						}
					})
				})
				this.spaceName = ''
				this.sortArray(tempName, 'sort', 'asc').map(item => {
					this.spaceName += item.num + item.name
				})
			},
			sortArray(data, key, order) {
				if (order == 'asc') {
					data.sort((a, b) => a[key] - b[key]);
				} else if (order == 'desc') {
					data.sort((a, b) => b[key] - a[key]);
				}
				return data;
			}

		}
	}
</script>

<style lang="scss" scoped>
	.public-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.public-flex {
		display: flex;
		align-items: center;
	}

	.measuring-room-information {
		background-color: $bgColor;
		padding: 54rpx 40rpx 40rpx 40rpx;
		border-radius: $miniBorderRadius;

		.show-title {
			.left {
				max-width: 500rpx;
				overflow: hidden;
				font-weight: bold;
				white-space: nowrap;
			}
		}

		.information-title {
			justify-content: space-between;
			margin-bottom: 60rpx;

			.left {

				text-overflow: ellipsis;
				font-size: 30rpx;
				color: $seconFontColor;
			}

			.right {
				text {
					font-size: $smallFontSize;
					color: $themeColor;
					margin-right: 12rpx;
				}

				image {
					width: 16rpx;
					height: 14rpx;
				}
			}
		}

		.information-top-contain {
			margin-bottom: 42rpx;
			text-align: center;
			// white-space: nowrap;
			// overflow-x: scroll;

			.item-contain {
				flex: 1;
				flex-direction: column;

				text {
					display: grid;
					line-height: 1.2;

					&:nth-of-type(1) {
						font-size: 30rpx;
						color: $seconFontColor;
					}

					&:nth-of-type(2) {
						font-size: $smiddleFontSize;
						color: $viceFontColor;
					}
				}


			}
		}

		.image-contain {
			margin: 0 auto;
			width: 448rpx;
			height: 428rpx;
			background: linear-gradient(0deg, rgba(217, 217, 217, 0.2), rgba(217, 217, 217, 0.2));
			border-radius: 8px;
			margin-bottom: 58rpx;
			flex-direction: column;


			image {
				width: 260rpx;
				height: 170rpx;
				margin-bottom: 56rpx;
			}

			text {
				color: $middleFontSize;
				color: #909199;
			}

			.image-swiper-contain {
				position: relative;

				.num-contain {
					background-color: rgba(0, 0, 0, 0.5);
					position: absolute;
					bottom: 16rpx;
					right: 16rpx;
					height: 40rpx;
					line-height: 40rpx;
					display: inline-block;
					border-radius: 50rpx;
					padding: 0 14rpx;

					.left {
						font-size: 20rpx;
						color: #FFFFFF;
					}

					.right {
						font-size: 24rpx;
						color: #FFFFFF;
					}
				}
			}
		}


		.bottom-contain {
			border-top: 2rpx dashed #EEEEEE;
			padding-top: 30rpx;

			.personnel-contain {

				.heterogeneous {
					color: $viceFontColor;
					margin-left: 20rpx;
				}

				text {
					font-size: $smallFontSize;
					color: $mainFontColor;
				}

			}
		}
	}
</style>
