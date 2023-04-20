<template>
	<view>
		<public-module></public-module>
		<view class="top-nav-bar">
			<view class="nav-view">
				<image class="arrow_back" src="/static/icon/arrow_back.png" mode="" @click="goBack" />
				<view v-if="position === 'R_PROJECT_MANAGER'">
					<message-tabs :items="items" :current="current" @clickItem="onClickItem" />
				</view>
				<view class="message-tab" v-else>我的考勤</view>
				<view class="right" @click="seeRecord">打卡记录</view>
			</view>
		</view>
		<swiper class="swiper" :style="{ height: swiperHeight + 'px' }" duration="200" :current="current"
			@change="swiperChange" :disable-touch="true">
			<swiper-item>
				<view class="my-attendance">
					<view class="user-con">
						<u-avatar class="user_avatar" size="72" :src="$util.avatarImage(userInfo.userId)"
							v-if="userInfo.userId" />
						<view class="user_info">
							<view class="user">
								<text class="user_position">{{userInfo.skillName}}</text>
								<text class="user_name">{{userInfo.name}}</text>
							</view>
							<view class="sg_address">{{projectAddress}}</view>
						</view>
					</view>

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

						<view class="map" v-show="current === 0">
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
						<!-- <view class="rule_view" v-if="position !== 'R_PROJECT_MANAGER'">
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
			</swiper-item>
			<swiper-item v-if="position === 'R_PROJECT_MANAGER'">
				<!-- 日历 -->
				<calendar @getRecord="getRecord" :todayState1="todayState" />

				<view class="worker" v-show="recordList && recordList.length > 0">
					<view class="title">项目人员考勤情况</view>
					<view class="worker-item" v-for="(item,index) in recordList" :key="item.id">
						<view class="user-con align-center">
							<u-avatar class="user_avatar" size="72" :src="$util.avatarImage(userInfo.userId)"
								v-if="userInfo.userId" />
							<view class="user_info">
								<view class="user">
									<text class="user_name">{{item.scheduleList[0].person.name}}</text>
								</view>
								<view class="user_position">{{item.scheduleList[0].person.skillName}}</view>
							</view>
						</view>
						<view class="worker_con" v-if="item.scheduleList && item.scheduleList.length">
							<view class="go_work" v-for="(itm,ind) in item.scheduleList" :key="itm.id">
								<view class="tip">{{ind === 0 ? '上工' : '下工'}}
									{{itm.printDate ? itm.printDate.slice(11,16) : ''}}
								</view>
								<view class="position align-center">
									<image class="image" src="/static/icon/position.png" mode=""></image>
									<text class="address">{{itm.address}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<mh-empty v-show="recordList && recordList.length === 0" icon="/static/images/no_recommend.png"
					title="您还没有打卡记录～～" />
			</swiper-item>
		</swiper>
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
				todayState: false,
				userInfo: {},
				checked: true,
				refreshedAddress: '',
				swiperHeight: 0,
				current: 0,
				items: ['我的考勤', '工地考勤'],
				avatar: '',
				position: '',
				projectAddress: '',
				projectId: '',
				temUserId: uni.getStorageSync('userData').sysUser.userId,
				recordList: [], //打卡记录
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
				total: 0,
				page: 1,
				size: 10,
				personId: ''
			}
		},

		onShow() {
			this.myCache('expireTime') //只传key一个参数的情况下，就是读取缓存
		},
		onLoad() {
			this.setParameter()
			setInterval(this.timer, 1000);
			this.refresh();
			this.getRecord();
			this.getUserInfo()
		},
		onUnload() {
			clearInterval(this.timer())
		},
		computed: {
			...mapState(['projectInfo', 'userRole', 'orderInfo', 'userPersonInfo']),
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
			setParameter() {
				this.avatar = this.orderInfo && this.orderInfo.avatarList && this.orderInfo.avatarList[0]
				this.position = this.userRole
				this.personId = this.userPersonInfo.personId
				this.projectAddress = this.orderInfo.address
				this.projectId = this.projectInfo.projectId
			},
			getUserInfo() {
				if (!this.personId) {
					return
				}
				this.$http.get(`admin/person/${Number(this.personId)}`).then(res => {
					this.userInfo = res
				})
			},
			isPersonId() {
				if (this.current === 0) {
					return Number(this.personId)
				} else {
					return ''
				}
			},

			// 获取打卡信息
			getRecord(yearMonthDay) {
				let newYearMonthDay = moment().format().slice(0, 10);
				let data = {
					personId: this.isPersonId(),
					queryDate: yearMonthDay ? yearMonthDay : newYearMonthDay,
					projectId: this.projectId,
					size: this.size,
					current: this.page,
				}
				this.$httpApi.getDkList(data).then(res => {
					if (res) {
						this.recordList = res;
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
					if (res == 1) {
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
							success: (res) => {
							    if (res.confirm) {
							    	gotoAppPermissionSetting();
							    }
							}
						})
					}
				})
			},
			// 查看打卡记录
			seeRecord() {
				uni.navigateTo({
					url: '/pages/construction/kqAnddk/dkRecord'
				})
			},
			// 当天的打卡状态当天过期
			myCache(key, value, seconds) {
				let nowTime = Date.parse(new Date()) / 1000;
				if (key && value) {
					this.todayState = true
					let expire = seconds;
					//用来判断比较是否过了23:59:59
					uni.setStorageSync(key, JSON.stringify(value) + '|' + expire)
					uni.setStorageSync('todayState', this.todayState);
					uni.setStorageSync('temProjectId', this.projectId);
					uni.setStorageSync('temUserId', this.temUserId)
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
							if (this.projectId == newProjectId && this.temUserId == newUserId) {
								this.todayState = true;
								uni.setStorageSync('todayState', this.todayState);
							} else {
								this.todayState = false;
								uni.setStorageSync('todayState', this.todayState);
							}
							return JSON.parse(temp[0]);
						}
					}
				}
			},

			checkWork() {
				//distance:单位m this.distance:单位km
				let tempDistance = this.distance * 1000 < 1 ? Math.ceil(this.distance * 1000) : this.distance * 1000
				this.debounce(() => {
					let data = {
						address: this.dkObj.address.poiName,
						latitude: this.dkObj.latitude,
						longitude: this.dkObj.longitude,
						orderCode: this.orderInfo.orderCode,
						orderId: this.orderInfo.orderId,
						projectId: this.projectId,
						personId: this.personId,
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
							let m = date.getMonth() + 1;
							let d = date.getDate();
							let timer = Date.parse(y + '/' + m + '/' + d + ' ' + '23' + ':' + '59' + ':' +
								'59') / 1000; //1970年1月1日与现在的毫秒数：
							this.myCache('expireTime', 'value', timer) //存入缓存，最后一个参数是缓存过期时间，当天23：59：59失效
						}
					}).catch(e => console.log(e));
				}, 300)
			},

			dking() {
				if (this.distance * 1000 > 500) {
					uni.showModal({
						title: '确认操作',
						content: '当前距离工地位置过远，会被认定为无效打卡，是否确认打卡？',
						success: res => {
							if (res.confirm) {
								this.checkWork()
							}
						}
					});
				} else {
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
				let lon2 = this.orderInfo.longitude;
				let lat2 = this.orderInfo.latitude;
				let red1 = lat1 * Math.PI / 180.0;
				let red2 = lat2 * Math.PI / 180.0;
				let a = red1 - red2;
				let b = lon1 * Math.PI / 180 - lon2 * Math.PI / 180.0;
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(red1) * Math.cos(red2) * Math.pow(
					Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				s = Number(s).toFixed(1);
				this.distance = s
				this.distance = parseFloat(s)
			},
			onClickItem(e) {
				this.recordList = [];
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					this.getRecord()
				}
			},
			swiperChange(c, s) {
				this.recordList = [];
				if (this.current !== c.target.current) {
					this.current = c.target.current;
					this.getRecord()
				}
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.top-nav-bar {
		width: 100%;
		background: #FFFFFF;
		position: fixed;
		top: 0;
		z-index: 20;

		.nav-view {
			position: relative;

			.arrow_back {
				position: absolute;
				top: calc(14rpx + var(--status-bar-height));
				left: 0;
				width: 44rpx;
				height: 44rpx;
				z-index: 999;
				margin-left: 24rpx;
			}

			.message-tab {
				font-weight: bold;
				color: $fontColor33;
				text-align: center;
				padding: calc(10rpx + var(--status-bar-height)) 0 30rpx 0;
			}

			.right {
				position: absolute;
				top: calc(14rpx + var(--status-bar-height));
				right: 36rpx;
				font-weight: bold;
				z-index: 99;
				font-size: $smallFontSize;
				color: $fontColor99;
			}
		}
	}

	.swiper {
		min-height: 100vh; //非得这么给不然还不显示
		padding-top: calc(88rpx + var(--status-bar-height));
	}

	// 我的考勤
	.my-attendance {
		margin: 6rpx 20rpx;

		.user-con {
			height: 176rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			display: flex;
			align-items: center;

			.user_avatar {
				margin: 0 16rpx;
			}
		}
	}

	.user_info {
		padding-right: 56rpx;
		font-weight: bold;

		.user_position {
			font-size: $middleFontSize;
			color: $darkTitle;
			margin-right: 14rpx;
		}

		.user_name {
			font-size: 26rpx;
			color: #909199;
		}

		.sg_address {
			font-size: 26rpx;
			color: #606166;
			@include bov(2);
		}
	}

	.punch_clock {
		width: 710rpx;
		margin-top: 6rpx;
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

	.rule_view {
		.rule {
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

	// 工人的考勤
	.worker {
		.title {
			margin: 11rpx 20rpx;
			font-weight: bold;
			font-size: $mainFontSize;
			color: $darkTitle;
		}

		.worker-item {
			margin: 6rpx 20rpx;
			padding: 22rpx 16rpx 34rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.user-con {
				height: 50%;
				background: #FFFFFF;
				border-radius: 10rpx;

				.user_avatar {
					width: 96rpx;
					height: 96rpx;
					border-radius: 50%;
					margin: 0 16rpx;
				}

				.user_info {
					padding-right: 56rpx;

					.user_name {
						font-weight: bold;
						font-size: $middleFontSize;
						color: $darkTitle;
						margin-right: 14rpx;
					}

					.user_position {
						font-size: 26rpx;
						color: #909199;
					}
				}
			}

			.worker_con {
				display: flex;
				margin: 18rpx 0 0 26rpx;

				.go_work {
					flex: 3;
				}

				& :last-child {
					flex: 2;
				}

				.work {
					padding: 36rpx 0;
				}

				.tip {
					font-weight: bold;
					font-size: 30rpx;
					color: $seconFontColor;
				}

				.position {
					margin-top: 13rpx;

					.image {
						width: 23rpx;
						height: 27.4rpx;
						margin-right: 8rpx;
					}

					.address {
						font-size: 26rpx;
						color: #606166;
						width: 200rpx;
						@include toe();
					}
				}
			}
		}
	}

	.align-center {
		display: flex;
		align-items: center;
	}
</style>
