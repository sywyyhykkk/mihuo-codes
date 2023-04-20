<template>
	<view>
		<!-- <view class="top_nav display-center">
			<view class="left">
				<text class="title">师傅信息</text>
				<text class="worker_state">{{setWorkerState}}</text>
			</view>
			<view class="right_ent display-left" v-if="orderInfo.orderStatus<20&&(masterObj.bidStatus==2 || masterObj.bidStatus==8)" @click="arousePopup('选择换人原因')">
				<text class="text">申请换人接单</text>
				<image src="https://www.51mihuo.com/static/images/order_details/orange_right_arrow.png" />
			</view>
			<view class="right_ent display-left" v-if="orderInfo.orderStatus>=20" @click="arousePopup('投诉')">
				<text class="text">投诉</text>
				<image src="https://www.51mihuo.com/static/images/order_details/orange_right_arrow.png" />
			</view>
		</view> -->
		<view v-if="workerList && workerList.length">
			<view class="worker_view">
				<view class="worker_item" :class="item.disabled?'disabled_style':'worker_item'"
					v-for="item in workerList" :key="item.id">
					<order-mh-master-item :item="item" :orderInfo="orderInfo" @orderReceiving="orderReceiving(item)" />
				</view>
			</view>
		</view>
		<!-- 申请换人、投诉弹窗 -->
		<order-mh-sku-popup v-model="showReplacePopup" :title="popupTitle" @clearCur="clearCur">
			<view class="content-sku">
				<view class="content-main">
					<view class="content-main_res" @click="radioValue(item,index)" v-for="(item,index) in reasonList" :key="index">
						<view class="radio" :class="{radioSelect:curIndex === index}"></view>
						<view class="reason">{{item.label}}</view>
					</view>
					<textarea v-show="(reasonList.length-1) == curIndex"  placeholder-style="color:#808080" placeholder="请输入问题描述" style="width: 100%;
						height: 186rpx;padding: 24rpx 26rpx;margin-top: 64rpx;background: #F7F7F7;
						border-radius: 12rpx;font-size: 26rpx;" v-model="formData.replaceReason" />
				</view>
				<bottom-button title="确认提交" color="#141414" :styleObj="{background:'#EBEBEB'}" @click="confirmSubmit" />
			</view>
		</order-mh-sku-popup>
	</view>
</template>

<script>
	export default{
		props:{
			orderInfo: {
				type: Object,
				default:()=>({})
			},
			workerInfo: {
				type: Object,
				default:()=>({})
			},
			// 接单师傅信息
			masterObj: {
				type: Object,
				default:()=>({})
			},
			// 子订单师傅接单信息
			subOrder:{
				type: Array,
				default:()=>([])
			}
		},
		data(){
			return{
				popupTitle: '',
				remark: '',
				isOpen: true,
				workerList: [],
				tempList: [],
				showReplacePopup: false,
				curIndex: 0,
				todo: '',
				reasonList: [],
				formData:{},
				popupShow:false,
			}
		},
		
		watch:{
			workerInfo:{
				handler(data) {
				    this.setWorkerList()
				},
				immediate: true
			}
		},
		
		mounted() {
			this.setWorkerList()
		},
		
		computed:{
			// 订单状态: 10=待确认；20=待付款；30=服务中；35=待验收；40=待结算；50=已完成；-1=已取消
			setWorkerState(){
				if(this.tempList){
					if(this.orderInfo.orderStatus===-1){
						return '订单已取消'
					}else if(this.orderInfo.orderStatus===10){
						if(this.tempList.length===1){
							return '师傅已接单'
						}else if(this.tempList.length>1){
							return '多位师傅已接单'
						}else{
							return '暂无人接单'
						}
						
					}else if(this.orderInfo.orderStatus===20 && this.tempList.length){
						if(this.masterObj.bidStatus==2||this.masterObj.bidStatus==3){
							return '师傅已确认'
						}
						return '报价已确认'
					}else if(this.orderInfo.orderStatus===30){
						return '服务中'
					}else if(this.orderInfo.orderStatus===50){
						return '待评价'
					}else if(this.orderInfo.orderStatus===51){
						return '评价完成'
					}
				}
			}
		},
		
		methods:{
			//发消息
			sendMessage(){
				let info = this.workerInfo.personInfo;
				this.$util.goToChat(info.userId,info.name,'constructionOrder');
			},
			setWorkerList(){
				this.tempList = this.workerInfo.offerList
				this.workerList = this.tempList&&this.tempList.map(item => {
					if(item.bidStatus<4 || item.bidStatus==8){
						if(this.orderInfo.priceWay!=2){
							item['disabled'] = false
							return item
						}else{
							item['disabled'] = false
							return item
						}
						
					}else if(item.bidStatus>=4){
						item['disabled'] = true
						return item
					}
				})
			},
			
			orderReceiving(item){
				if(item.disabled) return;
				this.$emit('orderReceiving',item)
			},
			contactMe(item){
				this.$emit('contactMe',item)
			},
			
			confirmSubmit(){
				if(this.popupTitle!=='投诉'){
					//待确认可以更换师傅
					this.formData.offerId = this.masterObj.id;
					if((this.curIndex == this.reasonList.length-1) && !this.formData.replaceReason){
						this.$util.toast("请填写其他原因")
						return false
					}
					if(!this.formData.replaceReason){
						this.$util.toast("请选择更换原因")
						return false
					}
					this.$http.post('order/biz_order/publisher/replacePerson',this.formData)
					.then(res=>{
						if(res){
							this.$util.toast("更换成功");
							this.$emit('refresh')
							this.showReplacePopup = false;
						}else{
							this.$util.toast()
						}
					})
				}else{
					//投诉
					let param = {
						businessType: "order",
						businessCode: this.orderInfo.id,
						reason: this.formData.replaceReason,
						remark: this.remark,
						toName: this.masterObj.personInfo.name,
						toUserId: this.masterObj.personInfo.userId
					}
					this.$http.post("order/bizcomplaint",param).then(res => {
						if(res){
							this.$util.toast('已提交投诉')
							this.remark = ''
							this.showReplacePopup = false
						}
					})
				}
			},
			radioValue(data, index) {
				this.curIndex = index;
				// 换人接单操作
				this.formData.replaceReason = data.label
				this.curIndex = index;
				// 判断段其他原因清空
				if(this.curIndex == this.reasonList.length-1){
					this.formData.replaceReason = ''
				}
			},
			
			arousePopup(type){
				this.popupTitle = type
				const tempReason = type==='选择换人原因' ? 'change_person_reason' : 'complaint_reason'
				this.$httpApi.getDictByType({
					type: tempReason,
					cityOperatorId: this.orderInfo.cityOperatorId || ''
				}).then(res => {
					if(res){
						this.reasonList = res
						this.formData.replaceReason = this.reasonList[this.curIndex].label
					}
				})
				this.showReplacePopup = true
			},
			
			clearCur(){
				this.curIndex = 0
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top_nav{
		.left{
			.title{
				font-size: $fontSize30;
				font-family: PingFang SC;
				font-weight: bold;
				color: $mainFontColor14;
				margin-right: 16rpx;
			}
			.worker_state{
				font-size: $fontSize22;
				font-family: PingFang SC;
				font-weight: 500;
				color: $fontColor80;
			}
		}
	}
	.right_ent{
		.text{
			font-size: $fontSize22;
			font-family: PingFang SC;
			font-weight: bold;
			color: $fontColorPrice;
		}
		image{
			width: 7rpx;
			height: 13rpx;
			margin-left: 9rpx;
		}
	}
	.worker_view{
		.disabled_style{
			opacity: .4;
		}
		.worker_item{
			background: #FFFFFF;
			padding: 20rpx 0;
			&:first-child{
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
			}
			&:nth-last-child(1){
				border-bottom-left-radius: 20rpx;
            	border-bottom-right-radius: 20rpx;
			}
			border-bottom: 2rpx solid #F0F0F0;
		}
	}
	.open_btn{
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #F8F8F8;
		margin-top: 0rpx;
		border-radius: $miniBorderRadius;
		.btn_title{
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $fontColor80;
		}
		
		image{
			width: 14rpx;
			height: 8rpx;
			transition: all .2s;
			margin-left: 12rpx;
		}
	}

	.empty_view{
		text-align: center;
	}
	.empty{
		width: 400rpx;
		height: 300rpx;
		display: inline-block;
		margin-top: 87rpx;
	}
	.content-sku{
		.content-main{
			overflow: hidden;
			.content-main_res{
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				.radio{
					width: 25rpx;
					height: 25rpx;
					border-radius: 50%;
					border: 4rpx solid #BDBDBD;
					margin-right: 30rpx;
				}
				.radioSelect{
					border: 4rpx solid #FF5F00;
					position: relative;
					&::before{
						content:'';
						position: absolute;
						width: 15rpx;
						height: 15rpx;
						border-radius: 50%;
						background: #FF5F00;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
					}
				}
				.reason{
					color: #141414;
					font-size: 26rpx;
				}	
			}
		}
	}
	.display-center{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.display-left{
		display: flex;
		align-items: center;
	}
	.right_info {
		width: 100%;
		.top {
			.left {
				display: flex;
				.name {
					font-size: $middleFontSize;
					color: $mainFontColor14;
					font-family: PingFang SC;
					font-weight: bold;
					margin-right: 17rpx;
				}

				.skill_name {
					font-size: $fontSize22;
					color: $fontColorPrice;
					font-family: FZRuiZhengHei_GBK;
					font-weight: 800;
					display: inline-block;
					line-height: 34rpx;
					padding: 0 8rpx;
					text-align: center;
					border: 2rpx solid $fontColorPrice;
					border-radius: 6rpx;
				}
				.phone{
					width: 35rpx;
					height: 35rpx;
					margin-left: 20rpx;
				}
			}

			.right,
			.mode {
				text-align: right;
				font-size: $smallFontSize;
				color: $mainFontColor14;
				font-family: PingFang SC;
				font-weight: 500;

				.price {
					font-size: $fontSize36;
					color: $fontColorPrice;
					font-family: FZGDCTiS;
					font-weight: 500;
					margin-left: 6rpx;
				}
			}

			.see_btn {
				width: 111rpx;
				height: 38rpx;
				text-align: center;
				line-height: 36rpx;
				border: 1rpx solid #141414;
				border-radius: 6rpx;
				font-size: 21rpx;
				color: #141414;
			}
		}

		.middle {
			margin-top: 24rpx;

			.left {
				font-size: $smallFontSize;
				font-family: FZGDCTiS;
				font-weight: 500;
				color: $mainFontColor14;

				text {
					margin: 0 8rpx;
				}
			}

			.choice_worker {
				width: 100rpx;
				line-height: 43rpx;
				background: rgba(254, 110, 50, 0.05);
				border: 2rpx solid #FE6E32;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FE6E32;
				text-align: center;
			}

			.contact_worker {
				font-size: $fontSize22;
				font-family: PingFang SC;
				font-weight: 500;
				color: $mainFontColor14;

				.chat {
					width: 25rpx;
					height: 25rpx;
					display: inline-block;
					margin-right: 11rpx;
				}
			}
		}

		.text {
			font-size: $smallFontSize;
			color: $fontColor80;
			font-family: PingFang SC;
			font-weight: 500;
		}

		.bottom {
			margin-top: 17rpx;
		}
	}
	.left_avater {
		margin-right: 47rpx;
		position: relative;
		.ident_V {
			position: absolute;
			top: 0;
			right: -10rpx;
			font-size: 15rpx;
			font-family: FZRuiZhengHei_GBK;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			width: 38rpx;
			line-height: 24rpx;
			background: linear-gradient(90deg, #333333, #666666);
			border-radius: 10rpx 2rpx 10rpx 0rpx;
		}
	}
	.time-start{
		view{
			font-family: PingFang-SC;
		}
		.time-title{
			color: #000000;
			font-size: 28rpx;
			font-weight: bold;
			padding: 20rpx 0;
		}
		.time-date{
			color: #000000;
			font-size: 26rpx;
		}
	}
	.order-footer{
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100rpx;
		display: flex;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		.collect{
			// width: 200rpx;
			flex: 1;
			flex-shrink: 0;
			color: #141414;
			border-radius: 12rpx;
			border: 1px solid #141414;
			font-size: $middleFontSize;
			font-weight: bold;
			margin-right: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.send{
			flex: 1;
			background: #FE6E32;
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 10rpx;
			font-size: $middleFontSize;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	</style>