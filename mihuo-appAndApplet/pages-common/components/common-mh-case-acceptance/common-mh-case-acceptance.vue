<template>
	<view>
		<view v-if="acceptance && acceptance.length">
			<view v-for="(item,index) in acceptance" :key="index" @click="goToDetail(item)">
				<view class="collse">
					<view class="collse-item">
						<view class="collse-item_top">
							<view class="template-name">{{ item.label || ''}}</view>
							<u-icon name="arrow-right" size="20"></u-icon>
						</view>
						<view v-for="(item1,index1) in item.reports" :key="index1">
							<view class="collse-item_main" v-if="index1<4">
								<view class="collse-item_main-left">
									<text style="margin-right:10rpx">{{index1>9?index1+1 : '0'+(index1+1)}}</text>
									<text>{{ item1.acceptanceName || ''}}</text>
									<!-- <image-show style="margin-top:10rpx" v-if="item1.quesType == 4" :imgSrc="item1.answer" /> -->
								</view>
								<view class="collse-item_main-right">
									<text :class="'pass pass_'+item1.isPass">{{ item1.isPass == "1"?'通过':'不通过' }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mh-empty marginTop="0" size="100" v-else title="暂无验收报告~~"></mh-empty>
		<!-- <view class="open_btn">
			<text @click="goMore()">查看全部</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				acceptance: [],
				curArr: []
			}
		},
		props: {
			data: {
				type: Array,
				default: () => []
			},
			dataId: {
				type: [String, Number],
				default: () => ''
			}
		},
		mounted() {
			if(this.data && this.data.length){
				let accArr = this.data.filter((item)=> item.type == 2);
				if(accArr && accArr.length){
					this.acceptance = accArr.filter((item)=> item.reports.length >0);
				}
			}
		},
		methods: {
			collse(data) {
				let repeatArr = []; //重复元素计算
				this.curArr.push(data.id);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i] == data.id) {
						repeatArr.push(data)
					}
				}
				if ((repeatArr.length) % 2 === 0) {
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data.id) {
							this.curArr.splice(i, 1);
							i--
						}
					}
				} else {
					this.curArr = Array.from(new Set(this.curArr))
				};
			},
			goMore() {
				console.log("点击了")
				this.$emit('goToPage',"报告")
			},
			goToDetail(data) {
				this.toPage(`/pages-common/case/report/checkTemplate?title=${data.label}&id=${this.dataId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.collse-item {
		border-radius: 20rpx;
		border: 2rpx solid #F8F8F8;
		margin-bottom: 20rpx;

		.collse-item_top {
			border-top-right-radius: 20rpx;
			border-top-left-radius: 20rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #F7F7F7;

			.template-name {
				color: #141414;
				font-family: PingFang-SC;
				font-size: 28rpx;
				font-weight: bold;
			}
		}

		.collse-item_main {
			padding: 30rpx 30rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&:last-child {
				padding-bottom: 30rpx;
			}

			.collse-item_main-left {
				text {
					color: #000000;
					font-size: 24rpx;
				}
			}

			.collse-item_main-right {
				.pass {
					color: #FE6E32;
					font-size: 24rpx;
					background: #FFF0EA;
					border-radius: 6rpx;
					padding: 10rpx;
					margin-right: 20rpx;
					&.pass_1{
						color: #187518;
    					background: #E7F1E7;
					}
				}
			}
		}
	}

	.open_btn {
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		border-radius: $miniBorderRadius;

		text {
			border: 1rpx solid #141414;
			border-radius: 40rpx;
			padding: 10rpx 20rpx;
			display: flex;
			align-items: center;
			color: #141414;
			font-size: 20rpx;
			font-weight: bold;
		}
	}
</style>
