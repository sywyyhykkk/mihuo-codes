<template>
	<view>
		<u-popup
		v-model="show"
		border-radius="14"
		@close="closePopup"
		mode="bottom"
		height="80%"
		>
			<view class="order">
				<view class="order-header">
					<u-icon name="close" @click="closePopup"></u-icon>
				</view>
				<view class="order-main" v-if="workerInfo.personInfo">
					<scroll-view scroll-y="true" style="height:100%">
						<view class="order-item">
							<view class="order-main-left">
								<u-avatar size="156" :src="$util.avatarImage(workerInfo.personInfo.userId)"
								 :workType="workerInfo.personInfo.skillId" v-if="workerInfo.personInfo.userId" />
								 <view class="level">V{{workerInfo.personInfo.level}}</view>
							</view>
							<view class="order-item-right">
								<view class="item-row">
									<text>{{workerInfo.personInfo.name}}</text>
									<text class="tag">{{workerInfo.personInfo.skillName}}</text>
								</view>
								<view class="item-row1">
									<view>{{workerInfo.personInfo.skillYearNum}}</view>
									<text>工作经验</text>
									<view>{{workerInfo.personInfo.evaluationRate || '100%'}}</view>
									<text>好评</text>
								</view>
								<!-- <view class="item-row2">人在昆明，随叫随到</view> -->
							</view>
						</view>
						<view class="order-price">
							{{workerInfo.bidPrice}}
							<text>{{ orderInfo.priceWay == 1?"元/一口价":"元/TA的报价" }}</text>
						</view>
						<view class="order-time">报价时间 {{workerInfo.created}}</view>
						<!-- <view class="order-change" @click="seeChangeData">
							<text>查看变更项目</text>
							<u-icon name="arrow-right" size="22" color="#808080"></u-icon>
						</view> -->
						<view class="order-list">
							<view class="title">报价说明</view>
							<view class="title tips">{{workerInfo.bidDescription || '暂无'}}</view>
							<view class="title" style="padding-top:40rpx">报价清单</view>
							<view v-if="workerInfo.groupPrices && workerInfo.groupPrices.length">
								<!-- 人工费 -->
								<view v-if="masterList && masterList.length">
									<view class="order-type">
										<view class="order-type_name">人工</view>
										<view class="order-type_num">总计：<text>{{ laborCost }}</text>元</view>
									</view>
									<view class="order-list_item" v-for="(item,index) in masterList" :key="index">
										<view class="order_top">
											<text class="item_skill">{{ item.businessName || '其他' }}</text>
											<text class="item_price">￥ {{item.totalAmount}}</text>
										</view>
										<view v-if="item.products.length">
											<view v-if="curArr.indexOf(item.id) != -1">
												<view v-for="(v,i) in item.products" :key="i">
													<view class="productJson" @click="toDetailPage(v)">
														<view class="item_list">
															<image :src="$util.thumbnailImage(v.productImg)" />
															<view class="link_title">{{ v.productName }}</view>
															<text>{{ v.price+'x'+v.budgetNum }}</text>
														</view>
														<view class="item_router">
															<view class="price">{{ $math.floatMul(Number(v.budgetNum),Number(v.price)) }}</view>
															<u-icon name="arrow-right" size="22" color="#808080"></u-icon>
														</view>
													</view>
													<!-- <view class="desc_price">
														<text>最低价格</text>
														<text>￥{{ $math.floatAdd((v.diffAmount || 0)+v.price)}}</text>
													</view> -->
												</view>
											</view>
											<view v-else>
												<view v-for="(v,i) in item.products.slice(0,1)" :key="i" class="productJson">
													<view class="item_list" @click="toDetailPage(v)">
														<image :src="$util.thumbnailImage(v.productImg)" />
														<view class="link_title">{{ v.productName }}</view>
														<text>{{ v.price+'x'+v.budgetNum }}</text>
													</view>
													<view class="item_collse" @click="collseMore(item,1)">
														<text>展开</text>
														<u-icon name="arrow-down" color="#FE6E32" size="22"></u-icon>
													</view>
												</view>
											</view>
											<view v-if="curArr.indexOf(item.id) != -1" class="item_collse" @click="collseMore(item,1)">
												<text>收起</text>
												<u-icon name="arrow-up" color="#FE6E32" size="22"></u-icon>
											</view>
										</view>
										<order-mh-empty v-else marginTop="50" size="150" title="暂无报价清单～～" />
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
											<text class="item_price">￥ {{ item.totalAmount }}</text>
										</view>
										<view v-if="item.products.length">
											<view v-if="curArr.indexOf(item.id) !== -1">
												<view v-for="(v,i) in item.products" :key="i">
													<view class="productJson" @click="toDetailPage(v)">
														<view class="item_list">
															<image :src="$util.thumbnailImage(v.productImg)" />
															<view class="link_title">{{ v.productName || '其他' }}</view>
															<text>{{ v.price+'x'+ v.budgetNum }}</text>
														</view>
														<view class="item_router" @click="toDetailPage(v)">
															<view class="price">{{ $math.floatMul(Number(v.budgetNum),Number(v.price)) }}</view>
															<u-icon name="arrow-right" size="22" color="#808080"></u-icon>
														</view>
													</view>
													<!-- <view class="desc_price">
														<text>最低价格</text>
														<text>￥{{ $math.floatAdd((v.diffAmount || 0)+v.price)}}</text>
													</view> -->
												</view>
											</view>
											<view v-else>
												<view v-for="(v,i) in item.products.slice(0,1)" :key="i" class="productJson">
													<view class="item_list" @click="toDetailPage(v)">
														<image :src="$util.thumbnailImage(v.productImg)" />
														<view class="link_title">{{ v.productName || '其他' }}</view>
														<text>{{ v.price +'x'+ v.budgetNum }}</text>
													</view>
													<view class="item_collse" @click="collseMore(item,2)">
														<text>展开</text>
														<u-icon name="arrow-down" color="#FE6E32" size="22"></u-icon>
													</view>
												</view>
											</view>
											<view v-if="curArr.indexOf(item.id) !== -1" class="item_collse" @click="collseMore(item,2)">
												<text>收起</text>
												<u-icon name="arrow-up" color="#FE6E32" size="22"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<view class="order-list_footer" v-if="this.workerInfo.groupPrices && this.workerInfo.groupPrices.length>0">
									<text class="list-total">共计{{ this.workerInfo.groupPrices.length }}个项目</text>
									<view class="list-momeny">
										<text>合计</text>
										<text>{{workerInfo.bidPrice}}</text>
										<text>元</text>
									</view>
								</view>
							</view>
							<order-mh-empty v-else marginTop="0" size="150" title="暂无报价清单～～" />
						</view>
						<bottom-button 
							v-if="orderInfo.orderStatus<20 && orderInfo.orderStatus != -1" 
							:title="orderInfo.priceWay==2?'确认选TA':'确认报价'" 
							:styleObj="{
								background:'#FE6E32'
							}"
							@click="choice"></bottom-button>
					</scroll-view>
				</view>
			</view>
		</u-popup>
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
			workerInfo: {
				type: Object,
				default:()=>({})
			},
			orderInfo: {
				type: Object,
				default: () => ({})
			},
		},
		watch:{
			value(news){
				this.show = news;
				if(news){
					if(this.workerInfo.groupPrices && this.workerInfo.groupPrices.length){
						this.masterList = this.workerInfo.groupPrices.filter(v=>v.businessType == 1)
						this.materialList = this.workerInfo.groupPrices.filter(v=>v.businessType == 2)
					}
				}
			},
		},
		data() {
			return {
				isOpen: false,
				show:false,
				isCollect:false,
				proAll:0,
				curArr:[],
				masterList:[],	//工人清单
				materialList:[],	//材料清单
			};
		},
		computed:{
			// 人工费合计
			laborCost(){
				let num = 0
				if(this.masterList && this.masterList.length){
					this.masterList.map(v=>{
						num = this.$math.floatAdd(num,Number(v.totalAmount))
					})
				}
				return num;
			},
			// 材料费合计
			materialCost(){
				let num = 0
				if(this.materialList && this.materialList.length){
					this.materialList.map(v=>{
						num = this.$math.floatAdd(num,Number(v.totalAmount))
					})
				}
				return num;
			},
		},
		methods: {
			setGroupPrice(){
				if(!this.isOpen){
					return JSON.parse(this.workerInfo.groupPrice.productJson).slice(0,3)
				}else{
					return JSON.parse(this.workerInfo.groupPrice.productJson)
				}
			},
			//展开收起
			setOpen(){
				this.isOpen = !this.isOpen
				this.setGroupPrice()
			},
			//发消息
			sendMessage(){
				let info = this.workerInfo.personInfo;
				this.$util.goToChat(info.userId,info.name,'constructionOrder');
			},
			//查看变更项目
			seeChangeData(){
				let url =''
				if(this.workerInfo.projectId && this.workerInfo.projectId >0){
					url =`/pages-findMaster/changeItemList?projectId=${this.workerInfo.projectId}`
				}else{
					url =`/pages-findMaster/changeItemList?orderId=${this.workerInfo.orderId}`
				}
				this.toPage(url)
			},
			choice(){
				this.$emit('confirmChoice')
			},
			closePopup(){
				this.show = false;
				this.$emit('input',false)
			},
			collseMore(data){
				let repeatArr=[];		//重复元素计算
				this.curArr.push(data.id);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i] == data.id) {
						repeatArr.push(data)
					}
				}
				if((repeatArr.length)%2===0){
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data.id) {
							this.curArr.splice(i,1);
							i--
						}
					}
				}else{
					this.curArr = Array.from(new Set(this.curArr))
				};
			},
			toDetailPage(data){
				this.toPage(`/pages-mall/productDetail/productDetail?id=${data.productId}`)
			}
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
		// background: #FE6E32;
		height: calc(100% - 50rpx);
		.order-item{
			display: flex;
			.order-main-left{
				position: relative;
				image{
					image-rendering: optimize-contrast;
					image-rendering: -webkit-optimize-contrast;
				}
				.portrait{
					width: 156rpx;
					height: 156rpx;
					border-radius: 50%;
				}
				.level{
					position: absolute;
					top: 10rpx;
					left: 130rpx;
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
			.order-item-right{
				margin-left: 40rpx;
				.item-row{
					display: flex;
					align-items: center;
					text{
						color: #141414;
						font-size: $mainFontSize;
						font-weight: bold;
					}
					.tag{
						color: #FE6E32;
						border-radius: 8rpx;
						border: 1px solid #FE6E32;
						font-size: 20rpx;
						margin-left: 10rpx;
						padding: 4rpx 10rpx;
					}
				}
				.item-row1{
					
					display: flex;
					align-items: center;
					view{
						color: #141414;
						font-size: $fontSize22;
						font-weight: Medium;
						padding: 20rpx 0;
					}
					text{
						color: #808080;
						font-size: $fontSize22;
						margin-right: 10rpx;
					}
				}
				.item-row2{
					color: #808080;
					font-size: $fontSize22;
				}
			}
		}
		.order-price{
			color: #FE6E32;
			font-size: 64rpx;
			font-weight: Medium;
			margin: 20rpx 0;
			text{
				color: #141414;
				font-size: $smallFontSize;
				padding-left: 10rpx;
			}
		}
		.order-time{
			color: #808080;
			font-size: $fontSize22;
			padding-bottom: 20rpx;
		}
		.order-change{
			padding: 40rpx 0;
			text{
				color: #808080;
				font-size: $fontSize22;
			}
			.u-icon{
				margin-left: 10rpx;
			}
		}
		.order-list{
			.title{
				color: #000000;
				font-size: $middleFontSize;
				font-weight: bold;
				padding-bottom: 20rpx;
			}
			.tips{
				font-weight:normal;
				border-bottom: 2rpx solid #DCDFE6;
				font-size: $fontSize26;
			}
			.material{
				margin-top: 20rpx;
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
				.item_router{
					display: flex;
					align-items: center;
				}
				.price{
					color: #808080;
					font-size: $smallFontSize;
				}
			}
			.item_collse{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				text{
					color: #FE6E32;
					font-size: 22rpx;
					margin-right: 5rpx;
				}
			}
		}
		.open_btn{
			height: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			// background: #F8F8F8;
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
		.order-list_footer{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 20rpx 0;
			padding-top: 10rpx;
			border-top: 2rpx solid #DCDFE6;
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
.productJson{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
	&:last-child{
		margin-bottom: 10rpx;	
	}
}
.desc_price{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	text{
		font-size: 24rpx;
		&:last-child{
			color: #FE6E32;
			padding-left: 10rpx;
			font-weight: bold;
		}
	}
}
.link_title{
	// border-bottom: 1rpx solid #141414;
	text-decoration:underline;
}
</style>