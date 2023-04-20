<template>
	<view class="evaluation-details" v-if="detailsShow">
		<evaluation-item :jump="true" :info="details">
			<view class="evaluation-contain">
				<view class="item-value" index="1">
					<mihuo-rate title="按时交付" v-model="details.deliveryScore" show></mihuo-rate>
				</view>
				<view class="item-value" index="2">
					<mihuo-rate title="节点完成" v-model="details.nodeScore" show></mihuo-rate>
				</view>
				<view class="item-value" index="3">
					<mihuo-rate title="服务态度" v-model="details.serveScore" show></mihuo-rate>
				</view>
			</view>
		</evaluation-item>
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
				rateNum: 5,
				details: {},
				detailsShow: false,
				option: {

				}
			}
		},
		onLoad(option) {
			this.option = option
			this.getDateils()
		},
		computed: {
		   ...mapState(['projectInfo'])
		  },
		methods: {
			getDateils() {
				this.$httpApi.getByDetail({
					personId: this.option.personId,
					projectId: this.projectInfo.projectId
				}).then(res => {
					this.details = res
					if (!res) {
						return
					}
					res['labelsList'] = res.labels &&  res.labels.split(',')
					res['jobName'] = res.person && res.person.skillName
					res['name'] = res.person && res.person.name
					res['avatar'] = res.person && res.person.avatar
					res['dealRealName'] = res.dealPerson && res.dealPerson.name
					res['dealJobName'] = res.dealPerson && res.dealPerson.skillName
					res['dealAvatar'] = res.dealPerson && res.dealPerson.avatar
					this.detailsShow = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluation-details {
		padding-top: 16rpx;

		.evaluation-contain {
			padding-right: 44rpx;

			.item-value {
				margin-bottom: 32rpx;

			}
		}
	}
</style>
