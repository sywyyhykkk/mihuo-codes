<template>
	<u-popup v-model="showPopup" border-radius="30" height="1200" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="true">
		<view class="criteria-contian">
			<view class="tittle">
				{{title}}
			</view>
			<view class="list-contain">
				<scroll-view :scroll-y="true" class="scroll-Y">
					<view class="sop-type_list">
						<view class="item-sop_contain" v-for="(item,index) in sopTypeList" :key="index">
							<view class="item-top">
								<text class="left">{{item.groupName}}</text>
								<view class="right" @click="getShow(index)">
									<text>{{item.show ? '收起':'展开'}}</text>
									<image :class="[item.show  ? 'public-block':'public-none']"
										src="/static/images/bottom-icon.png" class="public-arrow"></image>
								</view>
							</view>
							<view class="children" v-if="item.show">
								<view class="item-children" :class="[ev.activeStatus ? 'item-children-active':'']"
									v-for="(ev,num) in item.list" :key="num" @click="getSop(index,num)">
									{{ev.name}}
								</view>
							</view>
						</view>
						<!-- <mh-empty v-else title="这里空荡荡哒～" /> -->
					</view>
				</scroll-view>
			</view>
			<view class="item-button-contain">
				<view class="button-list">
					<view class="item-button" :class="[item.status ? 'item-button-active':'']"
						v-for="(item,index) in buttonList" :key="index" @click="getButton(item)">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>
<script>
	import {
		getUnique
	} from '@/plugins/utils.js'
	export default {
		props: {
			title: {
				type: String,
				default: '筛选'
			},
			sopList: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showPopup: false,
				buttonList: [{
						name: '重置',
						status: false
					},
					{
						name: '确定',
						status: true
					}
				],
				sopTypeList: [{
					groupName: '阶段(可多选)',
					name: '阶段',
					show: true,
					list: []
				}, {
					groupName: '状态(可多选)',
					show: true,
					name: '节点',
					list: [{
							name: '进行中',
							value: 2,
							activeStatus: false,
						},
						{
							name: '等待中',
							value: 1,
							activeStatus: false,
						},
						{
							name: '已完成',
							value: 3,
							activeStatus: false,
						},
						{
							name: '可验收',
							value: '-1',
							checkStatus: 1,
							activeStatus: false,
						},
						{
							name: '待审查',
							value: 5,
							activeStatus: false,
						},
						{
							name: '审查失败',
							value: 6,
							activeStatus: false,
						},
						// {
						// 	name: '已验收',
						// 	value: '',
						// 	checkStatus: 1,
						// 	activeStatus: false,
						// },
						{
							name: '待整改',
							value: '-1',
							checkStatus: 2,
							activeStatus: false,
						},
						{
							name: '未开始',
							value: 0,
							activeStatus: false,
						}
					]
				}, {
					groupName: '六线管控(可多选)',
					show: true,
					name: '六线管控',
					list: [{
							name: '主辅材料',
							value: '1001',
							activeStatus: false
						},
						{
							name: '人员调度',
							value: '1002',
							activeStatus: false
						},
						{
							name: '资金款项',
							value: '1003',
							activeStatus: false
						},
						{
							name: '方案落地',
							value: '1004',
							activeStatus: false
						},
						{
							name: '测量定制',
							value: '1005',
							activeStatus: false
						},
						{
							name: '验收品控',
							value: '1006',
							activeStatus: false
						}
					]
				}]
			}
		},
		computed: {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
					// this.sopTypeList[0].list = []
					this.sopList.forEach(ev => {
						this.sopTypeList[0].list.push({
							name: ev.stageName,
							stageId: ev.stageId,
							activeStatus: false
						})
					})
					this.sopTypeList[0].list = getUnique(this.sopTypeList[0].list, 'stageId')
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			}
		},
		mounted() {
			this.value && this.open();
		},
		methods: {
			open() {
				this.$nextTick(() => {
					this.showPopup = true
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			getShow(index) {
				this.sopTypeList[index].show = !this.sopTypeList[index].show
			},
			getSop(index, num) {
				this.sopTypeList[index].list[num].activeStatus = !this.sopTypeList[index].list[num].activeStatus
			},
			getButton(item) {
				if (item.name == '重置') {
					this.sopTypeList.forEach(el => {
						el.list.forEach(ev => {
							ev.activeStatus = false
						})
					})
				} else {
					// let result = JSON.parse(JSON.stringify(this.sopTypeList))
					// result.forEach(ev => {
					// 	ev.list = ev.list.filter(item => item.activeStatus)
					// })
					this.$emit('submit', this.sopTypeList)
					this.close()
				}
			},
			syncStatus(list) {
				list.forEach(item => {
					this.sopTypeList.forEach(item2 => {
						if (item2.name == '节点') {
							item2.list.forEach(item3 => {
								if (item.name == item3.name) {
									item3.activeStatus = item.activeStatus
								}
							})
						}
					})
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.criteria-contian {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			// border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			padding: 0rpx 40rpx;
			height: calc(100% - 116rpx - 88rpx);
		}

		.scroll-Y {
			height: 100%;
		}

		.sop-type_list {
			padding: 20rpx 0rpx;

			.item-sop_contain {
				.item-top {
					display: flex;
					justify-content: space-between;
					line-height: 40rpx;
					margin-bottom: 28rpx;

					.left {
						color: #909199;
						font-size: 28rpx;
						padding-left: 28rpx;
					}

					.right {
						display: flex;
						align-items: center;

						text {
							color: #909199;
							font-size: 28rpx;
						}
					}
				}

				.children {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: 20rpx;

					.item-children {
						width: 210rpx;
						height: 84rpx;
						line-height: 84rpx;
						text-align: center;
						border-radius: 10rpx;
						font-size: 28rpx;
						color: #303133;
						border: 2rpx solid #EEEEEE;
						margin-right: 20rpx;
						margin-bottom: 18rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;

						&:nth-of-type(3n) {
							margin-right: 0rpx;
						}
					}

					.item-children-active {
						border: 2rpx solid #002FA5;
						color: #002FA5;
					}
				}
			}

			.mh-empty-page {
				/deep/ .u-empty {
					margin-top: 50rpx !important;
				}
			}

			.item-record-cotain {
				display: flex;

				&:last-child {
					.item-bottom {
						margin-bottom: 0rpx !important;
					}
				}

				.item-left {
					width: 40rpx;
					border-left: 2rpx dashed #C4C4C4;
					position: relative;

					.node {
						position: absolute;
						left: -14rpx;
						width: 26rpx;
						height: 26rpx;
						background-color: #fff;
						border-radius: 50%;
						border: 6rpx solid #D9D9D9;
					}
				}

				.item-right {
					display: flex;
					flex-direction: column;
					flex: 1;


					.item-top {
						display: flex;
						justify-content: space-between;
						margin-bottom: 20rpx;
						margin-left: -6rpx;
						margin-top: -6rpx;

						.refuse-title {
							font-size: 28rpx;
							color: #303133;

						}

						.refuse-time {
							font-size: 24rpx;
							color: #909199;
						}
					}

					.item-name {
						line-height: 38rpx;
						margin-top: -6rpx;

						.left {
							color: #303133;
							font-size: 28rpx;
							margin-right: 14rpx;
						}

						.right {
							color: #FF5D35;
							font-size: 30rpx;
						}
					}

					.item-time {
						color: #909199;
						font-size: 26rpx;
						margin-bottom: 28rpx;
						line-height: 38rpx;
					}

					.item-bottom {
						padding: 26rpx;
						background: #F6F6F6;
						border-radius: 20rpx;
						font-size: 26rpx;
						color: #303133;
						margin-bottom: 40rpx;
					}
				}
			}
		}
	}

	.public-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
		transform: rotate(90deg)
	}

	.public-none {
		transition: all .2s;
		transform: rotate(0deg);
	}

	.public-block {
		transition: all .2s;
		transform: rotate(90deg);
	}


	.public-images {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 10rpx;
	}

	.item-button-contain {
		position: fixed;
		display: flex;
		justify-content: center;
		width: 100%;
		padding-left: 26rpx;
		padding-right: 26rpx;
		@include buttonsafearea();

		.button-list {
			position: relative;
			display: flex;
			width: 100%;
			bottom: 20rpx;

			.item-button {
				display: flex;
				flex: 1;
				justify-content: center;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #909199;
				background-color: #E8E8E8;
				font-size: 24rpx;
				border-radius: 10rpx;
				font-weight: bold;
			}

			.item-button-active {
				background-color: #002FA5;
				color: #fff;
				margin-left: 8rpx;
				font-weight: bold;
			}
		}
	}
</style>
