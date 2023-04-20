<template>
	<view class="problems" v-if="value.length">
		<view class="label" :style="{'fontSize':styleObj.fontSize,'fontWeight':styleObj.fontWeight}">{{styleObj.label}}</view>
		<view class="reason_item" v-for="(item,index) in value" :key="item.id">
			<text class="number">{{$util.numberSort(index + 1)}}<text class="reason">{{item.name}}</text></text>
			<view class="align-items">
				<view class="item_detail">
					<view class="public">
						处罚金额 <text>{{item.money}} 元</text>
					</view>
					<view class="public">
						积分 <text>{{item.integral || item.points || 0}} 分</text>
					</view>
					<view class="public">
						禁单天数 <text>{{item.forbidDay}} 天</text>
					</view>
				</view>
				<image class="remove_icon" v-show="deleteIconShow" src="/static/icon/delete.png" mode="" @click="removeThisPunish(index)" />
			</view>
		</view>
		
		<view class="item_total item_detail">
			<view class="total">总计</view>
			<view class="public">
				金额 <text>{{totalMoney}} 元</text>
			</view>
			<view class="public">
				积分 <text>{{totalIntegral}} 分</text>
			</view>
			<view class="public">
				禁单 <text>{{totalDay}} 天</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"punish-item",
		props:{
			styleObj:{
				type:Object,
				default(){
					return {}
				}
			},
			value:{
				type:Array,
				default(){
					return []
				}
			},
			deleteIconShow:{
				type:Boolean,
				default:false
			},
			itemId:{
				type:Number,
				default:null
			}
		},
		
		computed:{
			totalMoney(){
				return this.calcTotal('totalMoney')
			},
			totalIntegral(){
				return this.calcTotal('totalIntegral')
			},
			totalDay(){
				return this.calcTotal('totalDay')
			}
		},
		
		methods:{
			calcTotal(total){
				let newTotal = 0,total1 = 0,total2 = 0;
				this.value.map(item => {
					switch(total){
						case 'totalMoney':
							newTotal += item.money;
						break;
						case 'totalIntegral':
							if(item.integral){
								total1 += item.integral || 0;
							}else if(item.points){
								total2 += item.points || 0;
							}
							newTotal = total1 + total2;
						break;
						case 'totalDay':
							newTotal += item.forbidDay || 0;
						break;
					}
				})
				return newTotal
			},
			
			removeThisPunish(index){
				this.$emit('removePunish',index,this.itemId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.problems{
		.reason_item{
			padding: 0 18rpx 32rpx 18rpx;
			margin-top: 12rpx;
			.number{
				font-weight: bold;
				font-size: 20rpx;
				color: #909199;
				.reason{
					margin-left: 6rpx;
					font-size: 24rpx;
					color: #606166;
				}
			}
		}
		.item_total{
			padding: 30rpx 0 0 18rpx;
			border-top: 2rpx dashed #EEEEEE;
			.total{
				font-weight: bold;
				font-size: 16px;
				color: #606166;
				margin-right: 24rpx;
			}
		}
		.item_detail{
			display: flex;
			align-items: center;
			.public{
				font-size: $smallFontSize;
				color: #909199;
				margin-right: 15rpx;
				text{
					margin-left: 4rpx;
					font-size: $smallFontSize;
					font-weight: bold;
					color: #ff5d35;
				}
			}
		}
		.img_view image{
			display: inline-block;
			width: 164rpx;
			height: 164rpx;
			margin: 22rpx 19rpx 19rpx 10rpx;
			border-radius: 10rpx;
		}
	}
	.remove_icon{
		width: 40rpx;
		height: 40rpx;
	}
	.label{
		margin-bottom: 32rpx;
		font-weight: bold;
		font-size: $middleFontSize;
		color: $darkTitle;
	}
	.align-items{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20rpx;
	}
</style>
