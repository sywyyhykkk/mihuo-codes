<template>
	<view class="type-contain">
		<u-popup mode="bottom" ref="addMaterialPopup" close-icon-pos="top-right" border-radius="14" height="310">
			<view class="operation-top">
				<view class="left" @click="close">取消</view>
				<view class="right">
					<view class="title">添加材料</view>
					<text @click="determine">确定</text>
				</view>
			</view>
			<view class="list-contain">
				<view class="item" :class="[index == activeIndex ?'item-active':'']" v-for="(item,index) in listType"
					:key="index" @click="selectType(index)">
					{{item.label}}
					<image v-if="index == activeIndex" src="@/static/images/select-active.png" mode=""></image>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "add-material-popup",
		props: {
			custom: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				showStatus: true,
				activeIndex: 0,
				listType: [{
						label: '材料库',
						value: 1002
					}, {
						label: '扫码',
						value: 1001
					},
					{
						label: '业主自购',
						value: 1003
					}
				]
			}
		},
		methods: {
			close() {
				this.$refs.addMaterialPopup.close()
			},
			show() {
				this.$refs.addMaterialPopup.open();
			},
			selectType(index) {
				this.activeIndex = index
			},
			determine() {
				this.$refs.addMaterialPopup.close()
				this.$emit('getOperation', {
					sourceType: this.listType[this.activeIndex].value,
					name: this.listType[this.activeIndex].label,
				}, {
					type: '其他',
					operationType:'添加'
				})
				// this.toPage(`/pages/construction/selectMaterial/materialStorage?custom=${this.custom}`)
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-drawer__scroll-view {
		background: #FFFFFF !important;
	}

	.type-contain {

		// padding-top: 42rpx;
		.operation-top {
			padding: 48rpx 48rpx 0 40rpx;
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

		.list-contain {
			display: flex;
			padding: 0 0 0 40rpx;

		 .item {
				font-size: $middleFontSize;
		 	border: 2rpx solid #EEEEEE;
				border-radius: $miniBorderRadius;
				width: 210rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				margin-right: 20rpx;


			}

			.item-active {
				position: relative;
				color: $themeColor;
				border: 2rpx solid $themeColor;

				image {
					width: 44rpx;
					height: 44rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}


	}
</style>
