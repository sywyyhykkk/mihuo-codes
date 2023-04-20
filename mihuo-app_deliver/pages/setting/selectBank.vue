<template>
	<view>
		<z-nav-bar backState="1000">
			<image slot="left" src="/static/icon/arrow_left.png" class="left_back" @click="goBack">
			<view slot="default" class="nav-bar">选择开户行</view>
		</z-nav-bar>
		<view class="search_box">
			<u-search shape="round" clearabled placeholder="请输入关键字搜索" :show-action="false" v-model="searchValue" height=86
			search-icon="/static/icon/search_icon.png" :input-style="inpStyle" @search="search" @change="changeValue" @blur="blur" />
		</view>
		<view class="bank_con">
			<view class="bank_item" v-for="(item,index) in bankList" :key="index">
				<view class="left">
					<image class="bank_icon" :src="item.icon" />
					<view class="bank_info">
						<view class="bank">{{item.bankName}}</view>
						<view class="bank_address">{{item.address}}</view>
					</view>
				</view>
				<view class="right">
					<u-radio-group v-model="value">
						<u-radio
							active-color="#002FA5"
							@change="radioboxChange(item)"
							:name="item.bankName"
							shape="circle"
							size=40
						/>
					</u-radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				selectedBank:'',
				value:'',
				searchValue:'',
				inpStyle:{fontSize:'28rpx'},
				bankList:[
					{icon:'/static/icon/zs_bank.png',bankName:'招商银行滇池路支行',address:'环城西路255号'},
					{icon:'/static/icon/ny_bank.png',bankName:'中国农业银行春城路支行',address:'环城西路255号'},
					{icon:'/static/icon/js_bank.png',bankName:'建设银行储蓄卡永昌支行',address:'环城西路255号'},
					{icon:'/static/icon/zg_bank.png',bankName:'中国银行东寺街支行',address:'环城西路255号'},
					{icon:'/static/icon/gs_bank.png',bankName:'中国工商牡丹支行',address:'环城西路255号'},
				]
			}
		},
		
		methods:{
			goBack(){
				uni.$emit('selectData', this.selectedBank)
				uni.navigateBack()
			},
			radioboxChange(e){
				this.selectedBank = e.bankName
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.left_back{
		width: 18rpx;
		height: 32rpx;
		margin-left: 35rpx;
	}
	.nav-bar {
		font-weight: bold;
		font-size: 36rpx;
		color: $fontColor33;
	}
	.search_box{
		background: #FFF;
		height: 152rpx;
		line-height: 152rpx;
		padding: 0 28rpx;
	}
	.bank_con{
		background: #FFFFFF;
		margin-top: 8rpx;
		padding: 0 26rpx;
		.bank_item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 38rpx 0 34rpx 18rpx;
			border-bottom: 1px dashed $borderColorEE;
			.left{
				display: flex;
				align-items: center;
				.bank_icon{
					width: 70rpx;
					height: 70rpx;
					margin-right: 20rpx;
				}
				.bank_info{
					.bank{
						font-size: $middleFontSize;
						color: $seconFontColor;
					}
					.bank_address{
						font-size: $smiddleFontSize;
						color: $viceFontColor;
					}
				}
			}
			.right{
				margin-right: 20rpx;
			}
		}
		
	}
</style>
