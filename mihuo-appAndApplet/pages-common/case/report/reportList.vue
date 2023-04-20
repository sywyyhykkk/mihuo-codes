<template>
	<view>
		<z-nav-bar fontColor="black">
			<view class="nav-bar" slot="default">
				报告
			</view>
		</z-nav-bar>
		<view class="report">
			<view v-for="(item,index) in details.homeInspection" :key="index">
				<view class="case-report" v-if="item.reports.length">
					<view class="case-report_top">
						<text>{{ item.label }}</text>
						<text>({{ item.reports.length }}次)</text>
					</view>
					<view class="case-report_main" v-if="item.reports && item.reports.length">
						<view v-for="(v,i) in item.reports" :key="i">
							<view class="report-main_content" @click="goToDetail(item.type,v)">
								<view class="main_content-title">
									<text>{{ v.report ? v.report.surveyName : v.acceptanceName }}</text>
								</view>
								<view class="flex-box">
									<text v-if="v.type == 2" :class="'pass pass_' + v.isPass">{{ v.isPass == 1?"通过":"不通过"}}</text>
									<text v-else class="time">( {{ v.time?v.time.substring(0,10):'' }})</text>
									<u-icon name="arrow-right" size="22"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options:{},
				details:{}
			}	
		},
		onLoad(options) {
			this.options = options;
			this.getDetails()
		},
		methods: {
			getDetails() {
				let params = {
					id: this.options.id,
				}
				if (uni.getStorageSync('userData')) {
					params.userId  = uni.getStorageSync('userData').sysUser.userId
				}
				this.$httpApi.getConstruCaseDetail(params).then(res => {
					if (res) {
						// 报告
						res.homeInspection = JSON.parse(res.homeInspection);
						res.homeInspection.map((item)=>{
							if(item.reports && item.reports.length){
								item.reports.forEach(el => {
									el.type = item.type
									el.name = item.label
								});
							}
						})
						this.details = res;
					}
				})
			},
			goToDetail(type,data){
				switch (type) {
					case 1:
						this.toPage(`/pages-common/case/report/questionnaireTemplate?title=${data.report.surveyName}&id=${this.options.id}`)
						break;
					case 2:
						this.toPage(`/pages-common/case/report/checkTemplate?title=${data.name}&id=${this.options.id}`)
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.report{
	padding: 0 30rpx 30rpx;
}
.case-report{
	border: 2rpx solid #F7F7F7;
	border-radius: 20rpx;
	margin-bottom: 40rpx;
	.case-report_top{
		padding: 30rpx;
		border-top-right-radius: 20rpx;
		border-top-left-radius: 20rpx;
		background: #F7F7F7;
		display: flex;
		align-items: center;
		text{
			text-align: center;
			color: #000000;
			font-family: NotoSansHans;
			font-size: 32rpx;
			font-weight: bold;
			padding-right: 20rpx;
		}
		.report-name{
			font-size: 20rpx;
		}
	}
	.case-report_main{
		.report-main_content{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx;
			.main_content-title{
				flex: 1;
				text{
					font-size: 28rpx;
					color: #000000;
					font-weight: bold;
					font-family: NotoSansHans;
				}
			}
			.pass{
				font-size: 22rpx;
				font-weight: bold;
				padding-right: 10rpx;
				color: #B32A25;
				&.pass_1{
					color: #187518;
				}
			}
			.time{
				color: #A8A8A8;
				font-weight: normal;
				font-size: 24rpx;
				padding:0 10rpx;
			}
		}
	}
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>
