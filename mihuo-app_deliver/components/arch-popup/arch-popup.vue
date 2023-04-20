<template>
	<view class="mask">
		<view class="before"></view>
		<view class="actionContent">
			<view class="animation-iteration-count" v-for="(item,index) in list" :key="index" @click="item.tap"
				:style="[style[index]]">
				<view>
					<view class="imageContent">
						<image style="width:66rpx;height:66rpx" class="icon" :src='item.icon'>
						</image>
					</view>
					<view>
						<text class="text">{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="close" @click="popupClose">
				<image class="close-icon" src="/static/images/X.png">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	//基于uview的改造
	//list count必传
	export default {
		name: 'share-popup',
		props: {
			shareData: {
				shareTitle: '',
				shareUrl: '',
				shareContent: '',
				shareImg: ''
			},
			count: {
				type: Number,
				default: 5
			},
			list: {
				type: Array,
				default () {
					return [{
							title: '装修',
							icon: "/static/images/order_zx.png",
							tap: () => {}

						},
						{
							title: '维修',
							icon: "/static/images/order_wx.png",
							tap: () => {

							}
						},
						{
							title: '安装',
							icon: "/static/images/order_az.png",
							tap: () => {

							}
						},
						{
							title: '设计',
							icon: "/static/images/order_sj.png",
							tap: () => {

							}
						},
						{
							title: '其他',
							icon: "/static/images/order_qt.png",
							tap: () => {

							}
						}
					];
				}
			},
			value: {
				type: Boolean,
				default: true
			},
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			customStyle: {
				type: Object,
				default () {
					return {

					};
				}
			}
		},
		computed: {
			style() {
				let style = [];
				let {
					windowWidth
				} = uni.getSystemInfoSync();
				for (let i = 0; i < this.count; i++) {
					let mstyle = {};
					mstyle.position = 'fixed';
					//两边应该再加多余的空间
					mstyle.left = (i + 0.3) * windowWidth / this.count
					mstyle.bottom = 50 + parseInt(windowWidth / this.count * Math.sin(Math.PI * i / (this.count - 1))) +
						'rpx';
					style.push(mstyle);
				}
				return style;
			}
		},
		watch: {
			// 如果是异步关闭时，外部修改v-model的值为false时，重置内部的loading状态
			// 避免下次打开的时候，状态混乱
			value(n) {

			}
		},
		data() {
			const {
				windowWidth,
				windowHeight
			} = uni.getSystemInfoSync();
			return {
				windowWidth: windowWidth / 2
			};
		},
		methods: {
			popupClose() {
				uni.navigateBack();
			}
		}
	};
</script>

<style scoped>
	.before {
		background-color: #fff;
		height: 800vh;
		width: 800vh;
		left: -190vh;
		position: fixed;
		border-radius: 900vh;
		/* top: 650vh; */
		top: 675vh;
	}

	.actionContent {
		height: 110vw;
		display: flex;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		background: rgba(255, 255, 255, 0);
	}
	.name {
		font-size: 40rpx;
		color: #303133;
		flex: 1;
		text-align: center;
		font-weight: 600;
	}
	.close {
		position: fixed;
		bottom: 350rpx;
		left: 350rpx;
		text-align: right;
	}

	.close-icon {
		width: 51rpx;
		height: 51rpx;
	}

	.imageContent {
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.imageContent .icon {}


	.text {
		font-size: 14px;
		line-height: 20px;
		text-align: center;
		margin-top: 10rpx;
		/* identical to box height */
		color: #606266;
	}
</style>
