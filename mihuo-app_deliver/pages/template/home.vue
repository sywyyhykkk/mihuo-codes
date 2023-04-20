<template>
	<view>
		<z-nav-bar backState="2000" title="首页"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="video_box" v-if="videoShow" @click="onCloseVideo"><video :src="videoUrl" autoplay="true" controls></video></view>
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// #ifdef MP-WEIXIN
import {onLogin} from '@/config/login';
// #endif
export default {
	data() {
		return {
			videoUrl: '',
			videoShow: false,
			swiperIndex: 0,
			bannerList: [1, 1, 1, 1],
			tabbar:[{
					iconPath: "/static/uview/example/component.png",
					selectedIconPath: "/static/uview/example/component_select.png",
					text: '首页',
					count: 2,
					isDot: true,
					pagePath: "/pages/template/home"
				},
				{
					iconPath: "/static/uview/example/js.png",
					selectedIconPath: "/static/uview/example/js_select.png",
					text: '订单',
					pagePath: "pages/demo/common"
				},
				{
					iconPath: "/static/uview/example/template.png",
					selectedIconPath: "/static/uview/example/template_select.png",
					text: '发布任务',
					midButton: true,
					pagePath: "/pages/template/index"
				},
				{
					iconPath: "/static/uview/example/template.png",
					selectedIconPath: "/static/uview/example/template_select.png",
					text: '消息',
					pagePath: "/pages/message/index"
				},
				{
					iconPath: "/static/uview/example/template.png",
					selectedIconPath: "/static/uview/example/template_select.png",
					text: '我的',
					pagePath: "/pages/template/index"
				},
			]
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {
		// 隐藏原生的tabbar
		//uni.hideTabBar();
		// #ifdef MP-WEIXIN
		onLogin(() => {
			this.getCoupon();
		});
		// #endif
	},
	//页面显示
	onShow() {
		// 隐藏原生的tabbar
		//uni.hideTabBar();
	},
	//方法
	methods: {
		...mapMutations(['setWebViewUrl']),
		pageData() {},
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 轮播图点击
		onBanner(item) {
			if (item.jumpType == 1201) {
				// #ifdef H5
				window.open(item.jumpRecord.webViewUrl);
				// #endif
				// #ifndef H5
				this.$store.commit("setWebViewUrl", item.jumpRecord.webViewUrl);
				uni.navigateTo({
					url: '/pages/home/webView'
				});
				// #endif
			} else if (item.jumpType == 1301) {
				this.videoUrl = item.jumpRecord.videoUrl;
				this.videoShow = true;
			}
		},
		// 轮播图变化
		onSwiperChange(e){
			this.swiperIndex = e.detail.current;
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.nav_list {
	background-color: #fff;
	padding: 30rpx;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 10rpx;
	&:active {
		background-color: #F5f5f5;
	}
	image {
		width: 40rpx;
		height: 40rpx;
	}
	text {
		font-size: 28rpx;
		color: #333;
		margin-left: 30rpx;
	}
	&::after {
		content: '';
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 40rpx;
		height: 40rpx;
		background-image: url('../../static/demo/icon_right.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
}



.video_box {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	video {
		width: 100%;
	}
}
.banner_swiper_box {
	padding-top: 15rpx;
	background-color: #fff;
	.banner_swiper {
		height: 315rpx;

		swiper-item {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.banner_img {
				width: 100%;
				height: 100%;
				transform: scale(0.9);
				transition: all 0.4s;
				&.active {
					transform: scale(1);
				}
				image {
					width: 100%;
					height: 100%;
					box-shadow: 0rpx 20rpx 30rpx 0rpx rgba(0, 0, 0, 0.1);
					border-radius: 20rpx;
				}
			}
		}
	}
}
</style>
