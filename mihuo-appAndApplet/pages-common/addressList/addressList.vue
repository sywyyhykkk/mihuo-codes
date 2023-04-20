<template>
	<view class="address">
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">
				地址管理
			</view>
		</z-nav-bar>
		<view class="address-list" v-for="(item,index) in addressList" :key="index">
			<view @click="selectButton(item,index)" class="address-item">
				<view class="address-list_left" v-if="options.isShow=='true'" :class="{buttonClick:curClick===index}">
				</view>
				<view class="address-list_center">
					<view class="center-top">
						<text>{{item.province}}</text>
						<text>{{item.city ==item.province?'':item.city }}</text>
						<text>{{item.region}}</text>
					</view>
					<view class="center-center">
						<text>{{(item.latAddress || '') + (item.poiName || '') + (item.detailAddress && item.detailAddress !=0?item.detailAddress:'')}}</text>
					</view>
					<view class="center-bottom">
						<text>{{item.name || ''}}</text>
						<text>{{item.phoneNumber || ''}}</text>
						<text class="defaultStatus" v-show="item.defaultStatus === 0">默认</text>
					</view>
				</view>
			</view>
			<uni-icons size="20" type="trash" color="rgb(202, 202, 202)" @click="del(item.id)"></uni-icons>
			<u-icon class="icon" @click="address(true,item)" name="edit-pen-fill" color="#CACACA"></u-icon>
		</view>
		<mh-empty v-if="addressList.length === 0 " title="暂无地址信息～～" />
		<!-- <u-loadmore v-else status="nomore" /> -->
		<bottom-button title="新增地址" @click="address(false,{id:''})" bgColor="#FFFFFF" :styleObj="{
			background:'#FF5F00'
        }" color="#FFFFFF">
			<template slot="icon-left">
				<u-icon color="#FFFFFF" name="plus"></u-icon>
			</template>
		</bottom-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curClick: null,
				curUser: uni.getStorageSync('userData').sysUser,
				addressList: [],
				options: {}
			}
		},
		onLoad(options) {
			this.options = options
		},
		onShow() {
			this.getMyRoom();
		},
		onBackPress() {
			uni.$emit('isSku', true)
		},
		methods: {
			// 获取地址
			getMyRoom() {
				let curAddress = {};
				this.curClick = null;
				this.$httpApi.getPostAddress().then(res => {
					this.addressList = res;
					if (this.addressList.length == 0) {
						uni.removeStorageSync('roomAddress')
					}
					if (this.options.lastPage && uni.getStorageSync('userPostAddress')) {
						curAddress = uni.getStorageSync('userPostAddress')
					} else {
						if (uni.getStorageSync('roomAddress')) {
							curAddress = uni.getStorageSync('roomAddress')
						}
					}
					this.addressList.some((v, i) => {
						if (v.id == curAddress.id) {
							this.curClick = i;
							return
						}
					})
				})
			},
			address(type, data) {
				this.toPage(`/pages-common/handleAddress/handleAddress?edit=${type}&id=${data.id}`)
			},
			selectButton(data, index) {
				this.curClick = index;
				// 直辖市做特殊处理
				if (data.city == data.province) {
					data.city = ''
				}
				// 用于选择地址时，才触发返回上一页机制
				if (this.options.isShow == 'true') {
					// 施工单需要
					uni.setStorageSync('roomAddress', data);
					// 商城单需要
					uni.setStorageSync("userPostAddress", data);
					uni.$emit('roomAddress', data)
					uni.navigateBack();
				}
			},
			del(id) {
				uni.showModal({
					title: "确认操作",
					content: "确认删除该地址？",
					cancelText: "取消",
					confirmText: "确认",
					confirmColor: "#FE6E32",
					success: (res) => {
						if (res.confirm) {
							this.$httpApi
								.deletePostAddress(id)
								.then(response => {
									if (response) {
										let roomAddress = uni.getStorageSync("roomAddress")
										let userPostAddress = uni.getStorageSync('userPostAddress')
										if (roomAddress && roomAddress.id === id) {
											uni.removeStorageSync("roomAddress");
										}
										if (userPostAddress && userPostAddress.id === id) {
											uni.removeStorageSync("userPostAddress");
										}
										this.$util.toast("删除成功");
										this.getMyRoom();
									}
								})
						}
					}
				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.address-list {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background: #FFFFFF;
		justify-content: space-between;

		.icon {
			width: 70rpx;
			flex-shrink: 0;
			justify-content: flex-end;
		}

		.address-item {
			flex: 1;
			display: flex;
			align-items: center;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.address-list_left {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			border: 2rpx solid #BDBDBD;
			margin-right: 20rpx;
		}

		.buttonClick {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			border: 2px solid #FF5F00;
			background: #FF5F00;
			position: relative;

			&::before {
				content: '✓';
				position: absolute;
				color: #FFFFFF;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 28rpx;
			}
		}

		.address-list_center {
			flex: 1;

			.center-center {
				font-size: $middleFontSize;
				font-weight: bold;
				display: flex;
				padding: 10rpx 0;

				image {
					height: 28rpx;
					width: 56rpx;
					margin-left: 10rpx;
					image-rendering: optimize-contrast;
					image-rendering: -webkit-optimize-contrast;
					flex-shrink: 0;
				}
			}

			.center-top {
				text {
					font-size: 28rpx;
					padding-right: 10rpx;
					color: #909399;

					&:last-child {
						padding-right: 0;
					}
				}
			}

			.center-bottom {
				display: flex;
				align-items: center;

				text {
					font-size: 28rpx;
					padding-right: 10rpx;
				}

				.defaultStatus {
					background: #FF5F00;
					border-radius: 8rpx;
					color: #FFFFFF;
					font-size: 20rpx;
					padding: 2rpx 10rpx;
				}
			}
		}
	}
</style>
