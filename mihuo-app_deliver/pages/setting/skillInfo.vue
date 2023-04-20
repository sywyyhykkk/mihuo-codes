<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="left" class="nav-back" @click="goBack">
				<image src="/static/icon/arrow_left.png"></image>
			</view>
			<view slot="default" class="nav-bar">
				技能认证
			</view>
		</z-nav-bar>
		<view style="margin-top: 20rpx;"></view>
		<!-- <view class="header-container flex-center" v-if="skills.length">
			<view class="left">
				已有认证
			</view>
			<view class="right flex-center">
				<view class="skill" v-for="(item, index) in skills" :key="item.personId">
					{{item.skillName}}
				</view>
			</view>
		</view> -->
		<mh-empty title="您还没有技能认证~" v-if="skills.length === 0"></mh-empty>
		<view v-else class="content" v-for="(item, index) in skills" :key="item.personId">
			<view class="title">
				{{item.skillName}}
			</view>
			<scroll-view class="image-content" scroll-x="true" v-if="item.certificateImage">
				<image class="img" mode="heightFix"
					v-for="(img, index2) in getImageList(item.certificateImage)"
					:key="index2"
					:src="$util.thumbnailImage(img, true)"
					@click="imagePreview(index2, getImageList(item.certificateImage))"></image>
			</scroll-view>
		</view>
		<bottom-button @click="saveCertification" title="新增认证"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userSetting: {},
				skills: [],
				imageList: [],
				hasManager: false, //  是否已认证过项目管家
				hasSupervision: false, // 是否已认证过项目监理
			}
		},
		onLoad() {
			this.getPersonData()
		},
		methods: {
			getImageList(images){
				if(images === '') return []
				let arr = JSON.parse(images).map(img => img.url)
				return arr
			},
			getPersonData(){
				this.$httpApi.getPersonSettingInfo().then(res => {
					if(!res){
						return
					}
					this.userSetting = res;
					uni.setStorageSync('userSetting', res);
					if (res.personageList) {
						res.personageList.forEach(item => {
							if(item.jobCode === 'JOB_MANAGER'){
								this.hasManager = true
							}
							if(item.jobCode === 'JOB_SUPERVISION'){
								this.hasSupervision = true
							}
							this.skills.push(item)
						})
					}
				})
			},
			imagePreview(index, oriUrls) {
				if(!oriUrls)return;
				let urls = oriUrls.map(item => this.$image.imageGlobal + item)
				uni.previewImage({
					current: index,
					urls: urls,
					longPressActions: {
						itemList: ['保存'],
						success: (data) =>  {
							uni.saveImageToPhotosAlbum({
								filePath: urls[data.index],
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				})
			},
			saveCertification() {
				this.toPage(`/pages/certification/skills?hasManager=${this.hasManager}&hasSupervision=${this.hasSupervision}`)
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	
	.nav-back {
		padding-left: 25rpx;
	
		image {
			width: 22rpx;
			height: 39rpx;
			transform: scale(0.7);
		}
	}
	.nav-bar {
		@include nav-bar-title(#333333)
	}

	.header-container {
		justify-content: space-between;
		background-color: #FFFFFF;
		margin-top: 20rpx;

		.left {
			width: 140rpx;
			margin-left: 56rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
			color: $seconFontColor;
		}

		.right {
			width: 600rpx;
			display: flex;
			justify-content: flex-end;
			margin-right: 20rpx;
			flex-wrap: wrap;

			.skill {
				min-width: 102rpx;
				height: 56rpx;
				margin: 5rpx 14rpx;
				padding: 0 14rpx;
				background: #EEEEEE;
				border: 2rpx solid #FBFBFB;
				border-radius: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 56rpx;
				text-align: center;
				color: #909199;
			}
		}
	}

	.content {
		height: max-content;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #F5F5F5;
		
		&:last-of-type {
			border-bottom: none;
		}

		.title {
			width: 100%;
			height: 124rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 124rpx;
			color: $seconFontColor;
			padding-left: 56rpx;
		}

		.image-content {
			width: 100%;
			height: max-content;
			white-space: nowrap;
			padding-left: 56rpx;
			justify-content: space-around;

			.img {
				display: inline-block;
				width: 300rpx;
				height: 190rpx;
				margin-right: 60rpx;
				border: 2rpx solid #EEEEEE;
				border-radius: 10rpx;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
