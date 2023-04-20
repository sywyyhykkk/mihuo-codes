<template>
	<view class="find-master">
		
		<map id="map" :scale="map.scale" :show-location="map.showLocation" :longitude="map.longitude"
			:latitude="map.latitude" :width="map.width" :height="map.height" :markers="map.markers">
			<cover-image src="https://www.51mihuo.com/static/images/icon_position.png" class="icon-img"></cover-image>
			<cover-view class="back_left map-common" @click="goBackPage()">
				<cover-image src="https://www.51mihuo.com/static/icon/icon_back_black.png" class="icon-left" @click="goBackPage()">
				</cover-image>
			</cover-view>
			<cover-view class="chat_right map-common">
				<cover-image src="https://www.51mihuo.com/static/icon/work_type/adviser.png" class="icon-right" @click="find()"></cover-image>
				<cover-view class="right-tips" @click="find()">找顾问</cover-view>
			</cover-view>
			<cover-image class="ip-logo" src="https://www.51mihuo.com/static/images/product/person_icon1.png"></cover-image>
		</map>
		
		<!-- <view class="masterType">
			<image class="bg-img" :src="mapMaster"></image>
			<view class="master-content">
				<view class="header">
					<u-icon @click="goBackPage()" class="header-icon" name="arrow-left"></u-icon>
					<view class="header-adviser" @click="find">
						<image src="@/pages-findMaster/static/icon/work_type/adviser.png"></image>
						<text>找顾问</text>
					</view>
				</view>
			</view>
		</view> -->
		<view class="master-sku">
			<view class="content">
				<view class="content-item">
					<view class="master">快速找师傅</view>
					<view class="order" @click="lookOrder">
						<findMaster-mh-mihuo-image class="img" :src="'https://www.51mihuo.com/static/icon/work_type/order.png'" />
						<text>呼叫记录</text>
					</view>
				</view>
				<view class="content-address" @click="selectAddress">
					<findMaster-mh-mihuo-image class="maps" src="https://www.51mihuo.com/static/icon/address.png" />
					<text v-if="form.completeAddress">{{ form.completeAddress }}</text>
					<text v-else>请选择房屋地址</text>
					<u-icon size="24" class="arrow-right" name="arrow-right"></u-icon>
				</view>
				<view class="info-noti">
					<view class="info-left">
						<u-icon class="u-icon" color="#808080" name="volume-fill" size="32"></u-icon>
						<text>请选择地址和工种后进行呼叫</text>
					</view>
					<!-- <u-notice-bar type="none" volume-size="32" font-size="26" :is-circular="true" :speed="100" :list="['请选择地址和工种后进行呼叫']"></u-notice-bar> -->
					<view class="info-right" @click="releaseOrder">
						<findMaster-mh-mihuo-image class="image" :src="'https://www.51mihuo.com/static/icon/work_type/list-project.png'" />
						<text>发布详细需求</text>
						<u-icon size="24" color="#808080" name="arrow-right"></u-icon>
					</view>
				</view>
				<scroll-view scroll-y style="height: calc(100% - 280rpx)">
					<view class="select-master">
						<view class="select-master_content" v-for="(item, index) in workTypeList" :key="index">
							<view class="describe" @click="lookDetail(item, index)" >
								<view class="describe-ip">
									<findMaster-mh-mihuo-image v-if="item.img" :src="item.img" />
									<findMaster-mh-mihuo-image v-else src="https://www.51mihuo.com/static/icon/work_type/other.png" />
								</view>
								<view class="describe-item">
									<view class="describe-item_top">
										<view class="col1">{{ item.skillName }}</view>
									</view>
									<view class="describe-item_bottom">
										<u-icon color="#808080" size="22" name="info-circle-fill"></u-icon>
										<text>{{ item.label }}</text>
									</view>
								</view>
							</view>
							<view class="radios">
								<!-- 呼叫中工种 -->
								<view class="wait-call" v-if="item.isServe" @click="lookDetail(item)">
									<view class="call">呼叫中</view>
									<text class="ellipsis"></text>
									<text class="ellipsis"></text>
									<text class="ellipsis"></text>
								</view>
								<!-- 选择工种 -->
								<text v-else class="radios-item" @click="selectWorkType(item, index)"
									:class="{ selectedColor: currentSelect === index }"></text>
							</view>
						</view>
						<findMaster-mh-empty v-if="workTypeList.length === 0" marginTop="100" size="200" title="暂无呼叫工种～～" />
						<u-loadmore v-else status="nomore" />
					</view>
				</scroll-view>
			</view>
		</view>
		<bottom-button title="呼叫师傅" :isShow="true" @click="findMaster"></bottom-button>
		<findMaster-mh-master-worker-detail v-model="showDetail" :data="form" @cancel="cancel" @findMaster="findMaster" />
	</view>
</template>

<script>
	import {
		masterAvatar
	} from "@/plugins/orderStatus";
	import {
		getStaticMap
	} from "@/plugins/utils.js";
	export default {
		data() {
			return {
				mapMaster: null,
				showDetail: false,
				showCall: false,
				currentSelect: null,
				workTypeList: [],
				ipImage: masterAvatar,
				form: {
					completeAddress: "",
				},
				latitude: uni.getStorageSync("latitude") || 0,
				longitude: uni.getStorageSync("longitude") || 0,
				map: {
					longitude: 0,
					latitude: 0,
					showLocation: true,
					iconPath: "@/pages-findMaster/static/images/icon_position.png",
					width: 100,
					height: 100,
					scale: 15,
					markers: [],
					controls: [{
						id: "map",
						iconPath: "@/pages-findMaster/static/images/icon_position.png",
						position: {
							left: 0,
							top: 0,
							height: 400,
						},
						clickable: false,
					}, ],
				},
			};
		},
		components:{
			
		},
		onShow() {
			if (uni.getStorageSync("roomAddress")) {
				let data = uni.getStorageSync("roomAddress");
				this.form.completeAddress =
					(data.province || "") +
					(data.city == data.province ? "" : data.city || "") +
					(data.region || "") +
					(data.latAddress || "") +
					(data.poiName || "") +
					(data.detailAddress || "") +
					(data.address || "");
				this.map.longitude = data.longitude;
				this.map.latitude = data.latitude;
				this.getMapPOtion(this.map.latitude, this.map.longitude)
			} else {
				uni.getLocation({
					type: "gcj02",
					success: (res) => {
						this.map.latitude = res.latitude;
						this.map.longitude = res.longitude;
					},
				});
			}
			this.getMapPOtion(this.map.latitude, this.map.longitude);
			this.getTypeWork();
			// #ifdef APP-PLUS
			// this.openWindows()
			// #endif
		},
		onUnload() {
			uni.$off("isSku");
		},
		async onLoad() {
			// 获取运营商所属企业					
			let curCity = await this.$http.post(
				`admin/cityoperator/getbyareacode/${uni.getStorageSync("oldLocation").areaCode}`);
			this.curCity = curCity;
		},
		methods: {
			openWindows() {
				// 显示子窗体
				uni.$emit("updateData", this.map);
				const subNVue = uni.getSubNVueById("masterMap");
				subNVue.show("slide-in-bottom", 300, function() {
					// 打开后进行一些操作...
				});
			},
			// 找顾问
			find() {
				if (this.curCity && this.curCity.id) {
					this.$util.goToWeixin()
					// this.toPage(
					// 	`/pages-message/group/index?toUserId=${this.curCity.defaultCompanyId}&type=consultant`
					// );
				} else {
					this.$util.toast("暂无顾问");
				}
			},
			getMapPOtion(latitude, longitude) {
				let markers = [{
						lng: longitude + 0.001,
						lat: latitude + 0.001,
					},
					{
						lng: longitude - 0.001,
						lat: latitude - 0.001,
					},
				];
				this.mapMaster = getStaticMap(latitude, longitude, 670, 460);
			},
			goBackPage() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			// 查看订单
			lookOrder() {
				this.toPage("/pages-findMaster/callOrder");
			},
			// 触发选择事件
			selectWorkType(data, index) {
				data.completeAddress = this.form.completeAddress || "";
				this.currentSelect = index;
				this.form = data;
			},
			// 查看详情
			lookDetail(data, index) {
				data.completeAddress = this.form.completeAddress || "";
				this.currentSelect = index;
				this.form = data;
				this.showDetail = true;
			},
			findMaster() {
				if (!this.form.completeAddress) {
					this.$util.toast("请选择房屋地址");
					return;
				}
				if (!this.form.skillId) {
					this.$util.toast("请选择呼叫师傅所属工种");
					return;
				}
				uni.navigateTo({
					url: `/pages-findMaster/callMaster?data=${JSON.stringify(
          this.form
        )}`,
				});
			},
			//
			selectAddress() {
				this.toPage("/pages-findMaster/selectAddress");
			},
			releaseOrder() {
				this.toPage(
					"/pages-findMaster/issueOrder?type=add&skillName=" +
					(this.form.skillName || "") +
					"&skillId=" +
					(this.form.skillId || "") +
					"&jobCode=" +
					(this.form.jobCode || "")
				);
			},
			/**
			 * 获取工种
			 * @type
			 * 1:岗位
			 * 2:工种
			 */
			getTypeWork() {
				this.$httpApi.getPlatformSkills({
					type: "",
					clientType: "platform",
				}).then((res) => {
					res.map((item) => {
						this.ipImage.some((v, i) => {
							if (item.skillName.indexOf(v.name) != -1) {
								item.img = v.img;
							}
						});
					});
					this.getServerWork(res);
				});
			},
			// 查询服务中的工种
			getServerWork(data) {
				this.$http.get("order/capp/biz_order/getOrderSkillIds").then((res) => {
					if (res && res.length) {
						res.map((item) => {
							data.forEach((ele) => {
								if (item == ele.skillId) {
									// true:代表服务中
									ele.isServe = true;
								}
							});
						});
					}
					this.workTypeList = data;
				});
			},
			// 取消订单
			cancel(id) {
				this.showDetail = false;
				uni.showModal({
					title: "确认操作",
					content: "是否确认取消呼叫",
					cancelText: "再等等",
					confirmText: "确认",
					confirmColor: "#FE6E32",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: "取消中",
								mask: true,
							});
							this.$http
								.post("order/capp/biz_order/cancelCall?skillId=" + id)
								.then((res) => {
									if (res) {
										this.$util.toast("取消呼叫成功");
										this.getTypeWork();
									}
								})
								.finally(() => {
									uni.hideLoading();
								});
						}
						if (res.cancel) {
							this.showDetail = true;
						}
					},
				});
			},
		},
	};
</script>
<style>
	page {
		background-color: rgb(228, 228, 234);
	}
</style>
<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}


	.find-master {
		height: 100vh;
		overflow: hidden;
		#map{
			width: 100;
			height: 100;
		}
	}

	.master-sku {
		position: absolute;
		top: 450rpx;
		right: 0;
		left: 0;
		bottom: 0;

		.content {
			background: #F5F5F5 !important;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			background: $themeBg;
			padding: 30rpx;
			box-sizing: border-box;
			height: 100%;
			overflow: hidden;

			.content-item {
				display: flex;
				justify-content: space-between;

				.master {
					color: #141414;
					font-size: 30rpx;
					font-weight: bold;
					font-family: PingFang SC;
				}

				.order {
					display: flex;
					align-items: center;
					// margin-left: 20rpx;
					position: relative;

					text {
						font-size: 26rpx;
						font-family: PingFang-SC-Medium;
						color: #141414;
					}

					.img {
						width: 24rpx;
						height: 24rpx;
						margin-right: 10rpx;
					}

					.tips {
						position: absolute;
						width: 10rpx;
						height: 10rpx;
						background: #ff5f00;
						border-radius: 50%;
						top: 0;
						right: -10rpx;
					}

					.u-icon {
						margin-right: 10rpx;
					}
				}
			}

			.content-address {
				background: #fff;
				margin: 20rpx 0;
				border-radius: 24rpx;
				padding: 20rpx 40rpx;
				display: flex;
				align-items: center;
				position: relative;

				.maps {
					margin-right: 30rpx;
					height: 40rpx;
					width: 40rpx;
					flex-shrink: 0;
				}

				text {
					font-size: 26rpx;
					font-weight: bold;
					margin-right: 10rpx;
					@include bov(2);
				}

				.arrow-right {
					position: absolute;
					right: 0;
					padding-right: 20rpx;
				}
			}

			.info-noti {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.info-left {
					display: flex;
					align-items: center;
					.u-icon {
						margin-right: 20rpx;
					}

					text {
						color: #808080;
						font-size: $smallFontSize;
						font-family: PingFang-SC-Medium;
					}
				}

				.info-right {
					display: flex;
					flex: 1;
					align-items: center;
					justify-content: flex-end;
					image {
						width: 22rpx;
						height: 22rpx;
					}
					text {
						width: max-content;
						font-size: $smallFontSize;
						font-family: PingFang-SC-Medium;
						white-space: nowrap;
						color: #141414;
					}
				}
			}

			.empty {
				width: 100%;
				height: 50rpx;
			}

			.select-master {
				padding-top: 20rpx;

				.select-master_content {
					// height: 146rpx;
					background: #fff;
					border-radius: $mainBorderRadius;
					padding: 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;

					.describe {
						flex: 1;
						display: flex;
						align-items: center;

						.describe-ip {
							width: 120rpx;
							height: 100rpx;
							margin-right: 30rpx;
							flex-shrink: 0;
						}

						.describe-item {
							width: 100%;

							.describe-item_top {
								display: flex;
								justify-content: space-between;
								width: 100%;

								// align-items: center;
								.col1 {
									color: #333333;
									font-size: $middleFontSize;
									font-weight: bold;
									padding-right: 20rpx;
									flex: 1;
								}

								.clo2 {
									width: 100rpx;
									border-radius: 6rpx;
									background: #fff6f3;
									// padding-left: 10rpx;
									display: flex;
									align-items: center;
									justify-content: center;
									flex-shrink: 0;
									white-space: nowrap;

									text {
										color: #fe6e32;
										font-size: 18rpx;
										font-weight: bold;
									}
								}
							}

							.describe-item_bottom {
								.u-icon {
									padding-right: 10rpx;
								}

								text {
									color: #808080;
									font-size: 22rpx;
									// @include bov(2);
								}
							}
						}
					}

					.radios {
						width: 120rpx;
						flex-shrink: 0;
						text-align: right;
						margin-left: 20rpx;

						.radios-item {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							border: 2rpx solid #bdbdbd;
							display: inline-block;
						}

						.selectedColor {
							border: 4rpx solid #fe6e32;
							position: relative;

							&::before {
								content: "✓";
								color: #fe6e32;
								font-size: 24rpx;
								font-weight: bold;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
							}
						}

						.call {
							color: #fe6e32;
							font-size: 24rpx;
							font-weight: bold;
						}

						.wait-call {
							display: flex;
							align-items: center;

							text {
								width: 6rpx;
								height: 6rpx;
								border-radius: 50%;
								background: #fe6e32;
								margin-left: 5rpx;
								-webkit-animation: bodong 2s infinite ease;
								animation: bodong 2s infinite ease;
							}

							&:first-child {
								-webkit-animation-delay: .2s;
								animation-delay: .2s;
							}

							&:nth-child(2) {
								-webkit-animation-delay: .3s;
								animation-delay: .3s;
							}

							&:nth-child(3) {
								-webkit-animation-delay: .4s;
								animation-delay: .4s;
							}
						}
					}
				}
			}
		}
	}

	.masterType {
		position: absolute;
		// z-index: 999;
		top: 0;
		right: 0;
		left: 0;

		.bg-img {
			width: 750rpx;
			height: 400rpx;
			// height: 100%;
			// height: 800rpx;
			image-rendering: -webkit-optimize-contrast;
			image-rendering: optimize-contrast;
		}

		.master-content {
			position: absolute;
			top: calc(5rpx + var(--status-bar-height));
			left: 0;
			right: 0;
		}
	}

	.cover-header {
		display: flex;
		width: 100%;
		padding-bottom: 20rpx;
		background: transparent;
		color: #808080;

		.header-icon {
			width: 60rpx;
			height: 60rpx;
			background: #fff;
			border-radius: 24rpx;
			margin: 0 20rpx;
			float: left;
			position: relative;

			.cover-back-icon {
				position: absolute;
				top: 15rpx;
				width: 15rpx;
				height: 30rpx;
				margin-left: 20rpx;
				// margin: 22rpx 15rpx;
			}

		}

		.header-adviser {
			width: 160rpx;
			font-size: 24rpx;
			color: #141414;
			float: right;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			margin-right: 20rpx;
			background-color: #fff;
			box-shadow: 0px 0px 10px 4px #666;
			border-radius: 30rpx;
			white-space: normal;
			line-height: normal;

			.cover-icon {
				width: 30rpx;
				height: 30rpx;
				float: left;
				margin: 15rpx 15rpx 15rpx 20rpx;
				// line-height: 60rpx;
			}

			.cover-text {
				float: left;
				line-height: 55rpx;
				display: inline-block;
			}
		}
	}

	@-webkit-keyframes bodong {
		25% {
			width: 10rpx;
			height: 10rpx;
		}

		50%,
		100% {
			width: 6rpx;
			height: 6rpx;
		}

		75% {
			width: 10rpx;
			height: 10rpx;
		}
	}

	.map,
	map {
		width: auto;
		height: auto;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: calc(100vh - 450rpx);
	}

	.icon-img {
		width: 36px;
		height: 36px;
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.map-common {
		height: 35px;
		position: absolute;
		top: calc(5rpx + var(--status-bar-height));
		border-radius: 35px;
		background: #fff;
	}

	.controls-mask {
		height: calc(80rpx + var(--status-bar-height));
		background: rgba(0, 0, 0, 0.1);
	}

	.back_left {
		left: 20rpx;
		width: 40px;

		.icon-left {
			width: 36rpx;
			height: 26rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.chat_right {
		right: 20rpx;
		width: 150rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		::v-deep .uni-cover-view {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.icon-right {
			width: 18px;
			height: 18px;
			margin-right: 10rpx;
		}

		.right-tips {
			color: #141414;
			font-size: 22rpx;
			font-weight: bold;
			font-family: PingFang-SC-Bold;
		}
	}

	.ip-logo {
		position: absolute;
		bottom: -12rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 100rpx;
		height: 50rpx;
	}
</style>
