<template>
	<view class="skill" ref="tag">
		<text>{{ getTitle }}</text>
	</view>
</template>

<script>
	export default {
		name: "skill-type-tag",
		props: {
			title: {
				default: '技能',
				type: String,
			},
		},
		data() {
			return {

			};
		},
		computed: {
			getTitle() {
				if (!this.title) return '其他'
				if (this.title.length <= 3) {
					return this.title
				}
				return this.title.substring(this.title.length - 2)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.skill {
		width: max-content;
		padding: 0 20rpx 0 10rpx;
		height: 30rpx;
		background-size: cover;
		background-repeat: round;
		margin-top: 4rpx;
		background-image: url('../../static/icon/skill_type_tag_2.png');

		text {
			width: max-content;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 20rpx;
			line-height: 30rpx;
			color: #002FA5;
		}
	}
</style>
