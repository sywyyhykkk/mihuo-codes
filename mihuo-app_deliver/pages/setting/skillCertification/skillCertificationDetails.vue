<template>
	<view class="skill-certification-details">
		<view class="item-top">
			<image class="icon-close" @click="setGoBack()" src="/static/images/multiply.png" mode=""></image>
		</view>
		<view class="item-central-section">
			<image class="public-images" :src="setImage()" mode=""></image>
			<view class="item-bottom">
				<text class="item-status">{{details.skillName}}认证{{setStatusTitle()}}</text>
				<text class="item-time"
					v-if="details.createTime">发起时间：{{details.createTime && details.createTime.substring(0,16) }}</text>
				<text class="item-time" v-if="details.auditTime && details.auditStatus !== 0">
					{{details.auditStatus == 1 ? '拒绝':'通过'}}时间：{{details.auditTime && details.auditTime.substring(0,16)}}</text>
			</view>
			<view class="item-text-contain" >
				<text class="item-text" v-if="details.auditRemark && details.auditStatus == 1">审核意见:{{details.auditRemark}}</text>
			</view>
		</view>

		<view class="spot-list" v-if="details.auditStatus == 0">
			<view class="item-spot-default" :class="[timingIndex == index ? 'item-spot-active':''] "
				v-for="(item,index) in spot" :key="index">
			</view>
		</view>
		<view class="button-contain">
			<view class="item-button" @click="setGoBack(details.auditStatus == 1 ?'重新认证':'关闭')">
				{{details.auditStatus == 1 ?'重新认证':'关闭'}}
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				details: {},
				spot: [1, 2, 3, 4, 5, 6],
				timingIndex: 0,
				timer: null,
				hasManager: false, //  是否已认证过项目管家
				hasSupervision: false, // 是否已认证过项目监理
				hasDesigner: false, // 是否已认证过设计师
				personInfo: {},
				imageList: [{
						url: '/static/images/skill_icon/skill_cc.png',
						value: '拆除'
					},
					{
						url: '/static/images/skill_icon/skill_gj.png',
						value: '管家'
					},
					{
						url: '/static/images/skill_icon/skill_jl.png',
						value: '监理'
					},
					{
						url: '/static/images/skill_icon/skill_mf.png',
						value: '美缝'
					},
					{
						url: '/static/images/skill_icon/skill_mg.png',
						value: '木工'
					},
					{
						url: '/static/images/skill_icon/skill_nw.png',
						value: '泥瓦'
					},
					{
						url: '/static/images/skill_icon/skill_sd.png',
						value: '水电'
					},
					{
						url: '/static/images/skill_icon/skill_sj.png',
						value: '设计师'
					},
					{
						url: '/static/images/skill_icon/skill_yq.png',
						value: '油漆'
					},
				]
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			this.getPersonInfo()
			this.setTiming()
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('skillDetails', (data) => {
				this.details = data.details
			});
		},
		onUnload() {
			clearInterval(this.timer);
			this.timer= null
		},
		methods: {
			setStatusTitle() {
				// 审核状态（0已提交、1未通过、2已通过）
				switch (Number(this.details.auditStatus)) {
					case 0:
						return '等待审核中'
					case 1:
						return '未通过'
					case 2:
						return '已通过'

				}
			},
			setImage(item) {
				let tempUrl = this.imageList.find(el => el.value == this.details.skillName)
				if (tempUrl) {
					return tempUrl.url
				} else {
					return '/static/images/skill_icon/skill_cc.png'
				}
			},
			setGoBack(type) {
				clearInterval(this.timer);
				if (type == '重新认证') {
					this.addSkill()
				} else {
					this.goBack()
				}
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						this.personInfo = res;
						uni.setStorageSync('userSetting', res);
						this.dataInit()
					}
				})
			},
			dataInit() {
				if (this.personInfo.personageList) {
					this.personInfo.personageList.forEach(item => {

						if (item.personId === this.details.personId) {
							this.details.auditTime = item.auditTime
							this.details.createTime = item.createTime
						}

						if (item.jobCode === 'JOB_MANAGER') {
							this.hasManager = true
						}
						if (item.jobCode === 'JOB_SUPERVISION') {
							this.hasSupervision = true
						}
						if (item.jobCode === 'JOB_DESIGNER') {
							this.hasDesigner = true
						}
					})
				}
			},
			addSkill() {
				let jobCode = this.details.jobCode
				let nameList = ['设计师', '项目管家', '项目监理']
				let name = ''
				if (nameList.indexOf(this.details.skillName) !== -1) {
					name = this.details.skillName
				} else {
					name = '工人'
				}
				this.toPage(
					`/pages/certification/information?jobCode=${jobCode}&name=${name}&skillId=${this.details.skillId}&skillName=${this.details.skillName}`
				)
			},
			setTiming() {
				this.timer = setInterval(() => {
					this.timingIndex++;
					if (this.timingIndex > 5) {
						this.timingIndex = 0
					}
				}, 800)
			}
		}
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #FFFFFF;
	}
</style>

<style lang="scss" scoped>
	/* @import url(); 引入css类 */

	.public-images {
		width: 254rpx;
		height: 254rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 28rpx;

	}

	.item-bottom {
		display: flex;
		flex-direction: column;
	}

	.skill-certification-details {
		padding-top: 100rpx;
		height: 100%;


		.item-top {
			// display: flex;
			// justify-content: flex-end;
			width: 100%;
			text-align: right;
			margin-bottom: 210rpx;
		}

		.icon-close {
			width: 64rpx;
			height: 64rpx;
			margin-right: 54rpx;
			float: right;
		}

		.item-central-section {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.item-bottom {
				display: flex;

				.item-other {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

				.item-status {
					font-size: 36rpx;
					color: #303133;
					margin-bottom: 14rpx;
				}
				
				.item-time {
					font-size: 26rpx;
					color: #909199;
					margin-bottom: 12rpx;
				}
			}
			
			.item-text-contain {
				width: 500rpx;
				margin-bottom: 200rpx;
				margin-top: 10rpx;
			}
			
			.item-text {
				// width: 600rpx;
				font-size: 26rpx;
				color: #606166;
			}
		}

		.spot-list {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 30rpx;
			margin-bottom: 232rpx;


			.item-spot-default {
				background-color: rgba(0, 47, 165, 0.1);
				width: 18rpx;
				height: 18rpx;
				border-radius: 50%;
				margin-right: 20rpx;
				transition: all .4s linear;

				&:last-child {
					margin-right: 0rpx;
				}
			}

			.item-spot-active {
				background-color: #002FA5;
				width: 24rpx;
				height: 24rpx;
				transition: all .4s linear;
			}
		}

		.button-contain {
			display: flex;
			align-items: center;
			justify-content: center;

			.item-button {
				width: 304rpx;
				height: 86rpx;
				border: 2rpx solid #002FA5;
				border-radius: 110rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #002FA5;
			}
		}



	}
</style>
