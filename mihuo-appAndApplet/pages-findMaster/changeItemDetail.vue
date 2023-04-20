<template>
	<view>
		<u-popup
		v-model="show"
		border-radius="14"
		@close="closePopup"
		mode="bottom"
		height="80%"
		>
			<view class="order" v-if="modify">
				<view class="order-header">
					<u-icon name="close" @click="closePopup"></u-icon>
				</view>
				<view class="order-main" v-if="modify.customerAlterationList && modify.customerAlterationList.length">
					<scroll-view scroll-y="true" style="height:100%">
						<view class="order-item">
							<view class="order-item_title" v-if="modify.customerAlterationList.length && modify.customerAlterationList[0].status==0">
								{{ modify.payStatus == 0?'等待付款': modify.payStatus == 1?'待支付':modify.payStatus == 2?'已支付':modify.payStatus == 3?'已拒绝':''}}
							</view>
							<view class="order-item_title" v-if="modify.customerAlterationList.length && modify.customerAlterationList[0].status==1">
								{{ modify.payStatus == 0?'待确认': modify.payStatus == 1?'已确认':modify.payStatus == 3?'已拒绝':''}}
							</view>
						</view>
						<view class="order-price">
							<view :style="modify.customerAlterationList[0].status == 0?'color: #FE6E32;':'color: #141414;'">{{ Math.abs(modify.alterationMoney) }}</view>
							<text>元</text>
							<image 
							:src="modify.customerAlterationList[0].status == 0?require('@/pages-findMaster/static/icon/work_type/payment.png'):require('@/pages-findMaster/static/icon/work_type/payment-in.png')"
								mode="scaleToFill"
							/>
						</view>
						<view class="order-time">申报时间 {{modify.created}}</view>
						<view class="order-list">
							<view class="title">报价说明</view>
							<view class="title tips">{{ modify.alterationReason }}</view>
							<findMaster-mh-image-show v-if="modify.customerAlterationList && modify.customerAlterationList.length && modify.customerAlterationList[0].pics" :imgSrc="modify.customerAlterationList[0].pics" />
							<findMaster-mh-mihuo-audio v-if="modify.customerAlterationList && modify.customerAlterationList.length && modify.customerAlterationList[0].audio"
								:formDate="modify.customerAlterationList[0].audio" />
							<view class="title" style="padding-top:40rpx">项目清单</view>
							<view v-if="modify.groupPrices && modify.groupPrices.length">
								<!-- 人工费 -->
								<view v-if="masterList && masterList.length">
									<view class="order-type">
										<view class="order-type_name">人工</view>
										<view class="order-type_num">总计：<text>{{ laborCost }}</text>元</view>
									</view>
									<view class="order-list_item" v-for="(item,index) in masterList" :key="index">
										<view class="order_top">
											<text class="item_skill">{{ item.businessName || '其他' }}</text>
											<text class="item_price">￥ {{item.totalPrice}}</text>
										</view>
										<view v-if="item.products.length">
											<view v-for="(v,i) in item.products" :key="i" class="productJson">
												<view class="item_list">
													<image :src="$util.thumbnailImage(v.productImg)" />
													<view>{{ v.productName }}</view>
													<text>{{ v.price+'/'+v.budgetNum }}</text>
												</view>
												<view class="price">{{ $math.floatMul(Number(v.budgetNum),Number(v.price)) }}</view>
											</view>
										</view>
										<findMaster-order-mh-empty v-else marginTop="50" size="150" title="暂无报价清单～～" />
									</view>
								</view>

								<!-- 材料费 -->
								<view v-if="materialList && materialList.length" class="material">
									<view class="order-type">
										<view class="order-type_name">材料</view>
										<view class="order-type_num">总计：<text>{{ materialCost }}</text>元</view>
									</view>
									<view class="order-list_item" v-for="(item,index) in materialList" :key="index">
										<view class="order_top">
											<text class="item_skill" >{{ item.businessName }}</text>
											<text class="item_price">￥ {{ item.totalPrice }}</text>
										</view>
										<view v-if="item.products.length">
											<view v-for="(v,i) in item.products" :key="i" class="productJson">
												<view class="item_list">
													<image :src="$util.thumbnailImage(v.productImg)" />
													<view>{{ v.productName || '其他' }}</view>
													<text>{{ v.price+'/'+ v.budgetNum }}</text>
												</view>
												<view class="price">{{ $math.floatMul(Number(v.budgetNum),Number(v.price)) }}</view>
											</view>
										</view>
									</view>
								</view>
								<view class="order-list_footer" v-if="modify.groupPrices && modify.groupPrices.length>0">
									<text class="list-total">共计{{ modify.groupPrices.length }}个项目</text>
									<view class="list-momeny">
										<text>合计</text>
										<text>{{modify.bidPrice}}</text>
										<text>元</text>
									</view>
								</view>
							</view>
							<findMaster-mh-empty v-else marginTop="100" size="200"  title="暂无项目清单～～" />
						</view>
					</scroll-view>
				</view>
				<view class="order-footer">
					<view class="collect" @click="noConfirm" v-if="modify.payStatus == 0">拒绝</view>
					<view class="send" @click="confirm(0)" v-if="modify.payStatus == 0" >{{ modify.customerAlterationList[0].status == 0?'确认':'确认退款'}}</view>
					<view class="send" @click="confirm(1)" v-if="modify.payStatus == 1 && modify.customerAlterationList[0].status == 0" >去支付</view>
					<view class="last" v-if="modify.payStatus == 1 && modify.customerAlterationList[0].status == 1" >我已确认</view>
					<view class="last" v-if="modify.payStatus == 2" >该项目已支付</view>
					<view class="last" v-if="modify.payStatus == 3" >{{ modify.customerAlterationList[0].status == 0?'拒绝补款':'拒绝退款'}}</view>
				</view>
			</view>
		</u-popup>
		<findMaster-mh-pay-popup v-model="isCollect" @callback="payConfirm" :money="modify.alterationMoney"></findMaster-mh-pay-popup>
		<!-- 支付成功 -->
		<findMaster-mh-pay-success :orderInfo="modify" @setPayFinish="refresh" :paySuccessData="paySuccessData" v-if="finished" />
	</view>
</template>

<script>

	export default {
		name:"order-receiving",
		props:{
			value:{
				type:Boolean,
				default:false
			},
			data: {
				type: Object,
				default:()=>({})
			},
		},
		watch:{
			value(news){
				this.show = news;
			},
			data:{
				handler(news){
					if(news){
						if(news.customerAlterationList&&news.customerAlterationList.length){
							news.customerAlterationList.map(item => {
								if(typeof item.audio === 'string'){
									item.audio = JSON.parse(item.audio)
								}
							})
						}
						if(news.groupPrices && news.groupPrices.length){
							this.masterList = news.groupPrices.filter(v=>v.businessType == 1)
							this.materialList = news.groupPrices.filter(v=>v.businessType == 2)
						}
						this.modify = news;
						if(news.id){
							this.getProjectList();
						}
					}
				},
				immediate:true
			}
		},
		
		data() {
			return {
				show:false,
				isCollect:false,
				orderList:[
					{name:'拆除踢脚线', price:160, },
					{name:'拆除踢脚线', price:160, },
					{name:'拆除踢脚线', price:160, tips:"4x70"},
					{name:'拆除踢脚线', price:160, tips:"4x70"},
				],
				orderObj:[],
				modify:{},
				finished:false,
				paySuccessData:{},
				masterList:[],
				materialList:[],
			};
		},
		methods: {
			// 统计项目数量
			viteNum(data){
				this.proAll = 0;
				if(data){
					data.map(v=>{
						if(JSON.parse(v.productJson) && JSON.parse(v.productJson).length){
							this.proAll = this.$math.floatAdd(this.proAll,JSON.parse(v.productJson).length)
						}
					})
				}
			},
			// 获取项目清单信息
			getProjectList(){
				this.$http.get(`order/bizorderalteration/getGrouprice/${this.modify.id}`)
				.then(res=>{
					this.orderObj = res;
					this.viteNum(res)
				})
			},
			confirm(payStatus){
				if(payStatus == 0){
					this.$http.post('order/bizorderalteration/updateAlteration',{
						id:this.modify.id,
						payStatus:1
					}).then(res=>{
						if(res){
							this.$util.toast("确认成功");
							this.closePopup();
							this.refresh();
						}
					})
				}else{
					let params = {
						payAmount: Math.abs(this.modify.alterationMoney),
						payType: 3,
						ids:[this.modify.id]
					}
					this.closePopup();
					// #ifdef MP-WEIXIN
						this.$util.requestPay(3, params, 'changeItem',()=>{this.closePopup()})
					// #endif
					// #ifdef APP-PLUS || H5
						this.isCollect = true;
					// #endif

				}
			},
			// 拒绝
			noConfirm(){
				this.$emit('input',false);
				this.$emit('keepOn',this.modify,'no');
			},
			closePopup(){
				this.show = false;
				this.$emit('input',false)
			},
			refresh(){
				this.isCollect = false;
				this.$emit('refresh')
			},
			// 支付确认
			payConfirm(data) {
				let params = {
					payAmount: Math.abs(this.modify.alterationMoney),
					payType: data.payType,
					ids:[this.modify.id]
				}
				// #ifdef MP-WEIXIN
					this.$util.requestPay(3, params, 'changeItem',()=>{this.isCollect = false})
				// #endif
				// #ifdef APP-PLUS || H5
					if (data.payType === 3) {
						this.$util.requestPay(data.payType,params,'changeItem',()=>{this.isCollect = false})
					} else {
						uni.showLoading({
							mask:true
						});
						this.$http.post("order/customer/pay/alteration", params).then( res => {
							if (res && res.payInfo) {
								this.$util.requestPay(data.payType,res.payInfo,'changeItem',()=>{this.isCollect = false})
							}
						}).finally(()=>{
							uni.hideLoading();
						})
					}
				// #endif
			},
		},
	}
</script>

<style lang="scss" scoped>
.order{
	height: 100%;
	padding:20rpx 0;
	margin: 0 30rpx;
	box-sizing: border-box;
	position: relative;
	.order-header{
		display: flex;
		justify-content: flex-end;
		height: 40rpx;
	}
	.order-main{
		height: calc(100% - 140rpx);
		.order-item{
			.order-item_title{
				color: #000000;
				font-size: $middleFontSize;
				font-weight: bold;
			}
			
		}
		.order-price{
			display: flex;
			align-items: baseline;
			padding: 20rpx 0 10rpx;
			view{
				color: #FE6E32;
				font-size: 60rpx;
				font-weight: bold;
			}
			text{
				color: #141414;
				font-size: $smallFontSize;
				padding: 0 10rpx;
			}
			image{
				width: 70rpx;
				height: 30rpx;
				image-rendering: optimize-contrast;
        		image-rendering: -webkit-optimize-contrast;
			}
		}
		.order-time{
			color: #808080;
			font-size: $fontSize22;
		}
		.order-list{
			padding-top: 50rpx;
			.title{
				color: #000000;
				font-size: $middleFontSize;
				font-weight: bold;
				padding-bottom: 20rpx;
				font-family: 'PingFang-SC-Bold';
			}
			.tips{
				font-weight:normal;
				font-size: $fontSize26;
			}
			.order-list_item{
				// display: flex;
				// justify-content: space-between;
				// &:last-child{
				// 	padding-bottom: 20rpx;
				// }
				padding: 10rpx;
				border-top: 2rpx solid #DCDFE6;
				&:first-child{
					border-top: none;
				}
				.order_top{
					display: flex;
					justify-content: space-between;
					.item_skill{
						background: #FE6E32;
						color: #FFFFFF;
						font-size: 18rpx;
						border-radius: 12rpx 0 12rpx 0;
						padding: 5rpx 10rpx;
					}
					.item_price{
						color: #000000;
						font-size: 24rpx;
					}
				}
				.item_list{
					display: flex;
					align-items: center;
					padding-top: 10rpx;
					view{
						font-size: $smallFontSize;
						padding: 0 10rpx;
						color: #000000;
					}
					text{
						font-size: $smallFontSize;
						color: #808080;
					}
					image{
						width: 30rpx;
						height: 30rpx;
						border-radius: 4rpx;
					}
				}
				.price{
					color: #808080;
					font-size: $smallFontSize;
				}
			}
			.order-list_footer{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
				padding: 10rpx 0;
				border-top: 1rpx solid #E6E6E6;
				.list-total{
					color: #808080;
					font-size: $fontSize22;
				}
				.list-momeny{
					text{
						font-size: $fontSize22;
						color: #FE6E32;
						&:first-child{
							color: #808080;
						}
						&:nth-child(2){
							font-size: 42rpx;
							padding: 0 10rpx;
						}
					}
				}
			}

		}
	}
	.order-footer{
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100rpx;
		display: flex;
		padding: 10rpx 0;
		box-sizing: border-box;
		.collect{
			width: 200rpx;
			flex-shrink: 0;
			color: #141414;
			border-radius: 12rpx;
			border: 1px solid #141414;
			font-size: $middleFontSize;
			font-weight: bold;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.send{
			flex: 1;
			background: #424242;
			border-radius: 12rpx;
			color: #FFFFFF;
			font-size: $middleFontSize;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.last{
			flex: 1;
			background: #C6C6C6;
			border-radius: 12rpx;
			color: #FFFFFF;
			font-size: $middleFontSize;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
.productJson{
	display: flex;
	justify-content: space-between;
}
.order-type{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 10rpx;
	.order-type_name{
		font-size: 24rpx;
		font-weight: bold;
	}
	.order-type_num{
		font-size: 24rpx;
		text{
			color: #FE6E32;
		}
	}
}
</style>