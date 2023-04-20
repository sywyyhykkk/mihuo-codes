<template>
	<view>
		<z-nav-bar fontColor="black" title="验房报告"></z-nav-bar>
		<view v-if="details.homeInspection && details.homeInspection.checkPerson" class="homeInspection">
			<common-mh-check-room :data="details.homeInspection.checkPerson"></common-mh-check-room>
			<view v-if="details.homeInspection && details.homeInspection.surveyTemplatePartDTOList" class="home">
				<view v-for="(item,index) in details.homeInspection.surveyTemplatePartDTOList" :key="index">
					<text class="home-question">{{ item.partName }}</text>
					<view v-for="(v,i) in item.surveyTemplateQuesDTOList" :key="i" class="home-answer">
						<text class="home-answer_sq">{{ i>9?i+1:"0" + (i+1) }}</text>
						<view>
							<view class="home-answer_title">{{ v.quesName }}</view>
							<image-show v-if="v.quesType == 4" :imgSrc="v.answer" />
							<text v-else class="home-answer_answer">{{ v.answer }}</text>
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
			this.getDataList()
		},
		methods: {
			getDataList() {
				this.$httpApi.getConstruCaseDetail(this.options.id).then(res => {
					if (res) {
						res.homeInspection = JSON.parse(res.homeInspection);
						if(res.homeInspection && res.homeInspection.checkPerson){
							res.homeInspection.checkPerson.pics = res.homeInspection.checkPerson.pics.split(",")
						}
						this.details = res;
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.homeInspection{
	padding: 0 30rpx;
	.home{
		margin-bottom: 40rpx;
		.home-question{
			font-size: 28rpx;
			display: block;
			padding-bottom: 10rpx;
			color: #000000;
		}
	}
	.home-answer{
		display: flex;
		margin-bottom: 20rpx;
		.home-answer_sq{
			color: #000000;
			font-size: 26rpx;
			font-family: HuXiaoBo-NanShen;
			font-weight: bold;
			margin-right: 10rpx;
			font-style:italic;
		}
		.home-answer_title{
			color: #808080;
			font-size: 28rpx;
			font-family: NotoSansHans-Regular;
			margin-bottom: 20rpx;
		}
		.home-answer_answer{
			color: #FE6E32;
			font-size: 24rpx;
			padding: 10rpx;
			border-radius: 6rpx;
			background: #FFF0EA;
			display: inline-block;
			// margin: 20rpx 0;
		}
	}
}
.flex-box{

}
</style>
