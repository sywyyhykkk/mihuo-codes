<template>
  <view class="demand-view" @click="gotoDetail(item.id,calcDistance(item.longitude,item.latitude))" v-if="item.id">
    <view class="upper-view">
      <view class="name">{{item.poiName + item.name}}</view>
	  <view class="address">
	  	<view class="tel-view">
	  		<image class="icon" src="/static/icon/work_card/location.png" />
	  		<view class="tel">{{item.address}}</view>
	  	</view>
	  	<view class="distance" v-if="demandLocationInfo && demandLocationInfo.distanceShow == 1">
			{{calcDistance(item.longitude,item.latitude)}}
		</view>
	  </view>
      <view class="time-con display-center">
		  <view>
		  	<text class="time">{{ setTime(item.created) }}</text>
		  	<text class="duration">{{ $util.relativeTime(item.created) }}</text>
		  </view>
		  <view class="duration" v-if="!item.permanentStatus&&item.startDate&&item.endDate">
		    {{ setTime(item.endDate,'end') }} {{calcTime(item.startDate,item.endDate)}}天内有效
		  </view>
		  <view class="duration" v-else>永久有效</view>
      </view>
    </view>
	<!-- 人员信息 -->
	<view class="persons-view display-center">
		<view class="left-persons display-left">
			<view class="avatars display-left" v-if="item.efficientUserIds&&item.efficientUserIds.length">
				<u-avatar
					size="26"
					class="avatar"
					v-for="em in item.efficientUserIds&&item.efficientUserIds.slice(0,3)"
					:key="em"
					:src="$util.avatarImage(em)" v-if="em"
				/>
			</view>
			<view class="label">{{item.efficientNum}}人反馈真实</view>
		</view>
		<view class="right">{{item.cooperationNum}}人达成合作</view>
	</view>
	
    <view class="lower-view">
      <view class="left">
		<u-avatar class="avatar" size="32" :src="$util.avatarImage(item.customerId)" v-if="item.customerId" />
		<view class="name">{{item.customerName}}</view>
		<view class="real-name" v-if="item.customerRealStatus">已实名</view>
		<view class="no-real-name" v-else>未实名</view>
		<!-- <image class="auth" src="/static/icon/home/auth.png" v-if="item.customerRealStatus" /> -->
      </view>
	  <view class="right-views">
	  	<image class="browse" src="/static/icon/home/browse.png" />
	  	<view class="num">浏览 {{ item.views }}次</view>
	  </view>
      <!-- <view
        class="right"
        @click.stop="contactHe(item.customerId, item.customerPhone)"
        >联系TA</view
      > -->
    </view>
	<view class="mine-tag" v-if="item.customerId == userId">我发布的</view>
  </view>
</template>

<script>
import moment from '@/static/js/moment.js'
export default {
  name: 'demand-item',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
	demandLocationInfo: {
	  type: Object,
	  default: () => {}
	}
  },

  data() {
    return {
	  distance: '',
      userId:
        uni.getStorageSync('userData') &&
        uni.getStorageSync('userData').sysUser.userId,
      userPhone:
        uni.getStorageSync('userData') &&
        uni.getStorageSync('userData').sysUser.phone
    }
  },

  methods: {
	//计算有效期
	calcTime(start,end){
		return moment(end).diff(moment(start).format("YYYY-MM-DD"),'days')
	},
	//计算距离
	calcDistance(longitude,latitude){
		return this.$util.calculateDistance(this.demandLocationInfo.longitude, this.demandLocationInfo.latitude,longitude, latitude)
	},
	
	gotoPhone() {
		// #ifdef APP-PLUS
		uni.navigateTo({
			url: '/pages/univerifyLogin/univerifyLogin'
		})
		// #endif
		// #ifdef H5
		uni.navigateTo({
			url: '../user/login'
		})
		// #endif
	},
	
    gotoDetail(id,distance) {
		if (uni.getStorageSync('userInfo')) {
			this.toPage(`/pages/demandMarket/demandDetails?id=${id}&demandLocationInfo=${JSON.stringify(this.demandLocationInfo)}`)
		} else {
			this.gotoPhone()
		}
      // this.toPage(`/pages/demandMarket/demandDetails?id=${id}`)
    },
    //联系他
    contactHe(customerId, tel) {
      if (customerId == this.userId && tel == this.userPhone) {
        this.$util.toast('这是您发布的需求')
        return
      }
      uni.makePhoneCall({
        phoneNumber: tel
      })
    },
    setTime(time,timeType) {
	  if(timeType === 'end'){
	  	return moment(time).format('lll').slice(0,10)
	  }
      return moment(time).format('lll').slice(5, moment(time).format('lll').length)
    }
  }
}
</script>

<style lang="scss" scoped>
.demand-view {
  background: #ffffff;
  border-radius: 10rpx;
  padding: 36rpx 48rpx 14rpx 38rpx;
  margin: 12rpx 0;
  position: relative;
  .mine-tag{
	  padding: 4rpx 8rpx;
	  position: absolute;
	  top: 0;
	  right: 0;
	  border-radius: 0 10rpx 0 10rpx;
	  background: rgba(255,93,53,.1);
	  font-size: 20rpx;
	  color: #FF5D35;
  }

  .upper-view {
    // border-bottom: 2rpx solid #f6f6f6;
    .name {
	  font-weight: bold;
      font-size: 30rpx;
      color: #111111;
      margin: 4rpx 0 8rpx;
      @include bov(2);
    }

    .time-con {
      margin: 20rpx 0;
      font-size: 24rpx;
      color: #909199;

      .time {
        font-size: 24rpx;
        color: #909199;
        margin-right: 18rpx;
      }

      .duration {
        font-size: 24rpx;
        color: #606166;
      }
    }
  }
  
  .persons-view{
	  padding: 18rpx 14rpx;
	  background: #F6F7FB;
	  border-radius: 10rpx;
	  .left-persons{
		  padding-left: 13rpx;
		  .avatars{
			  .avatar{
				  margin-left: -13rpx;
			  }
		  }
		  .label{
			  font-size: 24rpx;
			  color: #3D3D3D;
			  margin-left: 8rpx;
		  }
	  }
	  .right{
		  font-size: 24rpx;
		  color: #3D3D3D;
	  }
  }

  .lower-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
	padding: 22rpx 0;

    .left {
      display: flex;
	  align-items: center;
	  
	  .auth{
	  	width: 24rpx;
	  	height: 24rpx;
	  }
	  .name{
	  	font-size: 26rpx;
	  	color: #303133;
	  	margin: 0 4rpx 0 8rpx;
	  }
	  
	  .real-name {
	    width: 84rpx;
	    line-height: 36rpx;
		margin-left: 6rpx;
	    text-align: center;
	    background: rgba(47, 165, 255, .1);
	    border-radius: 4rpx;
	    font-size: 24rpx;
	    color: $themeColor;
	  }
	  .no-real-name{
		width: 84rpx;
		line-height: 36rpx;
		margin-left: 6rpx;
		text-align: center;
		background: rgba(155,155,155, .1);
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #909199;
	  }
    }
	
	.right-views{
		display: flex;
		align-items: center;
		
		.browse {
		  width: 37rpx;
		  height: 37rpx;
		}
		
		.num {
		  margin-left: 8rpx;
		  font-size: 26rpx;
		  color: #303133;
		}
	}

    .right {
      width: 132rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      margin-top: 16rpx;
      background: #ffffff;
      border: 2rpx solid #ff5d35;
      border-radius: 50rpx;
      font-size: 28rpx;
      color: #ff5d35;
    }
  }
}
.address{
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	.tel-view {
		margin-top: 12rpx;
		display: flex;
		align-items: center;
	
		.icon {
			width: 22rpx;
			height: 24rpx;
			margin-right: 4rpx;
		}
	
		.tel {
			width: 500rpx;
			font-size: 28rpx;
			color: #606166;
			@include bov(1)
		}
	}
	
	.distance {
		font-size: 26rpx;
		color: $themeColor;
	
	}
}

.display-left{
	display: flex;
	align-items: center;
}

.display-center {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
