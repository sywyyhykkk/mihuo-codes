<template>
	<view class="case-list-contain">
		<z-nav-bar :bgColor="['#fff','#fff']" fontColor="black" title="施工现场" :backState="3000" @backClick="goBack()">
			<view slot="right" class="nav-refresh" @click="search">
				<image src="@/pages-common/static/images/search.png" mode=""></image>
			</view>
		</z-nav-bar>
		<map id="map" class="map" :markers="markers" :latitude="latitude" :longitude="longitude"
			@markertap="markerClicked" @regionchange="changeMap"></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				size: 10,
				page: 1,
				total: 0,
				latitude: uni.getStorageSync("latitude"),
				longitude: uni.getStorageSync("longitude"),
				dataList: [],
				markers: [],
				cityOperatorId: uni.getStorageSync('cityOperatorId')
			}
		},
		onLoad() {
			this.getHouseTypeDict()
			this.getHouseAreaDict()
			this.getHouseStyleDict()
			uni.$on('ConstructionListUpdate', (data) => {
				console.log(data)
			})
			// #ifdef APP-PLUS
			this.openWindows()
			// #endif
		},
		onUnload() {
			uni.$off('ConstructionListUpdate')
		},
		methods: {
			changeMap(e) {
				let nmap = uni.createMapContext('map', this)
				// 获取移动后的当前位置
				nmap.getCenterLocation({
					success: (res) => {
						if(res.latitude === this.latitude && res.longitude === this.longitude){
							return
						} else {
							this.latitude = res.latitude
							this.longitude = res.longitude
							this.markers = []
							this.getData()
						}
					}
				})
			},
			markerClicked(marker) {
				uni.$emit('scrollToView', marker.detail.markerId)
			},
			getHouseStyleDict() {
				this.$httpApi.getDictByType({
					type:"house_style",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Style', res)
					}
				})
			},
			getHouseTypeDict() {
				this.$httpApi.getDictByType({
					type:"house_type",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Type', res)
					}
				})
			},
			getHouseAreaDict() {
				this.$httpApi.getDictByType({
					type:"area_options",
					cityOperatorId: uni.getStorageSync('cityOperatorId') || ''
				}).then(res => {
					if (res) {
						uni.setStorageSync('House_Area', res)
					}
				})
			},
			getData() {
				this.$httpApi.getConstructionList({
					cityOperatorId: this.cityOperatorId,
					latitude: this.latitude,
					longitude: this.longitude
				}).then(res => {
					if (res.records) {
						this.dataList = res.records
						uni.setStorageSync('Construction_List', res.records)
						this.dataList.forEach(item => {
							this.markers.push({
								id: item.id,
								latitude: item.locationLatitude,
								longitude: item.locationLongitude,
								iconPath: '@/pages-common/static/icon/location_tag.png',
								callout: { //自定义标记点上方的气泡窗口 点击有效  
									content: item.name, //文本
									color: '#ffffff', //文字颜色
									fontSize: 14, //文本大小
									borderRadius: 2, //边框圆角
									bgColor: '#00c16f', //背景颜色
									display: 'BYCLICK', //点击
								},
								anchor: { //经纬度在标注图标的锚点，默认底边中点
									x: 0,
									y: 0,
								}
							})
						})
					}
				})
			},
			openWindows() { // 显示子窗体
				const subNVue = uni.getSubNVueById('consumerSiteService')
				subNVue.show('slide-in-bottom', 300, function() {
					// 打开后进行一些操作...
				});
				const subNVueTableswitch = uni.getSubNVueById('tableswitch')
				subNVueTableswitch.show('slide-in-bottom', 300, function() {
					// 打开后进行一些操作...
				});
				const verticalList = uni.getSubNVueById('verticalList')
				verticalList.hide('slide-in-bottom', 300);
			},
			goToCaseDetails(item) {
				this.toPage(`/pages/case/details?id=${item.id}`)
			},
			getCollection() {
				this.$util.toast('收藏');
			},
			getScreening(val) {
				switch (val) {
					case '点赞':
						this.$util.toast('点赞');
						break;
					case '收藏':
						this.$util.toast('收藏');
						break;
					case '离我最近':
						this.$util.toast('离我最近');
						break;
				}
			},
			search() {
				// this.$util.toast('搜索');
			},
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下拉刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
	}
</script>

<style lang="scss" scoped>
	.nav-refresh {
		margin-right: 20rpx;

		image {
			width: 44rpx;
			height: 44rpx;
		}
	}

	.map {
		width: 100vw;
		height: 95vh;
	}
</style>
