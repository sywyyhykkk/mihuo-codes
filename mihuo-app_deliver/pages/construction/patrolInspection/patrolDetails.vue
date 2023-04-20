<template>
	<view class="contener">
		<public-module></public-module>
		<view>
			<view class="parent_view">
				<text class="title">{{patrolData.title}}</text>
				<view class="user align-items-left">
					<u-avatar class="avatar" size="64" :src="$util.avatarImage(patrolData.person.userId,true)" v-if="patrolData.person" />
					<view class="name">
						{{patrolData.person && patrolData.person.name}}({{patrolData.person && patrolData.person.skillName}})
						{{patrolData.created && patrolData.created.substr(0,patrolData.created.length - 3)}}
					</view>
				</view>
				<text class="text">{{patrolData.content}}</text>
				<view v-if="patrolData.pics">
					<image-show :imgSrc="patrolData.pics" />
				</view>
				<view v-if="patrolData.audio">
					<journal-audio :formDate="JSON.parse(patrolData.audio)" />
				</view>
			</view>
			<view class="children_view" v-if="patrolData.customInspectList && patrolData.customInspectList.length">
				<view class="label">巡检问题</view>
				<view class="patrol_item" v-for="(item,index) in patrolData.customInspectList" :key="index">
					<view class="propblem">
						<view class="top align-items">
							<text class="left">问题{{$util.translateNumberToChinese(index + 1)}}</text>
							<text class="right" :class="setClass(item.abarbeitungStatus)" v-if="!item.resultDTOList.length">
								{{setState(item.abarbeitungStatus)}}
							</text>
						</view>
						<view class="contents">{{item.contents}}</view>
						<view v-if="item.pics" :style="!item.audio?'padding-bottom: 34rpx':''">
							<image-show :imgSrc="item.pics" width="76" height="76" />
						</view>
						<view v-if="item.audio">
							<journal-audio :formDate="JSON.parse(item.audio)" />
						</view>
					</view>

					<view v-if="item.resultDTOList && item.resultDTOList.length">
						<view class="punish_details" v-for="(item2,index) in item.resultDTOList" :key="index">
							<view class="problems" v-if="item2.detailList && item2.detailList.length">
								<view class="label2">罚款明细</view>
								<view class="reason_item" v-for="(em,ind) in item2.detailList" :key="em.id">
									<view class="number">
										<text class="reason">
											{{ind+1+'.'+em.name}}
											<text class="reason" v-show="em.remark !== null">({{em.remark}})</text>
										</text>
									</view>
									<view class="item_detail align-items">
										<view class="public">
											<text class="text">{{em.money || '-'}}</text><br/>
											处罚金额
										</view>
										<view class="public">
											<text class="text">{{em.integral || '-'}}</text><br/>
											处罚积分
										</view>
										<view class="public">
											<text class="text">{{em.day || '-'}}</text><br/>
											禁单天数
										</view>
										
									</view>
								</view>
								
								<view class="item_total">
									<view class="total">总计</view>
									<view class="item_detail">
										<view class="public">
											金额 <text class="text text2">{{item2.json.totalMoney}} 元</text>
										</view>
										<view class="public">
											积分 <text class="text text2">{{item2.json.totalIntegral}} 分</text>
										</view>
										<view class="public">
											禁单 <text class="text text2">{{item2.json.totalDay}} 天</text>
										</view>
									</view>
								</view>
							</view>
							<view class="person_liable">
								<text class="sublabel">责任人</text>
								<view class="liable_outermost">
									<view class="liable_view">
										<view class="liable_item" v-for="(m,d) in personList" :key="d">
											<u-avatar class="avatar" size="40" :src="$util.avatarImage(m.userId,true)" v-if="m.userId" />
											<text class="name">{{m.name}}({{m.skillName}})</text>
										</view>
									</view>
									<view class="open_btn" @click.stop="isOpen()">
										{{isShow?'收起':'展开'}}
										<image class="open_arrow" src="/static/icon/open_arrow.png" :style="isShow?'transform:rotate(90deg);':''">
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list: [],
				personList: [],
				isShow: true,
				patrolData:{},
				styleObj: {
					fontWeight: 'normal',
					label: '罚款明细'
				},
			}
		},
		
		onLoad(option) {
			const newId = Number(option.itemId)
			this.getPatrolDetail(newId)
		},
		
		methods:{
			isOpen(){
				this.isShow = !this.isShow
				if(!this.isShow){
					this.personList = this.list.slice(0,2)
				}else{
					this.personList = this.list
				}
			},
			setState(state){
				switch(state){
					case 0:
						return '未整改';
					break;
					case 1:
						return '已整改';
					break;
				}
			},
			setClass(state){
				switch(state){
					case 0:
						return 'fail';
					break;
					case 1:
						return 'normal';
					break;
					case 2:
						return 'success';
					break;
				}
			},
			getPatrolDetail(id){
				this.personList = []
				this.$http.get(`order/sopinspect/${id}`).then(res => {
					if(res){
						this.patrolData = res;
						res.customInspectList.map(item => {
							item.personList.some(v => {
								this.list.push(v)
							})
						})
						this.personList = this.list//默认展开
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.contener{
		margin: 10rpx 20rpx;
	}
	.parent_view{
		// height: 390rpx;
		padding: 36rpx 30rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		.title{
			font-weight: bold;
			font-size: 28rpx;
			color: #303133;
		}
		.user{
			margin-top: 7rpx;
			.avatar{
				margin: 14rpx 6rpx 14rpx 0;
			}
			.name{
				font-size: 24rpx;
				color: #909199
			}
		}
		.text{
			font-size: 26rpx;
			color: #303133;
		}
	}
	.children_view{
		.label{
			margin-left: 34rpx;
			line-height: 104rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #606166;
		}
		.patrol_item{
			// height: 393px;
			margin-bottom: 4rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			.propblem{
				margin: 0 40rpx 0 42rpx;
				padding-left: 10rpx;
				border-bottom: 2rpx dashed #EEEEEE;
				.top{
					padding: 20rpx 0 8rpx 0;
					.left{
						font-size: $middleFontSize;
						color: #303133;
					}
					.right{
						font-size: 22rpx;
					}
					.normal{
						color: $themeColor;
					}
					.success{
						color: #10BF78;
					}
					.fail{
						color: #FF5D35;
					}
				}
				.contents{
					font-size: 22rpx;
					line-height: 17px;
					color: #909199;
					margin-bottom: 14rpx;
				}
			}
			.punish_details{
				padding: 24rpx 52rpx 56rpx 52rpx;
				.person_liable{
					padding: 46rpx 0 0 18rpx;
					text{
						font-size: 28rpx;
					}
					.sublabel{
						font-weight: 700;
						font-size: 28rpx;
						color: #46464E;
					}
					.liable_outermost{
						display: flex;
						justify-content: space-between;
						.liable_view{
							width: 85%;
							display: flex;
							flex-wrap: wrap;
							.liable_item{
								width: 50%;
								display: flex;
								align-items: center;
								margin-top: 26rpx;
							}
							.name{
								color: #909199;
								margin-left: 10rpx;
							}
						}
						.open_btn{
							font-size: 12px;
							color: #A7A7A7;
							margin-top: 26rpx;
							.open_arrow{
								display: inline-block;
								width: 16rpx;
								height: 16rpx;
								margin-left: 8rpx;
								transition: all .2s;
							}
						}
					}
				}
			}
		}
	}
	.problems{
		.label2{
			font-size: $middleFontSize;
			color: $darkTitle;
		}
		.reason_item{
			padding: 0 18rpx 32rpx 18rpx;
			margin-top: 12rpx;
			.number{
				margin-right: 6rpx;
				padding-bottom: 10rpx;
				font-weight: bold;
				font-size: 20rpx;
				color: #909199;
				.reason{
					font-size: 26rpx;
					font-weight: normal;
					color: #606166;
				}
			}
		}
		.item_total{
			padding: 30rpx 0 30rpx 18rpx;
			border-top: 2rpx dashed #EEEEEE;
			border-bottom: 2rpx dashed #EEEEEE;
			.total{
				font-weight: 400;
				font-size: $middleFontSize;
				color: $seconFontColor;
			}
		}
		.item_detail{
			display: flex;
			justify-content: space-between;
			margin-top: 8rpx;
			.public{
				text-align: center;
				font-size: 24rpx;
				color: #909199;
				margin-right: 17px;
				.text{
					text-align: center;
					margin-left: 4rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: $seconFontColor;
				}
				.text2{
					color: #ff5d35;
				}
			}
		}
	}
	
	.align-items-left{
		display: flex;
		align-items: center;
	}
	.align-items{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
