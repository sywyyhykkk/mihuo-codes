<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>

		<view class="topnav"></view>
		<view class="reminder">
			<h5>温馨提示</h5>
			<view>
				<p>1、同意服务承诺,系统将会优先指派订单 </p>
				<p>2、同意服务承诺后商家将会选择优先雇佣</p>
				<p>3、系统专属标签,增加师傅平台曝光度 </p>
				<p>4、服务承诺每三个月可自行修改一次</p>
			</view>
		</view>
		<view class="servicec-ommitment">
			<h3>请选择服务承诺</h3>
			<view class="servicec-title">
				<text class="select-text">基础服务模板</text>(<text class="select-text-item">可多选</text>)
			</view>
			<u-checkbox-group @change="checkboxGroupChange">
				<u-checkbox class="checkboxs" @change="checkboxChange" shape="circle" wrap=true v-model="item.checked"
					v-for="(item, index) in list" :key="index" :name="item.name">{{item.name}}
					<text class="chakan">查看</text>
				</u-checkbox>
			</u-checkbox-group>
			<view class="servicec-title">
				<text class="select-text">附加服务承诺</text>(<text class="select-text-item">可多选</text>)
			</view>
			<u-checkbox class="checkboxs" @change="checkboxChange" shape="circle" wrap=true v-model="item.checked"
				v-for="(item, index) in listaa" :key="index" :name="item.name">{{item.name}}
				<text class="chakan">查看</text>
			</u-checkbox>
		</view>
		<button size="medium" class="wancheng" @click="saveCommit()">确认提交(2/2)</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '到货通知后2小时内完成预约',
						checked: false,
						disabled: false,
					},
					{
						name: '到货通知后2小时内完成预约',
						checked: false,
						disabled: false,
					},
					{
						name: '到货通知后2小时内完成预约',
						checked: false,
						disabled: false,
					},
					{
						name: '空跑费(安装、维修30元/次)',
						checked: false,
						disabled: false
					},
				],
				listaa: [{
					name: '到货通知后2小时内完成预约',
					checked: false,
					disabled: false,

				}, {
					name: '到货通知后2小时内完成预约',
					checked: false,
					disabled: false,

				}]
			};
		},
		methods: {
			checkboxChange(e) {
				//console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				// console.log(e);
			},
			saveCommit(){
				uni.$emit('saveCertification')
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .checkboxs {
		margin-bottom: 34rpx;
		display: flex;
		align-items: center;

		.u-checkbox__label {
			font-size: 24rpx;
			color: #666666;
			line-height: 24rpx;
		}

		.u-checkbox__icon-wrap {
			width: 28rpx !important;
			height: 28rpx !important;
		}
		.u-checkbox__icon-wrap--checked{
			border-color:$themeColor !important ;
			background: $themeColor !important;
		}
	}

	.u-checkbox-group {
		display: flex;
		flex-direction: column;
		border-bottom: 2rpx solid #E6E6E6;
		margin-bottom: 32rpx;
	}


	.topnav {
		width: 100%;
		height: 210rpx;
		background: linear-gradient(to right, $themeColor, $themeColor)
	}

	.reminder {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin: -200rpx 20rpx 14rpx 20rpx;
		padding: 21rpx 72rpx;

		h5 {
			font-size: 14px;
			color: $themeColor;
			margin-bottom: 12rpx;
		}

		p {
			font-size: 24rpx;
			margin-bottom: 10rpx;
			color: #666666;
		}
	}

	.servicec-ommitment {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin: 0 20rpx;
		padding: 0rpx 24rpx 40rpx 22rpx;

		.chakan {
			font-size: 24rpx;
			color: #A7A6AB;
			position: absolute;
			right: 48rpx;
		}

		.servicec-title {
			margin-bottom: 28rpx;
		}

		.select-text {
			font-size: 28rpx;
			font-weight: 900;
			color: #333333;
			margin-right: 14rpx;

		}

		.select-text-item {
			font-size: 24rpx;
			color: #A7A6AB;
		}

		h3 {
			font-size: 32rpx;
			font-weight: bold;
			padding: 32rpx 0 22rpx 0;
			border-bottom: 2rpx solid #E6E6E6;
			margin-bottom: 28rpx;
		}

		h4 {
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 28rpx;

			text {
				color: #EFEFEF;
			}
		}
	}


	.additionalServices {
		margin-top: 1px solid red;
	}

	.wancheng {
		color: #FFFFFF;
		background-color: $themeColor;
		height: 88rpx;
		padding: 12rpx 222rpx;
		margin: 68rpx  64rpx;
		font-size: 28rpx;
	}
</style>
