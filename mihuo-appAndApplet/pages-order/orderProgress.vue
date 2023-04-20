<template>
	<view>
		<view class="progress">
			<!-- 师傅信息 -->
			<view class="progress-master">
				<view class="progress-master_title">师傅信息</view>
				<view v-if="personInfo.length">
					<view class="master-content" v-for="(item,index) in personInfo" :key="index">
						<view class="left_avater display-left">
							<u-avatar class="avatar" v-if="item.avatar" size="132" :src="$util.thumbnailImage(item.avatar,true)"  />
							<view class="ident_V">V{{item.level}}</view>
						</view>
						<view class="right_info ">
							<view class="top display-center">
								<view class="left">
									<text class="name">{{item.name}}</text>
									<text class="skill_name">{{item.skillName}}</text>
									<image @click="callPhone(item.phone)" src="https://www.51mihuo.com/static/icon/work_type/phone.png" class="phone" />
								</view>
							</view>
							<view class="middle display-center">
								<view class="left">
									{{item.skillYearNum}}<text class="text">工作经验</text>{{item.evaluationRate || '100%'}}<text class="text">好评</text>
								</view>
								<view class="contact_worker"  @click="contactWork(item)">
									<image src="https://www.51mihuo.com/static/images/order_details/chat.png" class="chat" />
									联系我
								</view>
							</view>
							<view class="bottom text">专业{{item.skillName}}，随叫随到</view>
						</view>
					</view>
				</view>
			    <order-mh-empty v-else marginTop="0" size="200" style="padding-top:100rpx" icon="https://www.51mihuo.com/static/images/no_recommend.png" title="暂无师傅信息" />
			</view>
			<!-- 服务进度 -->
			<view class="progress-master" v-if="this.mode == 1">
				<view class="progress-master_title">服务进度</view>
				<view v-if="progressInfo.length">
					<view class="master-progress" v-for="(item,index) in progressInfo" :key="index">
						<view class="progress-left">
							<text>{{ (index + 1 >=10)?index + 1 : '0'+(index +1)}}.</text>
							<view>{{ item.nodeName }}</view>
						</view>
						<view :class="'progress-right progress-right_'+ item.status">{{item.status==0?'未开始':item.status==2?'执行中':item.status==3?'已完成':''}}</view>
					</view>
				</view>
			    <order-mh-empty v-else marginTop="0" size="200" style="padding-top:100rpx" icon="https://www.51mihuo.com/static/images/no_recommend.png" title="暂无服务进度" />
			</view>
			<!-- 验收报告 -->
			<view class="progress-report" v-if="this.mode ==2">
				<order-mh-acceptance-report :checkedData="checkedData" />
			</view>
		</view>
		<bottom-button v-if="this.mode ==2 && checkedData" title="确认验收" @click="()=>checkShow=true" 
			:styleObj="{
				background: '#FE6E32'
			}"
		></bottom-button>
		<!-- 联系师傅 -->
		<order-mh-contact-me v-model="contactPopup" :data="contactInfo"></order-mh-contact-me>
		<!-- 确认验收 -->
		<order-mh-check-popup v-model="checkShow" title="服务已经完成了吗？" @confirmChecked="confirm" :checkedData="checkedData" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curProjectId:'',
				curOrderId:'',
				personInfo:[],
				contactPopup:false,
				contactInfo:{},
				checkedData:{},
				progressInfo:[],
				mode:'',
				options:{},
				checkShow:false
			}
		},
		onLoad(options) {
			this.curProjectId = options.projectId;
			this.curOrderId = options.orderId;
			if(options.projectId){
				this.mode = 1	//代表sop订单
				// TODO sop交付验收
				this.getPersonInfo();
				this.getProgressInfo()
			}else{
				this.mode = 2	//服务订单
				this.getCheckedData()
			}
		},
		onShow() {
			
		},
		methods: {
			// 获取人员信息
			async getPersonInfo(){
				let res = await this.$http.get(`order/project/member?projectId=${this.curProjectId}`)
				if (res) {
					this.personInfo = res;
					
				}
			},
			// 任务进度查询
			getProgressInfo(){
				this.$http.get(`order/project/projectNode/list/${this.curProjectId}`).then(res=>{
					if (res) {
						this.progressInfo = res;
					}
				})
			},
			callPhone(phone){
				uni.makePhoneCall({
					phoneNumber:phone
				})
			},
			//联系师傅
			contactWork(data) {
				this.contactInfo = data
				this.contactPopup = true
			},
			//获取验收报告
			getCheckedData() {
				this.$http
					.get('order/customer/bizorderacceptance/getByOrderId', {
						orderId: this.curOrderId
					})
					.then((res) => {
						if(res && res.length){
							this.checkedData = res[0]
						}
					})
			},
			// 确认验收
			confirm(){
				this.$http
					.post('order/customer/bizorderacceptance/editStatus', {
						statusFlag: 1,
						id: Number(this.curOrderId)
					})
					.then((res) => {
						if (res) {
							uni.showToast({
								title: '已确认验收',
								icon: 'none'
							})
							this.checkShow = false;
							this.toPage(`/pages-order/orderDetails?id=${this.options.id}&companyName=${this.options.companyName}`)
						}
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
.progress{
	margin: 20rpx 30rpx;
	.progress-report{
		background: #ffffff;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
	}
	.progress-master{
		background: #ffffff;
		padding: 0rpx;
		margin-bottom: 20rpx;
		.progress-master_title{
			color: #141414;
			font-size: 30rpx;
			font-weight: bold;
			font-family: PingFang SC;
		}
		.master-progress{
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			justify-content: space-between;
			border-bottom:1rpx solid #F7F7F7;
			&:first-child{
				padding-top: 30rpx;
			}
			&:last-child{
				border-bottom:none;
			}
			.progress-left{
				display: flex;
				align-items: center;
				text{
					font-size: $middleFontSize;
					color: #808080;
				}
				view{
					font-size: $middleFontSize;
					color: #141414;
					margin-left: 10rpx;
				}
			}
			.progress-right{
				font-size: $fontSize22;
				color: #FE6E32;
				background: #FFF0EA;
				padding: 6rpx 15rpx;
				border-radius: 30rpx;
				&.progress-right_0{
					color: #909199;
					background: #E8E8E8;
				}
				// &.progress-right_2{
				// 	color: #909199;
				// 	background: #E8E8E8;
				// }
			}
		}
		.master-content{
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			&:first-child{
				margin-top: 30rpx;
			}
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
						display: flex;
						align-items: center;
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
						.phone{
							width: 35rpx;
							height: 35rpx;
							margin-left: 20rpx;
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
}
.buttom{
	position: fixed;
	bottom: 0;
	right: 10px;
	left: 10px;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FE6E32;
	color: #FFFFFF;
}
.display-left{
	display: flex;
	align-items: center;
}
.display-center{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
