<template>
	<view>
		<u-popup v-model="checkShow" @close="close" mode="bottom" border-radius="30" :height="height">
			<view class="popup_con" :style="[styleObj]">
				<view class="header">
					<view :style="{textAlign:align}" class="header_title">{{title}}</view>
					<u-icon @click="close" class="header_close" name="close" size="20"></u-icon>
				</view>
				<view class="main">
					<view class="searchContent">
						<view class="address_select" @click="chooseAddress">
							<text class="title">{{ cityName || '选择所属地'}}</text>
							<u-icon name="arrow-down" size="20"></u-icon>
						</view>
						<view style="flex: 1;">
							<u-search v-model="serachText" @search="searchAddress" @clear="searchAddress"></u-search>
						</view>
					</view>
					<scroll-view scroll-y class='scroll' >
						<view class='poi-list' v-for='(item, index) in listPoi' :key='index'
							@click='bindAddress(item,index)'>
							<view>
								<view class='row'>{{item.title}}</view>
								<view class='row color-99'>{{item.address}}</view>
							</view>
							<icon type='success' color='#FF9A52' size='22' class='icon_circle' v-if='checked === index' />
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		searchAddress
	} from '@/plugins/utils.js';
	export default {
		name: "map-popup",
		props: {
			value: {
				type: Boolean,
				default: false
			},
			height: {
				type: String,
				default: '90%'
			},
			title: {
				type: String,
				default: '地址选择'
			},
			align: {
				type: String,
				default: 'center'
			},
			styleObj: {
				type: Object,
				default: () => {}
			},
			checkedData: {
				type: Object,
				default: () => {}
			},
			masterObj: {
				type: Object,
				default: () => {}
			},
			city:{
				type: String,
				default: () => ''
			},
			poiName:{
				type: String,
				default: () => ''
			},
		},
		data() {
			return {
				checkShow: true,
				listPoi:[],
				serachText:'',
				checked: 0,
				cityName:""
			};
		},
		watch: {
			value: {
				handler(val) {
					this.checkShow = val
					if(val){
						this.serachText = this.poiName || ''
						this.searchAddress()
					}
				},
				immediate: true
			},
			city: {
				handler(val,old) {
					if(val !== old){
						this.cityName = val;
						this.serachText = '';
						this.searchAddress()
					}
				},
				immediate: true
			},
			serachText(news) {
				if (news) {
					setTimeout(() => {
						this.searchAddress()
					}, 500)
				}
			},
		},
		
		methods: {
			close() {
				this.checked = 0;
				this.checkShow = false;
				this.$emit('input', false);
				this.$emit('clearCur')
			},
			async searchAddress() {
				const {
					pois
				} = await searchAddress(this.serachText, this.cityName);
				this.listPoi = pois;
			},
			bindAddress(item, index) {
				this.checked = index;
				this.$emit('callback',item)
				this.close()
			},
			// 点击选择运营商
			chooseAddress() {
				uni.navigateTo({
					url: '/pages-common/operatorSelectCity/operatorSelectCity'
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.popup_con {
		padding: 20rpx 30rpx;
		height: 100%;
		box-sizing: border-box;
		.header {
			display: flex;
			align-items: center;
			height: 80rpx;
			padding: 0 !important;
			.header_title {
				flex: 1;
				font-size: 30rpx;
				font-weight: bold;
				color: #141414;
			}
			.header_close {
				background: #EBEBEB;
				border-radius: 50%;
				padding: 10rpx;
			}
		}
		.main{
			height: calc(100% - 80rpx);
			.searchContent {
				display: flex;
				align-items: center;
				.address_select {
					margin-right: 20rpx;
					display: flex;
					white-space: nowrap;
					.title {
						font-size: 24rpx;
						padding-right: 5rpx;
					}
				}
			}
			.scroll {
				height: calc(100% - 80rpx);
				.poi-list{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1.5rpx solid #EBEEF5;
					.row{
						font-size: 30rpx;
					}
					.color-99{
						color: #999;
						font-size: 26rpx;
					}
					.icon_circle{
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
