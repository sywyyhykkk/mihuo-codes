<template>
	<view class="type-contain">
		<u-popup mode="bottom" ref="addSpacePopup" close-icon-pos="top-right" border-radius="14"
			:height="setPopupHeight()">
			<view class="contain-all">
				<view class="operation-top">
					<view class="left" @click="close">取消</view>
					<view class="right">
						<view class="title">添加区域</view>
						<text @click="determine">确定</text>
					</view>
				</view>

				<view class="list-contain">
					<view class="item-contain">
						<view class="label">添加空间</view>
						<u-input v-model="form.name" placeholder="请输入空间名称" :clearable="false"
							placeholder-style="color:#303133" border height="86" />
					</view>
					<!-- 项目经理、项目管家报价时不显示 -->
					<view class="item-contain" v-if="offerType !== '报价' ">
						<view class="label">空间参数(可多选)</view>
						<view class="list">
							<view class="item" :class="[item.active ?'item-active':'']" v-for="(item,index) in listType"
								:key="index" @click="selectType(index,item)">
								{{item.name}}
								<image v-if="item.active" src="@/static/images/select-active.png" mode=""></image>
							</view>
						</view>
					</view>
					<!-- 项目经理、项目管家报价时不显示 -->
					<view class="bottom-contain" v-if="offerType !== '报价' ">
						<view class="scroll-item-contain" v-for="(item,index) in listParameter" :key="index">
							<view class="label" v-if="item.active">{{ item.attributeName}}
							</view>
							<view class="input-contain" v-if="item.active">
								<u-input :clearable="false" v-model="item.attributeValue"
									:placeholder=" '请输入' + item.attributeName" placeholder-style="color:#909199"
									height="86" />
								<text>{{item.attributeUnit}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		name: "add-space-popup",
		props: {
			offerType: {
				type: String,
				default: ''
			},
			offerId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				showStatus: true,
				activeIndex: 0,
				form: {
					cityOperatorId: '',
					id: null,
					name: '',
					projectId: '',
					remark: '',
					requiredFlag: 0,
					sort: 0,
					unit: '',
					custom: '1', // 1 为自定义空间 null为配置 app=1 pc=2 默认=0
					type: 1
				},
				listParameter: [],
				listType: [],
				parameterList: [],
				scrollHeight: 240,
			}
		},
		mounted() {
			this.getTypeList()
			this.setParameters()
		},
		computed: {
			...mapState(['projectInfo', 'userPersonInfo', 'offerDetails'])
		},
		methods: {
			setPopupHeight() {
				if (this.offerDetails.offerId) {
					return '400'
				} else {
					return '800'
				}
			},
			setParameters() {
				if (this.offerType == '报价') {
					this.form.projectId = ''
				} else {
					this.form.projectId = this.projectInfo.projectId
				}
				this.form.cityOperatorId = this.userPersonInfo.cityOperatorId
			},
			getTypeList() {
				this.listType = []
				this.listParameter = []
				if(this.offerType == '报价'){
					return
				}
				if (!this.projectInfo.projectId) {
					return
				}
				this.$httpApi.selectSpaceConfig({
					id: this.projectInfo.projectId, //项目编号
				}).then(res => {
					if (res) {
						res.map((item, index) => {
							item['active'] = index === 0 ? true : false
							this.listParameter.push({
								areaName: '',
								areaAttributeId: '',
								attributeName: item.name,
								attributeUnit: item.unit,
								attributeValue: '',
								id: null,
								type: 2,
								offerId: this.offerDetails.offerId,
								projectId:this.projectInfo.projectId,
									
								active: index === 0 ? true : false,
							})
						})
						this.listType = res
					}
				})
			},
			close() {
				this.activeIndex = 0
				this.form.name = ''
				this.getTypeList()
				this.$refs.addSpacePopup.close()
			},
			show() {
				this.$refs.addSpacePopup.open();
			},
			selectType(index, item) {
				this.listType[index].active = !this.listType[index].active
				this.listParameter[index].active = !this.listParameter[index].active
				this.activeIndex = index
			},
			determine() {
				if (!this.form.name) {
					this.$util.toast("请填写空间名称");
					return
				}
				let tempList = JSON.parse(JSON.stringify(this.listParameter.filter(item => item.active === true)))
				if (this.offerType !== '报价') {
					if (tempList.length === 0) {
						this.$util.toast("请选择空间参数");
						return
					}
				} else {
					this.form.cityOperatorId = this.offerDetails.cityOperatorId
				}

				this.$httpApi.saveRoomAreaConfig({
					...this.form,
					offerId: this.offerDetails.offerId
				}).then(res => {
					if (res) {
						tempList.map(item => {
							item['attributeId'] = res.attributeId
							item['areaName'] = this.form.name
							item['groupNo'] = this.form.name
							item['custom'] = 1
							item['type'] = 3
						})
						tempList.push({
							custom: 1,
							type: 2,
							attributeId: res.attributeId,
							areaName: this.form.name,
							groupNo: this.form.name,
							attributeName: '空间名称',
							attributeValue: this.form.name,
							offerId: this.offerDetails.offerId,
							projectId: this.offerType == '报价' ? '' : this.projectInfo.projectId
						})

						this.$httpApi.spaceBatchUpdate({
							id: this.offerType == '报价' ? this.offerDetails.offerId : this.projectInfo
								.projectId,
							attributeValueList: tempList,
						}).then(res => {
							this.$util.toast("操作成功");
							uni.$emit('refreshMaterialPage')
							this.close()
						})

					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-drawer__scroll-view {
		background: #FFFFFF !important;
	}

	.contain-all {}

	.type-contain {
		.operation-top {
			padding: 48rpx 48rpx 0rpx 40rpx;
			display: flex;
			margin-bottom: 62rpx;

			.left {
				flex: 1;
				color: $viceFontColor;
				font-size: $middleFontSize;
			}

			.right {
				display: flex;
				flex: 1;
				justify-content: space-between;

				.title {
					font-weight: bold;
					font-size: $middleAddFontSize;
					color: $seconFontColor;
					margin-left: -60rpx;
				}

				text {
					color: $themeColor;
					font-size: $middleFontSize;
					font-weight: bold;
				}
			}
		}

		.right-nav-bar {
			// height: 240rpx;
		}

		.list-contain {
			display: flex;
			padding: 0 0 0 40rpx;
			flex-direction: column;

			.item-contain {
				display: flex;
				flex-direction: column;

				&:nth-of-type(1) {
					padding-right: 40rpx;
					margin-bottom: 46rpx;
				}

				.label {
					color: $viceFontColor;
					font-size: $middleFontSize;
					padding: 0 0 28rpx 28rpx;
				}

				.list {
					display: flex;
					flex-wrap: wrap;

					.item {
						font-size: $middleFontSize;
						border: 2rpx solid #EEEEEE;
						border-radius: $miniBorderRadius;
						padding: 24rpx 64rpx;
						position: relative;
						margin-right: 20rpx;
						margin-bottom: 16rpx;

						image {
							width: 44rpx;
							height: 44rpx;
							position: absolute;
							right: 0;
							bottom: 0;
						}
					}

					.item-active {
						color: $themeColor;
						border: 2rpx solid $themeColor;
					}
				}


			}



			.bottom-contain {
				display: flex;
				align-items: center;
				flex-direction: column;
				padding-right: 40rpx;
				padding-bottom: 40rpx;

				.right-nav-bar {
					// height: 100%;

				}

				.scroll-item-contain {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 8rpx;
					width: 100%;

					&:last-child {
						margin-bottom: 0rpx;
					}

					.label {
						display: flex;
						align-items: center;
						margin-right: 26rpx;
						height: 86rpx;
						font-size: $middleFontSize;
						color: $seconFontColor;
					}

					.input-contain {
						display: flex;
						align-items: center;
						flex: 1;
						padding: 0 26rpx;
						border: 1px solid #EEEEEE;
						border-radius: $miniBorderRadius;

						text {
							font-size: $middleFontSize;
							color: $seconFontColor;
						}
					}
				}
			}
		}
	}
</style>
