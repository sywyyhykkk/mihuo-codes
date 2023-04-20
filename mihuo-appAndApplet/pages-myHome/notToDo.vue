<template>
	<view>
		<z-nav-bar :title="dataObj.quesName"></z-nav-bar>
		<view class="todo-qus">
			<view class="todo-qus_desc" >{{ dataObj.quesDesc || ''}}</view>
			<myHome-mh-questionnaire-config
				v-if="questionList && questionList.length"
				:questionId="options.questionId"
				v-model="questionList"
			/>
			<view class="todo-qus_buttom flex-box">
				<view class="no" @click="doTo('取消')">取消</view>
				<view class="yes" @click="doTo('确认')">确认</view>
			</view>
		</view>
		<view class="todo-flow" v-if="toDoList && toDoList.length">
			<view class="flex-box todo-k">
				<u-icon name="bell-fill" size="20" color="#ED3832"></u-icon>
				<text class="todo-tips">已催办 {{ toDoList.length }} 次</text>
			</view>
			<view v-for="(item,index) in toDoList" :key="index" class="todo-item">
				<view class="todo-item_label">第{{ (toDoList.length - index) }}次催办</view>
				<view class="todo-item_time">{{ item.time }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				options:{},
				toDoList:[],
				dataObj:{},
				questionList:[],
				questionObj:null,
				form:{}
			}
		},
		onLoad(options) {
			this.options = options
			this.getToDoList()
			this.getTemplateInfo()
			// this.getDiscloseContent(358)
			this.getDetails()
		},
		methods: {
			// 查询催办记录
			getToDoList(){
				this.$httpApi.getNotToDo({
					todoId: this.options.id
				}).then((res)=>{
					this.toDoList = res
				})
			},
			// 获取模板信息
			getTemplateInfo(){
				let data = []
				this.$httpApi.getTemplateInfoById(this.options.surveyId)
				.then((res)=>{
					if(res.surveyTemplatePartDTOList && res.surveyTemplatePartDTOList.length){
						res.surveyTemplatePartDTOList.map((item)=>{
							data = data.concat(item.surveyTemplateQuesDTOList || []);
						})
					}
					if(data && data.length){
						this.dataObj = data.find((item)=>item.id == this.options.questionId)
					}
				})
			},
			initializeAnswer(el) {
				if ([3, 4].includes(Number(el.quesType))) {
					el.surveyTemplateOptionDTOList = []
					if ([4].includes(Number(el.quesType))) {
						return '[]'
					}
				} else {
					if (el.quesType == 1) {
						let tempAnswer = null;
						el.surveyTemplateOptionDTOList.map(item => {
							if (item.defaultFlag == 1) {
								tempAnswer = item.optionName
							}
						})
						return tempAnswer
					} else {
						let tempAnswerList = []
						el.surveyTemplateOptionDTOList.map(item => {
							if (item.defaultFlag == 1) {
								item['checked'] = true
								tempAnswerList.push(item.optionName)
							}
						})
						// console.log("tempAnswerList",tempAnswerList);
						return tempAnswerList.join(',')
					}
				}
			},
			// 查询交底记录，取第一条（最新一条）
			getDetails() {
				this.$httpApi
					.orderDiscloseGet({
						nodeId: this.options.nodeId
					})
					.then((res) => {
						if (res) {
							if (res && res.length) {
								this.getDiscloseContent(res[0].id)
							}
						}
					})
			},
			// 获取问卷答案
			getDiscloseContent(id){
				this.$httpApi.getDiscloseContent(id)
				.then((res)=>{
					if (res.answer && JSON.parse(res.answer.answerContent)) {
						res.answer.answerContent = JSON.parse(res.answer.answerContent)
					}
					this.questionList = res.answer.answerContent || [];
					this.questionList.map((item)=>{
						item.surveyTemplateQuesDTOList.map(el => {
							el['answer'] = this.initializeAnswer(el) // 初始化答案
						})
					})
					this.questionObj = res
				})
			},
			doTo(type){
				switch (type) {
					case "确认":
						this.save()
						break;
					case "取消":
						// this.getTemplateInfo()
						this.$util.toast(`已取消,将返回上一页`);
						uni.navigateBack();
						break;
				
					default:
						break;
				}
			},
			save(){
				if(!this.validate()){
					this.$util.toast("请作答后再进行确认！")
					return
				}
				this.questionObj.answer.answerContent = JSON.stringify(this.questionList)
				if(this.questionObj.attachments){
					this.questionObj.attachments = JSON.parse(this.questionObj.attachments)
				}
				this.questionObj.nodeId = this.options.nodeId
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				this.$httpApi.notConfirmSave(this.questionObj,this.options.id)
				.then(res=>{
					this.$util.toast(`保存成功,将返回上一页`);
					uni.navigateBack();
				}).finally(()=>{
					uni.hideLoading();
				})
			},
			// 数据校验
			validate(){
				let validate = []
				this.questionList.map((item)=>{
					 validate = validate.concat(item.surveyTemplateQuesDTOList || []);
				})
				let validateObj = validate.find((item)=>item.id == this.options.questionId)
				if(validateObj.answer){
					return true
				}
				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
.todo-qus{
	padding: 0 30rpx;
	border-bottom: 2rpx solid #F0F0F0;
	.todo-qus_desc{
		color: #000000;
		font-family: NotoSansHans-Regular;
		font-size: 28rpx;
		white-space: pre-wrap;
	}
	.todo-qus_buttom{
		justify-content: center;
		view{
			font-family: NotoSansHans-Regular;
			font-size: 28rpx;
			color: #000000;
			background: #F7F7F7;
			border-radius: 15rpx;
			border: 1rpx solid #000000;
			padding: 28rpx 60rpx;
			margin: 0 15rpx 30rpx;
		}
		.yes{
			background: #000000;
			color: #FFFFFF;
		}
	}
}
.todo-flow{
	padding: 30rpx;
	.todo-k{
		padding-bottom: 30rpx;
	}
	.todo-tips{
		color: #ED3832;
		font-size: 20rpx;
		font-family: NotoSansHans-Medium;
		margin:0 16rpx 0 9rpx;
	}
	.todo-item{
		margin-left: 10rpx;
		padding-left: 20rpx;
		border-left: 1px solid #E6E6E6;
		position: relative;
		&:last-child{
			border-left:none;
		}
		&::before{
			position: absolute;
			content: "";
			width: 6rpx;
			height: 6rpx;
			border-radius: 20rpx;
			border: 6rpx solid #FE6E32;
			left: -8rpx;
			top: 6rpx;
		}
		.todo-item_label{
			color: #000000;
			font-family: NotoSansHans-Medium;
			font-weight: bold;
			font-size: 28rpx;
		}
		.todo-item_time{
			color: #808080;
			font-family: NotoSansHans-Regular;
			font-size: 24rpx;
			padding: 10rpx 0 40rpx;
		}
	}
}
.flex-box{
	display: flex;
	align-items: center;
}
</style>
