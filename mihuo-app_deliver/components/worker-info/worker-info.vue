<template>
	<view>
		<view class="top_nav display-center">
			<view class="left">
				<text class="title">师傅信息</text>
				<text class="worker_state">{{setWorkerState}}</text>
			</view>
			<view class="right_ent display-left" v-if="workerList && orderInfo.orderStatus===20&&workerList.length" @click="arousePopup('申请换人')">
				<text class="text">申请换人接单</text>
				<image src="/static/images/order_details/orange_right_arrow.png" />
			</view>
			<view class="right_ent display-left" v-if="orderInfo.orderStatus>30" @click="arousePopup('投诉')">
				<text class="text">投诉</text>
				<image src="/static/images/order_details/orange_right_arrow.png" />
			</view>
		</view>
		<view v-if="workerList && workerList.length">
			<view class="worker_view">
				<view class="worker_item" :class="!item.disabled?'disabled_style':item.disabled==='false'?'worker_item':''"
					v-for="(item,index) in workerList" :key="index">
					<view class="display-left" v-if="item.personInfo.skillId">
						<view class="left_avater display-left" @click="orderReceiving(item)">
							<u-avatar class="avatar" :workType="item.personInfo.skillId" size="132" :src="$util.avatarImage(item.personInfo.userId)" v-if="item.personInfo" />
							<view class="ident_V">V{{item.personInfo.level}}</view>
						</view>
						<view class="right_info">
							<view class="top display-center">
								<view class="left">
									<text class="name">{{item.personInfo.name}}</text>
									<text class="skill_name">{{item.personInfo.skillName}}</text>
								</view>
								<view class="right">
									{{orderInfo.priceWay===1?'一口价':orderInfo.priceWay===2?'竞价模式':orderInfo.priceWay===3?'快速呼叫':''}}
									<text class="price">{{item.bidPrice}}</text>元
								</view>
							</view>
							<view class="middle display-center">
								<view class="left">
									{{item.personInfo.skillYearNum}}<text class="text">工作经验</text>{{item.personInfo.evaluationRate || '100%'}}<text class="text">好评</text>
								</view>
								<view class="choice_worker" @click="orderReceiving(item)"
									v-if="orderInfo.orderStatus===10&&orderInfo.priceWay===2&&item.bidStatus!==3">
									选TA
								</view>
								<view class="contact_worker"  @click.stop="()=>$emit('contactMe',item)" v-else>
									<image src="/static/images/order_details/chat.png" class="chat" />
									联系我
								</view>
							</view>
							<view class="bottom text">专业{{item.personInfo.skillName}}，随叫随到</view>
						</view>
					</view>
					<!-- 清单入口 -->
					<view class="detailed_list display-center" v-if="JSON.parse(item.groupPrice?item.groupPrice.productJson:'[]').length">
						<view class="left_list display-left">
							<view class="list_item display-left" v-for="(item,index) in JSON.parse(item.groupPrice.productJson)" :key="index">
								<!-- <image src="/static/images/order_details/detailed.png" mode="" /> -->
								<image :src="$util.thumbnailImage(item.coverImg)" />
								<text>{{item.name}}</text>
							</view>
						</view>
						<view class="right_ent display-left" style="letter-spacing: 3rpx;" @click="orderReceiving(item)" >
							<text class="text">查看清单</text>
							<image src="/static/images/order_details/orange_right_arrow.png" mode="" />
						</view>
					</view>
				</view>
			</view>
			<view class="open_btn" @click="setOpen()">
				<view class="btn_title">{{isOpen?'收起':'展开'}}接单记录</view>
				<image src="/static/images/order_details/open_arrow.png" :style="isOpen?'transform:rotate(-180deg);':''" />
			</view>
		</view>
		<view class="empty_view" v-if="workerList">
			<mh-empty v-if="workerList&&workerList.length===0&&orderInfo.orderStatus!==-1" icon="/static/images/order_details/nobody_jd.png" size="200" marginTop="87" title="暂时没有师傅接单" />
			<mh-empty v-if="workerList&&workerList.length===0&&orderInfo.orderStatus===-1" icon="/static/images/order_details/order_close.png" size="200" marginTop="87" title="订单已关闭" />
			<image class="empty" v-if="workerList&&workerList.length!==0&&orderInfo.orderStatus===30" src="/static/images/order_details/in_service.png" />
		</view>
		
		
		<!-- 申请换人、投诉弹窗 -->
		<sku-popup v-model="showPopup" :title="popupTitle" @clearCur="clearCur">
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
		</sku-popup>
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
		},
		data(){
			return{
				popupTitle: '',
				remark: '',
				isOpen: false,
				workerList: [],
				tempList: [],
				showPopup: false,
				curIndex: 0,
				replacementReason: '',
				complaintReason: '',
				todo: '',
				reasonList: [],
				replacementReasonList: [{
					name: '师傅技能不专业，不对口'
				},{
					name: '报价协商未达成一致'
				},{
					name: '师傅工作时间不匹配'
				},{
					name: '其他原因'
				}],
				complaintReasonList: [],
				formData:{},
				reasonList: []
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
			setWorkerList(){
				this.tempList = this.workerInfo.offerList
				this.workerList = this.tempList&&this.tempList.map(item => {
					if(item.bidStatus<4){
						if(this.orderInfo.priceWay!=2){
							item['disabled'] = true
							return item
						}else{
							item['disabled'] = 'false'
							return item
							// this.workerList = this.workerInfo.offerList
						}
						
					}else if(item.bidStatus>=4){
						item['disabled'] = false
						return item
					}
				})
			},
			
			orderReceiving(item){
				if(!item.disabled) return;
				this.$emit('orderReceiving',item)
			},
			
			confirmSubmit(){
				if(this.orderInfo.orderStatus===10&&this.popupTitle!=='投诉师傅'){
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
							this.showPopup = false;
						}else{
							this.$util.toast()
						}
					})
				}else{
					//投诉
					let param = {
						businessType: "order",
						businessCode: this.orderInfo.id,
						reason: this.complaintReason,
						remark: this.remark,
						toName: this.masterObj.personInfo.name,
						toUserId: this.masterObj.personInfo.userId
					}
					this.$http.post("order/bizcomplaint",param).then(res => {
						if(res){
							this.$util.toast('已提交投诉')
							this.remark = ''
							this.showPopup = false
						}
					})
				}
			},
			radioValue(data, index) {
				this.replacementReason = data.label;
				this.complaintReason = data.label;
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
				this.$http.get("admin/dict/type",{
					type: tempReason
				}).then(res => {
					if(res){
						this.reasonList = res
						this.replacementReason = this.reasonList[this.curIndex].label
						this.complaintReason = this.reasonList[this.curIndex].label
					}
				})
				this.showPopup = true
			},
			
			clearCur(){
				this.curIndex = 0
			},
			
			//展开收起
			setOpen(){
				this.isOpen = !this.isOpen
				if(!this.isOpen){
					this.workerList = this.workerInfo.offerList.slice(0,1)
				}else{
					this.workerList = this.workerInfo.offerList
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top_nav{
		margin: 57rpx 0 18rpx;
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
			&:nth-last-child(1){
				border: none;
			}
			padding: 40rpx 0;
			border-bottom: 1rpx solid $fontColor80;
			.left_avater{
				margin-right: 47rpx;
				position: relative;
				.ident_V{
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
			.right_info{
				width: 100%;
				.top{
					.left{
						.name{
							font-size: $middleFontSize;
							color: $mainFontColor14;
							font-family: PingFang SC;
							font-weight: bold;
							margin-right: 17rpx;
						}
						.skill_name{
							font-size: $fontSize22;
							color: $fontColorPrice;
							font-family: FZRuiZhengHei_GBK;
							font-weight: 800;
							display: inline-block;
							line-height: 34rpx;
							padding: 0 8rpx;
							text-align: center;
							border: 2rpx solid $fontColorPrice;
							border-radius: $smallBorderRadius;
						}
					}
					.right{
						text-align: right;
						font-size: $smallFontSize;
						color: $mainFontColor14;
						font-family: PingFang SC;
						font-weight: 500;
						.price{
							font-size: $fontSize36;
							color: $fontColorPrice;
							font-family: FZGDCTiS;
							font-weight: 500;
							margin-left: 6rpx;
						}
					}
				}
				.middle{
					margin-top: 24rpx;
					.left{
						font-size: $smallFontSize;
						font-family: FZGDCTiS;
						font-weight: 500;
						color: $mainFontColor14;
						text{
							margin: 0 8rpx;
						}
					}
					.choice_worker{
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
					.contact_worker{
						font-size: $fontSize22;
						font-family: PingFang SC;
						font-weight: 500;
						color: $mainFontColor14;
						.chat{
							width: 25rpx;
							height: 25rpx;
							display: inline-block;
							margin-right: 11rpx;
						}
					}
				}
				.text{
					font-size: $smallFontSize;
					color: $fontColor80;
					font-family: PingFang SC;
					font-weight: 500;
				}
				
				.bottom{
					margin-top: 17rpx;
				}
			}
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
	.detailed_list{
		margin-top: 30rpx;
		.left_list{
			width: 360rpx;
			overflow: hidden;
			.list_item{
				margin-right: 30rpx;
				text{
					width: 115rpx;
					font-size: $fontSize22;
					font-family: PingFang SC;
					font-weight: 500;
					color: $fontColor00;
					@include toe();
				}
				image{
					width: 30rpx;
					height: 30rpx;
					margin-right: 12rpx;
					border-radius: 4rpx;
				}
			}
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
</style>
