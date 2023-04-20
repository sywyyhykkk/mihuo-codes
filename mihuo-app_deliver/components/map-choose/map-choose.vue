<template>
	<view>
		<map id='map' :scale='map.scale' :show-location='map.showLocation' :longitude='map.longitude'
			:latitude='map.latitude' :width='map.width' :height='map.height' :controls='map.controls'
			:markers='map.markers' @regionchange='mapChange'>
			<cover-view class="controls-mask"></cover-view>
			<cover-view class="controls-cancel">取消</cover-view>
			<cover-view class="controls-sure" @click="chooseMap">确定</cover-view>
			<cover-image src="/static/images/icon-address/address-4.png" class="icon-img"></cover-image>
		</map>
		<view class='footer'>
			<view class="searchContent">
				<view class="address_select center-item" @click="selectAddress">
					<text class="title">{{userAddress.city || '选择地址'}}</text>
				</view>
				<view style="flex: 1;">
					<u-search v-model="serachText" @search="searchAddress" @custom="searchAddress"></u-search>
				</view>
			</view>
			<scroll-view scroll-y class='scroll' :scroll-top='scrollTop'>
				<view class="">
					<view class='padding border-b position-r' v-for='(item, index) in list' :key='index'
						@click='bindAddress(index)'>
						<view class='row'>{{item.title}}</view>
						<view class='row color-99'>{{item.address}}</view>
						<icon type='success' color='$themeColor' size='22' class='icon_circle' v-if='checked === index' />
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
		posToCity
	} from '@/plugins/utils.js';
	export default {
		name: 'map-choose',
		props: {

		},
		data() {
			return {
				duration: 250,
				detail: '',
				serachText: '',
				userAddress: {},
				map: {
					longitude: 102.72,
					latitude: 25.05,
					showLocation: true,
					iconPath: '/static/images/icon-address/address-4.png',
					width: 40,
					height: 40,
					scale: 16,
					controls: [{
						id: 'map',
						iconPath: '/static/images/icon-address/address-4.png',
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
				mapStatus: 1 // 控制选择地址时 地图不加载附近列表
			}
		},
		created() {

		},
		mounted() {
			let map = this.map
			this.getAddress();
		},
		methods: {
			getAddress() {
				getAppWxLatLon(async (res) => {
					console.log(res);
					let {
						pois,
						addressComponent
					} = await posToCity({
						latitude: latitude,
						longitude: longitude,
					}, 1);
					this.serachText = pois[0].title;
					this.userAddress.city = addressComponent.city;
					this.list = pois;
				})
			},
			areaComplete(e) {
				console.log(e);
				this.e = e
			},
			selectAddress() {
				// console.log(this.$refs.areaChoose);
				// this.$refs.areaChoose.show();
			},
			confirmChange(address) {
				this.userAddress = address;
				this.$store.commit('setUserAddress', address);
			},
			//城市选择之后开始的搜索
			async searchAddress() {
				const {
					pois
				} = await searchAddress(this.serachText);
				this.list = pois;
			},

			getWidthHeight(fn) {
				var query = uni.createSelectorQuery()
				query.select('#map').boundingClientRect()
				query.exec(res => {
					fn(res[0])
				})
			},
			chooseMap() {
				this.$emit('chooseAddress', this.list[this.checked]);
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

			submit() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	page {
		background: #F6F6F6;
		font-size: 32rpx;

		.address_select {
			width: 100rpx;
			margin: 10rpx;
		}

		.searchContent {
			margin: 0 20rpx;
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
		bottom: 800rpx;
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
		height: 800rpx;
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

	.icon-position {
		position: relative;
		top: 50%;
		left: 50%;
		width: 36px;
		height: 36px;
		transform: translate(-50%, -50%);

		.icon-img {
			width: 36px;
			height: 36px;
			display: block;
			position: fixed;
			top: 100px;
			left: 100px;
		}
	}

	.icon-img {
		width: 36px;
		height: 36px;
		display: block;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-top: -70px;
	}
</style>
