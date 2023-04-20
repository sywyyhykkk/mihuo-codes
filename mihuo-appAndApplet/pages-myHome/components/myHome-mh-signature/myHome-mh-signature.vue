<template>
    <u-popup 
		v-model="show" 
		@close="hideModal" 
		mode="center" 
		:mask-close-able="false"
		>
        <view class="canvas-item">
			<view class="canvas-top">
				<view>{{ title }}</view>
				<u-icon name="close" size="28" @click="hideModal()"></u-icon>
			</view>
            <view class="canvas-container">
                <canvas
                    class="canvas-my"
					canvas-id="canvas"
                    id="canvas" 
					:style="[styleCanvas]"
					:disable-scroll="true"
                    @touchstart="handleTouchStart($event)" @touchmove="handleTouchMove($event)" @touchend="handleTouchEnd($event)"
                    @touchcancel="handleEnd($event)"></canvas>
            </view>
            <view class="btn-container">
                <view class="confirm bg-blue" @click="handleConfirm()">确定</view>
                <view class="reset line-gray" @click="reset()">重置</view>
            </view>
        </view>
    </u-popup>
</template>

<script>
	var context = null;
	var index = 0;
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	export default {
		props: {
			value: {
				type: Boolean,
				default:()=> false
			},
			// 标题
			title:{
				type: String,
				default:()=> "签字"
			},
            // 设置线宽
            lineWidth:{
                type:Number,
                default:()=> 3
            },
            // 线条颜色
            strokeColor:{
                type:String,
                default: ()=> '#000000'
            },
            height:{
                type:[String,Number],
                default: ()=> 400
            },
            width:{
                type:[String,Number],
                default: ()=> 680
            },
		},
		data() {
			return {
				canvasData: [],
                show:false,
			};
		},
        mounted() {
			setTimeout(() => {
				this.show = this.value;
				if(this.value){
					context = uni.createCanvasContext('canvas',this)
					context.setLineWidth(this.lineWidth) // 线条宽度
					context.setStrokeStyle(this.strokeColor) // 线条颜色
					context.setFillStyle('#dcdfe6')
					context.setFillStyle('#F6F7F9') // 填充色
					// context.draw(true)
					// this.reset()
				}
			}, 50);
        },
		computed:{
			styleCanvas(){
				return {
					width: this.width + 'rpx',
					height: this.height + 'rpx',
				}
			}
		},
		watch: {
			canvasData() {
				context.moveTo(this.canvasData[0].x, this.canvasData[0].y)
				for (let i = 0; i < this.canvasData.length; i++) {
					context.lineTo(this.canvasData[i].x, this.canvasData[i].y)
				}
				context.stroke()
				context.draw(true)
			}
		},
		methods: {
			reset() {
				context.draw()
			},
			hideModal() {
				this.$emit('input', false)
			},
			handleTouchStart(e) {
				this.canvasData = []
				const a = e.changedTouches[0]
				this.canvasData.push({
					x: a.x,
					y: a.y
				})
			},
			handleTouchMove(e) {
				const a = e.changedTouches[0]
				this.canvasData.push({
					x: a.x,
					y: a.y
				})
			},
			handleTouchEnd(e) {
				const a = e.changedTouches[0]
				this.canvasData.push({
					x: a.x,
					y: a.y
				})
			},
			handleEnd() {
				context.stroke()
				context.draw(true)
			},
			handleConfirm() {
				uni.canvasToTempFilePath({
					canvasId: 'canvas',
					success: res => {
						// #ifndef H5
							this.pathToBase64(res.tempFilePath).then(t=>{
								this.base64ToPath(t).then(data=>{
									CommonUpload(data).then((result) => {
										this.$emit('success',result)
										this.hideModal()
									})
								}).catch((e)=>{
									this.$util.toast('生成签名错误！')
								})
							}).catch((e)=>{
								console.log(e)
							})
						// #endif
						// #ifdef H5
							this.base64ToPath(res.tempFilePath).then(t=>{
								CommonUpload(t).then((result) => {
									this.$emit('success',result)
									this.hideModal()
								})
							}).catch((e)=>{
								this.$util.toast('生成签名错误！')
							})
						// #endif
					},
					fail: e =>{
						console.log(e)
					}
				},this)
			},

			// 将文件路径转化为bas64
			pathToBase64(path) {
				function getLocalFilePath(path) {
					if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 || path.indexOf('_downloads') === 0) {
						return path
					}
					if (path.indexOf('file://') === 0) {
						return path
					}
					if (path.indexOf('/storage/emulated/0/') === 0) {
						return path
					}
					if (path.indexOf('/') === 0) {
						var localFilePath = plus.io.convertAbsoluteFileSystem(path)
						if (localFilePath !== path) {
							return localFilePath
						} else {
							path = path.substr(1)
						}
					}
					return '_www/' + path
				}
				return new Promise(function(resolve, reject) {
					if (typeof window === 'object' && 'document' in window) {
						if (typeof FileReader === 'function') {
							var xhr = new XMLHttpRequest()
							xhr.open('GET', path, true)
							xhr.responseType = 'blob'
							xhr.onload = function() {
								if (this.status === 200) {
									let fileReader = new FileReader()
									fileReader.onload = function(e) {
										resolve(e.target.result)
									}
									fileReader.onerror = reject
									fileReader.readAsDataURL(this.response)
								}
							}
							xhr.onerror = reject
							xhr.send()
							return
						}
						var canvas = document.createElement('canvas')
						var c2x = canvas.getContext('2d')
						var img = new Image
						img.onload = function() {
							canvas.width = img.width
							canvas.height = img.height
							c2x.drawImage(img, 0, 0)
							resolve(canvas.toDataURL())
							canvas.height = canvas.width = 0
						}
						img.onerror = reject
						img.src = path
						return
					}
					if (typeof plus === 'object') {
						plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), function(entry) {
							entry.file(function(file) {
								var fileReader = new plus.io.FileReader()
								fileReader.onload = function(data) {
									resolve(data.target.result)
								}
								fileReader.onerror = function(error) {
									reject(error)
								}
								fileReader.readAsDataURL(file)
							}, function(error) {
								reject(error)
							})
						}, function(error) {
							reject(error)
						})
						return
					}
					if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
						wx.getFileSystemManager().readFile({
							filePath: path,
							encoding: 'base64',
							success: function(res) {
								resolve('data:image/png;base64,' + res.data)
							},
							fail: function(error) {
								reject(error)
							}
						})
						return
					}
					reject(new Error('not support'))
				})
			},
			// 将bas64转化为文件路径
			base64ToPath(base64) {
				function biggerThan(v1, v2) {
					var v1Array = v1.split('.')
					var v2Array = v2.split('.')
					var update = false
					for (var index = 0; index < v2Array.length; index++) {
						var diff = v1Array[index] - v2Array[index]
						if (diff !== 0) {
							update = diff > 0
							break
						}
					}
					return update
				}
				function dataUrlToBase64(str) {
					var array = str.split(',')
					return array[array.length - 1]
				}
				function getNewFileId() {
					return Date.now() + String(index++)
				}
				return new Promise(function(resolve, reject) {
					if (typeof window === 'object' && 'document' in window) {
						base64 = base64.split(',')
						var type = base64[0].match(/:(.*?);/)[1]
						var str = atob(base64[1])
						var n = str.length
						var array = new Uint8Array(n)
						while (n--) {
							array[n] = str.charCodeAt(n)
						}
						return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], { type: type })))
					}
					var extName = base64.split(',')[0].match(/data\:\S+\/(\S+);/)
					if (extName) {
						extName = extName[1]
					} else {
						reject(new Error('base64 error'))
					}
					var fileName = getNewFileId() + '.' + extName
					if (typeof plus === 'object') {
						var basePath = '_doc'
						var dirPath = 'uniapp_temp'
						var filePath = basePath + '/' + dirPath + '/' + fileName
						if (!biggerThan(plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472', plus.runtime.innerVersion)) {
							plus.io.resolveLocalFileSystemURL(basePath, function(entry) {
								entry.getDirectory(dirPath, {
									create: true,
									exclusive: false,
								}, function(entry) {
									entry.getFile(fileName, {
										create: true,
										exclusive: false,
									}, function(entry) {
										entry.createWriter(function(writer) {
											writer.onwrite = function() {
												resolve(filePath)
											}
											writer.onerror = reject
											writer.seek(0)
											writer.writeAsBinary(dataUrlToBase64(base64))
										}, reject)
									}, reject)
								}, reject)
							}, reject)
							return
						}
						var bitmap = new plus.nativeObj.Bitmap(fileName)
						bitmap.loadBase64Data(base64, function() {
							bitmap.save(filePath, {}, function() {
								bitmap.clear()
								resolve(filePath)
							}, function(error) {
								bitmap.clear()
								reject(error)
							})
						}, function(error) {
							bitmap.clear()
							reject(error)
						})
						return
					}
					if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
						var filePath = wx.env.USER_DATA_PATH + '/' + fileName
						wx.getFileSystemManager().writeFile({
							filePath: filePath,
							data: dataUrlToBase64(base64),
							encoding: 'base64',
							success: function() {
								resolve(filePath)
							},
							fail: function(error) {
								reject(error)
							}
						})
						return
					}
					reject(new Error('not support'))
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	:deep(.u-mode-center-box){
		width: 100% !important;
	}
    .canvas-item{
        width: 100%rpx;
        border-radius: 10rpx;
        padding: 20rpx;
        border-radius: 10rpx;
		.canvas-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 20rpx;
		}
    }
	.canvas-container {
        margin-bottom: 40rpx;
        .canvas-my{
            background: #F7F7F7;
        }
	}
	.btn-container {
		padding-bottom: 20rpx;
		display: flex;
		justify-content: space-around;
        view{
            font-size: 28rpx; 
            border-radius: 10rpx;
            padding: 10rpx 30rpx;
        }
        .reset{
            border: 2rpx solid #dcdfe6;
        }
	}
</style>
