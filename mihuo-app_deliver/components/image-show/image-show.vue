<template>
	<view class="image-show-contain" @click.stop="">
		<view class="item-image-all" v-for="(item, index) in fileList" :style="{ marginRight: right + 'rpx' }"
			:key="index">
			<u-lazy-load class="item-image" v-if="item.url && (item.type === 'img' || item.type === 'video')"
				:height="height" :style="{ width: width + 'rpx' }" @click="preview(index)" imgMode="aspectFill"
				border-radius="10"
				:image="item.type === 'video'? $util.thumbnailVideo(item.url) :$util.thumbnailImage(item.url ? item.url : '' ,true)">
			</u-lazy-load>
			<image v-if="item.type === 'video'" src="/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay($util.thumbnailImage(item.url, false))"></image>
			<text class="file-num" v-if="index === (fileList.length - 1) && numViewShow && !morePosition"
				@click="viewMore">{{textViewShow?'更多':'收起'}}</text>
			<view class="file-num_min" :style="{ width: width + 'rpx' }"
				v-if="index === (fileList.length - 1) && numViewShow && morePosition" @click="viewMore">
				<text class="file-num_min_text">{{textViewShow?'更多':'收起'}}</text>
			</view>
			<image class="item-image" v-if="item.type !== 'img' && item.type !== 'video' " style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx' }" @click="preview(index)" mode="aspectFill"
				:src="setFileType(item.type)" />
		</view>
	</view>
</template>

<script>
	/**
	 * @description 图片显示
	 * @property {String}			  imgSrc       图片路径  例如 :"[{\"type\":\"img\",\"url\":\"9e6bdaa10e7a4eb888b1c433b4feb407.jpg\"}]"
	 * @property {String || Boolean}  open         是否使用默认图片、默认关闭
	 * @property {String | Number}	  right        图片右边距
	 * @property {String | Number}	  width 	   图片宽
	 * @property {String | Number}	  height       图片高
	 * @property {String | Boolean}	  isCallback   是否使用图片点击默认回调， 默认使用，点击时预览图片
	 * @property {String | Boolean}	  enable   是否启用每行显示个数
	 * @property {String | Boolean}	  quantityPerLine   每行显示个数
	 */
	export default {
		props: {
			imgSrc: {
				type: "",
				default: "",
			},
			open: {
				type: [String, Boolean],
				default: false,
			},
			right: {
				type: [String, Number],
				default: 20,
			},
			width: {
				type: [String, Number],
				default: 154,
			},
			height: {
				type: [String, Number],
				default: 154,
			},
			isCallback: {
				type: [String, Boolean],
				default: true,
			},
			goToView: {
				type: Function,
				default: null,
			},
			enable: {
				type: Boolean,
				default: false,
			},
			quantityPerLine: {
				type: [String, Number],
				default: 3,
			},
			morePosition: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				fileList: [],
				tempFileList: [],
				videoShow: false,
				videoSrc: "",
				numViewShow: false,
				textViewShow: true,
				previewShow: false,
				fileType: [{
						url: require("../../static/images/file_type/doc.png"),
						type: 'doc'
					},
					{
						url: require("../../static/images/file_type/pdf.png"),
						type: 'pdf'
					},
					{
						url: require("../../static/images/file_type/xls.png"),
						type: 'xls'
					},
					{
						url: require("../../static/images/file_type/xls.png"),
						type: 'xlsx'
					},
					{
						url: require("../../static/images/file_type/zip.png"),
						type: 'zip'
					},
					{
						url: require("../../static/images/file_type/ppt.png"),
						type: 'ppt'
					},
					{
						url: require("../../static/images/file_type/ppt.png"),
						type: 'pptx'
					},
					{
						url: require("../../static/images/file_type/cad.png"),
						type: 'cad'
					},
					{
						url: require("../../static/images/file_type/doc.png"),
						type: 'doc'
					},
					{
						url: require("../../static/images/file_type/doc.png"),
						type: 'docx'
					}
				],
				// docIcon: require("../../static/images/file_type/doc.png"),
				// pdfIcon: require("../../static/images/file_type/pdf.png"),
				// xlsIcon: require("../../static/images/file_type/xls.png"),
				// zipIcon: require("../../static/images/file_type/zip.png"),
				// pptIcon: require("../../static/images/file_type/ppt.png"),
				// cadIcon: require("../../static/images/file_type/cad.png"),
				defaultIcon: require("../../static/images/file_type/default.png"),
				fileListTemp: [{
						url: "5c56e4c84f794a66a421a25baece4591.jfif",
						type: "img",
					},
					{
						url: "f5855a6263044a22a9eac3bada4e7284.jpg",
						type: "img",
					},
					{
						url: "1686fdf6c7a249ac9f29a371a1adb3cc.jfif",
						type: "img",
					},
					{
						url: "1686fdf6c7a249ac9f29a371a1adb3cc.jfif",
						type: "img",
					},
				],
				resultsList: [],
			};
		},
		mounted() {
			if (this.imgSrc !== "" && JSON.parse(this.imgSrc)) {
				this.getDealImage(true);
			} else if (this.open) {
				this.getDealImage(false);
			}
		},
		methods: {
			setFileType(type) {
				let tempFile = this.fileType.find(item => item.type == type)
				if (tempFile) {
					return tempFile.url
				} else {
					return this.defaultIcon
				}
			},
			preview(index) {
				if (this.isCallback) {
					if (this.fileList[index].type !== 'img') {
						return
					}
					let photoList = [];
					this.tempFileList.forEach(item => {
						if (item.type === "img") {
							photoList.push(this.$util.thumbnailImage(item.url, false))
						}
					})
					if (photoList.length === 0) {
						return;
					}
					uni.previewImage({
						current: index,
						urls: photoList,
						loop: true,
						indicator: 'number'
					});
				} else {
					this.$emit("goToView");
				}
			},
			viewMore() { // 查看更多
				this.fileList = this.resultsList
				this.textViewShow = !this.textViewShow
				if (this.textViewShow) {
					if (this.enable) {
						this.fileList = this.fileList.slice(0, Number(this.quantityPerLine))
					} else {
						this.fileList = this.fileList.slice(0, 3)
					}
				}
				this.fileList = JSON.parse(JSON.stringify(this.fileList))
				this.fileList = this.fileList.filter(item => item !== null)
				this.$emit('viewMore')
			},
			setPreviewShow() {
				this.previewShow = !this.previewShow
			},
			videoPlay(url) {
				// uni.$emit("videoUpdate", {url: url});
				// this.toPage(`/pages/full-screen/videoPlayPage?url=${url}`);
				this.toPage(`/pages/full-screen/full-screen?url=${url}`);
			},
			getDealImage(val) {
				let tempList = val === true ? JSON.parse(this.imgSrc) : this.fileListTemp;
				this.tempFileList = val === true ? JSON.parse(this.imgSrc) : this.fileListTemp;
				this.resultsList = tempList

				if (this.enable) {
					if (tempList.length > (Number(this.quantityPerLine))) {
						this.fileList = tempList.slice(0, Number(this.quantityPerLine));
					} else {
						this.fileList = tempList;
					}
				} else {
					if (tempList.length > 2) {
						this.fileList = tempList.slice(0, 3);
					} else {
						this.fileList = tempList;
					}
				}

				if (this.enable) {
					if (tempList.length > Number(this.quantityPerLine)) {
						this.numViewShow = true;
					}
				} else {
					if (tempList.length > 3) {
						this.numViewShow = true;
					}
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.image-show-contain {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		// width: 100%;

		.item-image-all {
			position: relative;
			margin-bottom: 20rpx;

			.file-num {
				position: absolute;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 30rpx;
				color: #ffffff;
				font-size: 24rpx;
				transform: scale(0.85);
				right: 8rpx;
				bottom: 8rpx;
				text-align: center;
				line-height: 40rpx;
				display: inline-block;
				width: 86rpx;
				height: 40rpx;
				z-index: 1;
			}

			.file-num_min {
				position: absolute;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 0rpx 0rpx 10rpx 10rpx;
				bottom: 0rpx;
				text-align: center;
				line-height: 40rpx;
				height: 40rpx;
				z-index: 1;

				.file-num_min_text {
					font-size: 24rpx;
					transform: scale(0.85);
					color: #ffffff;
					transform-origin: center;
					display: inline-block;
				}
			}

			.video-play-img {
				position: absolute;
				width: 50rpx;
				height: 50rpx;
				top: 50%;
				left: 50%;
				transform: translateX(-50%) translateY(-50%);
			}
		}

		.item-image {
			&:last-child {
				margin-right: 0rpx !important;
			}
		}
	}
</style>
