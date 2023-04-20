<style lang="scss" scoped>
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 900;
		font-size: 36rpx;
		line-height: 50rpx;
		text-align: center;
		color: $darkTitle;
	}

	.right-record {
		font-size: $smallFontSize;
		color: $fontColor99;
		margin-right: 30rpx;
	}

	.add {
		width: 40rpx;
		height: 40rpx;
	}

	.no-list-image {
		width: 160rpx;
		height: 132rpx;
	}

	.log-contain {
		margin: 10rpx 20rpx;
		border-radius: 10rpx;

		.item-form-contian {
			background-color: #fff;
			// border-radius: 10rpx;
			padding: 34rpx 30rpx 0rpx 30rpx;

			.item-label {
				color: #303133;
				font-size: 28rpx;
				line-height: 38rpx;
				font-weight: bold;
			}

		}
	}


	/deep/ .u-input__input {
		color: #303133;
	}

	.item-value {
		margin-top: 12rpx;
		background-color: #F6F7F9;
		border-radius: 10rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 26rpx;
		flex: 1;
	}

	.desc-contain {
		padding: 20rpx 30rpx 30rpx;
		// margin: 10rpx 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.title-desc {
			font-size: $middleFontSize;
			color: $seconFontColor;
			margin-bottom: 24rpx;
			font-weight: bold;
		}

		.describe-input {
			border: 0rpx;
		}

		.public-item-bottom {
			background: #F6F7F9;
			border-radius: 5px;
			margin-top: 16rpx;
		}
	}

	.voice-contain {
		background: #FFFFFF;
		padding: 20rpx 30rpx 30rpx;
	}

	.construction-contain {
		border-radius: 10rpx;
		background-color: #fff;
		margin: 0rpx 20rpx 20rpx 20rpx;
		padding: 30rpx;

		.top {
			display: flex;
			justify-content: space-between;
			margin-bottom: 28rpx;

			.name {
				font-size: 28rpx;
				color: #303133;
				font-weight: bold;
			}
		}

		.tips {
			font-size: 26rpx;
			font-weight: normal;
			line-height: 38rpx;
			letter-spacing: 0px;
			color: #303133;
		}

		.no-list {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 32rpx 0rpx 64rpx 0rpx;

			text {
				color: #909199;
				font-size: 26rpx;
			}
		}

		.icon-delete {
			width: 32rpx;
			height: 32rpx;
		}

		.list-data {
			padding-top: 20rpx;

			.item-data {
				margin-bottom: 20rpx;
			}

			.data-top {
				display: flex;
				align-items: center;
				margin-bottom: 22rpx;

				text {
					margin-right: 16rpx;
				}

				image {
					margin-left: 16rpx;
				}
			}
		}


	}
</style>


<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">{{title}}</view>
			<view slot="right" class="right-record " v-if="option.type == '订单列表' " @click="seeRecord">{{recordTitle}}
			</view>
		</z-nav-bar>
		<view class="log-contain">
			<view class="item-form-contian">
				<text class="item-label">日志标题</text>
				<view class="item-value">
					<u-input placeholder="日志标题" placeholder-style="color:#909199" height="52" v-model="form.productDesc"
						:clearable="false" type="text" :border="false" />
				</view>
			</view>

			<view class="desc-contain">
				<view class="title-desc">备注</view>
				<view class="public-item-bottom">
					<u-input v-model="form.desc" class="describe-input" maxlength="200" height="140" type="textarea"
						placeholder="请输入备注" :border="true" />
				</view>
			</view>
			<view class="voice-contain" @click="isShowButton = false">
				<sound-recording @chooseVoice="chooseVoice" @close="isShowButton = true" />
			</view>
		</view>

		<view class="construction-contain">
			<view class="top">
				<text class="name">现场施工照片</text>
				<image class="add" src="@/static/images/add-new.png" @click="add()" mode=""></image>
			</view>
			<view class="tips">
				请按照项目提示要求拍照。每次日志拍照数量不得少于5张。给验收现场拍照是按标准施工的直接证明，便于界定责任、减少扯皮，也可获得职分快速升级
			</view>
			<view class="no-list" v-if="dataList.length == 0">
				<image class="no-list-image" src="@/static/images/no_order_2.png" mode=""></image>
				<text>点击右上角+号开始添加图片</text>
			</view>
			<view class="list-data" v-else>
				<view class="item-data" v-for="(item,index) in dataList" :key="index">
					<view class="data-top">
						<text>{{index + 1}}.</text>
						<view class="item-value">
							<u-input placeholder="请输入标题" placeholder-style="color:#909199" height="52"
								v-model="item.name" :clearable="false" type="text" :border="false" />
						</view>
						<image class="icon-delete" src="@/static/images/delete_icon/delete_3.png" mode=""
							@click="deleteData(index)"></image>
					</view>
					<view class="file-contain">
						<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
							:uploadType="uploadType" :count="9" v-model="item.pic" />
					</view>
				</view>
			</view>
		</view>
		<!-- pages/orderReceiving/constructionForm -->
		<!-- <view class="desc-contain">
			<view class="item-attachment">
				<view class="title-desc">上传图片</view>
				<view class="file-contain">
					<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo"
						:uploadType="uploadType" :count="9" v-model="form.pic" />
				</view>
				<view class="voice-contain" @click="isShowButton = false">
					<sound-recording @chooseVoice="chooseVoice" @close="isShowButton = true" />
				</view>
			</view>
			<view class="title-desc">备注内容</view>
			<view class="public-item-bottom">
				<u-input v-model="form.desc" class="describe-input" maxlength="200" height="140" type="textarea"
					placeholder="请输入备注" :border="true" />
			</view>
		</view> -->


		<bottom-button v-if="isShowButton" title="确认提交" @click="submit()"></bottom-button>
	</view>

</template>

<script>
	import {
		CommonUpload
	} from '@/plugins/uploadPic.js';
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				orderDetails: {},
				isShowButton: true,
				uploadType: ['图片'],
				option: '',
				title: '开始施工',
				recordTitle: '服务记录',
				waterAddress: '',
				waterUserInfo: '',
				dataList: [],
				form: {
					detailList: [],
					personId: '',
					address: '',
					orderId: '',
					audio: '',
					desc: '',
					pic: '',
					skillName: '',
					projectId: 0,
					status: 'CONSTRUCTION'
				}
			}
		},
		onLoad(option) {
			this.option = option
			const eventChannel = this.getOpenerEventChannel();
			this.getLocaltion();
			eventChannel.on('orderDetails', (data) => {
				this.option['type'] = data.type
				this.orderDetails = data.orderDetails
				let info = this.orderDetails && this.orderDetails.bizOrderOffer;
				if (data.title) {
					this.title = data.title
				}
				if (info) {
					this.form.skillName = info.skillName;
					this.form.personId = info.personId
				}
				this.setPersonId()
			});
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'nodeInfo', 'userRole', 'userPersonInfo', 'remainingDays']),
		},
		methods: {
			//得到当前位置
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (data) => {
						this.waterAddress = data.address ? data.address.city + data.address.district + data
							.address.street + data.address.streetNum + data.address.poiName : ''
					}
				})
			},
			setPersonId() {
				if (this.option.type == '订单列表') {
					// let persons = uni.getStorageSync('userData').persons
					// let tempPerson = persons.find(item => item.skillId == this.orderDetails.skillId)
					// if (tempPerson) {
					// 	this.form.skillName = tempPerson.skillName;
					// 	this.form.personId = tempPerson.personId
					// }
					this.$httpApi.getPersonSettingInfo().then(res => {
						if (res) {
							let user = res.personageList.find(item => item.skillId == this.orderDetails.skillId)
							if (user) {
								this.form.skillName = user.skillName;
								this.form.personId = user.personId
							}
							this.waterUserInfo = res.realName + "（" + this.orderDetails.skillName + "）";
						}
					})
				} else {
					this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;
				}
			},
			seeRecord() {
				this.toPage(
					`/pages/orderReceiving/constructionRecord?orderId=${this.orderDetails.id}&personId=${this.form.personId}`
				)
			},
			async chooseVoice(file) {
				this.isShowButton = true
				let audioFile = {
					type: 'audio',
					url: '',
					timeLength: ''
				}
				if (file.duration > 0 && file.path) {
					audioFile.url = await CommonUpload(file.path)
					audioFile.timeLength = file.duration
					this.form.audio = JSON.stringify(audioFile)
				}
			},
			add() {
				this.dataList.push({
					name: '',
					pic: '[]',
					status: 1
				})
			},
			deleteData(index) {
				this.dataList.splice(index, 1)
			},
			submit() {
				// 如果有图片、语音，则备注不用必填
				// if (this.$remarksVerification(this.form, '备注')) {
				// 	return
				// }
				
				if(!this.form.productDesc){
					this.$util.toast(`日志标题不能为空`);
					return
				}
				
				if(!this.form.desc){
					this.$util.toast('请输入备注')
					return
				}
				
				let tempsStatus = true
				if (this.dataList.length > 0) {
					try {
						this.dataList.forEach((el, index) => {
							if (!el.name) {
								throw index
							}
						})
					} catch (e) {
						tempsStatus = false
						this.$util.toast(`第${e+1}项标题不能为空`);
					}
				}
				if(!tempsStatus){
					return
				}
				this.form.address = this.orderDetails.latAddress;
				this.form.orderCode = this.orderDetails.orderCode;
				this.form.orderId = Number(this.orderDetails.id);
				this.form.status = this.orderDetails.workStatus == 0 ? 1 :
					2; //status==1开工status==2完工 workStatus==0未开工 workStatus==1开工
				this.form.detailList = this.dataList
				this.$httpApi.constructionSave(this.form).then(res => {
					if (res) {
						uni.hideLoading()
						uni.showToast({
							title: '操作成功~',
							icon: 'none'
						});
						setTimeout(() => {
							this.goBack()
						}, 1000)
					}
				})
			}
		}
	}
</script>
