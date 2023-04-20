<template>
	<view class="change-price">
		<view class="item-contain">
			<view class="public-item-left">
				<view class="symbol-contain">
					<text class="symbol">*</text>
				</view>
				<text class="label">变更类型</text>
			</view>
			<view class="item-right">
				<view class="public-item-placeholder">
					<picker class="select_type-contain" range-key="label" @change="bindPickerChange" :value="index"
						:range="skillTypeList">
						<view class="text_type">{{ skillTypeList[index].label }}</view>
					</picker>
				</view>
				<image class="icon-arrow" src="/static/images/right-vector.png" mode=""></image>
			</view>
		</view>

		<view class="item-contain-place">
			<view class="item-top">
				<view class="public-item-left">
					<view class="symbol-contain">
						<text class="symbol">*</text>
					</view>
					<text class="label">变更金额</text>
				</view>
				<view class="right" @click="getJump('组合价格')">
					<image src="/static/images/add-house.png" mode=""></image>
					组合价格
				</view>
			</view>
			<view class="item-bottom">
				<view class="select-material-other" v-if="setMaterialList.length > 0">
					<mihuo-portfolio-price v-model="priceObject"></mihuo-portfolio-price>
				</view>
				<view class="no-select-material">
					<u-input :clearable="false" v-model="form.alterationMoney" type="digit" :border="false"
						placeholder="请输入变更金额" placeholder-style="color:#999999" @input="setInput" @blur="setBlur" />
				</view>
			</view>
		</view>
		<view class="desc-contain">
			<view class="title-desc">
				<view class="symbol-contain">
					<text class="symbol">*</text>
				</view>
				<text class="label">变更说明</text>
			</view>
			<view class="public-item-bottom">
				<u-input v-model="form.alterationReason" class="describe-input" maxlength="200" height="140"
					type="textarea" placeholder="请输入变更说明" :border="true" />
			</view>
			<view class="item-attachment">
				<view class="file-contain">
					<image-upload-new :uploadType="uploadType" :count="9" v-model="form.pics" />
				</view>
				<view class="voice-contain">
					<sound-recording @chooseVoice="chooseVoice" />
				</view>
			</view>
		</view>

		<view class="risk-statement">
			<view class="risk_title">风险提示</view>
			<view class="risk-statement-list" v-for="(item,index) in riskList" :key="index">
				<view class="risk-contian">
					<view class="item-desc">
						<u-input v-model="item.name" placeholder-style="color: #999999;fontSize: 26rpx;"
							class="describe-input" maxlength="200" height="100" type="textarea" placeholder="请输入一条说明内容"
							:border="true" />
					</view>
					<view class="img-contain">
						<image-upload-new :uploadType="['图片','拍摄']" :count="9" v-model="item.attachments" />
					</view>
				</view>
				<view class="risk_add" v-if=" riskList.length > 1" @click="addRiskOperation('delete',index)">
					<u-icon name="minus" size="24" color="#002FA5"></u-icon>
					<text>删除</text>
				</view>
				<view class="risk_add" v-if="index + 1 == riskList.length" @click="addRiskOperation('add')">
					<u-icon name="plus" size="24" color="#002FA5"></u-icon>
					<text>新增</text>
				</view>
			</view>
		</view>

		<bottom-button title="确认变更" @click="submit"></bottom-button>
	</view>
</template>

<script>
	import operation from '@/plugins/mathoperation.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				uploadType: ['图片'],
				skillTypeList: [{
					label: '增项',
					value: 0
				}, {
					label: '减项',
					value: 1
				}],
				index: 0,
				priceObject: {},
				buttonDisabled: true,
				risksResult: [],
				riskList: [{
					attachments: "",
					name: "",
				}],
				form: {
					type: '1001',
					status: 0,
					alterationMoney: '',
					alterationReason: '',
					pics: '',
					audio: '',
					orderCode: '',
					orderId: '0',
					groupPrices: [],
					totalPrice: '',
				}
			}
		},
		watch: {
			priceObject: {
				handler(newVal, oldVal) {
					this.form.alterationMoney = newVal.totalPrice
				},
				deep: true
			}
		},
		computed: {
			...mapState(['serviceGoodsList']),
			setMaterialList() {
				return this.serviceGoodsList
			},
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.$store.commit('setServiceGoodsList', [])
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {},
		methods: {
			setInput(value) {
				this.$setInput((result) => {
					this.form.alterationMoney = result
				}, value)
			},
			setBlur(value){
				this.$setBlur((result)=>{
					this.form.alterationMoney = result
				},value)
			},
			async chooseVoice(file) {
				if (!file) {
					return
				}
				if (file.path) {
					let temp = {
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}
					this.form.audio = JSON.stringify(temp)
				} else {
					this.form.audio = ''
				}
			},
			getJump(typeName) {
				switch (typeName) {
					case '变更类型':

						break;
					case '组合价格':
						this.toPage('/pages/publishTask/portfolioPrice')
						break;
				}
			},
			bindPickerChange(e) {
				this.index = e.target.value
				this.form.type = '1001'
				this.form.status = this.skillTypeList[this.index].value
			},
			setProductJson() {
				if (this.priceObject && Number(this.priceObject.totalPrice) > 0) {
					this.form.totalPrice = this.priceObject.totalPrice
					this.form.groupPrices = this.priceObject.groupPrices
					this.form.alterationMoney = this.priceObject.totalPrice
				} else {
					this.form.groupPrices = null
					this.form.totalPrice = 0
				}
			},
			addRiskOperation(type, index) {
				if (type == 'add') {
					this.riskList.push({
						attachments: "",
						name: "",
					})
				} else {
					this.riskList.splice(index, 1)
				}
			},
			submit() {
				this.setProductJson()
				this.setRisksResult()
				if (!this.form.alterationMoney) {
					this.$util.toast("请输入订单价格");
					return
				}
				if (!this.form.alterationReason) {
					this.$util.toast("请输入变更原因");
					return
				}
				this.form.orderCode = this.option.orderCode;
				this.form.orderId = this.option.id;
				this.form.cityId = this.option.cityId;
				this.$httpApi.saveChange(this.form).then(res => {
					this.$store.commit('setServiceGoodsList', [])
					if (res) {
						if (this.risksResult.length > 0) {
							this.addRisk()
						} else {
							uni.showToast({
								title: '操作成功~',
								icon: 'none'
							});
							setTimeout(() => {
								this.goBack()
							}, 1000)
						}

					}
				})
			},
			setRisksResult() {
				this.risksResult = []
				this.riskList.forEach(el => {
					if (el.name || el.attachments !== '[]') {
						this.risksResult.push(el)
					}
				})
			},
			addRisk() {
				this.$httpApi.addRisk({
					orderId: this.option.id,
					risks: this.risksResult,
				}).then(res => {
					if (res) {
						uni.showToast({
							title: '操作成功~',
							icon: 'none'
						});
						setTimeout(() => {
							this.goBack()
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon-arrow {
		width: 14rpx;
		height: 26rpx;
	}

	.public-item-left {
		display: flex;
		align-items: center;

		.symbol-contain {
			position: relative;
			width: 12rpx;
			height: 36rpx;

			.symbol {
				position: absolute;
				top: 8rpx;
				color: $errorFontColor;
				right: 4rpx;
			}
		}


		.label {
			font-size: $middleFontSize;
			color: $seconFontColor;
			white-space: nowrap;
		}
	}

	.public-item-placeholder {
		color: #999999;
		font-size: $smiddleFontSize;
		display: flex;
		justify-content: flex-end;
		flex: 1;
	}

	

	.change-price {
		border-top: 12rpx solid #f5f5f5;

		.item-contain {
			margin-bottom: 2rpx;
			display: flex;
			padding: 42rpx 36rpx;
			background-color: #fff;

			.item-right {
				display: flex;
				align-items: center;
				width: 100%;
				margin-left: 30rpx;

				.icon-arrow {
					margin-left: 26rpx;
				}

			}
		}

		.item-contain-place {
			margin-bottom: 2rpx;
			padding: 36rpx 36rpx 30rpx 36rpx;
			background-color: #fff;

			.item-top {
				display: flex;
				justify-content: space-between;
				margin-bottom: 8rpx;

				.right {
					font-size: $smiddleFontSize;
					color: $themeColor;
					display: flex;
					align-items: center;

					image {
						width: 18rpx;
						height: 18rpx;
						margin-right: 6rpx;
					}
				}
			}

			.public-item-placeholder {
				justify-content: flex-start;
			}

			.item-bottom {
				display: flex;
				align-items: center;
				margin-left: 10rpx;
				width: 100%;
				
				.select-material-other {
					height: 1px;
					z-index: -10;
					opacity: 0.1;
					display: none;
					position: absolute;
				}
			}

			.no-address {
				display: flex;
				align-items: center;
				width: 100%;
			}

			.select-address {
				width: 100%;

				.item-name {
					margin-bottom: 6rpx;

					.name,
					.phone {
						color: $viceFontColor;
						font-size: $middleFontSize;
					}
				}

				.item-bottom-address {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.address {
						color: $seconFontColor;
						font-size: $smiddleFontSize;
					}
				}
			}

			.no-select-material {
				display: flex;
				align-items: center;
				width: 100%;
			}

		}


		.desc-contain {
			background-color: #fff;
			padding: 26rpx 26rpx 52rpx 26rpx;

			.title-desc {
				font-size: $middleFontSize;
				color: $seconFontColor;
				display: flex;
				align-items: center;

				.symbol-contain {
					position: relative;
					width: 12rpx;
					height: 36rpx;

					.symbol {
						position: absolute;
						top: 8rpx;
						color: $errorFontColor;
						right: 4rpx;
					}
				}

				.label {
					font-size: $middleFontSize;
				}
			}

			.describe-input {
				border: 0rpx;
			}

			.public-item-bottom {
				background: #F6F7F9;
				border-radius: 5px;
				margin-top: 16rpx;
			}

			.item-attachment {
				margin-top: 28rpx;

				.voice-contain {
					margin-top: 28rpx;
				}
			}
		}
	}

	.risk-statement {
		padding: 32rpx;
		background-color: #FFFFFF;
		margin-top: 2rpx;

		.risk_title {
			font-size: 30rpx;
			margin-bottom: 18rpx;
			color: #333333;
		}

		.risk-contian {
			width: 80%;
		}

		.risk-statement-list {
			display: flex;
			margin-bottom: 20rpx;
		}

		.risk_add {
			border: 2rpx solid #002FA5;
			border-radius: 10rpx;
			width: 112rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 72rpx;
			margin-left: 20rpx;

			text {
				font-size: 24rpx;
				color: #002FA5;
				margin-left: 4rpx;
			}

		}

		.item-desc {
			background: #F6F7F9;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.describe-input {
				border: 0px;
			}
		}
	}
</style>
