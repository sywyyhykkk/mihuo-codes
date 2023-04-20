<template>
	<u-popup v-model="showPopup" border-radius="30" height="450" mode="bottom" @close="close"
		:safe-area-inset-bottom="false" :closeable="true">
		<view class="criteria-contian">
			<view class="tittle">
				{{title}}
			</view>
			<view class="list-contain">
				<scroll-view :scroll-x="true" class="scroll-Y">
					<view class="rejection-record">
						<view class="list-rejection-contain" v-if="resultList.length > 0">
							<view class="list-skill-contain">
								<view class="item-skill-contain" @click="getDetails(item)"
									v-for="(item,index) in resultList" :key="index">
									<image class="public-images" :src="setImage(item)" mode=""></image>
									<view class="item-bottom">
										<text class="item-text">我是{{item.skillName}}</text>
									</view>
								</view>
							</view>
						</view>
						<!-- <mh-empty v-else title="这里空荡荡哒～" /> -->
					</view>
				</scroll-view>
			</view>
		</view>
	</u-popup>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: '选择我的角色'
			},
			logList: {
				type: Array,
				default: function() {
					return []
				}
			},
			value: {
				type: Boolean,
				default: false
			},

		},
		data() {
			return {
				showPopup: false,
				certifiedList: [],
				resultList: [{
					url: '/static/images/skill_icon/skill_gj.png',
					skillName: '管家',
					value: '管家',
					tips: '待认证',
					auditStatus:'',
					skillId:''
				}, {
					url: '/static/images/skill_icon/skill_sj.png',
					skillName: '设计师',
					value: '设计师',
					tips: '待认证',
					auditStatus:'',
					skillId:''
				}],
				imageList: [{
						url: '/static/images/skill_icon/skill_cc.png',
						value: '拆除'
					},
					{
						url: '/static/images/skill_icon/skill_gj.png',
						value: '管家'
					},
					{
						url: '/static/images/skill_icon/skill_jl.png',
						value: '监理'
					},
					{
						url: '/static/images/skill_icon/skill_mf.png',
						value: '美缝'
					},
					{
						url: '/static/images/skill_icon/skill_mg.png',
						value: '木工'
					},
					{
						url: '/static/images/skill_icon/skill_nw.png',
						value: '泥'
					},
					{
						url: '/static/images/skill_icon/skill_sd.png',
						value: '水电'
					},
					{
						url: '/static/images/skill_icon/skill_sj.png',
						value: '设计师'
					},
					{
						url: '/static/images/skill_icon/skill_yq.png',
						value: '油漆'
					},
				]
			}
		},
		computed: {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
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
					this.getPersonInfo()
					this.$emit('open')
				})
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			setImage(item) {
				let tempUrl = this.imageList.find(el => item.skillName.includes(el.value))
				if (tempUrl) {
					return tempUrl.url
				} else {
					return '/static/images/skill_icon/skill_cc.png'
				}
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						res.personageList.map(item => {
							if (item.skillName.includes('项目管家')) {
								item.skillName = '管家'
							}
						})
						if(res.personageList.length > 0){
							this.resultList.forEach(el => {
								res.personageList.forEach(item => {
									if (el.skillName.indexOf(item.skillName) !== -1 ) {
										el.auditStatus = item.auditStatus
										el.skillId = item.skillId
										el.tips = this.getAuditStatusName(item.auditStatus)
									}
								})
							})
						}
					}
				})
			},
			getDetails(item) {
				this.$emit('click', item)
				this.close()
			},
			getAuditStatusName(status) {
				// 审核状态（0已提交、1未通过、2已通过）
				let tempMap = {
					0: '待审核',
					1: '审核失败',
				}
				return tempMap[status] ?? ''
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
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
		}

		.list-contain {
			padding: 40rpx;
		}

		.scroll-Y {
			height: 100%;
		}

		.rejection-record {
			padding: 20rpx;

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


	.public-images {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 10rpx;

	}

	.list-skill-contain {
		display: flex;
		// flex-wrap: wrap;
		padding: 0rpx 60rpx 0rpx 60rpx;
		justify-content: space-around;

		.item-skill-contain {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;
			// margin-right: 82rpx;
			margin-bottom: 16rpx;

		}

		.item-bottom {
			display: flex;
			flex-direction: column;

			.item-text {
				font-size: 28rpx;
				color: #303133;
				white-space: nowrap;
			}

			.item-time {
				font-size: 24rpx;
				color: #909199;
			}
		}
	}
</style>
