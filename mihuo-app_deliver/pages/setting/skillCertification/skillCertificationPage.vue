<template>
	<view class="skill-certification-page">
		<!-- <public-module></public-module>
		<z-nav-bar backState="1000" fontColor="#909199" bgColor="linear-gradient(180deg, rgba(7,59,188,0.1) 0%, rgba(201, 217, 255, 0) 100%);" >
			<view slot="default" class="nav-bar">
				技能认证
			</view>
		</z-nav-bar> -->
		<view class="nav-bar" :class="[ navBarStatus ? 'nav-bar-static':'']">
			<view class="left"></view>
			<view class="right">
				<image src="@/static/images/back.png" mode="" @click="goBack"></image>技能认证
			</view>
		</view>
		<view class="item-top">
			<u-avatar size="114" v-if="personInfo.userId" :src="userAvatar()" @click.native="seeAvatar()"
				@loadError="loadError" />
			<view class="item-right">
				<text class="item-name">{{personInfo.realName}}</text>
				<text class="item-other" v-if="setPersonageList > 0">已获得{{setPersonageList}}项技能认证</text>
			</view>
		</view>

		<view class="public-skill " v-if="certifiedList.length > 0">
			<view class="item-title">
				已认证岗位
			</view>
			<view class="list-contain">
				<view class="item-skill-contain" @click="getDetails(item)" v-for="(item,index) in certifiedList"
					:key="index">
					<image class="public-images" :src="setImage(item)" mode=""></image>
					<view class="item-bottom">
						<text class="item-text">{{item.skillName}}认证</text>
						<text class="item-time">{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="public-skill " v-if="toBeReviewedList.length > 0">
			<view class="item-title">
				等待审核岗位
			</view>
			<view class="list-contain">
				<view class="item-skill-contain" @click="getDetails(item)" v-for="(item,index) in toBeReviewedList"
					:key="index">
					<image class="public-images" :src="setImage(item)" mode=""></image>
					<view class="item-bottom">
						<text class="item-text">{{item.skillName}}认证</text>
						<text class="item-time">{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="public-skill " v-if="failList.length > 0">
			<view class="item-title">
				拒绝认证岗位
			</view>
			<view class="list-contain">
				<view class="item-skill-contain" @click="getDetails(item)" v-for="(item,index) in failList"
					:key="index">
					<image class="public-images" :src="setImage(item)" mode=""></image>
					<view class="item-bottom">
						<text class="item-text">{{item.skillName}}认证</text>
						<text class="item-time">{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>
		<mh-empty v-if="certifiedList.length === 0 && failList.length == 0 && toBeReviewedList.length == 0"
			title="您还没有数据～～" />
		<bottom-button title="新增技能认证" @click="addSkill"></bottom-button>
	</view>
</template>

<script>
	import moment from '@/static/js/moment.js'
	export default {
		data() {
			return {
				option: {},
				personInfo: {},
				certifiedList: [],
				toBeReviewedList: [],
				failList: [],
				navBarStatus: false,
				hasManager: false, //  是否已认证过项目管家
				hasSupervision: false, // 是否已认证过项目监理
				hasDesigner: false, // 是否已认证过设计师
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
						value: '泥'
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
			setPersonageList() {
				let tempIndex = 0
				if (this.personInfo && this.personInfo.personageList) {
					this.personInfo.personageList.map(item => {
						if (item.auditStatus == 2) {
							++tempIndex
						}
					})
				}
				return tempIndex
			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 54) {
				this.navBarStatus = true
			} else {
				this.navBarStatus = false
			}
		},
		mounted() {

		},
		onShow() {
			this.getPersonInfo()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			setImage(item) {
				let tempUrl = this.imageList.find(el => item.skillName.includes(el.value))
				if (tempUrl) {
					return tempUrl.url
				} else {
					return '/static/images/skill_icon/skill_cc.png'
				}
			},
			getPersonInfo() {
				this.$httpApi.getPersonSettingInfo().then(res => {
					if (res) {
						res.personageList = res.personageList.filter(item => item.jobCode !== 'JOB_DEFAULT')
						this.personInfo = res;
						uni.setStorageSync('userSetting', res);
						this.dataInit()
					}
				})
			},
			dataInit() {
				this.certifiedList = []
				this.toBeReviewedList = []
				this.failList = []
				if (this.personInfo.personageList) {
					this.personInfo.personageList.forEach(item => {
						if (item.jobCode === 'JOB_MANAGER' && item.auditStatus == 2) {
							this.hasManager = true
						}
						if (item.jobCode === 'JOB_SUPERVISION' && item.auditStatus == 2) {
							this.hasSupervision = true
						}
						if (item.jobCode === 'JOB_DESIGNER' && item.auditStatus == 2) {
							this.hasDesigner = true
						}
					})
				}

				// 审核状态（0已提交、1未通过、2已通过）
				if (this.personInfo.personageList && this.personInfo.personageList.length > 0) {
					this.personInfo.personageList.map(item => {
						if (item.skillName.includes('项目管家')) {
							item.skillName = '管家'
						}
						if (item.skillName.includes('项目监理')) {
							item.skillName = '监理'
						}
						item['time'] = moment(item.createTime).format('MMMDo HH:mm')
						switch (item.auditStatus) {
							case 0:
								this.toBeReviewedList.push(item)
								break
							case 1:
								this.failList.push(item)
								break
							case 2:
								this.certifiedList.push(item)
								break
						}

					})
				}
			},
			addSkill() {
				this.toPage(
					`/pages/certification/skills?hasManager=${this.hasManager}&hasSupervision=${this.hasSupervision}&hasDesigner=${this.hasDesigner}`
				)
			},
			userAvatar() {
				return this.$util.avatarImage(this.personInfo.userId) + '?time=' + new Date().getTime();
			},
			loadError(value) {
				this.errorUrl = value;
			},
			// 查看头像
			seeAvatar() {
				let imageGlobal = this.errorUrl || this.$util.avatarImage(this.personInfo.userId) + '?time=' + new Date()
					.getTime();
				uni.previewImage({
					current: imageGlobal,
					urls: [imageGlobal],
				})
			},
			getDetails(item) {
				uni.navigateTo({
					url: '/pages/setting/skillCertification/skillCertificationDetails',
					success(res) {
						res.eventChannel.emit('skillDetails', {
							details: item,
						});
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.nav-bar {
		// @include nav-bar-title('#303133');
		display: flex;
		padding-top: calc(var(--status-bar-height) + 40rpx);
		height: 88rpx;
		padding-bottom: 40rpx;
		align-items: center;
		position: sticky;
		position: -webkit-sticky;
		top: 0rpx;
		z-index: 99;
		background: linear-gradient(180deg, rgba(7, 59, 188, 0.3) 0%, rgba(201, 217, 255, 0) 100%);
		// background-color: #E9EFFF;

		image {
			width: 40rpx;
			height: 40rpx;
			// margin-left: 40rpx;
			position: absolute;
			left: 40rpx;
		}

		.right {
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}

	.nav-bar-static {
		background-color: #E9EFFF;
	}

	.skill-certification-page {
		padding-bottom: 140rpx;

		// overflow: hidden !important;
		// position: fixed !important;
		// height: 100%;
		// width: 100%;
	}

	/deep/ .bottom-button {
		background-color: #FFFFFF;
	}

	.public-images {
		width: 116rpx;
		height: 116rpx;
		border-radius: 50%;
		background-color: #E9EFFF;
		margin-bottom: 10rpx;

	}

	.item-top {
		margin-top: -88rpx;
		padding: 0rpx 0rpx 0rpx 80rpx;
		padding-top: 230rpx;
		// background: linear-gradient(180deg, rgba(7, 59, 188, 0.3) 0%, rgba(201, 217, 255, 0) 100%);
		display: flex;
		align-items: center;
		margin-bottom: 34rpx;

		.item-right {
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;

			.item-name {
				font-size: 30rpx;
				color: #303133;
			}

			.item-other {
				font-size: 26rpx;
				color: #606166;
			}
		}
	}

	.list-all {
		height: calc(100vh - 344rpx);

		.scroll-Y {
			height: 100%;

		}
	}

	.public-skill {
		border-radius: 16rpx;
		padding: 32rpx 0rpx 28rpx 0rpx;
		margin-bottom: 16rpx;
		background-color: #FFFFFF;

		.item-title {
			padding-left: 56rpx;
			margin-bottom: 36rpx;
		}

		.list-contain {
			display: flex;
			flex-wrap: wrap;
			padding: 0rpx 40rpx 0rpx 40rpx;

			.item-skill-contain {
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 40rpx;
				margin-right: 60rpx;
				margin-bottom: 16rpx;

				&:nth-of-type(3n+0) {
					margin-right: 0rpx;
				}
			}

			.item-bottom {
				display: flex;
				flex-direction: column;

				.item-text {
					font-size: 28rpx;
					color: #303133;
				}

				.item-time {
					font-size: 24rpx;
					color: #909199;
				}
			}
		}

	}


	/* @import url(); 引入css类 */
</style>
