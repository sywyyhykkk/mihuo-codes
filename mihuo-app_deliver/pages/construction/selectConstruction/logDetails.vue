<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.log-details {
		padding-bottom: 100rpx;
	}


	.public-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.public-align-center {
		display: flex;
		align-items: center;
	}

	.public-justify-center {
		display: flex;
		justify-content: center;
	}

	.public-text {
		color: #3D3D3D;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 38rpx;
	}

	.top {
		margin: 10rpx 20rpx;
		padding: 10rpx 30rpx;

		.time {
			margin-left: 10rpx;
			color: #002FA5;
			font-size: 24rpx;
		}

		.item-user {
			margin-top: 6rpx;
		}

		.item-text {
			font-size: 24rpx;
			color: #909199;
			margin-left: 6rpx;
			line-height: 32rpx;
		}
	}

	.time-contain {
		margin: 10rpx 20rpx;
		padding: 30rpx 40rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.time-top {
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;
		}

		.item-label {
			color: #606166;
			font-size: 26rpx;
			margin-top: 2rpx;
		}

		.user-list {
			margin-top: 4rpx;

			.item-user_contain {
				margin-right: 20rpx;

				&:last-child {
					margin-right: 0rpx;
				}

				.name {
					color: #606166;
					font-size: 26rpx;
					margin-left: 4rpx;
				}
			}
		}

	}

	.work-contain {
		margin: 10rpx 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;

		.item-work {
			border-bottom: 2rpx solid #f5f5f5;
		}


		.work-top {
			padding: 30rpx 40rpx;

			&:nth-of-type(1) {
				padding: 30rpx 40rpx 0rpx 40rpx;
			}
		}
	}

	.image-show {
		padding-left: 40rpx;
		margin-top: 20rpx;
	}

	.list {
		margin-top: 20rpx;

		.item-list-other {
			display: flex;
			align-items: center;
		}

		.item-list {
			margin-bottom: 14rpx;


			&:last-child {
				margin-bottom: 0rpx;
			}

			.item-desc {
				color: #303133;
				font-size: 28rpx;
				line-height: 38rpx;
				max-width: 510rpx;
			}

			.item-status {
				width: 100rpx;
				font-size: 24rpx;
				border-radius: 20rpx;
				text-align: center;
				padding: 4rpx 0;
				margin-left: 10rpx;
			}
		}
	}

	.supplement-contain {
		margin: 10rpx 20rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 30rpx 0rpx;

		.item-desc {
			margin-bottom: 20rpx;
		}

		.image-show_item {
			padding-left: 40rpx;
		}
	}

	.padding-left_right {
		padding: 0 40rpx;
	}

	.desc-cotain {
		padding: 0 40rpx 20rpx 40rpx;
		color: #303133;
		font-size: 26rpx;
	}

	.desc-cotain-other {
		color: #303133;
		font-size: 26rpx;
		padding: 20rpx 0rpx 0rpx 0rpx;
	}

	.image-show-other {
		margin-top: 20rpx;
	}
</style>

<template>
	<view class="log-details">
		<view class="top">
			<view class="item-top">
				<text class="public-text">{{details.stageName}}</text>
				<text class="time">施工第{{details.workingStart || 0}}天，预计还需{{details.workingEnd || 0}}天完成</text>
			</view>
			<view class="item-user public-align-center">
				<u-avatar class="avatar" size="32" :src="$util.avatarImage(details.person && details.person.userId)" />
				<text
					class="item-text">{{details.person && details.person.name}}({{details.person && details.person.skillName}}){{details.created && details.created.substring(0,16)}}提交</text>
			</view>
		</view>

		<view class="time-contain">
			<view class="time-top">
				<text class="public-text">施工时间</text>
				<text class="item-label">{{details.workingTime && details.workingTime.substring(0,11)}}</text>
			</view>
			<view class="time-bottom" v-if="details.persons && details.persons.length > 0">
				<text class="public-text">施工人员</text>
				<view class="user-list public-align-center">
					<view class="item-user_contain public-align-center" v-for="(item,index) in details.persons"
						:key="index">
						<u-avatar v-if="item" class="avatar" size="32" :src="$util.avatarImage(item.userId)" />
						<text v-if="item" class="name">{{item.name}}({{item.skillName}})</text>
					</view>
				</view>
			</view>
		</view>

		<view class="work-contain">
			<view class="item-work">
				<view class="work-top">
					<text class="public-text">今日施工内容</text>
					<view class="list">
						<view class="item-list item-list-other" v-for="(item,index) in details.detailList" :key="index">
							<text class="item-desc">{{item.name}}</text>
							<view class="item-status"
								:style="{ color: getStatus(item.status,'color'),background:getStatus(item.status,'bg')}">
								{{getStatus(item.status,'text')}}
							</view>
						</view>
					</view>
				</view>
				<view class="image-show">
					<image-show :key="details.pic" :imgSrc="details.pic" width="144" height="144" />
				</view>
				<view class="desc-cotain" v-if="details.desc">
					{{details.desc}}
				</view>
			</view>
			<view class="work-top" v-if="details.futures && details.futures.length > 0">
				<text class="public-text">明日施工计划</text>
				<view class="list">
					<view class="item-list" v-for="(item,index) in details.futures" :key="index">
						<text class="item-desc">{{item.name}}</text>
					</view>
				</view>
				<view class="image-show-other">
					<image-show :key="details.futurePic" :imgSrc="details.futurePic" width="144" height="144" />
				</view>
				<view class="desc-cotain-other" v-if="details.futureDesc">
					{{details.futureDesc}}
				</view>
			</view>
		</view>
		<view class="supplement-contain" v-if="details.supplementaryContent && details.supplementaryContent.length > 0">
			<view class="supplement-top">
				<view class="public-text padding-left_right">补充内容</view>
				<view class="list">
					<view class="item-list" v-for="(item,index) in details.supplementaryContent" :key="index">
						<view class="item-desc padding-left_right">{{index+1}}.{{item.name}}</view>
						<view class="image-show_item">
							<image-show :imgSrc="item.pic" width="144" height="144" :enable="true"
								quantityPerLine="4" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				option: {},
				details: {},
				stageName: '',
				personList: [],
				workUserList: [],
				colorList: [{
						status: 0,
						// name: '未开工',
						// color: '#FF5D35',
						// bgColor: '#FEF1E3'
						name: '',
						color: '',
						bgColor: ''
					},
					{
						status: 1,
						name: '施工中',
						color: '#002FA5',
						bgColor: '#E5EAF6'
					},
					{
						status: 2,
						name: '已完工',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				],
			}
		},
		computed: {
			...mapState(['orderInfo']),
		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.viewDetails()
		},
		methods: {
			viewDetails() {
				this.$httpApi.viewDetails({
					id: this.option.id
				}).then(res => {
					if (res) {
						if (this.$isJSON(res.supplementaryContent)) {
							res.supplementaryContent = JSON.parse(res.supplementaryContent)
						}
						if (this.$isJSON(res.futures)) {
							res.futures = JSON.parse(res.futures)
						}
						this.details = res
						
						this.workUserList.push(res.person)
						this.getGroupTask()
					}
				})
			},
			getGroupTask() {
				if (!this.orderInfo.skillId) {
					return
				}
				this.$httpApi.getServiceStageList({
					cityOperatorId: uni.getStorageSync('cityOperatorId'),
					skillId: this.orderInfo.skillId
				}).then(res => {
					if (res) {
						res.forEach((item, index) => {
							if (this.details.stageId == item.id) {
								this.stageName = item.stageName // '请选择当前阶段'
							}
						})
					}
				})
			},
			getStatus(status, typeName) {
				switch (typeName) {
					case 'text':
						return this.colorList.find(item => item.status === status).name
					case 'color':
						return this.colorList.find(item => item.status === status).color
					case 'bg':
						return this.colorList.find(item => item.status === status).bgColor
				}

			},
			setInitializeUser() {
				if (this.listUser.length === 0) {
					return
				}
				this.$getPersonIdUser(this.listUser, (res) => {
					this.list.map((el) => {
						res.map((item) => {
							if (Number(el.execPersonId) === Number(item.personId)) {
								el['execPersonIdAll'] = item
							}
						})
					})
				})
			},
		}
	}
</script>
