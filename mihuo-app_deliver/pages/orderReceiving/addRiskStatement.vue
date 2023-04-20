<template>
	<view class="risk-statement">
		<view class="risk_title">风险提示</view>
		<view class="risk-statement-list" v-for="(item,index) in riskList" :key="index">
			<view class="risk-contian">
				<view class="item-desc">
					<u-input v-model="item.name" placeholder-style="color: #999999;fontSize: 26rpx;"
						class="describe-input" maxlength="200" height="100" type="textarea" placeholder="请输入一条说明内容"
						:border="true" />
				</view>
				<view class="img-contain">
					<image-upload-new :uploadType="['图片','拍摄']" :count="9" v-model="item.attachments" />
				</view>
			</view>
			<view class="risk_add" v-if=" riskList.length > 1" @click="addRisk('delete',index)">
				<u-icon name="minus" size="24" color="#002FA5"></u-icon>
				<text>删除</text>
			</view>
			<view class="risk_add" v-if="index + 1 == riskList.length" @click="addRisk('add')">
				<u-icon name="plus" size="24" color="#002FA5"></u-icon>
				<text>新增</text>
			</view>
		</view>
		<bottom-button title="确认提交" @click="submit()"></bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				riskList: [{
					attachments: "",
					name: "",
				}]
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			addRisk(type, index) {
				if (type == 'add') {
					this.riskList.push({
						attachments: "",
						name: "",
					})
				} else {
					this.riskList.splice(index, 1)
				}
			},
			submit() {
				let checkStatus = false
				let tempName = ''
				try{
					this.riskList.forEach((el,index) =>{
						if(!el.name){
							checkStatus = true
							throw index
						}
					})
				}catch(e){
					uni.showToast({
						title: `请填写第${e+1}项目风险说明`,
						icon: 'none'
					});
				}
				if(checkStatus){
					return
				}
				this.$httpApi.addRisk({
					orderId: this.option.beforeOrderId  !== 'undefined' ? this.option.beforeOrderId : this.option.orderId,
					risks: this.riskList,
				}).then(res => {
					if (res) {
						uni.showToast({
							title: '操作成功~',
							icon: 'none'
						});
						setTimeout(() => {
							this.goBack()
						}, 1000)
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	
	.button-content{
		height: inherit !important;
	}
	/* @import url(); 引入css类 */
	.risk-statement {
		padding: 32rpx;
		background-color: #FFFFFF;
		margin: 20rpx;
		border-radius: 10rpx;

		.risk_title {
			font-size: 30rpx;
			margin-bottom: 18rpx;
			color: #333333;
		}

		.risk-contian {
			width: 80%;
		}

		.risk-statement-list {
			display: flex;
			margin-bottom: 20rpx;
		}

		.risk_add {
			border: 2rpx solid #002FA5;
			border-radius: 10rpx;
			width: 112rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 72rpx;
			margin-left: 20rpx;

			text {
				font-size: 24rpx;
				color: #002FA5;
				margin-left: 4rpx;
			}

		}

		.item-desc {
			background: #F6F7F9;
			border-radius: 10rpx;
			margin-bottom: 10rpx;

			.describe-input {
				border: 0px;
			}
		}
	}
</style>
