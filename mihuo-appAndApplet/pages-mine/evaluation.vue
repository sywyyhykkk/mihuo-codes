<template>
	<view class="evaluation-contain">
		<z-nav-bar backState="1000" type="transparent" fontColor="#FFFFFF">
			<view class="nav-bar" slot="default">
				发表评价
			</view>
		</z-nav-bar>
		<view class="header" v-if="headerShow"></view>
		<view class="evaluation-order-contain">
			<view class="item-order" v-for="(item,index) in detail.orderItemList" :key="index">
				<view class="middle pu-bm">
					<view class="information-contain x6-flex">
						<u-lazy-load class="order-middle-image" border-radius="10" height="176" imgMode="aspectFill"
							:image="$util.thumbnailImage(item.productPic, true)">
						</u-lazy-load>
						<view class="information">
							<view class="name">{{item.productName}}</view>
							<view class="pice" v-show="item.productPrice">￥{{item.productPrice}}</view>
						</view>
					</view>
					<view class="evaluation-input">
						<u-input v-model="form.comment[index] " class="describe-input" height="190" type="textarea"
							placeholder="从多个角度描写评价，帮助更多有需要的朋友" :border="false" />
							<image-upload-new v-model="form.pics[index]" count="9" />
						<!-- <view class="file-status">
							<mine-mh-custom-file-upload :index="index" :uploadType="uploadType" :count="9"
								@change="getAttachment" ref="imageUpload" />
						</view>
						<view class="evaluation-file x6-flex x6-item-flex" @click="getFlieUpload(index)">
							<image class="input-icon" src="https://www.51mihuo.com/static/images/order_details/camera.png" mode="">
							</image>
							<text class="file-placeholder">添加图片/视频</text>
						</view> -->
					</view>
				</view>
				<view class="bottom pu-bm">
					<view class="bottom-title" v-if="detail.company">
						{{ detail.company.companyName }}
					</view>
					<view class="score">
						<ul>
							<li><text class="lable-text">描述相符</text>
								<u-rate gutter="15" inactive-icon="star-fill" active-color="#FF6A32"
									inactive-color="#C2C2C2" :count="count" v-model="form.productScore[index]"></u-rate>
							</li>
							<li><text class="lable-text">物流服务</text>
								<u-rate gutter="15" inactive-icon="star-fill" active-color="#FF6A32"
									inactive-color="#C2C2C2" :count="count" v-model="form.deliveryScore[index]">
								</u-rate>
							</li>
							<li><text class="lable-text">服务态度</text>
								<u-rate gutter="15" inactive-icon="star-fill" active-color="#FF6A32"
									inactive-color="#C2C2C2" :count="count" v-model="form.serviceScore[index]"></u-rate>
							</li>
						</ul>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-button" v-if="headerShow" @click="saveEvaluation">
			提交评价
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {

		data() {
			return {
				option: {},
				count: 5,
				value: 2,
				commentStatus: true,
				randomTimer: null,
				uploadType: ['图片', '视频'],
				fileObject: {},
				detail: {},
				evaluationList: [],
				companyIdList: [],
				headerShow: false,
				fileIndex: 0,
				form: {
					orderId: '',
					productId: '',
					comment: [],
					serviceType: 1001,
					productScore: [],
					deliveryScore: [],
					serviceScore: [],
					tempPics: [],
					pics: []
				}
			}
		},
		onLoad(option) {
			this.option = option
			this.getMallDetails()
		},
		methods: {
			getComment() {
				this.commentStatus = !this.commentStatus
			},
			onBlur() {
				this.commentStatus = !this.commentStatus
			},
			bindTextAreaBlur() {
				this.commentStatus = !this.commentStatus
			},
			getAttachment(file, index) {
				this.fileObject = file
				this.form.tempPics[index] = file
			},
			saveEvaluation() {
				if (JSON.stringify(this.fileObject) === '{}') {
					this.debounce()
				} else {
					this.getUploadFile(() => {
						this.debounce()
					})
				}
			},
			debounce() {
				clearTimeout(this.randomTimer)
				this.randomTimer = setTimeout(() => {
					let tempList = []
					this.detail.orderItemList.map((el, index) => {
						tempList.push({
							orderSn: this.detail.orderSn,
							productId: el.productId,
							serviceType: el.serviceType,
							skuId: el.productSkuId,
							replyType: 0,
							comment: this.form.comment[index] || '系统自动评论',
							deliveryScore: this.form.deliveryScore[index],
							productScore: this.form.productScore[index],
							serviceScore: this.form.serviceScore[index],
							pics: JSON.parse(this.form.pics[index])
						})
					})
					this.$httpApi.addProductComment(tempList).then(res => {
						if (res) {
							this.$util.toast('评价成功')
							uni.$emit('updateAfterReply')
							setTimeout(() => {
								if(res.length === 1){
									uni.redirectTo({
										url: `/pages-mall/productDetail/commentDetail?id=${res[0].id}`
									})
								} else {
									this.goBack()
								}
							}, 1000)
						}
					})
				}, 1000)
			},
			getMallDetails() {
				this.$httpApi.getMallOrderDetailById(this.option.id).then(res => {
					if (res) {
						this.companyIdList = []
						this.evaluationList = []
						this.detail = res[0]
						if (this.detail.orderItemList.length > 0) {
							this.headerShow = true
							this.detail.orderItemList.map(el => {
								this.form.deliveryScore.push(0)
								this.form.productScore.push(0)
								this.form.serviceScore.push(0)
								this.form.tempPics.push(0)
								this.form.pics.push('')
							})
						}
					}
				})
			},
			getFlieUpload(index) {
				this.$refs.imageUpload[index].uploadImage()
			},
			async getUploadFile(callback) {
				// 图片、视频
				let imgFile = []
				let videoFile = []
				for (let index = 0; index < this.form.tempPics.length; index++) {
					if (this.form.tempPics[index].imgList) {
						for (let i = 0; i < this.form.tempPics[index].imgList.fileList.length; i++) {
						
							imgFile.push({
								key: index,
								type: 'img',
								url: await CommonUpload(this.form.tempPics[index].imgList.fileList[i])
							})
						}
					}

					if (this.form.tempPics[index].videoList) {
						for (let i = 0; i < this.form.tempPics[index].videoList.fileList.length; i++) {
							videoFile.push({
								key: index,
								type: 'video',
								url: await CommonUpload(this.form.tempPics[index].videoList.fileList[i])
							})
						}
					}
				}

				this.form.tempPics.map((item,index)=>{
					imgFile.map((el,num)=>{
						if(el.key === index){
							this.form.pics[index].push(el)
							console.log("el",el)
							
						}
					})
				})
				callback();
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-input {

		.uni-textarea-textarea {
			font-size: 28rpx;
			color: #606266;
		}
	}

	.x6-flex {
		display: flex;
	}

	.x6-item-flex {
		align-items: center;
		justify-content: center;
	}

	.pu-bm {
		background-color: #FFFFFF;
		margin: 0rpx 20rpx 10rpx 20rpx;
	}

	.header {
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
		height: calc(var(--status-bar-height) + 200rpx);
	}

	.item-order {
		padding-bottom: 20rpx;
	}

	.evaluation-order-contain {
		margin-top: -80rpx;
	}

	.evaluation-contain {
		padding-bottom: 40rpx;
	}
	
	.nav-bar {
		@include nav-bar-title(#FFFFFF)
	}

	.middle {
		min-height: 708rpx;
		border-radius: 30rpx 30rpx 10rpx 10rpx;


		.information-contain {
			padding: 28rpx 0rpx 28rpx 0rpx;
			margin: 0 38rpx 0 26rpx;
			border-bottom: 2rpx dashed #FFE7E2;

			.order-middle-image {
				width: 176rpx;
				height: 176rpx;
				margin-right: 22rpx;
			}

			.information {
				.name {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #303133;
					max-width: 448rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					margin-bottom: 6rpx;
					margin-top: 24rpx;
				}

				.pice {
					font-weight: bold;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #FF5D35;
				}

			}
		}

		.evaluation-input {
			padding: 44rpx 56rpx 62rpx 56rpx;

			.input-contain {
				// align-items: center;
				height: 200rpx;
				margin-bottom: 20rpx;

				.input-icon {
					width: 46rpx;
					height: 46rpx;
					margin-right: 20rpx;
				}

				.placeholder {
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #909199;
					margin-top: 8rpx;
				}
			}

			.describe-input {
				margin-bottom: 10rpx;
			}

			.evaluation-file {
				background: #F7F6FB;
				border-radius: 8px;
				width: 598rpx;
				height: 206rpx;
				flex-direction: column;

				.input-icon {
					width: 86rpx;
					height: 74rpx;
					margin-bottom: 12rpx;
				}

				.file-placeholder {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: center;
					color: #606166;
				}
			}

			.file-status {}
		}
	}

	.bottom {
		min-height: 416rpx;
		border-radius: 5px;
		padding: 46rpx 28rpx 60rpx 28rpx;


		.bottom-title {
			font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #303133;
			padding-bottom: 26rpx;
			border-bottom: 1px dashed #EEEEEE;
		}

		.score {
			padding-top: 48rpx;

			.lable-text {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #303133;
				margin-right: 10rpx;

			}

			ul {
				margin: 0;
				padding: 0;
			}

			li {
				list-style: none;
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

			}
		}
	}

	.bottom-button {
		width: 624rpx;
		height: 88rpx;
		margin: 0 auto;
		background: linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%);
		border-radius: 10rpx;
		font-weight: bold;
		font-size: 28rpx;
		line-height: 88rpx;
		text-align: center;
		color: #FFFFFF;
	}
</style>
