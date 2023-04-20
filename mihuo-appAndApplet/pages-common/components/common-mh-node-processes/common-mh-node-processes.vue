<template>
	<view class="node-processes-contain">
		<view class="list-contain" v-for="(item,index) in list" :key="index">
			<view class="item-icon"
				:style="{'background':item.status ? item.noColor: item.activeColor, 'border': item.status ? '':'1px solid  #E2E2E2' }">
				<u-icon v-show="item.status" name="checkmark" color="#fff" size="28"></u-icon>
				<view v-show="!item.status" class="item-no"></view>
			</view>
			<view class="item-line" :style="{'border-color':item.status ? item.activeBorderColor:'' }"></view>
			<text class="item-text">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			currentFlowType: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				list: [{
						id: 1,
						name: '设计',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 2,
						name: '精算',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 3,
						name: '管家',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 4,
						name: '拆除',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 5,
						name: '水电',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 10,
						name: '入住',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 9,
						name: '竣工',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 8,
						name: '油工',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 7,
						name: '泥工',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					},
					{
						id: 6,
						name: '木工',
						activeColor: '#fff',
						noColor: 'linear-gradient(90deg, #FF9A52 0%, #FF6A32 100%)',
						activeBorderColor: '#FF9A52',
						notBorderColor: '#E2E2E2',
						status: false,
					}
				]
			}
		},
		mounted() {
			this.list.forEach(item => {
				if(item.id <= this.currentFlowType){
					item.status = true
				}
			})
		},
	}
</script>

<style lang="scss" scoped>
	.node-processes-contain {
		padding: 20rpx 20rpx 0 20rpx;
		display: flex;
		flex-wrap: wrap;

		.list-contain {
			width: 20%;
			display: flex;
			align-items: center;
			flex-direction: column;
			position: relative;

			&:nth-of-type(5n + 1) {
				.item-text{
					margin-bottom: 0;
				}
			}

			&:nth-of-type(5) {
				.item-line {
					width: 38rpx;
					border-bottom: 1rpx solid #E2E2E2;
					position: absolute;
					transform: rotate(90deg);
					top: 112rpx;
					left: 50rpx;
				}
			}

			&:nth-of-type(6) {
				.item-line {
					border-bottom: 1rpx dashed #E2E2E2;
					width: 110rpx;
				}

			}

			&:nth-of-type(10) {

				.item-line {
					width: 0;
				}
			}

			.item-line {
				height: 2rpx;
				width: 110rpx;
				border-bottom: 1rpx solid #E2E2E2;
				position: absolute;
				left: 92rpx;
				top: 26rpx;
			}

			.item-icon {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				position: relative;
				margin-bottom: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.item-no {
					width: 26rpx;
					height: 26rpx;
					border-radius: 50%;
					background: #E2E2E2;
				}

			}

			.item-text {
				font-size: 24rpx;
				color: #000000;
				margin-bottom: 46rpx;
			}
		}

	}
</style>
