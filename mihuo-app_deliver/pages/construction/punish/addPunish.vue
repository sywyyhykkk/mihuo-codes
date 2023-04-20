<template>
	<view>
		<public-module></public-module>
		<view class="content">
			<form>
				<view>
					<column-selection class="select_staff" :styleObj='selectStyleObj' v-model="punishedPerson" />
				</view>
				<view class="punish_reason">
					<view class="align-center">
						<text class="label">处罚原因</text>
						<image class="punish_menu" src="../../../static/icon/punish_menu.png" mode="aspectFill"
							@click="toExistingProblems"></image>
					</view>
					<textarea placeholder-style="color:#909199" placeholder="请输入处罚原因" style="width: 100%;
						height: 64rpx;font-size: 26rpx;margin-top: 10rpx;" v-model="form.reason" />
				</view>

				<punish-item :styleObj='styleObj' @removePunish="removePunish" :deleteIconShow="true"
					v-model="form.forfeitLogAddDTOList" />

				<view class="upload">
					<text class="label">上传图片</text>
					<view class="upload_img">
						<image-upload-new :uploadType="uploadType" v-model="form.pics" />
					</view>
					<sound-recording @chooseVoice="chooseVoice" />
				</view>

				<view class="punish_time align-center">
					<text class="label">罚款时间</text>
					<view class="time">{{form.createBy}}</view>
				</view>

				<mihuo-bottom-button :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>

			</form>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";
	import {
		debounce
	} from "@/plugins/utils.js"
	export default {
		data() {
			return {
				uploadType: ['图片', '视频'],
				styleObj: {
					fontSize: '26rpx',
					label: '存在问题'
				},
				selectStyleObj: {
					fontSize: '26rpx',
					label: '处罚对象',
					selectInfo: '请选择处罚人员'
				},
				punishData: {
					forfeitLogAddDTOList: []
				},
				chooseVoiceObject: {},
				punishedPerson: '',
				skillId: '',
				buttonList: [{
					name: '确定',
					status: true
				}],
				form: {
					projectAddress: '',
					dealPersonId: '',
					createBy: moment().format('YYYY-MM-DD HH:mm:ss'),
					projectId: '',
					personId: '',
					userId: '',
					forfeitLogAddDTOList: [],
					audio: "",
					pics: "",
					reason: ""
				}
			}
		},
		onShow() {
			this.setParameter()
			this.getPunishData();
			uni.$on('checkList', (data) => {
				let list = data ? JSON.parse(data) : [];
				this.punishedPerson = list[0].name;
				this.form.personId = Number(list[0].personId);
				this.form.userId = Number(list[0].userId);
				this.skillId = list[0].skillId
			})
		},
		onUnload() {
			uni.$off('checkList')
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userPersonInfo'])
		},
		methods: {
			setParameter() {
				this.form.dealPersonId = Number(this.userPersonInfo.personId)
				this.form.projectId = Number(this.projectInfo.projectId)
				this.form.projectAddress = this.projectInfo.address
			},
			removePunish(index) {
				let newList = this.form.forfeitLogAddDTOList;
				newList = [
					...newList.slice(0, index),
					...newList.slice(index + 1, newList.length)
				];
				this.form.forfeitLogAddDTOList = newList;
				this.punishData = this.form
			},
			//获取罚款数据
			getPunishData() {
				this.form.forfeitLogAddDTOList = this.punishData.forfeitLogAddDTOList
			},
			submit() {
				this.debounce(() => {
					this.addPunish()
				}, 200)
			},
			async addPunish() {
				if (!this.punishedPerson.length) {
					return this.$util.toast("请选择处罚对象");
				};
				if (this.form.reason === '') {
					return this.$util.toast("请输入处罚原因");
				};
				if (!this.form.forfeitLogAddDTOList.length) {
					return this.$util.toast("请选择处罚规则");
				};
				if (!this.$checkUploadProcess(this.form.pics)) {
					return;
				}

				//处罚明细
				let list = this.form.forfeitLogAddDTOList,
					temPunishList = [];
				if (list && list.length) {
					//添加罚款规则返回后处理数据
					for (let j = 0; j < list.length; j++) {
						temPunishList.push({
							companyId: Number(this.orderInfo.companyId),
							ruleId: Number(list[j].ruleId),
							day: list[j].forbidDay,
							integral: list[j].points || list[j].integral,
							money: list[j].money,
							content: list[j].content,
							ruleType: list[j].ruleType,
							ruleCode: list[j].ruleCode,
							name: list[j].name,
							isCustom: list[j].isCustom ? list[j].isCustom : 0

						})
					}
					this.form.forfeitLogAddDTOList = temPunishList
				}

				// 音频
				let audioFile = {};
				if (this.chooseVoiceObject.path) {
					audioFile = {
						url: 'audio',
						url: await CommonUpload(this.chooseVoiceObject.path),
						timeLength: this.chooseVoiceObject.duration
					}
					this.form.audio = JSON.stringify(audioFile)
				}
				this.$http.post("order/bizorderforfeit/save", this.form).then(res => {
					this.$util.toast("提交成功");
					setTimeout(() => {
						uni.navigateBack()
					}, 100)
				}).catch(err => {
					console.log(err)
				})
			},
			toExistingProblems() {
				if (!this.form.personId && this.skillId === '') {
					this.$util.toast("请先选择处罚人员");
					return
				}
				uni.navigateTo({
					url: `/pages/construction/punish/existingProblems?punishListItem=${JSON.stringify(this.punishData)}&skillId=${this.skillId}`
				})
			},
			chooseVoice(file) {
				this.chooseVoiceObject = file
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.content {
		margin: 12rpx 20rpx;
	}

	.select_staff {
		height: 114rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx 44rpx;
	}

	.punish_reason {
		height: 195rpx;
		padding: 39rpx 28rpx 0 44rpx;
		margin-top: 2rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.punish_menu {
			width: 21px;
			height: 14px;
		}
	}

	.problems {
		// height: 604rpx;
		margin-top: 2rpx;
		padding: 31rpx 44rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
	}

	.upload {
		margin-top: 10rpx;
		padding: 22rpx 44rpx 32rpx;
		// height: 328rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.upload_img {
			margin: 22rpx 0;
		}
	}

	.punish_time {
		height: 113rpx;
		margin-top: 2rpx;
		padding: 0 34rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.label {
			flex: 1;
		}

		.time {
			flex: 1;
			font-size: 26rpx;
			color: #909199;
		}
	}

	.label {
		font-size: 26rpx;
		font-weight: bold;
		color: #46464E;
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.align-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
