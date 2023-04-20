<template>
	<view>
		<z-nav-bar fontColor="#000">
			<view class="nav-bar-title" slot="default">{{patrolData.title}}</view>
		</z-nav-bar>
		
		<view class="top-info">
			<view class="info-item display-center">
				<view class="left">巡检日期</view>
				<view class="right">{{patrolData.created&&patrolData.created.slice(0,10)}}</view>
			</view>
			<view class="info-item display-center" v-if="patrolData.person&&patrolData.person.userId">
				<view class="left">巡检人</view>
				<view class="personal-info">
					<u-avatar size="50" :src="$util.avatarImage(patrolData.person.userId)" />
					<view class="name">{{patrolData.person.name}}</view>
					<view class="skill-name">{{patrolData.person.skillName}}</view>
				</view>
			</view>
		</view>
		
		<view class="remarks-con">
			<view class="title">内容</view>
			<view class="desc">{{patrolData.content}}</view>
			<view v-if="patrolData.audio">
				<audio-play :formDate="JSON.parse(patrolData.audio)" />
			</view>
			<view class="image-show" v-if="patrolData.pics">
				<image-show :imgSrc="patrolData.pics"  />
			</view>
		</view>
		
		<view class="remarks-con" v-for="(item,index) in patrolData.customInspectList" :key="index">
			<view class="title">问题{{$util.translateNumberToChinese(index + 1)}}</view>
			<view class="desc">{{item.contents}}</view>
			<view v-if="item.audio">
				<audio-play :formDate="JSON.parse(item.audio)" />
			</view>
			
			<view class="image-show" v-if="item.pics">
				<image-show :imgSrc="item.pics" />
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				patrolData:{},
			}
		},
		
		onLoad(option) {
			const newId = Number(option.id)
			this.getPatrolDetail(newId)
		},
		
		methods:{
			getPatrolDetail(id){
				this.personList = []
				this.$http.get(`order/sopinspect/${id}`).then(res => {
					if(res){
						this.patrolData = res;
					}
				})
			},
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar-title{
		font-weight: bold;
		color: #141414;
	}
	.header_icon {
		width: 20px;
		height: 20px;
		margin-left: 20rpx;
	}
	.top-info{
		margin-top: 30rpx;
		.info-item{
			height: 100rpx;
			padding: 0 30rpx;
			border-bottom: 1rpx solid #F7F7F7;
			.left{
				font-size: 28rpx;
				font-weight: 500;
				color: #000000
			}
			.right{
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
			}
		}
	}
	
	.remarks-con{
		padding: 40rpx 22rpx 30rpx 30rpx;
		border-bottom: 1rpx solid #F7F7F7;
		.title{
			font-size: 28rpx;
			font-weight: 500;
			color: #000000
		}
		.desc{
			margin-top: 30rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #4D4D4D;
			line-height: 48rpx;
		}
		.image-show{
			margin-top: 20rpx;
		}
	}
	.personal-info{
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		.name{
			margin: 0 9rpx 0 14rpx;
			font-size: 25rpx;
			font-weight: 400;
			color: #000000;
		}
		.skill-name{
			padding: 4rpx 8rpx;
			font-size: 19rpx;
			font-weight: 400;
			color: #FE6E32;
			background: rgba(254, 110, 50, .1);
			border-radius: 10rpx 2rpx 10rpx 0rpx;
		}
	}
	
	.display-center{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
