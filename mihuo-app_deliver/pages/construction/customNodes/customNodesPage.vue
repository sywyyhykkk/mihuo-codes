<template>
	<view class="custom-nodes-page">
		<!-- 项目信息 -->
		<mihuo-order-information></mihuo-order-information>
		<!-- 节点信息 -->
		<node-information ref="nodeInformation"></node-information>
		<!-- 节点审核信息 -->
		<sop-node-check ref="nodecheck"></sop-node-check>
		<!-- 开始、结束添加的内容 -->
		<sop-operation-detail ref="sopOperationDetail"></sop-operation-detail>
		<!-- 操作按钮 -->
		<!-- <sop-operation ref="sopOperation"></sop-operation> -->
		
		<!-- v-if="examineType !== '审查方'" -->
		<view v-if="$permissionRouting.getInstance().isShow()" class="custom-nodes-page-button">
			<view class="item-button-list">
				<view class="item-button-default"
					:class="[ item.active?'item-button-active':'item-button',item.disable ?'item-disable':'']"
					v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
					{{item.lable}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description sop关联节点为无的中间页
	 * */
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				list: [],
				details: {},
				detailsShow: false,
				nodeKey: 1,
				reviewStatus: '',
				buttonList: [{
					value: 1,
					lable: '开始',
					active: false,
					disable: false
				}, {
					value: 2,
					lable: '完成',
					active: true,
					disable: false
				}]
			}
		},
		computed: {

		},
		mounted() {},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'examineType'])
		},
		onShow() {
			this.setNodeDetails()
			
		},
		onLoad(option) {
			this.option = option
			uni.setNavigationBarTitle({
				title: this.nodeInfo.nodeName
			});
		},
		methods: {
			setNodeDetails() {
				this.$refs.nodeInformation && this.$refs.nodeInformation.getReviewList()
				
				this.$refs.nodeCheck && this.$refs.nodeCheck.getReviewList()
				// 更新node详情
				this.$getNodeDetails(() => {
					this.$refs.sopOperationDetail && this.$refs.sopOperationDetail.getDetails()
					this.$refs.sopOperation && this.$refs.sopOperation.getDetails()
					this.setButton()
				})
			},
			setButton(){
				this.buttonList.forEach(el => {
					if(['开始','完成'].includes(el.lable)){
						if ([5, 3].includes(Number(this.nodeInfo.status))) {
							el.disable = true
						}
					}
					if (this.nodeInfo.status == 2) {
						if (el.lable == '开始') {
							el.disable = true
						}
					}
					if (this.nodeInfo.status == 6) {
						el.disable = false
					}
					if(!this.$setNodeSkipStatus('show')){
						el.disable = true
					}
				})
			},
			getButton(item) {
				this.debounce(()=>{
					if (!item.disable) {
						this.toPage(`/pages/construction/customNodes/customNodesAdd?type=${item.lable}`)
					}else{
						this.$setNodeSkipStatus('tips')
					}
				},200)
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.custom-nodes-page {
		padding-bottom: 160rpx;

		.custom-nodes-page-other {
			margin: 10rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.item-list-contain {
				padding: 30rpx 0rpx 40rpx 0rpx;
				border-top: 2rpx solid #F6F6F6;
			}

			.item-desc {
				padding: 0rpx 44rpx;
				color: #666666;
				font-size: $middleFontSize;
			}

			.item-images {
				padding-left: 44rpx;
				margin-top: 24rpx;
			}

			.item-audio {
				padding: 0rpx 44rpx;
			}

			.item-time-contain {
				margin-top: 24rpx;
				padding: 0rpx 44rpx;

				.item-time {

					&:last-child {
						margin-top: 20rpx;
					}

					.time-lable {
						font-size: $middleFontSize;
						color: $viceFontColor;
						margin-right: 20rpx;
					}

					.time-value {
						font-size: $middleFontSize;
						color: #666666;
					}
				}
			}
		}

		.custom-nodes-page-button {
			position: fixed;
			bottom: 0rpx;
			width: 100%;

			.item-button-list {
				background-color: #fff;
				padding: 14px 10px;
				display: flex;
				align-items: center;
				justify-content: center;

				.item-button-default {
					width: 268rpx;
					height: 88rpx;
					text-align: center;
					line-height: 88rpx;
					color: #909299;
					border: 2rpx solid #fff;
					border-radius: 10rpx;
					font-size: $middleFontSize;
				}

				.item-button {
					border: 2rpx solid #E0E0E0;
					margin-right: 24rpx;
				}

				.item-button-active {
					border: 2rpx solid $themeColor;
					color: #fff;
					background-color: $themeColor;
				}

				.item-disable {
					opacity: 0.5;
				}
			}
		}
	}
</style>
