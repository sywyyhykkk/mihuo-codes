<template>
	<view :style="style">
		<map id='map' style="height: 35%" :scale='map.scale' :show-location='map.showLocation' :longitude='map.longitude'
			:latitude='map.latitude'  :width='map.width' :controls='map.controls'
			:markers='map.markers' @regionchange='mapChange'>
			<!-- <cover-view class="controls-mask"></cover-view>
			<cover-view class="controls-cancel" @click="cancel">取消</cover-view>
			<cover-view class="controls-sure" @click="chooseMap">确定</cover-view> -->
			<!-- <cover-image src="@/pages-common/static/images/icon-address/address-4.png" class="icon-img"></cover-image> -->
			<cover-image src="@/static/images/icon-address/address-4.png" class="icon-img"></cover-image>
		</map>
		<view class='footer' style="height: 65%">
			<view class="searchContent">
				<view class="address_select center-item" @click="selectAddress">
					<text class="title">{{ cityName || '选择地址'}}</text>
					<u-icon name="arrow-down" size="20"></u-icon>
				</view>
				<view style="flex: 1;">
					<u-search v-model="serachText" @search="searchAddress" @clear="searchAddress"></u-search>
				</view>
			</view>
			<scroll-view scroll-y class='scroll' :scroll-top='scrollTop'>
				<view class="">
					<view class='padding border-b position-r' v-for='(item, index) in list' :key='index'
						@click='bindAddress(item,index)'>
						<view class='row'>{{item.title}}</view>
						<view class='row color-99'>{{item.address}}</view>
						<icon type='success' color='#FF9A52' size='22' class='icon_circle' v-if='checked === index' />
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//一个函数参数调用就可以
	//@chooseAddress
	import {
		searchAddress,
		getAppWxLatLon,
		posToCity,
	} from '@/plugins/utils.js';
	// #ifdef APP-PLUS
	import {
		judgePermission,
		gotoAppPermissionSetting
	} from '@/plugins/permission';
	// #endif
	export default {
		name: 'map-choose',
		props: {
			show: {
				type: Boolean,
				default: false,
			},
			// 是否开启自动搜索
			outSearch: {
				type: Boolean,
				default: false,
			},
			// 搜索延迟秒速ms
			interval: {
				type: Number,
				default: 500,
			}

		},
		data() {
			return {
				duration: 250,
				detail: '',
				serachText: '',
				userAddress: {},
				map: {
					longitude: 0,
					latitude: 0,
					showLocation: true,
					iconPath: '@/pages-common/static/images/icon-address/address-4.png',
					height: 30,
					scale: 16,
					controls: [{
						id: 'map',
						iconPath: '@/pages-common/static/images/icon-address/address-4.png',
						position: {
							left: 1200,
							top: 1200,
							width: 40,
							height: 40
						},
						clickable: false
					}]
				},
				list: [],
				oftenList: [],
				address: {
					title: '',
					address: ''
				},
				checked: 0,
				scrollTop: 0,
				mapStatus: 1, // 控制选择地址时 地图不加载附近列表
				cityCode: '',
				isPoiName: false, //是否小区定位,
				cityName: '' //当前城市,
			}
		},
		computed: {
			style() {
				let style = {};
				style = {
					width: '100%',
					height: '100%',
					transform: `translate3D(0px,'100%',0px)`
				};
				if (this.duration) style.transition = `all ${this.duration / 1000}s linear`;
				return style;
			}
		},
		onLoad(options) {
			if (options && options.search && options.search != 'undefined') {
				this.serachText = options.search || '';
				this.cityName = options.city || '';
				this.isPoiName = true;
				console.log(options,"optionsoptions")
				this.searchAddress()
			}
		},
		onShow() {
			uni.$once('operatorSelected', (data) => {
				if (JSON.stringify(data) !== "{}") {
					this.cityName = this.selectedAddressCity(data);
					console.log(data,"opppoo")
					// this.map.longitude = data.center[0];
					// this.map.latitude = data.center[1];
					// this.cityCode = data.areaCode
					this.selectedAddressCity(data)
					this.searchAddress()
				}
			})
			// this.openGPS()
		},
		created() {
			uni.setNavigationBarTitle({
				title: '搜索地址'
			})
		},
		mounted() {
			let map = this.map;
			this.getAddress();
			
		},
		watch: {
			serachText(news) {
				if (news) {
					setTimeout(() => {
						this.searchAddress()
					}, this.interval)
				} else {
					this.getAddress()
				}
			}
		},
		methods: {
			openGPS(){
				// #ifdef APP-PLUS
				// judgePermission('location', (res) => {
				// 	// 未请求，1 = 已允许，0 = 拒绝 null 未请求
				// 	if (res == 0) {
				// 		uni.showModal({
				// 			title: "提示",
				// 			content: "您未开启" + "定位" + "权限, 请打开定位功能,以便精确定位地址",
				// 			confirmText: "去开启",
				// 			confirmColor: "#FE6E32",
				// 			success: success => {
				// 				if (success.confirm) {
				// 					gotoAppPermissionSetting();
				// 				} else {
									
				// 				}
				// 			}
				// 		});
				// 		return false;
				// 	} else if (res == 1) {
				// 		this.getAddress();
				// 	}
				// })
				// #endif
				// #ifdef APP-PLUS
				let system = uni.getSystemInfoSync();// 获取系统信息
				if (system.platform === 'android') { // 判断平台
					var context = plus.android.importClass("android.content.Context");
					var locationManager = plus.android.importClass("android.location.LocationManager");
					var main = plus.android.runtimeMainActivity();
					var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
					console.log(mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER),"mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)")
					if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
						uni.showModal({
							title: '提⽰',
							content: '请打开定位服务功能',
							showCancel: false, // 不显⽰取消按钮
							success() {
								var Intent = plus.android.importClass('android.content.Intent');
								var Settings = plus.android.importClass('android.provider.Settings');
								var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS); 
								main.startActivity(intent); // 打开系统设置GPS服务页⾯
							}
						}); 
					}else{
						this.getAddress()
						console.log('GPS功能已开启')
					}
				}else if(system.platform === 'ios'){
					var cllocationManger = plus.ios.import("CLLocationManager");
					var enable = cllocationManger.locationServicesEnabled();
					var status = cllocationManger.authorizationStatus();
					plus.ios.deleteObject(cllocationManger);
					console.log("⼿机系统的定位没有打开");
					uni.showModal({
						title: '提⽰',
						content: '请打开定位服务功能',
						showCancel: false, // 不显⽰取消按钮
						success() {
							var UIApplication = plus.ios.import("UIApplication");
							var application2 = UIApplication.sharedApplication();
							var NSURL2 = plus.ios.import("NSURL");    
							var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
							application2.openURL(setting2);
							plus.ios.deleteObject(setting2);
							plus.ios.deleteObject(NSURL2);
							plus.ios.deleteObject(application2);
						}
					});
				}
				// #endif
			},
			// 运营商位置处理
			selectedAddressCity(data) {
				let cities = ['北京市', '天津市', '上海市', '重庆市']
				let userProvince = data.address && data.address.split(' ')[0] || data.address // 省份名称
				let userCity = data.address && data.address.split(' ')[1] || data.address // 城市名称
				if (cities.indexOf(userProvince) !== -1) {
					// 如果是直辖市, 则使用省份名称
					return userProvince
				}
				return userCity
			},
			bindAddress(item, index) {
				this.checked = index;
				this.map.latitude = item.location.lat;
				this.map.longitude = item.location.lng;
				this.chooseMap()
			},
			getAddress() {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						this.map.latitude = res.latitude
						this.map.longitude = res.longitude
					}
				})
				getAppWxLatLon(async (res) => {
					let {
						pois,
						addressComponent,
						adcode
					} = await posToCity({
						latitude: res.latitude,
						longitude: res.longitude,
					}, 1);
					if (!this.cityName) {
						this.cityName = addressComponent.city;
					}
					if (!this.isPoiName) {
						this.list = pois;
					}
				})
			},
			areaComplete(e) {
				console.log(e);
				this.e = e
			},
			selectAddress() {
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '/pages-common/mapSearchCity/mapSearchCity'
				})
				// #endif
				// console.log(this.$refs.areaChoose);
				// this.$refs.areaChoose.show();
			},
			//城市选择之后开始的搜索
			async searchAddress() {
				const {
					pois
				} = await searchAddress(this.serachText, this.cityName);
				this.checked = 0
				this.list = pois;
				this.map.latitude = this.list[0].location.lat
				this.map.longitude = this.list[0].location.lng
			},
			getWidthHeight(fn) {
				var query = uni.createSelectorQuery()
				query.select('#map').boundingClientRect()
				query.exec(res => {
					fn(res[0])
				})
			},
			chooseMap() {
				uni.$emit('updateData', this.list[this.checked] ? this.list[this.checked] : {})
				uni.navigateBack();
				this.serachText = '',
					this.cityName = ''
			},
			getAddressList(s = 0) {

			},
			mapChange(e) {
				let that = this
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					if (e.type == 'end') {
						that.mapCtx = uni.createMapContext('map')
						that.mapCtx.getCenterLocation({
							success: res => {
								console.log(res)
								that.setData({
									position: {
										latitude: res.latitude,
										longitude: res.longitude
									}
								})
								if (that.mapStatus) { // 防止地图点击时 进行多次加载
									that.getAddressList(1)
								} else {
									that.mapStatus = 1
								}
							}
						})
					}
				}, 200)
			},
			cancel() {
				uni.$emit('updateData', {})
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	page {
		background: #F6F6F6;
		font-size: 32rpx;

		.address_select {
			width: 120rpx;
			margin: 10rpx;
			display: flex;

			.title {
				font-size: 24rpx;
				padding-right: 5rpx;
			}
		}

		.searchContent {
			margin: 0 10rpx;
			display: flex;
			align-items: center;
		}
	}

	.containers {
		position: relative;
	}

	.controls-mask {
		height: 165rpx;
		background: rgba(0, 0, 0, 0.1);
	}

	.controls-cancel {
		color: #fff;
		position: absolute;
		color: #fff;
		text-align: center;
		width: 80rpx;
		top: 100rpx;
		left: 20rpx;
		line-height: 60rpx;
	}

	.controls-sure {
		position: absolute;
		background-color: $auxiliaryColor;
		border-radius: 10rpx;
		color: #fff;
		text-align: center;
		width: 80rpx;
		top: 100rpx;
		right: 20rpx;
		line-height: 60rpx;
	}

	.submitContent {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background-color: #000;
		height: 20rpx;
		height: 800rpx;
	}

	image {
		display: block;
	}

	.item,
	.item-forward {
		background: #fff;
		padding: 25rpx 90rpx 25rpx 25rpx;
		position: relative;
		line-height: 46rpx;
	}

	.item-forward::before {
		content: '';
		width: 20rpx;
		height: 20rpx;
		border-top: 2px solid #a9a9a9;
		border-right: 2px solid #a9a9a9;
		border-radius: 2px;
		position: absolute;
		top: 50%;
		right: 35rpx;
		transform: rotate(45deg) translateY(-50%);
	}

	.item image,
	.item-forward image {
		width: 46rpx;
		height: 46rpx;
		display: block;
		margin-right: 10rpx;
		position: relative;
	}

	.active {
		background: #eee;
	}

	.row,
	.item,
	.item-forward,
	.coupons {
		display: flex;
		width: 100%;
	}

	.row-wrap {
		flex-wrap: wrap;
	}

	.col,
	.coupons .left {
		flex: 1;
		display: block;
		width: 100%;
	}

	.col-center {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.float-r {
		float: right;
	}

	.padding {
		padding: 20rpx 25rpx;
	}

	.padding-t {
		padding-top: 20rpx;
	}

	.padding-b {
		padding-bottom: 20rpx;
	}

	.padding-l {
		padding-left: 25rpx;
	}

	.padding-r {
		padding-right: 25rpx;
	}

	.padding-tb {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.padding-lr {
		padding-left: 25rpx;
		padding-right: 25rpx;
	}

	.margin {
		margin: 20rpx 25rpx;
	}

	.margin-t {
		margin-top: 20rpx;
	}

	.margin-b {
		margin-bottom: 20rpx;
	}

	.margin-tb {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.margin-lr {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.border,
	.border-t,
	.border-r,
	.border-b,
	.border-l {
		position: relative;
	}

	.border {
		border: .5px solid #eee;
	}

	.border-t::after,
	.border-r::after,
	.border-b::after,
	.border-l::after {
		content: '';
		position: absolute;
		/*background: #eee;*/
		background: linear-gradient(to top, #eee .7px, transparent .7px);
	}

	.border-t::after,
	.border-b::after {
		height: 1px;
		left: 25rpx;
		right: 25rpx;
		top: 0;
	}

	.border-b::after {
		top: auto;
		bottom: 0;
	}

	.border-l::after,
	.border-r::after {
		width: 1px;
		top: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(to right, #eee .7px, transparent .7px);
	}

	.border-r::after {
		left: auto;
		right: 0;
	}

	.ellipsis-1 {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bg {
		background: #E74246;
	}

	.bg-ff {
		background: #fff;
	}

	.color {
		color: #E74246;
	}

	.color-00 {
		// color: #000;
	}

	.color-ff {
		color: #fff;
	}

	.color-99,
	.icon_img_tip {
		color: #999;
	}

	.color-6c {
		color: #6c6c6c;
	}

	.text-right {
		text-align: right;
	}

	.font-26 {
		font-size: 26rpx;
	}

	.position-r {
		position: relative;
	}

	.map,
	map {
		width: auto;
		height: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 750rpx;
	}

	.map {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-top: 20rpx;
		background: #fff;
	}

	.foot-border {
		border-bottom: 1px solid #eee;
		line-height: 32rpx;
	}

	.foot-border .padding {
		padding: 25rpx;
	}

	.foot-active {
		color: #E74246;
		position: relative;
	}

	.foot-active::after {
		content: '';
		position: absolute;
		background: #E74246;
		bottom: 0;
		width: 5em;
		left: 50%;
		transform: translateX(-50%);
	}

	.scroll {
		position: absolute;
		left: 0;
		right: 0;
		top: 100rpx;
		bottom: 0;
	}

	.scroll .padding {
		padding-right: 40px;
	}

	.scroll .icon_circle {
		position: absolute;
		right: 25rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.icon_img_tip {
		padding: 20rpx 0;
	}

	.icon-img {
		width: 36px;
		height: 36px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
