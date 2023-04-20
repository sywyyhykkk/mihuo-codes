<template>
	<view class="content">
		<view v-if="item && item.length">
			<view class="title" style="font-size: 32rpx;margin-top:0">品质自装装修流程</view>
			<view class="flex-center content-contain">
				<view v-for="(item, index) in item" :key="index" class="tabs-item flex-center"
					:class="{'tabs-active':currentTab === index}"
					@click="tapFlow(item,index)">
					<view class="tabs_title">{{ item.name || ''}}</view>
					<text class="tabs_tips"></text>
					<!-- <text class="tabs_line" v-if="(index + 1) != item.length"></text> -->
				</view>
			</view>
			<view class="tabs-tooltip">
				<view class="flex-center">
					<!-- #ifdef APP-PLUS -->
					<image class="img" mode="aspectToFit" src="@/pages-homeCall/static/icon/fwz_20x20.png"/>
					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<mihuo-image class="img" src="https://www.51mihuo.com/static/icon/home_v3/fwz_20x20.png"/>
					<!-- #endif -->
					服务者
					<text class="skillname">·{{ item[currentTab].skillName || ''}}</text>
				</view>
				<view class="flex-center">
					<!-- #ifdef APP-PLUS -->
					<image class="img" mode="aspectToFit" src="@/pages-homeCall/static/icon/gq_20x20.png"/>
					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<mihuo-image class="img" src="https://www.51mihuo.com/static/icon/home_v3/gq_20x20.png"/>
					<!-- #endif -->
					工期
					<text class="skillname">·{{ item[currentTab].day || 0}}天</text>
				</view>
				<view class="flex-center">
					<!-- #ifdef APP-PLUS -->
					<image class="img" mode="aspectToFit" src="@/pages-homeCall/static/icon/fy_20x20.png"/>
					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<mihuo-image class="img" src="https://www.51mihuo.com/static/icon/home_v3/fy_20x20.png"/>
					<!-- #endif -->
					费用
					<text class="skillname">·{{ item[currentTab].price || 0}}元</text>
				</view>
			</view>
		</view>
		<view class="service" v-if="item[currentTab].serviceContents && item[currentTab].serviceContents.length">
			<view class="title">服务内容</view>
			<view class="service-content">
				<view
					v-for="(v,index) in item[currentTab].serviceContents" 
					:key="index"
					:style="[styleObj(index)]"
					class="content"
					>
					<text class="service_bg" :style="[styleBg(index,'bg')]"></text>
					<view class="service-content_item">
						<text class="service_seq" :style="[styleBg(index,'seq')]">{{ index + 1 }}</text>
						<view class="content-item_right" @click="service(v)">
							<view class="flex-center-box">
								<text class="service-title">{{ v.name || '' }}</text>
								<u-icon name="arrow-right" size="24" v-if="v.content && v.content != '[]'"></u-icon>
							</view>
							<view class="desc">{{ v.des || ''}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="delivery" v-if="item[currentTab].deliveryOutputs && item[currentTab].deliveryOutputs.length">
			<view class="title">交付成果</view>
			<view class="delivery-list">
				<view class="delivery-item" v-for="(v,index) in item[currentTab].deliveryOutputs" :key="index">
					<u-lazy-load v-if="v.icon" height="54"
						:style="{ width: '54rpx' }" 
						imgMode="aspectFill"
						:image="$util.thumbnailImage(v.icon,true)">
					</u-lazy-load>
					<text class="delivery-item_lable">{{v.name || ''}}</text>
				</view>
			</view>
		</view>
		<edit-view v-if="item[currentTab].contentPage" class="edit_view" v-model="item[currentTab].contentPage"/>
		<view class="problem" v-if="item[currentTab].commonProblems && item[currentTab].commonProblems.length">
			<view class="title">常见问题</view>
			<view class="problem-item" v-for="(item,index) in item[currentTab].commonProblems" :key="index">
				<view class="problem-item_left">Q</view>
				<view class="problem-item_right">
					<text>{{item.name || ''}}</text>
					<view>{{item.value || ''}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'
	var arrOdd = [];
	var arrEnev = [];
	var arrOddBg = [];
	var arrEnevBg = [];
	export default {
		props:{
			item:{
				type:Array,
				default:()=>[]
			}
		},
		data() {
			return {
				currentTab:0,
			}
		},
		methods: {
			tapFlow(data,index){
				this.currentTab = index;
			},
			styleObj(index){
				if((index%2) === 0){
					return {
						marginRight:'20rpx'
					}
				}
			},
			styleBg(index,type){
				var bg = "#FE6E32";
				var bg1 = "#F3E6E2";
				var odd = [];
				var even = [];
				if((index%2) === 0){	//偶数下标
					if(type=='bg'){
						arrEnevBg.push(index)
						even = this.styleCommon(arrEnevBg,'even')
					}
					if(type=='seq'){
						arrEnev.push(index)
						even = this.styleCommon(arrEnev,'even')
					}
					//偶数组下，奇数下标
					if(even.includes(index)){
						return {
							background:type=="seq"?bg:bg1
						}
					}
				}else{
					if(type=='bg'){
						arrOddBg.push(index)
						odd = this.styleCommon(arrOddBg,'odd')
					}
					if(type=='seq'){
						arrOdd.push(index)
						odd = this.styleCommon(arrOdd,'odd')
					}
					//奇数组下，偶数下标
					if(odd.includes(index)){
						return {
							background:type=="seq"?bg:bg1
						}
					}
				}
			},
			styleCommon(data,type){
				var odd = [];
				var even = [];
				if(type == 'even'){
					for(var i = 0; i < data.length; i++) {
						if(i % 2 == 1) { 
							even.push(data[i])
						}
					}
					return even
				}
				if(type == 'odd'){
					for(var i = 0; i < data.length; i++) {
						if(i % 2 == 0) { 
							odd.push(data[i])
						}
					}
					return odd
				}
			},
			service(data){
				this.$emit('click',data)
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	.content-contain{
		width: 690rpx;
		white-space: nowrap;
		flex-flow: row nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		padding-bottom: 18rpx;
		.tabs-item{
			background: #F0F0F0;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			padding: 0 25rpx;
			margin-right: 30rpx;
			position: relative;
			&::after{
				content: '';
				position: absolute;
				width: 40rpx;
				height: 2rpx;
				background: #F7F7F7;
				right: -40rpx;
			}
			&:last-child{
				margin-right: 0;
				&::after{
					width:0;
				}
			}
			.tabs_line{
				position: absolute;
				width: 40rpx;
				height: 2rpx;
				background: #F7F7F7;
				right: -40rpx;
			}
			.tabs_title{
				font-family: NotoSansHans-Medium;
				color: #808080;
				font-size: 28rpx;
				font-weight: bold;
			}
			.tabs_tips{
				height: 10rpx;
				width: 10rpx;
				border-radius: 50%;
				border: 1rpx solid #808080;
				margin-left: 10rpx;
				position: relative;
				&::before{
					content: '';
					position: absolute;
					height: 60%;
					width: 60%;
					border-radius: 50%;
					background: #808080;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
			}
		}
		.tabs-active{
			background: #000000;
			position: relative;
			&::before{
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -20rpx;
				content: '';
				border-bottom: 10rpx solid #F7F7F7;
				border-left: 10rpx solid transparent;
				border-right: 10rpx solid transparent;
			}
			.tabs_title{
				color: #FFFFFF;
			}
		}
	}
	.tabs-tooltip{
		background: #F7F7F7;
		border-radius: 15rpx;
		padding: 30rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		view{
			font-family: NotoSansHans-Regular;
			font-size: 24rpx;
			color: #000000;
			justify-content: center;
		}
		.img{
			width: 20rpx;
			height: 20rpx;
			margin-right: 10rpx;
		}
		.skillname{
			font-family: HuXiaoBo-NanShen;
			color: #000000;
			font-size: 24rpx;
		}
	}
	.service{
		.service-content{
			display: flex;
			flex-flow: row wrap;
			.content{
				position: relative;
				.service_bg{
					position: absolute;
					width: 30rpx;
					height: 30rpx;
					background: #E6E9F3;
					display: inline-block;
					right: 0;
					border-bottom-left-radius: 30rpx;
					border-top-right-radius: 10rpx;
				}
			}
			.service-content_item{
				padding: 30rpx 0;
				margin-bottom: 20rpx;
				background: #F7F7F7;
				border-radius: 10rpx;
				width: 335rpx;
				display: flex;
				align-items: flex-start;
				.service_seq{
					color: #FFFFFF;
					font-size: 20rpx;
					font-family: HuXiaoBo-NanShen;
					background: #262626;
					padding: 6rpx 12rpx;
					border-radius: 0 20rpx 20rpx 0;
					margin-right: 10rpx;
				}
				.content-item_right{
					padding-right: 20rpx;
					.service-title{
						font-family: NotoSansHans-Medium;
						color: #000000;
						font-size: 28rpx;
						padding-bottom: 20rpx;
						font-weight: bold;
					}
					.desc{
						color: #999999;
						font-family: NotoSansHans-Regular;
						font-size: 24rpx;
						@include bov(2)
					}
				}
			}
		}
	}
	.delivery{
		padding-bottom: 30rpx;
	}
	.delivery-list{
		display: flex;
		flex-flow: row wrap;
		.delivery-item{
			padding: 30rpx 0;
			background: #F7F7F7;
			border-radius: 15rpx;
			height: 160rpx;
			width: 160rpx;
			margin:0 7rpx 14rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			.delivery-item_img{
				width: 54rpx;
				height: 54rpx;
			}
			.delivery-item_lable{
				font-family: NotoSansHans-Medium;
				font-size: 20rpx;
				color: #000000;
				font-weight: bold;
			}
		}

	}
	.problem{
		border-top: 2rpx solid #F0F0F0;
		.problem-item{
			display: flex;
			align-items: baseline;
			margin-bottom: 30rpx;
			.problem-item_left{
				color: #FE6E32;
				font-family: MicrosoftYaHei;
				font-size: 22rpx;
				font-weight: bold;
				margin-right: 12rpx;
			}
			.problem-item_right{
				flex: 1;
				text{
					font-family: NotoSansHans-Medium;
					font-size: 24rpx;
					color: #000000;
					font-weight: bold;
				}
				view{
					font-family: NotoSansHans-Medium;
					font-size: 20rpx;
					color: #808080;
					padding-top: 16rpx;
				}
			}
		}
	}
}
.title{
	font-size: 28rpx;
	font-family: NotoSansHans-Medium;
	color: #000000;
	font-weight: bold;
	margin: 40rpx 0 30rpx;
}
.flex-center{
	display: flex;
	align-items: center;
}
.flex-center-box{
	display: flex;
	align-items: baseline;
}
</style>
