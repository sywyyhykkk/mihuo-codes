<template>
	<view>
		<z-nav-bar backState="1000" bgColor="#000" fontColor="#fff">
			<view class="right-icon" slot="right">
				<image src="https://www.51mihuo.com/static/icon/add_miyou/button_1.png" class="icon"></image>
			</view>
		</z-nav-bar>
		<view class="main-container flex-center">
			<image-upload-new class="img-upload" :count="9" v-model="attachments" :uploadType="['图片', '视频']" />
			<view class="input-container">
				<uni-easyinput :inputBorder="false" maxlength="30" fontColor="#CCCCCC" v-model="title"
					confirm-type="next" type="text" placeholder="添加标题获得更多流量~" :placeholderStyle="placeholderStyle"
					:clearable="false" />
			</view>
			<view class="border"></view>
			<uni-easyinput :inputBorder="false" fontColor="#CCCCCC" v-model="content"
				class="input-area" type="textarea" placeholder="分享你的生活，找到志同道合的人.."
				:placeholderStyle="placeholderStyle" />
			<view class="tag-container">
				<view class="tags flex-center">
					<view class="tag flex-center" v-if="smsTopic.length === 0">
						选择话题
					</view>
					<view v-else class="tag flex-center" v-for="(item, index) in smsTopic" :key="index">
						# {{ item.content }}
					</view>
				</view>
				<image src="https://www.51mihuo.com/static/icon/add_miyou/icon_1.png" class="border-img"></image>
				<view class="reco-tag flex-center">
					<view class="reco-title">
						推荐
					</view>
					<view class="tag-item" :style="{color: smsTopic.indexOf(item) === -1 ? '#CCCCCC' : '#FE6E32'}"
						v-for="(item, index) in tags" :key="index" @click="tagClick(item)">
						{{ item.content }}
					</view>
				</view>
			</view>
			<view class="button-container flex-center">
				<view class="right flex-center">
					<view class="button" @click="submitMiyou(3)" :style="{opacity: isDisable ? '0.3' : '1'}">
						发布
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";

	export default {
		data() {
			return {
				isDisable: true,
				smsTopic: [], // 觅友圈话题
				attachments: '[]', // 觅友圈图片、视频
				title: '', // 觅友圈标题
				content: '', // 觅友圈内容
				tags: [], // 所有话题
				placeholderStyle: `font-family: PingFang SC; font-style: normal; font-size: 28rpx; line-height: 40rpx; color: #CCCCCC;`
			}
		},
		onShow() {
			this.getMiyouTag()
		},
		watch: {
			title() {
				this.isDisable = this.title.length === 0 || this.content.length === 0 || this.attachments === '[]'
			},
			content() {
				this.isDisable = this.content.length === 0 || this.title.length === 0 || this.attachments === '[]'
			},
			attachments() {
				this.isDisable = this.title.length === 0 || this.content.length === 0 || this.attachments === '[]'
			}
		},
		methods: {
			tagClick(item) {
				if (this.smsTopic.indexOf(item) === -1) {
					if (this.smsTopic.length === 2) {
						this.$util.toast('最多选择2个话题!')
						return
					}
					this.smsTopic.push(item)
				} else {
					this.smsTopic = this.smsTopic.filter(each => {
						return each.id !== item.id
					})
				}
			},
			selectType() {
				this.showTypePicker = true
			},
			getMiyouTag() {
				this.$httpApi.getMiyouTag({
					current: 1,
					size: 20,
				}).then(res => {
					this.tags = res.records
				})
			},
			submitMiyou() {
				if (this.isDisable) {
					return
				}
				let topicIds = []
				this.smsTopic.forEach(item => {
					topicIds.push(item.id)
				})
				this.$httpApi.postNewMiYou({
					images: JSON.parse(this.attachments),
					content: this.content,
					topicIds,
					title: this.title,
				}).then(res => {
					if (res) {
						this.goBack()
						uni.$emit('updateMiyou')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.right-icon {
		margin-right: 40rpx;

		.icon {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.main-container {
		width: 100vw;
		height: calc(100vh - 170rpx);
		background-color: #101013;
		padding: 20rpx 0;
		flex-direction: column;
		justify-content: flex-start;

		.img-upload {
			width: 100%;
			padding: 0 20rpx;
			/* #ifdef MP-WEIXIN */
			margin-left: 40rpx;
			/* #endif */
		}

		.input-container {
			width: 100%;
			height: 60rpx;
			padding: 0 10rpx;
			background-color: transparent;
		}

		.input-area {
			width: 100%;
			height: 400rpx;
			padding: 0 10rpx;
			background-color: transparent;
		}

		.border {
			width: 92%;
			height: 1rpx;
			background-color: #CCCCCC;
		}

		.tag-container {
			width: 100vw;
			position: fixed;
			bottom: 164rpx;

			.tags {
				width: 100%;
				padding: 0 20rpx;

				.tag {
					width: max-content;
					max-width: 250rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #FFFFFF;
					margin-right: 20rpx;
					@include toe()
				}
			}

			.border-img {
				width: 710rpx;
				height: 16rpx;
				margin: 20rpx auto;
			}

			.reco-tag {
				width: 100%;
				height: 84rpx;
				padding: 20rpx;
				overflow: auto;

				.reco-title {
					min-width: 80rpx;
					height: 44rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 32rpx;
					line-height: 44rpx;
					color: #FE6E32;
				}

				.tag-item {
					min-width: 200rpx;
					max-width: 240rpx;
					height: 44rpx;
					padding: 5rpx 10rpx;
					margin: 0 10rpx;
					background: #28272C;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 500;
					font-size: 24rpx;
					line-height: 34rpx;
					text-align: center;
					color: #FFFFFF;
					@include toe();
				}
			}
		}

		.button-container {
			width: 100vw;
			height: 164rpx;
			background-color: #000000;
			position: fixed;
			bottom: 0;
			justify-content: center;

			.right {
				width: 80%;
				justify-content: center;

				.button {
					width: 528rpx;
					height: 80rpx;
					background: #FE6E32;
					border-radius: 4rpx;
					text-align: center;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 80rpx;
					color: #FFFFFF;
				}
			}
		}

	}


	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
