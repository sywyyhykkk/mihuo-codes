<template>
	  <!-- opacity: Number(opacity), -->
	<view class="u-wrap" :style="{
			  borderRadius: borderRadius + 'rpx',
			  // 因为time值需要改变,所以不直接用duration值(不能改变父组件prop传过来的值)
			  transition: `opacity ${time / 1000}s ease-in-out`
		   }"
	 :class="'u-lazy-item-' + elIndex">
		<view :class="'u-lazy-item-' + elIndex">
			<image :style="{borderRadius: borderRadius + 'rpx', height: imgHeight}" v-if="!isError" class="u-lazy-item"
			 :src="isShow ? image ? image : loadingImg  : loadingImg" :mode="imgMode" @load="imgLoaded" @error="loadError" @tap="clickImg"></image>
			<image :style="{borderRadius: borderRadius + 'rpx', height: imgHeight}" class="u-lazy-item error" v-else :src="errorImg"
			 :mode="imgMode" @load="errorImgLoaded" @tap="clickImg"></image>
			 <!-- <text>{{image}}</text> -->
		</view>
	</view>
</template>

<script>
	/**
	 * lazyLoad 懒加载
	 * @description 懒加载使用的场景为：页面有很多图片时，APP会同时加载所有的图片，导致页面卡顿，各个位置的图片出现前后不一致等.
	 * @tutorial https://www.uviewui.com/components/lazyLoad.html
	 * @property {String Number} index 用户自定义值，在事件触发时回调，用以区分是哪个图片
	 * @property {String} image 图片路径
	 * @property {String} loading-img 预加载时的占位图
	 * @property {String} error-img 图片加载出错时的占位图
	 * @property {String} threshold 触发加载时的位置，见上方说明，单位 rpx（默认300）
	 * @property {String Number} duration 图片加载成功时，淡入淡出时间，单位ms（默认）
	 * @property {String} effect 图片加载成功时，淡入淡出的css动画效果（默认ease-in-out）
	 * @property {Boolean} is-effect 图片加载成功时，是否启用淡入淡出效果（默认true）
	 * @property {String Number} border-radius 图片圆角值，单位rpx（默认0）
	 * @property {String Number} height 图片高度，注意：实际高度可能受img-mode参数影响（默认450）
	 * @property {String Number} mg-mode 图片的裁剪模式，详见image组件裁剪模式（默认widthFix）
	 * @event {Function} click 点击图片时触发
	 * @event {Function} load 图片加载成功时触发
	 * @event {Function} error 图片加载失败时触发
	 * @example <u-lazy-load :image="image" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load>
	 */
	export default {
		name: 'u-lazy-load',
		props: {
			index: {
				type: [Number, String]
			},
			// 要显示的图片
			image: {
				type: String,
				default: ''
			},
			// 图片裁剪模式
			imgMode: {
				type: String,
				default: 'widthFix'
			},
			// 占位图片路径
			loadingImg: {
				type: String,
				default:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3NUYyNEFGNEU1QzExRUNCRjVDQTM3QUZDQTdFODA2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3NUYyNEIwNEU1QzExRUNCRjVDQTM3QUZDQTdFODA2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjc1RjI0QUQ0RTVDMTFFQ0JGNUNBMzdBRkNBN0U4MDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc1RjI0QUU0RTVDMTFFQ0JGNUNBMzdBRkNBN0U4MDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5iRvTHAAAMyUlEQVR42uyd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'
			},
			// 加载失败的错误占位图
			errorImg: {
				type: String,
				default:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQwREQ3QTI3NEU1RDExRUNBNUU2RThDNDdGQzQxRDA2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQwREQ3QTI4NEU1RDExRUNBNUU2RThDNDdGQzQxRDA2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDBERDdBMjU0RTVEMTFFQ0E1RTZFOEM0N0ZDNDFEMDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDBERDdBMjY0RTVEMTFFQ0E1RTZFOEM0N0ZDNDFEMDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50kSXBAAAKCklEQVR42uyd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'
			},
			// 图片进入可见区域前多少像素时，单位rpx，开始加载图片
			// 负数为图片超出屏幕底部多少距离后触发懒加载，正数为图片顶部距离屏幕底部多少距离时触发(图片还没出现在屏幕上)
			threshold: {
				type: [Number, String],
				default: 100
			},
			// 淡入淡出动画的过渡时间
			duration: {
				type: [Number, String],
				default: 500
			},
			// 渡效果的速度曲线，各个之间差别不大，因为这是淡入淡出，且时间很短，不是那些变形或者移动的情况，会明显
			// linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);
			effect: {
				type: String,
				default: 'ease-in-out'
			},
			// 是否使用过渡效果
			isEffect: {
				type: Boolean,
				default: true
			},
			// 圆角值
			borderRadius: {
				type: [Number, String],
				default: 0
			},
			// 图片高度，单位rpx
			height: {
				type: [Number, String],
				default: '450'
			}
		},
		data() {
			return {
				isShow: false,
				opacity: 1,
				time: this.duration,
				loadStatus: '', // 默认是懒加载中的状态
				isError: false, // 图片加载失败
				elIndex: this.$u.guid()
			}
		},
		computed: {
			// 将threshold从rpx转为px
			getThreshold() {
				// 先取绝对值，因为threshold可能是负数，最后根据this.threshold是正数或者负数，重新还原
				let thresholdPx = uni.upx2px(Math.abs(this.threshold));
				return this.threshold < 0 ? -thresholdPx : thresholdPx;
			},
			// 计算图片的高度，可能为auto，带%，或者直接数值
			imgHeight() {
				return this.$u.addUnit(this.height);
			}
		},
		created() {
			// 由于一些特殊原因，不能将此变量放到data中定义
			this.observer = {};
		},
		watch: {
			isShow(nVal) {
				// 如果是不开启过渡效果，直接返回
				if (!this.isEffect) return;
				this.time = 0;
				// 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
				this.opacity = 0;
				// 延时30ms，否则在浏览器H5，过渡效果无效
				setTimeout(() => {
					this.time = this.duration;
					this.opacity = 1;
				}, 30)
			},
			// 图片路径发生变化时，需要重新标记一些变量，否则会一直卡在某一个状态，比如isError
			image(n) {
				if(!n) {
					// 如果传入null或者''，或者undefined，标记为错误状态
					this.isError = true;
				} else {
					this.init();
					this.isError = false;
				}
			}
		},
		methods: {
			// 用于重新初始化
			init() {
				this.isError = false;
				this.loadStatus = '';
			},
			// 点击图片触发的事件,loadlazy-还是懒加载中状态，loading-图片正在加载，loaded-图片加加载完成
			clickImg() {
				let whichImg = '';
				// 如果isShow为false，意味着图片还没开始加载，点击的只能是最开始的占位图
				if (this.isShow == false) whichImg = 'lazyImg';
				// 如果isError为true，意味着图片加载失败，这是只剩下错误的占位图，所以点击的只能是错误占位图
				// 当然，也可以给错误的占位图元素绑定点击事件，看你喜欢~
				else if (this.isError == true) whichImg = 'errorImg';
				// 总共三张图片，除了两个占位图，剩下的只能是正常的那张图片了
				else whichImg = 'realImg';
				// 只通知当前图片的index
				this.$emit('click', this.index);
			},
			// 图片加载完成事件，可能是加载占位图时触发，也可能是加载真正的图片完成时触发，通过isShow区分
			imgLoaded() {
				// 占位图加载完成
				if (this.loadStatus == '') {
					this.loadStatus = 'lazyed';
				}
				// 真正的图片加载完成
				else if (this.loadStatus == 'lazyed') {
					this.loadStatus = 'loaded';
					this.$emit('load', this.index);
				}
			},
			// 错误的图片加载完成
			errorImgLoaded() {
				this.$emit('error', this.index);
			},
			// 图片加载失败
			loadError() {
				this.isError = true;
			},
			disconnectObserver(observerName) {
				const observer = this[observerName];
				observer && observer.disconnect();
			},
		},
		beforeDestroy() {
			// 销毁页面时，可能还没触发某张很底部的懒加载图片，所以把这个事件给去掉
			//observer.disconnect();
		},
		mounted() {
			// 此uOnReachBottom事件由mixin.js发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
			this.$nextTick(() => {
				uni.$once('uOnReachBottom', () => {
					if (!this.isShow) this.isShow = true;
				});
			})
			// mounted的时候，不一定挂载了这个元素，延时30ms，否则会报错或者不报错，但是也没有效果
			setTimeout(() => {
				// 这里是组件内获取布局状态，不能用uni.createIntersectionObserver，而必须用this.createIntersectionObserver
				this.disconnectObserver('contentObserver');
				const contentObserver = uni.createIntersectionObserver(this);
				// 要理解这里怎么计算的，请看这个：
				// https://blog.csdn.net/qq_25324335/article/details/83687695
				contentObserver.relativeToViewport({
					bottom: this.getThreshold,
				}).observe('.u-lazy-item-' + this.elIndex, (res) => {
					if (res.intersectionRatio > 0) {
						// 懒加载状态改变
						this.isShow = true;
						// 如果图片已经加载，去掉监听，减少性能的消耗
						this.disconnectObserver('contentObserver');
					}
				})
				this.contentObserver = contentObserver;
			}, 30)
		}
	}
</script>

<style scoped lang="scss">
	@import "../../libs/css/style.components.scss";

	.u-wrap {
		background-color: #fff;
		overflow: hidden;
	}

	.u-lazy-item {
		width: 100%;
		// 骗系统开启硬件加速
		transform: transition3d(0, 0, 0);
		// 防止图片加载“闪一下”
		will-change: transform;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
</style>
