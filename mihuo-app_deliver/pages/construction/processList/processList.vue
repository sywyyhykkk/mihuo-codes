<template>
	<view class="processList-contain">
		<!-- <order-user-information :orderInfo="orderInfo"></order-user-information> -->
		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<process-item v-for="(item,index) in list" :key="index" :data="item"></process-item>
		<bottom-button title="查看操作记录" @click="submit" v-show="list.length !== 0" :buttonType="2"></bottom-button>
		<mh-empty v-show="list.length === 0" icon="/static/images/no_recommend.png" title="您还没有数据～～" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import {
		debounce
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				option: {},
				current: 1,
				shouqiShow: false,
				// 0 未开始 1 进行中 2 已完成
				projectId: '',
				list: [],
				colorList: [{
						status: 0,
						name: '未开始',
						color: '#FFFFFF',
						bgColor: 'linear-gradient(113.12deg, #FF3F40 -6.3%, #FFA4A4 91.92%)'
					},
					{
						status: 1,
						name: '进行中',
						color: '#FF5D35',
						bgColor: '#FAD0A0'
					},
					{
						status: 2,
						name: '已完成',
						color: '#10C57D',
						bgColor: '#D5FFEE'
					}
				]
			}
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getList()
		},
		onReachBottom() {

		},
		computed: {
			...mapState(['projectInfo','userPersonInfo','nodeInfo','orderInfo'])
		},
		methods: {
			getList() {
				this.projectId = this.projectInfo.projectId
				if (!this.projectId) {
					console.error('项目id不能为空')
					return
				}
				if (!this.userPersonInfo.skillId) {
					console.error('岗位id不能为空')
					return
				}
				this.$httpApi.getProcessList({
					projectId: this.projectId,
					skillId:this.userPersonInfo.skillId
				}).then(res => {
					if (res) {
						this.list = res
					}
				})
			},
			submit() {
				this.toPage(`/pages/construction/processList/operationRecords`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.process-list-contain {
		margin: 10rpx 20rpx 112rpx 20rpx;
		padding-bottom: 140rpx;

		.process-item {
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 36rpx 32rpx 34rpx 34rpx;
			margin-bottom: 6rpx;
			display: flex;

			&:last-child {
				margin-bottom: 0;
			}

			.left {
				display: flex;
				flex: 4;

				.information {
					padding-top: 8rpx;

					.title {
						font-weight: bold;
						font-size: 30rpx;
						color: $seconFontColor;
						margin-bottom: 8rpx;

					}

					.instructions {
						font-size: 26rpx;
						color: #909199;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 360rpx;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

				}

				.record-item-img {
					width: 132rpx;
					margin-right: 26rpx;
				}
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					display: flex;
					position: relative;

					image {
						position: absolute;
						right: 0;
						top: 10rpx;
						transform: rotate(-90deg);
					}
				}

				.title-text {
					font-size: 26rpx;
					color: #A7A7A7;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.item-status {
					width: 100rpx;
					font-size: 24rpx;
					// color: #FFFFFF;
					// background: linear-gradient(113.12deg, #FF3F40 -6.3%, #FFA4A4 91.92%);
					border-radius: 0px 20rpx 20rpx 20rpx;
					text-align: center;
					padding: 4rpx 0;
					margin-left: 10rpx;
				}

				image {
					width: 16rpx;
					height: 16rpx;
				}
			}

		}
	}


	.processList-contain {
		padding-bottom: 40rpx;
	}
</style>
