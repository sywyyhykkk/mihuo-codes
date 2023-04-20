<template>
	<view class="edit-record">
		<view class="disclose-all-contain">
			<view class="data-contain-all" v-for="(item,index) in discloseList" :key="index">
				<view class="x6-information">
					<view class="top">
						<u-avatar class="node" size="36" :src="$util.avatarImage(item.createBy)">
						</u-avatar>
						<view class="personnel-contain">
							<text>{{item.execPersonName}}</text>
							<text v-if="item.execSkillName">({{item.execSkillName}})</text>
							<text v-if="item.discloseDate">{{item.discloseDate.substring(0,16)}}</text>
							<!-- <text>{{index > 0 ? '编辑了交底':'发起交底'}}</text> -->
							<text>发起交底</text>
						</view>
					</view>
					<view class="bottom" v-if=" item.ccPersons && item.ccPersons.length > 0">
						<text class="title">发送至</text>
						<view class="personnel-item-contain">
							<view class="personnel-item" v-for="(ev,index) in item.ccPersons" :key="index">
								<u-avatar class="node" size="36" :src="$util.avatarImage(ev.handleUserId)">
								</u-avatar>
								<text class="name">{{ev.handleSkillName}}({{ev.handlePersonName}}) </text>
								<text class="item-status" v-if="Number(ev.readFlag) !== 0">[已读]</text>
								<text class="item-status-error" v-else>[未读]</text>
							</view>
						</view>
					</view>
				</view>
				<view class="data-notice-contain ">
					<view class="title">{{item.discloseTitle}}内容</view>
					<view class="time" v-if="item.discloseDate">交底日期 {{item.discloseDate.substring(0,10)}}
					</view>
					<view class="desc-contain"><text class="label">内容描述</text><text class="desc">{{item.remark}}</text>
					</view>
					<view class="file-contain" v-if="item.attachmentsListImage">
						<image-show :imgSrc="item.attachmentsListImage" right="20"></image-show>
					</view>
					<view class="mihuo-audio-contain" v-if="item.attachmentsListAudio">
						<mihuo-audio :formData="item.attachmentsListAudio"></mihuo-audio>
					</view>
				</view>
				<view class="x6-bottom-contain  x6-bottom-contain-new" @click="getJumpPage(item)">
					<text class="left"><text class="item-text">共{{item.addCount}}条补充</text></text>
					<view class="right"><text class="details">查看详情</text>
						<image src="/static/images/bottom-icon.png"></image>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="discloseList.length == 0" title="这里空荡荡哒～" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				option: {},
				discloseList: []
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo']),
		},
		mounted() {

		},
		onShow() {
			this.getList()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getList() {
				if (!this.nodeInfo.nodeId) {
					return
				}
				this.$httpApi.selectDiscloseList({
					nodeId: this.nodeInfo.nodeId
				}).then(res => {
					if (res) {
						this.discloseList = res
						this.discloseList.map(item => {
							if (this.$isJSON(item.attachments)) {
								item['attachmentsListImage'] = JSON.stringify(JSON.parse(item.attachments)
									.filter(item => item.type == 'img' || item.type == 'video'))
								item['attachmentsListAudio'] = JSON.parse(item.attachments)
									.find(item => item.type == 'audio')
							}
						})
					}
				})
			},
			getJumpPage(item){
				let notifyIdNew = item.ccPersons.filter(ev => ev.handlePersonId == this.userPersonInfo.personId)
				if (notifyIdNew && notifyIdNew.length > 0) {
					this.toPage(
						`/pages/construction/disclosure/viewDisclosureText?notifyId=${notifyIdNew[0].id}&detailsId=${item.id}&type=编辑`
					)
				}else{
					this.toPage(`/pages/construction/disclosure/viewDisclosureText?detailsId=${item.id}&type=编辑`)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	.edit-record{
		padding: 40rpx 0rpx;
	}

	.x6-information {
		// min-height: 98rpx;

		.top {
			display: flex;
			margin-bottom: 18rpx;

			.node {
				margin-right: 10rpx;
			}

			.personnel-contain {
				text {
					font-size: $smiddleFontSize;
					color: $mainFontColor;
				}

			}
		}

		.bottom {
			display: flex;
			align-items: center;
			position: relative;
			display: flex;
			align-items: flex-start;
			margin-bottom: 26rpx;

			.title {
				// position: absolute;
				font-size: $smallFontSize;
				color: $viceFontColor;
				margin-right: 14rpx;
				flex-wrap: nowrap;
				white-space: nowrap;
			}

			.personnel-item-contain {
				display: flex;
				flex-wrap: wrap;

				.personnel-item {
					display: flex;
					align-items: center;
					margin-right: 16rpx;
					margin-bottom: 8rpx;
					// white-space: nowrap;

					.name {
						font-size: $smallFontSize;
						color: $seconFontColor;
						margin-right: 6rpx;
					}

					.item-status {
						font-size: 20rpx;
						color: $viceFontColor;
					}

					.item-status-error {
						font-size: 20rpx;
						color: #FF5D35;
					}
				}
			}

		}
	}

	.x6-bottom-contain {
		display: flex;
		justify-content: space-between;
		padding-right: 34rpx;

		.left {
			.item-text {
				font-size: $smiddleFontSize;
				color: $viceFontColor;
			}
		}

		.right {
			display: flex;
			flex-direction: row;
			align-items: center;

			text {
				font-size: $smallFontSize;
				color: $themeColor;
				margin-right: 12rpx;
			}

			image {
				width: 16rpx;
				height: 14rpx;
			}
		}
	}

	.x6-bottom-contain-new {
		padding-right: 0rpx;
		margin-right: 40rpx;
	}

	.disclose-contain {
		min-height: 404rpx;


		.no-data-item {
			margin-bottom: 34rpx;
		}

		.no-data {
			margin: 0 20rpx;
			text-align: center;
			padding-bottom: 60rpx;
			border-radius: $miniBorderRadius;
			background: $bgColor;
		}
	}

	.data-contain,
	.disclose-all-contain {
		padding: 44rpx 0rpx 26rpx 42rpx;

		.data-notice-contain-all {
			padding-right: 40rpx;
		}

		.data-notice-contain-new {
			margin-right: 0rpx !important;

		}

		.data-notice-contain,
		.data-notice-contain-new {
			box-shadow: 0px 0px 8px rgba(158, 156, 156, 0.25);
			border-radius: $miniBorderRadius;
			// max-width: 628rpx;
			display: flex;

			flex-direction: column;
			padding: 32rpx 0rpx 46rpx 38rpx;
			margin-bottom: 34rpx;
			margin-right: 40rpx;

			.title {
				color: $seconFontColor;
				font-size: $middleFontSize;
				margin-bottom: 8rpx;
				font-weight: bold;
			}

			.time {
				font-size: $smallFontSize;
				color: $viceFontColor;
				margin-bottom: 8rpx;
			}

			.desc-contain {
				padding-right: 38rpx;

				.label {
					color: $viceFontColor;
					font-size: $middleFontSize;
					margin-right: 18rpx;
				}

				.desc {
					color: $seconFontColor;
				}

				text {
					font-size: $middleFontSize;
				}
			}

			.file-contain {
				margin-top: 22rpx;
				margin-bottom: 20rpx;
			}

			.mihuo-audio-contain {
				padding-right: 40rpx;
			}

		}


	}

	.disclose-all-contain {
		padding: 0rpx;

		.data-contain-all {
			background-color: #fff;
			border-radius: $miniBorderRadius;
			margin: 0rpx 20rpx 20rpx 20rpx;
			padding: 44rpx 0rpx 26rpx 42rpx;
		}
	}
</style>
