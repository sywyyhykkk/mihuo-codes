<template>
	<view class="x6-item-custom" :class="!border && 'x6-border'" @tap="getPopContent"  >
		<text class="x6-item-placeholder" v-show="placeholderShow" :style="{color: placeholderColor}">{{placeholder}}</text>
		<view class="x6-item-content-text">{{value}}</view>
		<u-icon :name="iconName" class="x6-icon" color="#d1d1d1" size="32"></u-icon>
		<!-- <image class="dingwei" src="@/static/images/icon-address/address-3.png" mode=""></image> -->
		<!-- <u-icon v-show="remove && !placeholderShow" name="close-circle-fill" class="x6-icon x6-remove" color="#d1d1d1"
			size="32" @tap.stop="getRemove"></u-icon> -->
	</view>
</template>

<script>
	export default {
		name:'custom-input',
		props: {
			value:{
				type: String,
				default: ''
			},
			iconName: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			},
			remove: {
				type: Boolean,
				default: false
			},
			border:{
				type: Boolean,
				default: true
			},
			placeholderColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				placeholderShow: true,
				contentForm: 'rgb(192, 196, 204)',
			}
		},
		watch: {
			value(val, oldVal) { //普通的watch监听
				this.placeholderShow = false
			},
		},
		mounted() {
			// if (this.$props.content) {
			// 	this.placeholderShow = false
			// }
			// console.log(this.value)
			if (this.value) {
				this.placeholderShow = false
			}
		},
		methods: {
			getClick() {

			},
			getPopContent() {
				this.$emit('click')
			},
			getRemove() {
				console.log("删除")
				this.$emit('remove')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.x6-border{
		border: 0 !important;
		padding:0px !important;
	}
	.x6-item-custom {
		border-radius: 5px;
		padding: 3px 16px 3px 16px;
		border: 2rpx solid #D9D9D9 ;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.x6-item-placeholder {
			font-size: 26rpx;
			color: rgb(192, 196, 204);
		}

		.x6-item-content-text {
			color: #333333;
			font-size: 28rpx;
			// overflow-x: auto;
			// width: 400rpx;
			line-height: 1.5;
			display: flex;
			align-items: center;
			min-height: 70rpx;
		}

		.x6-remove {}
	}
	.dingwei{
		width: 36rpx;
		height: 36rpx;
	}
</style>
