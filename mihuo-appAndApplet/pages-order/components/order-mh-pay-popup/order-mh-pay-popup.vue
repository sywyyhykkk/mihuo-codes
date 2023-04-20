<template>
	<view>
		<order-mh-sku-popup @input="closeSku" v-model="showPay" title="支付" align="left" height="75%" :styleObj="{background:'#f8f8f8'}"
			@clearCur="clearCur">
			<view class="content-sku">
				<view class="head_price">
					<view class="title">佣金待支付</view>
					<view class="price"><text>￥</text>{{ Math.abs(money) }}</view>
				</view>
				<view class="type_title">选择支付方式</view>
				<view class="content-main">
					<view class="content-main_res pay_item" @click="changePayRadio(item,index)" v-for="(item,index) in payTypeList" :key="index">
						<view class="reason2">
							<view class="pay">
								<image class="pay_icon" :src="item.icon" />
								<view class="name">{{item.name}}</view>
							</view>
							<view>{{item.tips}}</view>
						</view>
						<view class="radio2" :class="{radioSelect2:curIndex === index}"></view>
					</view>
				</view>
				<bottom-button title="确认提交" color="#fff" :styleObj="{background:'#424242'}" @click="confirm" />
			</view>
		</order-mh-sku-popup>
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		props:{
			// 支付金额
			money:{
				type:[Number,String],
				default:0,
			},
			// 支付弹窗调用
			value:{
				type:Boolean,
				default:false
			}
		},
		components:{
			
		},
		data(){
			return{
				showPay: false,
				curIndex: 0,
				payTypeList: [
					{
						value: 4,
						name: '支付宝支付',
						tips: '使用支付宝支付',
						icon: 'https://www.51mihuo.com/static/images/order_details/small_ali.png'
					},
					{
						value: 3,
						name: '微信小程序支付',
						tips: '使用微信小程序支付',
						icon: 'https://www.51mihuo.com/static/images/order_details/small_wx.png'
					},
					// {
					// 	name: '银联支付',
					// 	tips: '使用银联宝支付',
					// 	icon: 'https://www.51mihuo.com/static/images/order_details/small_union.png'
					// },
				],
				formData:{
					payType:3,
				}
			}
		},
		
		watch:{
			value(newVal){
				this.showPay = newVal
				if(newVal){
					this.formData.payType = this.payTypeList[0].value
				}
			}
		},
		
		mounted() {
			// #ifdef MP-WEIXIN
			this.payTypeList = [{
					value: 3,
					name: '微信小程序支付',
					tips: '使用微信小程序支付',
					icon: 'https://www.51mihuo.com/static/images/order_details/small_wx.png'
				}]
			// #endif
		},
		
		methods:{
			closeSku(){
				this.showPay = false;
				this.$emit("input",false)
				// 动画结束后再显示底部导航栏
				setTimeout(() => {
					uni.showTabBar({
						animation: true
					})
				}, 300)
			},
			clearCur(){
				this.curIndex = 0
			},
			// 确认支付
			confirm(){
				this.formData.mode = this.money>0?'支付':'退款';
				this.debounce(()=>{
					this.$emit('callback',this.formData)
				},300)
			},
			changePayRadio(data, index){
				this.formData.payType = data.value;
				this.curIndex = index
			},
			// 成功回调
			successCallback(){
				this.showPay = false;
				this.$emit('refresh');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-sku{
		.content-main{
			overflow: hidden;
			.content-main_res{
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				
				.radio2{
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border: 4rpx solid #BDBDBD;
					margin-right: 30rpx;
				}
				.radioSelect2{
					border: 4rpx solid #FF5F00;
					position: relative;
					&::before{
							// content:'✔';
							content: '\2713\fe0e';
							color: #FF5F00;
							font-size: 24rpx;
							font-weight: bold;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%,-50%);
						}
					}
					.reason2{
						flex: 1;
						&>view{
							color: #141414;
							font-size: 26rpx;
							&:last-child{
								color: #808080;
								font-size: 24rpx;
								padding-top: 10rpx;
							}
						}
						.pay{
							display: flex;
							align-items: center;
							.name{
								color: #141414;
								font-size: 28rpx;
							}
							.pay_icon{
								width: 40rpx;
								height: 40rpx;
								margin-right: 27rpx;
							}
						}
						
					}
			}
		}
		.pay_item{
			display: flex;
			align-items: center;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 28rpx 0 28rpx 30rpx;
			margin-top: 15rpx !important;
		}
		.type_title{
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #808080;
			margin-left: 48rpx;
		}
		.head_price{
			text-align: center;
			.title{
				font-size: 24rpx;
				font-weight: 500;
				color: #808080;
			}
			.price{
				font-size: 77rpx;
				font-weight: bold;
				color: #141414;
				margin: 42rpx 0 72rpx;
				text{
					font-size: 33rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>
