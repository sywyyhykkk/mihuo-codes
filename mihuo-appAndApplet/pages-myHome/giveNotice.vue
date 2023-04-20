<template>
	<view>
		<z-nav-bar :title="title"></z-nav-bar>
		<view class="notice" v-if="toDoList && toDoList.length">
			<view v-for="(item,index) in toDoList" :key="index" class="notice-item" @click="goToDo(item)">
				<view class="notice-label">
					<view class="notice-label_left flex-box">
						<text>{{ index>10?index+1:'0'+(index+1)}}</text>
						<view>{{ item.quesName || '' }}</view>
					</view>
					<view class="notice-label_right flex-box">
						<view class="flex-box" v-if="item.pendingCount">
							<u-icon name="bell-fill" size="20" color="#ED3832"></u-icon>
							<text class="notice-label_right-tips">已催办 {{item.pendingCount}} 次</text>
						</view>
						<u-icon name="arrow-right" size="20"></u-icon>
					</view>
				</view>
				<view class="notice-des">{{ item.quesDesc || ''}}</view>
			</view>
		</view>
		<mh-empty title="暂无确认事项"></mh-empty>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				title:"需要确认的事项",
				options:{},
				toDoList:[]
			}
		},
		onLoad(options) {
			this.options = options;
			this.title = moment().format('YYYY年MM月DD日') + "需要确认的事项"
		},
		onShow() {
			this.getDataList()
		},
		methods: {
			getDataList(){
				this.$httpApi.getNotConfirm({
					projectId: this.options.projectId
				}).then((res)=>{
					if(res && res.length){
						this.dataChange(res[0].surveyId,res)
					}
				})
			},
			dataChange(id,list){
				let data = []
				this.$httpApi.getTemplateInfoById(id)
				.then((res)=>{
					if(res.surveyTemplatePartDTOList && res.surveyTemplatePartDTOList.length){
						res.surveyTemplatePartDTOList.map((item)=>{
							data = data.concat(item.surveyTemplateQuesDTOList || [])
						})
					}
					if(data && data.length){
						list.forEach((item)=>{
							data.some((v)=>{
								if(item.questionId == v.id){
									item.quesName = v.quesName;
									item.quesDesc = v.quesDesc;
								}
							})
						})
					}
					this.toDoList = list;
				})
			},
			goToDo(data){
				this.toPage(`/pages-myHome/notToDo?id=${data.id}&questionId=${data.questionId}&surveyId=${data.surveyId}&nodeId=${data.nodeId}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
.notice{
	.notice-item{
		padding:30rpx;
		border-bottom: 2rpx solid #F0F0F0;
	}
	.notice-label{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.notice-label_left{
			text{
				font-size: 24rpx;
				color: #B3B3B3;
				font-family: HuXiaoBo-NanShen;
				padding-right: 16rpx;
			}
			view{
				color: #000000;
				font-size: 28rpx;
				font-weight: bold;
				font-family: NotoSansHans-Medium;
			}
		}
		.notice-label_right-tips{
			color: #ED3832;
			font-size: 20rpx;
			font-family: NotoSansHans-Medium;
			margin:0 16rpx 0 9rpx;
		}
	}
	.notice-des{
		font-family: NotoSansHans-Regular;
		color: #808080;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>		
