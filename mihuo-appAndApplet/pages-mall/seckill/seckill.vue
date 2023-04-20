<template>
	<view class="seckill">
		<z-nav-bar>
			<view class="nav-bar" slot="default">限时秒杀</view>
		</z-nav-bar>
		<view class="seckill-tabs">
			<scroll-view class="tabs" :scroll-x="true" :enable-flex="true">
				<view class="tabs-item flex-center">
					<div v-for="(item, index) in tabsList" :key="index" @click="change(item,index)"
					class="tabs-item_item" :class="{
						'active_1':currentTag === index && Date.parse(moment(item.start).format('YYYY-MM-DD')) === Date.parse(moment().format('YYYY-MM-DD')),
						'active_2':currentTag === index && Date.parse(moment(item.start).format('YYYY-MM-DD')) !== Date.parse(moment().format('YYYY-MM-DD')),
					}">
						<div class="tabs-item_label">{{ getTasName(item.end)}}</div>
						<span :class="'tabs-item_tips status_'+item.status ">
							{{ item.status == 1?'抢购中':item.status == 2?'即将开始':'已结束'}}
						</span>
					</div>
				</view>
			</scroll-view>
			<u-divider
				v-if="productList && productList.length"
				class="seckill-start_tips"
				fontSize="20"
				useSlot
				:color="getSeckillStatus(productList[0]) == 1?'#ED3832':'#000000'" 
				half-width="300" 
				:border-color="getSeckillStatus(productList[0]) == 1?'#ED3832':'#000000'">
				<view v-if="getSeckillStatus(productList[0]) == 1" fontSize="20" class="divider-text">
					距离结束还剩
					<u-count-down 
					:timestamp="timestamp"
					font-size="20" 
					color="#ED3832"
					separator-size='20'
					separator-color="#ED3832"
					></u-count-down>
				</view>
				<view style="font-size:20rpx" v-else-if="getSeckillStatus(productList[0]) == 2">{{moment(productList[0].startDate).format("HH:mm")}}准时开始</view>
				<view style="font-size:20rpx" v-else>已结束</view>
			</u-divider>
		</view>
		<view class="seckill-content" v-if="productList && productList.length">
			<view v-for="(item,index) in productList" :key="index" class="seckill-content_item flex-center">
				<image class="center-item_img" mode="aspectFill" :fade-show="false"
				:src="$util.thumbnailImage(item.productCoverImg, true)" />
				<view class="center-item_text">
					<view class="product_name">{{ item.productName }}</view>
					<view class="flex-center company">
						<image
							class="company_image"
							:src="$util.thumbnailImage(item.companyLogo, true)"
							mode="aspectFill"
						/>
						<text>{{ item.companyName }}</text>
					</view>
					<view class="flex-center price">
						<view class="price_price">
							<view class="price_new">
								<text>￥</text>
								<text style="font-size:30rpx">{{ Math.floor(item.flashPromotionPrice) || 0}}</text>
								<text >{{ item.flashPromotionPrice | priceFormat }}</text>
							</view>
							<view class="price_y">原价<text>￥{{item.skuPrice}}</text></view>
						</view>
						<view class="price_bottom" @click="snapUp(item)" v-if="getSeckillStatus(item) == 1">
							剩余{{ item.flashPromotionCount}}&nbsp;&nbsp;|<text>去抢购</text>
						</view>
						<view @click="remind(item,index)" :class="'remind remind_'+item.remindStatus" v-if="getSeckillStatus(item) == 2">
							{{ item.remindStatus==1?'取消提醒':'提醒我'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else marginTop="300" size="150" title="暂无限时秒杀～～" />
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	/**
	 * status: 1:抢购中 2:即将开始 3:已结束
	 */
	export default {
		data() {
			return {
				currentTag:0,
				tabsList:[
					{
						start: moment().format("YYYY-MM-DD HH:mm:ss"),
						end: moment().format("YYYY-MM-DD") + ' 23:59:59',
						status:3
					},
					{
						start: moment().add(1, 'days').format("YYYY-MM-DD") + ' 00:00:00',
						end: moment().add(1, 'days').format("YYYY-MM-DD") + ' 23:59:59',
						status:2
					},
					{
						start: moment().add(2, 'days').format("YYYY-MM-DD") + ' 00:00:00',
						end: moment().add(2, 'days').format("YYYY-MM-DD") + ' 23:59:59',
						status:2
					},
					{
						start: moment().add(3, 'days').format("YYYY-MM-DD") + ' 00:00:00',
						end: moment().add(3, 'days').format("YYYY-MM-DD") + ' 23:59:59',
						status:2
					},
				],
				moment:moment,
				curData:{},
				timestamp:0,
				productList:[],
				mySubscribe:[]
			}
		},
		onShow() {
			this.curData = this.tabsList[0];
			this.getMySubscrbe()
		},
		methods: {
			change(data,i){
				this.currentTag=i;
				this.curData = data
				this.getProductList()
			},
			// 返回tabs属性
			getTasName(d){
				var new_date = this.moment().format("YYYY-MM-DD");
				var date_date = this.moment(d).format("YYYY-MM-DD");
				if(Date.parse(date_date) === Date.parse(new_date)){
					return '今天抢'
				}else if(Date.parse(this.moment().add(1, 'days').format("YYYY-MM-DD")) === Date.parse(date_date)){
					return '明天抢'
				}else if(Date.parse(this.moment().add(2, 'days').format("YYYY-MM-DD")) === Date.parse(date_date)){
					return '后天抢'
				}else{
					return `${this.moment(d).format("MM.DD")}抢`
				}
			},
			getSeckillStatus(data){
				/**
				 * return 1:抢购中 2:即将开始 3:已结束
				 */
				var date1 = new Date();		//当前日期
				var start_date = new Date(data.startDate) 	//开始日期
				var end_date = new Date(data.endDate)	//结束日期
				if(Date.parse(start_date)<=Date.parse(date1) && Date.parse(end_date)>Date.parse(date1)){
					return 1
				}else if(Date.parse(start_date)>Date.parse(date1)){
					return 2
				}else{
					return 3
				}
			},
			// 获取商品列表
			getProductList(){
				this.$httpApi.getProductActivityPage({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					type:1,
					size:999,
					start_date: this.curData['start'],
					end_date: this.curData['end'],
				})
				.then(res=>{
					if(res.records && res.records.length){
						if(this.currentTag === 0) this.tabsList[0].status = this.getSeckillStatus(res.records[0])
						if(this.getSeckillStatus(res.records[0]) == 1){
							var date1 = new Date();
							var date2 = new Date(res.records[0].endDate);
							this.timestamp = (Date.parse(date2) - Date.parse(date1))/1000
						}
					}
					res.records.map(item=>{
						item.remindStatus=0
						let isSubscribe = this.mySubscribe.findIndex((v)=> item.promotionProductRelationId == v.promotionProductRelationId)
						if(isSubscribe !== -1){
							item.remindStatus = 1
						}
					})
					this.productList = res.records
				})
			},
			// 立即抢购
			snapUp(item){
				this.toPage(`/pages-mall/productDetail/productDetail?id=${item.productId}`)
			},
			/**
			 * remindStatus 0:未订阅 1：一订阅
			 */
			remind(data){
				// uni.getSetting({
				// 	withSubscriptions:true,
				// 	success:(res)=>{
				// 		console.log(res,"success")
				// 		// if(res.subscriptionsSetting.mainSwitch)
				// 		wx.requestSubscribeMessage({
				// 			tmplIds:['hhAbOOEt2rL0vUXKuaCGWI0ccFwE_LbV4LTBCYyPYxI'],
				// 			success:(res)=>{
				// 				console.log(res,"success")
				// 			},
				// 			fail:(res)=>{
				// 				console.log(res,"fail")
				// 			}
				// 		})
				// 	},
				// 	fail:(res)=>{
				// 		console.log(res,"失败")
				// 	}
				// })

				if(data.remindStatus && data.remindStatus == 1){
					this.unSubscribe(data)
				}else{
					// #ifdef APP-PLUS || H5
						this.subscribe(data)
					// #endif
					// #ifdef MP-WEIXIN
						let tempalteId = 'hhAbOOEt2rL0vUXKuaCGWI0ccFwE_LbV4LTBCYyPYxI'
						wx.requestSubscribeMessage({
							tmplIds:[tempalteId],
							success:(res)=>{
								if(res[tempalteId] == 'accept'){
									this.subscribe(data)
								}
							},
							fail:(res)=>{
								console.log(res,"fail")
							}
						})
					// #endif
				}
				
				
			},
			// 查询订阅
			getMySubscrbe(){
				this.$httpApi.seckillMySubscribe().then(res=>{
					if(res){
						this.mySubscribe = res 
						this.getProductList()
					}
				})
			},
			// 提醒
			subscribe(data){
				this.$httpApi.seckillSubscribe(data.promotionProductRelationId).then(res=>{
					if(res == 0){
						this.$util.toast("提醒成功")
						this.getMySubscrbe()
					}
				})
			},
			// 取消提醒
			unSubscribe(data){
				this.$httpApi.seckillUnSubscribe(data.promotionProductRelationId).then(res=>{
					if(res == 0){
						this.$util.toast("已取消提醒")
						this.getMySubscrbe()
					}
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.seckill{
	width: 100%;
	height: 100vh;
	.seckill-tabs{
		padding: 0 30rpx;
		.u-divider{
			padding-top: 10rpx;
		}
		.seckill-start_tips{
			::v-deep .u-divider-line{
				border-bottom: 1px dashed #e4e7ed;
			}
			.divider-text{
				font-size: 20rpx;
				color: #ED3832;
			}
			::v-deep.u-countdown{
				padding-left: 10rpx;
			}
		}
		.tabs-item_item{
			flex: 1;
			text-align: center;
			margin-right: 40rpx;
			&:last-child{
				margin-right: 0;
			}
			.tabs-item_label{
				font-size: 28rpx;
				color: #000;
				font-family: NotoSansHans-Regular;
				background: #F7F7F7;
				padding: 5rpx 15rpx;
				border-radius: 50rpx;
			}
			.tabs-item_tips{
				font-size: 20rpx;
				color: #999999;
				font-family: NotoSansHans-Medium;
				&.status_1{
					color: #ED3832;
				}
			}
			&.active_1{
				.tabs-item_label{
					background: #ED3832;
					color: #FFFFFF;
				}
			}
			&.active_2{
				.tabs-item_label{
					background: #000000;
					color: #FFFFFF;
				}
			}
		}
	}
	.seckill-content{
		height: calc(100% - 250rpx);
		overflow-y: auto;
		padding: 0 30rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.seckill-content_item{
			margin-bottom: 30rpx;
			&:first-child{
				margin-top: 20rpx;
			}
			.center-item_img{
				width: 260rpx;
				height: 260rpx;
				flex-shrink: 0;
				border-radius: 15rpx;
			}
			.center-item_text{
				padding-left: 20rpx;
				flex: 1;
				.product_name{
					font-family: NotoSansHans-Regular;
					font-size: 32rpx;
					color: #333333;
					@include bov(2);
				}
				.company{
					padding: 20rpx 0;
				}
				.company_image{
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}
				text{
					color: #000000;
					font-size: 16rpx;
				}
			}
			.price{
				justify-content: space-between;
				.price_new{
					text{
						font-size: 20rpx;
						color: #ED3832;
						font-family: NotoSansHans-Medium;
					}
				}
				.price_y{
					font-size: 20rpx;
					font-family: NotoSansHans-Medium;
					text{
						text-decoration:line-through
					}
				}
				.price_bottom{
					font-family: NotoSansHans-Regular;
					font-size: 20rpx;
					color: #FFFFFF;
					background: linear-gradient(to right,#FFB54D,#FF3A33 );
					padding:15rpx 20rpx;
					border-radius: 50rpx;
					text{
						font-size: 24rpx;
						color: #FFFFFF;
						margin-left: 10rpx;
					}
				}
				.remind{
					background: #000000;
					font-family: NotoSansHans-Regular;
					font-size: 24rpx;
					color: #FFFFFF;
					padding: 18rpx 34rpx;
					border-radius: 50rpx;
					border: 2rpx solid #000000;
					&.remind_1{
						color: #000;
						background: #FFFFFF;
					}
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
