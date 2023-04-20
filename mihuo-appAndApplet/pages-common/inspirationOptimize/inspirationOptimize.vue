<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar">
				AI优化
			</view>
		</z-nav-bar>
		<view class="imageContent">
			<image class="leftImage" mode="scaleToFill" :src="basepathurl + option.name+params"
				@click="previewImage(option)"></image>
			<image class="arrowIcon" src="@/pages-common/static/images/arrow.png" />
			<image v-if="newImage.name" class="rightImage" mode="widthFix"
				:src="newImage.name?basepathurl+newImage.name+params:''" @click="previewImage(newImage)"></image>
			<view v-else class="rightImage"></view>
		</view>
		<view class="styledrenght">
			<u-radio-group v-model="radiovalue">
				<u-radio active-color="#3CE6DA" v-for="(item, index) in radiolist" :key="index" :name="item.name"
					:disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="keyWordContent">
			<view class="keyWordTitle">关键信息</view>
			<view class="itemContent">
				<view class="allItem">
					<uni-easyinput :disabled="clipLoading || imageToImageLoading" type="textarea"
						placeholder="正在为您生成图片描述信息..." v-model="imagesInfo" class="inputText" />
				</view>
			</view>
		</view>
		<button @click="optimize" :disabled="clipLoading || imageToImageLoading"
			:loading="clipLoading || imageToImageLoading" class="restart">
			<image v-if="!clipLoading & !imageToImageLoading" class="icon"
				src="@/pages-common/static/images/restart_white.png"></image>
			<text class="text">{{clipLoading?'正在提取信息...':(imageToImageLoading?'正在生成...':'AI优化')}}</text>
		</button>
	</view>
</template>

<script>
	var _animation;
	var _animationIndex
	const _ANIMATION_TIME = 500;
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js'
	export default {
		data() {
			return {
				radiolist: [{
						name: '风格变化小',
						disabled: false
					},
					{
						name: '风格变化适中',
						disabled: false
					},
					{
						name: '风格变化大',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue: '风格变化小',
				loading: false,
				animation: '',
				newImage: {},
				animationData: {},
				animationData1: {},
				basepathurl: 'https://mihuo-ai.obs.cn-east-3.myhuaweicloud.com/',
				params: '?x-image-process=image/resize,m_fixed,w_300/marker,u_plus',
				imagesInfo: '',
				imageToImageLoading: false,
				current: 0,
				localImages: '',
				test: '',
				clipLoading: false,
				option: {}
			}
		},
		onLoad(option) {
			this.option = uni.getStorageSync("optimizeImage");
			console.log(this.option)
			this.getClip()
		},
		methods: {
			//clip信息提取
			restart() {
				this.loading = true;
				//图片生图片

			},
			getClip() {
				this.clipLoading = true;
				uni.downloadFile({
					url: this.basepathurl + this.option.name,
					success: (res) => {
						if (res.statusCode === 200) {
							pathToBase64(res.tempFilePath).then(data => {
								const image = data.split(',')[1];
								this.localImages = image;
								this.$http.post('admin/ai/interrogate', {
									img: image
								}).then(item => {
									this.clipLoading = false;
									this.imagesInfo = item
								})
							}); //先将本地图片路径转换成array类型
							//保存图片至相册
						}
					}
				})
			},
			previewImage(item) {
				uni.previewImage({
					urls: [this.basepathurl + item.name + this.params],
					current: this.basepathurl + item.name + this.params
				})
			},
			optimize() {
				if (this.imageToImageLoading) {
					this.$util.toast("正在为您生成,勿重复点击");
					return;
				}
				this.imageToImageLoading = true;
				this.$http.post('admin/ai/img2img', {
					img: this.localImages,
					text: this.imagesInfo,
					niter: 1,
					controlnetGuidance: 2,
					denoisingStrength: this.radiovalue == "风格变化小" ? 0.45 : this.radiovalue == "风格变化适中" ? 0.65 :
						0.72
				}).then(res => {
					if (res && res.length) {
						this.imageToImageLoading = false;
						this.newImage = res[0]
						this.newImage.name = res[0].fileName
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inputText {
		width: 100%;
	}

	.styledrenght {
		display: flex;
		margin: 20rpx 0;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.imageContent {
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
		align-items: center;

		.keyWordItem {
			padding: 20rpx;
			background: #FFFFFF;
			border: 2px solid #E6E6E6;
			border-radius: 25px;
		}

		.leftImage {
			flex: 1.5;
			max-height: 300rpx;
			border-radius: 10rpx;

		}

		.arrowIcon {
			margin: 0 20rpx;
			width: 44rpx;
			height: 31rpx;
		}

		.rightImage {
			flex: 1.5;
			max-width: 512px;
			background: #E6E6E6;
			height: 300rpx;
			border-radius: 10rpx;
		}
	}

	.keyWordContent {
		padding: 0 30rpx;

		.itemContent {
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			.allItem {
				width: 100%;
				border: 1rpx solid #E6E6E6;
				margin: 20rpx 0;
				border-radius: 10rpx;

				.keyWordItem {
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #4D4D4D;
					font-size: 24rpx;
				}
			}
		}

		.keyWordTitle {
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
		}
	}

	.restart {
		position: fixed;
		width: 90%;
		bottom: 30rpx;
		background: #3CE6DA;
		border-radius: 50rpx;
		color: #fff;
		font-size: 32rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 5%;

		.icon {
			width: 30rpx;
			height: 30rpx;
			margin-right: 15rpx;
		}

		.text {
			color: #FFFFFF;
		}

	}

	uni-button[disabled]:not([type]),
	uni-button[disabled][type=default] {
		background-color: #acf6f1;
	}

	uni-button[loading][type=primary] {
		background-color: #acf6f1;
	}
</style>