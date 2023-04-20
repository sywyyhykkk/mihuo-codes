<template>
	<view class="serach">
		<view class="content" :style="{'border-radius':radius+'px'}">
			<view class="content-box" :class="{'center':mode === 2}">
				<!-- <text class="icon icon-serach"></text> -->
				<input :placeholder="placeholder" confirm-type="search" @confirm="triggerConfirm" class="input"
					:class="{'center':!active && mode === 2}" :focus="isFocus" v-model="inputVal" @focus="focus"
					@blur="blur" :disabled="disabled" />
				<text v-if="isDelShow" class="icon icon-del" @click.stop="clear"></text>
			</view>
			<view class="serachBtn" @click="search">
				搜索
			</view>
		</view>
		<view v-if="button === 'outside'" class="button" :class="{'active':show||active}" @click="search">
			<view class="button-item">{{!show?searchName:'搜索'}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mode: {
				value: Number,
				default: 1
			},
			placeholder: {
				value: String,
				default: '请输入关键字搜索'
			},
			value: {
				type: String,
				default: ''
			},
			button: {
				value: String,
				default: 'outside'
			},
			show: {
				value: Boolean,
				default: true
			},
			radius: {
				value: String,
				default: 60
			},
			disabled: {
				value: Boolean,
				default: false
			}
		},
		data() {
			return {
				active: false,
				inputVal: '',
				searchName: '取消',
				isDelShow: false,
				isFocus: false
			};
		},
		methods: {
			triggerConfirm() {
				this.$emit('confirm', this, inputVal);
			},
			focus() {
				this.active = true;
				//HM修改 增加获取焦点判断
				if (this.inputVal) {
					this.isDelShow = true;
				}
			},
			blur() {
				this.isFocus = false;
				if (!this.inputVal) {
					this.active = false;
				}
			},
			clear() {
				//HM修改 收起键盘
				uni.hideKeyboard();
				this.isFocus = false;
				this.inputVal = '';
				this.active = false;
				//HM修改 清空内容时候触发组件input
				this.$emit('input', '');
				this.$emit('search', ''); //HM修改 清空内容时候不进行搜索

			},
			getFocus() {
				if (!this.isFocus) {
					this.isFocus = true;
				}
			},
			search() {
				if (!this.inputVal) {
					if (!this.show && this.searchName == '取消') {
						uni.hideKeyboard();
						this.isFocus = false;
						this.active = false;
						return;
					}
				}
				this.$emit('search', this.inputVal ? this.inputVal : this.placeholder);
			}
		},
		watch: {
			inputVal(newVal) {
				if (newVal) {
					this.searchName = '搜索';
					//this.isDelShow = true; //HM修改 直接点击页面预设关键字样式异常，注销
				} else {
					this.searchName = '取消';
					this.isDelShow = false;
				}
				this.debounce(() => {
					this.$emit('search', this.inputVal);
				}, 100)
			},
			//HM修改 双向绑定
			value(val) {
				this.inputVal = val;
			},
		}
	};
</script>

<style lang="scss">
	/deep/ .input-placeholder {
		color: #999999;
	}

	.serach {
		// margin-right: 20rpx;
		display: flex;
		width: 500rpx;
		height: 72rpx;
		box-sizing: border-box;
		font-size: $uni-font-size-base;
		display: flex;
		align-items: center;

		.content {
			display: flex;
			align-items: center;
			width: 100%;
			height: 60upx;
			background: #fff;
			overflow: hidden;
			transition: all 0.2s linear;
			border-radius: 30px;
			background-color: #F4F4F4;

			.content-box {
				width: 100%;
				display: flex;
				align-items: center;

				&.center {
					justify-content: left;
				}

				.icon {
					padding: 0 15upx;

					&.icon-del {
						font-size: 38upx;

						&:before {
							content: "\e644";
						}
					}

					&.icon-serach:before {
						content: "\e61c";
					}
				}

				.input {
					width: 100%;
					max-width: 100%;
					height: 60upx;
					transition: all 0.2s linear;
					margin-left: 30rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #999999;

					&.center {
						width: 300upx;
					}

					&.sub {
						// position: absolute;
						width: auto;
						color: grey;
					}
				}
			}

			.serachBtn {
				width: 108rpx;
				height: 72rpx;
				flex-shrink: 0;
				padding: 0 20rpx;
				background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
				transition: all 0.3s;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 72rpx;
				color: #FFFFFF;


			}
		}
	}

	//HM修改 把字体改成本地加载
	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff;charset=utf-8;base64,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');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}
</style>
