<template>
	<view>
		<mihuo-tab class="tabs" @changeTab="changeTab" :current="current" :tabList="tabList" />
		<view v-if="demandList.length>0">
			<view class="mine-release-item" v-for="item in demandList" :key="item.id" @click="toDetail(item.id)">
				<view class="top-view">
					<view class="title">{{item.districtName+item.poiName+item.name}}</view>
					<view class="time display-center">
						<view class="sub-time">发布时间：{{setTime(item.created)}}</view>
						<view class="state">{{auditState(item.verifyStatus)}}</view>
					</view>
				</view>
				
				<!-- <view class="contact-view display-center">
					<view class="left" v-if="item.customerPhone">
						{{displayTel(item)}}
					</view>
					<view class="display-left" @click="callPhone(item)">
						<image class="call-icon" src="/static/images/mine/call.png" />
						<view class="label">免费拨打</view>
					</view>
				</view> -->
				
				<view class="display-left" v-if="item.status==1">
					<view class="btn-item" @click.stop="cancelOrder(item.id)">关闭订单</view>
					<view class="btn-item" @click.stop="editOrder(item)">修改订单</view>
				</view>
			</view>
			<u-loadmore :status="status" v-if="loadmoreShow" />
		</view>
		<mh-empty v-else title="您还没有数据～～" />
		
		<!-- 关闭订单原因弹窗 -->
		<sku-popup v-model="showPopup" title="关闭订单原因" height="60%" :styleObj="{background:'#fff'}">
			<view class="content-sku">
				<view class="content-main">
					<view class="content-main_res" @click="radioValue(item, index)"
						v-for="(item, index) in cancelOrderReasonList" :key="index">
						<view class="radio" :class="{ radioSelect: curIndex === index }"></view>
						<view class="reason">{{ item.label }}</view>
					</view>
					<!-- <textarea v-show="(cancelOrderReasonList.length-1) == curIndex"  placeholder-style="color:#808080" placeholder="请填写补充描述"
						style="width: 100%;height: 186rpx;padding: 24rpx 26rpx;margin-top: 24rpx;background: #F7F7F7;
							border-radius: 12rpx;font-size: 26rpx;" v-model="inputReason" /> -->
				</view>
				<view class="confirm">
					<view class="btn" @click="confirmCancel">确认关闭</view>
				</view>
			</view>
		</sku-popup>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default{
		data(){
			return{
				current: 0,
				inputReason: '',
				cancelReason: '',
				curIndex: 0,
				cancelOrderReasonList: [],
				showPopup: false,
				page:1,
				size:10,
				total:0,
				status:'loadmore',
				loadmoreShow: true,
				demandList:[],
				tabList:[{
					name: '已启用',
					value: 1,
				},{
					name: '已找到',
					value: 2,
				},{
					name: '已关闭',
					value: 0
				}]
			}
		},
		
		onShow(){
			this.getMineDemand()
		},
		
		onReachBottom() {
			if (this.demandList.length == this.total) {
				return;
			}
			this.status = "loading";
			setTimeout(() => {
				this.page = this.page + 1;
				this.getMineDemand()
			},1000)
		},
		
		methods:{
			toDetail(id){
				this.toPage(`/pages/demandMarket/demandDetails?id=${id}&pageType=mine`)
			},
			auditState(state){
				if(state==0){
					return '未审核'
				}else if(state==1){
					return '审核通过'
				}else if(state==2){
					return '审核不通过'
				}
			},
			changeTab(index) {
				this.demandList = []
				this.current = index
				this.getMineDemand()
			},
			// 编辑需求
			editOrder(item){
				this.toPage(`/pages/demandMarket/releaseDemand?demandInfo=${JSON.stringify(item)}`)
			},
			//取消需求
			confirmCancel(){
				this.$httpApi.demandCancel({
					id: this.canceId,
					reason: this.cancelReason
				}).then(res => {
					if(res){
						this.$util.toast('已关闭')
						this.showPopup = false
						this.getMineDemand()
					}
				})
			},
			//取消订单的原因
			getCancelReason() {
				this.$http.get('admin/dict/type', {
						type: 'demand_closed_cause'
					})
					.then((res) => {
						if (res) {
							this.cancelOrderReasonList = res
							this.cancelReason = res[0].label//默认第一个
						}
					})
			},
			radioValue(data, index) {
				this.cancelReason = data.label
				this.curIndex = index
				if(this.curIndex == this.cancelOrderReasonList.length-1){
					this.cancelReason = ''
				}
			},
			cancelOrder(id) {
				this.canceId = id
				this.showPopup = true
				this.getCancelReason()
			},
			//拨打电话
			callPhone(item){
				uni.makePhoneCall({
					phoneNumber: item.customerPhone
				});
			},
			displayTel(item){
				if(item.showPhone==1){
					return item.customerPhone
				}else if(item.showPhone==0){
					return item.customerPhone.replace(/(\d{3})\d{5}(\d{3})/,"$1*****$2")
				}
			},
			getMineDemand(status){
				this.$httpApi.getMineReleasePage({
					current: this.currentPersonPage,
					size: this.pageSize,
					status: this.tabList[this.current].value
				}).then(res => {
					this.total = res.total;
					if (res.records.length !== 0) {
						if (this.page == 1) {
							this.demandList = res.records;
						} else {
							this.demandList = this.demandList.concat(res.records);
						}
						if (this.page == res.pages) {
							this.loadmoreShow = false
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
					} else {
						this.status = "nomore";
					}
				})
			},
			setTime(time) {
				return moment(time).format('lll')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tabs{
		position: -webkit-sticky;
		position: sticky;
		width: 100%;
		top: 0;
		z-index: 99;
	}
	.mine-release-item{
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 12rpx;
		padding: 46rpx 52rpx 52rpx 36rpx;
	}
	.top-view {
		.title {
			font-size: 30rpx;
			color: #303133;
			@include bov(2);
		}
		.time {
			margin-top: 8rpx;
	
			.sub-time {
				font-size: 24rpx;
				color: #909199;
				margin-right: 10rpx;
			}
			.state{
				font-size: 26rpx;
				color: $lightErrorColor;
			}
		}
	}
	.contact-view{
		padding: 16rpx 0 24rpx;
		border-bottom: 2rpx solid #F6F6F6;
		.left{
			width: 340rpx;
			font-size: 28rpx;
			color: #606166;
			@include bov(2);
		}
		.call-icon{
			width: 28rpx;
			height: 28rpx;
			margin-right: 6rpx;
		}
		.label{
			font-size: 30rpx;
			color: $themeColor;
		}
	}
	.btn-item{
		padding: 10rpx 20rpx;
		margin: 30rpx 20rpx 0 0;
		border-radius: 10rpx;
		font-size: 26rpx;
		color: $themeColor;
		border: 2rpx solid $themeColor;
	}
	
	.content-sku {
		.content-main {
			height: 640rpx;
			overflow: hidden;
			.content-main_res {
				display: flex;
				align-items: center;
				margin-top: 40rpx;
	
				.radio {
					width: 25rpx;
					height: 25rpx;
					border-radius: 50%;
					border: 4rpx solid #bdbdbd;
					margin-right: 30rpx;
				}
	
				.radioSelect {
					border: 4rpx solid $themeColor;
					background: $themeColor;
					position: relative;
				}
	
				.reason {
					color: #141414;
					font-size: 26rpx;
				}
			}
		}
		.confirm{
			// width: 100vw;
			padding: 40rpx;
			background: #FFFFFF;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			@include safearea();
			z-index: 9999;
			
			.btn{
				line-height: 88rpx;
				text-align: center;
				font-size: 14px;
				color: $themeColor;
				border: 2rpx solid $themeColor;
				border-radius: 10rpx;
			}
		}
	}
	
	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.display-left {
		display: flex;
		align-items: center;
	}
</style>
