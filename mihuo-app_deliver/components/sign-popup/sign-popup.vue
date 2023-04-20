<template>
	<mihuo-popup ref="mihuoPopup" title="签名确认" height="600" mode="center" width="90%" v-model="showPopup"
		@close="close()" :buttonShow="true" @confirm="confirm" buttonShow :buttonList="buttonList" @click="getButton">
		<view class="canvas-contain" slot="other">
			<canvas canvas-id="myCanvas" id="myCanvas" :style="styleCanvas" @touchstart="touchstart"
				@touchmove="touchmove" @touchend="touchend" @touchcancel="touchcancel"></canvas>
		</view>
	</mihuo-popup>
</template>

<script>
	import {
		CommonUpload,
	} from '@/plugins/uploadPic.js';
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				option: {},
				showPopup: false,
				ctx: null,
				points: [],
				config: {
					width: 600, // 宽度
					height: 300, // 高度
					lineWidth: 5, // 线宽
					fillStyle: '#F6F7F9',
					strokeStyle: '#3D3D3D', // 线条颜色
					lineCap: 'round', // 线条的端点样式
					lineJoin: 'round', // 线条交汇处圆角
				},
				buttonList: [{
					name: '重置',
					active: false
				}, {
					name: '确认',
					active: true
				}]
			}
		},
		computed: {
			styleCanvas() {
				return {
					width: this.config.width + 'rpx',
					height: this.config.height + 'rpx',
				}
			}
		},
		mounted() {

		},
		onShow() {

		},
		watch: {
			value(val) {
				if (val) {
					this.open();
				} else if (!this.showPopup) {
					this.close();
				}
				this.showPopup = false;
			},
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			init() {
				this.showPopup = true
				setTimeout(() => {
					this.ctx = uni.createCanvasContext('myCanvas', this)
					this.setStyle()
					this.ctx.draw()
				}, 100)

			},
			setStyle() {
				this.ctx.beginPath()
				// 填充色
				this.ctx.setFillStyle(this.config.fillStyle)
				// 线条宽度
				this.ctx.setLineWidth(this.config.lineWidth)
				// 线条颜色
				this.ctx.setStrokeStyle(this.config.strokeStyle)
				// 线条交点样式
				this.ctx.setLineJoin(this.config.lineJoin)
				// 线条端点样式
				this.ctx.setLineCap(this.config.lineCap)
				// 绘制矩形
				this.ctx.fillRect(0, 0, this.config.width, this.config.height)
			},
			draw() {
				this.ctx.moveTo(this.points[0].x, this.points[0].y)
				for (let i = 0; i < this.points.length; i++) {
					this.ctx.lineTo(this.points[i].x, this.points[i].y)
				}
				this.ctx.stroke()
				this.ctx.draw(true)
			},
			touchstart(e) {
				let point = {
					x: e.changedTouches[0].x,
					y: e.changedTouches[0].y
				}
				this.points.push(point)
			},
			touchmove(e) {
				let point = {
					x: e.changedTouches[0].x,
					y: e.changedTouches[0].y
				}
				if ((point.x > 0 && point.x < uni.upx2px(this.config.width)) && (point.y > 0 && point.y < uni.upx2px(
						this.config.height))) {
					this.points.push(point)
					this.draw()
				}
			},
			touchend() {
				this.points = []
			},
			touchcancel() {
				this.points = []
			},
			open() {
				this.$nextTick(() => {
					this.init()
					this.$emit('open')
				})
			},
			getButton(item) {
				if (item.name == '重置') {
					this.ctx.clearRect(0, 0, this.config.width, this.config.height)
					this.points = []
					this.setStyle()
					this.ctx.draw()
				}
			},
			close() {
				this.$nextTick(() => {
					this.$emit('close')
					this.showPopup = false
				})
			},
			confirm() {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: res => {
						CommonUpload(res.tempFilePath).then((result) => {
							this.$emit('success', result)
						})
						return
						// #ifndef H5
						this.pathToBase64(res.tempFilePath).then(t => {
							this.base64ToPath(t).then(data => {
								this.$emit('success', result)
							}).catch((e) => {
								this.$util.toast('生成签名错误！')
							})
						}).catch((e) => {
							console.log(e)
						})
						// #endif
						// #ifdef H5
						this.base64ToPath(res.tempFilePath).then(t => {
							CommonUpload(t).then((result) => {
								this.$emit('success', result)
								this.hideModal()
							})
						}).catch((e) => {
							this.$util.toast('生成签名错误！')
						})
						// #endif
					},
					fail: e => {
						console.log(e)
					}
				}, this)
			},
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
						return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], {
							type: type
						})))
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
						if (!biggerThan(plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472', plus.runtime
								.innerVersion)) {
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
											writer.writeAsBinary(dataUrlToBase64(
												base64))
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
			},
			pathToBase64(path) {
				function getLocalFilePath(path) {
					if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 ||
						path.indexOf('_downloads') === 0) {
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
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	
	/deep/ .u-drawer-content{
		background-color: initial;
	}
	
	.canvas-contain {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
