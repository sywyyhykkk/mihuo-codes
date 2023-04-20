<template>
	<view>
		<z-nav-bar bgColor="#F5F5F5">
			<view slot="default" class="nav-bar">{{title}}</view>
		</z-nav-bar>
		<view class="construction">
			<view v-if="acceptance" class="construction-main">
				<view class="construction-info">
					<view class="construction-user">
						<u-avatar class="avatar" size="50" :src="$util.avatarImage(execPersonId.userId)"
						v-if="execPersonId.userId" />
						<text class="name">{{ execPersonId.name }}</text>
						<text class="skill-name">{{ execPersonId.skillName }}</text>
						<text style="font-size:20rpx" v-if="acceptance.applyTime">{{ acceptance.applyTime.substring(11,16)}}提交验收</text>
					</view>
					<view class="construction-info_remark">{{ acceptance.applyDesc || ''}}</view>
					<view v-if="acceptance.voiceFiles">
						<audio-play :formDate="JSON.parse(acceptance.voiceFiles)"></audio-play>
					</view>
					<view class="img-contain" v-if="acceptance.picFiles">
						<image-show :num="99" :imgSrc="acceptance.picFiles" right="20" width="210" height="210"></image-show>
					</view>
				</view>
			</view>
		</view>
		<myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="()=>toDealt(1)" @onSure="()=>toDealt(2)"></myHome-mh-form-bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"提交验收",
				options:{},
				dataList:[],
				nodeData:{},
				acceptance:{},
				execPersonId:{},
			}
		},
		onLoad(options) {
			this.options = options;
			if(options.noticeId){
				this.$util.readNotice(options.noticeId)
			}
			this.getConstruction()
		},
		onShow(){
			this.getNode()
		},
		methods: {
			getConstruction(){
				this.$httpApi.getCheckNodeAcceptance(this.options.nodeId)
				.then(res=>{
					if(res.acceptanceList && res.acceptanceList.length){
						this.acceptance = res.acceptanceList[0];
						this.getUserNews(this.acceptance.applyPersonId)
					}
				})
			},
			// 查询节点信息
			getNode(){
				this.$httpApi.getCheckNode(this.options.reviewId).then((res=>{
					this.nodeData = res;
				}))
			},
			// 获取发起验收用户
			getUserNews(personId) {
				this.$getPersonIdUser([personId], (res) => {
					if(res && res.length){
						this.execPersonId = res[0];
					}
				})
			},
			toDealt(status){
				this.toPage(`/pages-myHome/commonHandleTodo?reviewId=${this.options.reviewId}&status=${status}&nodeId=${this.options.nodeId}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
.construction{
	background: #F5F5F5;
	.construction-main{
		
	}
	.construction-user{
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
		text{
			font-size: 24rpx;
			font-family: NotoSansHans-Regular;
			color: #909199;
			margin-left: 10rpx;
		}
		.affirm{
			font-size: $fontSize26;
		}
		.name{
			color: #000000;
		}
		.skill-name{
			color: #FE6E32;
			background: #FFF0EA;
			padding: 2rpx 10rpx;
			font-weight: 600;
			border-radius: 10rpx 0;
			font-size: 20rpx;
		}
	}
	.construction-info{
		padding: 30rpx;
		background: #FFFFFF;
		border-top-right-radius: 40rpx;
		border-top-left-radius: 40rpx;
		.construction-info_remark{
			color: #4D4D4D;
			font-size: 28rpx;
			font-family: NotoSansHans-Regular;
		}
		.img-contain{
			padding-top: 20rpx;
		}
	}
}
</style>
