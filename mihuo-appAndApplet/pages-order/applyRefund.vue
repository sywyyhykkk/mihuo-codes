<template>
	<view style="background-color: #FFFFFF;height: 100vh;">
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				申请退款
			</view>
		</z-nav-bar>
		<view class="form-container">
			<order-mh-app-form ref="appForm" :forms="form" @submit="getForms" :reset="isResetForm"></order-mh-app-form>
		</view>
		<view style="margin-left: 40rpx;">
			<image-upload-new  v-model="pics" count="3"></image-upload-new>
		</view>
		<view class="submit-btn">
			<order-mh-primary-button :loading="loading" title="提交申请"
				@onclick="()=>onSubmit()" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				form: [
					{
						model: 'orderSn',
						label: '订单编号',
						defaultValue: '',
						disabled: true,
						mode:'input',
					},
					{
						model: 'description',
						label: '申请描述',
						textColor: '#909999',
						mode:'input',
					},
				],
				pics: '[]',
				isResetForm: false,
				orderSn: '',
				orderId: '',
			}
		},
		onLoad(option) {
			this.itemId = option.itemId
			this.orderId = option.id
			this.orderSn = option.orderSn
			this.form[0].defaultValue = this.orderSn
		},
		methods: {
			onSubmit() {
				this.$refs.appForm.onSubmit()
			},
			getForms(forms) {
				const pics = JSON.parse(this.pics)
				this.loading = true
				this.$httpApi.applyRefund({
					itemId: this.itemId,
					pics: pics,
					orderId: this.orderId,
					reason: forms.description,
				}).then(res => {
					if(res){
						this.$util.toast('申请退款成功')
					}
				}).finally(e => {
					setTimeout(() => {
						this.goBack();
						uni.$emit('shouldUpdateList', '')
						this.loading = false
					}, 1200)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title(#303133)
	}
	
	.form-container {
		width: 100vw;
		height: max-content;
		padding: 40rpx 0;
		background-color: #FFFFFF;
		
		.upload-container {
			width: 100vw;
			position: relative;
			margin-top: 140rpx;
			padding-left: 40rpx;
			padding-bottom: 40rpx;
			background-color: #FFFFFF;
		}
	}
	
	.submit-btn {
		width: 690rpx;
		margin: 0 auto;
		margin-top: 100rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #333333;
	}
	
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
