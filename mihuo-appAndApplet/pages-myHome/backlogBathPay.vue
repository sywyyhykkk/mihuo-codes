<template>
	<view class="batch">
		<z-nav-bar bgColor="#f7f7f7">
			<view class="nav-bar" slot="default">待支付</view>
		</z-nav-bar>
		<view class="batch-content">
			<view v-for="(item,index) in list" :key="index">
				<view class="wait" :class="{
					active:checkbox[index]
				}">
					<view class="wait-top">
						<view class="flex-row_name flex-box" >
							<u-avatar class="avatar" size="50"
								:src="$util.avatarImage(235)" />
							<text class="name">{{item.name }}</text>
							<text class="skill-name" v-if="item.skillName">{{item.skillName }}</text>
						</view>
						<view class="wait-top_date" v-if="item.created">{{ getNoticeDate(item.created) }}</view>
					</view>
					<view class="wait-main flex-center">
						<u-checkbox 
							class="checkbox" 
							style="width: 40rpx; height: 40rpx;"
							shape="circle"
							@change="selectNape(item,index)"
							v-model="checkbox[index]">
							{{ item.content}}
						</u-checkbox>
						<!-- <view v-if="data.businessParams.omsOrderId" class="wait-main_title">{{ data.comment || '所需材料已申请，为避免工期延迟，请及时确认并付款'}}</view>
						<view v-else class="wait-main_title">{{ data.comment || ''}}</view> -->
					</view>
					<view class="wait-buttom">
						<text>￥</text>
						<text class="bidPrice" style="font-size:30rpx">{{ Math.floor(item.price) || 0}}</text>
						<text class="bidPrice">{{ item.price | priceFormat }}</text>
					</view>
				</view>
				<view class="tips" v-if="index == 0 && list.length>1">
					还有<span>4笔款项待支付，</span>可批量支付
				</view>
			</view>
		</view>
		<view class="batch-bottom">
			<view class="batch-do flex-center">
				<view class="batch-do_left">
					<u-checkbox 
						class="checkbox" 
						style="width: 40rpx; height: 40rpx;"
						@change="selectAll()" 
						shape="circle"
						v-model="isAll">全选
					</u-checkbox>
				</view>
				<view class="batch-do_right flex-center">
					<view class="right-left">
						<view class="right-left_top">
							<text class="total">合计：</text>
							<text>￥</text>
							<text class="bidPrice" style="font-size:30rpx">{{ Math.floor(totalPrice) || 0}}</text>
							<text class="bidPrice">{{ totalPrice | priceFormat }}</text>
						</view>
						<!-- <view class="right-left_bottom flex-center" @click="look">
							<text>共减 ￥1000.00</text>
							查看明细
							<u-icon name="arrow-down" color="#FE6E32" :size="20"></u-icon>
						</view> -->
					</view>
					<view class="right-right_bottom" @click="oncePay">确认支付</view>
				</view>
			</view>
		</view>
		<u-action-sheet @click="confirmPayType" :list="payTypeList" v-model="isShowSheet"
			:safe-area-inset-bottom="true">
		</u-action-sheet>
		<mihuo-popup ref="mihuoPopup" title='优惠明细'>
			
		</mihuo-popup>
	</view>
</template>

<script>
	import {
		getNoticeDate
	} from '@/static/js/chat.js'
	export default {
		data() {
			return {
				isAll:false,
				list:[
					{id:1,name:"张三",skillName:'项目管家',content:"[项目管家]周移动已申请【套餐1】，金额：200. 00，为避免工期延迟，请及时确认并付款",price:200,created:"2023-03-24 19:21:41"},
					{id:2,name:"张三",skillName:'项目管家',content:"[项目管家]周移动已申请【套餐1】，金额：200. 00，为避免工期延迟，请及时确认并付款",price:200,created:"2023-03-24 19:21:41"},
					{id:3,name:"张三",skillName:'项目管家',content:"[项目管家]周移动已申请【套餐1】，金额：200. 00，为避免工期延迟，请及时确认并付款",price:200,created:"2023-03-24 19:21:41"},
					{id:4,name:"张三",skillName:'项目管家',content:"[项目管家]周移动已申请【套餐1】，金额：200. 00，为避免工期延迟，请及时确认并付款",price:200,created:"2023-03-24 19:21:41"},
					{id:5,name:"张三",skillName:'项目管家',content:"[项目管家]周移动已申请【套餐1】，金额：200. 00，为避免工期延迟，请及时确认并付款",price:200,created:"2023-03-24 19:21:41"},
				],
				getNoticeDate:getNoticeDate,
				checkbox:[],
				curArr:[],
				totalPrice:0,
				isShowSheet:false,
				payTypeList: [{
					text: '支付宝支付',
				}, {
					text: '微信小程序支付'
				}],
			};
		},
		methods: {
			selectAll(){
				this.isAll = !this.isAll
				if(this.isAll){
					this.curArr = this.list;
				}else{
					this.curArr = [];
				}
				for (let index = 0; index < this.list.length; index++) {
					this.checkbox[index] = this.isAll?true:false
				}
				this.totalPrice = this.curArr.reduce((pre, cur) => {
					return Number(pre) + Number(cur.price || 0)
				}, 0)
			},
			look(){
				this.$refs.mihuoPopup.open()
			},
			selectNape(data,index){
				this.checkbox[index] = false;
				let repeatArr=[];		//重复元素计算
				this.curArr.push(data);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i].id == data.id) {
						repeatArr.push(data)
					}
				}
				if((repeatArr.length)%2===0){
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i].id == data.id) {
							this.curArr.splice(i,1);
							i--
						}
					}
				}else{
					this.curArr = Array.from(new Set(this.curArr))
				}
				this.totalPrice = this.curArr.reduce((pre, cur) => {
					return Number(pre) + Number(cur.price || 0)
				}, 0)
			},
			// 获取支付待办
			getUnpaidList(){

			},
			oncePay(){
				// #ifndef MP
				this.isShowSheet = true
				// #endif
				// #ifdef MP-WEIXIN
				this.applyPay(3)
				// #endif
			},
			confirmPayType(e) {
				let payType = 0
				if (e === 0) {
					payType = 4
				} else if (e === 1) {
					payType = 3
				}
				this.batchPay(payType)
			},
			async batchPay(payType){
				if (payType == 4) {
					// 支付宝支付
					 await this.$httpApi.payOrder({
						orderIds: [],
						payMethod: payType
					})
				} else {
					this.$util.requestPay(payType, {
						orderId: {
							orderIds: []
						}
					}, 'mallOrder', () => {
						this.getUnpaidList()
					})
				}
				
			}
		},
	}
</script>
<style>
	page {
		background: #f7f7f7 !important;
	}
</style>
<style lang="scss" scoped>
.batch{
	padding-bottom: 200rpx;
	.batch-content{
		padding: 0 30rpx;
		.wait{
			background: #FFFFFF;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			border: 1rpx solid #FFFFFF;
		}
		.active{
			border: 1rpx solid #FE6E32;
		}
		.wait-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #F0F0F0;
			.flex-row_name{
				text{
					margin-left: 14rpx;
				}
				.name{
					color: #000000;
					font-size: 24rpx;
					font-family: NotoSansHans-Regular;
				}
				.skill-name{
					color: #FE6E32;
					font-size: 20rpx;
					background: #FFF0EA;
					border-radius: 10rpx 0;
					padding: 2rpx 10rpx;
					font-weight: 600;
				}
			}
			.wait-top_date {
				padding-left: 10rpx;
				font-size: 24rpx;
				color: #808080;
			}
		}
		.wait-main{
			padding: 20rpx 0;
			border-bottom: 1rpx solid #F0F0F0;
			.checkbox{
				width: auto !important;
				height: auto !important;
				::v-deep.u-checkbox__label{
					color: #808080;
					font-size: 28rpx !important;
					padding-left: 10rpx;
					font-size: NotoSansHans-Regular;
					line-height: normal;
				}
			}
			.wait-main_title{
				flex: 1;
				color: #808080;
				font-size: 28rpx;
				padding-left: 10rpx;
				font-size: NotoSansHans-Regular;
			}
		}
		.wait-buttom{
			text-align: right;
			padding-top: 20rpx;
			text{
				font-size: 20rpx;
				color: #ED3832;
			}
		}
		.tips{
			padding-bottom: 20rpx;
			color: #808080;
			font-size: 28rpx;
			font-family: NotoSansHans-Regular;
			span{
				color: #FE6E32 ;
			}
		}
	}
	.flex-box {
		display: flex;
		align-items: center;
	}
	.batch-bottom{
		width: 100%;
		height: 140rpx;
		position: fixed;
		bottom: 0;
		background-color: #ffffff;
		border-top: 2rpx #f5f5f5 solid;
		.batch-do {
			/* #ifdef APP-PLUS */
			height: 88rpx;
			/* #endif */
			background: #FFFFFF;
			width: 100%;
			padding: 20rpx 30rpx 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			box-sizing: border-box;
			.batch-do_left{
				.checkbox{
					flex-shrink: 0;
					width: auto !important;
					::v-deep.u-checkbox__label{
						font-size: 24rpx !important;
						color: #808080;
					}
				}
			}
			.batch-do_right{
				flex: 1;
				.right-left{
					flex: 1;
					padding-right: 20rpx;
					.right-left_top{
						text-align: right;
						text{
							color: #ED3832;
							font-size: 20rpx;
							font-family: NotoSansHans-Medium;
						}
						.total{
							color: #000000;
							font-size: 24rpx;
						}
					}
					.right-left_bottom{
						color: #FE6E32;
						font-size: 24rpx;
						font-family: NotoSansHans-Regular;
						justify-content: end;
						padding-top: 10rpx;
						text{
							color: #FE6E32;
							font-size: 24rpx;
							font-family: NotoSansHans-Medium;
							padding-right: 10rpx;
						}
					}
				}
				.right-right_bottom{
					flex-shrink: 0;
					color: #000000 ;
					font-family: NotoSansHans-Medium;
					font-size: 28rpx;
					background: #FE6E32;
					height: 80rpx;
					width: 250rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 44rpx;
				}
			}
		}
	}
}
.flex-center{
	display: flex;
	align-items: center;
}
</style>
