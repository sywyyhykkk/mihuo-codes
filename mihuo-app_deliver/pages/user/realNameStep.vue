<template>
	<view>
		<view class="page_bg">
			<view class="nav_custom">
				<image class="back_arrow" src="/static/icon/arrow_back.png" @click="goBack"></image>
				实名认证
			</view>
			<!-- 开通账户流程组件 -->
			<view style="margin-bottom: 250rpx;">
				<account-step />
			</view>
			
			<view class="picTitle">
				<view class="title">
					<test class="Required">*</test>身份证照片
				</view>
				<view class="info">身份证信息我们会严格保密</view>
				<u-row gutter="20" justify="space-between" class="picContent">
					<u-col span="6" @click='faceImages'>
						<view class="picChoose">
							<image class="choose_images" :src="faceUrl || '/static/images/choose_images.png'" />
							<view class="grid-text">点击上传人像面</view>
						</view>
					</u-col>
					<u-col span="6" @click='emblemImages'>
						<view class="picChoose">
							<image class="choose_images" :src="emblemUrl || '/static/images/choose_images.png'" />
							<view class="grid-text">点击上传国徽面</view>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<view class="inp_view">
			<view class="inputItem">
				<view class="title">真实姓名</view>
				<view class="info"><input type="text" placeholder="请输入您的真实姓名" v-model="name" @input="changeValue" /></view>
			</view>
			<view class="inputItem">
				<view class="title">身份证号</view>
				<view class="info">
					<input type="text" placeholder="请输入您的身份证号" v-model="codeID" @input="changeValue" />
				</view>
			</view>
			<!-- <view class="inputItem">
				<view class="title">性别</view>
				<view class="info"><input type="text" disabled placeholder="请输入您的性别" v-model="gender" /></view>
			</view> -->
		</view>
		
		<view class='btnContent'>
			<button class="button" :disabled="btnDisabled" @click="onSubmit"
				:style="!btnDisabled?{'background':$styleColor.themeColor}:''">
				下一步
			</button>
		</view>
	</view>
</template>

<script>
	var clear;
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		CommonUpload,
		imageRecogn
	} from '@/plugins/uploadPic.js'
	import {
		styleColor
	} from "@/style/mixin.js"
	// #ifdef H5
	import {
		publicShare
	} from '@/plugins/utils.js';
	// #endif
	export default {
		data() {
			return {
				loading: false,
				themeColor: styleColor.themeColor,
				btnDisabled: true,
				logoUrl: '',
				faceUrl: '',
				emblemUrl: '',
				readonly: false,
				codeIDText: '获取验证码',
				name: '',
				codeID: '',
				randomTimer: null,
				temName: '',
				temCodeID: '',
				gender: '',
			};
		},
		// 第一次加载
		onLoad(e) {
			this.logoUrl = this.$base.logoUrl;
		},
		computed: {
			...mapState(['userInfo', 'chatScenesInfo'])
		},
		// 页面显示
		onShow() {},
		// 方法
		methods: {
			...mapMutations(['setUserInfo']),
			
			changeValue() {
				if (this.name && this.codeID && this.faceUrl && this.emblemUrl) {
					this.btnDisabled = false
				}else{
					this.btnDisabled = true
				}
			},
			//图片的获取
			faceImages() {
				uni.chooseImage({
					count: 1, //默认9
					success: async (res) => {
						const data = await imageRecogn(res.tempFilePaths[0], 'idcard');
						if (data) {
							if (data.idcard_number_type === -1) {
								this.$util.toast('请提供正确的身份证图片')
								return
							} else {
								this.faceUrl = res.tempFilePaths[0]
								this.changeValue()
							}
							console.log(data.words_result)
							for (let key in data.words_result) {
								if (key === '姓名') {
									this.name = this.temName = data.words_result[key].words
								}
								if (key === '公民身份号码') {
									this.codeID = this.temCodeID = data.words_result[key].words
								}
								// if (key === '性别') {
								// 	this.gender = data.words_result[key].words
								// }
							}
						}
					},
					fail: (err) => {
						console.log(err)
					}
				});
			},
			emblemImages() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: async (res) => {
						const data = await imageRecogn(res.tempFilePaths[0], 'idcard');
						if (data) {
							if (data.idcard_number_type === -1) {
								this.$util.toast('请提供正确的身份证图片')
								return
							} else {
								this.emblemUrl = res.tempFilePaths[0]
								this.changeValue()
							}
						}
					}
				});
			},
			analyzeIDCard(IDCard){
			    //获取出生年月日
			    let yearBirth = IDCard.substring(6,10);
			    let monthBirth = IDCard.substring(10,12);
			    let dayBirth = IDCard.substring(12,14);
			    //获取当前年月日并计算年龄
			    let myDate = new Date();
			    let monthNow = myDate.getMonth() + 1;
			    let dayNow = myDate.getDate();
			    let age = myDate.getFullYear() - yearBirth;
			    if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
			        age--;
			    }
			    if (age >= 18) return true;
			    return false;
			},
			// 账号绑定
			async onSubmit() {
				if (!this.faceUrl || !this.emblemUrl) {
					uni.showToast({
						title: '请上传您的身份证信息',
						icon: 'none'
					});
					return;
				}
				if (this.name == '') {
					uni.showToast({
						title: '请输入您的姓名',
						icon: 'none'
					});
					return;
				}
				if (this.codeID == '') {
					uni.showToast({
						title: '请输入您的身份证号码',
						icon: 'none'
					});
					return;
				}
				if (this.name !== this.temName) {
					uni.showToast({
						title: '输入的姓名与身份证上的不匹配',
						icon: 'none'
					});
					return;
				}
				if (this.codeID !== this.temCodeID) {
					uni.showToast({
						title: '输入的身份证号码与身份证上的不匹配',
						icon: 'none'
					});
					return;
				}
				if(!this.analyzeIDCard(this.codeID)){
					uni.showToast({
						title: '未满18岁，认证失败',
						icon: 'none'
					});
					return
				}
				uni.showLoading({
					title: '加载中',
					duration: 5000
				})
				let faceUrl = await CommonUpload(this.faceUrl);
				let emblemUrl = await CommonUpload(this.emblemUrl);
				if (!faceUrl) {
					this.faceUrl = ''
					this.$util.toast('图片上传失败, 请重新上传~')
					return
				}
				if (!emblemUrl) {
					this.emblemUrl = ''
					this.$util.toast('图片上传失败, 请重新上传~')
					return
				}
				let httpData = {
					name: this.name,
					idcardNo: this.codeID,
				};
				clearTimeout(this.randomTimer)
				this.randomTimer = setTimeout(() => {
					this.$httpApi.paymentAccountRealName(httpData).then(res => {
						if (res) {
							uni.showModal({
								title: '提示',
								content: '已提交',
								showCancel: false,
								success: res => {
									if (res.confirm) {
										this.toPage("/pages/user/bindCardStep")
									}
								}
							});
						}
					}).catch(err => console.log(err))
				}, 1000)
			},
			
			goBack(){
				uni.switchTab({
					url:'/pages/mine/personalCenter'
				})
			}
		},
		//不让返回上一个页面
		onBackPress() {
			uni.switchTab({
				url:'/pages/mine/personalCenter'
			})
			return true;
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
		//页面下来刷新
		onPullDownRefresh() {},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.wxShare();
		}
	};
</script>
<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.page_bg{
		padding-top: var(--status-bar-height);
		background: linear-gradient(180deg, rgba(7,59,188,.1) 0%, rgba(201, 217, 255, .1) 100%);
		.nav_custom{
			height: 48px;
			font-size: 36rpx;
			color: $fontColor33;
			text-align: center;
			line-height: 96rpx;
			position: fixed;
			position: relative;
			.back_arrow{
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				left: 34rpx;
				top: 24rpx;
			}
		}
	}
	.Required {
		color: $themeColor;
	}

	.picContent {
		margin: 20rpx 0;
	}

	.bindAccountBox {
		height: 283rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.picChoose {
		border: 1px solid #f5f5f5;
		border-radius: 10rpx;
		padding: 20rpx 10rpx;
		text-align: center;
		.choose_images{
			margin: 0 auto;
			width: 160rpx;
			height: 115rpx;
		}
	}

	.grid-text {
		font-size: 28rpx;
		color: #666;
		margin-top: 20rpx;
	}

	.btnContent {
		margin: 248rpx 64rpx 64rpx 64rpx;
		text-align: center;

		.button {
			width: 624rpx;
			line-height: 88rpx;
			display: inline-block;
			color: #FFFFFF;
			background: #DCDBE0;
			font-size: $middleFontSize;
			border-radius: $miniBorderRadius;
		}
	}

	.picTitle {
		background-color: #fff;
		margin: 0 20rpx;
		padding: 20rpx;
		border-radius: $miniBorderRadius;

		.title {
			font-size: 32rpx;
			color: $fontColor33;
		}

		.info {
			font-size: 28rpx;
			color: $fontColor99;
		}
	}

	.bindAccountBox>image {
		width: 95rpx;
		height: 95rpx;
		border-radius: 15rpx;
	}

	.bindAccountBox>view {
		width: 95rpx;
		height: 95rpx;
		padding: 0rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.bindAccountBox>view image {
		width: 100%;
		height: 40rpx;
	}

	.bindAccountBut {
		margin-top: 60rpx;
	}

	.registeredBut {
		margin-bottom: 30rpx;
		padding: 0rpx 20rpx;
	}

	.registeredBut button {
		font-size: 36rpx;
		border-radius: 3rpx;
		text-align: center;
		line-height: 90rpx;
		height: 90rpx;
		background-color: $themeColor;
		color: #fff;
	}
	
	.inp_view{
		margin: 10rpx 20rpx;
		
	}
	.inp_view :first-of-type{
		border-radius: 10rpx 10rpx 0 0;
	}
	.inp_view :last-of-type{
		border-radius:  0 0 10rpx 10rpx;
	}

	.inputItem {
		background-color: #fff;
		display: flex;
		padding: 0 25rpx;
		margin-top: 2rpx;
	}

	.inputItem .title {
		min-width: 190rpx;
		height: 100rpx;
		line-height: 100rpx;
		flex-shrink: 0;
		font-size: 30rpx;
		white-space: nowrap;
	}

	.inputItem .info {
		flex: 1;
		display: flex;
		align-items: center;
		color: #999;
	}

	.inputItem .info input {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		width: 100%;
	}

	.inputItem .info button {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		flex-shrink: 0;
		padding: 0 15rpx;
		border: 1rpx solid $themeColor;
		background-color: #fff;
		color: $themeColor;
	}
</style>
