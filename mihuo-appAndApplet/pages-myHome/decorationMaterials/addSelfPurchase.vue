<template>
	
	<view class="self-buying-page">
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="3000" @backClick="goBackPage">
			<view slot="default" class="nav-bar">
				自购材料
			</view>
		</z-nav-bar>
		<view class="self-buying-page-contain">
			<view class="item-contain public-flex item-contain-type">
				<view class="left">材料分类</view>
				<view class="right">
					<!-- <text>点击选择</text> -->
					<u-input class="describe-input" v-model="form.type" type="text" :disabled="true" input-align="right"
						placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入材料分类" :border="false" />
				</view>
			</view>
			<view class="item-contain public-flex">
				<view class="left">材料名称</view>
				<view class="right">
					<u-input class="describe-input" v-model="form.name" type="text" input-align="right"
						placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入材料名称" :border="false" />
				</view>
			</view>
			<view class="item-contain public-flex">
				<view class="left">单位</view>
				<view class="right">
					<u-input class="describe-input" v-model="form.attributeUnit" type="text" input-align="right"
						placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入单位" :border="false" />
				</view>
			</view>
			<view class="item-contain public-flex">
				<view class="left">数量</view>
				<view class="right">
					<u-input class="describe-input" v-model="form.attributeValue" type="digit" input-align="right"
						placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入数量" :border="false" />
				</view>
			</view>
			<view class="item-contain public-flex">
				<view class="left">是否需要安装</view>
				<view class="right installation">
					<u-switch v-model="installFlag" size="40" active-color="#ff5d35"></u-switch>
				</view>
			</view>
			<view class="item-contain public-flex">
				<view class="left">选材备注</view>
				<view class="right">
					<u-input v-model="form.remark" class="describe-input" type="text" input-align="right"
						placeholder-style="color: #999999;font-size: 26rpx;" placeholder="请输入选材备注" :border="false" />
				</view>
			</view>
			<view class="image-contain">
				<view class="title">图片</view>
				<image-upload-new v-model="form.productImg" :count="1" />
			</view>
			<view class="other-contain">
				<view class="application">
					<view class="title">该材料应用于</view>
					<view class="list">
						<view class="item-area public-flex-center" :class="[item.status?'item-area-active':'']"
							v-for="(item,index) in otherList " :key="index" @click="selectMaterial(index)">
							{{item.areaName}}
							<view v-if="item.status" class="selected" >
								<u-icon name="checkmark" class="checkmark-icon" color="#fff" size="24">
								</u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-text-contain iphonex-bottom">
			<view class="refused-to" @click="submit('取消')">取消</view>
			<view class="submit-agree" @click="submit('保存')">保存</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				key: '',
				fileImage: '',
				materialChecked: false,
				rangeAreaList: [],
				currentAreaName: '', //当前区域名称
				installFlag: false,
				projectId: '',
				form: {
					type: '',
					name: '',
					offerId:'',// 报价id
					projectId: '',
					productImg:  '[]',
					rangeArea: '',
					areaAttributeId: '', // 空间区域id
					areaName: '', // 区域名称
					attributeUnit: '',
					attributeValue: '',
					installFlag: '', // 是否需要安装：0=否；1=是
					remark: '',
					sourceType: '1003',
					id: ''
				},
				otherList: [],

			}
		},
		onLoad(option) {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('selfBuying', (data) => {
				console.log('data',data);
				// this.form.areaName = data.currentAreaName
				// this.form.areaAttributeId = data.attributeId
				this.form.offerId = data.offerId
				this.form.type = '其他'
				this.otherList = data.areaList
				this.setOtherList()
			});
			this.setParameter()
			
		},
		computed: {
			...mapState(['offerDetails'])
		},
		methods: {
			goBackPage(){
				this.goBack()
			},
			setParameter() {
				this.form.projectId =''
				this.projectId = ''
				
			},
			setOtherList() {
				this.otherList.map(item => {
					item['status'] = false
				})
			},
			selectMaterial(index) {
				this.otherList[index].status = !this.otherList[index].status
				this.$forceUpdate()
			},
			submit(name) {
				if (name === '取消') {
					this.goBack()
				} else {
					if (!this.form.name) {
						this.$util.toast("请输入材料名称");
						return
					}

					if (!this.form.attributeValue) {
						this.$util.toast("请输入数量");
						return
					}
					
					// if(this.form.productImg){
					// 	if (!this.$checkUploadProcess(this.form.productImg)) {
					// 		return;
					// 	}
					// }
					let resultsList = []
					this.form.installFlag = this.installFlag ? 1 : 0
					let tempProductImg = this.form.productImg !== '' && JSON.parse(this.form.productImg)[0]
					if(tempProductImg){
						this.form.productImg = tempProductImg && tempProductImg.url
					}
					this.otherList.map(item => {
						if (item.status) {
							resultsList.push({
								type: '其他',
								name: this.form.name,
								projectId: this.projectId,
								productName:this.form.name,
								sourceType: this.form.sourceType,
								productImg: this.form.productImg,
								areaAttributeId: item.id, // 空间区域id
								areaName: item.areaName, // 区域名称
								attributeUnit: this.form.attributeUnit,
								attributeValue: this.form.attributeValue,
								installFlag: this.form.installFlag, // 是否需要安装：0=否；1=是
								remark: this.form.remark,
								skuId:'0',
								offerId:this.form.offerId,
								id: ''
							})
						}
					})
					if(resultsList.length == 0){
						this.$util.toast("请选择该材料用于");
						return
					}
					this.$httpApi.batchsaveOrUpdate({
						id: this.form.offerId,
						projectMaterialAttributeList: resultsList,
					}).then(res => {
						if (res) {
							this.$util.toast("操作成功,将返回上一页");
							setTimeout(()=>{
								this.goBack()
							},2000)
						}
					})
				}
			}
		}
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #f5f5f5;
	}
</style>

<style lang="scss" scoped>
	.public-flex {
		display: flex;
	}

	.public-flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.self-buying-page {
		padding-bottom: 140rpx;
		
		.nav-bar {
			@include nav-bar-title(#000000);
		}

		.self-buying-page-contain {
			margin: 16rpx 20rpx;
		}
	}

	.item-contain {
		background-color: #fff;
		border-radius: $miniBorderRadius;
		height: 124rpx;
		align-items: center;
		padding: 0 42rpx 0 48rpx;
		margin-bottom: 2rpx;

		.left {
			color: #46464E;
			font-size: $middleFontSize;
		}

		.installation {
			text-align: right;
			width: 100%;
		}

		.right {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			text {
				font-size: $smiddleFontSize;
				color: #999999;
				margin-right: 40rpx;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.image-contain {
		padding: 30rpx 0 50rpx 48rpx;
		background-color: #fff;
		border-radius: $miniBorderRadius;
		margin-bottom: 2rpx;

		.title {
			font-size: $middleFontSize;
			color: #46464E;
			margin-bottom: 16rpx;
		}
	}

	.other-contain {
		background-color: #fff;
		padding: 44rpx 0 52rpx 48rpx;
		border-radius: $miniBorderRadius;

		.application {
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0rpx;
			}

			.title {
				color: $seconFontColor;
				font-size: $middleFontSize;
				margin-bottom: 22rpx;
			}

			.list {
				display: flex;
				flex-wrap: wrap;

				image {
					width: 26rpx;
					height: 26rpx;
				}

				.item-area {
					padding: 10rpx 22rpx;
					border: 1px solid #EEEEEE;
					border-radius: $miniBorderRadius;
					font-size: $smiddleFontSize;
					position: relative;
					margin-right: 20rpx;
					margin-bottom: 10rpx;
					
					.selected {
						width: 0;
						height: 0;
						border-bottom: 44rpx solid $themeColor;
						border-left: 44rpx solid transparent;
						position: absolute;
						right: 0rpx;
						bottom: 0rpx;
						
						.checkmark-icon {
							position: relative;
							top: 12rpx;
							left: -24rpx;
							transform: scale(0.8);
						}
					}

					image {
						position: absolute;
						right: 0;
						bottom: 0;
					}
				}

				.item-area-active {
					border: 1px solid $themeColor;
					color: $themeColor;
				}
			}

			.list-active {
				.item-area {
					border: 1px solid $themeColor;
					color: $themeColor;
				}
			}
		}
	}

	.submit-text-contain {
		// padding: 20rpx 0rpx 20rpx 64rpx;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		padding: 20rpx 0rpx;
		width: 100%;
		background-color: #FFFFFF;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);


		.submit-agree,
		.refused-to {
			display: flex;
			justify-content: center;
			width: 268rpx;
			height: 88rpx;
			font-weight: bold;
			font-size: 28rpx;
			align-items: center;
			border-radius: 10rpx;
		}

		.submit-agree {
			background: $themeColor;
			color: #FFFFFF;

		}

		.refused-to {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			color: #909299;
			margin-right: 24rpx;
		}
	}
	

	
	
	
	
</style>
