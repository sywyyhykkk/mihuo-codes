<template>
	<view v-if="data && data.length">
		<view class="master-list" 
			:style="{background: bgColor}"
			v-for="(item,index) in data"
			:key="index"
			>
			<view v-if="rank" class="master-rank">
				<view class="master-rank_index">{{ index + 1 }}</view>
			</view>
			<view class="master-list_left">
				<u-avatar class="avatar" size="132" :src="$util.avatarImage(item.userId)"/>
				<text class="ident_V">{{ item.levelName }}</text>
			</view>
			<view class="master-list_right">
				<view class="display-flex">
					<text class="name">{{ item.name }}</text>
					<text class="skill_name">{{ item.skillName }}</text>
				</view>
				<view class="master_work-year">{{ item.skillYearNum }}</view>
				<view class="display-flex">
					<view class="display-flex title">
						<text class="title_left">案例</text>
						<text class="title_right">{{ item.num }}</text>
					</view>
					<view class="display-flex title">
						<text class="title_left">累计服务</text>
						<text class="title_right">{{ item.serviceNum }}</text>
					</view>
					<view class="display-flex title">
						<text class="title_left">好评率</text>
						<text class="title_right">{{ item.evaluationRate || '100%'}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"craftsmen-list",
		props:{
			bgColor: {
				type: String,
				default: () => '#F7F7F7'
			},
			data:{
				type: Array,
				default: ()=> []
			},
			rank:{	//是否显示排名
				type: Boolean,
				default: ()=> false
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.master-list{
	border-radius: 12rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
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
			font-size: 16rpx;
			font-weight: bold;
			font-style:italic;
			background: -webkit-linear-gradient(to right,#333333, #666666); /* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(to right,#333333, #666666); /* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(to right,#333333, #666666); /* Firefox 3.6 - 15 */
			background: linear-gradient(to right,#333333, #666666); /* 标准的语法（必须放在最后） */
			border-radius: 10rpx 0;
			padding: 2rpx 6rpx;
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
			font-family: FZRuiZhengHei_GBK;
			font-weight: 800;
			display: inline-block;
			line-height: 34rpx;
			padding: 0 8rpx;
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