<template>
	<view class="change">
		<z-nav-bar fontColor="#141414" bgColor="#F5F5F5">
			<view class="nav-bar-title" slot="default">变更记录</view>
			<!-- <view class="nav-bar-right" slot="right" @click="batchPay">批量支付</view> -->
		</z-nav-bar>
		<!-- <view class="change-header">
			<view class="change-header_content">
				<text>待付款</text>
				<text>{{ statisticMoney.pay_wait }}</text>
			</view>
			<view class="change-header_content">
				<text>已结算</text>
				<text>{{ statisticMoney.pay_finish }}</text>
			</view>
			<view class="change-header_content">
				<text>待退款</text>
				<text style="color:#141414">{{ statisticMoney.pay_back }}</text>
			</view>
		</view> -->
		<!-- <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="170" :topbar="true" :down="downOption" :up="upOption"
		@down="getMyhomeChangeList"> -->
		<view class="pay-change">
			<!-- <u-checkbox 
				class="checkbox" 
				style="width: 40rpx; height: 40rpx;"
				@change="selectNape(changeData)" 
				shape="circle"
				v-model="changeData.isBatch"
				:disabled="changeData.payStatus !=1 ">
			</u-checkbox> -->
			<view class="change-main">
				<view class="main-herder" @click="keepOn(changeData)">
					<view>{{ changeData.alterationReason }}</view>
					<text :class="changeData.payStatus =='0'?'pay-tips':'pay-tips_no'">
						{{ getPayStatusName(changeData.payStatus, (changeData.customerAlterationList && changeData.customerAlterationList.length)?changeData.customerAlterationList[0].status:'') }}
					</text>
						<!-- {{ changeData.payStatus =='-1'?'已撤销':changeData.payStatus =='0'?'待支付':changeData.payStatus =='0'?}} -->
				</view>
				<view v-if="(changeData.customerAlterationList && changeData.customerAlterationList.length)" :class="changeData.customerAlterationList[0].status == 0?'main-cneter_bg':'main-cneter_black'">
					<text>{{ Math.abs(changeData.alterationMoney) }}</text>
					<text>{{ changeData.customerAlterationList[0].status == 0?'元补款':'元退款'}}</text>
				</view>
				<view class="main-footer">
					<text v-if="changeData.payStatus=='0'" class="pay_no" @click="keepOn(changeData,'no')">拒绝</text>
					<text v-if="changeData.payStatus=='0' && changeData.customerAlterationList && changeData.customerAlterationList.length" class="pay_yes" @click="keepOn(changeData,'yes')">确认</text>
					<text v-if="changeData.payStatus=='1' && changeData.customerAlterationList && changeData.customerAlterationList.length && changeData.customerAlterationList[0].status == 0" class="pay_yes" @click="keepOn(changeData,'yes')">去支付</text>
					<!-- 退款项确认状态 -->
					<text v-if="changeData.payStatus=='1' && changeData.customerAlterationList && changeData.customerAlterationList.length && changeData.customerAlterationList[0].status == 1">已确认</text>
					<!-- 补款项支付状态 -->
					<text v-if="changeData.payStatus=='2'">已支付</text>
					<!-- 拒绝操作 -->
					<text v-if="changeData.payStatus=='3'">已拒绝</text>
				</view>
			</view>
		</view>
		<!-- <findMaster-mh-empty v-if="changeData.customerAlterationList && changeData.customerAlterationList.length === 0 "  title="暂无变更记录～～" /> -->
		<!-- <u-loadmore class="loadmore" v-else :status="status" /> -->
		<!-- </mescroll-uni> -->
		<myHome-mh-changeItemDetail v-model="isShow" :data="currentData" @refresh="getMyhomeChangeList" @keepOn="keepOn"></myHome-mh-changeItemDetail>
		<!-- 变更拒绝 -->
		<myHome-mh-modal-new v-model="show" @click="confirm()" @cancel="()=>show=false" :content="content"
			titleText="温馨提示" cancelText="取消" confirmText="确认">
		</myHome-mh-modal-new>
		<!-- 支付 -->
		<pay-popup v-model="isCollect" @callback="payConfirm" :money="finallyMoeny"></pay-popup>
	</view>
</template>

<script>


	export default {

		data() {
			return {
				status:'nomore',
				orderId:'',
				orderCode:'',
				pageObj:{
					current: 1,
					pageSize: 10,
					total: 0,
					pages: 0,
				},
				changeData:{},
				// 结算状态: 0->待支付，1->在线支付成功，2支付失败
				payStatus:[
					{
						code:0,
						name:'待支付'
					},
					{
						code:1,
						name:'已确认'
					},
					{
						code:2,
						name:'已支付'
					},
					{
						code:3,
						name:'已拒绝'
					},
				],
				statisticMoney:{
					pay_wait:0,		//待付款
					pay_finish:0,	//已结算
					pay_back:0		//待退款
				},
				isShow:false,
				currentData:{},		//单条变更项信息
				show:false,
				content:'',
				mescroll: null,
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					use: false,
					toTop: {
						src: ''
					},
					textNoMore: '',
					textColor: '#D2D2D2'
				},
				curArr:[],
				isCollect:false,
				finallyMoeny:0,
				option:{}
			}
		},
		onLoad(option){
			this.option = option;
		},
		onShow() {
			this.getMyhomeChangeList()
			this.isShow = false;
			// 避免局部刷新，初始状态赋空
			this.curArr= []
		},
		methods: {
			// selectNape(data){
			// 	let repeatArr=[];		//重复元素计算
			// 	this.curArr.push(data);
			// 	for (var i = 0; i < this.curArr.length; i++) {
			// 		if (this.curArr[i].id == data.id) {
			// 			repeatArr.push(data)
			// 		}
			// 	}
			// 	if((repeatArr.length)%2===0){
			// 		for (var i = 0; i < this.curArr.length; i++) {
			// 			if (this.curArr[i].id == data.id) {
			// 				this.curArr.splice(i,1);
			// 				i--
			// 			}
			// 		}
			// 	}else{
			// 		this.curArr = Array.from(new Set(this.curArr))
			// 	}
			// },
			// 批量支付
			batchPay(){
				this.finallyMoeny = 0
				if(this.curArr.length == 0){
					this.$util.toast('请选择批量操作的变更项')
					return false
				}
				this.curArr.map(v=>{
					this.finallyMoeny = this.$math.floatAdd(this.finallyMoeny,Number(v.alterationMoney))
				})

				if(this.finallyMoeny<=0){
					this.$util.toast('补款金额小于退款金额，请等待验收后退款')
					return false
				}
				this.isCollect = true
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 获取支付状态提示  status：0增项1减项
			getPayStatusName(payStatus,status){
				let name = ''
				this.payStatus.some((v,i)=>{
					if((v.code == payStatus) && payStatus == '0'){
						if(status == '0'){
							name = '待补款';
						}else{
							name = '待退款';
						}
						return name;
					}
					if((v.code == payStatus) && payStatus == '1'){
						name = '已确认';
						return name;
					}
					if((v.code == payStatus) && payStatus == '2'){
						if(status == '0'){
							name = '已补款';
						}else{
							name = '已退款';
						}
						return name;
					}
					if(v.code == payStatus){
						name = v.name;
						return name;
					}
				})
				return name;
				
			},
			//获取我的家sop节点变更
			getMyhomeChangeList(){
				let query = {
						id:this.option.itemId
					}
				uni.showLoading({
					mask:true
				});
				this.$http.get("order/bizorderalteration/alterationById?id=${this.option.itemId}",query).then(res=>{
					this.changeData = res;
					// this.getChangeMoney();
				}).finally(()=>{
					uni.hideLoading();
				})
			},
			
			// 获取变更金额统计
			getChangeMoney(){
				this.statisticMoney={
					pay_wait:0,		//待付款
					pay_finish:0,	//已结算
					pay_back:0		//待退款
				}
				this.$http.get(`order/bizorderalteration/getPayStatusCount/${this.option.itemId}`)
				.then(res=>{
					if(res && res.length){
						// 增项
						let addTerm = res.filter(v=>v.status == 0)
						if(addTerm && addTerm.length){
							addTerm.map(v=>{
								if(v.payStatus<2){
									this.statisticMoney.pay_wait = this.$math.floatAdd(this.statisticMoney.pay_wait,Number(v.num))
								}else{
									this.statisticMoney.pay_finish = this.$math.floatAdd(this.statisticMoney.pay_finish,Number(v.num))
								}
							})
						}
						// 减项
						let reduceTerm = res.filter(v=>v.status == 1)
						if(reduceTerm && reduceTerm.length){
							reduceTerm.map(v=>{
								if(v.payStatus<2){
									this.statisticMoney.pay_back = this.$math.floatAdd(this.statisticMoney.pay_back,Number(v.num))
								}else{
									this.statisticMoney.pay_finish = this.$math.floatAdd(this.statisticMoney.pay_finish,Number(v.num))
								}
							})
						}
					}
				}).finally(()=>{
					this.mescroll.endBySize(this.changeData.length,10, true);
				})
			},
			keepOn(data,type){
				this.currentData = data;
				if(data.customerAlterationList.length){
					// 拒绝操作
					if(type == 'no'){
						if(data.customerAlterationList[0].status == 0){
							this.content = `是否拒绝该补款项`
						}
						if(data.customerAlterationList[0].status == 1){
							this.content = `是否拒绝退款，此操作后将不会收到当前变更项退款`
						}
						uni.showModal({
							title: "确认操作",
							content: this.content,
							cancelText: "取消",
							confirmText: "确认",
							confirmColor: "#FE6E32",
							success: (res) => {
								if (res.confirm) {
									this.confirm()
								}
							},
						});
						return false
					}
					this.isShow = true;
				}
			},
			confirm(){
				this.$http.post('order/bizorderalteration/updateAlteration',{
					id:this.currentData.id,
					payStatus:3
				}).then(res=>{
					if(res){
						this.getMyhomeChangeList();
						uni.showToast({
							title:'拒绝操作成功',
							image:'@/pages-findMaster/static/icon/success.png'
						});
					}
				})
			},
			// 批量支付确认
			payConfirm(data) {
				let ids = [];
				let param ={}
				this.curArr.map(v=>{
					ids.push(v.id)
				})
				// #ifdef MP-WEIXIN
					this.$util.requestPay(3, ids, 'changeItem',()=>{this.isCollect = false})
				// #endif
				// #ifndef MP
					param = {
						payAmount: Math.abs(this.finallyMoeny),
						payType: data.payType,
						ids:ids,
					};
					if (data.payType === 3) {
						plus.share.getServices( res => {
								let sweixin = null;
								for (let i in res) {
									if (res[i].id == 'weixin') {
										sweixin = res[i];
									}
								}
								//唤醒微信小程序
								if (sweixin) {
									this.$util.requestPay(data.payType,ids,'changeItem',()=>{this.isCollect = false})
								}
							}
						);
					} else {
						uni.showLoading({
							mask:true
						});
						this.$http.post("order/customer/pay/alteration", param).then( res => {
							if (res && res.payInfo) {
								this.isCollect = false;
								this.$util.requestPay(data.payType,res.payInfo,'changeItem')
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
<style lang="scss">
page{
	background-color: #F5F5F5;
}
</style>
<style lang="scss" scoped>
.change{
	padding: 0 30rpx;
	box-sizing: border-box;
	.change-header{
		display: flex;
		height: 80rpx;
		align-items: center;
		.change-header_content{
			flex: 1;
			text-align: center;
			text{
				color: #141414;
				font-size: $smallFontSize;
				font-weight: Medium;
				font-family: PingFang-SC-Medium;
				&:last-child{
					color: #FE6E32;
					font-size: $mainFontSize;
					padding-left: 10rpx;
					font-family: Arial-BoldMT;
				}
			}
		}
	}
	.pay-change{
		display: flex;
		align-items: center;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.checkbox{
			margin-right: 30rpx;
		}
	}
	.change-main{
		flex: 1;
		color: #141414;
		border-radius: 24rpx;
		// margin-bottom: 20rpx;
		.main-herder{
			display: flex;
			view{
				font-size: $middleFontSize;
				flex: 1;
				@include toe();
				font-weight: bold;
				font-family: PingFang-SC-Bold;
			}
			.pay-tips_no{
				color: #808080;
				font-size: $smallFontSize;
				width: 200rpx;
				text-align: right;
				flex-shrink: 0;
			}
			.pay-tips{
				color: #141414;
				font-size: $smallFontSize;
				width: 200rpx;
				text-align: right;
				flex-shrink: 0;
			}
		}
		.main-cneter_bg{
			padding: 20rpx 0;
			text{
				color: #FE6E32;
				&:first-child{
					font-size: 44rpx;
					font-family: Arial-BoldMT;
				}
				&:last-child{
					font-size: 22rpx;
					font-weight: Heavy;
					margin-left: 10rpx;
					font-family: PingFang-SC-Heavy;
				}
			}
		}
		.main-cneter_black{
			padding: 20rpx 0;
			text{
				color: #141414;
				&:first-child{
					font-size: 44rpx;
					font-family: Arial-BoldMT;
				}
				&:last-child{
					font-size: 22rpx;
					font-weight: Heavy;
					margin-left: 10rpx;
					font-family: PingFang-SC-Heavy;
				}
			}
		}
		.main-footer{
			text-align: right;
			text{
				background: #E8E8E8;
				color: #808080;
				font-size: $smallFontSize;
				padding:20rpx 40rpx;
				border-radius: 40rpx;
				margin-left: 20rpx;
			}
			.pay_no{
				background: #FFFFFF;
				border:1rpx solid #CCCCCC;
			}
			.pay_yes{
				background: #141414;
				color: #FFFFFF;
			}
		}
	}
	.change-footer{
		height: 100rpx;
		width: 100%;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		display: flex;
		&>view{
			font-size: 26rpx;
			border-radius: 12rpx;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			font-weight: bold;
		}
		.footer-cus{
			color: #808080;
			background: #E6E6E6;
			width: 25%;
		}
		.footer-mas{
			color: #141414;
			border: 4rpx solid #141414;
			margin: 0 20rpx;
			width: 25%;
		}
		.footer-pay{
			background: #B1B1B1;
			color: #FFFFFF;
			width: 35%;
		}
	}
}
.nav-bar-title{
	font-weight: bold;
	color: #141414;
}
.nav-bar-right{
	color: #FE6E32;
	font-size: 28rpx;
	margin-right: 30rpx;
}
</style>
