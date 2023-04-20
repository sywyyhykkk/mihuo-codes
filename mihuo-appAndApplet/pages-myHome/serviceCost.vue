<template>
	<view>
		<!-- #ifdef APP-PLUS || H5 -->
			<z-nav-bar fontColor="#141414" bgColor="#F5F5F5">
				<view class="nav-bar" slot="default">装修花费</view>
				<view class="nav-bar-right" slot="right" @click="bidRecord">开单记录</view>
			</z-nav-bar>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
			<z-nav-bar fontColor="#141414" bgColor="#F5F5F5" :titleCenter="false">
				<view class="nav-bar" slot="default">装修花费</view>
				<view class="nav-bar-right" slot="right" @click="bidRecord">开单记录</view>
			</z-nav-bar>
		<!-- #endif -->
		<view class="select-mode flex-center" @click="isShowPicker = !isShowPicker">
			{{ currentMode == 1 ? '全屋花费' : project.projectName }}
			<view class="arrow"></view>
		</view>
		<view class="chart-container flex-center" v-if="totalCost != 0">
			<view class="pie-chart flex-center">
				<view class="chart" v-if="costData.length === 1" :style="{ background: pieChart}"></view>
				<view class="chart" v-else :style="{ backgroundImage: pieChart}"></view>
			</view>
			<view class="data-statistics">
				<view class="total-cost flex-center">
					<view class="type-icon"></view>
					<view class="total-title">
						总花费
					</view>
					<view class="cost">
						¥{{ Number(totalCost).toFixed(2) }}元
					</view>
				</view>
				<view class="cost-item flex-center" v-for="item, index in costData" :key="index"
					@click="goToCostDetail(item)">
					<view class="type-icon" :style="{ backgroundColor: colors[index]}"></view>
					<view class="type-name" :style="{ color: colors[index]}">{{ item.name }}</view>
					<view class="type-cost">¥ {{ item.money }}元</view>
					<uni-icons type="right" size="14"></uni-icons>
				</view>
			</view>
		</view>
		<view class="todo-item" v-for="item, index in myTodo" :key="index">
			<view class="todo-title">
				{{ item.title }}
			</view>
			<view class="todo-content flex-center">
				<view class="red-dot"></view>
				<view class="content-text">
					{{ item.comment }}
				</view>
			</view>
			<view class="todo-button flex-center">
				<view class="button-text" @click="handleTodo(item)">
					{{ item.detailStatus == 2 ? '已处理' :  '去处理' }}
				</view>
			</view>
		</view>
		<!-- <view class="qute-list">
			<view class="todo-title flex-center">
				报价清单
				<view class="service-name">
					项目管家服务
				</view>
			</view>
			<view class="qute-price flex-center">
				<view class="price">
					5000
				</view>
				<view class="text">
					元/预算金额
				</view>
			</view>
			<view class="qute-time">
				报价时间 2022-05-06 14:34:45
			</view>
			<view class="qute-des">
				报价说明报价说明报价说明报价说明报价说明
			</view>
		</view> -->
		<u-select v-model="isShowPicker" :list="modeList" @confirm="confirm"></u-select>
		<bottom-button title="记一笔" @click="goToAddCostNote"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colors: ['#4358ba', '#81c462', '#f8be47', '#e74d53', '#62b3d7', '#31945f'],
				pieChart: '',
				isShowPicker: false,
				modeList: [{
					value: 1,
					label: '全屋花费'
				}],
				currentMode: 1,
				totalCost: 0, // 总花费
				costData: [], // 装修花费数据
				myHomeInfo: uni.getStorageSync('roomAddress'), // 当前我的家
				project: {}, // 选择的服务
				myAllServices: [] ,// 我的家的所有服务
				myTodo: [], // 我的家的待办
				options:{}
			}
		},
		onLoad(options) {
			this.options = options
		},
		onShow() {
			this.getHomeCost()
			this.getMyPendingTodo()
			this.getHomeService()
		},
		methods: {
			// 跳转到记一笔页面
			goToAddCostNote(){
				if(this.project.projectId){
					this.toPage(`/pages-myHome/addCostNote?projectId=${this.project.projectId}`)
				} else {
					this.toPage('/pages-myHome/addCostNote')
				}
			},
			// 处理待办
			handleTodo(item) {
				if(item.detailStatus == 2) return
				this.toPage(
					`/pages-myHome/confirmItems?addressId=${this.myHomeInfo.id}&projectId=${this.project.projectId}`
				)
			},
			// 获取我的家的所有服务
			getHomeService() {
				this.modeList = [{
					value: 1,
					label: '全屋花费'
				}]
				this.colorStr = ''
				this.$httpApi.getProjectsByAddressId(this.myHomeInfo.id).then(res => {
					if (res && res.length != 0) {
						this.myAllServices = res.map(item => {
							return {
								...item,
								label: item.projectName,
								value: item.projectId,
								extra: item
							}
						})
						this.modeList.push(...this.myAllServices)
					}
				})
			},
			// 全屋查看时待确认项
			getMyPendingTodo() {
				this.$httpApi.getMyTodoPending(this.myHomeInfo.id).then(res => {
					if(res.records) {
						this.myTodo = res.records.filter(item => item.businessCode.startsWith('payment') && item.detailStatus != 2)
					}
				})
			},
			// 查看花费详情
			goToCostDetail(item) {
				this.toPage(`/pages-myHome/costDetail?id=${item.bookkeepingTypeId}&title=${item.name}`)
			},
			// 获取装修花费
			getHomeCost() {
				this.costData = []
				let obj = {}
				if (this.currentMode == 1) {
					obj = {
						addressId: this.myHomeInfo.id
					}
				} else {
					obj = {
						projectId: this.project.projectId
					}
				}
				this.$httpApi.getHomeCost(obj).then(res => {
					if (res) {
						const chartData = []
						res.forEach(item => {
							chartData.push(item.money)
						})
						this.costData = res
						this.generateChart(chartData)
					}
				})
			},
			// 生成饼图
			generateChart(dataArr) {
				if (dataArr.length == 1) {
					this.totalCost = dataArr[0]
					this.pieChart = this.colors[0]
					return
				}
				
				function getSum(arr) {
					if (!arr.length) return 0
					const result = arr.reduce((pre, next) => pre + next)
					return result == 360 ? '' : result + 'deg'
				}
				
				let arr = dataArr
				let total = getSum(arr)
				if(total) total = total.replace('deg', '')
				this.totalCost = total
				arr = arr.map(item => item / total * 360)
				let str = []
				arr.unshift(0)
				
				for (let i = 1; i < arr.length; i++) {
					let pre = getSum(arr.slice(0, i))
					let next = getSum(arr.slice(0, i + 1))
					let sum
					if (next) sum = pre + ' ' + next
					else sum = pre
					str.push(sum)
				}
				
				let colorStr = 'conic-gradient('
				
				for (let i = 0; i < str.length; i++) {
					colorStr += this.colors[i] + ' ' + str[i] + ', '
				}
				
				colorStr = colorStr.slice(0, colorStr.length - 2)
				colorStr += ')'
				// 最终生成一个background-image的css样式
				this.pieChart = colorStr
			},
			// 确认选择查看模式
			confirm(e) {
				this.currentMode = e[0].value
				this.totalCost = 0
				if (this.currentMode == 1) {
					this.getMyPendingTodo()
				} else {
					this.project = e[0].extra
				}
				this.getHomeCost()
			},
			// 开单记录
			bidRecord(){
				this.toPage(`/pages-myHome/bidRecordList?addressId=${this.options.addressId}&projectId=${this.currentMode || ''}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-mode {
		width: 690rpx;
		height: 84rpx;
		margin: 20rpx 30rpx 0;
		line-height: 60rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 500;
		color: #000000;
		line-height: 84rpx;
		border-radius: 15rpx;
		margin-left: 30rpx;
		background-color: #F7F7F7;
		justify-content: space-between;

		.arrow {
			width: 0;
			height: 0;
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
			border-top: 8rpx solid #000000;
		}
	}

	.chart-container {
		width: 100vw;
		height: max-content;
		margin-top: 30rpx;

		.pie-chart {
			width: 40%;
			justify-content: center;

			.chart {
				width: 250rpx;
				height: 250rpx;
				border-radius: 50%
			}
		}

		.data-statistics {
			width: 60%;
			height: max-content;

			.total-cost {
				padding-left: 20rpx;
				margin-bottom: 20rpx;

				.total-title {
					width: 100rpx;
					margin-left: 20rpx;
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
				}

				.cost {
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					color: #000000;
					font-weight: 500;
					line-height: 34rpx;
					margin-left: 20rpx;
				}
			}

			.type-icon {
				width: 20rpx;
				height: 20rpx;
			}

			.cost-item {
				padding-left: 20rpx;
				margin-bottom: 20rpx;

				.type-name {
					width: 100rpx;
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					line-height: 34rpx;
					margin-left: 20rpx;
				}

				.type-cost {
					width: 200rpx;
					font-size: 28rpx;
					font-family: Noto Sans S Chinese;
					color: #000000;
					margin-left: 20rpx;
				}
			}
		}
	}

	.todo-title {
		padding: 0 30rpx;
		font-size: 32rpx;
		font-family: Noto Sans S Chinese;
		font-weight: 500;
		color: #000000;
		line-height: 34rpx;
		justify-content: space-between;

		.service-name {
			width: max-content;
			height: 44rpx;
			padding: 0rpx 20rpx;
			border-radius: 20rpx;
			line-height: 44rpx;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			color: $themeColor;
			background-color: #f7e3dd;
		}
	}

	.todo-item {
		width: 690rpx;
		height: max-content;
		border-radius: 20rpx;
		background-color: #ffece7;
		margin: 20rpx 30rpx 0 30rpx;
		padding: 30rpx 0;

		.todo-content {
			width: 100%;
			height: 60rpx;
			padding: 0 20rpx;
			margin-top: 20rpx;
			align-items: flex-start;

			.red-dot {
				width: 6rpx;
				height: 6rpx;
				margin-top: 15rpx;
				margin-right: 10rpx;
				border-radius: 50%;
				background-color: $themeColor;
			}

			.content-text {
				flex: 1;
				height: 60rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				color: #000000;
				line-height: 30rpx;
				@include bov(2);
			}
		}

		.todo-button {
			width: 100%;
			height: 60rpx;
			justify-content: flex-end;
			padding: 0 20rpx;
			margin-top: 10rpx;

			.button-text {
				width: max-content;
				height: 60rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
				border-radius: 30rpx;
				border: 2rpx solid black;
				font-family: Noto Sans S Chinese;
				line-height: 60rpx;
				color: #000000;
				background-color: #FFFFFF;
			}
		}
	}

	.qute-list {
		width: 690rpx;
		height: max-content;
		border-radius: 20rpx;
		background-color: #F7F7F7;
		margin: 20rpx 30rpx 0 30rpx;
		padding: 30rpx 0;

		.qute-price {
			margin-top: 20rpx;
			padding: 0 40rpx;

			.price {
				font-weight: bold;
				font-size: 48rpx;
				font-family: Noto Sans S Chinese;
				color: $themeColor;
			}

			.text {
				margin-top: 8rpx;
				margin-left: 10rpx;
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				color: #000000;
				line-height: 40rpx;
			}
		}

		.qute-time {
			padding: 0 40rpx;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			color: #808080;
			line-height: 40rpx;
		}

		.qute-des {
			max-height: 80rpx;
			margin-top: 10rpx;
			padding: 0 40rpx;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			color: #000000;
			line-height: 40rpx;
			@include bov(2);
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
	.nav-bar-right{
		font-size: 28rpx;
		margin-right: 30rpx;
	}
</style>
