<script>
	import ValuationMhPieChart from './components/valuation-mh-pie-chart/valuation-mh-pie-chart.vue'
	import operation from '@/plugins/mathoperation.js'
	import common from '@/config/common.js'
	import {
		masterAvatar
	} from '@/plugins/orderStatus'

	export default {
		components: {
			ValuationMhPieChart
		},
		data() {
			return {
				options: {},
				answerInfo: {},
				examInfo: {},
				survey: {},
				topics: [],
				feesList: [],
				showCollapseBody: false,
				colors: ['#fe6e32', '#f8de4b', '#81c462', '#62b3d7', '#f8be47', '#31945f', '#e74d53'],
				chartData: [],
				masterStatus: [],
				ipImage: masterAvatar,
				materialPrice:0
			}
		},
		onShareAppMessage() {
			const coverImg = ''
			const path = `/pages-valuation/estimated-amounts?dataId=${this.options.dataId}&isFromShare=1`
			const result = this.$util.shareToWechat('秒秒钟出价格 分分钟做选择', coverImg, path, '装修报价器', true, 1)
			return result
		},
		onLoad(options) {
			this.options = JSON.parse(JSON.stringify(options))
			if (options.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('装修报价器', url, this.options.userId)
			}
			this.options.id = options.dataId
		},

		mounted() {
			this.loadAnswer()
		},
		computed: {
			getAnswerList() {
				if (!this.options.id) {
					return this.topics
				}
				let results = []
				for (const [key, value] of Object.entries(this.answerInfo)) {
					const answer = []
					Object.entries(value).forEach(([key, value]) => {
						const obj = {
							id: key,
							title: value
						}
						answer.push(obj)
					})
					results.push({
						pid: key,
						answer
					})
				}
				return results
			},

			getAnswerPid() {
				return this.getAnswerList.map(v => v.pid)
			},

			getAnswerId() {
				return this.getAnswerList
					.map(v => v.answer.map(c => c.id))
					.toString()
					.split(',')
			},

			getAllIds() {
				return [...this.getAnswerPid, ...this.getAnswerId]
			},

			getTotal() {
				return this.chartData.reduce((cur, prev) => (prev += cur), 0)
			}
		},

		methods: {
			loadAnswer() {
				if (!this.options.id) {
					const {
						topics,
						examInfo
					} = this.$store.state.fulfilledTopics
					this.topics = topics
					this.examInfo = examInfo
					this.getFeesListByType()
					return
				}
				uni.showLoading({
					mask: true
				})
				this.$http
					.get('basic/standard/survey/public/getAnswer', {
						answerId: this.options.id
					})
					.then(data => {
						this.answerInfo = data.answer
						this.examInfo = data.examInfo
						this.survey = data.survey
						const items = this.getAllSurveyList(data.survey.children)
						this.topics = this.getTopicList(items)
						this.getFeesListByType()
					})
					.catch(e => {
						console.error(e.message)
					})
					.finally(() => {
						uni.hideLoading()
					})
			},

			getFeesListByType() {
				const temp = this.examInfo.fees.reduce((prev, cur) => {
					if (cur.feeType in prev) {
						prev[cur.feeType].push(cur)
					} else {
						prev[cur.feeType] = [cur]
					}
					return prev
				}, {})
				const results = []
				let count = 0
				for (const key in temp) {
					count = temp[key].reduce(
						(pre, cur) => operation.floatAdd(pre, Number(cur.minAmount)),
					0)
					results.push({
						total: count,
						type: key,
						list: temp[key],
						name: this.getFeesType(key)
					})
				}
				this.feesList = results
				this.getChartData()
			},

			getChartData() {
				let array = []
				this.feesList.map(item => {
					if(item.name =='主材'){
						this.materialPrice = item.total
					}else{
						array.push(item.total)
					}
				})
				this.chartData = array
			},

			getFeesType(type) {
				switch (type) {
					case 'labor':
						return '人工'
					case 'mainMaterial':
						return '主材'
					case 'auxiliaryMaterial':
						return '辅材'
					case 'service':
						return '服务'
					default:
						return '其他'
				}
			},

			getAllSurveyList(children) {
				let count = 0
				let results = children
				while (results.length !== count) {
					let item = results[count]
					if (item.children) {
						results = results.concat(item.children)
					}
					count += 1
				}
				return results
			},

			getTopicAnswer(topics) {
				return topics.map()
			},

			getTopicList(survey) {
				return survey
					.filter(item => item)
					.map(item => {
						if (this.getAnswerPid.includes(item.id)) {
							const cur = this.getAnswerList.find(v => v.pid === item.id)
							return {
								...item,
								answer: cur.answer
							}
						}
					})
					.filter(item => item)
			},

			getImgList(answer) {
				let list = []
				if (Array.isArray(answer[0].title)) {
					list = answer[0].title
				} else {
					list = answer[0].title.split(',')
				}
				return list?.map(item => common.imageGlobal + item)
			},

			getOrder(value) {
				return value.toString()[1] ? '' + value : '0' + value
			},

			hasUploadType(answer) {
				return answer.some(item => /(\.jpg)|(\.png)|(\.jpeg)/.test(item.title))
			},

			getFloatpMyriad(num) {
				return operation.floatp(num, 10000)
			},

			onPreview(list, index) {
				uni.previewImage({
					current: index,
					indicator: 'number',
					loop: true,
					urls: this.getImgList(list),
					fail: () => {
						uni.showToast({
							icon: 'error',
							title: '图片加载失败',
							duration: 2000
						})
					}
				})
			},

			async getCommonDesign() {
				this.$httpApi
					.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					})
					.then(res => {
						if (res) {
							let master = res.find((item)=>item.jobCode == 'JOB_MANAGER')
							if(master && master.skillId) this.toPage(
								`/pages-homeCall/callMasterPage/callMasterPage?title=${master.skillName}&skillId=${master.skillId}`
							)
						}
					})
			},

			toValuationHistory() {
				uni.navigateTo({
					url: '/pages-valuation/valuation-history'
				})
			},

			handleCallManage() {
				if (uni.getStorageSync('userData')) {
					this.getCommonDesign()
				} else {
					this.$util.goToLoginPage()
				}
			}
		}
	}
</script>

<template>
	<view class="estimated-amounts">
		<z-nav-bar :titleCenter="false">
			<view class="nav-bar" slot="default"> 预估费用 </view>
			<view class="right-btn" slot="right" @click="toValuationHistory"> 估价历史 </view>
		</z-nav-bar>
		<u-mask :show="showCollapseBody" z-index="89" @click="showCollapseBody = false"></u-mask>
		<view class="answer-wrapper">
			<view class="collapse-mask-title">
				<view class="collapse-title" @click="showCollapseBody = !showCollapseBody">
					<scroll-view scroll-x="true" class="answer-label-list">
						<template v-for="item in getAnswerList">
							<template v-if="!hasUploadType(item.answer)">
								<view class="box-item" v-for="v in item.answer" :key="v.id"> {{ v.title }} </view>
							</template>
							<template v-else>
								<image v-for="(item, index2) in getImgList(item.answer)" :key="index2" mode="aspectFill"
									class="box-item-image" :src="item" fit="cover"></image>
							</template>
						</template>
					</scroll-view>
					<view class="collapse-icon" :class="{ 'collapse-icon__active': showCollapseBody }">
						<u-icon name="arrow-down" color="#000" size="18" />
					</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="collapse-body" :class="{ 'collapse-body__active': showCollapseBody }">
				<view v-for="(item, index) in topics" :key="item.id" class="topic-content">
					<text class="order">{{ getOrder(index + 1) }}</text>
					<view class="topic-box">
						<view class="topic-title">{{ item.title }}</view>
						<template v-if="item.type !== 'Upload'">
							<view v-for="v in item.answer" :key="v.id" class="topic-answer"> {{ v.title }} </view>
						</template>
						<view v-else class="topic-answer-image">
							<image v-for="(v, index2) in getImgList(item.answer)" :key="index2" class="answer-image"
								mode="aspectFill" :src="v" fit="cover" @click="onPreview(item.answer, index2)"></image>
						</view>
					</view>
				</view>
				<u-gap height="40" bg-color="rgba(0,0,0,0)"></u-gap>
			</scroll-view>
		</view>
		<scroll-view scroll-y="true" class="statistic">
			<view class="chart">
				<view class="chart-info">
					<valuation-mh-pie-chart v-if="chartData.length" :chartData="chartData" :colors="colors"
						@newColors="(e)=>colors=e" :isShowMask="true" :chartTotal="getTotal" chartSize="180rpx"
						maskSize="140rpx" maskColor="#f8f8f8">
					</valuation-mh-pie-chart>
					<view class="chart-data">
						<view class="total-text">
							<text class="title">总价</text> <text class="unit">￥</text>
							<text class="value"> {{ getTotal }} </text>
						</view>
						<view v-if="feesList.length" class="total-item-box">
							<view v-for="(item, index) of feesList" :key="index" class="total-item">
								<template v-if="item.name !='主材'">
									<view class="icon-title-box">
										<view :style="{ 'background-color': colors[index] }" class="icon"> </view>
										<text class="title">{{ item.name }}</text>
									</view>
									<text class="value">{{ item.total }}</text>
								</template>
							</view>
						</view>
					</view>
				</view>
				<view v-if="materialPrice" class="material-price">主材参考价：{{materialPrice}}</view>
			</view>
			<template v-if="feesList.length">
				<view v-for="(type, index) in feesList" :key="index" class="feesList">
					<view class="stat">
						<view class="stat-text">
							<view :style="{ 'background-color': colors[index] }" class="icon-box"> </view>
							<text>{{ type.name }}</text>
						</view>
						<text class="stat-value">{{ type.total }}</text>
					</view>
					<view class="stat-body">
						<view v-for="(item, index2) of type.list" :key="index2" class="item-lable">
							<view class="item-lable_top">
								<text>{{ item.name }}</text> <text>{{ item.minAmount }}</text>
							</view>
							<view v-if="item.description" v-html="item.description.replace(/\n/g, '<br/>')"
								class="item-lable_buttom"></view>
						</view>
					</view>
				</view>
			</template>
			<!-- #ifndef H5 -->
			<u-gap height="100" bg-color="rgba(0,0,0,0)"></u-gap>
			<!-- #endif -->
		</scroll-view>
		<view class="btn-box">
			<button class="custom-button" @click="handleCallManage"><text>呼叫管家</text></button>
		</view>
	</view>
</template>

<style scoped lang="scss">
	.estimated-amounts {

		.right-btn {
			margin-right: 30rpx;

			color: #000;

			font-size: 28rpx;
			font-weight: 500;
		}

		.answer-wrapper {
			min-height: 84rpx;

			position: relative;

			box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.06);

			.collapse-mask-title {
				width: 100%;
				height: 84rpx;

				background-color: #fff;

				position: absolute;
				z-index: 99;
			}

			.collapse-title {
				width: 100%;
				height: 100%;
				padding: 0 30rpx;

				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				justify-content: space-between;

				.collapse-icon {
					transform: perspective(100rpx) rotateZ(0);
					transition: transform 300ms ease-in-out;
				}

				.collapse-icon__active {
					transform: rotateZ(-180deg);
				}

				.answer-label-list {
					max-width: calc(100% - 60rpx);
					white-space: nowrap;

					/deep/ .uni-scroll-view-content {
						height: 84rpx;
						display: table-cell;
						vertical-align: middle;
						text-align: center;
					}

					.box-item-image,
					.box-item {
						display: inline-block;
						padding: 9rpx 13rpx;
						border-radius: 6rpx;
						background-color: #f7f7f7;
					}

					.box-item-image {
						width: 68rpx;
						height: 48rpx;
						padding: 9rpx 13rpx;
						margin-left: 20rpx;
					}

					.box-item {
						max-width: 200rpx;
						color: #000000;

						font-size: 24rpx;
						font-weight: 400;

						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;

						&+.box-item {
							margin-left: 20rpx;
						}
					}
				}
			}

			.collapse-body__active {
				transform: translateY(0) !important;
			}

			.collapse-body {
				width: 100%;
				max-height: 900rpx;
				padding: 0 30rpx;

				position: absolute;
				top: 84rpx;

				background-color: #fff;
				box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.06);

				transform: perspective(200rpx) translateY(-900rpx);
				transition: transform 300ms ease-in-out;

				z-index: 90;

				.topic-content {
					margin-top: 40rpx;

					display: flex;
					align-items: flex-start;

					.order {
						color: #000;

						font-size: 20rpx;
						font-weight: 400;
						font-style: italic;
						font-family: 'HuXiaoBo-NanShen';
						/* #ifndef H5 */
						line-height: 2.2;
						/* #endif */

						/* #ifdef H5 */
						zoom: 0.83;
						margin-top: 12rpx;
						/* #endif */
					}

					.topic-box {
						margin-left: 11rpx;
					}

					.topic-title {
						color: #808080;

						font-size: 28rpx;
						font-weight: 400;
					}

					.topic-answer {
						display: inline-block;

						padding: 9rpx 13rpx;
						border-radius: 6rpx;
						margin-top: 23rpx;

						color: #fe6e32;
						background-color: rgba(254, 110, 50, 0.1);

						font-size: 24rpx;
						font-weight: 500;

						&+.topic-answer {
							margin-left: 20rpx;
						}
					}

					.topic-answer-image {
						margin-top: 23rpx;
						display: grid;
						grid-template: auto / repeat(4, minmax(140rpx, 1fr));
						gap: 20rpx;
					}

					.answer-image {
						height: 140rpx;
						border-radius: 20rpx;
						background-color: #f7f7f7;
					}
				}
			}
		}

		.statistic {
			padding: 0 30rpx;
			max-height: calc(100vh - 88rpx - 84rpx - 160rpx);
			overflow-y: auto;
			.chart{
				background-color: #f8f8f8;
				min-height: 346rpx;
				border-radius: 20rpx;
				margin-top: 28rpx;
				padding: 35rpx 0;
				box-sizing: border-box;
			}
			.material-price{
				color: #333333;
				font-size: 24rpx;
				padding-left: 50rpx;
			}
			.chart-info {
				display: flex;
				justify-content: space-around;
				align-items: center;
				/deep/ .pie-chart .mask-chart {
					color: #000;

					font-size: 28rpx;
					font-weight: bold;
				}

				.chart-data {
					min-height: 200rpx;
					max-width: 300rpx;

					display: flex;
					flex-flow: column nowrap;
					align-items: center;
					// justify-content: space-between;

					.total-text {

						.title,
						.value,
						.unit {
							color: #000;
						}

						.title,
						.unit {
							font-size: 28rpx;
							font-weight: 500;
							margin-left: 10rpx;
						}

						.value {
							font-size: 42rpx;
							font-weight: 600;
						}
					}

					.total-item-box {
						width: 100%;
						margin-top: 36rpx;

						display: flex;
						flex-flow: column nowrap;
						align-items: center;
						justify-content: space-between;
					}

					.total-item {
						width: 100%;

						display: flex;
						align-items: center;
						justify-content: space-between;

						&+.total-item {
							margin-top: 24rpx;
						}

						.icon-title-box {
							display: flex;
							align-items: baseline;
						}

						.title,
						.value {
							font-size: 24rpx;
						}

						.icon {
							width: 14rpx;
							height: 14rpx;
							margin-right: 10rpx;
						}
					}
				}
			}

			.feesList {
				margin-top: 30rpx;
				z-index: 1;
			}

			.stat {
				display: flex;
				justify-content: space-between;

				.stat-text {
					display: flex;
					align-items: center;

					.icon-box {
						width: 10rpx;
						height: 28rpx;
						border-radius: 2rpx;
						margin-right: 10rpx;
					}
				}

				.stat-text text,
				.stat-value {
					color: #000;
					font-size: 28rpx;
					font-weight: 500;
				}
			}

			.stat-body {
				border-radius: 20rpx;
				padding: 30rpx 20rpx;
				margin-top: 20rpx;
				box-sizing: border-box;

				display: flex;
				flex-flow: column nowrap;
				justify-content: space-between;

				background: #f8f8f8;

				.item-lable {
					.item-lable_top {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.item-lable_buttom {
						max-width: 580rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #999999;
						word-break: break-all;
					}

					&+.item-lable {
						margin-top: 32rpx;
					}

					text {
						color: #000;
						font-size: 24rpx;
						font-weight: 400;
					}
				}
			}
		}

		.btn-box {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;

			padding: 30rpx;

			background-color: #fff;

			.custom-button {
				height: 100rpx;
				border-radius: 20rpx;

				display: flex;
				justify-content: center;
				align-items: center;

				background: #fe6e32;

				text {
					color: #000;

					font-size: 28rpx;
					font-weight: 500;
				}
			}
		}
	}
</style>
