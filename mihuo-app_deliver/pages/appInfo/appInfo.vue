<template>
	<view>
		<z-nav-bar>
			<view class="nav-bar" slot="default">
				关于觅活
			</view>
		</z-nav-bar>
		<view class="appinfo">
			<view>
				<image class="logo" src="@/static/logo.png" @click="onClickLogo"></image>
			</view>
			<view style="margin: 0 0 15rpx 0;"><text class="name">MIHUO</text><text class="version">{{version}}</text>
			</view>
			<text class="appUpdate" :class="{'active':hasNewVsesion}" @click="()=>appUpdate()">检测更新</text>
		</view>
		<view style="margin: 60rpx 0;">
			<waves>
				<menu-item :border="false" :height="100" title="缓存清理" @click="()=>goPage(1)"></menu-item>
			</waves>
			<waves>
				<menu-item :border="false" :height="100" title="服务与规则" @click="()=>goPage(2)"></menu-item>
			</waves>
			<waves>
				<menu-item :border="false" :height="100" title="隐私协议" @click="()=>goPage(3)"></menu-item>
			</waves>
			<waves v-if="currentDevMode">
				<menu-item :border="false" :height="100" :title="'当前库: '+currentDevMode"></menu-item>
			</waves>
		</view>
		<!-- #ifdef APP-PLUS -->
		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="input-popup">
				<view class="input-item" @click="selectMode(1)" :style="{borderColor: apiMode !== 1 ? '' : '#002FA5'}">
					UAT
				</view>
				<view class="input-item" @click="selectMode(2)" :style="{borderColor: apiMode !== 2? '' : '#002FA5'}">
					测试库
				</view>
				<view class="input-item" @click="selectMode(3)" :style="{borderColor: apiMode !== 3 ? '' : '#002FA5'}">
					正式库
				</view>
				<input class="input-area" placeholder-style="font-size: 30rpx" type="password" @confirm="confirm"
					v-model="password" placeholder="请输入开发模式密码" />
				<view class="buttons">
					<view class="button" @click="cancel">取消</view>
					<view class="button" @click="confirm" style="border-left: 2rpx solid #f2f2f2">
						确认
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	import common from '@/config/common.js'
	import tabInit from '@/plugins/im/tabInit.js';
	import imsdk from '@/plugins/im/imsdk.js'
	export default {
		data() {
			return {
				version: '1.0.0',
				hasNewVsesion: false,
				clickedCount: 0,
				isShowDevMode: false,
				password: '',
				apiMode: -1,
				currentDevMode: uni.getStorageSync('devModeApi').current || ''
			}
		},
		onLoad() {
			// 计算出可用高度
			plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
				let app_name = wgtinfo.name;
				let version = wgtinfo.version;
				let system = uni.getSystemInfoSync().platform;
				//这里可以用code 但是安卓可能不支持
				let version_num = version.split('.').join('');
				this.version = wgtinfo.version;
			})
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
				let app_name = wgtinfo.name;
				let version = wgtinfo.version;
				let system = uni.getSystemInfoSync().platform;
				this.version = version;
				//这里可以用code 但是安卓可能不支持
				let version_num = version.split('.').join('');
				let apptype = 0;
				switch (app_name) {
					case '觅活工匠':
						apptype = system === 'ios' ? 3 : 2
						break;
					default:
						apptype = 10
				}
				this.$httpApi.getAppVersion(apptype).then(res => {
					if (!res) return;
					if (res && res.id) {
						let oldVersion = version_num.replace('.', '');
						let newVersion = res.version.replace('.', '');
						if (oldVersion >= newVersion) {
							return
						}
					}
					this.hasNewVsesion = true;
				})
			});
			// #endif
		},
		methods: {
			selectMode(mode) {
				this.apiMode = mode
			},
			cancel(){
				this.clickedCount = 0
				this.$refs.popup.close()
			},
			confirm() {
				// #ifdef APP-PLUS
				if (this.password === 'Mihuokeji888') {
					switch (this.apiMode) {
						case 1:
							// UAT
							const processUAT = {
								imageGlobal: "https://mihuo.obs.cn-east-3.myhuaweicloud.com/",
								apiUrl: "https://api-uat.51mihuo.com/",
								apiVersion: "A",
								data: {
									coid: '2' // 昆明运营商 
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Authorization': 'Basic YXBwOmFwcA==',
									'VERSION': 'A'
								},
								current: 'UAT'
							}
							uni.setStorageSync('devModeApi', processUAT)
							break
						case 2:
							// 测试库
							const processTest = {
								imageGlobal: "https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/",
								apiUrl: "https://api-test.51mihuo.com/",
								apiVersion: "A",
								data: {
									coid: '1' // 重庆运营商
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Authorization': 'Basic YXBwOmFwcA==',
									'VERSION': 'A'
								},
								current: 'TEST'
							}
							uni.setStorageSync('devModeApi', processTest)
							break
						case 3:
							// 正式库
							const processPro = {
								imageGlobal: "https://mihuo.obs.cn-east-3.myhuaweicloud.com/",
								apiUrl: "https://api.51mihuo.com/",
								apiVersion: "A",
								data: {
									coid: '1'
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Authorization': 'Basic YXBwOmFwcA==',
									'VERSION': 'A'
								},
								current: 'PRODUCTION'
							}
							uni.setStorageSync('devModeApi', processPro)
							break
						default:
							break
					}
					this.$refs.popup.close()
					// 清除与用户信息相关的本地缓存
					this.$store.commit("emptyUserInfo");
					uni.removeStorageSync('userData')
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('imUserInfo')
					uni.removeStorageSync('userPersonId')
					uni.removeStorageSync('userRole')
					uni.removeStorageSync('userAddress')
					uni.removeStorageSync('userSetting')
					uni.removeStorageSync('cityOperatorId')
					uni.removeStorageSync('oldLocation')
					uni.removeStorageSync('sqliteDataVersion')
					uni.removeTabBarBadge({
						index: 2
					})
					// #ifdef APP-PLUS
					plus.runtime.setBadgeNumber(0)
					// #endif
					//数据库关闭 scoket 关闭
					tabInit.closeTableSQL();
					imsdk.onclose();
					plus.runtime.restart();
				}
				// #endif
			},
			onClickLogo() {
				// #ifdef APP-PLUS
				this.clickedCount += 1
				if (this.clickedCount === 5) {
					this.$refs.popup.open()
				}
				// #endif
			},
			goPage(index) {
				switch (index) {
					case 1:
						uni.showLoading({
							title: '清理中',
							mask: false
						});
						setTimeout(() => {
							uni.showToast({
								title: '清理完成',
								icon: "success"
							})
							uni.hideLoading()
						}, 2000)
						this.getStorageSize();
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/serviceAgreement/serviceAgreement'
						});
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/privacy/privacy'
						});
						break;
				}
			},
			getStorageSize: function() {
				let that = this;
				uni.getSavedFileList({
					success: function(res) {
						if (res.fileList.length > 0) {
							console.log(res);
							// uni.removeSavedFile({
							//   filePath: res.fileList[0].filePath,
							//   complete: function (res) {
							//     console.log(res);
							//   }
							// });
						}
					}
				});
			},
			appUpdate() {
				if (!this.hasNewVsesion) {
					uni.showToast({
						title: "当前已经是最新版本",
						icon: "none"
					})
				} else {
					this.getVersion();
					// ios打开应用商店
					// let appleId = common.iosAppid;
					// plus.runtime.launchApplication({
					// 	action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
					// }, (e) => {
					// });
				}
			},
			getVersion() {
				plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
					let app_name = wgtinfo.name;
					let version = wgtinfo.version;
					let system = uni.getSystemInfoSync().platform;
					//这里可以用code 但是安卓可能不支持
					let version_num = version.split('.').join('');
					let apptype = 0;
					switch (app_name) {
						case '觅活':
							apptype = system === 'ios' ? 1 : 0
							break
						case '觅活工匠':
							apptype = system === 'ios' ? 3 : 2
							break;
						default:
							apptype = 10
					}
					this.getAppVersion(version_num, apptype);
				});
			},
			getAppVersion(version, apptype) {
				//这个接口是不需要登录也可以访问的。
				uni.request({
					url: common.apiUrl + `admin/appversion/getNewVersion?type=${apptype}`,
					success: (res) => {
						if (res.data.code == 0) {
							let data = res.data.data;
							let type = data.updateType; //type判断为整包更新还是热更新(整包为.apk,热更新为.wgt)
							let down_url = common.imageGlobal + data.fileUrl; //更新包下载地址
							let fileType = data.fileUrl.split('.')[1];
							this.downLoadFileAndInstall(down_url, type, fileType);
						} else {
							uni.showToast({
								title: '更新失败',
								icon: 'none'
							})
						}
					}
				})
			},
			// 下载更新包
			downLoadFileAndInstall(down_url, type, fileType) {
				if (type == 1) {
					//热更新
					plus.io.resolveLocalFileSystemURL(`_doc/update/appNewVersion.${fileType}`, (entry) => {
						entry.remove()
						plus.nativeUI.toast('正在为您更新App,请稍后....');
						plus.downloader.createDownload(down_url, {
							filename: `_doc/update/appNewVersion.${fileType}`
						}, (d, status) => {
							if (status == 200) {
								this.installWgt(d.filename); // 安装wgt包
							} else {
								plus.nativeUI.toast('更新失败，请稍后重试');
							}
						}).start();
					}, () => {
						//这里只是以防万一，安卓出现错误。
						plus.nativeUI.toast('正在为您更新App,请稍后....');
						plus.downloader.createDownload(down_url, {
							filename: `_doc/update/appNewVersion.${fileType}`
						}, (d, status) => {
							if (status == 200) {
								this.installWgt(d.filename); // 安装wgt包
							} else {
								plus.nativeUI.toast('更新失败，请稍后重试');
							}
						}).start();
					})
				} else if (type == 2) {
					// 整包
					let osname = plus.os.name;
					const googlePlay = "com.android.vending";
					if (osname == 'Android') {
						var Uri = plus.android.importClass("android.net.Uri");
						var Intent = plus.android.importClass('android.content.Intent');
						var main = plus.android.runtimeMainActivity();
						var uri = Uri.parse("market://details?id=" + common.androidBuildName);
						var intent = new Intent(Intent.ACTION_VIEW, uri);
						// 选择进入商店  
						intent.setPackage(googlePlay);
						intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
						// 没有该商店应用  
						if (intent.resolveActivity(main.getPackageManager()) !== null) {
							main.startActivity(intent);
						} else {
							// 跳转浏览器  
							let uri = Uri.parse("https://play.google.com/store/apps/details?id=" + common.androidBuildName);
							let intent = new Intent(Intent.ACTION_VIEW, uri);
							intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK;
							intent.setPackage('com.android.browser');
							main.startActivity(intent);
						}
					} else {
						// ios打开应用商店
						let appleId = common.iosAppid;
						plus.runtime.launchApplication({
							action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
						}, (e) => {

						});
					}
				}
			},
			//更新资源包
			installWgt(path) {
				plus.runtime.install(path, {
						force: true
					}, () => {
						uni.hideToast();
						let system = uni.getSystemInfoSync(); // 获取系统信息
						if (system.platform === 'android') {
							plus.nativeUI.toast('App更新完成, 即将重新启动');
							setTimeout(() => {
								plus.runtime.restart();
							}, 1000)
						} else {
							plus.nativeUI.toast('App更新完成, 即将重新启动');
							setTimeout(() => {
								plus.runtime.restart();
							}, 1000)
						}
					},
					(e) => {
						plus.nativeUI.toast('App更新失败[' + e.code + ']：' + e.message);
					}
				);
			}
		}
	}
</script>

<style lang="scss">
	@import '@/style/mixin.scss';

	.nav-bar {
		@include nav-bar-title($fontColor33)
	}

	page {
		background-color: #fff;
	}

	.appinfo {
		text-align: center;

		.logo {
			border-radius: 15rpx;
			width: 150rpx;
			height: 150rpx;
			margin: 100rpx auto 20rpx auto;
		}

		.name,
		.version {
			color: $mainFontColor;
			font-weight: 500;
			margin: 0 10rpx;
		}

		.appUpdate {
			position: relative;

			&.active::before {
				content: ' ';
				display: inline-block;
				width: 8rpx;
				height: 8rpx;
				border-radius: 50%;
				background-color: $themeColor;
				position: absolute;
				right: -12rpx;
				top: 2rpx;
			}
		}
	}

	.input-popup {
		width: 60vw;
		height: 40vh;
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		.input-item {
			width: max-content;
			padding: 10rpx 20rpx;
			border: 2rpx #F2F2F2 solid;
			border-radius: 20rpx;
		}

		.input-area {
			width: 100%;
			height: 72rpx;
			border-radius: 20rpx;
			border: 2rpx solid #f2f2f2;
			padding: 0 20rpx;
		}

		.buttons {
			display: flex;
			width: 100%;
			height: 72rpx;

			.button {
				width: 50%;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
			}
		}
	}
</style>
