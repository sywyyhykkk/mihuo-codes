<template>
	<view v-if="value && value.length" class="master">
		<view class="master-list" 
			:style="{background: bgColor}"
			v-for="(item,index) in value"
			:key="index"
			>
			<view class="master-list_left">
				<u-avatar class="avatar" size="100" :src="$util.thumbnailImage(item.managerAvatar)"/>
				<text class="ident_V" v-if="item.managerLevel">{{ item.managerLevel || '' }}</text>
			</view>
			<view class="master-list_right">
				<view class="display-flex list_right-top">
					<view class="display-flex">
						<text class="name">{{ item.managerName }}</text>
						<text class="skill_name" v-if="options.title">{{ options.title }}</text>
					</view>
					 <image @click="callPhone(item)"
                                src="https://www.51mihuo.com/static/icon/work_type/phone.png" class="image" />
				</view>
				<view class="display-flex row">
					<view class="display-flex title">
						<text class="title_left">案例</text>
						<text class="title_right">{{ item.caseNum || 0 }}</text>
					</view>
					<view class="display-flex title">
						<text class="title_left">累计服务</text>
						<text class="title_right">{{ item.serviceNum }}</text>
					</view>
					<view class="display-flex title">
						<text class="title_left">好评率</text>
						<text class="title_right">{{ (item.rate || 100 ) + '%'}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			bgColor: {
				type: String,
				default: () => '#F7F7F7'
			},
			value:{
				type: Array,
				default: ()=> []
			},
			rank:{	//是否显示排名
				type: Boolean,
				default: ()=> false
			},
			options:{
				type: Object,
				default: ()=> {}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			callPhone(data) {
				if(data.managerPhone){
					uni.makePhoneCall({
						phoneNumber: data.managerPhone
					})
				}
			},
		},
	}
</script>

<style lang="scss">
.master{
	padding-bottom: 30rpx;
}
.master-list{
	border-radius: 12rpx;
	padding: 20rpx 30rpx;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	&:last-child{
		margin-bottom: 0;
	}
	.master-rank{
		margin-right: 20rpx;
		.master-rank_index{
			padding:0 10rpx 10rpx;
			color: #A8A8A8;
			font-size: 28rpx;
			font-family: NotoSansHans;
			// font-style:italic;
			border-radius: 8rpx;
			text-align: center;
			position: relative;
			&::before{
				position: absolute;
				content: "";
				width: 0;
				height: 0;
				left: 0;
				bottom: 0;
				border: solid 18rpx transparent;
				border-bottom: solid 10rpx #FFFFFF;
			}
		}
	}
	&:first-child{
		.master-rank_index{
			color: #FFFFFF;
			background: #ED3832;
		}
	}
	&:nth-child(2){
		.master-rank_index{
			color: #FFFFFF;
			background: #FE6E32;
		}
	}
	&:nth-child(3){
		.master-rank_index{
			color: #FFFFFF;
			background: #CCCCCC;
		}
	}
	.master-list_left{
		position: relative;
		margin-right: 30rpx;
		.ident_V{
			position: absolute;
			top: 0;
			right: 0;
			color: #FFFFFF;
			font-family: HuXiaoBo-NanShen;
			font-size: 15rpx;
			font-weight: bold;
			font-style:italic;
			background: -webkit-linear-gradient(to right,#333333, #666666); /* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(to right,#333333, #666666); /* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(to right,#333333, #666666); /* Firefox 3.6 - 15 */
			background: linear-gradient(to right,#333333, #666666); /* 标准的语法（必须放在最后） */
			border-radius: 10rpx 0;
			padding: 4rpx 6rpx;
		}
	}
	.master-list_right{
		flex: 1;
		.name {
			font-size: $middleFontSize;
			color: $mainFontColor14;
			font-family: PingFang SC;
			font-weight: bold;
			margin-right: 17rpx;
		}
		.skill_name {
			font-size: $fontSize22;
			color: $fontColorPrice;
			font-family: HuXiaoBo-NanShen;
			font-weight: bold;
			display: inline-block;
			padding: 5rpx;
			text-align: center;
			border: 2rpx solid $fontColorPrice;
			border-radius: 6rpx;
		}
		.master_work-year{
			color: #141414;
			font-size: 24rpx;
			padding: 20rpx 0;
		}
		.title{
			margin-right: 15rpx;
			text{
				font-size: 24rpx;
			}
			.title_left{
				color: #808080;
				padding-right: 10rpx;
			}
			.title_right{
				color: #000000;
			}
		}
		.row{
			justify-content: space-between;
			padding-top: 24rpx;
		}
		.list_right-top{
			justify-content: space-between;
			.image{
				width: 24rpx;
				height: 24rpx;
			}
		}
	}
}
.display-flex{
	display: flex;
	align-items: center;
}
.bottom{
	flex: 1;
}
</style>