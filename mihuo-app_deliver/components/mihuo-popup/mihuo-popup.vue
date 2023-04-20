<template>
	<u-popup v-model="value" border-radius="20" :height="height" :mode="mode" :width="width" @close="close"
		:safe-area-inset-bottom="false" :popup="false" :closeable="closeable">
		<view class="popup-contian">
			<view v-if="titleShow" class="default-tittle" :class="[titleBorder ? 'tittle':'tittle-no']">
				<text>{{title}}</text>
			</view>
			<view v-if="topShow" class="popup-top">
				<slot name="top"></slot>
			</view>
			<view class="list-contain" :style="{'height': listHeight + 'rpx'}">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<!-- 单选 -->
					<view v-if="type == 'list' && singleStatus && typeList.length > 0" class="item-list-contain">
						<view class="item-type" :class="[index == typeActive ? 'item-type_active':'item-type_default']"
							v-for="(item,index) in typeList" :key="index" @click="getType(item,index) ">
							{{item.name}}
							<view v-if="typeActive == index" class="selected-type">
								<u-icon name="checkmark" class="decoration-checkmark-icon" color="#fff" size="24">
								</u-icon>
							</view>
						</view>
					</view>
					<!-- 多选 -->
					<view v-if="type == 'list' && !singleStatus && typeList.length > 0" class="item-list-contain">
						<view class="item-type" :class="[item.activeStatus ? 'item-type_active':'item-type_default']"
							v-for="(item,index) in typeList" :key="index" @click="getChoice(index) ">
							{{item.name}}
							<view v-if="item.activeStatus" class="selected-type">
								<u-icon name="checkmark" class="decoration-checkmark-icon" color="#fff" size="24">
								</u-icon>
							</view>
						</view>
					</view>
					<slot name="other"></slot>
					<slot name="input"></slot>
				</scroll-view>
			</view>
			<!-- 操作按钮 -->
			<view v-if="buttonShow" class="bottom-add">
				<view class="item-button " :class="[item.active ? 'button-active' :'button-cancel']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
					{{item.name}}
				</view>
			</view>
			
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: '450'
			},
			closeable: {
				type: Boolean,
				default: true
			},
			value: {
				type: Boolean,
				default: false
			},
			buttonShow: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'list'
			},
			typeList: {
				type: Array,
				default () {
					return []
				}
			},

			singleStatus: {
				type: Boolean,
				default: true
			},
			
			topShow: {
				type: Boolean,
				default: false
			},
			titleBorder: {
				type: Boolean,
				default: true
			},
			titleShow: {
				type: Boolean,
				default: true
			},
			buttonList: {
				type: Array,
				default () {
					return [{
						name: '取消',
						active: false
					}, {
						name: '确认',
						active: true
					}]
				}
			},
			// 宽度，只对左，右，中部弹出时起作用，单位rpx，或者"auto"
			// 或者百分比"50%"，表示由内容撑开高度或者宽度，优先级高于length参数
			width: {
				type: String,
				default: ''
			},
			/**
			 * 弹出方向，left|right|top|bottom|center
			 */
			mode: {
				type: String,
				default: 'bottom'
			},
		},
		data() {
			return {
				showPopup: false,
				listHeight: 300,
				typeActive: -1,
			}
		},
		computed: {
			setClass() {

			}
		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else {
					this.close();
				}
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			open() {
				this.$nextTick(() => {
					this.init()
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('input', false)
				})
			},
			init() {
				this.showPopup = true
				this.typeActive = -1
				this.getHeight()
			},
			getHeight() {
				this.$nextTick(() => {
					let classStr = '',
						classStrList = []
					if (this.titleShow) {
						classStrList.push('.default-tittle')
					}
					if (this.buttonShow) {
						classStrList.push('.bottom-add')
					}
					if (this.topShow) {
						classStrList.push('.popup-top')
					}
					classStr = classStrList.join(', ')
					uni.createSelectorQuery().selectAll(classStr)
						.boundingClientRect(res => {
							if (res) {
								let total = 0
								res.forEach(el => {
									total += el.height
								})
								let result = Number(uni.upx2px(this.height)) - total
								this.listHeight = this.$util.pxToRpx(result)
							}
						}).exec()
				})
			},
			getType(item, index) {
				this.typeActive = index
				if (!this.buttonShow) {
					this.close()
				}
				this.$emit('click', {
					item,
					index
				})
			},
			getChoice(index) {
				this.typeList[index].activeStatus = !this.typeList[index].activeStatus
				let result = this.typeList.filter(item => item.activeStatus)
				this.$emit('click', result)
			},
			getButton(item) {
				switch (item.name) {
					case '取消':
						this.close()
						break
					case '确认':
						this.$emit('confirm')
						this.close()
						break
					case '关闭':
						this.close()
						break
					default:
						this.$emit('click', item)
						break
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	/deep/.u-drawer-content {
		background-color: #fff;
	}
	
	.popup-contian {
		position: relative;
		height: 100%;
		background-color: #FFF;
		.default-tittle {
			overflow: hidden;
			margin: 0 20rpx;
			padding: 36rpx 0rpx;
			text-overflow: ellipsis;
			text-align: center;
			text {
				display: inline-block;
				overflow: hidden;
				max-width: 260px;
				text-overflow: ellipsis;
				font-size: 32rpx;
				color: $seconFontColor;
				white-space: nowrap;
			}
		}
		.tittle-no {
			border-bottom: 0rpx;
		}
		.tittle {
			border-bottom: 2rpx solid #EEE;
		}
		.scroll-Y {
			height: 100%;
		}
		.list-contain {}
		.item-list-contain {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx;
			.item-type_active {
				border: 2rpx solid $themeColor;
				color: $themeColor;
			}
			.item-type_default {
				border: 2rpx solid #D9D9D9;
				color: #606266;
			}
			.item-type {
				position: relative;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				padding: 24rpx 22rpx;
				border-radius: 10rpx;
				min-width: 216rpx;
				text-align: center;
				font-size: 28rpx;
				.selected-type {
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;
					border-left: 36rpx solid transparent;
					border-bottom: 36rpx solid $themeColor;
					width: 0;
					height: 0;
					.decoration-checkmark-icon {
						position: relative;
						right: 24rpx;
						bottom: -8rpx;
						transform: scale(.8);
					}
				}
			}
		}
		.bottom-add {
			display: flex;
			position: absolute;
			bottom: 0rpx;
			justify-content: center;
			padding: 0 26rpx;
			padding-bottom: 40rpx;
			width: 100%;
			
			.item-button {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 1;
				margin-right: 4rpx;
				border-radius: $miniBorderRadius;
				// width: 624rpx;
				height: 88rpx;
				font-weight: bold;
				font-size: $fontSize26;
				&:last-child {
					margin-right: 0rpx;
				}
			}
			.button-cancel {
				border: 2rpx solid $themeColor;
				background: #fff;
				color: $themeColor;
			}
			.button-active {
				background-color: $themeColor;
				color: #fff;
			}

		}
		.bottom-cat {
			height: 104rpx;
		}
	}
</style>
