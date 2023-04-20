<template>
	<block>
		<image :src="resource" :mode="mode" :lazy-load="lazyLoad" :fade-show="fadeShow" :webp="webp"
			:show-menu-by-longpress="showMenuByLongpress" :style="[style]" @tap="fnEvent('click', $event)"
			@error="fnEvent('error', $event)" @load="fnEvent('load', $event)">
		</image>
	</block>
</template>
<script>
	// #ifdef APP-PLUS
	import path from 'path'
	import imConfig from "@/config/baseUrl.js"
	// #endif

	/**
	 * ImgCache 图片缓存
	 * @description APP端图片缓存
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=2515
	 * @property {string} src 图片资源地址
	 * @property {string} mode 图片裁剪、缩放的模式
	 * @property {boolean} lazyLoad 是否图片懒加载
	 * @property {boolean} fade-show 图片显示动画效果
	 * @property {boolean} webp 默认不解析 webP 格式，只支持网络资源
	 * @property {boolean} show-menu-by-longpress 开启长按图片显示识别小程序码菜单
	 * @property {string} dir 缓存的文件目录，文件夹开头不能有_
	 * @property {string} width 宽度，单位任意，如果为数值，则为 rpx 单位
	 * @property {string} height 高度，单位任意，如果为数值，则为 rpx 单位
	 * @property {object} custom-style 自定义样式
	 * @event {Function} click 点击图片
	 * @event {Function} error 错误发生
	 * @event {Function} load 图片载入完毕
	 * @example <image-cache src="https://example.com/image.png"></mh-img-cache>
	 */
	let queue = [];
	export default {
		props: {
			lazy: {
				type: Boolean,
				default: true
			},
			src: {
				type: String
			},
			mode: {
				type: String,
				default: 'aspectFit'
			},
			lazyLoad: {
				type: Boolean,
				default: false
			},
			fadeShow: {
				type: Boolean,
				default: true
			},
			webp: {
				type: Boolean,
				default: false
			},
			showMenuByLongpress: {
				type: Boolean,
				default: false
			},
			dir: {
				type: String,
				default: 'funimgcache'
			},
			width: {
				type: [String, Number]
			},
			height: {
				type: [String, Number]
			},
			customStyle: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				resource: '',
				islocal: false,
			}
		},
		computed: {
			style() {
				const style = {
					willChange: 'transform'
				}

				// 判断传过来的值是否为 undefined null false ''
				const isEmpty = val => [undefined, null, false, ''].includes(val);
				!isEmpty(this.width) && (style.width = this.addUnit(this.width));
				!isEmpty(this.height) && (style.height = this.addUnit(this.height));
				return {
					...style,
					...this.customStyle
				}
			}
		},
		watch: {
			src: {
				handler: 'init',
				immediate: true
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// 初始化
			init() {
				this.fnCache();
			},
			// 获取缓存
			async fnCache() {
				const url = this.src // 赋值到新变量，避免下载时 src 更改，从而网络地址和本地地址图片不一致
				if (!/^https?:\/\//.test(url)) {
					this.resource = url;
				}; // 判断是否网络地址
				// #ifdef APP
				this.download(url, this.dir)
				// #endif
				// #ifndef APP
				this.resource = url;
				// #endif		
			},
			// 添加单位，如果为数值则为rpx单位，否则直接返回
			addUnit(value) {
				value = String(value)
				return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? `${value}rpx` : value
			},
			// 发送事件
			fnEvent(emit, event) {
				this.$emit(emit, event)
			},
			//这里的数据是暂时存为缓存 不是im的聊天记录。
			download(url, dir) {
				return new Promise(resolve => {
					uni.downloadFile({
						url: url,
						success: (res) => {
							this.resource = res.tempFilePath;
						}
					})
				})
			},
			//这里我们创建im的聊天文件的缓存
			filename(url, dir) {
				const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
				let random = ''
				for (let i = 0; i < 4; i++) {
					const index = parseInt(Math.random() * CHARS.length)
					random += CHARS[index]
				}

				dir = dir.replace(/(^\/)|(\/$)/g, '')
				const name = Date.now() + random + path.extname(url)
				return `_doc/${dir}/${name}`
			}
		}
	}
</script>
<style lang="scss" scoped>
	image {
		height: 100%;
		width: 100%;
	}
</style>
