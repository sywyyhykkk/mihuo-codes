<template>
	<view class="">
		<z-nav-bar bgColor="#f5f5f5">
			<view class="nav-title" slot="default">联系记录</view>
		</z-nav-bar>

		<view v-if="recordList.length">
			<view class="record-item" v-for="item in recordList" :key="item.id">
				<view class="personal-info display-left">
					<u-avatar class="avatar" size="126" :src="$util.avatarImage(item.userId)" />
					<view class="right-info">
						<view class="name">{{item.userName}}</view>
						<view class="tel">{{$util.displayTel(item.userPhone,item.showPhone)}}</view>
						<view class="skill_name display-left">
							<view class="skill_name_item" v-for="(em,dx) in item.skillNames&&item.skillNames.split(',')" :key="dx">
								{{em}}
							</view>
						</view>
					</view>
				</view>

				<view class="address-con display-center">
					<view class="address-view display-center">
						<image class="icon" src="/static/icon/location1.png" />
						<view class="address">{{item.cityName+item.districtName+item.poiName}}</view>
					</view>
					<view class="distance">{{calcDistance(item.latitude,item.longitude)}}</view>
				</view>
				
				<view class="contact-view">
					<view class="display-left" @click="chat(item.id,item.userId,item.userName)">
						<image class="icon" src="/static/icon/headset.png" />
						<view class="label">在线联系</view>
					</view>
					<view class="display-left" @click="callTel(item.userPhone)" v-if="item.showPhone==1">
						<image class="icon" src="/static/icon/headset.png" />
						<view class="label">拨打电话</view>
					</view>
				</view>
			</view>
		</view>
		
		<mh-empty v-else icon="/static/images/no_recommend.png" title="暂无联系记录" />
	</view>
</template>

<script>
	export default{
		data(){
			return{
				latitude: uni.getStorageSync('latitude') || 0, // 纬度
				longitude: uni.getStorageSync('longitude') || 0, // 经度
				info: {},
				page:1,
				size:10,
				total:0,
				recordList: []
			}
		},
		
		onLoad(option) {
			this.info = JSON.parse(option.info)
			this.getNegotiationPage()
		},
		
		onReachBottom() {
			if (this.recordList.length === this.total) return;
			setTimeout(() => {
				this.page = this.page + 1;
				this.getNegotiationPage()
			}, 1000)
		},
		
		methods: {
			//在线联系
			chat(id,userId,userName) {
				let name = userName;
				let star = ''; //存放名字中间的*
				if (name!=='') {
					//名字是两位的就取姓名首位+*
					if (name.length <= 2) {
						name = '*' + name.substring(0, 1);
					} else {
						for (let i = 0; i < name.length-2; i++) {
							star = '*' + star
						}
						name = name.substring(0, 1) + star + name.substring(name.length - 1, name.length);
					}
				}
				this.$util.goToChat(userId, name, 'market', id,0);
			},
			//拨打电话
			callTel(tel) {
				uni.makePhoneCall({
					phoneNumber: tel,
					success: ()=> {}
				});
			},
			
			calcDistance(latitude,longitude){
				return this.distance = this.$util.calculateDistance(this.longitude,this.latitude,longitude,latitude)
			},
			getNegotiationPage(){
				let params = {
					// userId: uni.getStorageSync('userData').sysUser.userId,
					consultationId: this.info.id,
					latitude: this.info.latitude,
					longitude: this.info.longitude,
					current: this.page,
					size: this.size
				}
				this.$httpApi.negotiationPage(params).then(res => {
					if(res){
						this.total = res.total;
						this.recordList = res.records
						if (res.records.length !== 0) {
							if (this.page == 1) {
								this.recordList = res.records;
							} else {
								this.recordList = this.recordList.concat(res.records);
							}
						} else if (res.records.length === 0) {
							this.recordList = []
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-title {
		@include nav-bar-title($fontColor33)
	}

	.record-item {
		background: #ffffff;
		margin-top: 12rpx;
		padding: 38rpx 48rpx 0 32rpx;

		.personal-info {
			.right-info {
				margin-left: 12rpx;

				.name {
					font-size: 30rpx;
					color: #333333;
				}

				.tel {
					font-size: 26rpx;
					color: #606166;
					margin-top: 6rpx;
				}

				.skill_name {
					flex-wrap: wrap;

					.skill_name_item {
						background: #EFF1FF;
						border-radius: 2rpx;
						padding: 6rpx 12rpx;
						font-size: 20rpx;
						color: $themeColor;
						margin: 12rpx 8rpx 0 0;
					}
				}
			}
		}
		.address-con{
			padding: 32rpx 0;
			.address-view {
				margin-top: 12rpx;
				display: flex;
				align-items: center;
			
				.icon {
					width: 26rpx;
					height: 26rpx;
					margin-right: 8rpx;
				}
			
				.address {
					width: 500rpx;
					font-size: 28rpx;
					color: #606166;
					@include bov(2)
				}
				.distance{
					font-size: 28rpx;
					color: #606166;
				}
			}
		}
		
		.contact-view{
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 36rpx 0;
			border-top: 2rpx solid #F6F6F6;;
			.icon{
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
			.label{
				font-size: 26rpx;
				color: #3D3D3D;
			}
		}
	}

	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.display-left {
		display: flex;
		align-items: center;
	}
</style>
