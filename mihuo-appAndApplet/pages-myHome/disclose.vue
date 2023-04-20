<template>
	<view>
		<z-nav-bar fontColor="#000">
			<view class="nav-bar-title" slot="default">水电交底</view>
		</z-nav-bar>
		
		
		<view class="top-info">
			<view class="info-item display-center">
				<view class="left">较低日期</view>
				<view class="right">{{discloseData.discloseDate&&discloseData.discloseDate.slice(0,10)}}</view>
			</view>
			<view class="info-item display-center">
				<view class="left">交底位置</view>
				<view class="right">{{discloseData.discloseAddress}}</view>
			</view>
		</view>
		
		<view class="remarks-con">
			<view class="title">备注内容</view>
			<view class="desc">{{discloseData.remark}}</view>
			<view v-if="discloseData.audio&&discloseData.audio.timeLength">
				<audio-play :formDate="discloseData.audio" />
			</view>
			<view class="image-show" v-if="discloseData.imgList">
				<image-show :imgSrc="discloseData.imgList" />
			</view>
		</view>
		
		<view class="remarks-con">
			<view class="title">补充信息</view>
			<view v-for="(item,index) in discloseData.discloseAddDTOList" :key="item.id">
				<view class="display-center" v-if="item.person&&item.person.userId">
					<view class="personal-info">
						<u-avatar size="60" :src="$util.avatarImage(item.person.userId)" />
						<view class="name">{{item.person.name}}</view>
						<view class="skill-name">{{item.person.skillName}}</view>
					</view>
					<view class="time">{{item.createTime&&item.createTime.slice(0,16)}}</view>
				</view>
				
				<view class="desc">{{item.addContent}}</view>
				<view v-if="item.audio&&item.audio.timeLength">
					<audio-play :formDate="item.audio" />
				</view>
				
				<view class="image-show" v-if="item.imgList">
					<image-show :imgSrc="item.imgList" />
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				discloseData: {},
				imgList:'',
				audioData: {}
			}
		},
		
		onLoad(option) {
			this.getData(option.id)
		},
		
		methods:{
			setItemFile(data, type) {
				if (!data) {
					return
				}
				let file = data !== '' && JSON.parse(data)
				let tempImg = ''
				let tempAudio = ''
				file.map(item => {
					item = item !== '' && JSON.parse(item)
				})
				file.map(item => {
					if (Array.isArray(JSON.parse(item))) {
						tempImg = item
					} else {
						tempAudio = item
					}
				})
				if (type === 'img') {
					return tempImg
				} else {
					return tempAudio
				}
			},
			getData(id){
				this.$httpApi.getDiscloseById(id).then((res) => {
					if (res) {
						res['imgList'] = this.setItemFile(res.files, 'img');
						res['audio'] = this.setItemFile(res.files, 'audio');
						res.discloseAddDTOList.map(item => {
							item['imgList'] = this.setItemFile(item.addFiles, 'img');
							item['audio'] = this.setItemFile(item.addFiles, 'audio');
						})
						this.discloseData = res
					}
				})
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
		.time{
			font-size: 25rpx;
			font-weight: 400;
			color: #A8A8A8;
		}
	}
	
	.display-center{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
