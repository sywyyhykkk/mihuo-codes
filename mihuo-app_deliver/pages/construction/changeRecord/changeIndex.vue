<template>
	<view>
		<mihuo-order-information :projectId="projectInfo.projectId"></mihuo-order-information>
		<view class="tab-contain">
			<list-tab :list="tabList" @change="changTab"></list-tab>
		</view>
		<view class="list-contain">
			<view class="item-contain" v-for="(item,index) in list" :key="index" @click="getDetails(item)">
				<view class="top display-justify_between">
					<text class="item-left">编号:{{item.alterationSn}}</text>
					<text class="item-status " :class="[getStatus('class',item)]">{{getStatus('name',item)}}</text>
				</view>
				<view class="middle">
					<text class="name">{{getVisaTypeList(item)}}</text>
					<view class="desc-contain">
						<text class="desc">签证内容：{{item.content}}</text>
					</view>
				</view>
				<view class="bottom display-align_center">
					<u-avatar class="node" size="32" :src="$util.avatarImage(item.userId,true)">
					</u-avatar>
					<text
						class="text">{{item.userName}}({{item.skillName}}){{item.created && item.created.substring(0,16)}}发起变更</text>
				</view>
			</view>
		</view>
		<mh-empty v-if="list.length == 0" icon="/static/images/no_recommend.png" title="没有待处理项～～" />
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				activeItemStyle: {
					color: '#002FA5',
					fontSize: '30rpx'
				},
				statusList: [{
					name: '审核中',
					value: 0,
					class: 'status-active'
				}, {
					name: '拒绝',
					value: 1,
					class: 'status-waring'
				}, {
					name: '通过',
					value: 2,
					class: 'status-success'
				}],
				tabCurrent: 0,
				buttonList: [{
					name: '发起变更',
					status: true
				}],
				tabList: [{
					name: '全部',
					value: '-1'
				}, {
					name: '已同意',
					value: 2
				}, {
					name: '审核中',
					value: 0
				}, {
					name: '已拒绝',
					value: 1
				}],
				visaTypeList: [{
					name: '人工费变更',
					value: 1
				}, {
					name: '服务费变更',
					value: 2
				}, {
					name: '订单费变更',
					value: 3
				}, {
					name: '工期变更',
					value: 4
				}, {
					name: '材料定额变更',
					value: 5
				}, {
					name: '验收标准变更',
					value: 6
				}],
				list: [],
				listData: [],
				pageSize: 10,
				total: 0,
				pages: 0,
				contrast: 0,
				status: false,
				orderStatus: -1,
			}
		},
		onShow() {
			this.getList()
		},
		onLoad(option) {
			this.option = option
		},
		computed: {
			...mapState(['projectInfo'])
		},
		onReachBottom() { //与methods 同级
			
		},
		methods: {
			changTab(index) {
				let status = this.tabList[index].value
				this.list = status == -1 ? this.listData : this.listData.filter(item => item.status == status)
			},
			getVisaTypeList(event) {
				let result = this.visaTypeList.find(item => item.value == event.type)
				return result ? result.name : ''
			},
			getStatus(type, event) {
				let result = this.statusList.find(item => item.value == event.status)
				if (result) {
					return type == 'class' ? result.class : result.name
				}
				return ''
			},
			getDetails(item) {
				this.toPage(`/pages/construction/changeRecord/changeDetails?id=${item.id}`)
			},
			getList() {
				this.$httpApi.getMyPageChange({
					projectId: this.projectInfo.projectId
				}).then((res) => {
					if (!res) {
						return
					}
					this.list = res
					this.listData = res
				})
			},
			getButton(item) {
				this.toPage('/pages/construction/changeRecord/launchChange')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.tab-contain {
		margin: 0 20rpx 4rpx 20rpx;
		border-radius: 10rpx;
		position: -webkit-sticky;
		position: sticky;
		top: 0rpx;
		z-index: 9;
	}

	.list-contain {
		margin: 2rpx 20rpx 20rpx 20rpx;

		.item-contain {
			background-color: #fff;
			border-radius: 0px 0px 10rpx 10rpx;
			padding: 0 26rpx;
			margin-bottom: 6rpx;
			padding-bottom: 36rpx;

			.top {
				padding: 24rpx 0rpx;
				border-bottom: 2rpx solid #F6F7F9;

				.item-left {
					color: $viceFontColor;
					font-size: $smallFontSize;
				}

				.item-status {
					font-size: $smallFontSize;
				}

				.status-success {
					color: #33B065;
				}

				.status-active {
					color: #002FA5;
				}

				.status-waring {
					color: $errorFontColor;
				}
			}

			.middle {
				padding: 20rpx 0rpx 26rpx 0rpx;

				.name {
					color: #3D3D3D;
					font-size: $middleFontSize;
				}

				.desc-contain {
					margin-top: 18rpx;
					padding: 24rpx 28rpx;
					border-radius: 16rpx;
					background-color: #F6F6F6;

					text {
						color: $seconFontColor;
						font-size: $fontSize26;
					}
				}
			}

			.bottom {

				text {
					font-size: $smallFontSize;
					color: #909199;
					margin-left: 6rpx;
				}
			}
		}
	}
</style>
