<template>
	<view class="demand_des">
		<z-nav-bar fontColor="#141414" bgColor="#F5F5F5" :backState="3000" @backClick="goBack">
			<view class="nav-bar-title" slot="default">验收报告</view>
		</z-nav-bar>
		<view  v-if="dataList.length" style="padding:0 30rpx">
			<view v-for="(item, index) in dataList" :key="index" class="demand_des-item">
				<view class="log-top">
					<u-avatar class="avatar" size="64" :src="$util.thumbnailImage(item.applyPersonAvatar,true)"/>
					<view class="log_name">{{ item.applyPersonName }}</view>
					<text class="log_skill-name">{{ item.applySkillName }}</text>
				</view>
				<view class="submit_time">提交时间 {{item.applyTime || ''}}</view>
				<view class="describe">{{item.applyDesc || ''}}</view>
				<view class="image_show" v-if="item.picFiles">
					<order-mh-image-show :imgSrc="item.picFiles" width="196" height="196" right="12" />
				</view>
				<view v-if="item.voiceFiles">
					<order-mh-mihuo-audio :formDate="JSON.parse(item.voiceFiles)" />
				</view>
			</view>
		</view>
		<order-mh-empty v-else size="300" title="暂无验收报告~~" />
		<bottom-button title="确认验收" @click="confirmCheck" v-if="options.isDo"></bottom-button>
	</view>
</template>

<script>
	/*
		statusFlag:验收状态 0、待验收 1、通过 2、未通过
		单工种验收报告
	*/
	export default {
		data() {
			return {
				dataList:[],
				options:{},
				isRefresh:false
			}
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			this.getDataList()
		},
		methods: {
			goBack(){
				uni.navigateBack();
				if(this.isRefresh) uni.$emit('refresh');
			},
			getDataList(){
				this.isRefresh = false;
				this.$http
				.get('order/customer/bizorderacceptance/getByOrderId', {
					orderId: this.options.id
				})
				.then((res) => {
					if(res && res.length){
						this.dataList = res
					}
				})
			},
			// 确认验收
			confirmCheck(){
				this.$http
				.post('order/customer/bizorderacceptance/editStatus', {
					statusFlag: 1,
					id: Number(this.dataList[this.dataList.length-1].id)
				})
				.then((res) => {
					if (res) {
						uni.showToast({
							title: '已确认验收,即将返回上一页',
							icon: 'none'
						})
						this.isRefresh = true;
						setTimeout(()=>{
							uni.navigateBack();
							// 验收成功回调
							uni.$emit('success',{type:'check'})
							uni.$emit('refresh')
						},1000)
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.des_title{
		font-size: $fontSize30;
		font-family: PingFang SC;
		font-weight: bold;
		color: $mainFontColor14;
		margin-right: 25rpx;
		@include toe();
	}
	.check_state{
		width: 72rpx;
		height: 28rpx;
		background: #FE6E32;
		line-height: 28rpx;
		text-align: center;
		font-size: 18rpx;
		font-family: FZRuiZhengHei_GBK;
		font-weight: bold;
		color: #FFFFFF;
		border-radius: 10rpx 2rpx 10rpx 0px;
	}
	.submit_time{
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #808080;
		padding: 10rpx 0;
	}
	.address_view{
		margin-top: 20rpx;
		.address_icon{
			width: 25rpx;
			height: 29rpx;
			margin-right: 25rpx;
		}
		.address{
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			@include toe();
		}
	}
	
	.demand_des{
		.demand_des-item{
			margin: 40rpx 0;
			.log-top{
				display: flex;
				align-items: center;
				.log_name{
					color: #141414;
					font-size: 28rpx;
					font-weight: bold;
					padding: 0 20rpx;
				}
				.log_skill-name{
					color: #FE6E32;
					border: 2rpx solid #FE6E32;
					font-size: $fontSize22;
					padding: 0 10rpx;
					border-radius: 6rpx;
					font-weight: 800;
				}
			}
		}
		.describe{
			font-size: $fontSize26;
			font-family: PingFang SC;
			font-weight: 500;
			color: $mainFontColor14;
			line-height: 40rpx;
		}
		.image_show{
			margin-top: 20rpx;
		}
	}
	.display-left{
		display: flex;
		align-items: center;
	}
	.nav-bar-title {
		font-weight: bold;
		color: #141414;
	}
	.nav-bar-share {
		width: 34rpx;
		height: 33rpx;
		margin-right: 30rpx;
	}
</style>
