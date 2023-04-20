<template>
	<view class="assign">
		<z-nav-bar>
			<view slot="default" class="nav-bar">
				我有事要交办
			</view>
		</z-nav-bar>
		<form>
			<view class="uni-form-item uni-column">
				<textarea v-model="formData.comment"
					style="padding:6px 9px;border-radius: 8rpx;background: #F7F7F7;width: 100%;height:200rpx;font-size:28rpx"
					placeholder="你想要交代什么事情~~" placeholder-style="color:#909199;font-size: 13px" />
			</view>
			<view class="uni-form-item uni-column">
				<image-upload-new v-model="formData.uplodIamge" count="9" />
			</view>
			<view class="uni-form-item uni-column">
				<sound-recording style="width:100%" @chooseVoice="chooseVoice" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-form_row" @click="()=>showService=true">
					<view class="uni-form_row_flex">
						<view class="uni-form-flex_title">服务</view>
						<view v-if="formData.projectName">{{ formData.projectName }}</view>
						<view v-else class="uni-form_row-title">请选择服务</view>
					</view>
					<u-icon name="arrow-right" size="22" class="arrow"></u-icon>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-form_row" @click="()=>showTrem=true">
					<view class="uni-form_row_flex">
						<view  class="uni-form-flex_title">交办对象</view>
						<view class="uni-form-flex_content" v-if="formData.userNames && formData.userNames.length">{{ formData.userNames.join(',') }}
						</view>
						<view v-else class="uni-form_row-title">请选择交办对象</view>
					</view>
					<u-icon name="arrow-right" size="22" class="arrow"></u-icon>
				</view>
			</view>
		</form>
		<bottom-button title="提交" @click="save"></bottom-button>

		<!-- 服务选择 -->
		<u-select v-model="showService" :list="projectList" @confirm="confirm" value-name="projectId"
			label-name="projectName"></u-select>
		<!-- 团队成员 -->
		<u-popup v-model="showTrem" mode="bottom" height="50%" :safe-area-inset-bottom="true">
			<view class="trem">
				<view class="trem-top">
					<text class="cancel" @click="()=>showTrem=false">取消</text>
					<text class="confirm" @click="confirmTrem">确认</text>
				</view>
				<view class="trem-content">
					<view class="trem-content_item" v-for="(item,index) in teamList" :key="index">
						<u-checkbox class="checkbox" style="width: 40rpx; height: 40rpx;" @change="selectTrem(item)"
							v-model="item.isBatch">
						</u-checkbox>
						<text>{{item.name}}({{item.skillName}})</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				formData: {
					attachments: [],
					userNames: [],
					pendingUsers: [],
					projectName: '',
					businessCode: 'custom_',
					title:'向您发起了一项交办，请尽快处理'
				},
				showService: false,
				showTrem: false,
				audioList: [],
				options: {},
				projectList: [],
				teamList: [],
				curArr: []
			}
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			this.getProjectList()
		},
		methods: {
			save() {
				if(!this.formData.projectName){
					this.$util.toast("请选择服务后，在选择交办对象");
					return false;
				}
				if(this.formData.pendingUsers.length === 0){
					this.$util.toast("请选择交办对象");
					return false;
				}
				// 判断是否有文件
				if (this.formData.uplodIamge) {
					this.formData.attachments = JSON.parse(this.formData.uplodIamge);
				}
				if (this.audioList && this.audioList.length) {
					this.formData.attachments = this.formData.attachments ?
						this.formData.attachments.concat(this.audioList) : this.audioList;
				}
				uni.showLoading({
					title: '保存中',
					mask: true
				});
				this.$httpApi.addMyTodoPending(this.formData)
					.then(res => {
						if (res) {
							this.$util.toast("保存成功");
							uni.$emit('tabsLocation', 1);
							uni.navigateBack();
						}
					}).finally(() => {
						uni.hideLoading();
					})
			},
			// 获取音频
			async chooseVoice(file, flag) {
				if (file.path != '{}') {
					let temp = [{
						type: 'audio',
						timeLength: file.duration,
						url: await this.$CommonUpload(file.path)
					}]
					this.audioList = temp;
				}
				if (flag) {
					this.audioList = [];
				}
			},
			// 根据地址获取项目
			getProjectList() {
				this.$httpApi.getProjectsByAddressId(this.options.addressId)
					.then(res => {
						this.projectList = res;
						res.map(item => {
							item.projectName = item.projectName + ' ' + item.created.split(' ')[0]
						})
						res.some(v=>{
							if(v.projectId == this.options.projectId){
								this.formData.projectId = v.projectId;
								this.formData.projectName = v.projectName
								this.getTeamList(v.projectId);
								return true;
							}
						})
					})
			},
			// 根据项目获取团队成员
			getTeamList(id) {
				this.$httpApi.getProjectsTeam({
					projectId: id
				}).then(res => {
					this.teamList = res;
				})
			},
			confirm(e) {
				if (e) {
					this.formData.projectId = e[0].value;
					this.formData.projectName = e[0].label;
					if(e[0].value){
						this.getTeamList(this.formData.projectId);
					}
				}
			},
			selectTrem(data) {
				let repeatArr = []; //重复元素计算
				this.curArr.push(data);
				for (var i = 0; i < this.curArr.length; i++) {
					if (this.curArr[i].id == data.id) {
						repeatArr.push(data)
					}
				}
				if ((repeatArr.length) % 2 === 0) {
					for (var i = 0; i < this.curArr.length; i++) {
						if (this.curArr[i].id == data.id) {
							this.curArr.splice(i, 1);
							i--
						}
					}
				} else {
					this.curArr = Array.from(new Set(this.curArr))
				}
			},
			// 确认操作
			confirmTrem() {
				let pendingUsers = [];
				let userNames = [];
				this.curArr.some(v => {
					let obj = {}
					obj.handlePersonId = v.personId;
					obj.handlePersonName = v.name;
					obj.handleSkillId = v.skillId;
					obj.handleSkillName = v.skillName;
					obj.handleUserId = v.userId;
					pendingUsers.push(obj);
					userNames.push(v.name);
				})
				this.formData.pendingUsers = pendingUsers
				this.formData.userNames = Array.from(new Set(userNames));
				this.showTrem = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.assign {
		padding: 0 30rpx;
	}

	.nav-bar {
		@include nav-bar-title(#000000);
	}

	.uni-form-item {
		margin-bottom: 30rpx;

		&:first-child {
			margin-top: 10rpx;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.uni-form_row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #F7F7F7;
			border-radius: 8rpx;
			padding: 20rpx;

			.arrow {
				margin-left: 10rpx;
			}

			.uni-form_row_flex {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.uni-form-flex_title{
					font-weight: bold;
					width: 140rpx;
					flex-shrink: 0;
				}
				.uni-form-flex_content{
					width: 450rpx;
					text-align: right;
					@include toe();
				}
				view {
					font-size: 28rpx;
					color: #000000;
				}

				.uni-form_row-title {
					color: #A8A8A8;
				}
			}
		}
	}

	.trem {
		padding: 20rpx 30rpx;
		height: 100%;
		box-sizing: border-box;

		.trem-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 60rpx;

			.cancel {
				color: #606266;
			}

			.confirm {
				color: #2979EE;
			}
		}

		.trem-content {
			height: calc(100% - 60rpx);
			overflow-y: auto;

			.trem-content_item {
				display: flex;
				align-items: center;
				padding: 10rpx 0;

				.checkbox {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
