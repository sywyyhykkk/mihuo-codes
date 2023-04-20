<template>
	<view>
		<u-popup
		v-model="show"
		border-radius="14"
		@close="closePopup"
		mode="bottom"
		height="80%"
		:safe-area-inset-bottom="true"
		>
			<view class="contact">
				<view class="contact-header">
					<u-icon name="close" size="24" @click="closePopup"></u-icon>
				</view>
				<view class="contact-main">
					<scroll-view scroll-y="true" style="height:100%;">
						<view class="contact-main_header">
							<u-avatar class="portrait" size="156" v-if="introduce.workerUserId" :src="$util.avatarImage(introduce.workerUserId)" />
							<text class="level">V{{ introduce.workerLevel || 1 }}</text>
						</view>
						<view class="main-content">
							<view>{{ introduce.workerName }}</view>
							<view style="display: flex;align-items: center;">
								<text>{{ explainInfo.skillName }}</text>
								<text>
									明星级
									<u-icon name="arrow-right" size="22" color="#E96363"></u-icon>
								</text>
							</view>
						</view>
						<!-- 师傅简介 -->
						<view v-if="introduce.workerDesc" class="workerDes">{{ introduce.workerDesc }}</view>
						<!-- 师傅标签 -->
						<view class="master-tag" v-if="evaluateTags">
							<text v-for="(item,index) in evaluateTags" :key="index">{{ item }}</text>
						</view>
						<view class="introduce">
							<view>
								<text>{{ introduce.workerWorkYear || 0 }}</text>
								<text>从业年限</text>
							</view>
							<view>
								<text>{{ introduce.workerServiceCount || 0}}</text>
								<text>累计服务（次）</text>
							</view>
							<view>
								<text>{{ introduce.workerLikeCount || 0 }}</text>
								<text>业主点赞（次）</text>
							</view>
						</view>
						<!-- <view class="qualifications">
							<view class="qualifications-box">
								<view>
									<image src="https://www.51mihuo.com/static/icon/work_type/zhenshu.png">
								</view>
								<text>培训证书</text>
							</view>
							<view class="qualifications-box">
								<view>
									<image src="https://www.51mihuo.com/static/icon/work_type/zhenshu.png">
								</view>
								<text>培训证书</text>
							</view>
						</view> -->
						<view class="evaluate">
							<view class="evaluate-title">客户评价</view>
							<view class="evaluate-content">
								<view class="evaluate-content_img">
									<mihuo-image class="image" src="https://www.51mihuo.com/static/icon/work_type/evaluate.png" />
									<view class="ll">{{ introduce.workerGoodRate || 100 }}<text>%</text></view>
									<view class="pj">好评率</view>
								</view>
								<view class="evaluate-content_info">
									<view class="rate">
										<u-rate active-color="#FE6E32" inactive-color="#D9D9D9" :current="introduce.workerGoodScore?introduce.workerGoodScore:5" :disabled="true"></u-rate>
										<text>{{ introduce.workerGoodScore || 5 }}分</text>
									</view>
									<view class="tag" v-if="introduce&& introduce.tagArr">
										<view v-for="(item,index) in introduce.tagArr" :key="index">
											<text>{{item.name}}</text>
											<text>{{item.value}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="card" v-if="introduce.replyList && introduce.replyList.length">
							<view v-for="(item,index) in introduce.replyList" :key="index" style="padding-top:10rpx">
								<view class="card_title">{{ item.title}}</view>
								<view class="card_time">{{ item.createTime + item.address}}</view>
								<view class="card_content">{{ item.content }}</view>
								<image class="image" src="https://www.51mihuo.com/static/icon/work_type/yh.png"
									mode="scaleToFill"
								/>
							</view>
						</view>
						<mh-empty marginTop="0" style="padding-top:40rpx" v-else size="200" title="暂无评价信息~~" />
						<view class="empty">
							- · THE END · -
						</view>
					</scroll-view>
				</view>
				<view class="contact-footer">
					<view class="collect" @click="collection">
						<image class="collect_image" :src="isCollect?'https://www.51mihuo.com/static/icon/work_type/collected.png':'https://www.51mihuo.com/static/icon/work_type/collect.png'" />
						<view class="title">{{isCollect?'已收藏':"收藏"}}</view>
					</view>
					<view class="send" @click="send">发消息</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"contact-me",
		props:{
			value:{
				type:Boolean,
				default:false
			},
			data:{
				type:[Object,Array],
				default:{}
			},
			orderId:{
				type:[Number,String],
				default:0
			}
		},
		watch:{
			value(news){
				this.show = news;
			},
			data:{
				handler(news){
					if(news){
						this.explainInfo = news;
						if(this.explainInfo && this.value){
							this.getMasterInfo()
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
				explainInfo:{},
				introduce:{},	//师傅介绍信息
				evaluateTags:[]
			};
		},
		methods: {
			closePopup(){
				this.show = false;
				this.$emit('input',false)
			},
			getMasterInfo(){
				let tagArr=[];
				this.$http.get('order/capp/bizorderreply/getReplyDetail',{
					personId:this.explainInfo.personId
				}).then((res)=>{
					if(res){
						if(res.labelStatistics){
							for (let key in res.labelStatistics) {
								let obj = {};
								obj.name = key;
								obj.value = res.labelStatistics[key]
								tagArr.push(obj)
							}
						}
						res.tagArr = tagArr
						this.introduce = res;
						this.getEvalTags();
						this.getCollectionList()
					}
				})
			},
			// 获取工人对应工种标签
			getEvalTags(){
				this.$http.get('admin/sysjobskill/getPlatformJobSkill',{
					type: '',
					clientType: "platform"
				}).then(res=>{
					if(res){
						res.some((v)=>{
							if(v.skillId == this.explainInfo.skillId ){
								this.evaluateTags = (v.label).split(',')
								return true
							}
						})
					}
            	})
			},
			// 判断是否被收藏
			getCollectionList(){
				this.$http.get('mall/customer/case/caseLike/isCaseLike',{
					id: this.explainInfo.personId,
					operation:7
				}).then(res=>{
					if(res){
						this.isCollect = true;
					}
				})
			},
			// 收藏师傅
			collection(){
				let prams = {
					id:this.explainInfo.personId
				}
				let title = ''
				if(this.isCollect){
					prams.operation = 8;
					title = '取消收藏成功'
				}else{
					prams.operation = 7;
					title = '收藏成功'
				}
				this.$http.post('mall/customer/case/setProjectCase',prams)
				.then(res=>{
					if(res){
						this.$util.toast(title)
						if(this.isCollect){
							this.$emit('cancel')
						}
						this.isCollect =!this.isCollect;
					}
				})
			},
			send(){
				this.$util.goToChat(this.introduce.workerUserId, this.introduce.workerName,'constructionOrder',this.explainInfo.orderId);
			}
		},
	}
</script>

<style lang="scss" scoped>
.contact{
	height: 100%;
	padding:20rpx 0;
	margin: 0 30rpx;
	box-sizing: border-box;
	position: relative;
	.contact-header{
		display: flex;
		justify-content: flex-end;
		height: 40rpx;
	}
	.contact-main{
		height: calc(100% - 140rpx);
		.contact-main_header{
			position: relative;
			.portrait{
				image-rendering: optimize-contrast;
        		image-rendering: -webkit-optimize-contrast;
				width: 156rpx;
				height: 156rpx;
				border-radius: 50%;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.level{
				width: 40rpx;
				line-height: 24rpx;
				position: absolute;
				top: 10rpx;
				left: 130rpx;
				color: #FFFFFF;
				font-weight: ExtraBold;
				font-family: FZRUIZHK_DA--GBK1-0;
				background: #FE6E32;
				padding: 5rpx;
				font-size: 18rpx;
				text-align: center;
				border-top-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
			}
		}
		.main-content{
			display: flex;
			padding: 20rpx 0;
			align-items: center;
			view{
				color: #141414;
				font-size: 42rpx;
				font-weight: Heavy;
				font-family: PingFang-SC-Heavy;
			}
			text{
				color: #FE6E32;
				border-radius: 12rpx;
				border: 1rpx solid #E96363;
				margin-left: 20rpx;
				font-size: $smallFontSize;
				font-weight: ExtraBold;
				padding: 5rpx 10rpx;
				font-family: CKTKingKong;
			}
		}
		.workerDes{
			color: #808080;
			font-size: 24rpx;
			padding: 10rpx 0;
			font-family: PingFang-SC-Medium;
		}
		.master-tag{
			display: flex;
			flex-flow: row wrap;
			margin: 10rpx 0;
			text{
				background: #FFF8F5;
				border-radius: 6rpx;
				color: #FE6E32;
				font-size: 20rpx;
				padding: 15rpx;
				margin-right: 20rpx;
				margin-top: 10rpx;
				font-family: PingFang-SC-Medium;
			}
		}
		.introduce{
			display: flex;
			margin-top: 10rpx;
			view{
				flex: 1;
				display: flex;
				flex-flow: column wrap;
				text{
					padding-top: 10rpx;
					&:first-child{
						color: #141414;
						font-size: 38rpx;
						font-weight: bold;
						font-family: Arial-BoldMT;
					}
					&:last-child{
						color: #808080;
						font-size: 24rpx;
						font-family: PingFang-SC-Medium;
					}
				}
			}
		}
		.qualifications{
			display: flex;
			flex-flow: row wrap;
			.qualifications-box{
				text-align: center;
				margin-top: 20rpx;
				width: 250rpx;
				margin-right: 20rpx;
				view{
					height:170rpx;
					width: 250rpx;
					background: #F8F8F8;
					padding: 20rpx;
					image{
						height: 100%;
						width: 100%;
						image-rendering: optimize-contrast;
        				image-rendering: -webkit-optimize-contrast;
					}
				}
				text{
					color: #808080;
					font-size: 22rpx;
				}
			}
		}
		.evaluate{
			margin-top: 40rpx;
			.evaluate-title{
				color: $mainFontColor14;
				font-weight: bold;
				font-size: 34rpx;
				font-family: PingFang-SC-Bold;
			}
			.evaluate-content{
				display: flex;
				margin-top: 40rpx;
				.evaluate-content_img{
					width: 160rpx;
					height: 160rpx;
					flex-shrink: 0;
					position: relative;
					.image{
						width: 100%;
						height: 100%;
					}
					.ll{
						color: #FE6E32;
						font-size: 40rpx;
						position: absolute;
						top: 40rpx;
						left: 50%;
						transform: translateX(-50%);
						font-weight: bold;
						font-family: Arial-BoldMT;
						text{
							color: $mainFontColor14;
							font-size: $smallFontSize;
							padding-left: 10rpx;
						}
					}
					.pj{
						color: $mainFontColor14;
						font-size: $smallFontSize;
						position: absolute;
						bottom: 30rpx;
						text-align: center;
						width: 100%;
						font-family: PingFang-SC-Medium;
					}
				}
				.evaluate-content_info{
					flex: 1;
					padding-left: 40rpx;
					.rate{
						display: flex;
						align-items: center;
						text{
							color: #FE6E32;
							font-size: $fontSize22;
							padding-left: 20rpx;
							font-family: PingFang-SC-Heavy;
						}
					}
					.tag{
						display: flex;
						flex-flow: row wrap;
						view{
							background: #F8F8F8;
							border-radius: 8rpx;
							padding: 0 10rpx;
							margin-right: 20rpx;
							margin-top: 20rpx;
							text{
								color: #666666;
								font-size: $fontSize22;
								&:last-child{
									padding-left: 20rpx;
								}
							}
						}
					}
				}
			}
		}
		.card{
			margin-top: 30rpx;
			background: linear-gradient(#FFFFFF, #F8F8F8);
			padding: 40rpx;
			position: relative;
			view{
				padding-top: 10rpx;
			}
			.card_title{
				font-size: $fontSize30;
				color: #141414;
				font-family: PingFang-SC-Heavy;
			}
			.card_time{
				color: #808080;
				font-size: $smallFontSize;
				font-family: PingFang-SC-Medium;
			}
			.card_content{
				color: #666666;
				font-size: $fontSize26;
				font-family: PingFang-SC-Medium;
			}
			.image{
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				top: 40rpx;
				right: 0;
			}
		}
		.empty{
			color: #333333;
			font-size: 18rpx;
			font-weight: bold;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}
	}
	.contact-footer{
		position: absolute;
		bottom: calc(env(safe-area-inset-bottom) + 10rpx);
		right: 0;
		left: 0;
		height: 100rpx;
		display: flex;
		padding: 10rpx 0;
		box-sizing: border-box;
		.collect{
			width: 80rpx;
			flex-shrink: 0;
			.collect_image{
				width: 40rpx;
				height: 40rpx;
				image-rendering: optimize-contrast;
        		image-rendering: -webkit-optimize-contrast;
			}
			.title{
				color: #141414;
				font-size: 18rpx;
				font-weight: bold;
				padding-top: 10rpx;
			}
		}
		.send{
			flex: 1;
			background: #424242;
			border-radius: 12rpx;
			color: #FFFFFF;
			font-size: $middleFontSize;
			font-weight: ExtraBold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>