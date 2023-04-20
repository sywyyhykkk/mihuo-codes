<template>
	<view class="disclosure-details-contain">
		<view class="form-item-contain">
			<view class="item-contain">
				<view class="item-label">测试日期</view>
				<view class="item-value" v-if="details.discloseDate">{{details.discloseDate.substring(0,10)}}</view>
			</view>
			<view class="item-contain">
				<view class="item-label">交底位置</view>
				<view class="item-value">{{details.discloseAddress}}</view>
			</view>
			<view class="item-contain">
				<view class="item-label">房屋面积</view>
				<view class="item-value">{{details.houseArea}}</view>
			</view>
			<view class="describe-contain">
				<view class="item-label">备注内容</view>
				<view class="item-describe">
					{{details.remark}}
				</view>
				<view class="file-contain">
					<u-lazy-load class="item-image" height="180" imgMode="aspectFill" border-radius="10"
						image="https://yzz-jst-zjk.oss-cn-zhangjiakou.aliyuncs.com//beta-8-1018-20211109162652caceaf6a413611ecb3a40242ac1c00055c5351692178f6ea35700e415f7585bf.jpg">
					</u-lazy-load>
					<u-lazy-load class="item-image" height="180" imgMode="aspectFill" border-radius="10"
						image="https://yzz-jst-zjk.oss-cn-zhangjiakou.aliyuncs.com//beta-8-1018-20211109162652caceaf6a413611ecb3a40242ac1c00055c5351692178f6ea35700e415f7585bf.jpg">
					</u-lazy-load>
					<u-lazy-load class="item-image" height="180" imgMode="aspectFill" border-radius="10"
						image="https://yzz-jst-zjk.oss-cn-zhangjiakou.aliyuncs.com//beta-8-1018-20211109162652caceaf6a413611ecb3a40242ac1c00055c5351692178f6ea35700e415f7585bf.jpg">
					</u-lazy-load>
					<u-lazy-load class="item-image" height="180" imgMode="aspectFill" border-radius="10"
						image="https://yzz-jst-zjk.oss-cn-zhangjiakou.aliyuncs.com//beta-8-1018-20211109162652caceaf6a413611ecb3a40242ac1c00055c5351692178f6ea35700e415f7585bf.jpg">
					</u-lazy-load>
				</view>
				<mihuo-audio :formDate="audioObject"></mihuo-audio>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default{
		data() {
			return {
				details: {},
				audioObject:{},
				option:{}
			}
		},
		onLoad(){
			this.getDetails()
		},
		computed: {
		   ...mapState(['nodeInfo'])
		  },
		methods:{
			getDetails(){
				this.$httpApi.selectOrderDisclose({nodeId: this.nodeInfo.nodeId}).then(res =>{
					this.details = res
				})
			}
		}
	}
	// 查看交底
</script>

<style lang="scss" scoped>
	.disclosure-details-contain{
		padding-top: 12rpx;
		.form-item-contain{
			margin: 0 20rpx;
			.item-contain{
				background-color: #FFFFFF;
				padding: 42rpx 84rpx 40rpx 48rpx;
				justify-content: space-between;
				display: flex;
				align-items: center;
				margin-bottom: 2rpx;
				border-radius: 10rpx;
				&:last-child{
					margin-bottom: 0;
				}

				.item-label{
					font-size: 26rpx;
					color: #606166;
				}

				.item-value{
					font-size: 28rpx;
					color: $seconFontColor;
					font-weight: bold;
				}
			}
			.describe-contain{
				padding: 42rpx 84rpx 40rpx 48rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;

				.item-label{
					font-size: 26rpx;
					color: #606166;
					margin-bottom: 20rpx;
				}
				.item-describe{
					font-size: 28rpx;
					color: $seconFontColor;
					line-height: 1.5;
					margin-bottom: 32rpx;
				}
				.file-contain{
					display: flex;
					flex-wrap: wrap;
					.item-image{
						width: 180rpx;
						margin-right: 18rpx;
						margin-bottom: 20rpx;

						&:nth-of-type(3n){
							margin-right: 0rpx;
						}
					}
				}
			}
		}
	}
</style>
