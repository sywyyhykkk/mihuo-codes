<template>
	<view class="service">
		<view class="service-content" v-if="projectStage && projectStage.length">
			<view class="service-title">阶段进度</view>
			<view class="content-item" v-for="(item,index) in projectStage" :key="index">
				<view class="content-item_tree">
					<view class="item-tree_node">
						<view :class="'item-tree_node-flex parent status status_'+item.status">
							<view>{{item.projectStageName}}</view>
							<view>{{ getStatusName(item.status)}}</view>
						</view>
						<view v-show="item.totalDay">{{item.totalDay}}天</view>
					</view>
					<view v-for="(item1,index1) in item.nodes" :key="index1">
						<view class="content-item_tree">
							<view class="item-tree_node item-tree_node-lable children">
								<view class="item-tree_node-flex">
									<view :class="'status_'+ item1.status">{{item1.nodeName}}</view>
									<view class="item-tree_node-flex" v-if="item1.status==2">
										<u-avatar class="avatar" size="40" :src="$util.avatarImage(item1.executeUserId)"
											v-if="item1.executeUserId" />
										<view class="name">{{ item1.executePersonName || ''}}</view>
										<text class="skill-name">{{ item1.executeSkillName || ''}}</text>
									</view>
									<view v-if="item1.businessType == '1004' || item1.businessType == '1005'">
										<view class="item-tree_node-flex item-tree_node-lable row children">
											<!-- 验收节点 -->
											<view :class="'checkStatus checkStatus_'+item1.checkStatus"
												v-if="item1.businessType == '1004'">
												{{ item1.checkStatus ==1?'待验收':item1.checkStatus ==2?'验收不通过':item1.checkStatus ==3?'验收通过':""}}
											</view>
											<!-- 施工节点 -->
											<view :class="'checkStatus checkStatus_'+item1.checkStatus"
												v-if="item1.businessType == '1005'">
												{{ item1.checkStatus ==1?'待验收':item1.checkStatus ==2?'待整改':item1.checkStatus ==3?'验收通过':""}}
											</view>
										</view>
									</view>
								</view>
								<view v-show="item1.totalDay">{{item1.planDay}}天</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-else marginTop="50" size="150" title="暂无服务计划～～" />
	</view>
</template>

<script>
/**
 * 	项目阶段状态： 0-非当前阶段 1-当前阶段
 * 	验收状态：施工类节点：0-未完工 1-待验收 2-待整改 3-已验收通过
 * 	验收类节点：0-未验收 1-待验收 2-验收不通过 3-验收通过\n其它类节点无效
 */
	export default {
		data() {
			return {
				projectStage: [],
				statusList: [
					// {
					// 	name: '非当前阶段',
					// 	value: 0
					// },
					{
						name: '（当前阶段）',
						value: 1
					},
					{
						name: '（已完成）',
						value: 2
					},
				],
				options: {}
			}
		},
		props:{
			projectId:{
				type:[Number,String],
				default:()=>''
			}
		},
		onLoad(options) {
			if (options) {
				this.options = options;
			}
		},
		onShow() {
			// this.getListData()
		},
		mounted() {
			if(this.projectId){
				this.options.projectId = this.projectId;
				this.getListData()
			}
		},
		methods: {
			getListData() {
				// this.$http.get(`order/project/servicePlan/${520}`)
				this.$httpApi.getServiceProject(this.options.projectId)
					.then(res => {
						this.projectStage = res;
					})
			},
			getStatusName(status) {
				let name = ''
				this.statusList.some(v => {
					if (v.value == status) {
						name = v.name;
						return true
					}
				})
				return name
			},
			getName(v) {
				let name = v;
				if (v && v.slice(-2) != '验收') {
					name = v.replace('验收', '')
					return name
				}
				name = name + '验收'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.service {
		.nav-bar {
			@include nav-bar-title(#000000);
		}

		.service-title {
			font-size: 28rpx;
			color: #000000;
		}

		.service-content {
			padding-left: 10rpx;
			.content-item {
				padding-left: 40rpx;
				position: relative;

				// 圆点
				&::before {
					position: absolute;
					content: "";
					width: 14rpx;
					height: 14rpx;
					background: #000000;
					border-radius: 50%;
					left: -8rpx;
					top: 25rpx;
					z-index: 9;
				}

				// 竖线
				&::after {
					position: absolute;
					content: "";
					bottom: -40rpx;
					left: -3rpx;
					top: 25rpx;
					border-left: 2rpx solid #E6E6E6;
				}

				&:last-child {
					&::after {
						bottom: 0;
					}
				}

				.content-item_tree {
					.item-tree_node {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin: 20rpx 0;
					}

					.item-tree_node-lable {
						view {
							font-size: 28rpx;
						}
					}

					.item-tree_node-flex {
						display: flex;
						align-items: center;

						.status_0 {
							color: #9897A5;
						}

						.status_2 {
							background: #FE6E32;
							padding: 5rpx 20rpx;
							border-radius: 30rpx;
							color: #FFFFFF;
						}

						.status_2 {
							background: #FE6E32;
							padding: 5rpx 20rpx;
							border-radius: 30rpx;
							color: #FFFFFF;
						}

						.avatar {
							margin-left: 20rpx;
						}

						.name {
							padding: 0 10rpx;
						}

						.skill-name {
							font-size: 18rpx;
							color: #FE6E32;
							font-weight: 600;
							font-family: HuXiaoBo-NanShen;
							background: #F8F8F8;
							padding: 5rpx 10rpx;
							border-radius: 10rpx;
						}
						.checkStatus {
							margin-left: 20rpx;
							color: #FFFFFF;
							padding: 0 20rpx;
							border-radius: 20rpx;
							&.checkStatus_1 {
								background: #A8A8A8;
							}

							&.checkStatus_2 {
								background: #F56C6C;
							}

							&.checkStatus_3 {
								background: #67C23A;
							}
						}
						.last-node {
							color: #A8A8A8;
							&.last-node_3 {
								color: #000000;
							}
						}
					}

					.parent {
						padding: 10rpx 0;
						view {
							color: #000000;
							font-size: 28rpx;
							font-family: NotoSansHans;
						}
					}

					.children {
						view {
							color: #000000;
							font-size: 24rpx;
							font-family: NotoSansHans;
						}
					}
				}
				.rwo-line {
					position: relative;

					// 竖线
					&::before {
						position: absolute;
						content: '';
						top: -20rpx;
						left: 20rpx;
						bottom: 20rpx;
						border-left: 1.5rpx solid #F5F5F5;
					}

					// 横线
					&::after {
						position: absolute;
						content: '';
						width: 30rpx;
						left: 35rpx;
						top: 50%;
						transform: translateX(-50%);
						border-top: 1.5rpx solid #F5F5F5;
					}
				}
			}
		}
	}

	.status {
		&.status_1 {
			view {
				color: #FE6E32 !important;
			}
		}
		&.status_4 {
			view {
				color: red !important;
			}
		}
	}
</style>
