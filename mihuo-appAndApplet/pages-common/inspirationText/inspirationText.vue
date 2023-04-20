<template>
	<view class="pageContent" :class="!intersetList.length?'none':''">
		<z-nav-bar backState="1000" :bgColor="['#E5FFF9','#E5E7FF']">
			<view class="nav-bar">
				找灵感
			</view>
			<view slot="right" class="nav-bar-right" @click="historyList">
				历史记录
			</view>
		</z-nav-bar>
		<view class="colorPage">
			<view class="tabs">
				<view @click="current=0" class="tab_txtImage" :class="current==0?'active':''">文字找灵感</view>
				<view @click="current=1" class="tab_imageToImage" :class="current==1?'active':''">图片找灵感</view>
			</view>
			<view v-if="current == 1">
				<view class="imageToImage">
					<view class="iconContent">
						<image @click="chooseImage" v-if="!localImage" class="iconMini"
							src="@/pages-common/static/images/choose_images.png" />
						<image @click="chooseImage" v-else class="localimage" :src="localImage" mode="scaleToFill" />
					</view>
				</view>
			</view>
			<view style="margin: 20rpx 30rpx;">
				<uni-easyinput @focus="wordChange" :styles="styles" :placeholderStyle="placeholderStyle" type="textarea"
					placeholder="请输入你需要生成的效果,例如:工业风的客厅" v-model="createImgWord" class="inputText" />
			</view>
			<view class="middleContent">
				<view>
					<view class="titleDec">
						<text class="text">快捷标签</text>
					</view>
					<view>
						<view class="labelTitle" v-if="current == 1">图片类型</view>
						<view class="keyContent" v-if="current == 1">
							<view :class="chooseImageType.includes(item)?'active':''"
								@click="()=>appendKeyword(item,chooseImageType)" class="keyItem"
								v-for="(item,index) in allKeyWord.imageType" :key="item">
								{{item}}
							</view>
						</view>
						<view class="labelTitle">空间</view>
						<view class="keyContent">
							<view :class="chooseSpace.includes(item)?'active':''"
								@click="()=>appendKeyword(item,chooseSpace)" class="keyItem"
								v-for="(item,index) in allKeyWord.space" :key="item">
								{{item}}
							</view>
						</view>
						<view class="labelTitle">风格</view>
						<view class="keyContent">
							<view @click="()=>appendKeyword(item,chooseStyle)"
								:class="chooseStyle.includes(item)?'active':''" class="keyItem"
								v-for="item in allKeyWord.style" :key="item">
								{{item}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<button class="mybutton" :loading="textToImageLoading || imageToImageLoading"
				:disabled="textToImageLoading || imageToImageLoading"
				@click="startFabrication">{{imageToImageLoading || textToImageLoading?'正在为您生成...':'开始制作'}}</button>
			<view class="imagesContent">
				<view class="searchTitle" v-if="current == 0 && searchImages.length">
					<text class="mini-title">检索图</text>
					<text class="change" @click="changeBatch">换一批</text>
				</view>
				<view class="searchContent" v-if="current == 0 && searchImages.length">
					<view v-for="(item,index) in searchImages" class="allSearch image" :key="item.name">
						<image @touchend="()=>maskTouchend(item,searchImages)" v-if="item.name" class="searchImages"
							mode="scaleToFill" :src="basepathurl+item.name+params" />
					</view>
				</view>
				<view class="createTitle"
					v-if="(current==1 && imagesToImagesList.length) || (current==0 && textToImagesList.length)"><text
						class="text">AI生成图</text>
				</view>
				<view class="createContent" v-if="current==0 && textToImagesList.length">
					<view v-for="(item,index) in textToImagesList" :class="textToImageLoading?'loading':''"
						class="allcreate image" :key="item.name">
						<image @click="()=>maskTouchend(item,textToImagesList)" v-if="item.name" class="createImages"
							mode="scaleToFill" :src="basepathurl+item.name+params" />
					</view>
					<view class="allcreate activate">
						<view>
							<image class="iconImages" src="@/pages-common/static/images/review_create.png" />
							<view><text class="restart" @click="getTextToImages">重新生成</text></view>
						</view>
					</view>
					<view class="allcreate"></view>
				</view>
				<view class="createContent" v-if="current==1 && imagesToImagesList.length">
					<!-- <u-checkbox-group style="width: 100%;"> -->
					<view v-for="(item,index) in imagesToImagesList" :class="imagesToImagesList?'loading':''"
						class="allcreate image" :key="item.name">
						<image @click="()=>maskTouchend(item,imagesToImagesList)" v-if="item.name" class="createImages"
							mode="scaleToFill" :src="basepathurl+item.name+params" />
						<u-checkbox v-if="item.name" @change="(e)=>concatInteresttrArray({...e,...item})"
							:key="item.name" active-color="#3CE6DA" class="createBox" style="display: block;"
							v-model="item.checked" size="30" :name="item.name" />
					</view>
					<view class="allcreate activate">
						<view>
							<image class="iconImages" src="@/pages-common/static/images/review_create.png" />
							<view><text class="restart" @click="getImagesToImages">重新生成</text></view>
						</view>
					</view>
					<view class="allcreate"></view>
				</view>
			</view>
		</view>
		<view class="myInterest" v-if="intersetList.length">
			<view class="inTitle">我感兴趣的</view>
			<view class="choosed">
				<view v-for="item in intersetList" class="imagesContentMy" :key="item.name">
					<image class="inImage" :src="basepathurl+item.name+params" mode="scaleToFill"
						@click="previewImage(item,intersetList)" />
					<view class="optimize" @click="imageOptimize(item)">优化</view>
				</view>
				<view class="imagesContentMy" v-for="mini in intersetList.length%4" :key="mini"></view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js'
	export default {
		data() {
			return {
				radiolist: [{
						name: '毛坯房',
						disabled: false
					},
					{
						name: '效果图',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue: '毛坯房',
				current: 0,
				word: '',
				localImage: '',
				chooseSpace: [],
				chooseStyle: [],
				chooseImageType: ['毛坯房'],
				keyWordIndex: 0,
				allKeyWord: {
					id: "space-01",
					imageType: ["毛坯房", "效果图"],
					space: ['客厅', '卧室', '厨房', '卫生间', '儿童房', '阳台'],
					style: ["侘寂", "工业", "欧式", "奶油风", "灰白色", "中式", "现代", "简约"]
				},
				basepathurl: 'https://mihuo-ai.obs.cn-east-3.myhuaweicloud.com/',
				params: '?x-image-process=image/resize,m_fixed,w_300/marker,u_plus',
				searchImages: [],
				createImgWord: '',
				textToImagesList: [],
				imagesToImagesList: [],
				intersetList: [],
				chooseSearchImages: [],
				chooseCreateImages: [],
				textToImageLoading: false,
				imageToImageLoading: false,
				pageNo: 1,
				placeholderStyle: "color:#999;font-size:14px",
				pageSize: 4,
				styles: {

				},
				touchNum: 0
			}
		},
		onLoad() {
			//this.getImages()
		},
		watch: {
			current(v1, v2) {
				this.chooseSpace = []
				this.chooseStyle = []
				this.createImgWord = ''
				this.word = ''
			}
		},
		methods: {
			wordChange(){
			 	this.chooseSpace = []
			 	this.chooseStyle = []
			},
			imageOptimize(item) {
				uni.setStorageSync("optimizeImage", item)
				this.toPage('/pages-common/inspirationOptimize/inspirationOptimize?name=' + item.name + '&id=' + item.id)
			},
			historyList() {
				this.toPage('/pages-common/inspirationHistory/inspirationHistory')
			},
			changeKeyWord() {
				this.keyWordIndex = this.keyWordIndex + 1 > 2 ? 0 : this.keyWordIndex + 1
			},
			changeBatch() {
				if (this.pageNo > 20) {
					this.$util.toast('没有更多了');
					return
				}
				this.pageNo++;
				this.getImages()

			},
			maskTouchend(item, data) {
				this.touchNum++
				setTimeout(() => {
					if (this.touchNum == 1) {
						this.$store.commit("SET_IMAGEPREVIEW", data);
						this.toPage('/pages-common/inspirationPreviewImage/inspirationPreviewImage?url=' + item
							.name + '&id=' +
							item.id)
					}
					if (this.touchNum >= 2) {
						this.intersetList.push(item)
					}
					this.touchNum = 0
				}, 250)
			},
			previewImage(item, data) {
				this.$store.commit("SET_IMAGEPREVIEW", data);
				this.toPage('/pages-common/inspirationPreviewImage/inspirationPreviewImage?url=' + item.name + '&id=' +
					item.id)
			},
			//开始制作
			startFabrication() {
				this.word = (this.chooseSpace.join() ? this.chooseSpace.join() + ',' : '') + (this.chooseStyle.join() ?
					this.chooseStyle.join() +
					'风格' : '') + this.createImgWord;
				if (!this.current) {
					if (this.current == 0 && !this.word) {
						this.$util.toast('文字灵感需要关键词信息');
						return
					}
					this.getImages()
					this.getTextToImages()
				} else {
					if (this.current == 1 && !this.localImage) {
						this.$util.toast('请选择图片');
						return;
					}
					if (!this.chooseImageType.length) {
						this.$util.toast('请选择图片类型');
						return
					}
					this.getImagesToImages()
				}
			},
			//搜索词语组合
			appendKeyword(mini, data) {
				if (data[0] == mini) {
					data.splice(0, 1)
					return
				}
				data.splice(0, 1)
				data.push(mini)
			},
			//检索的图片
			//这里是检索模型的检索图片
			getImages() {
				this.searchImages = [{}, {}, {}, {}]
				this.$http.get(
						`admin/ai/textSearchImage?text=${this.word}&pageNumber=${this.pageNo}&pageSize=${this.pageSize}`)
					.then(
						res => {
							console.log(res)
							if (res && res.length > 0) {
								this.searchImages = res.map(data => ({
									...data,
									name: data.fileName,
									checked: false,
									disabled: false
								}))
							}
						})
			},
			//文字生成的图片
			getTextToImages() {
				if (this.textToImageLoading) {
					this.$util.toast("正在为您生成,勿重复点击");
					return;
				}
				this.textToImageLoading = true
				this.textToImagesList = [{}, {}]
				this.$http.post('admin/ai/txt2img', {
					text: this.word
				}).then(res => {
					if (res && res.length) {
						this.textToImageLoading = false;
						this.textToImagesList = res.map(data => ({
							name: data.fileName,
							...data,
							checked: false,
							disabled: false
						}));
					}
				})
			},
			//图片生成的图片
			getImagesToImages() {
				if (this.imageToImageLoading) {
					this.$util.toast("正在为您生成,勿重复点击");
					return;
				}
				const guidance = this.chooseImageType[0] == "毛胚房" ? {
					controlnetGuidance: 2,
					denoisingStrength: 0.75
				} : {
					controlnetGuidance: 2,
					denoisingStrength: 0.6
				}
				const b64img = this.localImage.split(',')[1];
				this.imageToImageLoading = true;
				this.imagesToImagesList = [{}, {}]
				//console.log(b64img)
				this.$http.post('admin/ai/img2img', {
					img: b64img,
					text: this.word,
					...guidance
				}).then(res => {
					if (res && res.length) {
						this.imageToImageLoading = false;
						this.imagesToImagesList = res.map(data => ({
							name: data.fileName,
							...data,
							checked: false,
							disabled: false
						}));
					}
				})
			},
			//将数组合并到感兴趣的数组
			concatInteresttrArray(e) {

			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (data) => {
						pathToBase64(data.tempFilePaths[0]).then(res => {
							this.localImage = res;
						}); //先将本地图片路径转换成array类型
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageContent {
		height: 100vh;

		&.none {
			background: linear-gradient(to right, #E5FFF9, #E5E7FF);
			;
		}
	}

	.tabs {
		display: flex;
		background-color: transparent;
		padding: 30rpx 0;

		.tab_txtImage,
		.tab_imageToImage {
			flex: 1;
			text-align: center;
			background: none;
			background-color: transparent;
			color: #808080;
		}

		.tab_txtImage.active,
		.tab_imageToImage.active {
			color: #000000;
		}
	}

	.imageToImage {
		border-radius: 15px;
		text-align: center;
		padding: 20rpx 0;

		.iconContent {
			width: 200rpx;
			height: 200rpx;
			display: flex;
			margin: 0 auto 20rpx auto;
			align-items: center;
			justify-content: center;
			background: #F7F7F7;
			border-radius: 15px;

			.iconMini {
				width: 50rpx;
				height: 50rpx;
			}

			.localimage {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}

		.chooseImages {
			display: flex;
			text-align: center;
			justify-content: center;
			background: #FFFFFF;
			border-radius: 25px;
			line-height: 50rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
			margin: auto;
		}
	}

	.colorPage {
		background: linear-gradient(to right, #E5FFF9, #E5E7FF);
		padding-bottom: 40rpx;
	}

	/deep/ .u-checkbox__icon-wrap {
		// 使用/deep/对组件内样式修改
		overflow: inherit !important;
		background-color: #fff;
	}

	/deep/ .u-checkbox-group {
		justify-content: space-between;
	}

	.myInterest {
		padding: 23rpx 30rpx 30rpx 30rpx;

		.inTitle {
			margin-bottom: 23rpx;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
		}

		.choosed {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.imagesContentMy {
				text-align: center;
				width: 24%;

				.inImage {
					width: 100%;
					height: 160rpx;
					border-radius: 10rpx;
					margin-bottom: 20rpx;
				}
			}

			.optimize {
				background: #3CE5DA;
				border-radius: 25rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 50rpx;
				margin: 21rpx 26rpx;
			}
		}
	}

	.myInterest {
		background-color: #fff;
	}

	.imagesContent {
		margin: 0 30rpx;

		.searchTitle {
			display: flex;
			justify-content: space-between;

			.mini-title {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
			}

			.change {
				background: #F7F7F7;
				border: 1rpx solid #4D4D4D;
				border-radius: 32rpx;
				padding: 6rpx 16rpx;
				font-size: 20rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #4D4D4D;
			}
		}

		.createTitle {
			display: flex;

			.text {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				justify-content: space-between;
				margin-top: 53rpx;
			}
		}

		.searchContent {
			display: flex;
			margin-top: 22rpx;
			justify-content: space-between;

			.allSearch {
				width: 24%;
				position: relative;
				border-radius: 10rpx;
				height: 160rpx;

				&.image {
					background: #E5E7FF;
				}

				.checkBox {
					position: absolute;
					bottom: 6rpx;
					right: 6rpx;
				}
			}

			.searchImages {
				width: 100%;
				height: 160rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

			}

		}

		.createContent {
			display: flex;
			margin-top: 22rpx;
			justify-content: space-between;

			.allcreate {
				width: 24%;
				height: 160rpx;
				position: relative;
				text-align: center;
				border-radius: 10rpx;
				position: relative;

				&.image {
					background: #E5E7FF;
				}

				&.loading {
					&::before {
						position: absolute;
						content: '';
						top: 0;
						left: 0;
						width: 100%;
						height: 0%;
						transition: all 8s ease 0s;
						border-radius: 10rpx;
						background: linear-gradient(to bottom, #E5E7FF, #E5FFF9);
						animation: mymove 5s infinite;
						-webkit-animation: mymove 5s infinite;
						/*Safari and Chrome*/
					}
				}

				@keyframes mymove {
					from {
						height: 0%;
					}

					to {
						height: 100%;
					}
				}



				&.activate {
					display: flex;
					align-items: center;
					justify-content: center;
					background: #fff;
				}

				.restart {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #3CE5DA;
				}

				.iconImages {
					width: 36rpx;
					height: 36rpx;
					margin: auto;
					vertical-align: middle
				}

				.createBox {
					position: absolute;
					bottom: 6rpx;
					right: 6rpx;
				}
			}

			.createImages {
				width: 100%;
				height: 160rpx;
				background: #FFFFFF;
				border-radius: 10rpx;

			}
		}
	}

	.nav-bar-right {
		margin: 0 20rpx 0 0;
		font-size: 28rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 500;
		color: #000000;
	}

	.mybutton {
		background: #3CE6DA;
		border-radius: 50px;
		color: #fff;
		margin: 30rpx;
	}

	.inputText {
		font-size: 28rpx;

		.uni-easyinput__content {
			border: 0;
		}
	}

	/deep/ .is-textarea {
		background-color: #fff;
	}

	.middleContent {
		margin: 0 30rpx;

		.labelTitle {
			color: #666;
			font-size: 28rpx;
			font-weight: 600;
			margin: 30rpx 0 10rpx 0;
		}



		.titleDec {
			margin: 30rpx 0 20rpx 0;
			display: flex;
			align-items: center;

			.text {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
			}

			.icon {
				width: 24rpx;
				height: 24rpx;
				margin-left: 11rpx;
			}
		}

		.keyContent {
			display: flex;
			flex-wrap: wrap;

			.keyItem {
				background-color: #fff;
				color: #999;
				background: #F7F7F7;
				font-size: 24rpx;
				padding: 13rpx 29rpx;
				border: 2rpx solid #999;
				border-radius: 25rpx;
				margin: 20rpx 20rpx 0 0;

				&.active {
					color: #3CE5DA;
					background: #F7F7F7;
					font-size: 24rpx;
					padding: 13rpx 29rpx;
					border: 2rpx solid #3CE5DA
				}
			}
		}
	}
</style>