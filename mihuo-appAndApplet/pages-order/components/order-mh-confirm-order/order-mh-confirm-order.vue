<template>
	<view>
		<!-- 打卡记录 -->
		<!-- <view class="btn-grounp">
			<view class="kf" @click="contactService">联系客服</view>
			<view class="detailed_buttom" v-if="orderInfo.orderStatus >= 30">
				<view @click="workdo('打卡记录')">
					<text class="title">打卡记录</text>
					<text class="badge" v-if="badge.punch_num">{{ badge.punch_num>100?'99+':badge.punch_num}}</text>
				</view>
				<view @click="workdo('服务日志')">
					<text class="title">服务日志</text>
					<text class="badge" v-if="badge.service_num">{{ badge.service_num>100?'99+':badge.service_num}}</text>
				</view>
			</view>
		</view> -->
		<!-- 子订单师傅信息 -->
		<!-- <view class="sub-order" v-if="subOrder && subOrder.length">
			<view class="sub-order_content" v-for="(v,i) in subOrder" :key="i">
				<u-avatar v-if="v.personInfo" class="avatar" size="70" :src="$util.avatarImage(v.personInfo.userId)"/>
				<view class="skill-name">{{ v.skillName }}</view>
				<view class="master-name">{{ v.personName }}</view>
				<view class="master-look" @click="look(v.orderId)">查看</view>
			</view>
		</view> -->
		<view>
			<view class="list-data" @click="toRoute('报价清单')">
				<view class="list-data_left">报价清单</view>
				<view class="list-data_center">
					<text class="center_col1">合计</text>
					<text class="center_col2 bold">{{ bidPrice || 0 }}</text>
					<text class="center_col3">元</text>
				</view>
				<view class="list-data_right">
					<text :class="'right_' + true">已确认</text>
					<u-icon name="arrow-right" color="#808080" size="18"></u-icon>
				</view>
			</view>
			<view class="list-data" @click="toRoute('风险确认')">
				<view class="list-data_left">风险确认</view>
				<view v-if="riskObj.riskNum > 0" class="felx-box">
					<view class="list-data_center">
						<text class="center_col2">共{{ riskObj.riskNum }}项风险请确认</text>
					</view>
					<view class="list-data_right">
						<text :class="'right_' + !riskObj.isCheck"
							>{{ riskObj.isCheck ? '待确认' : '已确认' }}</text>
						<u-icon name="arrow-right" color="#808080" size="18"></u-icon>
					</view>
				</view>
				<view class="list-data_center" v-else>
					<text class="center_col2">暂无风险</text>
				</view>
			</view>
			<view class="list-data">
				<view class="list-data_left">上门时间</view>
				<view class="list-data_center">
					<text class="center_col2">{{ orderInfo.expectDate || '' }}</text>
				</view>
			</view>
			<view class="list-data" @click="toRoute('施工时间')" v-if="masterObj.startDate && masterObj.endDate">
				<view class="list-data_left">施工时间</view>
				<view class="list-data_center">
					<text class="center_col2">{{ masterObj.startDate || '--' }} 至 {{ masterObj.endDate || '--' }} 
						共{{getDay(masterObj.startDate,masterObj.endDate)}}天</text>
				</view>
				<view class="list-data_right">
					<text :class="'right_time_' + masterObj.ownerConfirmStatus">{{ masterObj.ownerConfirmStatus == 0 ? '待确认' : '已确认'}}</text>
					<u-icon name="arrow-right" color="#808080" size="18"></u-icon>
				</view>
			</view>
			<view class="list-data" @click="toRoute('变更项')" v-if="changeInfo">
				<view class="list-data_left">变更项</view>
				<view class="list-data_center">
					<text class="center_col2">共{{ changeInfo.totalCount || 0 }}项变更</text>
				</view>
				<view class="list-data_right">
					<text :class="'right_' + changeInfo.unconfirmedCount">{{
            changeInfo.unconfirmedCount == 0 ? '已确认' : '待确认'
          }}</text>
					<u-icon name="arrow-right" color="#808080" size="18"></u-icon>
				</view>
			</view>
			<view class="list-data" @click="toRoute('验收报告')" v-if="orderInfo.orderStatus >=35">
				<view class="list-data_left">验收报告</view>
				<view class="list-data_center">
					<text class="center_col2">{{
            orderInfo.orderStatus > 35 ? '已验收' : '未验收'
          }}</text>
				</view>
				<view class="list-data_right">
					<u-icon name="arrow-right" color="#808080" size="18"></u-icon>
				</view>
			</view>
		</view>
		<!-- 查看报价清单 -->
		<mh-order-receiving v-model="choiceWorkerPopup" :orderInfo="orderInfo" :workerInfo="masterObj" />
		<!-- 施工时间 -->
		<order-mh-sku-popup v-model="popupShow" title="确认施工时间">
			<view class="display-left" v-if="masterObj.personInfo && masterObj.personInfo.skillId">
				<view class="left_avater display-left">
					<u-avatar class="avatar" size="132" :src="$util.avatarImage(masterObj.personInfo.userId)"
						v-if="masterObj.personInfo" />
					<view class="ident_V">V{{ masterObj.personInfo.level }}</view>
				</view>
				<view class="right_info">
					<view class="top display-center">
						<view class="left">
							<text class="name">{{ masterObj.personInfo.name }}</text>
							<text class="skill_name">{{
                masterObj.personInfo.skillName
              }}</text>
						</view>
					</view>
					<view class="middle display-center">
						<view class="left">
							{{ masterObj.personInfo.skillYearNum
              }}<text class="text">工作经验</text>{{ masterObj.personInfo.evaluationRate || '100%'
              }}<text class="text">好评</text>
						</view>
					</view>
					<view class="bottom text">专业{{ masterObj.personInfo.skillName }}，随叫随到</view>
				</view>
			</view>
			<view class="time-start">
				<view class="time-title">本次施工时间为</view>
				<view class="time-date">{{ masterObj.startDate || '--' }} 至
					{{ masterObj.endDate || '--' }} 共{{getDay(masterObj.startDate,masterObj.endDate)}}天
				</view>
			</view>
			<view class="order-footer">
				<view class="send" @click="confirmDate" v-if="masterObj.ownerConfirmStatus !=1">确认施工时间</view>
			</view>
		</order-mh-sku-popup>
		<!-- 风险确认 -->
		<order-mh-sku-popup v-model="popupRisk" title="此次施工风险确认" align="left" color="#FE6E32" size="32rpx">
			<view v-if="riskList.length" class="risk">
				<view v-for="(item, index) in riskList" :key="index" class="risk-item">
					<view class="risk-list">
						<view class="seq">{{ index + 1 > 10 ? index + 1 : '0' + (index + 1) }}、</view>
						<view class="name">{{ item.name }}</view>
						<view class="buttom" v-if="item.status == 0" @click="riskConfirm(item.id)">确认</view>
						<view class="buttom buttom_row" v-else>已确认</view>
					</view>
					<view class="image_show" v-if="item.attachments">
						<order-mh-image-show :imgSrc="item.attachments" width="100" height="100" right="20" />
					</view>
				</view>
			</view>
			<order-mh-empty v-else marginTop="100" size="200" title="暂无风险项～～" />
		</order-mh-sku-popup>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	

	export default {
		components: {
		
		},
		name: 'confirm-order',
		data() {
			return {
				choiceWorkerPopup: false,
				popupShow: false,
				popupRisk: false,
				riskList: [],
				changeInfo: {}, //变更信息
				checkLIstanbul: [], //验收信息
				riskObj: {
					isCheck: true, //是否有待确认风险项
					riskNum: 0 //风险项条数
				},
				moment: moment,
				badge:{
					punch_num:0,	//打卡次数
					service_num:0,	//服务次数
				}
			}
		},
		computed:{
			bidPrice(){
				let price = this.masterObj.groupPrices.reduce(function(total, value) {
					return this.$math.floatAdd(total,value.totalAmount)
				},0)
				return price
			}
		},
		props: {
			// 主订单信息
			orderInfo: {
				type: Object,
				default: () => {}
			},
			// 子订单接单师傅信息
			subOrder: {
				type: Array,
				default: () => []
			},
			masterObj: {
				type: Object,
				default: () => {}
			}
		},
		onShow() {},
		watch: {
			popupRisk(val) {
				if (val) {
					this.getRiskList()
				}
			}
		},
		mounted() {
			this.changeData()
			this.getRiskList()
		},
		methods: {
			workdo(name) {
				switch (name) {
					case '打卡记录':
						this.toPage(
							`/pages-order/punchInRecord?orderId=${this.masterObj.orderId}&orderCode=${this.masterObj.orderCode}&personId=${this.masterObj.personId}&projectId=${this.masterObj.projectId}`
						)
						break
					case '服务日志':
						this.toPage(
							`/pages-order/constructionLog?orderId=${this.masterObj.orderId}&orderCode=${this.masterObj.orderCode}&personId=${this.masterObj.personId}&projectId=${this.masterObj.projectId}`
						)
						break
					default:
						break
				}
			},
			
			look(id) {
				this.toPage(
					`/pages-order/constructionDetails?id=${this.orderInfo.id}&orderId=${id}`
				)
			},
			toRoute(type, data) {
				switch (type) {
					case '报价清单':
						this.choiceWorkerPopup = true
						break
					case '风险确认':
						if(this.riskObj.riskNum>0){
							this.popupRisk = true
						}
						break
					case '施工时间':
						this.popupShow = true
						break
					case '验收报告':
						this.toPage(
							`/pages-order/acceptance/acceptance-report?id=${this.orderInfo.id}`
						)
						break
					case '验收':
						this.toPage(
							`/pages-order/acceptance/acceptance-report-template?orderId=${data.orderId}&skillName=${data.skillName}&isDo=${true}`
						)
						break
					case '变更项':
						let url =''
						if(this.orderInfo.projectId && this.orderInfo.projectId >0){
							url =`/pages-findMaster/changeItemList?projectId=${this.orderInfo.projectId}`
						}else{
							url =`/pages-findMaster/changeItemList?orderId=${this.orderInfo.id}`
						}
						this.toPage(url)
						break

					default:
						break
				}
			},

			changeData() {
				let url = '';
				if(this.orderInfo.projectId && this.orderInfo.projectId > 0){
					url = `order/bizorderalteration/getAlterationUnconfirmedCount?projectId=${this.orderInfo.projectId}`
				}else{
					url = `order/bizorderalteration/getAlterationUnconfirmedCount?orderId=${this.orderInfo.id}`
				}
				this.$http.get(url).then((res) => {
					this.changeInfo = res
				})
			},
			// 获取风险项
			getRiskList() {
				this.$http
					.get(`order/biz_order/orderRisk/${this.orderInfo.id}`)
					.then((res) => {
						this.riskList = res
						this.riskObj.riskNum = res.length
						// 确认状态（0待确认，1已确认）
						let arr = res.filter((item) => item.status == 0)
						if (arr && arr.length) {
							this.riskObj.isCheck = true
						} else {
							this.riskObj.isCheck = false
						}
					})
			},
			// 确认风现象
			riskConfirm(id) {
				this.$http.get(`order/biz_order/doneRisk/${id}`).then((res) => {
					if (res) {
						this.$util.toast('确认成功');
						this.getRiskList();
						this.$emit('callback', this.masterObj.orderId)
					}
				})
			},
			// 确认施工时间
			confirmDate() {
				this.$http
					.get(
						`order/bidorder/ownerConfirmOffer?orderOfferId=${this.masterObj.id}`
					)
					.then((res) => {
						if (res) {
							this.popupShow = false
							this.$emit('callback', this.masterObj.orderId)
						}
					})
			},
			/** * 
			 * 计算时间天数
			 * 计算两个日期之间的天数 * @param start  
			 * 开始日期 yyyy-MM-dd * @param end  
			 * 结束日期 yyyy-MM-dd * 
			 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0 
			 *
			*/
			getDay(start,end){
				var arg1,arg2,startDate,endDate,times,days
				if(start && end){
					arg1 = start;
					arg2 = end;
				}else{
					arg1 = 1;
					arg2 = 0;
				}
				startDate = Date.parse(arg1);
				endDate = Date.parse(arg2);    
				if(startDate > endDate){
					return 0;   
				}    
				if(startDate == endDate){       
					return 1;   
				}
				times = this.$math.floatSub(endDate,startDate);
				days = this.$math.floatp(times,1*24*60*60*1000);  
					return  days + 1;
				}
		}
	}
</script>
<style lang="scss" scoped>
.btn-grounp{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 40rpx 0;
	.kf{
		color: #808080;
		font-size: 24rpx;
		font-weight: bold;
		font-family: PingFang-SC;
		background: #F7F7F7;
		padding: 20rpx 40rpx;
		border-radius: 12rpx;
	}
	.detailed_buttom{
		display: flex;
		justify-content: flex-end;
		view{
			color: #141414;
			font-size: 24rpx;
			font-weight: bold;
			border: 2rpx solid #141414;
			padding: 10rpx 20rpx;
			border-radius: 12rpx;
			position: relative;
			&:first-child{
				margin-right: 20rpx;
			}
			.title{
				color: #141414;
				font-size: 24rpx;
				font-weight: bold;
			}
			.badge{
				position: absolute;
				right: -10rpx;
				top: -10rpx;
				background: #FE6E32;
				font-size: 24rpx;
				color: #FFFFFF;
				padding:5rpx 10rpx;
				border-radius: 100rpx;
			}
		}
	}
}
.sub-order{
	padding-top: 5rpx;
	display: flex;
	flex-flow: row nowrap;
	overflow-x: auto;
	width: 690rpx;
	margin-bottom: 20rpx;
	.sub-order_content{
		margin: 0 10rpx 20rpx 10rpx;
		width: 180rpx;
		height: 240rpx;
		flex-shrink: 0;
		border-radius: 5rpx;
		box-shadow: #DCDFE6 0 0 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.skill-name{
			color: #141414;
			font-size: 22rpx;
			padding: 10rpx 0;
		}
		.master-name{
			color: #A8A8A8;
			font-size: 22rpx;
			padding-bottom: 10rpx;
		}
		.master-look{
			color: #141414;
			font-size: 20rpx;
			border-radius: 6rpx;
			border: 2rpx solid #141414;
			padding: 5rpx 10rpx;
		}
	}
}
.list-data{
	background: #FFFFFF;
	border-radius: 12rpx;
	padding: 30rpx;
	display: flex;
	margin-bottom: 20rpx;
	&:last-child{
		margin-bottom: 0;
	}
	.list-data_left{
		color: #000000;
		font-size: 28rpx;
		width: 150rpx;
	}
	.list-data_center{
		flex: 1;
		display: flex;
		align-items: center;
		text{
			color: #808080;
		}
		.center_col1{
			font-size: 22rpx;
			margin-right: 5rpx;
		}
		.center_col2{
			font-size: 28rpx;
		}
		.center_col3{
			font-size: 24rpx;
			color: #FE6E32;
			margin-left: 5rpx;
		}
		.bold{
			color: #FE6E32;
			font-weight: bold;
		}
	}
	.list-data_right{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-shrink: 0;
		text{
			background: #808080;
			border-radius: 10rpx 2rpx;
			padding: 5rpx 10rpx;
			font-size: 18rpx;
			color: #ffffff;
			margin-right: 10rpx;
			&.right_true{
				background: #FE6E32;
			}
			&.right_0{
				background: #FE6E32;
			}
			&.right_time_1{
				background: #FE6E32;
			}
		}
	}
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
		@include safearea();
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
			font-size: $middleFontSize;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	.risk{
		height: 100%;
		overflow: scroll;
		.risk-list{
			display: flex;
			align-items: center;
			padding-bottom: 20rpx;
			view{
				color: #000000;
				font-size: 28rpx;
			}
			.seq{
				white-space: nowrap;
			}
			.name{
				flex: 1;
			}
			.buttom{
				color: #FFFFFF;
				background: #FE6E32;
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				font-family: HuXiaoBo-NanShen;
				font-size: 24rpx;
				margin-left: 20rpx;
				white-space: nowrap;
				&.buttom_row{
					color: #FE6E32;
					background: transparent;
					padding: 10rpx 0;
				}
			}
		}
	}
	.felx-box{
		flex: 1;
		display: flex;
		justify-content: space-between;
	}
</style>