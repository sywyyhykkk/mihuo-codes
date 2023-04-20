<template>
	<view v-if="modalShow" class="u-modal-new">
		<u-modal :shutDown="shutDown" v-model="modalShow" :title="titleText" class="u-modal-new"
			:title-style="{color: '#303133',fontSize:'32rpx',fontWeight:'bold',paddingTop:'24rpx'}"
			:content-style="{fontSize:'28rpx'}" :cancel-style="{fontWeight:'bold',fontSize:'28rpx'}"
			:confirm-style="{fontWeight:'bold',fontSize:'28rpx'}" :show-cancel-button="true" :cancel-text="cancelText"
			:confirm-text="confirmText" confirm-color="#002FA5" cancel-color="#8A8A8A" :mask-close-able="true" @confirm="confirm"
			@cancel="cancel">
			<view class="slot-content">
				<slot></slot>
				<view class="label" v-if="content">{{content}}</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	/**
	 * @description 自定义弹出框
	 */
	export default {
		name: "modal-new",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			content: {
				type: String,
				default: ''
			},
			titleText: {
				type: String,
				default: '温馨提示'
			},
			confirmText:{
				type: String,
				default: '确定'
			},
			cancelText:{
				type: String,
				default: '我再想想'
			},
			shutDown:{
				type: Boolean,
				default: false
			}
		},
		watch: {
			value(newVal, oldVal) {
				this.modalShow = newVal
			}
		},
		data() {
			return {
				modalShow: false,
			}
		},
		methods: {
			confirm() {
				this.$emit('click')
			},
			cancel() {
				this.$emit('cancel')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-modal-new {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}

	/deep/ .u-model {
		min-height: 272rpx;
	}

	.slot-content {
		padding: 8rpx 0 30rpx 0;
		min-height: 100rpx;

		.label {
			color: #999999;
			font-size: $middleFontSize;
			text-align: center;
		}

	}
</style>
