<template>
	<view class="evaluation-form-contain">
		<view class="item-contain">
			<view class="personnel">
				<u-avatar size="120" :src="$util.thumbnailImage(details.avatar,false)" mode="circle"></u-avatar>
				<view class="name-text">
					<view class="name">{{details.name}}</view>
					<view class="jobs">{{details.skillName}}</view>
				</view>
			</view>
			<view class="body">
				<view class="tab-list">
					<view class="item-tab" v-for="(el,num) in form.tabList" :key="num" @click="getTab(num)"
						:class="[el.status === true?'item-tab-active':'']">{{el.label}}</view>
				</view>
				<view class="text-contain">
					<image v-if="imageShow && !form.contents" src="/static/images/icon_edit/editor_1.png" mode=""></image>
					<textarea @focus="imageShow = false" confirm-type="send" @blur="imageShow = true"
						v-model="form.contents" placeholder-class="placeholder" class="describe-input" maxlength="200"
						type="textarea" placeholder="从多个角度描写评价，帮助更多有需要得朋友" :border="true" />
				</view>
				<view class="file-contain">
					<custom-file-upload v-model="form.pics"></custom-file-upload>
				</view>
				<view class="bottom">
					<view class="rate-item" v-if="newData.type !== '评价服务' ">
						<mihuo-rate title="按时交付" v-model="form.deliveryScore"></mihuo-rate>
					</view>
					<view class="rate-item" v-if="newData.type !== '评价服务' " >
						<mihuo-rate title="节点完成" v-model="form.nodeScore"></mihuo-rate>
					</view>
					<view class="rate-item">
						<mihuo-rate title="服务态度" v-model="form.serveScore"></mihuo-rate>
					</view>
				</view>
			</view>
		</view>
		<view class="button-contain iphonex-bottom">
			<view class="cancel" @click="confirm('取消')">取消</view>
			<view class="confirm" @click="confirm('发表评价')">发表评价</view>
		</view>

	</view>
</template>

<script>
	import {
	  mapState,
	 } from 'vuex'
	export default {
		data() {
			return {
				key: '',
				option: {},
				imageShow: true,
				form: {
					contents: '',
					dealPersonId: '', // 进行评论的人员信息
					personId: '', // 被评论人id
					execPersonName: '',
					execPersonJob: '',
					execPersonAvatar: '',
					projectId: '', //项目编号
					personAll: '', // 被评价人集合
					deliveryScore: 4, // 按时交付分数
					nodeScore: 4, // 按时交付分数
					serveScore: 4, // 服务分数
					pics: '',
					nodeId: '', // 任务编号
					labels: [], // 标签
					tabList: []
				},
				workerInfo:{},
				nodeId:'',
				newData:{},
				details: {
					desc: '时代大厦多所'
				},
				execPersonAll: [],
			}
		},
		onLoad(option) {
			this.option = option
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromOpenerPage', (data)=> {
				this.newData = data
				this.getForm(data)
			});
		},
		onShow() {
			this.setParameter()
		},
		computed: {
		   ...mapState(['projectInfo','nodeInfo','userPersonInfo'])
		  },
		methods: {
			setParameter(){
				this.form.projectId = this.projectInfo.projectId
				this.form.nodeId = this.nodeInfo.nodeId
				this.form.dealPersonId = this.userPersonInfo.personId
				this.nodeId = this.nodeInfo.nodeId
			},
			getForm(item) {
				if(item.type == '评价服务'){
					this.getWorkerInfo(item)
				}else{
					let tempLabel = item.label !== '' && item.label.split(',')
					let tempLabelList = []
					tempLabel.map(el => {
						tempLabelList.push({
							label: el,
							status: false
						})
					})
					this.form.personId = item.personId
					this.form.execPersonName = item.name
					this.form.execPersonJob = item.skillName
					this.form.execPersonAvatar = item.avatar
					this.form.tabList = tempLabelList
					this.details = item
				}
			},
			//获取师傅信息
			getWorkerInfo(item){
				this.$http.get(`order/bidorder/list?orderId=${item.id}`).then(res => {
					if(res){
						if(res.offerList && res.offerList.length > 0){
							let temp = res.offerList[0]
							this.workerInfo = res;
							this.form.personId = temp.personInfo.personId
							this.form.execPersonName = temp.personInfo.name
							this.form.execPersonJob = temp.personInfo.skillName
							this.form.execPersonAvatar = temp.personInfo.avatar
							this.details = temp.personInfo
							this.getEvalTags();
						}
					}
				})
			},
			// 获取工人对应工种标签
			getEvalTags(){
				this.$http.get('admin/sysjobskill/getJobSkillList',{
					type:2
				}).then(res=>{
					if(res){
						let tempLabel = ''
						res.map((v)=>{
							if(v.skillId == this.workerInfo.offerList[0].skillId){
								tempLabel = (v.label).split(',')
							}
						})
						let tempLabelList = []
						tempLabel.map(el => {
							tempLabelList.push({
								label: el,
								status: false
							})
						})
						this.form.tabList = tempLabelList
					}
				})
			},
			getTab(num) {
				let tempList = this.form['tabList']
				if (tempList[num].status) {
					tempList[num].status = false
				} else {
					tempList[num].status = true
				}
				this.form['labels'] = []
				tempList.map(item => {
					if (item.status) {
						this.form['labels'].push(item.label)
					}
				})
			},
			confirm(val) {
				if (val === '取消') {
					uni.navigateBack();
					return
				}
				this.form.labels = this.form.labels.join(',')
				this.form.personAll = this.execPersonAll.join(',')
				this.debounce(() => {
					if(this.newData.type == '评价服务'){
						this.form['orderCode'] = this.newData.orderCode
						this.form['orderId'] = this.newData.id
						this.$http.post('order/capp/bizorderreply/save',this.form)
						.then(res=>{
							if(res){
								this.$util.toast('服务评价成功');
								setTimeout(()=>{
									uni.navigateBack();
								},2000)
							}
						})
					}else{
						this.$httpApi.bizorderreplySave(this.form).then(res => {
							if (res) {
								this.$util.toast("评价成功");
								uni.navigateBack();
							}
						})
					}
				}, 200)
			},
			cancel() {
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.evaluation-form-contain {
		padding-bottom: 120rpx;
	}

	.loading-contain {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-contain {
		margin: 14rpx 20rpx;
		background: #FFFFFF;
		border-radius: 30rpx 30rpx 10rpx 10rpx;
		padding: 42rpx 0;

		&:last-child {
			margin-bottom: 0rpx;
		}

		.personnel {
			display: flex;
			padding-bottom: 32rpx;
			border-bottom: 2rpx dashed #FFE7E2;
			align-items: center;
			margin: 0 22rpx;

			.name-text {
				display: flex;
				flex-direction: column;
				margin-left: 24rpx;

				.name {
					font-weight: bold;
					font-size: 28rpx;
					color: $seconFontColor;
				}

				.jobs {
					font-weight: bold;
					font-size: 26rpx;
					color: #909199;
				}
			}
		}

		.tab-list {
			padding-top: 36rpx;
			margin: 0 30rpx 20rpx 30rpx;

			.item-tab {
				padding: 8rpx 26rpx;
				border: 2rpx solid #EEEEEE;
				box-sizing: border-box;
				border-radius: 50rpx;
				margin: 0 10rpx 18rpx 0;
				font-size: 24rpx;
				display: inline-block;
			}

			.item-tab-active {
				border: 2rpx solid $themeColor;
				color: $themeColor;

			}
		}

		.text-contain {
			position: relative;
			margin: 0 30rpx;
			padding-left: 20rpx;

			image {
				position: absolute;
				top: 4rpx;
				width: 34rpx;
				height: 34rpx;
			}

			.describe-input {
				margin-bottom: 20rpx;
				border: 0px;
				height: 120rpx;
			}

			.placeholder {
				color: #909199;
				font-size: 12px;
				padding-left: 40rpx;
				padding-top: 4rpx;
			}
		}


		.bottom {
			margin-left: 54rpx;

			.rate-item {
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0rpx;
				}
			}
		}

		.file-contain {
			padding-bottom: 52rpx;
			margin: 0 54rpx 44rpx 54rpx;
			border-bottom: 2rpx dashed #EEEEEE;
		}

	}

	.button-contain {
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		justify-content: center;
		padding: 18rpx 0;

		.cancel {
			background: #FFFFFF;
			border: 2rpx solid #E0E0E0;
			border-radius: 10rpx;
			font-size: 28rpx;
			color: #909299;
			padding: 24rpx 106rpx;
			margin-right: 24rpx;
		}

		.confirm {
			background: $themeColor;
			border-radius: 10rpx;
			padding: 24rpx 78rpx;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
</style>
