<template>
	<view class="view-acceptance-criteria">
		<view class="list-contian" v-if="acceptanceItemTemplateList.length > 0">
			<view class="item-contain" v-for="(item,index) in acceptanceItemTemplateList" :key="index">
				<view class="item—other">
					<view class="item-index">0{{index+1}}</view>
					<text class="item-name">{{item.itemName}}</text>
				</view>
				<view class="image-contain" v-if="item.standardImg">
					<u-lazy-load class="item-image" height="188"
						:style="{ width: '188rpx' }" @click="preview(url)" imgMode="aspectFill" border-radius="10"
						:image="$util.thumbnailImage(item.standardImg ,true)">
					</u-lazy-load>
				</view>
			</view>
		</view>
		<mh-empty v-else title="还没有数据～～" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				details: {},
				detailsShow: false,
				acceptanceItemTemplateList: []
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad(option) {
			this.option = option
			this.getDetails()
		},
		methods: {
			getDetails() {
				if (!this.option.skillId) {
					return
				}
				this.$httpApi.getSysjobskill({
					// skillId: this.option.skillId,
					skillId: '11'
				}).then(res => {
					if (res) {
						//查询验收标准
						this.$httpApi.getTemplateById({
							templateId: res.acceptanceTemplateId
						}).then(res => {
							if (res) {
								// this.details = res
								// this.detailsShow = true
								this.acceptanceItemTemplateList = res.acceptanceItemTemplateList
							}
						})
					}
				})
			},
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
	.view-acceptance-criteria {
		padding: 20rpx;
		border-top: 20rpx solid #f5f5f5;
		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;

		.item-contain {
			margin-bottom: 32rpx;
			display: flex;
			flex-direction: column;

			.item-index {
				font-size: 24rpx;
				color: #909199;
				margin-right: 12rpx;
				padding-top: 6rpx;
			}

			.item-name {
				font-size: 28rpx;
				color: #303133;
			}
		
			.item—other{
				display: flex;
				margin-bottom: 14rpx;
			}
			
			.image-contain{
				padding-left: 40rpx;
			}
			
		}
	}

</style>
