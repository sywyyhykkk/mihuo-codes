<template>
	<view class="abnormalFeedback-contain">
		<view class="record-item" v-for="(item,index) in list" :key="index">
			<view class="header-title">
				<view class="left">反馈内容：工地瓷砖数量不够</view>
				<view class="right" @click="getShow(index)">点击{{item.shouqiShow === true? '展开':'收起'}}
					<image :class="[item.shouqiShow === true?'active':'shouqi']" src="/static/images/shouqi.png"></image>
				</view>
			</view>
			<view class="record-time">2021-08-31 15:00</view>
			<view class="record-contain" :style="{height:item.height}">
				<view class="image-contain">
					<u-lazy-load height="226" imgMode="aspectFill" class="record-item-img" border-radius="10"
						image="https://yzz-jst-zjk.oss-cn-zhangjiakou.aliyuncs.com//beta-8-1018-20211109162652caceaf6a413611ecb3a40242ac1c00055c5351692178f6ea35700e415f7585bf.jpg">
					</u-lazy-load>
				</view>
				<view class="audio-contain">
					<mihuo-audio></mihuo-audio>
				</view>
			</view>
		</view>
		<mh-empty v-show="list.length === 0"  icon="/static/images/no_recommend.png" title="您还没有异常反馈记录～～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				height: '370rpx',
				shouqiShow: false,
				shouqi: require("@/static/images/shouqi.png"),
				list: [{
					height: '370rpx',
					shouqiShow: false
				}, {
					height: '370rpx',
					shouqiShow: false
				}]


			}
		},
		onLoad(option) {
			this.option = option
			this.getList()
		},
		onReachBottom(){

		},
		methods: {
			getList(){
				this.$httpApi.bizorderfeedbackPage().then(res =>{
					if(res.data){
						// this.list
					}
				})
			},
			getShow(index) {
				this.shouqiShow = !this.shouqiShow
				if (this.shouqiShow) {
					this.list[index].height = this.list[index].shouqiShow === true ? '370rpx' : '0rpx'
					this.list[index].shouqiShow = !this.list[index].shouqiShow
				} else {
					this.list[index].height = this.list[index].shouqiShow === true ? '370rpx' : '0rpx'
					this.list[index].shouqiShow = !this.list[index].shouqiShow
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.abnormalFeedback-contain {
		.record-item {
			margin: 10rpx 20rpx;
			background: #FFFFFF;
			border-radius: 14rpx;
			padding: 36rpx 30rpx 0 30rpx;
			overflow: hidden;

			.header-title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-weight: bold;
					font-size: 28rpx;
					line-height: 36rpx;
					color: #333333;
				}

				.right {
					font-weight: normal;
					font-size: 26rpx;
					line-height: 36rpx;
					text-align: right;
					color: #A7A7A7;
					display: flex;
					align-items: center;

					.shouqi {
						transform: rotate(0deg);
						transition: all .2s;
					}

					.shouqi,
					.active {
						width: 16rpx;
						height: 16rpx;
						margin-left: 10rpx;
					}

					.active {
						transform: rotate(-90deg);
						transition: all .2s;
					}
				}
			}

			.record-time {
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;
				margin-bottom: 28rpx;
			}

			.record-contain {
				overflow: hidden;
				transition: all .2s;


				.record-item-img {
					width: 226rpx;
				}

				.image-contain {
					margin-bottom: 24rpx;
				}

				.audio-contain {
					margin-bottom: 40rpx;
				}
			}
		}
	}
</style>
