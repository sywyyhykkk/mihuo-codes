<template>
	<view class="add-service-page">
		<view class="top-image">
			<custom-file-upload v-model="form.coverImg" :key="form.coverImg"></custom-file-upload>
		</view>
		<view class="item-information">
			<text class="item-label public-name">服务标题</text>
			<u-input v-model="form.title" input-align="right" :clearable="false" class="describe-input" maxlength="200"
				type="text" placeholder="请输入服务标题" :border="true" />
		</view>
		<view class="address" @click="getAddress">
			<view class="address-left">
				<text class="public-name">服务区域</text>
			</view>
			<view class="item-right">
				<text class="item-address">{{setAddress}}</text>
				<u-icon name="arrow-right" color="#C4C4C4" size="28"></u-icon>
			</view>
		</view>
		<view class="price-contain">
			<text class="public-name">服务价格</text>
			<view class="item-input">
				<view class="item-describe-input">
					<u-input v-model="form.price" class="describe-input" maxlength="200" height="70" type="number"
						placeholder="请输入价格" :border="true" @input="setInput" @blur="setBlur" />
					<view class="item-other-unit">元</view>	
				</view>
				<view class="item-unit" @click="unitShow = true">
					<text>{{this.form.unit}}</text>
					<u-icon name="arrow-down" color="#C4C4C4" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view class="desc-contian">
			<text class="public-name">服务内容</text>
			<view class="public-item-bottom">
				<u-input v-model="form.content" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入备注" :border="true" />
			</view>
		</view>

		<view class="service-contain">
			<view class="item-contain" v-for="(item,index) in  customContentList" :key="index">
				<view class="grouping-contain">
					<view class="public-name">
						<text class="public-name">{{item.name}}</text>
						<view class="item-edit" @click="addService('编辑模块',index)">编辑</view>
					</view>
					<image src="@/static/images/add-new.png" @click="addService('添加内容',index,0,item)" mode=""></image>
				</view>
				<view class="subset-contain">
					<view class="item-subset" v-for="(ev,num) in item.list" :key="num">
						<view class="item-top">
							<view class="item-title">
								<text class="item-text">{{num+1}}. {{ev.title}}</text>
								<u-icon name="arrow-right" color="#C4C4C4" size="28"
									@click="addService('编辑子集',index,num)"></u-icon>
							</view>
							<view class="item-image-contain">
								<u-lazy-load class="item-image" height="68" v-for="(event,nums) in ev.pics" :key="nums"
									:style="{ width: '68rpx' }" imgMode="aspectFill" border-radius="10"
									:image="$util.thumbnailImage(event.url,true)">
								</u-lazy-load>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="add-service" @click="addService('自定义添加模块')">
				<image src="@/static/images/add-new.png" mode=""></image>
				<text>自定义添加模块</text>
			</view>
		</view>

		<!-- 注意事项 -->
		<view class="desc-contian">
			<text class="public-name">注意事项</text>
			<view class="public-item-bottom">
				<u-input v-model="form.precautions" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入内容" :border="true" />
			</view>
		</view>

		<view class="bottom-contain">
			<view class="button-list">
				<view class="item-button"
					:class="[item.active ? 'item-button-active':'',item.activeBorder ? 'item-button-border-active':'']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)"> {{item.name}}</view>
			</view>
		</view>

		<!-- 单位选择 -->
		<!-- <u-select v-model="unitShow" :list="unitList" :safe-area-inset-bottom="true"></u-select> -->
		<u-picker mode="selector" v-model="unitShow" :default-selector="[1]" :range="unitList" range-key="label"
			@confirm="confirmUnit">
		</u-picker>

		<!-- 添加模块、内容、编辑内容弹框 -->
		<u-popup v-model="modelShow" border-radius="30" :height="modelHeight" mode="bottom"
			:safe-area-inset-bottom="false" :closeable="true">
			<view class="form-contain">
				<view class="title">
					{{modelTitle}}
				</view>
				<view class="item-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="desc-contian" v-if="modularShow">
							<text class="public-name">模块名称</text>
							<view class="public-item-bottom">
								<u-input v-model="custom.desc" class="describe-input" maxlength="200" height="140"
									type="textarea" placeholder="请输入模块名称" :border="true" />
							</view>
						</view>
						<view class="desc-contian" v-if="modelTextShow">
							<text class="public-name">内容描述</text>
							<view class="public-item-bottom">
								<u-input v-model="custom.desc" class="describe-input" maxlength="200" height="140"
									type="textarea" placeholder="请输入服务流程内容" :border="true" />
							</view>
						</view>
						<view class="images-contain" v-if="modelTextShow">
							<image-upload-new :uploadType="uploadType" :count="9" v-model="custom.pics"
								:isAddVideo="false" />
						</view>
					</scroll-view>
				</view>
				<view class="bottom-add">
					<view class="item-delete" v-if="addServiceName.indexOf('编辑') !== -1 " @click="getDelete()">删除
					</view>
					<view class="item-add" @click="addResult()">
						保存
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				modelShow: false,
				modularShow: false,
				modelTextShow: false,
				unitShow: false,
				modelTitle: '自定义添加模块',
				imageUploadNewIndex: 0,
				modelHeight: '550',
				unitList: [{
					value: '1',
					label: '单'
				}, {
					value: '2',
					label: '平方米'
				}, {
					value: '3',
					label: '天'
				}, {
					value: '4',
					label: '米'
				}, {
					value: '5',
					label: '小时'
				}],
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
				customContentList: [{
					name: '服务流程',
					list: []
				}, {
					name: '交付标准',
					list: []
				}],
				custom: {
					desc: '',
					pics: ''
				},
				customContentIndex: 0,
				childrenIndex: 0,
				addressList: [],
				addServiceName: '',
				serviceDetails: {},
				form: {
					cityOperatorId: uni.getStorageSync('cityOperatorId'), //	运营商id			
					content: '', //	服务内容			
					coverImg: '', //	封面			
					customContent: '', //	自定义内容			
					precautions: '', //	注意事项			
					price: '', //	服务价格			
					publishStatus: '', //	上架状态：0->下架；1->上架
					address: '',
					addressCode: '',
					addressIds: '',
					status: 0, //	状态：0->草稿 1->发布			
					unit: '平米', //	单位
					id: '',
					title: ''
				}
			}
		},
		computed: {
			/**
			 * @description 解析地址数据 
			 * */
			setAddress() {
				if (this.option.type) {
					return this.form.address
				} else {
					if (this.addressList.length > 0) {
						let tempAddress = this.addressList.map(item => item.provinceName + '-' + item.cityName + '-' + item
							.districtName + '-' + item.address)
						let result = tempAddress.map(item => item.replace('-null', '')).join('，')
						return result
					}
					return ''
				}

			}
		},
		mounted() {

		},
		onUnload() {
			uni.$off('selectAddress')
		},
		onShow() {
			uni.$once('selectAddress', (res => {
				this.addressList = res
				this.initAddress()

			}))

		},
		onLoad(option) {
			this.option = option
			this.setOption()
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
						title: '编辑服务'
					})
					this.$httpApi.serviceDetails({
						id: this.option.serviceId
					}).then(res => {
						if (res) {
							this.form = res
							if (this.$isJSON(res.customContent)) {
								this.customContentList = JSON.parse(res.customContent)
							}
						}
					})
				}
			},
			getAddress() {
				let addressIds
				if (this.option.type) {
					addressIds = this.form.addressIds
				} else {
					if (this.addressList.length > 0) {
						addressIds = this.addressList.map(item => item.id)
						addressIds = addressIds.join(',')
					}
				}
				this.toPage(
					`/pages/permanentResidence/permanentResidence?type=多选&typeName=添加服务&addressIds=${addressIds}`
				)
			},
			confirmUnit(ev) {
				this.form.unit = this.unitList[ev[0]].label
			},
			/**
			 * @description 添加模块
			 * */
			addService(type, index, num, item) {
				this.modelShow = !this.modelShow
				this.addServiceName = type
				this.customContentIndex = index
				this.childrenIndex = num

				switch (type) {
					case '自定义添加模块':
						this.modelHeight = '550'
						this.modularShow = true
						this.modelTextShow = false
						this.modelTitle = '自定义添加模块'
						this.custom.desc = ''
						break
					case '编辑模块':
						let tempList = this.customContentList[this.customContentIndex]
						this.modelHeight = '550'
						this.modularShow = true
						this.modelTextShow = false
						this.modelTitle = `编辑${tempList.name}模块`
						this.setCustom()
						break
					case '编辑子集':
						this.modelHeight = '800'
						this.modelTitle = '编辑服务流程'
						this.modularShow = false
						this.modelTextShow = true
						this.setCustom()
						break
					case '添加内容':
						this.modelHeight = '800'
						this.modelTitle = `添加${item.name}`
						this.modularShow = false
						this.modelTextShow = true
						this.custom.desc = ''
						this.custom.pics = ''
						break
				}

			},
			setCustom() {
				let tempList = this.customContentList[this.customContentIndex]
				if (this.addServiceName == '编辑子集') {
					if (tempList.list.length !== 0) {
						this.custom.desc = tempList.list[this.childrenIndex].title
						this.custom.pics = tempList.list[this.childrenIndex].pics && JSON.stringify(tempList.list[this
							.childrenIndex].pics)
					}
				} else {
					this.custom.desc = tempList.name
				}
			},
			addResult() {
				switch (this.addServiceName) {
					case '自定义添加模块':
						if (!this.custom.desc) {
							this.$util.toast("请填写模块内容~");
							return
						}
						this.customContentList.push({
							name: this.custom.desc,
							list: []
						})
						break
					case '编辑模块':
						this.customContentList[this.customContentIndex].name = this.custom.desc
						break
					case '编辑子集':
						this.customContentList[this.customContentIndex].list[this.childrenIndex].title = this.custom.desc
						this.customContentList[this.customContentIndex].list[this.childrenIndex].pics = this.custom.pics
						break
					case '添加内容':
						this.customContentList[this.customContentIndex].list.push({
							title: this.custom.desc,
							pics: this.custom.pics
						})
						break
				}

				this.modelShow = false
				this.custom.desc = ''
				this.custom.pics = ''

				this.customContentList.forEach(el => {
					if (el.list.length > 0) {
						el.list.forEach(ev => {
							if (this.$isJSON(ev.pics)) {
								ev.pics = JSON.parse(ev.pics)
							}
						})
					}
				})
			},
			getDelete() {
				if (this.addServiceName == '编辑子集') {
					this.customContentList[this.customContentIndex].list.splice(this.childrenIndex, 1)
				} else {
					this.customContentList.splice(this.customContentIndex, 1)
				}
				this.modelShow = false
			},
			getButton(item) {
				switch (item.name) {
					case '取消':
						this.goBack()
						break
					case '预览':
						// return
						// if (this.option.type) {
						// 	this.toPage(
						// 		`/pages/mine/shop/caseDetails?type=服务&detailsId=${this.option.serviceId}&shopId=${this.option.shopId}&listTypeName=${this.option.listTypeName}&typeName=预览`
						// 	)
						// } else {
						// 	// return
						// }
						let that = this
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}
						if (!this.form.title) {
							this.$util.toast("请输入服务标题~");
							return
						}
						this.form.customContent = JSON.stringify(this.customContentList)
						uni.navigateTo({
							url: '/pages/mine/shop/caseDetails',
							success(res) {
								res.eventChannel.emit('previewService', {
									type: '预览',
									typeName: '服务',
									form: that.form,
								});
							}
						})
						break
					case '保存草稿':
						this.form.customContent = JSON.stringify(this.customContentList)
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}

						if (this.form.coverImg == '[]') {
							this.$util.toast("请选择封面图~");
							return
						}

						if (!this.form.title) {
							this.$util.toast("请输入服务标题~");
							return
						}
						if (this.option.type) {
							this.form.status = 0
							this.form.id = this.option.serviceId
							this.$httpApi.updateService(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 500)
								}
							})
							return
						}
						this.$httpApi.serviceitemsAdd(this.form).then(res => {
							if (res) {
								this.$util.toast("操作成功");
								setTimeout(() => {
									this.goBack()
								}, 500)
							}
						})
						break
					case '确认发布':
						this.form.customContent = JSON.stringify(this.customContentList)
						if (!this.form.coverImg) {
							this.$util.toast("请选择封面图~");
							return
						}
						if (!this.form.title) {
							this.$util.toast("请输入服务标题~");
							return
						}
						if (this.option.type) {
							this.form.id = this.option.serviceId
							this.form.status = 1
							this.$httpApi.updateService(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 500)
								}
							})
							return
						} else {
							this.form.status = 1
							this.$httpApi.serviceitemsAdd(this.form).then(res => {
								if (res) {
									this.$util.toast("操作成功");
									setTimeout(() => {
										this.goBack()
									}, 500)
								}
							})
						}
						break
				}
			},
			initAddress() {
				let resultList = []
				this.addressList.forEach(item => {
					resultList.push({
						address: item.provinceName + '-' + item.cityName + '-' +
							item.districtName + '-' + item.address,
						addressIds: item.id
					})
				})
				resultList = this.unique(resultList)
				let tempAddress = resultList.map(item => item.address)
				let tempAddressIds = resultList.map(item => item.addressIds)
				let resultAddress = tempAddress.map(item => item.replace('-null', ''))
				let resultAddressIds = tempAddressIds.join(',')
				let resultAddressForm = resultAddress.join('，')
				this.form.address = resultAddressForm
				this.form.addressIds = resultAddressIds
			},
			unique(arr) {
				const res = new Map()
				return arr.filter((item) => !res.has(item.addressIds) && res.set(item.addressIds, 1))
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	/deep/ .u-drawer {
		z-index: 990 !important;
	}
	
	/deep/ .u-input__input {
		color: #303133;
	}

	.add-service-page {
		padding-top: 20rpx;
		padding-bottom: 180rpx;
	}

	.public-name {
		color: #303133;
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.top-image {
		background-color: #fff;
		padding: 50rpx;
		margin-bottom: 2rpx;

		/deep/ .evaluation-file {
			background-color: #fff !important;
		}
	}

	.item-information {
		height: 134rpx;
		border-radius: 10rpx;
		border-bottom: 2rpx solid #F6F6F6;
		padding: 0 34rpx;
		display: flex;
		background-color: #fff;
		justify-content: space-between;
		align-items: center;

		.u-input {
			border: 0rpx;
			color: #303133;
		}

	}

	.address {
		border-radius: 6rpx;
		background-color: #fff;
		height: 124rpx;
		padding: 0 34rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rpx;

		.address-left {
			margin-right: 32rpx;
		}

		.item-right {
			display: flex;
			flex: 1;
			justify-content: flex-end;

			.item-address {
				color: #999999;
				font-size: 28rpx;
				margin-right: 20rpx;
			}
		}
	}

	.price-contain {
		padding: 34rpx;
		background-color: #fff;
		border-radius: 6rpx;
		margin-bottom: 2rpx;
		display: flex;
		flex-direction: column;

		.item-input {
			margin-top: 14rpx;

			display: flex;

			.item-describe-input {
				flex: 1;
				height: 90rpx;
				border-radius: 10rpx;
				background: #F6F7F9;
				display: flex;
				align-items: center;
				justify-content: center;

				.u-input {
					border: 0rpx;
				}
				
				.item-other-unit{
					font-size: 26rpx;
					color:#303133 ;
					padding-right: 20rpx;

				}
			}

			.item-unit {
				margin-left: 10rpx;
				width: 132rpx;
				height: 90rpx;
				border-radius: 10rpx;
				background: #F6F7F9;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: row;

				text {
					color: #303133;
					font-size: 26rpx;
					margin-right: 10rpx;
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

		.public-item-bottom {
			background-color: #F7F7F7;
			margin-top: 14rpx;

			.u-input {
				border: 0rpx;
			}
		}
	}

	.service-contain {
		padding: 40rpx 34rpx;
		border-radius: 10rpx;
		background: #FFFFFF;


		.item-contain {
			border-bottom: 2rpx solid #EEEEEE;
			margin-bottom: 50rpx;
		}

		.grouping-contain {
			display: flex;
			justify-content: space-between;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			.item-edit {
				color: #606166;
				font-size: 24rpx;
				position: relative;
				margin-left: 32rpx;

				&::before {
					content: "";
					position: absolute;
					width: 2rpx;
					height: 16rpx;
					background-color: #DEDEDE;
					top: 10rpx;
					left: -16rpx;
				}
			}
		}

		.add-service {
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 4rpx;
			}

			text {
				color: #002FA5;
				font-size: 26rpx;
				text-align: center;
			}
		}

		.subset-contain {
			margin-top: 52rpx;


			.item-subset {
				margin-bottom: 28rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}

				.item-top {
					color: #303133;
					font-size: 26rpx;
					margin-bottom: 20rpx;

					.item-title {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.item-text {
							color: #606166;
							font-size: 26rpx;
							line-height: 36rpx;

						}
					}



					.item-image-contain {
						margin-top: 10rpx;
						padding-left: 14rpx;
						display: flex;

						.item-image {
							margin-right: 16rpx;

							&:last-child {
								margin-right: 0rpx;
							}
						}
					}
				}
			}


		}
	}

	.bottom-contain {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFF;
		z-index: 10;
		@include buttonsafearea();
		display: flex;
		align-items: center;


		.button-list {
			display: flex;
			margin: 20rpx 20rpx 2rpx 20rpx;
			flex: 1;
			justify-content: flex-end;
			// justify-content: space-between;

			.item-button {
				width: 164rpx;
				height: 84rpx;
				border-radius: 10rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				border: 1px solid #EEEEEE;
				margin-right: 14rpx;
				text-align: center;
				line-height: 84rpx;
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
			padding: 0 60rpx;

			.item-add {
				// width: 624rpx;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: $themeColor;
				border-radius: $miniBorderRadius;
				color: #fff;
				flex: 1;
			}

			.item-delete {
				height: 88rpx;
				color: #909199;
				font-size: 28rpx;
				border-radius: 10rpx;
				background: #E5E5E5;
				text-align: center;
				line-height: 88rpx;
				width: 250rpx;
				margin-right: 26rpx;
			}
		}
	}
</style>
