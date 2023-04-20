<template>
	<view class="image-show-contain" @click.stop="">
		<view class="item-image-all" v-for="(item, index) in fileList" :style="{ marginRight: right + 'rpx' }"
			:key="index">
			<image class="item-image" v-if="item.url && (item.type === 'img' || item.type === 'video')" :height="height"
				:style="{ width: width + 'rpx',height:height + 'rpx' }" @click="preview(index)" mode="aspectFill" border-radius="10"
				:src="item.type === 'video'? $util.thumbnailVideo(item.url) :$util.thumbnailImage(item.url ? item.url : '' ,true)">
			</image>

			<image v-if="item.type === 'video'" src="https://www.51mihuo.com/static/images/video-start.png" class="video-play-img" mode=""
				@click="videoPlay($util.thumbnailImage(item.url, false))"></image>
			<text class="file-num" v-if="index === (fileList.length - 1) && numViewShow" @click="viewMore">{{textViewShow?'更多':'收起'}}</text>

			<image class="item-image" v-if="item.type === 'doc'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx' }" @click="preview(index)" mode="aspectFill"
				:src="require(docIcon)" />
			<image class="item-image" v-if="item.type === 'pdf'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx'  }" @click="preview(index)" mode="aspectFill"
				:src="require(pdfIcon)" />
			<image class="item-image" v-if="item.type === 'xls'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx'  }" @click="preview(index)" mode="aspectFill"
				:src="require(xlsIcon)" />
			<image class="item-image" v-if="item.type === 'xlsx'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx'  }" @click="preview(index)" mode="aspectFill"
				:src="require(xlsIcon)" />
			<image class="item-image" v-if="item.type === 'zip'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx'  }" @click="preview(index)" mode="aspectFill"
				:src="require(zipIcon)" />
			<image class="item-image" v-if="item.type === 'ppt'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx' }" @click="preview(index)" mode="aspectFill"
				:src="require(pptIcon)" />
			<image class="item-image" v-if="item.type === 'cad'" style="border-radius: 10rpx"
				:style="{ width: width + 'rpx', height: height + 'rpx'  }" @click="preview(index)" mode="aspectFill"
				:src="require(cadIcon)" />
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
				default: 123,
			},
			height: {
				type: [String, Number],
				default: 123,
			},
			isCallback: {
				type: [String, Boolean],
				default: true,
			},
			goToView: {
				type: Function,
				default: null,
			},
		},
		data() {
			return {
				fileListNum: "",
				fileList: [],
				tempFileList: [],
				videoShow: false,
				videoSrc: "",
				numViewShow: false,
				textViewShow:true,
				previewShow: false,
				docIcon: "https://www.51mihuo.com/static/images/file_type/doc.png",
				pdfIcon: "https://www.51mihuo.com/static/images/file_type/pdf.png",
				xlsIcon: "https://www.51mihuo.com/static/images/file_type/xls.png",
				zipIcon: "https://www.51mihuo.com/static/images/file_type/zip.png",
				pptIcon: "https://www.51mihuo.com/static/images/file_type/ppt.png",
				cadIcon: "https://www.51mihuo.com/static/images/file_type/cad.png",
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
				if(this.textViewShow){
					this.fileList = this.fileList.slice(0, 3)
				}
				this.fileList = JSON.parse(JSON.stringify(this.fileList))
				this.fileList = this.fileList.filter(item =>item !== null)
			},
			setPreviewShow() {
				this.previewShow = !this.previewShow
			},
			videoPlay(url) {
				// uni.$emit("videoUpdate", {url: url});
				this.toPage(`/pages-common/full-screen/full-screen?url=${url}`);
			},
			getDealImage(val) {
				let tempList = val === true ? JSON.parse(this.imgSrc) : this.fileListTemp;
				this.tempFileList = val === true ? JSON.parse(this.imgSrc) : this.fileListTemp;
				this.resultsList = tempList
				if (tempList.length > 2) {
					this.fileList = tempList.slice(0, 3);
				} else {
					this.fileList = tempList;
				}
				if (tempList.length > 3) {
					this.numViewShow = true;
				}
				this.fileListNum = tempList.length - 3; // 产品说这里显示的不是总数量
			},
		},
	};
</script>

<style lang="scss" scoped>
	.image-show-contain {
		display: flex;
		flex-wrap: wrap;
		position: relative;

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
			}

			.video-play-img {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 13rpx;
				right: 15rpx;
			}
		}

		.item-image {
			border-radius: 10rpx;
			&:last-child {
				margin-right: 0rpx !important;
			}
		}
	}
</style>
