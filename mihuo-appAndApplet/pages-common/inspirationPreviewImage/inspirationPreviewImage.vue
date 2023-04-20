<template>
	<view style="background: 000;" class="pageContent">
		<z-nav-bar backState="1000" :isWhite="true" fontColor="white" bgColor="#000">
			<view class="nav-bar" style="color:#fff">
				预览
			</view>
		</z-nav-bar>
		<view class="uni-padding-wrap uni-common-mt">
			<swiper class="swiper" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item" v-for="item in images" :key="item.id">
					<movable-area :style="{height: imagesHeight+'px',width:'100%'}" scale-area>
						<movable-view class="scaleview" :style="{height: imagesHeight+'px',width:'100%'}" direction="all"
							@scale="onScale" scale="true" scale-min="1" scale-max="4" :scale-value="scale">
							<image style="width: 100%;" :src="basepathurl+item.name+params" mode="widthFix"></image>
						</movable-view>
					</movable-area>
				</swiper-item>
			</swiper>
		</view>
		<view class="action">
			<!-- <view class="miniaction">
				<image @click="likeImages" v-if="images[current].likeFlag == 1" class="like"
					src="@/pages-common/static/images/like.png">
				</image>
				<image @click="likeImages" v-if="images[current].likeFlag == 0" class="like"
					src="@/pages-common/static/images/no_like.png">
				</image>
			</view> -->
			<!-- <button class="collect" @click="collect">收藏</button> -->
			<button class="collect" @click="optimize">AI优化</button>
			<button class="saveAlbum" @click="downLoadImg">保存到相册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scale: 1,
				basepathurl: 'https://mihuo-ai.obs.cn-east-3.myhuaweicloud.com/',
				params: '?x-image-process=image/resize,m_fixed,w_750/marker,u_plus',
				url: '',
				imagesHeight: 0,
				images: [],
				current: 0,
				id: 0
			}
		},
		onLoad(option) {
			const device = uni.getWindowInfo();
			this.imagesHeight = device.screenHeight - 60
			this.url = option.url;
			this.id = option.id;
			this.images = this.$store.state.aiImagePreview;
			this.current = this.$store.state.aiImagePreview.findIndex(item => item.name == this.url);
			//图片高度
		},
		methods: {
			onScale() {

			},
			optimize(){
			  	uni.setStorageSync("optimizeImage", this.images[this.current])
				const item = this.images[this.current];
			  	this.toPage('/pages-common/inspirationOptimize/inspirationOptimize?name=' + item.name + '&id=' + item.id)
			},
			swiperChange(current) {
				this.current = current.detail.current;
			},
			back() {
				uni.navigateBack()
			},
			likeImages() {
				const id = this.images[this.current].id;
				this.$http.post('admin/ai/like?imgId=' + id).then(res => {
					this.images[this.current].likeFlag = 1;
				});
			},
			//收藏
			collect() {
				this.$http.get('admin/ai/favorite?imgId=' + this.images[this.current].id).then(res => {
					this.$util.toast('收藏成功');
				})
			},
			//保存到相册
			downLoadImg() {
				//下载图片资源至本地，返回文件的本地临时路径
				uni.downloadFile({
					url: this.basepathurl + this.images[this.current].name,
					success: (res) => {
						if (res.statusCode === 200) {
							//保存图片至相册
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #000;
	}

	uni-movable-view {
		width: 100%;
	}

	uni-movable-area {
		width: 100%;
	}

	.swiper {
		height: 100%;
		width: 100%;

		.swiper-item {
			display: flex;
			align-items: center;
		}
	}

	.scaleview {
		display: flex;
		align-items: center;
	}

	.pageContent {
		height: 100vh;
		background: #000;
		display: flex;
		flex-direction: column;
	}

	.uni-padding-wrap {
		flex: 1;
		display: flex;
		background: #000;
		align-items: center;
	}

	.action {
		position: fixed;
		bottom: 30rpx;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-around;
		.miniaction {
			display: flex;
			width: 100rpx;
			flex: 0.16;
			justify-content: center;
		}

		.like,
		.coll {
			width: 40rpx;
			height: 40rpx;
		}

		.collect,
		.saveAlbum {
			flex: 0.42;
		}

		.collect {
			background: #000;
			background: rgba(60, 230, 218, 0);
			border: 2rpx solid #3CE5DA;
			border-radius: 50rpx;
			color: #3CE5DA;
			margin-right: 30rpx;
		}

		.saveAlbum {
			background: #3CE5DA;
			border-radius: 50rpx;
			color: #fff;
		}
	}
</style>