<template>
	<view>
		<view class="log-top" v-if="personInfo.person">
			<u-avatar class="avatar" size="72" :src="$util.avatarImage(personInfo.person.userId)" />
			<view class="right">
				<view class="nameInfo">
					<view class="log_name">{{ personInfo.person.name }}</view>
					<text class="log_skill-name">{{ personInfo.skillName }}</text>
				</view>
				<view class="slotinfo">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "order-receiving",
		props: {
			personInfo: {
				type: Object,
				default: () => ({})
			},
		},
		watch: {

		},
		data() {
			return {

			};
		},
		computed: {
			// 人工费合计

		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	.log-top {
		display: flex;
		align-items: center;
        justify-content: center;
		.right {
			flex: 1;
			.nameInfo {
				display: flex;
				align-items: center;
				.log_name {
					color: #141414;
					font-size: 28rpx;
					font-weight: bold;
					padding: 0 20rpx;
				}

				.log_skill-name {
					font-size: 18rpx;
					font-family: HuXiaoBo-NanShen;
					font-weight: 400;
					color: #FE6E32;
					background: #FFF0EA;
					padding: 7rpx 10rpx;
					border-radius: 10px 2px 10px 0px;
				}
			}
			.slotinfo{
				padding: 0 20rpx;
			}
		}

	}
</style>
