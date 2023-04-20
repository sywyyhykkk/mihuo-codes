<template>
	<view>
		<view class="step" v-if="nodeData.nodeList">
			<image src="../../static/icon/Group8813.png" class="group_image"></image>
			<view class="step_title">Step{{stepIndex+1}} {{nodeData.stageName}}</view>
			<view style="clear: both;"></view>
			<view class="step_detial" v-for="(item2,index) in nodeData.nodeList" :key="index">
				<view class="step_index">{{index<9?'0'+(index+1):index+1}}.</view>
				<view class="step_node" :style="index+1==2?'border:mone':''">
					<view class="step_node_title">{{item2.nodeName}}</view>
					<view class="step_node_type" v-if="item2.status==3">已完成</view>
					<!-- <view class="step_node_type not_finish" v-else>未完成</view> -->
					<view class="step_node_type not_finish" v-else>
						{{new Date().format('yyyy-MM-dd')>item2.expectFinishTime?'已超期':'未完成'}}
					</view>
					<!-- <view style="float: right;" @click="setFocus(item2)">
						<view class="button_text">{{item2.foucsFlag ?'已关注':'关注'}}</view>
						<image v-if="item2.foucsFlag" src="../../static/icon/attention_1.png" class="button_image" />
						<image v-else src="../../static/icon/attention.png" class="button_image" />
					</view> -->
					<view style="clear: both;"></view>
					<view class="step_node_date">
						{{item2.expectStartTime}}
						<text v-if="item2.expectFinishTime">至</text>
						{{item2.expectFinishTime}}
						<text v-if="getTime(item2)">共{{getTime(item2)}}天</text>
					</view>
					<view class="step_bode_edit" @click="open(item2)" v-if="userRole==='R_PROJECT_MANAGER'">编辑</view>
					<view style="clear: both;"></view>
					<view class="step_node_button">
						<!-- v-if="item2.status==3" -->
						<view class="node-text" v-if="item2.executeJobNames && item2.executeJobNames.length > 0">
							执行岗位：
							<text class="node-text-item" v-for="(ev,num) in item2.executeJobNames"
								:key="num">{{ev}} </text>
							<!-- {{ item2 && item2.personName }} -->
						</view>
						<!-- <view>
							<view class="button_text">点赞</view>
							<image src="../../static/icon/giveLike.png" class="button_image" />
							<view class="button_number">1.2w</view>
						</view>
						<view>
							<view class="button_text">评论</view>
							<image src="../../static/icon/comment.png" class="button_image" />
						</view>
						 <view>
						 	<view class="button_text">关注</view>
						 	<image src="../../static/icon/attention.png" class="button_image" />
						 </view>-->

					</view>
				</view>
				<view style="clear: both;"></view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popup_model">
				<view class="popup_title">
					<view class="title_text">编辑施工计划</view>
					<image @click="close" src="../../static/icon/close.png" class="title_image" />
					<view style="clear: both;"></view>
				</view>
				<view class="popup_node">
					<view class="popup_node_title">
						施工节点
					</view>
					<input type="text" v-model="form.nodeName" class="popup_node_input" placeholder="请输入施工节点名称" />
					<view class="popup_node_title" style="margin-top: 24rpx;">
						施工周期
					</view>
					<view style="width: 100%;">
						<!-- <picker mode="date" class="popup_node_select" :value="form.expectStartTime"
							@change="bindDateChange">
							<view class="uni-input">{{form.expectStartTime}}</view>
						</picker> -->
						<!-- <picker mode="date" class="popup_node_select" :value="form.expectFinishTime"
							@change="bindDateChange2">
							<view class="uni-input">{{form.expectFinishTime}}</view>
						</picker> -->
						<!-- <view style="clear: both;"></view> -->
						
						<view @click="showTime = true" class="time-contain ">
							<view class="left" :class="[form.expectStartTime && 'active-time']">
								{{form.expectStartTime ? form.expectStartTime:'开始时间'}}
							</view>
							<view style="width: 30rpx;text-align: center;line-height: 80rpx;">-</view>
							<view class="right" :class="[form.expectFinishTime && 'active-time']">
								{{form.expectFinishTime ? form.expectFinishTime:'结束时间'}}
							</view>
						</view>
					</view>
				</view>

				<view class="popup_bottom">
					<view class="bottom_del">删除</view>
					<view class="bottom_confirm" @click="formConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<mihuo-calendar v-model="showTime" mode="range" max-date="2099-12-30" @change="changeTime"></mihuo-calendar>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	import moment from "@/static/js/moment.js"
	export default {
		props: {
			stepIndex: 0,
			nodeData: {},
			getDataList: {
				type: Function,
				default: null
			}
		},
		mounted() {},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				showTime:false,
				date: currentDate,
				showModel: true,
				expectStartTime: '',
				expectFinishTime: '',
				nodeName: '',
				form: {
					expectFinishTime: "",
					expectStartTime: "",
					nodeId: 0,
					nodeName: "",

				}
			}
		},
		computed: {
			...mapState(['projectInfo', 'userRole', 'userPersonInfo']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			getTime(item) {
				let time = moment(item.expectFinishTime).diff(item.expectStartTime, 'day')
				if (time) {
					return time 
				} else {
					return ''
				}
			},
			formConfirm() {

				if (!this.form.expectStartTime) {
					this.$util.toast(`开始时间不能为空`);
					return
				}

				if (!this.form.expectFinishTime) {
					this.$util.toast(`结束时间不能为空`);
					return
				}


				this.$http.post('order/project/update/project_node', this.form).then(res => {
					if (res) {
						uni.showToast({
							title: '编辑成功',
							icon: 'none'
						})
						this.close()
						this.$emit('getDataList')
					}
				})
			},
			open(item) {
				this.expectStartTime = item.expectStartTime
				this.expectFinishTime = item.expectFinishTime
				this.nodeName = item.nodeName
				this.form = {
					expectFinishTime: item.expectFinishTime,
					expectStartTime: item.expectStartTime,
					nodeId: item.nodeId,
					nodeName: item.nodeName,
					currSkillName: this.userPersonInfo.skillName, // 操作岗位
					currPersonName: this.userPersonInfo.name // 操作岗位姓名
				}
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			bindDateChange: function(e) {
				this.form.expectStartTime = e.target.value
			},
			bindDateChange2: function(e) {
				this.form.expectFinishTime = e.target.value
			},
			changeTime(item) {
				this.form.expectStartTime = item.startDate
				this.form.expectFinishTime = item.endDate
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			setFocus(item) {
				this.$httpApi.setFocus({
					nodeId: item.nodeId,
					operation: item.foucsFlag ? 2 : 1 // 1 关注 2取消关注
				}).then(res => {
					if (res) {
						this.$emit('getDataList')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup_model {
		width: 90vw;
		height: 500rpx;
		border-radius: 16rpx;
		background: #FFFFFF;
		position: relative;

		.popup_bottom {
			position: absolute;
			bottom: 0;
			height: 96rpx;
			border-top: 1rpx solid #EEEEEE;
			width: 100%;

			.bottom_confirm {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 94rpx;
				text-align: center;
				color: $themeColor;
				float: left;
				width: 50%;
			}

			.bottom_del {
				float: left;
				width: 50%;
				text-align: center;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 94rpx;
				color: #C6C6C6;
				border-right: 1rpx solid #EEEEEE;
			}
		}

		.popup_node {
			padding: 12rpx 40rpx 0 40rpx;

			.popup_node_select {
				margin-top: 12rpx;
				background: #F6F6F6;
				border: 2rpx solid #F6F6F6;
				border-radius: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 26rpx;
				line-height: 72rpx;
				height: 72rpx;
				color: #999999;
				padding-left: 20rpx;
				float: left;
				width: calc(50% - 44rpx);
			}

			.popup_node_input {
				margin-top: 12rpx;
				background: #F6F6F6;
				border: 2rpx solid #F6F6F6;
				border-radius: 10rpx;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: normal;
				font-size: 26rpx;
				line-height: 72rpx;
				height: 72rpx;
				color: #999999;
				padding-left: 20rpx;
				margin-right: 10rpx;

			}

			.popup_node_title {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #606166;
			}

		}

		.popup_title {
			height: 100rpx;
			border-bottom: 2rpx solid #F3F3F3;

			.title_image {
				width: 40rpx;
				height: 40rpx;
				margin-top: -70rpx;
				margin-right: 24rpx;
				float: right;
			}

			.title_text {
				float: left;
				width: 100%;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 30rpx;
				line-height: 100rpx;
				text-align: center;
				color: #303133;
			}
		}
	}

	.step {
		margin: 2rpx 20rpx 20rpx 20rpx;
		padding: 40rpx 30rpx 0rpx 30rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		
		
		&:nth-of-type(1){
			border-top-left-radius: 0rpx;
			border-top-right-radius: 0rpx;
		}
		
		.step_detial {
			margin-top: 30rpx;
			border-bottom: 2rpx solid #F2F2F2;
			padding-bottom: 30rpx;

			.step_node {
				float: left;
				margin-left: 10rpx;
				width: calc(100% - 50rpx);

				.step_node_button {
					width: 100%;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					margin: 0 auto;
					margin-top: 20rpx;

					.node-text {
						font-weight: normal;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #909199;

						.node-text-item {
							font-size: 24rpx;
							color: #909199;
							margin-right: 10rpx;
						}

					}

					.button_number {
						font-family: PingFang SC;
						font-style: normal;
						font-weight: bold;
						font-size: 18rpx;
						color: $themeColor;
						float: left;
						margin-left: 6rpx;
					}
				}

				.button_text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: normal;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #606166;
					float: left;
				}

				.button_image {
					width: 38rpx;
					height: 38rpx;
					float: left;
					margin-left: 6rpx;
				}

				.step_node_date {
					float: left;
					margin-top: 20rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: normal;
					font-size: 26rpx;
					line-height: 36rpx;
					color: $themeColor;

					text {
						color: $themeColor;
						font-size: 26rpx;
					}

				}

				.step_node_title {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 26rpx;
					line-height: 36rpx;
					color: #303133;
					float: left;
				}

				.not_finish {
					color: #FF5D35 !important;
					background: #FFE9D9 !important;
				}

				.step_node_type {
					float: left;
					margin-left: 20rpx;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: normal;
					font-size: 20rpx;
					line-height: 36rpx;
					color: #10C57D;
					background: #D5FFEE;
					border-radius: 50rpx;
					padding-left: 10rpx;
					padding-right: 10rpx;
				}

				.step_bode_edit {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: normal;
					font-size: 24rpx;
					margin-top: 20rpx;
					line-height: 36rpx;
					float: right;
					color: $themeColor;

				}
			}

			.step_index {
				float: left;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 26rpx;
				line-height: 40rpx;
				color: #D5D5D5;
			}
		}

		.step_title {
			font-family: PingFang SC;
			font-style: normal;
			font-size: 32rpx;
			line-height: 44rpx;
			color: #606166;
			float: left;
		}

		.group_image {
			float: left;
			height: 32rpx;
			width: 44rpx;
			margin-right: 10rpx;
			margin-top: 6rpx;

		}
	}
	
	.time-contain {
		display: flex;
		margin-top: 12rpx;
	
		.left,
		.right {
			flex: 1;
			display: flex;
			align-items: center;
			height: 88rpx;
			padding: 20rpx 30rpx;
			background: #F6F6F6;
			border-radius: 10rpx;
			color: $viceFontColor99;
			font-size: $fontSize26;
		}
	}
	
	.active-time {
		color: #303133 !important;
	}
</style>
