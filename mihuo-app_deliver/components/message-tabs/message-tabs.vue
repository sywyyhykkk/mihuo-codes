<template>
	<view class="message-tabs">
		<view class="message-tabs-wrap">
			<view class="message-tab" v-for="(item,index) in items" :key="index" @click="_onClick(index)"
			:style="{
				width: iwidth,
				color: index === currentIndex ? activeColor : defaultColor
				}"
				>
				<slot v-bind:item="item">
					<text :style="{color: index === currentIndex ? activeColor : defaultColor}" class="item-title" :class="dots[index] ? 'dot-show' : ''">{{item}}</text>
				</slot>
			</view>
		</view>
		<view class="message-tabs-bar" :style="{
			width: iwidth,
			transform: moveDistance,
			marginTop: lineTop
		}">
			<view class="message-bottom-line"
			:style="{
				height: lineHeight,
				width: lineWidth,
			}"
			>			
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			items: {
				type: Array,
				default() {
					return ['已完成', '未完成']
				}
			},
			current: {
				type: Number,
				default: 0
			},
			defaultColor: {
				type: String,
				default: '#333'
			},
			activeColor: {
				type: String,
				default: '#002FA5'
			},
			tabHeight: {
				type: String,
				default: '60upx'
			},
			lineHeight: {
				type: String,
				default: '3px'
			},
			lineWidth: {
				type: String,
				default: '40%'
			},
			lineTop: {
				type: String,
				default: '0px'
			}
		},
		computed: {
			iwidth() {
				const num = this.items.length;
				let w = '100%';
				if (num > 0) {
					w = (100 / (num*2)) + '%';
				}
				return w;
			},
			moveDistance() {
				let d = '';
				d = (this.currentIndex+1) * 100 + '%'
				return `translate3d(${d}, 0, 0)`;
			}
		},
		watch: {
			current(newIndex) {
				if (newIndex !== this.currentIndex) {
					this.currentIndex = newIndex
				}
			}
		},
		data() {
			return {
				currentIndex: 0,
				dots: []
			};
		},
		created() {
			this.currentIndex = this.current
			this.dots = Array(this.items.length).fill(0)
		},
		methods: {
			_onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index
					this.$emit('clickItem', {currentIndex:index})
				}
			},
			setDot(index) {
				// 设置红点标记
				if (index>=0 && index <this.dots.length) {
					// 如果本来就是1的话就不需要修改
					if (!this.dots[index]) {
						this.dots.splice(index, 1, 1);
					}
				}
			},
			removeDot(index) {
				// 取消红点标记
				if (index>=0 && index <this.dots.length) {
					if (this.dots[index]) {
						this.dots.splice(index, 1, 0);
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.message-tabs {
	padding: var(--status-bar-height) 0 20rpx 0;
	background-color: #fff;
	.message-tabs-wrap {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		font-size: 14px;
		box-sizing: border-box;
		height: 60upx;
		line-height: 60upx;
		.message-tab {
			box-sizing: border-box;
			text-align: center;
			font-weight: 700;
			color: $fontColor33;
		}
		.item-title {
			position: relative;
		}
		.dot-show {
			&:after {
				display: inline-block;
				content: '';
				width: 5px;
				height: 5px;
				position: absolute;
				background: $themeColor;
				border-radius: 50%;
				right: -15upx;
				top: -8upx;
			}
		}
	}
	.message-tabs-bar {
	  display: flex;
	  justify-content: center;
	  transform-origin: 0 0;
	  transform: translate3d(100%, 0, 0);
	  transition-property: all;
	  transition-timing-function: cubic-bezier (0.645, 0.045, 0.355, 1);
	  transition-duration: 0.1s;
		.message-bottom-line {
			width: 84rpx;
			height: 8rpx;
			background: linear-gradient(90deg, $themeColor 1.72%, rgba(255, 255, 255, 0) 97.41%);
			border-radius: 110rpx;
		}
	}
}

</style>
