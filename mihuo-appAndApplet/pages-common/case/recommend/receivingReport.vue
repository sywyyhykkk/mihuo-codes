<template>
	<view>
		<z-nav-bar fontColor="black" title="验收报告"></z-nav-bar>
		<view v-if="details && details.acceptance" class="accept">
			<view v-for="(v,i) in details.acceptance" :key="i">
				<view class="collse" v-if="v.surveyTemplatePartDTOList && v.surveyTemplatePartDTOList.length">
					<view v-for="(item,index) in v.surveyTemplatePartDTOList" :key="index" @click="collse(item)">
						<view class="collse-item" v-if="index<=2">
							<view class="collse-item_top">
								<view class="template-name">{{ item.partName || ''}}</view>
								<u-icon :name="curArr.indexOf(item.id) == -1?'arrow-down':'arrow-right'" size="20"></u-icon>
							</view>
							<view v-if="curArr.indexOf(item.id) == -1">
								<view class="collse-item_main" v-for="(item1,index1) in item.surveyTemplateQuesDTOList" :key="index1">
									<view class="collse-item_main-left">
										<text style="margin-right:10rpx">{{index1>9?index1+1 : '0'+(index1+1)}}</text>
										<text>{{ item1.quesName || ''}}</text>
										<image-show style="margin-top:10rpx" v-if="item1.quesType == 4" :imgSrc="item1.answer" />
									</view>
									<view class="collse-item_main-right">
										<text  v-for="(item2,index2) in item1.surveyTemplateOptionDTOList" :key="index2">{{ item2.optionName}}</text>
									</view>
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
				acceptance:[],
				curArr:[],
				options:{},
				details:{}
			}
		},
		onLoad(options) {
			this.options = options;
			this.getDataList()
		},
		methods: {
			collse(data){
				let repeatArr=[];		//重复元素计算
				this.curArr.push(data.id);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i] == data.id) {
						repeatArr.push(data)
					}
				}
				if((repeatArr.length)%2===0){
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i] == data.id) {
							this.curArr.splice(i,1);
							i--
						}
					}
				}else{
					this.curArr = Array.from(new Set(this.curArr))
				};
			},
			getDataList() {
				this.$httpApi.getConstruCaseDetail(this.options.id).then(res => {
					if (res) {
						res.acceptance = JSON.parse(res.acceptance);
						if(res.acceptance){
							res.acceptance = [res.acceptance]
						}
						this.details = res;
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.accept{
	padding: 0 30rpx;
}
.collse-item{
	border-radius: 20rpx;
	border: 2rpx solid #F8F8F8;
	margin-bottom: 20rpx;
	.collse-item_top{
		border-top-right-radius: 20rpx;
		border-top-left-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #F7F7F7;
		.template-name{
			color: #141414;
			font-family: PingFang-SC;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
	.collse-item_main{
		padding: 30rpx 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&:last-child{
			padding-bottom: 30rpx;
		}
		.collse-item_main-left{
			text{
				color: #000000;
				font-size: 24rpx;
			}
		}
		.collse-item_main-right{
			text{
				color: #FE6E32;
				font-size: 24rpx;
				background: #FFF0EA;
				border-radius: 6rpx;
				padding: 10rpx;
				margin-right: 20rpx;
			}
		}
	}
}
.open_btn {
	height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20rpx;
	border-radius: $miniBorderRadius;
	.btn_title {
		font-size: $fontSize26;
		font-family: PingFang SC;
		font-weight: 500;
		color: $fontColor80;
	}
	image {
		width: 14rpx;
		height: 8rpx;
		transition: all .2s;
		margin-left: 12rpx;
	}
	.open_btn-is{
		border: 1rpx solid #141414;
		border-radius: 40rpx;
		padding: 16rpx 25rpx;
		display: flex;
		align-items: center;
	}
	text{
		color: #141414;
		font-size: 20rpx;
		font-weight: bold;
	}
}
</style>