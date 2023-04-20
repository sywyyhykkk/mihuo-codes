<template>
	<view>
		<z-nav-bar>
			<view slot="default" class="nav-bar">
				交办详情
			</view>
		</z-nav-bar>
		<view class="main">
			<view class="main-send" v-if="resultList">
				<view class="main-top">
					<view class="flex-row">
						<u-avatar v-if="resultList.userId" class="avatar" size="50" :src="$util.avatarImage(resultList.userId)" />
						<text class="name">{{ resultList.userName }}</text>
					</view>
					<view v-if="resultList.created" class="main-top_date">{{resultList.created.substring(11,16)}}</view>
				</view>
				<view class="main-content">{{ resultList.comment }}</view>
				<view class="image_show">
					<myHome-mh-image-show v-if="resultList.img && resultList.img.length" :imgSrc="JSON.stringify(resultList.img)" width="196" height="196" right="12" />
				</view>
				<view>
					<audio-play v-if="resultList.audio && resultList.audio.length" :formDate="resultList.audio[0]" />
				</view>
			</view>
			<view class="mian-result">
				<view class="result-title">处理结果</view>
				<view v-if="resultList && resultList.bizPendingDetailList">
					<view v-for="(item,index) in resultList.bizPendingDetailList" :key="index">
						<view class="flex-row">
							<u-avatar class="avatar" size="50" :src="$util.avatarImage(item.handleUserId)" />
							<text class="name">{{ item.handlePersonName}}</text>
							<text class="skill-name">{{ item.handleSkillName }}</text>
						</view>
						<view v-if="item.status == 2">
							<view class="main-content">{{ item.comment }}</view>
							<view class="image_show">
								<myHome-mh-image-show v-if="item.img && item.img.length" :imgSrc="JSON.stringify(item.img)" width="196" height="196" right="12" />
							</view>
							<view>
								<audio-play v-if="item.audio && item.audio.length" :formDate="item.audio[0]" />
							</view>
						</view>
						<myHome-mh-empty v-else marginTop="50" size="120" title="正在处理中，请耐心等待" />
					</view>
				</view>
			</view>
		</view>
		<bottom-button title="确认" @click="confirm" v-if="resultList.status !=4 && options.flag"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultList: {},
				options: {},

			}
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			this.getListData()
		},
		methods: {
			confirm() {
				this.$httpApi.senderConfirm(this.options.id)
				.then(res => {
					if (res) {
						this.$util.toast("操作成功");
						setTimeout(() => {
							uni.navigateBack();
						}, 500)
					}
				})
			},
			getListData() {
				this.$httpApi.getAssignedDetail(this.options.id).
				then(res => {
					if (res) {
						res.attachments = JSON.parse(res.attachments)
						res.img = [];
						res.audio = [];
						if(res.attachments && res.attachments.length){
							res.img = res.attachments.filter(i => i.type == 'img')		//图片
							res.audio = res.attachments.filter(i => i.type == 'audio')	//音频
						}
						if(res.bizPendingDetailList && res.bizPendingDetailList.length){
							res.bizPendingDetailList.map(item=>{
								item.attachments = JSON.parse(item.attachments)
								item.img = [];
								item.audio = [];
								if(item.attachments && item.attachments.length){
									item.img = item.attachments.filter(i => i.type == 'img')		//图片
									item.audio = item.attachments.filter(i => i.type == 'audio')	//音频
								}
							})
						}
						this.resultList = res;
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		@include nav-bar-title(#000000);
	}

	.main {
		padding: 0 30rpx;

		.flex-row {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.name {
				color: #000000;
				font-size: 24rpx;
				margin: 0 20rpx;
			}

			.skill-name {
				font-size: 20rpx;
				font-weight: 600;
				color: #FE6E32;
				background: #FFF0EA;
				padding: 5rpx 10rpx;
				border-radius: 4rpx;
			}
		}

		.main-send {
			padding-bottom: 40rpx;
			border-bottom: 2rpx solid #F7F7F7;

			.main-top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.main-top_date {
					padding-left: 10rpx;
					font-size: 24rpx;
					color: #808080;
				}
			}
		}

		.main-content {
			padding: 30rpx 0 20rpx;
			color: #4D4D4D;
			font-size: 28rpx;
		}

		.mian-result {
			.result-title {
				padding: 40rpx 0;
				color: #000000;
				font-size: 28rpx;
				font-family: NotoSansHans;
			}
		}
	}
</style>
