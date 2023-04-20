<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<form-cache-item ref="formCacheItem" :cacheId="form.projectId" @recovery="cacheForm('recovery')">
		</form-cache-item>

		<mihuo-order-information :projectId="projectId"></mihuo-order-information>
		<view class="release">
			<form>
				<view class="bg_fff">
					<view class="top_nav">
						<text class="label">巡检标题</text>
					</view>
					<view class="inp_box">
						<input placeholder-style="color:#909199" placeholder="请输入标题" style="width: 100%;
							height: 64rpx;font-size: 25rpx;" v-model="form.title" />
					</view>
					<view class="top_nav">
						<text class="label">巡检描述</text>
					</view>
					<view class="textarea_box">
						<textarea placeholder-style="color:#909199" placeholder="请输入问题描述" style="width: 100%;
							height: 166rpx;padding: 24rpx 26rpx;box-sizing: border-box;background: #F7F7F7;
							border-radius: 10rpx;font-size: 25rpx;" v-model="form.content" />
						<view class="upload">
							<image-upload-new :isAddWatermark="true" :address="waterAddress" :userInfo="waterUserInfo" :uploadType="uploadType" ref="imageUploadNew"  :key="imageUploadNewIndex" v-model="form.pics" />
						</view>
					</view>
					<view class="voice-contain" @click="isShowButton = false">
						<sound-recording v-model="form.audio" @close="isShowButton = true"
							@input="isShowButton = true" />
					</view>
				</view>

				<view class="bg_ccc" v-for="(item,index) in problemList" :key="item.forfeitLogListId">
					<view class="top_nav align-items">
						<text class="label">问题{{$util.translateNumberToChinese(index + 1)}}</text>
						<view class="align-items">
							<image class="remove_icon" src="/static/icon/delete_red.png" mode=""
								@click="deleteThis(index)"></image>
							<text class="remove">移除</text>
						</view>
					</view>
					<view class="punish_reason">
						<view class="align-items">
							<text class="label">巡检描述</text>
							<image class="punish_menu" src="/static/icon/punish_menu.png" mode="aspectFill"
								@click="toExistingProblems(item)"></image>
						</view>
						<textarea placeholder-style="color:#909199" placeholder="请输入本次巡检存在的问题" style="width: 100%;
							height: 64rpx;font-size: 26rpx;margin-top: 10rpx;" v-model="item.contents" />
					</view>

					<view class="bg_fff bg_fff2" v-if="item.forfeitLogAddDTOList.length">
						<punish-item :itemId="item.forfeitLogListId" @removePunish="removePunish" :deleteIconShow="true"
							v-model="item.forfeitLogAddDTOList" />
					</view>

					<view class="bg_fff bg_fff2">
						<view class="upload margin_btm">
							<image-upload-new :uploadType="uploadType" v-model="item.pics" />
						</view>
						<view class="voice-contain" @click="isShowButton = false">
							<sound-recording v-model="item.audio" @close="isShowButton = true"
								@input="isShowButton = true" />
						</view>
					</view>

					<view class="bg_fff">
						<column-selection :multiple='multiple' @setIdentId="setIdentId(item.forfeitLogListId)"
							:styleObj="selectStyleObj" v-model="item.name" />
					</view>
				</view>
				<view class="find_problem">
					<button type="default" class="add" @click="addProblemFrom">+ 发现问题</button>
				</view>
				
				<mihuo-bottom-button v-if="isShowButton" :buttonList="buttonList" @click="submit()"></mihuo-bottom-button>
			</form>
		</view>

	</view>
</template>

<script>
	import {
		CommonUpload
	} from "@/plugins/uploadPic.js";
	import {
		debounce
	} from "@/plugins/utils.js"
	import formCache from '@/plugins/formCache'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				isShowButton: true,
				multiple: true,
				uploadType: ['图片'],
				indetId: 0,
				punishData: {},
				title: '',
				chineseNum: '',
				selectStyleObj: {
					label: '责任人',
					selectInfo: '请选择人员'
				},
				problemList: [],
				projectId: '',
				modalShow: false,
				formCacheStatus: false,
				imageUploadNewIndex:0,
				waterAddress: '',
				waterUserInfo:'',
				timer:null,
				buttonList: [{
					name: '确认提交',
					status: true
				}],
				form: {
					personId: '',
					projectId: '',
					audio: '',
					content: '',
					title: '',
					pics: '',
					inspectAddDTOList: [],
					currSkillName: '', // 操作岗位
					currPersonName: '', // 操作岗位姓名
					currCityOperatorId: '' // 当前企业编号
				},
			}
		},
		onShow() {
			this.setParameter()
			this.getPunishData();
			this.getPersonLiable()
		},
		onLoad() {
			this.$nextTick(() => {
				this.cacheForm()
				this.saveTiming()
			})
			this.getLocaltion();
		},
		onBackPress(options) {
			
		},
		onUnload() {
			uni.$off('checkList')
			if (!this.formCacheStatus) {
				this.cacheForm('add')
			}
			this.eliminateTiming()
		},
		computed: {
			...mapState(['projectInfo', 'orderInfo', 'userPersonInfo'])
		},
		methods: {
			saveTiming(){
				this.timer = setInterval(() => {
					if (!this.formCacheStatus) {
						this.cacheForm('add')
					}
					
					console.log('执行');
				}, 5000)
				uni.setStorageSync('eliminateTiming',this.timer)
			},
			eliminateTiming(){
				clearInterval(this.timer);
				this.timer = null
			},
			//得到当前位置
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success:(data)=>{
						console.log(data);
						this.waterAddress = data.address?data.address.city+data.address.district+data.address.street+data.address.streetNum + data.address.poiName:''
					}
				})
			},
			setParameter() {
				this.form.personId = Number(this.userPersonInfo.personId)
				this.form.projectId = Number(this.projectInfo.projectId)
				this.form.currSkillName = this.userPersonInfo.skillName
				this.form.currPersonName = this.userPersonInfo.name
				this.form.currCityOperatorId = this.orderInfo.cityOperatorId
				this.projectId = this.projectInfo.projectId
                this.waterUserInfo = this.userPersonInfo.name + `（${this.userPersonInfo.skillName}）`;

			},
			setIdentId(id) {
				this.indetId = id
			},
			//选择责任人
			getPersonLiable() {
				uni.$on('checkList', (data) => {
					let list = data ? JSON.parse(data) : [];
					if (list.length) {
						let temId = '',
							temName = '',
							temSkillIds = '';
						list.map(tm => {
							temId += tm.personId + ',';
							temName += tm.name + ' ';
							temSkillIds += tm.skillId + ',';
							this.problemList.map(item => {
								if (item.forfeitLogListId === this.indetId) {
									item.dealPersonIds = temId.substr(0, temId.length - 1);
									item['name'] = temName.substr(0, temName.length -
										1); //后台不需要,前台需要,最后提交给后台要删除
									item['skillIds'] = temSkillIds.substr(0, temSkillIds.length -
										1)
								}
							})
						})
					}
				})
			},
			//获取罚款数据
			getPunishData() {
				//添加罚款规则返回后的数据
				this.problemList.map((item, index) => {
					let list = this.punishData.forfeitLogAddDTOList; //上个页面给的值
					if (list && list.length && item.forfeitLogListId === this.punishData.forfeitLogListId) {
						item.forfeitLogAddDTOList = this.punishData.forfeitLogAddDTOList
						//取标题
						item.contents = ''
						item.forfeitLogAddDTOList.map((m, i) => {
							item.contents += this.$util.numberSort(i + 1) + m.name + ';'
						})
					}
				})
			},
			removePunish(index, id) {
				let newList = this.problemList;
				newList.map(item => {
					if (item.forfeitLogListId === id) {
						item.forfeitLogAddDTOList = [
							...item.forfeitLogAddDTOList.slice(0, index),
							...item.forfeitLogAddDTOList.slice(index + 1, item.forfeitLogAddDTOList.length)
						]
					}
				});
				this.problemList = newList;
				//移除成功后清空punishData容器里的数据 不然返回页面前不点击确定punishData容器还有旧的数据又会重新赋值
				this.punishData = {}
			},
			deleteThis(index) {
				let newList = this.problemList;
				newList = [
					...newList.slice(0, index),
					...newList.slice(index + 1, newList.length)
				];
				this.problemList = newList
			},
			addProblemFrom() {
				this.problemList.push({
					forfeitLogListId: new Date().getTime(), //先定义一个id用来区分,后台不需要,前台需要,最后提交给后台要删除
					personId: this.userPersonInfo.personId, //发起人
					dealPersonIds: '', //责任人多选
					name: '',
					audio: '',
					contents: '', //描述内容
					pics: '',
					forfeitLogAddDTOList: []
				})
			},

			submit() {
				this.debounce(() => {
					this.getUploadFile()
				}, 200)
			},

			async getUploadFile() {
				if (this.form.title === '') {
					this.$util.toast("请输入巡检标题");
					return;
				};
				if (!this.$checkUploadProcess(this.form.pics)) {
					return;
				}

				// 音频、图片、新增问题的图片、音频、问题描述
				let audioFile = {},
					problemAudioFile = {};
				if (this.form.audio && this.form.audio.path) {
					audioFile = {
						type: 'audio',
						url: await CommonUpload(this.form.audio.path),
						timeLength: this.form.audio.duration
					}
					this.form.audio = JSON.stringify(audioFile);
				}

				if (this.problemList.length) {
					for (let n = 0; n < this.problemList.length; n++) {
						if (this.problemList[n].name === '') {
							return this.$util.toast("请选择责任人");
						}

						if (this.problemList[n].audio && this.problemList[n].audio.path) {
							problemAudioFile = {
								type: 'audio',
								url: await CommonUpload(this.problemList[n].audio.path),
								timeLength: this.problemList[n].audio.duration
							}
							this.problemList[n].audio = JSON.stringify(problemAudioFile)
						}

						//在提交前删除后台不需要的字段
						for (let key in this.problemList[n]) {
							if (key === 'forfeitLogListId' || key === 'name' || key === 'skillIds') {
								delete this.problemList[n][key]
							}
						}
						//最后提交数据的时候重新赋值，因为有些前台要用到的后台不需要
						let list2 = this.problemList[n].forfeitLogAddDTOList,
							temPunishList = [];
						for (let m = 0; m < list2.length; m++) {
							if (list2 && list2.length) {
								temPunishList.push({
									companyId: Number(this.orderInfo.companyId),
									ruleId: Number(list2[m].ruleId),
									day: list2[m].forbidDay,
									integral: list2[m].points ? list2[m].points : list2[m].integral,
									money: list2[m].money,
									content: list2[m].content,
									ruleType: list2[m].ruleType,
									ruleCode: list2[m].ruleCode,
									name: list2[m].name,
									isCustom: list2[m].isCustom ? list2[m].isCustom : 0
								})
								this.problemList[n].forfeitLogAddDTOList = temPunishList
							}
						}
					}
					this.form.inspectAddDTOList = this.problemList
				}

				this.$http.post("order/sopinspect/save", this.form).then(res => {
					if (res) {
						this.$util.toast("提交成功");
						this.cacheForm('remove')
						setTimeout(() => {
							uni.navigateBack();
						}, 500)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			toExistingProblems(item) {
				uni.navigateTo({
					url: `/pages/construction/punish/existingProblems?punishListItem=${JSON.stringify(item)}&skillId=${item.skillIds}`
				})
			},
			cacheForm(typeName) {
				this.form['cacheId'] = this.form.projectId
				let tempCache = new formCache()
				switch (typeName) {
					case 'add':
						this.form.inspectAddDTOList = this.problemList
						tempCache.contrastCache(this.form, '巡检')
						break
					case 'remove':
						tempCache.removelCache(this.form, '巡检', () => {
							this.formCacheStatus = true
						})
						break
					case 'recovery':
						tempCache.assignmentCache(this.form, (data) => {
							this.form = data
							if (this.form.inspectAddDTOList.length > 0) {
								this.problemList = this.form.inspectAddDTOList
							}
							tempCache.removelCache(this.form, '巡检')
							this.$refs.formCacheItem && this.$refs.formCacheItem.eliminate()
							// 解决图片不会回显
							this.imageUploadNewIndex++
						})
						break
					default:
						this.$nextTick(() => {
							setTimeout(()=>{
								this.$refs.formCacheItem && this.$refs.formCacheItem.getCacheOther(this.form, '巡检')
							},300)
						})
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.add_xj {
		// margin-top: 325rpx;
		margin-top: 50rpx;
		text-align: center;

		.add_btn {
			display: inline-block;
			width: 197rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-weight: bold;
			font-size: $smallFontSize;
			border-radius: 10rpx;
			background: $themeColor;

		}
	}

	.release {
		margin: 0 20rpx;

		.bg_fff {
			margin-bottom: 10rpx;
			padding: 30rpx;
			background: #FFFFFF;
			border-radius: 10rpx;

			.inp_box {
				margin-bottom: 25rpx;
				padding: 0 16rpx 15rpx 0;
				border-bottom: 1.5rpx dashed #EEEEEE;
			}

			.textarea_box {
				padding: 25rpx 0;
				padding-bottom: 10rpx;

				.upload {
					margin: 25.5rpx 0;

					.upload_tool {
						width: 108rpx;
						height: 108rpx;
						border: 1.5rpx solid #E0E0E0;
						box-sizing: border-box;
						border-radius: 10rpx;
					}
				}
			}
		}

		.bg_ccc {
			.top_nav {
				height: 106rpx;
				padding: 0 32rpx;

				.remove {
					margin-left: 6rpx;
					font-size: 24rpx;
					color: #909199;
				}
			}

			.punish_reason {
				height: 195rpx;
				margin-top: 2rpx;
				padding: 30rpx 30rpx 0 30rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
				border-bottom: 2rpx dashed #EEEEEE;

				.punish_menu {
					width: 21px;
					height: 14px;
				}
			}

			.bg_fff2 {
				margin-bottom: 2rpx;
			}
		}
	}

	.find_problem {
		text-align: flex-end;
		margin: 23rpx 42rpx 0 0;

		.add {
			display: inline-block;
			width: 148rpx;
			height: 44rpx;
			text-align: center;
			line-height: 44rpx;
			font-size: 26rpx;
			color: #FF5D35;
			border-radius: 10rpx;
		}
	}

	.margin_btm {
		margin-bottom: 28rpx;
	}

	.remove_icon {
		width: 32rpx;
		height: 32rpx;
	}

	.label {
		font-weight: bold;
		font-size: $middleFontSize;
		color: $darkTitle;
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
