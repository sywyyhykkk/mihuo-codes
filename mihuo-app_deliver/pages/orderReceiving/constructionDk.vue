<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">打卡</view>
			<view slot="right" class="right-record" @click="seeRecord">打卡记录</view>
		</z-nav-bar>

		<view class="punch_clock">
			<view class="work">
				<view class="public_style" :class="isWork ? 'isWork' : ''">
					<view class="go">上班</view>
					<text class="time">{{isWork ? '已打卡' : '未打卡' }}{{isWorkTime}}</text>
				</view>
				<view class="public_style" :class="isWorkOff ? 'isWork' : ''">
					<view class="go">下班</view>
					<text class="time">{{isWorkOff ? '已打卡' : '未打卡' }}{{isWorkOffTime}}</text>
				</view>
			</view>
			
			<view class="map">
				<map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude"
					:markers="covers"></map>
				<cover-view class="refresh_btn">
					<cover-view class="text" @click="refresh">刷新定位</cover-view>
				</cover-view>
				<view class="address_view">
					<cover-view class="refreshed_address">
						<cover-view class="text">{{refreshedAddress}}</cover-view>
					</cover-view>
				</view>
			</view>
			
			<view class="punch_clock_wrap">
				<view class="punch_clock_box">
					<view class="btn" @click="dking">
						<view class="time">
							<view class="dk_type time">{{setWork}}班打卡</view>
							<view class="dk_time time">{{dkTime}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="rule_view">
				<u-checkbox-group style="width: 100%;">
					<u-checkbox
						active-color="$themeColor"
						style="width: 100%;height: 98rpx;"
						v-model="checked"
						shape="circle"
						size=28
						label-size=26
					>
						自愿购买保险，费用从工费中扣除<text class="rule">《保险细则》</text>
					</u-checkbox>
				</u-checkbox-group>
			</view> -->
			<view class="btm_tips">
				<image v-if="distance > 0.5" src="/static/icon/vector.png" mode=""></image>
				<text v-if="distance > 0.5" class="tips">距离施工地点{{distance}}km</text>
				<text v-if="distance < 0.5" class="tips">距离施工地点小于<text
						style="color: #10BF78;">500m</text></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	import {
		posToCity
	} from '@/plugins/utils.js';
	import moment from "@/static/js/moment.js"
	import {
		judgePermission,
		gotoAppPermissionSetting,
		checkSystemEnableLocation
	} from '@/plugins/permission';
	export default {
		data() {
			return {
				temUserId: '',
				personId: '',
				todayState: false,
				checked:true,
				refreshedAddress: '',
				projectId: 0,
				covers: [],
				longitude: 0,
				latitude: 0,
				distance: 0,
				dkTime: null,
				dkType: null, //0下班 1上班
				dkObj: {},
				isWork: false,
				isWorkOff: false,
				isWorkTime: '',
				isWorkOffTime: '',
				orderDetails: {}
			}
		},

		onShow() {
			// #ifdef APP-PLUS
			this.refresh();
			//#endif
			
			this.myCache('expireTime') //只传key一个参数的情况下，就是读取缓存
		},
		onLoad(option) {
			this.orderDetails = JSON.parse(option.orderDetails)
			this.personId = this.temUserId = this.orderDetails&&this.orderDetails.bizOrderOffer&&this.orderDetails.bizOrderOffer.personId
			setInterval(this.timer, 1000);
			setTimeout(()=>{
				this.getRecord();
			},200)
		},
		onUnload() {
			clearInterval(this.timer())
		},
		computed: {
			setWork() {
				if (!this.isWork) {
					return '上'
				}
				if (this.isWork && !this.isWorkOff) {
					return '下'
				}
				if (this.isWork && this.isWorkOff) {
					return '下'
				}
				if (this.isWork) {
					return '下'
				}
			}
		},

		methods: {
			// 获取打卡信息
			getRecord(yearMonthDay) {
				let newYearMonthDay = moment().format().slice(0, 10);
				let data = {
					personId: this.personId,
					queryDate: yearMonthDay ? yearMonthDay : newYearMonthDay,
					projectId: this.projectId,
					orderId: this.orderDetails.id
				}
				this.$httpApi.getDkList(data).then(res => {
					if (res) {
						let stateData = res[0] ? res[0].scheduleList : '';
						if (stateData[0] && stateData[0].printDate) {
							this.isWork = true;
							this.isWorkTime = stateData[0].printDate.slice(11, 16)
						} else {
							this.isWork = false;
							this.isWorkTime = ''
						}
						if (stateData[1] && stateData[1].printDate) {
							this.isWorkOff = true;
							this.isWorkOffTime = stateData[1].printDate.slice(11, 16)
						} else {
							this.isWorkOff = false;
							this.isWorkOffTime = ''
						}
					}
				}).catch(e => console.log(e));

			},
			// 刷新定位
			refresh() {
				// 获取当前位置
				judgePermission('location', (res) => {
					if(res == 1){
						uni.getLocation({
							type: 'gcj02',
							geocode: true,
							success: (res) => {
								this.dkObj = res;
								this.refreshedAddress = res.address.poiName;
								this.longitude = res.longitude;
								this.latitude = res.latitude;
								this.calculateDistance(this.longitude, this.latitude);
								let obj = {
									width: 40,
									height: 40,
									latitude: this.latitude,
									longitude: this.longitude,
									iconPath: '/static/images/icon-address/address-4.png'
								};
								let arr = [];
								arr.push(obj);
								this.covers = arr
							},
							fail: (err) => {
								uni.showModal({
									title: "信息错误",
									content: err,
								})
							}
						});
					} else {
						uni.showModal({
							content: "您还未开启定位，无法进行打卡",
							cancelText: "取消",
							confirmText: "去开启",
							success() {
								if (res.confirm) {
									gotoAppPermissionSetting();
								}
							},
						})
					}
				})
			},
			// 查看打卡记录
			seeRecord() {
				uni.navigateTo({
					url: `/pages/orderReceiving/constructionDkRecord?orderDetails=${JSON.stringify(this.orderDetails)}`
				})
			},
			// 当天的打卡状态当天过期
			myCache(key, value, seconds) {
			    let nowTime = Date.parse(new Date()) / 1000;
			    if (key && value) {
					this.todayState = true
					let expire = seconds;
					//用来判断比较是否过了23:59:59
					uni.setStorageSync(key,JSON.stringify(value) + '|' +expire)
					uni.setStorageSync('todayState',this.todayState);
					uni.setStorageSync('temProjectId',this.projectId);
					uni.setStorageSync('temUserId',this.temUserId)
				} else if (key && !value) {
					let val = uni.getStorageSync(key);
					if (val) {
						// 缓存存在，判断是否过期
						let temp = val.split('|')
						if (!temp[1] || temp[1] <= nowTime) {
							uni.removeStorageSync('todayState');
							uni.removeStorageSync('temProjectId');
							uni.removeStorageSync('temUserId');
							uni.removeStorageSync(key);
							return '';
						} else {
							let newProjectId = uni.getStorageSync('temProjectId'),
								newUserId = uni.getStorageSync('temUserId');
							if(this.projectId == newProjectId && this.temUserId == newUserId){
								this.todayState = true;
								uni.setStorageSync('todayState',this.todayState);
							}else{
								this.todayState = false;
								uni.setStorageSync('todayState',this.todayState);
							}
							return JSON.parse(temp[0]);
						}
					}
			    }
			},
			
			checkWork(){
				//distance:单位m this.distance:单位km
				let tempDistance = this.distance*1000<1?Math.ceil(this.distance*1000):this.distance*1000
				this.debounce(() => {
					let data = {
						address: this.dkObj.address.poiName,
						latitude: this.dkObj.latitude,
						longitude: this.dkObj.longitude,
						orderCode: this.orderDetails.orderCode,
						projectId: this.projectId,
						personId: this.personId,
						orderId: this.orderDetails.id,
						distance: tempDistance
					};
					this.$httpApi.attendanceIng(data).then(res => {
						if (res) {
							uni.showToast({
								icon: 'success',
								title: '打卡成功',
								duration: 2000,
							});
							this.getRecord();
							let date = new Date();
							let y = date.getFullYear();
							let m = date.getMonth()+1;
							let d = date.getDate();
							let timer = Date.parse(y+'/'+m+'/'+d+' '+'23'+':'+'59'+':'+'59') / 1000;//1970年1月1日与现在的毫秒数：
							this.myCache('expireTime','value',timer)//存入缓存，最后一个参数是缓存过期时间，当天23：59：59失效
						}
					}).catch(e => console.log(e));
				}, 300)
			},
			
			dking() {
				if(this.distance*1000>500){
					uni.showModal({
						title: '确认操作',
						content: '当前距离工地位置过远，会被认定为无效打卡，是否确认打卡？',
						success: res => {
							if (res.confirm) {
								this.checkWork()
							}
						}
					});
				}else{
					this.checkWork()
				}
			},

			// 时钟
			timer() {
				let now = new Date();
				let h = now.getHours();
				let m = now.getMinutes();
				let s = now.getSeconds();
				this.dkTime = this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s);
			},
			// 时钟补零
			addZero(num) {
				return num < 10 ? '0' + num : '' + num;
			},
			// 计算打卡距离
			calculateDistance(lon1, lat1) {
				let lon2 = this.orderDetails.longitude;
				let lat2 = this.orderDetails.latitude;
				let red1 = lat1 * Math.PI / 180.0;
				let red2 = lat2 * Math.PI / 180.0;
				let a = red1 - red2;
				let b = lon1 * Math.PI / 180 - lon2 * Math.PI / 180.0;
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(red1) * Math.cos(red2) * Math.pow(
					Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				s = Number(s).toFixed(1);
				this.distance = parseFloat(s)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: $darkTitle;
	}
	.right-record {
		font-size: $smallFontSize;
		color: $fontColor99;
		margin-right: 30rpx;
	}
	
	.punch_clock {
		width: 710rpx;
		margin: 6rpx 20rpx;
		padding: 50rpx;
		background: #FFFFFF;
		border-radius: 30rpx;

		.work {
			display: flex;
			justify-content: space-between;

			.public_style {
				width: 290rpx;
				height: 140rpx;
				background: #F0F0F0;
				font-weight: bold;
				color: $darkTitle;
				font-size: 30rpx;
				border-radius: 10rpx;
				padding: 28rpx 0 24rpx 42rpx;

				.go {
					margin-bottom: 6rpx;
				}

				.time {
					font-size: $middleFontSize;
					color: $fontColor99;
				}
			}

			.isWork {
				background: $themeColor;

				.go,
				.time {
					color: #FFFFFF;
				}
			}
		}
	}

	.punch_clock_wrap {
		width: 314rpx;
		height: 314rpx;
		margin: 0 auto;
		margin-top: 52rpx;
		background: rgba(0, 47, 165, .1);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;

		.punch_clock_box {
			width: 282rpx;
			height: 282rpx;
			background: rgba(0, 47, 165, .2);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			.btn {
				width: 246rpx;
				height: 246rpx;
				background: rgb(0, 47, 165);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				.time {
					font-weight: bold;
					line-height: 44rpx;
					text-align: center;
					color: #FFFFFF;

					.dk_type {
						font-size: $middleFontSize;
					}

					.dk_time {
						font-size: $mainFontSize;
					}
				}
			}
		}
	}
	.rule_view{
		.rule{
			color: $themeColor;
			font-size: $smiddleFontSize;
		}
	}
	.map {
		margin: 60rpx auto;
		width: 100%;
		height: 272rpx;
		position: relative;

		.refresh_btn {
			width: 134rpx;
			height: 52rpx;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			right: 0;
			bottom: 70rpx;
			border-radius: 10rpx;

			.text {
				line-height: 44rpx;
				text-align: center;
				font-size: $smallFontSize;
				color: #FFFFFF;
			}
		}

		.address_view {
			width: 100%;
			position: absolute;
			left: 0;
			bottom: -20rpx;

			.refreshed_address {
				height: 52rpx;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 10rpx;

				.text {
					margin: 0 20rpx;
					line-height: 44rpx;
					font-size: $smallFontSize;
					color: #FFFFFF;
				}
			}
		}

		.refreshed_address {
			width: 100%;
			height: 52rpx;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			left: 0;
			bottom: 20rpx;
			border-radius: 10rpx;

			.text {
				line-height: 44rpx;
				font-size: $smallFontSize;
				color: #FFFFFF;
			}
		}
	}

	.btm_tips {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		margin-top: 18rpx;

		image {
			width: 31rpx;
			height: 34rpx;
		}

		.tips {
			padding-left: 12rpx;
			color: $mainFontColor;
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
