<template>
	<view class="eval">
		<z-nav-bar fontColor="#141414" bgColor="#F1F1F1" title="服务评价" :backState="3000" @backClick="goBack"></z-nav-bar>
		<view class="server-tips">
			<image :src="require('@/pages-findMaster/static/icon/work_type/go-bottom.png')"/>
			<text>客观真实的评价能帮助更多业主~</text>
		</view>
		<view class="server-content" v-if="workerInfo.bizOrder">
			<view class="content-header">
				<view class="content-header-left">
					<image class="portrait" :src="$util.thumbnailImage( workerInfo.offerList[0].avatar,true)"/>
				</view>
				<view class="content-header-right">
					<view class="item-row">
						<text>{{ workerInfo.offerList[0].personName}}</text>
						<text class="tag">{{ workerInfo.offerList[0].skillName }}</text>
					</view>
					<view class="item-row2">{{ workerInfo.bizOrder.requirementDesc}}</view>
				</view>
			</view>
			<view class="form">
				<u-form
				:model="formData"
				ref="uForm"
				:labelStyle="{
					fontSize: '28rpx',
					fontWeight: 'bold',
					color:'#141414',
					fontFamily:'PingFang-SC-Bold'
				}"
				:borderBottom="false"
				label-width="auto"
			>
				<u-form-item
					label="服务评分"
					prop="type"
					:borderBottom="false"
				>
					<u-rate v-model="formData.serveScore" size="36" @change="selectScore"></u-rate>
				</u-form-item>
				<u-form-item :borderBottom="false" left-icon="edit-pen"
				>
					<textarea v-model="formData.contents"
					style="width:100%;font-size:28rpx"
					auto-height
					:maxlength='500'
					placeholder-style="color:#C0C4CC;font-size:26rpx"
					placeholder="客观的评价服务，可以帮助更多业主"></textarea>
				</u-form-item>
				<u-form-item :borderBottom="false"
				>
					<findMaster-mh-checkbox-button :data="evaluateTags" v-model="formData.labels"></findMaster-mh-checkbox-button>
				</u-form-item>
				<u-form-item :borderBottom="false"
				>
					<findMaster-mh-upload-camera v-model="formData.pics" count="9" />
				</u-form-item>
				<u-form-item :borderBottom="false"
				>
					<view class="form-item_only">
						<view class="switch">
							<u-switch active-color="#FE6E32" size="36" v-model="formData.checked"></u-switch>
							<text>同步到觅友圈</text>
						</view>
						<view class="title">把评价发送到觅友圈</view>
					</view>
				</u-form-item>
				</u-form>
			</view>
		</view>
		<bottom-button title="发布" @click="send"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{},
				personId:'',
				// 订单id
				id:'',
				orderCode:'',
				// 评价标签
				evaluateTags:[],
				// 订单信息
				workerInfo:{},
				isRefresh:false,
				option:{}
			};
		},
		components:{
			
		},
		onLoad(option) {
			this.option = option
		},
		onShow() {
			this.getWorkerInfo()
		},
		methods: {
			goBack(){
				uni.navigateBack();
				if(this.isRefresh) uni.$emit('refresh');
			},
			// 获取评价分数
			selectScore(e){
				this.formData.serveScore = e;
			},
			//获取师傅信息
			getWorkerInfo(){
				this.isRefresh = false;
				this.$http.get(`order/bidorder/list?orderId=${this.option.id}`).then(res => {
					if(res){
						this.workerInfo = res;
						this.getEvalTags();
					}
				})
			},
			// 获取工人对应工种标签
			getEvalTags(){
				this.$http.get('admin/sysjobskill/getPlatformJobSkill',{
					type: '',
					clientType: "platform"
				}).then(res=>{
					if(res){
						res.some((v)=>{
							if(v.skillId == this.workerInfo.offerList[0].skillId ){
								this.evaluateTags = (v.label).split(',')
								return true
							}
						})
					}
            	})
			},
			send(){
				if(!this.formData.serveScore){
					this.$util.toast('请评价等级');
					return false
				}
				if(this.formData.labels && this.formData.labels.length){
					this.formData.labels = this.formData.labels.join(',')
				}
				if(!this.$checkUploadProcess(this.formData.pics)){
					this.$util.toast("评价图片正在上传中,请稍作等待")
					return 
				}
				uni.showLoading({
					title: '发布中',
					mask: true
				});
				this.formData.personId = this.workerInfo.offerList[0].personInfo.personId;
				this.formData.orderId = this.workerInfo.bizOrder.id;
				this.$http.post('order/capp/bizorderreply/save',this.formData)
				.then(res=>{
					if(res){
						this.$util.toast('服务评价成功,即将返回上一页');
						this.isRefresh = true;
						setTimeout(()=>{
							if(this.option.toCur == 2){
								this.toPage(`/pages-common/successPage/successPage?mode=2&id=${this.option.id}`)
							}else{
								uni.navigateBack();
							}
							// 评价成功回调
							uni.$emit('success',{type:'evaluation'})
							uni.$emit('refresh')
						},1000)
					}
				}).finally(()=>{
					uni.hideLoading();
				})
			},
			back(){
				uni.navigateBack();
			},
		},
	}
</script>

<style lang="scss">
page{
	// background-color: #F5F5F5;
	background: linear-gradient(#F5F5F5 50%, #FFFFFF 50%);
}
</style>
<style lang="scss" scoped>
.eval{
	.server-tips{
		padding: 60rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 20rpx;
			height: 20rpx;
			margin-right: 10rpx;
		}
		text{
			color: #141414;
			font-size: $fontSize22;
		}
	}
	.server-content{
		background: #FFFFFF;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		padding: 30rpx;
		.content-header{
			display: flex;
			width: 690rpx;
			box-sizing: border-box;
			.content-header-left{
				width: 100rpx;
				flex-shrink: 0;
				image{
					image-rendering: optimize-contrast;
					image-rendering: -webkit-optimize-contrast;
				}
				.portrait{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
			.content-header-right{
				padding-left: 40rpx;
				flex: 1;
				.item-row{
					display: flex;
					align-items: center;
					padding-bottom: 10rpx;
					text{
						color: #141414;
						font-size: $mainFontSize;
						font-weight: bold;
					}
					.tag{
						color: #FE6E32;
						border-radius: 8rpx;
						border: 1px solid #FE6E32;
						font-size: 20rpx;
						margin-left: 10rpx;
						padding: 4rpx 10rpx;
					}
				}
				.item-row2{
					color: #808080;
					font-size: $fontSize26;
				}
			}
		}
		.form{
			margin-top: 40rpx;
		}
	}
	.form-item_only{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		.switch{
			display: flex;
			align-items: center;
			text{
				font-size: $fontSize26;
				padding-left: 20rpx;
			}
		}
		.title{
			color: #808080;
			font-size: $fontSize22;
		}
	}
}
</style>
