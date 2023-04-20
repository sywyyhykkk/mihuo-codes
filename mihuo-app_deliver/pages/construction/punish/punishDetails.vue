<template>
	<view class="content">
		<public-module></public-module>
		<view v-for="(item,index) in detailsList" :key="item.id">
			<view class="myself">
				<u-avatar class="avatar" size="48" :src="$util.avatarImage(item.newPerson && item.newPerson.userId)"
					v-if="item.newPerson && item.newPerson.userId" />
				<view class="name_time">{{item.newPerson && item.newPerson.name}}
					（{{item.newPerson && item.newPerson.skillName}}）
					{{item.created}}
					{{setTitle(item,index)}}
				</view>
			</view>
			<view :class="position !== 'R_PROJECT_MANAGER' ? 'problems_view' : ''">
				<view class="problems">
					<view class="label" v-if="index!==2">{{index===0?'处罚':'申述'}}原因</view>
					<text class="reason" v-if="index!==0">{{item.reason}}</text>
					<view v-if="item.forfeitLogList && item.forfeitLogList.length">
						<view class="title">{{item.created && item.created.slice(0,10)}}日巡检工地现场存在以下问题</view>
						<view class="reason_item" v-for="(m,i) in item.forfeitLogList" :key="index">
							<!-- <text class="number">{{$util.numberSort(i + 1)}}</text> -->
							<text class="reason">{{index+1+'.'+m.name}}</text>
							<view class="item_detail align-items">
								<view class="public">
									<text class="text">{{m.money || '-'}}</text><br />
									处罚金额
								</view>
								<view class="public">
									<text class="text">{{m.integral || '-'}}</text><br />
									处罚积分
								</view>
								<view class="public">
									<text class="text">{{m.day || '-'}}</text><br />
									禁单天数
								</view>
							</view>
						</view>
					</view>
					<view class="img_view" v-if="item.pics">
						<image-show :imgSrc="item.pics" width="172" height="172" />
					</view>
					<view v-if="item.applyType && item.audio">
						<journal-audio :formDate="item.audio" />
					</view>
					<view class="item_detail" v-if="item.forfeitLogList && item.forfeitLogList.length">
						<view class="total">总计</view>
						<view class="align-items">
							<view class="public">
								金额 <text class="text text2">{{item && item.total && item.total.totalMoney}} 元</text>
							</view>
							<view class="public">
								积分 <text class="text text2">{{item && item.total && item.total.totalIntegral}} 分</text>
							</view>
							<view class="public">
								禁单 <text class="text text2">{{item && item.total && item.total.totalDay}} 天</text>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
		<bottom-button title="去申述" @click="submit()" v-if="buttonShow" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				detailId: '',
				detailData: {},
				imageGlobal: this.$image.imageGlobal,
				buttonShow: false,
				position: '',
				detailsList: [],
				personId: ''
			}
		},

		onLoad(option) {
			this.detailId = Number(option.detailId)
		},

		onShow() {
			this.setParameter()
			this.getDetail(this.detailId)
		},
		computed: {
			...mapState(['userRole', 'userPersonInfo'])
		},

		methods: {
			setParameter() {
				this.position = this.userRole
				this.personId = this.userPersonInfo.personId
			},
			
			setTitle(item,index) {
				//0的时候发起了罚款 1的时候发起了申述 2的时候同意了申述 处理状态：0->已发起待处理 1->撤销 2->同意 3->驳回
				if (index==0) {
					return '发起罚款'
				} else if(index==1) {
					return '发起申述'
				}else if(index==2){
					if(item.status==0){
						return '发起申述'
					}else if(item.status==1){
						return '撤销申述'
					}else if(item.status==2){
						return '同意申述'
					}else if(item.status==3){
						return '拒绝申述'
					}
					
				}
			},
			setButtonShow() {
				// 被处罚人才可以去申述
				if (Number(this.personId) === Number(this.detailData.personId) && this.detailData.applyStatus === 0) {
					this.buttonShow = true
				}
			},
			getDetail(id) {
				this.detailsList = []
				this.$http.get(`order/bizorderforfeit/${id}`).then(res => {
					if (res) {
						this.detailsList.unshift({
							newPerson: res.dealPerson,
							...res
						});
						this.detailData = res;
						this.setButtonShow();
						this.getPleadDetails(this.detailId)
					}
				})
			},
			getPleadDetails(id) {
				this.$http.get("order/bizapply/getByBusinessId", {
					applyType: 5001,
					businessId: id
				}).then(res => {
					if (res) {
						this.detailsList.push({
							newPerson: res.person,
							reason: res.comment,
							...res
						});
						if (res && res.applyLogList.length) {
							let newList = res.applyLogList;
							newList.map(item => {
								item['created'] = item.dealTime;
								item['reason'] = item.contents;
								item['newPerson'] = item.person;
							});
							this.detailsList = this.detailsList.concat(newList);
						}
						this.detailsList = this.detailsList.map(item => {
							for (let key in item) {
								switch (key) {
									case 'audio':
										if (typeof item[key] === 'string') {
											item[key] = JSON.parse(item[key]);
										}
										break;
								}
							}
							return item
						})
						console.log(this.detailsList)
					}
				})
			},
			submit() {
				uni.setStorageSync('typeName', '申述')
				this.toPage(`/pages/construction/complaint/complaintForm?punishment=罚款&id=${this.detailData.id}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.content {
		margin: 36rpx 20rpx;
	}

	.myself {
		display: flex;
		align-items: center;

		.avatar {
			margin-right: 6rpx;
		}

		.name_time {
			font-size: 26rpx;
			color: #909199;
		}
	}

	.problems_view {
		margin-left: 24rpx;
		border-left: 2rpx dashed #C4C4C4;
		overflow: hidden;
	}

	.problems {
		// height: 653rpx;
		margin: 38rpx 0 36rpx 24rpx;
		padding: 31rpx 44rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.label {
			font-size: $middleFontSize;
			font-weight: bold;
			color: #46464E;
		}
		.reason {
			margin-left: 6rpx;
			font-size: 26rpx;
			color: #606166;
		}

		.title {
			margin-top: 10rpx;
			font-size: $smallFontSize;
			color: $viceFontColor;
		}

		.reason_item {
			margin-top: 24rpx;

			.number {
				margin-right: 6rpx;
				font-weight: bold;
				font-size: 20rpx;
				color: #909199;
			}

			.img_view {
				display: inline-block;
				width: 164rpx;
				height: 164rpx;
				margin: 22rpx 19rpx 19rpx 10rpx;
				border-radius: 10rpx;
			}
		}

		.item_detail {
			margin: 20rpx 0 0 10rpx;

			.total {
				font-weight: 400;
				font-size: $middleFontSize;
				color: $seconFontColor;
			}

			.public {
				text-align: center;
				font-size: 24rpx;
				color: #909199;
				margin-right: 17px;

				.text {
					text-align: center;
					margin-left: 4rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: $seconFontColor;
				}

				.text2 {
					color: #ff5d35;
				}
			}
		}

		.img_view {
			margin: 28rpx 0 44rpx 10rpx;
		}
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.align-items-left {
		display: flex;
		align-items: center;
	}
</style>
