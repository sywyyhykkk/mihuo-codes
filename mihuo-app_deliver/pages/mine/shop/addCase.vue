<template>
	<view class="add-case-page">
		<view class="top-image">
			<custom-file-upload v-model="form.coverImg" :key="form.coverImg"></custom-file-upload>
		</view>

		<view class="information-contain">
			<view class="item-information">
				<text class="item-label public-name">案例标题</text>
				<u-input v-model="form.title" input-align="right" :clearable="false" class="describe-input"
					maxlength="200" type="text" placeholder="请输入案例标题" :border="true" />
			</view>
			<view class=" information-tag-contain">
				<view class="information-top">
					<text class="item-label public-name">案例标签</text>
					<u-icon name="arrow-right" color="#C4C4C4" size="28" @click="saveCase()"></u-icon>
				</view>
				<view class="tag-contain">
					<view class="item-tag" v-for="(item,index) in tagList" :key="index">
						<text>{{item}}</text>
						<u-icon class="item-icon" name="close-circle-fill" @click="getDelete(index)" color="#002FA5"
							size="26"></u-icon>
					</view>
				</view>
			</view>
			<view class="item-information">
				<text class="item-label public-name">案例总预算</text>
				<u-input v-model="form.price" input-align="right" :clearable="false" class="describe-input"
					maxlength="200" type="number" placeholder="请输入预算金额" :border="true" @input="setInput"
					@blur="setBlur" />
				<text class="item-unit">元</text>
			</view>
		</view>

		<view class="desc-contian">
			<text class="public-name">案例描述</text>
			<view class="public-item-bottom">
				<u-input v-model="form.description" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入案例描述" :border="true" />
			</view>
			<view class="images-contain">
				<image-upload-new :uploadType="uploadType" :count="9" v-model="form.annex" :key="imageUploadNewIndex"
					:isAddVideo="false" />
			</view>
			<view class="item-add" v-if="customContentList.length == 0" @click="addService('添加内容')" mode="">
				<image src="@/static/images/add-new.png"></image>
				<text>自定义添加模块</text>
			</view>
		</view>

		<!-- 自定义 -->
		<view class="case-custom-list">
			<view class="item-form" v-for="(item,index) in customContentList" :key="index">
				<view class="item-title">
					<text class="item-label public-name">内容标题</text>
					<u-input v-model="item.name" input-align="right" :clearable="false" class="describe-input"
						maxlength="200" type="text" placeholder="请添加内容标题" :border="true" />
				</view>
				<view class="item-list">
					<!-- <view class="item-list-contain" v-for="(ev,num) in item.list"> -->
					<view class="item-other">
						<text class="public-name">内容描述</text>
						<view class="public-item-bottom">
							<u-input v-model="item.desc" class="describe-input" maxlength="200" height="140"
								type="textarea" placeholder="请输入案例描述" :border="true" />
						</view>
						<view class="images-contain">
							<image-upload-new :uploadType="uploadType" :count="9" v-model="item.pics"
								:isAddVideo="false" />
						</view>
					</view>
					<view class="item-operation">
						<view class="item-detele" @click="addService('删除模块',index)">
							<image src="@/static/images/delete_icon/delete_2.png" mode=""></image>
							<text>删除模块</text>
						</view>
						<view class="item-detele" @click="addService('添加内容')">
							<image src="@/static/images/add-new.png" mode="">
							</image>
							<text>自定义添加</text>
						</view>
					</view>
					<!-- </view> -->
				</view>
			</view>
		</view>

		<view class="relation-contain" v-if="serviceList.length > 0">
			<view class="item-relation">
				<text class="public-name">是否关联商品</text>
				<view class="item-right">
					<text class="item-value">是</text>
					<u-switch v-model="relationStatus" size="24" active-color="#002FA5"></u-switch>
				</view>

			</view>
			<view class="item-relation" v-if="relationStatus" @click="getRelationShow()">
				<text class="public-name">选择和本案例相关的服务</text>
				<view class="item-right">
					<text class="item-value">{{serviceName}}</text>
					<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
				</view>
			</view>
		</view>

		<view class="bottom-contain">
			<view class="button-list">
				<view class="item-button"
					:class="[item.active ? 'item-button-active':'',item.activeBorder ? 'item-button-border-active':'']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)"> {{item.name}}</view>
			</view>
		</view>


		<!-- 案例标签弹框 -->
		<u-popup v-model="modelShow" border-radius="30" height="550" mode="bottom" :safe-area-inset-bottom="false"
			:closeable="true">
			<view class="form-contain">
				<view class="title">
					案例标签
				</view>
				<view class="item-contain">
					<view class="desc-contian">
						<text class="public-name">标签名称</text>
						<view class="public-item-bottom">
							<u-input v-model="caseName" class="describe-input" maxlength="200" height="140"
								type="textarea" placeholder="请输入标签名称" :border="true" />
						</view>
					</view>
				</view>
				<view class="bottom-add">
					<view class="item-add" @click="addResult()">
						保存
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 案例管联的商品 -->
		<u-picker mode="selector" v-model="relationShow" :default-selector="[selectorIndex]" :range="serviceList"
			range-key="title" @confirm="confirmUnit">
		</u-picker>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				modelShow: false,
				checked: true,
				relationShow: false,
				imageUploadNewIndex: 0,
				buttonList: [{
						name: '取消',
						active: false
					},
					{
						name: '预览',
						active: false
					},
					{
						name: '保存草稿',
						activeBorder: true
					}, {
						name: '确认发布',
						active: true
					}
				],
				uploadType: ['图片'],
				tagList: ['轻奢风', '小清新'],
				customContentList: [],
				relationStatus: false,
				caseName: '',
				serviceList: [],
				serviceName: '',
				selectorIndex: 0,
				form: {
					cityOperatorId: uni.getStorageSync('cityOperatorId'), //	运营商id		false	
					coverImg: '', //	封面		false	
					customContent: '', //	自定义内容		false	
					price: '', //	总预算价格		false	
					publishStatus: '', //	上架状态：0->下架；1->上架		false	
					relationServiceId: '', //  关联服务项目id false
					remark: '', //	备注		false	
					status: 0, //	状态：0->草稿 1->发布		false	
					tags: '', //	案例标签		false	
					title: '', //	标题		false	
					description: '', // 案例描述
					annex: '' // 附件
				}
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.setOption()

			this.option = option
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromOpenerPage', (data) => {
				this.newData = data
				this.getForm(data)
			});
		},
		methods: {
			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			setBlur(value) {
				this.$setBlur((result) => {
					this.form.price = result
				}, value)
			},
			setOption() {
				if (this.option.type) {
					uni.setNavigationBarTitle({
						title: '编辑案例'
					})
					this.$httpApi.caseDetails({
						id: this.option.caseId
					}).then(res => {
						if (res) {
							this.form = res
							if (this.$isJSON(res.customContent)) {
								this.customContentList = JSON.parse(res.customContent)
							}
							this.tagList = this.form.tags && this.form.tags.split('，') || []
							if (this.form.relationServiceId && Number(this.form.relationServiceId) !== 0) {
								this.relationStatus = true
							}
							this.imageUploadNewIndex++
							this.myServicePage()
						}
					})
				} else {
					this.myServicePage()
				}
			},
			myServicePage() {
				this.$httpApi.myServicePage({
					verifyStatus: 1,
					publishStatus: 1,
					status: 1,
					size: 99
				}).then(res => {
					if (res) {
						// publishStatus: 1, //上架状态：0->下架；1->上架
						// this.serviceList = res.records.filter(item => item.publishStatus == 1 && item.verifyStatus == 1 && item.status == 1)
						if (this.form.relationServiceId) {
							this.serviceList.forEach((item, index) => {
								if (item.id == this.form.relationServiceId) {
									this.selectorIndex = index
									this.serviceName = item.title
								}
							})
						}
					}
				})
			},
			saveCase() {
				this.modelShow = true
			},
			getDelete(index) {
				this.tagList.splice(index, 1)
			},
			addResult() {
				this.tagList.push(this.caseName)
				this.form.tags = this.tagList.join('，')
				this.modelShow = false
				this.caseName = ''
			},
			getRelationShow() {
				this.relationShow = true
			},
			confirmUnit(ev) {
				this.form.relationServiceId = this.serviceList[ev[0]].id
				this.serviceName = this.serviceList[ev[0]].title
			},
			addService(type, index) {
				switch (type) {
					case '添加内容':
						this.customContentList.push({
							name: '',
							desc: '',
							pics: ''
						})
						break
					case '删除模块':
						this.customContentList.splice(index, 1)
						break
					case '自定义添加':
						break
				}
			},
			getButton(item) {
				switch (item.name) {
					case '取消':
						this.goBack()
						break
					case '预览':
						let that = this
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}
						if (!this.form.title) {
							this.$util.toast("请输入案例标题~");
							return
						}

						if (this.relationStatus) {
							if (this.form.relationServiceId == '' || Number(this.form.relationServiceId) == 0) {
								this.$util.toast("请选择和本案例相关的服务~");
								return
							}
						}
						if (this.customContentList.length > 0) {
							this.form.customContent = JSON.stringify(this.customContentList)
						}
						this.form.tags = this.tagList.join('，')
						uni.navigateTo({
							url: '/pages/mine/shop/caseDetails',
							success(res) {
								res.eventChannel.emit('previewService', {
									type: '预览',
									typeName: '案例',
									form: that.form,
								});
							}
						})

						break
					case '保存草稿':
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}
						if (!this.form.title) {
							this.$util.toast("请输入案例标题~");
							return
						}
						if (this.relationStatus) {
							if (this.form.relationServiceId == '' || Number(this.form.relationServiceId) == 0) {
								this.$util.toast("请选择和本案例相关的服务~");
								return
							}
						}
						if (this.customContentList.length > 0) {
							this.form.customContent = JSON.stringify(this.customContentList)
						}
						this.form.tags = this.tagList.join('，')
						if (this.option.type) {
							this.form.id = this.option.caseId
							this.form.status = 0
							this.$httpApi.updateCase(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 500)
								}
							})
						} else {
							this.$httpApi.saveCase(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 500)
								}
							})
						}

						break
					case '确认发布':
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}
						if (!this.form.title) {
							this.$util.toast("请输入案例标题~");
							return
						}
						if (this.relationStatus) {
							if (this.form.relationServiceId == '' || Number(this.form.relationServiceId) == 0) {
								this.$util.toast("请选择和本案例相关的服务~");
								return
							}
						}
						this.form.tags = this.tagList.join('，')
						if (this.customContentList.length > 0) {
							this.form.customContent = JSON.stringify(this.customContentList)
						}
						
						if (this.option.type) {
							this.form.id = this.option.caseId
							this.form.status = 1
							this.$httpApi.updateCase(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 1500)
								}
							})
							return
						} else {
							this.form.status = 1
							this.$httpApi.saveCase(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 1500)
								}
							})
						}
						break
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.add-case-page {
		padding-top: 20rpx;
		padding-bottom: 180rpx;
	}

	.public-name {
		color: #303133;
		font-size: 28rpx;
	}

	.public-item-bottom {
		background-color: #F7F7F7;
		margin-top: 14rpx;

		.u-input {
			border: 0rpx;
		}
	}

	.top-image {
		background-color: #fff;
		padding: 50rpx;
		margin-bottom: 2rpx;

		/deep/ .evaluation-file {
			background-color: #fff !important;
		}
	}


	.information-contain {
		padding: 0 30rpx;
		background-color: #fff;

		.item-information {
			height: 134rpx;
			border-radius: 10rpx;
			border-bottom: 2rpx solid #F6F6F6;
			padding: 40rpx 0rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.u-input {
				border: 0rpx;
				color: #303133;
			}

			.item-label {}

			.item-value {}

			.item-unit {
				color: #303133;
				font-size: 28rpx;
			}
			
			/deep/ .u-input{
				padding: 0rpx !important;
			}
		}

		.information-tag-contain {
			display: flex;
			flex-direction: column;
			padding: 28rpx 0rpx 28rpx 0rpx;
			border-bottom: 2rpx solid #F6F6F6;

			.information-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}

			.tag-contain {
				display: flex;
				justify-content: start;
				width: 100%;
				margin-top: 30rpx;

				.item-tag {
					background-color: rgba(0, 47, 165, 0.1);
					border-radius: 50rpx;
					height: 40rpx;
					padding: 0 10rpx;
					margin-right: 20rpx;
					position: relative;
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
						color: #002FA5;
					}

					.item-icon {
						position: absolute;
						top: -2px;
						right: -16rpx;
					}
				}
			}
		}
	}



	.desc-contian {
		border-radius: 10rpx;
		background: #FFFFFF;
		padding: 24rpx 32rpx 38rpx 34rpx;
		margin-top: 4rpx;
		margin-bottom: 8rpx;

		.item-desc {
			font-size: 28rpx;
			color: #303133;
			margin-bottom: 14rpx;
			display: inline-block;
		}

		.images-contain {
			margin-top: 26rpx;
			margin-bottom: 46rpx;
		}

		.item-add {
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}

			text {
				color: #002FA5;
				font-size: 24rpx;
			}

		}
	}

	.case-custom-list {
		margin: 10rpx 0rpx;

		.item-form {
			margin-bottom: 10rpx;
		}

		.u-input {
			border: 0rpx;
		}

		.item-title {
			display: flex;
			align-items: center;
			padding: 0rpx 34rpx;
			border-radius: 10rpx 10rpx 0px 0px;
			background-color: #fff;
			margin-bottom: 2rpx;
			height: 112rpx;


		}

		.item-list {
			border-radius: 0px 0px 10rpx 10rpx;
			background: #FFFFFF;
			padding: 24rpx 34rpx 50rpx 34rpx;

			.images-contain {
				margin-top: 26rpx;
			}

			.item-operation {
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin-top: 40rpx;

				.item-detele {
					display: flex;
					align-items: center;

					text {
						margin-left: 4rpx;
						color: #909199;
						font-size: 24rpx;
					}
				}

				.item-add {
					display: flex;
					align-items: center;

					text {
						margin-left: 4rpx;
						color: #002FA5;
						font-size: 24rpx;
					}

				}

				image {

					width: 32rpx;
					height: 32rpx;
				}
			}
		}



	}


	.relation-contain {
		.item-relation {
			height: 112rpx;
			display: flex;
			align-items: center;
			padding: 0 52rpx;
			justify-content: space-between;
			background-color: #fff;
			margin-bottom: 2rpx;

			&:nth-of-type(1) {
				border-radius: 5px 5px 0px 0px;
			}

			&:nth-of-type(2) {
				border-radius: 0px 0px 5px 5px;
			}

			.item-right {
				display: flex;
				align-items: center;


				.item-value {
					color: #909199;
					font-size: 28rpx;
					margin-right: 10rpx;
					display: inline-block;
					max-width: 260rpx;
					overflow: hidden;
					text-overflow: ellipsis;

				}
			}
		}

	}

	.service-contain {
		padding: 24rpx 34rpx;
		border-radius: 10rpx;
		background: #FFFFFF;

		.subset-contain {
			margin-top: 14rpx;


			.item-subset {
				margin-bottom: 28rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-top {
					color: #303133;
					font-size: 26rpx;
					margin-bottom: 20rpx;
				}
			}


		}
	}

	.form-contain {
		height: 100%;
		background-color: #FFF;

		.title {
			text-align: center;
			padding: 36rpx 0rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.item-contain {
			height: calc(100% - 280rpx);

			.scroll-Y {
				height: 100%;
			}

		}

		.images-contain {
			padding: 0 32rpx;
		}

		.bottom-add {
			position: fixed;
			bottom: 30rpx;
			display: flex;
			justify-content: center;
			width: 100%;

			.item-add {
				width: 624rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: $themeColor;
				border-radius: $miniBorderRadius;
				color: #fff;



			}
		}
	}

	.bottom-contain {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFF;
		z-index: 10;
		// box-shadow: 0px -8rpx 8rpx rgba(201, 201, 201, 0.25);
		@include buttonsafearea();
		display: flex;
		align-items: center;


		.button-list {
			display: flex;
			margin: 20rpx 20rpx 2rpx 20rpx;
			flex: 1;
			justify-content: flex-end;

			.item-button {
				width: 164rpx;
				height: 80rpx;
				border-radius: 10rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				border: 1px solid #EEEEEE;
				margin-right: 14rpx;
				text-align: center;
				line-height: 80rpx;
				color: #303133;
				font-size: 28rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-button-active {
				width: 164rpx;
				height: 80rpx;
				border-radius: 10rpx;
				background: #002FA5;
				box-sizing: border-box;
				border: 1px solid #fff;
				margin-right: 14rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #fff;
			}

			.item-button-border-active {
				border: 2rpx solid #002FA5;
				color: #002FA5;
			}
		}
	}
</style>
