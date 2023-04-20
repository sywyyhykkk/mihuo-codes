<template>
	<view class="case-details">

		<view class="case-approval-text"
			v-if="details.verifyStatus !== 1 && option.listTypeName !== '草稿' && optionType !== '预览'">
			{{setApprovalText}}
			<text class="reason" v-if="details.verifyStatus == 2" @click="getReason()">点击查看原因</text>
		</view>

		<view class="swiper-content">
			<u-swiper :list="imageList" height="490" :autoplay="false" :circular="false" @change="imageChange"
				@click="getSwiper">
			</u-swiper>
			<view class="img-count">
				<view class="text">{{ imageCurrent }} / {{imageList.length}} </view>
			</view>
			<!-- <image v-if="item.type === 'video'" src="/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay($util.thumbnailImage(item.url, false))"></image>	 -->
		</view>

		<!-- 案例详情 -->
		<view class="details-introduction" v-if="option.type == '案例'">
			<view class="item-name">{{details.title}}</view>
			<view class="item-user">
				<u-avatar class="icon-image" :src="$util.avatarImage(userId)" size="40">
				</u-avatar>
				<text>{{userInfo.nickName}}</text>
			</view>
			<view class="tag-contain">
				<view class="item-tag" v-for="(item,index) in details.tagList" :key="index">
					{{item}}
				</view>
			</view>
		</view>

		<!-- 服务详情 -->
		<view class="service-contain" v-if="option.type == '服务'">
			<view class="item-name">{{details.content}}</view>
			<view class="item-other">
				<view class="item-price">
					<text class="num">{{details.price}}</text>
					<text class="unit">{{details.unit}}</text>
				</view>
				<text class="item-time">{{details.created && details.created.substring(0,16)}}</text>
			</view>
		</view>

		<!-- 案例详情 -->
		<view class="details-contain" v-if="option.type == '案例'">
			<view class="item-desc">
				<view class="desc-title">
					案例描述
				</view>
				<view class="desc-text">
					{{details.description}}
				</view>
			</view>

			<!-- 案例描述图片	 -->
			<view class="desc-list">
				<view class="item-contain" v-for="(item,index) in details.annexList" :key="index">
					<view class="item-images">
						<u-lazy-load class="item-image-contian" height="300" :key="index" :style="{ width: '710rpx' }"
							imgMode="aspectFill" border-radius="10" :image="$util.thumbnailImage(item.url,false)">
						</u-lazy-load>
					</view>
				</view>
			</view>

			<!-- 自定义模块 -->
			<view class="desc-list">
				<view class="item-contain" v-for="(item,index) in details.customContentList" :key="index">
					<view class="item-name">{{item.name}}</view>
					<view class="item-desc">{{item.desc}}</view>
					<view class="item-images">
						<u-lazy-load class="item-image-contian" height="300" v-for="(en,nums) in item.pics" :key="nums"
							:style="{ width: '710rpx' }" imgMode="aspectFill" border-radius="10"
							:image="$util.thumbnailImage(en.url,true)">
						</u-lazy-load>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务详情 -->
		<view class="service-contain-detaisl" v-if="option.type == '服务'">
			<view class="item-contian" v-for="(item,index) in  details.customContentList" :key="index">
				<view class="item-title">
					<view class="left"></view>
					<view class="other">{{item.name}}</view>
					<view class="right"></view>
				</view>
				<view class="text-contian">
					<view class="item-text-contian" v-for="(ev,num) in item.list" :key="num">
						<view class="item-desc">
							{{num+1}}. {{ev.title}}
						</view>
						<view class="item-images-contain">
							<u-lazy-load class="item-image" v-for="(en,nums) in ev.pics" :key="nums" height="332"
								:style="{ width: '664rpx' }" imgMode="aspectFill" border-radius="10"
								:image="$util.thumbnailImage(en.url,true)">
							</u-lazy-load>
						</view>
					</view>
				</view>
			</view>

			<view class="attention-desc">
				<view class="desc-title">
					注意事项
				</view>
				<view class="desc-text">
					{{details.precautions}}
				</view>
			</view>

		</view>



		<!-- 案例详情 -->
		<view class="relation-contain" v-if="option.type == '案例' && details.relationServiceName && serviceDetails">
			<view class="item-title">关联商品</view>
			<view class="item-top">
				<view class="image-contain">
					<u-lazy-load class="item-image" height="140" :style="{ width: '140rpx' }" imgMode="aspectFill"
						border-radius="10"
						:image="$util.thumbnailImage(serviceDetails.coverImgAll && serviceDetails.coverImgAll.url,true)">
					</u-lazy-load>
				</view>
				<view class="item-left">
					<text class="item-name">{{serviceDetails.title}}</text>
					<text class="item-unit">
						<text class="num">{{serviceDetails.price}}</text>
						<text class="unit">{{serviceDetails.unit}}</text>
					</text>
					<text class="item-time">
						<text class="time">{{serviceDetails.created && serviceDetails.created.substring(0,16)}}
							上传</text>
					</text>
				</view>
			</view>
		</view>

		<view class="bottom-contain" v-if="setOperationList.length > 0">
			<!-- <view class="button-list">
				<view class="item-button" :class="[item.active ? 'item-button-active':'']"
					v-for="(item,index) in setOperationList" :key="index" @click="getButton(item)"> {{item.name}}</view>
			</view> -->

			<view class="button-list">
				<view class="item-button" :class="[item.display ? 'operation-display':'']"
					v-for="(item,index) in setOperationList" :key="index" @click="getButton(item)">
					<text>{{item.name}}</text>
					<image v-if="item.icon" :src="item.icon" mode=""></image>
				</view>
			</view>
		</view>


		<!-- 审核失败原因查看弹框 -->
		<u-modal v-model="reasonShow" width="600" :async-close="true" :mask-close-able="true"
			:show-confirm-button="false" :show-title="false">
			<view class="model-contain">
				<view class="text">审核不通过原因</view>
				<view class="desc">{{details.verifyReason}}</view>
				<view class="images-contain">
					<u-lazy-load class="item-image" v-for="(item,index) in details['verifyAnnexList']" :key="index"
						height="114" :style="{ width: '114rpx' }" @click="preview(index)" imgMode="aspectFill"
						border-radius="10" :image="$util.thumbnailImage(item,true)">
					</u-lazy-load>
				</view>
				<view class="button" @click.stop="reasonShow = false">我知道了</view>
			</view>
		</u-modal>

		<!-- 删除弹框 -->
		<modal-new :shutDown="true" v-model="deleteShow" @click="deleteConfirm" @cancel="deleteModalCancel">
			<view class="label">{{deleteTitle}}</view>
		</modal-new>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				reasonShow: false,
				deleteShow: false,
				deleteTitle: '是否删除该数据~',
				details: '',
				imageCurrent: 1,
				userInfo: uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser,
				userId: uni.getStorageSync('userData') && uni.getStorageSync('userData').sysUser.userId,
				buttonList: [{
						name: '删除',
						active: false,
						verifyStatus: 1
					},
					{
						name: '下架',
						activeBorder: true,
						verifyStatus: 1
					},
					{
						name: '修改',
						active: true,
						verifyStatus: 1
					},
					{
						name: '删除',
						active: false,
						verifyStatus: 2
					},
					{
						name: '重新修改',
						active: true,
						verifyStatus: 2
					},
					{
						name: '撤回发布',
						active: true,
						verifyStatus: 0
					}
				],
				imageList: [],
				serviceList: [],
				serviceDetails: '',
				listTypeName: '',
				optionType: '',
				form: '',
				operationList: [{
						name: '编辑',
						icon: '/static/images/icon_edit/editor_5.png',
						display: false
					},
					{
						name: '上架',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '下架',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '发布',
						icon: '/static/images/upload_folder.png',
						display: false
					},
					{
						name: '删除',
						icon: '/static/images/delete_icon/delete_1.png',
						display: false
					}
				],
			}
		},
		computed: {
			setButtonList() {
				return this.buttonList.filter(item => item.verifyStatus == this.details.verifyStatus)
			},
			setOperationList() {
				if (this.optionType == '预览') {
					return []
				} else {
					let tempOperationList = JSON.parse(JSON.stringify(this.operationList))
					switch (this.option.listTypeName) {
						case '展示中': // 审核通过
							tempOperationList = tempOperationList.filter(ev => ev.name !== '上架')
							break;
						case '审核中':
							tempOperationList.forEach(el => {
								if (this.details.verifyStatus == 0 && el.name == '上架') {
									el.display = true
								}
							})
							tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
							break;
						case '已下架':
							tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
							break;
						case '审核未通过':
							tempOperationList.forEach(el => {
								if (this.details.verifyStatus == 2 && el.name == '上架') {
									el.display = true
								}
							})
							tempOperationList = tempOperationList.filter(ev => ev.name !== '下架')
							break;
						case '草稿':
							tempOperationList = tempOperationList.filter(ev => !['上架', '下架'].includes(ev.name))
							break
						default:
							break;
					}

					if (this.option.listTypeName !== '草稿') {
						tempOperationList = tempOperationList.filter(ev => ev.name !== '发布')
					}

					if (this.option.typeName == '预览') {
						tempOperationList = tempOperationList.filter(ev => ev.name !== '编辑')
					}
					return tempOperationList || []
				}

			},
			setApprovalText() {
				let tempMap = {
					0: `您发布的${this.option.type}正在审核中，审核通过后自动发布！`,
					1: '审核通过',
					2: `您发布的${this.option.type}审核未通过，`
				}
				return tempMap[this.details.verifyStatus] ?? ''
			}
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setOption()
			// 处理预览服务
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('previewService', (data) => {
				this.optionType = data.type
				this.details = data.form
				this.form = data.form
				this.getPreview(data)
			});
		},
		methods: {
			getPreview(data) {
				this.option.type = data.typeName
				uni.setNavigationBarTitle({
					title: this.details.title
				})

				// 赋值封面图
				if (this.$isJSON(data.form.coverImg)) {
					let coverImg = JSON.parse(data.form.coverImg)
					coverImg.forEach(el => {
						this.imageList.push({
							image: el.type == 'img' ? this.$util.thumbnailImage(el.url,
								true) : this.$util.thumbnailVideo(el.url),
							type: el.type,
							url: el.url
						})
					})
				}

				if (this.option.type == '案例') {
					this.details['tagList'] = this.details.tags && this.details.tags.split('，')
					if (this.$isJSON(this.details.customContent)) {
						this.details['customContentList'] = JSON.parse(this.details.customContent)
						this.details['customContentList'].forEach(el => {
							if (this.$isJSON(el.pics)) {
								el.pics = JSON.parse(el.pics)
							}
						})
					}

					if (this.$isJSON(this.details.annex)) {
						this.details['annexList'] = JSON.parse(this.details.annex)
					}

					if (this.details.verifyAnnex) {
						this.details['verifyAnnexList'] = this.details.verifyAnnex.split(',')
					}
				} else {
					if (this.$isJSON(this.details.customContent)) {
						this.details['customContentList'] = JSON.parse(this.details.customContent)
					}
				}
				console.log('this.details', this.details, this.option.type);
			},
			setOption() {
				if (this.option.type == '服务') {
					this.selectServiceDetails()
				} else {
					this.caseDetails()
				}
			},
			getReason() {
				this.reasonShow = !this.reasonShow
			},
			imageChange(item) {
				this.imageCurrent = item + 1
			},
			getSwiper(index) {
				let tempUrl = this.imageList[index].url
				if (!tempUrl) {
					return
				}
				let resultUrl = this.$util.thumbnailImage(tempUrl, false)
				if (this.imageList[index].type == 'video') {
					this.toPage(`/pages/full-screen/full-screen?url=${resultUrl}`);
				} else {
					uni.previewImage({
						current: index,
						urls: [resultUrl],
						loop: true,
						indicator: 'number'
					});
				}
			},
			selectServiceDetails() {
				if (!this.option.detailsId) {
					return
				}
				this.$httpApi.serviceDetails({
					id: this.option.detailsId
				}).then(res => {
					if (res) {
						this.details = res
						uni.setNavigationBarTitle({
							title: this.details.title
						})
						if (this.$isJSON(this.details.customContent)) {
							this.details['customContentList'] = JSON.parse(this.details.customContent)
						}

						if (this.details.verifyAnnex) {
							this.details['verifyAnnexList'] = this.details.verifyAnnex.split(',')
						}
						if (this.$isJSON(this.details.coverImg)) {
							this.details['coverImgAll'] = JSON.parse(this.details.coverImg)
							this.details['coverImgAll'].forEach(el => {
								this.imageList.push({
									image: el.type == 'img' ? this.$util.thumbnailImage(el.url,
										true) : this.$util.thumbnailVideo(el.url),
									type: el.type,
									url: el.url
								})
							})
						}

					}
				})
			},
			caseDetails() {
				if (!this.option.detailsId) {
					return
				}
				this.$httpApi.caseDetails({
					id: this.option.detailsId
				}).then(res => {
					if (res) {
						this.details = res
						uni.setNavigationBarTitle({
							title: this.details.title
						})
						if (this.details.tags) {
							this.details['tagList'] = this.details.tags.split('，')
						}

						if (this.$isJSON(this.details.customContent)) {
							this.details['customContentList'] = JSON.parse(this.details.customContent)
							this.details['customContentList'].forEach(el => {
								if (this.$isJSON(el.pics)) {
									el.pics = JSON.parse(el.pics)
								}
							})
						}

						if (this.$isJSON(this.details.annex)) {
							this.details['annexList'] = JSON.parse(this.details.annex)
						}

						if (this.details.verifyAnnex) {
							this.details['verifyAnnexList'] = this.details.verifyAnnex.split(',')
						}
						if (this.$isJSON(this.details.coverImg)) {
							this.details['coverImgAll'] = JSON.parse(this.details.coverImg)
							this.details['coverImgAll'].forEach(el => {
								this.imageList.push({
									image: el.type == 'img' ? this.$util.thumbnailImage(el.url,
										true) : this.$util.thumbnailVideo(el.url),
									type: el.type,
									url: el.url
								})
							})
						}
						this.getServiceDetails()
					}
				})
			},
			getServiceDetails() {
				if (!this.details.relationServiceName) {
					return
				}
				this.$httpApi.serviceDetails({
					id: this.details.relationServiceId
				}).then(res => {
					if (res) {
						this.serviceDetails = res
						if (this.$isJSON(res.customContent)) {
							this.customContentList = JSON.parse(res.customContent)
						}
						if (this.$isJSON(this.serviceDetails.coverImg)) {
							this.serviceDetails['coverImgList'] = JSON.parse(this.serviceDetails.coverImg)
							this.serviceDetails['coverImgAll'] = this.serviceDetails['coverImgList'][0]
						}
					}
				})
			},
			getButton(item) {
				// 处理预览情况下的保存草稿、发布
				if (this.optionType) {
					switch (item.name) {
						case '保存草稿':
							if (this.option.type == '服务') {
								this.$httpApi.serviceitemsAdd(this.form).then(res => {
									if (res) {
										this.$util.toast("操作成功");
										setTimeout(() => {
											uni.navigateBack({
												delta: 2
											});
										}, 1000)
									}
								})
							} else {

							}
							break
						case '发布':
							if (this.option.type == '服务') {
								this.form.status = 1
								this.$httpApi.serviceitemsAdd(this.form).then(res => {
									if (res) {
										this.$util.toast("操作成功");
										setTimeout(() => {
											uni.navigateBack({
												delta: 2
											});
										}, 1000)
									}
								})
							} else {

							}
							break
					}
					return
				}

				if (item.display) {
					return
				}
				if (this.option.type == '服务') {
					switch (item.name) {
						case '删除':
							this.deleteShow = !this.deleteShow
							break
						case '下架':
							this.updateServiceByPublish([this.details.id], 0)
							break
						case '编辑':
							// this.toPage(
							// 	`/pages/mine/shop/addService?shopId=${this.option.shopId}&serviceId=${this.details.id}&type=编辑`
							// )
							uni.redirectTo({
								url: `/pages/mine/shop/addService?shopId=${this.option.shopId}&serviceId=${this.details.id}&type=编辑`
							})
							break
						case '撤回发布':
							this.updateServiceByPublish([this.details.id], 0)
							break
						case '重新修改':
							this.toPage(
								`/pages/mine/shop/addService?shopId=${this.option.shopId}&serviceId=${this.details.id}&type=编辑`
							)
							break
						case '发布':
							this.batchPublish([this.details.id], 1)
							break
					}
				} else {
					switch (item.name) {
						case '删除':
							this.deleteShow = !this.deleteShow
							break
						case '下架':
							this.updateCaseByPublish([this.details.id], 0)
							break
						case '修改':
							uni.redirectTo({
								url: `/pages/mine/shop/addCase?shopId=${this.option.shopId}&caseId=${this.details.id}&type=编辑`
							})
							break
						case '撤回发布':
							this.updateCaseByPublish([this.details.id], 0)
							break
						case '编辑':
							uni.redirectTo({
								url: `/pages/mine/shop/addCase?shopId=${this.option.shopId}&caseId=${this.details.id}&type=编辑`
							})
							break
						case '发布':
							this.batchPublish([this.details.id], 1)
							break
					}
				}

			},
			deleteConfirm() {
				this.deleteShow = !this.deleteShow
				if (this.option.type == '服务') {
					this.deleteByIdsService([this.details.id])
				} else {
					this.deleteByIdsCase([this.details.id])
				}
			},
			deleteModalCancel() {
				this.deleteShow = !this.deleteShow
			},
			updateServiceByPublish(ids, status = 1) {
				this.$httpApi.updateServiceByPublish({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功，将返回上一页~");
						setTimeout(() => {
							this.goBack()
						}, 500)
						this.setOption()
					}
				})
			},
			updateCaseByPublish(ids, status = 1) {
				this.$httpApi.updateCaseByPublish({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.setOption()
					}
				})
			},
			deleteByIdsService(ids) {
				this.$httpApi.deleteByIdsService(ids).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.goBack()
					}
				})
			},
			deleteByIdsCase(ids) {
				this.$httpApi.deleteByIdsCase(ids).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.goBack()
					}
				})
			},
			/**
			 * @description 批量发布
			 * */
			batchPublish(ids, status) {
				this.$httpApi.updateByStatus({
					ids: ids,
					status: status
				}).then(res => {
					if (res) {
						this.$util.toast("操作成功~");
						this.setOption()
					}
				})
			},
			getStatus(item) {
				if (item.status == 1) {
					// verifyStatus 审核状态：0->未审核；1->审核通过 2-->审核不通过
					let tempMap = {
						0: '审核中',
						1: '审核通过',
						2: '审核不通过'
					}
					return tempMap[item.verifyStatus] ?? ''
				} else {
					// status 状态：0->草稿 1->发布
					let tempMap = {
						0: '草稿'
					}
					return tempMap[item.status] ?? ''
				}

			},
			preview(index) {
				let urlList = JSON.parse(JSON.stringify(this.details['verifyAnnexList']))
				let resultList = []
				urlList.forEach(el => {
					resultList.push(this.$util.thumbnailImage(el, false))
				})
				uni.previewImage({
					current: index,
					urls: resultList,
					loop: true,
					indicator: 'number'
				});
			}
		}
	}
</script>
<style lang="scss" lang="scss" scoped>
	/* @import url(); 引入css类 */

	.label {
		color: #999999;
		font-size: $middleFontSize;
		text-align: center;
	}

	.case-details {
		padding-top: 20rpx;
		padding-bottom: 200rpx;

		.case-approval-text {
			color: #FF5D35;
			font-size: 28rpx;
			line-height: 44rpx;
			padding-left: 28rpx;
			margin-bottom: 20rpx;

			.reason {
				color: #002FA5;
				font-size: 28rpx;
			}
		}

		.swiper-content {
			position: relative;

			.img-count {
				position: absolute;
				right: 20rpx;
				bottom: 40rpx;
				width: 86rpx;
				height: 40rpx;
				border-radius: 15px;
				text-align: center;
				background: rgba(0, 0, 0, 0.5);

				.text {
					font-size: 28rpx;
					color: #fff;
					line-height: 40rpx;
				}
			}
		}

		.details-introduction {
			position: relative;
			z-index: 10;
			border-radius: 30rpx 30rpx 10rpx 10rpx;
			background: #FFFFFF;
			padding: 34rpx;
			margin-top: -20rpx;
			margin-bottom: 20rpx;

			.item-name {
				color: #303133;
				font-size: 32rpx;
				margin-bottom: 6rpx;
			}

			.item-user {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;

				text {
					color: #606166;
					font-size: 28rpx;
					margin-left: 10rpx;
				}
			}

			.tag-contain {
				display: flex;

				.item-tag {
					border-radius: 10rpx;
					background: #F6F6F6;
					padding: 10rpx 20rpx;
					color: #303133;
					font-size: 24rpx;
					margin-right: 20rpx;
				}
			}
		}

		.service-contain {
			padding: 22rpx 46rpx 44rpx 46rpx;
			border-radius: 0px 0px 10rpx 10rpx;
			margin-bottom: 10rpx;
			background: #FFFFFF;

			.item-name {
				color: #303133;
				font-size: 30rpx;
				margin-bottom: 16rpx;
				font-weight: bold;
				word-break: break-all;
			}

			.item-other {
				display: flex;
				justify-content: space-between;

				.item-price {

					.num {
						color: #FF5D35;
						font-size: 36rpx;
					}

					.unit {
						color: #FF5D35;
						font-size: 24rpx;
					}
				}

				.item-time {
					color: #909199;
					font-size: 28rpx;
				}
			}
		}

		.details-contain {
			border-radius: 30rpx 30rpx 10rpx 10rpx;
			background: #FFFFFF;
			padding: 14rpx 0rpx;

			.item-desc {
				margin-bottom: 20rpx;

				.desc-title {
					padding: 0 32rpx;
					color: #303133;
					font-size: 32rpx;
					margin-bottom: 20rpx;
				}

				.desc-text {
					padding: 0 32rpx;
					font-size: 30rpx;
					font-weight: normal;
					line-height: 46rpx;
					letter-spacing: 0px;
					color: #606166;
				}

			}

			.desc-list {

				.item-contain {

					.item-name {
						padding: 0 32rpx;
						color: #303133;
						font-size: 32rpx;
						margin-bottom: 20rpx;
					}

					.item-desc {
						padding: 0 32rpx;
						font-size: 30rpx;
						font-weight: normal;
						line-height: 46rpx;
						letter-spacing: 0px;
						margin-bottom: 20rpx;
						color: #606166;
					}

					.item-images {
						padding: 0 20rpx;
						margin-bottom: 20rpx;


						.item-image-contian {
							margin-bottom: 20rpx;
						}
					}
				}

			}
		}

		.service-contain-detaisl {
			.item-contian {
				margin-bottom: 20rpx;
			}

			.item-title {
				display: flex;
				height: 88rpx;
				align-items: center;
				justify-content: center;
				background-color: #fff;
				margin-bottom: 2rpx;

				.left {
					border-radius: 30rpx;
					width: 120rpx;
					height: 6rpx;
					background: linear-gradient(90deg, #002FA5 1%, #FFFFFF 100%);
				}

				.other {
					margin: 0 30rpx;
					color: #002FA5;
					font-size: 32rpx;
				}

				.right {
					border-radius: 30rpx;
					width: 120rpx;
					height: 6rpx;
					background: linear-gradient(90deg, #002FA5 1%, #FFFFFF 100%);
				}
			}



			.text-contian {
				padding: 40rpx 40rpx 28rpx 40rpx;
				background-color: #fff;

				.item-text-contian {

					.item-desc {
						color: #909199;
						font-size: 28rpx;
						margin-bottom: 20rpx;
					}

					.item-images-contain {
						.item-image {
							margin-bottom: 20rpx;
						}
					}
				}
			}

			.attention-desc {
				background-color: #fff;
				padding: 20rpx 0rpx;

				.desc-title {
					padding: 0 32rpx;
					color: #303133;
					font-size: 32rpx;
					margin-bottom: 20rpx;
				}

				.desc-text {
					padding: 0 32rpx;
					font-size: 30rpx;
					font-weight: normal;
					line-height: 46rpx;
					letter-spacing: 0px;
					color: #606166;
				}
			}
		}


		.relation-contain {

			.item-title {
				color: #3D3D3D;
				font-size: 32rpx;
				padding: 36rpx;
			}

			.item-top {
				padding: 32rpx;
				margin-bottom: 30rpx;
				display: flex;
				background-color: #fff;

				.image-contain {
					position: relative;

					.item-status {
						position: absolute;
						border-radius: 10rpx 0rpx 10rpx 0rpx;
						background-color: rgba(0, 0, 0, 0.3);
						left: 0;
						top: 0;
						padding: 6rpx 10rpx;
						color: #fff;
						font-size: 24rpx;
					}
				}

				.item-left {
					margin-left: 30rpx;
					display: flex;
					flex-direction: column;

					.item-name {
						color: #333333;
						font-size: 30rpx;
						line-height: 42rpx;
						margin-bottom: 4rpx;
					}

					.item-unit {
						margin-bottom: 8rpx;


						.unit {
							line-height: 20rpx;
							color: #303133;
							font-size: 26rpx;
						}

						.num {
							color: #FF4D35;
							font-size: 28rpx;
						}
					}


					.item-time {
						.time {
							color: #909199;
							font-size: 26rpx;
						}

					}
				}
			}
		}

	}



	.model-contain {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 36rpx 40rpx;
		// height: 190rpx;

		.text {
			font-weight: 400;
			font-size: $middleFontSize;
			color: #303133;
			margin-bottom: 24rpx;
		}

		.desc {
			color: #606166;
			font-size: 28rpx;
			margin-bottom: 24rpx;
		}

		.button {
			border: 1px solid $themeColor;
			color: $themeColor;
			box-sizing: border-box;
			border-radius: 10rpx;
			height: 72rpx;
			left: 50rpx;
			width: 426rpx;
			text-align: center;
			line-height: 72rpx;
			font-size: $smallFontSize;
			margin-top: 34rpx;
		}

		.images-contain {
			display: flex;
			flex-wrap: wrap;

			.item-image {
				margin-right: 10rpx;
				margin-bottom: 10rpx;
			}
		}
	}


	.bottom-contain {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFF;
		z-index: 10;
		box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
		display: flex;
		align-items: center;
		@include buttonsafearea();

		.button-list {
			display: flex;
			margin: 20rpx 20rpx 2rpx 20rpx;
			flex: 1;
			justify-content: flex-end;
			overflow-y: hidden;
			align-items: center;

			.item-button {
				display: flex;
				height: 80rpx;
				line-height: 80rpx;
				flex: 1;
				border-radius: 10rpx;
				align-items: center;
				justify-content: center;
				background: #FFFFFF;
				box-sizing: border-box;
				border: 1px solid #EEEEEE;
				margin-right: 14rpx;

				padding: 0 40rpx;

				text {
					color: #303133;
					font-size: 28rpx;
					margin-right: 6rpx;
				}

				image {
					width: 36rpx;
					height: 36rpx;
				}

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-button-active {
				display: flex;
				flex: 1;
				justify-content: center;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 10rpx;
				background: #002FA5;
				box-sizing: border-box;
				border: 1px solid #fff;
				margin-right: 14rpx;
				font-size: 28rpx;
				color: #fff;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.operation-display {
				opacity: 0.4;
			}


		}
	}
</style>
