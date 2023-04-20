<template>
	<view class="popup">
		<u-popup
			v-model="showSku"
			@close="close"
			mode="bottom"
			ref="popup"
			border-radius="30"
			:height="height"
			>
            <view class="sku" :style="styleObj">
                <view class="sku-header">
					<view :style="{textAlign:align}" class="sku-header_title">{{title}}</view>
					<u-icon @click.native="refclose" class="sku-header_close" name="close" size="20"></u-icon>
				</view>
				<view class="sku-main">
					<slot></slot>
				</view>
            </view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"sku-popup",
		props:{
			value:{
				type:Boolean,
				default: false
			},
			height:{
				type:String,
				default: '60%'
			},
			title:{
				type:String,
				default: '确认'
			},
			align:{
				type:String,
				default: 'center'
			},
			styleObj:{
				type:Object,
				default:()=>{}
			}
		},
		data() {
			return {
				showSku:true,
			};
		},
		watch:{
			value:{
				handler(val){
					this.showSku = val
				},
				immediate:true
			}
		},
		methods: {
			close(){
				this.showSku = false;
				this.$emit('input',false);
				this.$emit('clearCur')
			},
			refclose(){
				this.$refs.popup.close()
			}
		},
	}
</script>

<style lang="scss" scoped>
.sku{
	padding:20rpx 40rpx;
	height: 100%;
	box-sizing: border-box;
	.sku-header{
		display: flex;
		align-items: center;
		height: 80rpx;
		.sku-header_title{
			flex: 1;
			font-size: 30rpx;
			font-weight: bold;
			color: #141414;
		}
		.sku-header_close{
			background: #EBEBEB;
			border-radius: 50%;
			padding: 10rpx;
		}
	}
	.sku-main{
		width: 100%;
		height: calc(100% - 80rpx);
	}
}
</style>
