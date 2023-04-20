<template>
	<view>
		<z-nav-bar bgColor="#f9f9f9">
			<view class="nav-title" slot="default">需求详情</view>
			<!-- <image class="share-icon" slot="right" src="/static/icon/share3.png" /> -->
		</z-nav-bar>

		<view class="main-con" :style="{'padding-bottom':pageType==='mine'?'100rpx':'200rpx'}">
			<view class="top-view" :style="demandInfo.customerId==userId?'background: transparent;':''">
				<view class="title" v-if="demandInfo && demandInfo.id">
					{{demandInfo.districtName + demandInfo.poiName + demandInfo.name}}
				</view>
				<view class="display-center" style="margin-bottom: 28rpx;">
					<view>
						<view class="time" v-if="demandInfo && demandInfo.id">
							<text>发布时间：{{setTime(demandInfo.created)}}</text>
							<text>{{$util.relativeTime(demandInfo.created)}}</text>
						</view>
						<view class="time">
							<text v-if="!demandInfo.permanentStatus&&demandInfo.startDate&&demandInfo.endDate">
								{{demandInfo.endDate&&demandInfo.endDate.slice(0,10)}} 前有效
							</text>
							<text v-else>永久有效</text>
						</view>
					</view>
					<view class="views">{{demandInfo.views}}浏览</view>
				</view>

				<!-- 人员信息 -->
				<view class="persons-view display-center">
					<view class="left-persons display-left">
						<view class="avatars display-left"
							v-if="demandInfo.efficientUserIds&&demandInfo.efficientUserIds.length">
							<u-avatar size="26" class="avatar" v-for="em in demandInfo.efficientUserIds.slice(0,3)"
								:key="em" :src="$util.avatarImage(em)" v-if="em" />
						</view>
						<view class="label">{{demandInfo.efficientNum}}人反馈真实</view>
					</view>
					<view class="right">{{demandInfo.cooperationNum}}人达成合作</view>
				</view>

			</view>

			<view class="feedback-view2" id="feedback-view2" v-if="demandInfo.customerId!=userId">
				<view class="head-view2" v-if="demandInfo.isChat || demandInfo.feedbackStatus || demandInfo.isCall">
					<view class="tips-view display-left">
						<image src="/static/icon/tips.png" class="tips-icon" />
						<view class="tips">小觅提示</view>
					</view>
					<view class="display-center">
						<view class="left">为了更好地为您服务，需要您反馈订单的真实性</view>
						<view class="right display-left" @click="inquiryShow = !inquiryShow">
							<view class="label">反馈</view>
							<image src="/static/icon/open-cancel.png" class="icon" style="transform:rotate(-180deg)" />
						</view>
					</view>
				</view>
			</view>

			<view class="explain" v-if="demandInfo">
				<view class="upper">
					<view class="title">需求说明</view>
					<view class="remark">{{demandInfo.name}}</view>
					<view class="img-con" v-if="demandInfo.imageList">
						<image-show :enable="true" width="190" :key="demandInfo.imageList" height="190"
							quantityPerLine="3" :imgSrc="demandInfo.imageList"></image-show>
					</view>
					<view class="audio-contain" v-if="demandInfo.voice">
						<mihuo-audio :formData="demandInfo.voice" class="voice" />
					</view>
				</view>

				<view class="lower">
					<view class="title">联系电话</view>
					<view class="tel-view">
						<image class="icon" src="/static/icon/tel2.png" />
						<view class="tel">
							{{$util.displayTel(this.demandInfo.customerPhone,this.demandInfo.showPhone)}}
						</view>
					</view>

					<view class="display-center">
						<view class="title">施工地点</view>
						<view class="distance" v-if="demandLocationInfo&&demandLocationInfo.distanceShow">
							{{distance}}
						</view>
					</view>

					<view class="align-end">
						<view class="tel-view">
							<image class="icon" src="/static/icon/location2.png" />
							<view class="tel">{{demandInfo.address}}</view>
						</view>
						<view class="tel-view" @click="navigation">
							<image class="navigation-icon" src="/static/icon/navigation.png" />
							<view class="navigation-text">到这里</view>
						</view>

					</view>
					<!-- 地图 -->
					<!-- #ifdef APP-PLUS -->
					<view class="map" v-if="!showPopup && !inquiryShow">
						<map style="width: 100%; height: 100%;" :latitude="demandInfo.latitude"
							:longitude="demandInfo.longitude" :markers="covers" />
					</view>
					<!-- #endif -->
				</view>
			</view>

			<view class="person-con" v-if="demandInfo">
				<view class="title">发布者</view>
				<view class="person-info display-left">
					<u-avatar class="avatar" size="70" :src="$util.avatarImage(demandInfo.customerId)"
						v-if="demandInfo.customerId" />
					<view class="right-name">
						<view class="display-left">
							<view class="name">{{demandInfo.customerName}}</view>
							<view class="real-name" v-if="demandInfo.customerRealStatus">已实名</view>
							<view class="no-real-name" v-else>未实名</view>
						</view>
						<view class="type">个人发布</view>
						<!-- <view class="display-left">
							<image class="auth" src="/static/icon/home/auth.png" v-if="demandInfo.customerRealStatus" />
							<view class="type">个人发布</view>
						</view> -->
					</view>
				</view>
			</view>

			<view class="service-rule">
				<view class="title">服务须知</view>
				<view class="content">
					觅活平台无法对线下交易的施工质量进行监控，请务必自行沟通施工需求，甄别交易的真实性。
					在线发布需求仅为撮合服务，不作为退款、售后和质保的凭证。
				</view>
			</view>

			<!-- <view class="recommend-view">
				<view class="top">
					<image class="icon" src="/static/icon/tuijian.png" />
					<view class="title">相关推荐</view>
				</view>
				<demand-item :item="demandInfo" />
			</view> -->

		</view>

		<!-- 底部按钮 -->
		<cover-view class="btn_view" v-if="!showPopup && !inquiryShow && pageType!=='mine'"
			:style="{ height: platform === 'ios' ? '180rpx':'120rpx' }  ">
			<cover-view class="btm-btn" v-if="demandInfo && userId==demandInfo.customerId  ">
				<cover-view class="cancel button" @click="toConactRecord">联系记录</cover-view>
				<cover-view class="cancel button" @click="cancelOrder">关闭订单</cover-view>
				<cover-view class="edit button" @click="editOrder">修改订单</cover-view>
				<cover-view class="confirm button" @click="confirm">已找到</cover-view>
			</cover-view>
			<cover-view class="btm-btn" v-else>
				<cover-view @click.capture="()=>chat()" class="online"
					:style="demandInfo.showPhone==0?'margin-left:240rpx':'margin-left:105rpx'">在线沟通</cover-view>
				<cover-view @click.capture="()=>contactBoss()" class="contact-boss" v-if="demandInfo.showPhone==1">拨打电话
				</cover-view>
			</cover-view>
		</cover-view>

		<!-- 我发布的需求按钮 -->
		<view class="mine-btm-btn" v-if="pageType==='mine' && demandInfo.status==1">
			<view class="cancel button" @click="cancelOrder">关闭订单</view>
			<view class="confirm button" @click="editOrder">修改订单</view>
		</view>

		<!-- 关闭订单原因弹窗 -->
		<!-- 	<sku-popup v-model="showPopup" title="关闭订单原因" height="55%" :styleObj="{background:'#fff'}">
			<view class="content-sku">
				<scroll-view scroll-y class="content-main">
					<view class="content-main_res" @click="radioValue(item, index)"
						v-for="(item, index) in cancelOrderReasonList" :key="index">
						<view class="radio" :class="{ radioSelect: curIndex === index }"></view>
						<view class="reason">{{ item.label }}</view>
					</view>

					<textarea v-show="(cancelOrderReasonList.length-1) == curIndex"  placeholder-style="color:#808080" placeholder="请填写补充描述"
						style="width: 100%;height: 186rpx;padding: 24rpx 26rpx;margin-top: 24rpx;background: #F7F7F7;
							border-radius: 12rpx;font-size: 26rpx;" v-model="inputReason" />
				</scroll-view>
				<view class="confirm">
					<view class="btn" @click="confirmCancel">确认关闭</view>
				</view>
			</view>
		</sku-popup> -->

		<u-popup v-model="showPopup" border-radius="30" height="900" mode="bottom" @close="close"
			:safe-area-inset-bottom="false" :closeable="true">
			<view class="criteria-contian">
				<view class="tittle">
					关闭订单原因
				</view>
				<view class="list-contain">
					<scroll-view :scroll-y="true" class="scroll-Y">
						<view class="content-main_res" @click="radioValue(item, index)"
							v-for="(item, index) in cancelOrderReasonList" :key="index">
							<view class="radio" :class="{ radioSelect: curIndex === index }"></view>
							<view class="reason">{{ item.label }}</view>
						</view>
					</scroll-view>
				</view>
				<view class="item-button-contain" @click="confirmCancel">
					<view class="item-button">
						确认关闭
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 反馈 -->
		<sku-popup v-model="inquiryShow" title="反馈" height="55%" :styleObj="{background:'#fff'}" @clearCur="clearCur">
			<view class="inquiry">
				<view class="form-item">
					<view class="title">信息是否真实？</view>
					<u-radio-group v-model="form.isReal" class="radio-group">
						<u-radio :name="1" :active-color="$styleColor.themeColor">
							<text class="label">真实的</text>
						</u-radio>
						<u-radio :name="0" :active-color="$styleColor.themeColor">
							<text class="label">不真实</text>
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-item">
					<view class="title">是否达成合作？</view>
					<u-radio-group v-model="form.cooperationStatus" class="radio-group">
						<u-radio :name="1" :active-color="$styleColor.themeColor">
							<text class="label">已达成</text>
						</u-radio>
						<u-radio :name="0" :active-color="$styleColor.themeColor">
							<text class="label">未达成</text>
						</u-radio>
					</u-radio-group>
				</view>
				<!-- <view class="form-item">
					<view class="title">问题反馈（选填）</view>
					<textarea  placeholder-style="color:#808080" placeholder="请输入问题"
						style="width: 100%;height: 186rpx;padding: 24rpx 26rpx;margin-top: 24rpx;background: #F7F7F7;
							border-radius: 12rpx;font-size: 26rpx;" v-model="form.reason" />
				</view>
				<view class="form-item file-contain" id="file-contain">
					<image-upload-new :uploadType="uploadType" :count="9" v-model="fileJson" />
				</view> -->
			</view>
			<view class="submit-btn">
				<view class="btn" @click="submit()">提交</view>
			</view>
		</sku-popup>
	</view>
</template>

<script>
	import DemandItem from "../demandMarket/demand-item.vue";
	import moment from '@/static/js/moment.js'
	import {
		judgePermission,
		gotoAppPermissionSetting,
		checkSystemEnableLocation
	} from '@/plugins/permission';
	export default {
		components: {
			DemandItem
		},
		data() {
			return {
				isOpen: false,
				optionId: '',
				onBack: true,
				inquiryShow: false, //咨询弹框
				inputReason: '',
				cancelReason: '',
				curIndex: 0,
				cancelOrderReasonList: [],
				showPopup: false,
				demandInfo: {},
				covers: [],
				distance: '',
				userId: uni.getStorageSync('userData').sysUser.userId,
				form: {
					// attachments: "",
					consultationId: 0,
					cooperationStatus: 1,
					cooperationUserId: 0,
					isReal: 1,
					// reason: ""
				},
				fileJson: '',
				uploadType: ['图片', '视频'],
				talkType: 0, //1聊一聊 2联系老板
				scrollNum: '',
				isTop: false,
				platform: '',
				demandLocationInfo: {}
			}
		},

		onLoad(option) {
			this.pageType = option.pageType
			this.optionId = option.id
			this.demandLocationInfo = option.demandLocationInfo != undefined ? JSON.parse(option.demandLocationInfo) : {}

			// #ifdef APP-PLUS
			// setTimeout(() => {
			// 	this.getLocation()
			// }, 200)
			// #endif
		},

		onShow() {
			this.getDemandInfo()
			uni.$once('chated', (data) => {
				console.log(data)
				if (data.status === 'success') {
					this.saveCooperationTalk(1)
				}
			})
		},

		onReady() {
			this.getEquipment()
		},

		// onPageScroll(e){
		// 	if(e.scrollTop > this.scrollNum){
		// 		this.isTop = true
		// 	}else{
		// 		this.isTop = false
		// 	}
		// },

		// onBackPress() {
		// 	if(this.demandInfo.customerId!=this.userId&&this.isCall){
		// 		this.inquiryShow = true;
		// 	}else{
		// 		this.inquiryShow = false;
		// 		this.onBack = false//允许返回
		// 	}
		// 	return this.onBack;
		// },

		computed: {
			calcDays() {
				return moment(this.demandInfo.endDate).diff(moment(this.demandInfo.startDate).format("YYYY-MM-DD"), 'days')
			}
		},

		methods: {
			getEquipment() {
				let port = uni.getSystemInfoSync().platform
				console.log(port)
				switch (port) {
					case 'android':
						this.platform = 'android'
						break;
					case 'ios':
						this.platform = 'ios'
						break;
					default:
						break;
				}
				// const query = uni.createSelectorQuery().in(this);
				// query.select('#feedback-view2').boundingClientRect(data => {
				// 	this.scrollNum = data.top - 15
				// }).exec();
			},

			toConactRecord() {
				this.toPage(`/pages/demandMarket/contactRecord?info=${JSON.stringify(this.demandInfo)}`)
			},
			saveCooperationTalk(type) {
				let data = {
					cityName: this.demandInfo.cityName,
					consultationId: this.demandInfo.id,
					districtName: this.demandInfo.districtName,
					latAddress: this.demandInfo.latAddress,
					latitude: this.demandInfo.latitude,
					longitude: this.demandInfo.longitude,
					poiName: this.demandInfo.poiName,
					provinceName: this.demandInfo.provinceName,
					showPhone: this.demandInfo.showPhone,
					type: type,
					userId: this.demandInfo.customerId,
					userName: this.demandInfo.customerName,
					userPhone: this.demandInfo.customerPhone
				}
				this.$httpApi.cooperationTalk(data).then(res => {
					this.getDemandInfo()
				})
			},
			feedBack() {
				if (this.demandInfo.feedbackStatus) {
					return
				}
				this.inquiryShow = true
			},
			navigation() {
				let {
					latitude,
					longitude
				} = this.demandInfo
				// 获取位置的经纬度
				uni.openLocation({
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					scale: 15
				})
			},
			// 编辑需求
			editOrder() {
				this.toPage(`/pages/demandMarket/releaseDemand?demandInfo=${JSON.stringify(this.demandInfo)}`)
			},
			clearCur() {
				// this.isCall = false
				// this.onBack = false //允许返回
			},
			submit(type) {
				this.form.consultationId = this.demandInfo.id
				this.form.cooperationUserId = this.demandInfo.customerId
				// 先判断上传是否完成，上传完成后的url才是网络路径
				// if (!this.$checkUploadProcess(this.fileJson)) {
				// 	return
				// }
				// 处理附件
				// let attachmentsFile = this.fileJson !== '' && JSON.parse(this.fileJson)
				// let fileAll = []
				// if (attachmentsFile) {
				// 	fileAll = [...attachmentsFile]
				// }
				// this.form.attachments = JSON.stringify(fileAll)

				this.$httpApi.cooperationInquiry(this.form).then(res => {
					if (res) {
						this.inquiryShow = false
						// this.isOpen = false
						this.$util.toast('反馈成功')
						this.getDemandInfo()
					}
				}).catch(e => {})
			},
			// 获取当前位置
			getLocation() {
				judgePermission('location', (res) => {
					if (res == 1) {
						uni.getLocation({
							type: 'gcj02',
							geocode: true,
							success: (res) => {
								if (this.demandInfo && this.demandInfo.longitude && this.demandInfo
									.latitude) {
									// 计算位置
									this.distance = this.$util.calculateDistance(res.longitude, res
										.latitude,
										this.demandInfo.longitude, this.demandInfo.latitude)
								}
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
							content: "定位失败,您未开启定位",
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
			//已找到确认
			confirm() {
				uni.showModal({
					title: '提示',
					content: '您确定找到合适的工人了吗?确认后将为您关闭此订单',
					success: res => {
						if (res.confirm) {
							this.$httpApi.demandConfirm(this.demandInfo.id).then(res => {
								this.$util.toast('已确认')
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
							})
						}
					}
				})
			},
			//聊一聊
			chat() {
				let name = this.demandInfo.customerName;
				let star = ''; //存放名字中间的*
				if (name !== '') {
					//名字是两位的就取姓名首位+*
					if (name.length <= 2) {
						name = name.substring(0, 1) + '*';
					} else {
						for (let i = 0; i < name.length - 2; i++) {
							star = '*' + star
						}
						name = name.substring(0, 1) + star + name.substring(name.length - 1, name.length);
					}
				}
				let confirmName = ''
				//如果已经实名就传真实的姓名过去
				if (this.demandInfo.customerRealStatus) {
					confirmName = this.demandInfo.customerName
				} else {
					confirmName = name
				}
				//如果未实名并且是电话号码
				if (this.$base.phoneRegular.test(this.demandInfo.customerName) && !this.demandInfo.customerRealStatus) {
					confirmName = this.demandInfo.customerName.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2")
				}
				this.$util.goToChat(this.demandInfo.customerId, confirmName, 'market', this.demandInfo.id, 0);
			},
			//联系业主
			contactBoss() {
				uni.makePhoneCall({
					phoneNumber: this.demandInfo.customerPhone,
					success: () => {}
				});
				this.saveCooperationTalk(2)
			},

			//取消需求
			confirmCancel() {
				this.$httpApi.demandCancel({
					id: this.demandInfo.id,
					reason: this.cancelReason
				}).then(res => {
					if (res) {
						this.$util.toast('已关闭')
						this.showPopup = true
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				})
			},
			radioValue(data, index) {
				this.cancelReason = data.label
				this.curIndex = index
				if (this.curIndex == this.cancelOrderReasonList.length - 1) {
					this.cancelReason = ''
				}
			},
			cancelOrder() {
				this.showPopup = true
				this.getCancelReason()
			},
			//取消订单的原因
			getCancelReason() {
				this.$httpApi.getDicType({
					type: 'demand_closed_cause'
				}).then(res => {
					if (res) {
						this.cancelOrderReasonList = res
						this.cancelReason = res[0].label //默认第一个
					}
				})
			},

			setTime(time) {
				return moment(time).format('lll')
			},
			close() {
				this.showPopup = false
			},
			getDemandInfo() {
				uni.showLoading()
				this.$httpApi.demandQureyById(this.optionId).then(res => {
					if (res) {
						let list = res.attachments && res.attachments !== '' && JSON.parse(res.attachments)
						if (list && list.length > 0) {
							res['imageList'] = JSON.stringify(list.filter(item => item.type == 'img' || item
								.type == 'video'))
							if (list.length > 0) {
								list.map(item => {
									if (item.timeLength) {
										res['voice'] = item
									}
								})
							}
						}
						this.demandInfo = res;
						this.distance = this.$util.calculateDistance(this.demandLocationInfo.longitude, this
							.demandLocationInfo.latitude, res.longitude, res.latitude)

						let obj = {
							width: 40,
							height: 40,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '/static/images/icon-address/address-4.png'
						};
						let arr = [];
						arr.push(obj);
						this.covers = arr
					}
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f9f9f9;
	}

	.nav-title {
		@include nav-bar-title($fontColor33)
	}

	.share-icon {
		width: 50rpx;
		height: 50rpx;
		margin-right: 40rpx;
	}

	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #303133;
		@include bov(2);
	}

	.feedback-view {
		width: 100%;
		border-radius: 0 0 10rpx 10rpx;
		background: #FFFFFF;
		position: fixed;
		top: calc(84rpx + var(--status-bar-height));
		border-top: 10rpx solid #f9f9f9;
		z-index: 99;

		.head-view {
			height: 122rpx;
			padding: 0 30rpx;

			.left {
				flex: 10;
				font-size: 28rpx;
				color: #FF5D35;
			}

			.right {
				flex: 1.5;

				.label {
					font-size: 14px;
					color: #606166;
				}

				.icon {
					width: 24rpx;
					height: 24rpx;
					margin-left: 4rpx;
					transition: all .2s;
				}
			}
		}

		.open-view {
			padding: 0 30rpx;
		}

		.form-item {
			.title {
				font-size: 28rpx;
				color: #303133;
			}

			.label {
				font-size: 28rpx;
				color: #606166;
				margin-right: 92rpx;
			}

			.radio-group {
				margin: 34rpx 0 54rpx;
			}
		}

		.feedback-btn {
			// width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 50rpx;

			.btn {
				width: 262rpx;
				line-height: 72rpx;
				text-align: center;
				font-size: 28rpx;
				color: $themeColor;
				border: 2rpx solid $themeColor;
				border-radius: 10rpx;
			}
		}

		@keyframes slide-down {
			0% {
				height: 0
			}

			;

			25% {
				height: calc(max-height*25%)
			}

			;

			50% {
				height: calc(max-height*50%)
			}

			;

			75% {
				height: calc(max-height*75%)
			}

			;

			100% {
				height: calc(max-height)
			}

			;
		}

		.select-open {
			height: max-height;
			animation: slide-down .2s ease-in;
			transition: .2s ease-in;
			transform-origin: 50% 0;
		}

		.select-close {
			height: 0;
			transform: scaleY(0);
			transition: .2s ease-out;
			transform-origin: top center;
		}
	}

	.top-view {
		padding: 46rpx 40rpx 24rpx;
		background: #FFFFFF;
		border-radius: 10rpx 10rpx 0 0;

		.time {
			margin-top: 8rpx;

			text {
				font-size: 24rpx;
				color: #909199;
				margin-right: 10rpx;
			}
		}

		.views {
			font-size: 24rpx;
			color: #909199;
			margin-right: 10rpx;
		}

		.persons-view {
			border-radius: 10rpx;

			.left-persons {
				padding-left: 13rpx;

				.avatars {
					.avatar {
						margin-left: -13rpx;
					}
				}

				.label {
					font-size: 24rpx;
					color: #3D3D3D;
				}
			}

			.right {
				font-size: 24rpx;
				color: #3D3D3D;
			}
		}
	}

	.fixed-view {
		width: 100%;
		position: fixed;
		top: calc(84rpx + var(--status-bar-height));
		// border-top: 10rpx solid #f5f5f5;
		z-index: 99;
	}

	.feedback-view2 {
		width: 100%;
		border-radius: 0 0 10rpx 10rpx;
		background: #FFFFFF;
		margin: 1rpx 0 8rpx;

		.head-view2 {
			padding: 0 30rpx 42rpx;

			.tips-view {
				padding: 24rpx 0 8rpx;

				.tips-icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 6rpx;
				}

				.tips {
					font-size: 28rpx;
					color: #3D3D3D;
				}
			}

			.left {
				flex: 10;
				font-size: 28rpx;
				color: #FF5D35;
			}

			.right {
				flex: 1.5;

				.label {
					font-size: 14px;
					color: #606166;
				}

				.icon {
					width: 24rpx;
					height: 24rpx;
					margin-left: 4rpx;
					transition: all .2s;
				}
			}
		}
	}

	.explain {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 22rpx 40rpx 36rpx;

		.upper {
			// padding: 0 32rpx;

			.remark {
				font-size: 28rpx;
				color: #666666;
				margin-top: 12rpx;
			}

			.img-con {
				margin-top: 24rpx;
			}
		}

		.lower {
			border-top: 2rpx solid #F6F6F6;
			margin-top: 40rpx;
			// padding: 0 32rpx;

			.title {
				margin-top: 40rpx;
			}

			.tel-view {
				margin-top: 12rpx;
				display: flex;
				align-items: center;

				.icon {
					width: 37rpx;
					height: 37rpx;
					margin-right: 8rpx;
				}

				.tel {
					width: 500rpx;
					font-size: 28rpx;
					color: #606166;
					@include bov(2)
				}

				.navigation-icon {
					width: 30rpx;
					height: 30rpx;
				}

				.navigation-text {
					font-size: 26rpx;
					color: $themeColor;
				}
			}

			.distance {
				font-size: 26rpx;
				color: $themeColor;
				margin-top: 40rpx;
			}

			.map {
				width: 100%;
				height: 222rpx;
				margin-top: 28rpx;
			}
		}
	}

	.person-con {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 22rpx 40rpx 36rpx;
		margin-top: 2rpx;

		.person-info {
			margin-top: 18rpx;

			.right-name {
				margin-left: 10rpx;

				.name {
					font-size: 30rpx;
					color: #303133;
				}

				.real-name {
					width: 84rpx;
					line-height: 36rpx;
					margin-left: 6rpx;
					text-align: center;
					background: rgba(47, 165, 255, 0.1);
					border-radius: 4rpx;
					font-size: 24rpx;
					color: $themeColor;
				}

				.no-real-name {
					width: 84rpx;
					line-height: 36rpx;
					margin-left: 6rpx;
					text-align: center;
					background: rgba(155, 155, 155, .1);
					border-radius: 4rpx;
					font-size: 24rpx;
					color: #909199;
				}

				.auth {
					width: 24rpx;
					height: 24rpx;
					margin-right: 6rpx;
				}

				.type {
					font-size: 24rpx;
					color: #606166;
				}
			}
		}
	}

	.service-rule {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 22rpx 40rpx 36rpx;
		margin-top: 2rpx;

		.title {
			margin-bottom: 10rpx;
		}

		.content {
			font-size: 26rpx;
			line-height: 36rpx;
			color: #606166;
		}
	}

	.recommend-view {
		.top {
			height: 110rpx;
			margin-left: 40rpx;
			display: flex;
			align-items: center;

			.icon {
				width: 33rpx;
				height: 34rpx;
				margin-right: 6rpx;
			}
		}
	}

	.btn_view {
		width: 100%;
		height: 180rpx;
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.btm-btn {
		width: 100%;
		height: 108rpx;
		padding: 20rpx 0;
		overflow: hidden;
		background: #FFFFFF;
		@include buttonsafearea();

		.button {
			width: 168rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			font-weight: bold;
			font-size: 28rpx;
			border-radius: 12rpx;
			margin: 8rpx;
		}

		.cancel {
			float: left;
			color: #808080;
			background: #FFFFFF;
			border: 2rpx solid #EBEBEB;
		}

		.confirm {
			float: left;
			background: $themeColor;
			color: #ffffff;
		}

		.edit {
			float: left;
			background: #FFFFFF;
			border: 2rpx solid $themeColor;
			color: $themeColor;
		}

		.left {
			float: right;
			width: 168rpx;
			text-align: center;

			// margin: 0 calc((100% - 256rpx - 330rpx)/8);
			// padding-left: 50rpx;
			.icon {
				display: inline-block;
				width: 40rpx;
				height: 40rpx;
			}

			.text {
				font-size: 28rpx;
				color: #303133;
			}

			.contact-boss {
				width: 100%;
				line-height: 84rpx;
				text-align: center;
				font-size: 28rpx;
				border-radius: 12rpx;
				color: #fff;
				background: $themeColor;
			}
		}

		.online {
			float: left;
			width: 260rpx;
			line-height: 84rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 12rpx;
			color: #3D3D3D;
			background: #eeeeee;
		}

		.contact-boss {
			float: left;
			width: 260rpx;
			line-height: 84rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 12rpx;
			color: #fff;
			background: $themeColor;
			margin-left: 20rpx;
		}
	}

	.mine-btm-btn {
		width: 100%;
		height: 108rpx;
		padding: 20rpx 0;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.button {
			width: 256rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			font-weight: bold;
			font-size: 28rpx;
			border-radius: 12rpx;
			margin: 8rpx;
		}

		.cancel {
			color: #808080;
			background: #FFFFFF;
			border: 2rpx solid #EBEBEB;

		}

		.confirm {
			background: $themeColor;
			color: #ffffff;
		}
	}

	.content-sku {
		height: 600rpx;
		position: relative;
		border: 2rpx solid #FF5D35;

		.content-main {
			height: calc(100% - 172rpx);
			// border: 2rpx solid red;


		}

		.confirm {
			width: 100%;
			padding: 40rpx;
			background: #FFFFFF;
			position: absolute;
			bottom: 70rpx;

			.btn {
				line-height: 88rpx;
				text-align: center;
				font-size: 28rpx;
				color: $themeColor;
				border: 2rpx solid $themeColor;
				border-radius: 10rpx;
			}
		}
	}

	.inquiry {
		width: 100%;
		// height: 950rpx;
		padding-top: 34rpx;
		background: #FFFFFF;
		border-top: 2rpx solid #F6F6F6;
		z-index: 999999;

		.file-contain {
			margin-top: 28rpx;
		}

		.form-item {
			.title {
				font-size: 30rpx;
				color: #303133;
			}

			.label {
				font-size: 28rpx;
				color: #303133;
			}

			.radio-group {
				margin: 40rpx 0 64rpx;
			}
		}

		.inquiry-item {
			height: 100%;
			text-align: center;

			.inquiry-icon {
				display: inline-block;
				width: 87rpx;
				height: 87rpx;
			}

			.agree {
				margin-top: 18rpx;
				font-size: 28rpx;
				color: #303133;
			}
		}
	}

	.submit-btn {
		width: 100%;
		margin-top: 50rpx;

		.btn {
			line-height: 88rpx;
			text-align: center;
			font-size: 28rpx;
			color: #FFFFFF;
			background: $themeColor;
			border-radius: 10rpx;
		}
	}


	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.align-end {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.display-left {
		display: flex;
		align-items: center;
	}

	.criteria-contian {
		height: 100%;
		background-color: #FFF;

		.tittle {
			text-align: center;
			padding: 36rpx 0rpx;
			margin: 0 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			color: $seconFontColor;
			font-weight: bold;
		}

		.list-contain {
			height: calc(100% - 370rpx);
			padding: 40rpx;
		}

		.scroll-Y {
			height: 100%;
		}

		.content-main_res {
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			.radio {
				width: 25rpx;
				height: 25rpx;
				border-radius: 50%;
				border: 2rpx solid #bdbdbd;
				margin-right: 30rpx;
			}

			.radioSelect {
				width: 25rpx;
				height: 25rpx;
				border: 2rpx solid $themeColor;
				// background: $themeColor;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					width: 15rpx;
					height: 15rpx;
					border-radius: 50%;
					background: $themeColor;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}

			.reason {
				color: #141414;
				font-size: 26rpx;
			}
		}


		.item-button-contain {
			position: fixed;
			display: flex;
			justify-content: center;
			width: 100%;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.item-button {
				position: relative;
				width: 624rpx;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				color: #002FA5;
				font-size: 24rpx;
				border: 2rpx solid #002FA5;
				border-radius: 10rpx;
				bottom: 20rpx;
			}
		}
	}
</style>
