<template>
	<view>
		<view class="point" v-if="jsondata.style['iconUrl'] == 'under_line'">POINT</view>
		<view class="edit-icontitle">
			<!--    <text class="icon"></text>-->
			<image :class="jsondata.style['iconUrl']=='icon_title1'?'edit-icontitle-img':'icontitle-img-other'"
				v-if="jsondata.style['iconUrl'] !== 'no_title'&&jsondata.style['iconUrl'] !== 'under_line'"
				:src="getIconUrl(jsondata.style['iconUrl'])" />
			<view>
				<view
					:class="jsondata.style['iconUrl']=='icon_title1'?'icon_title1':jsondata.style['iconUrl']=='under_line'?'wordInput':'other-input'">
					{{ jsondata.data.content || jsondata.content }}
				</view>
				<view class="edit-sorted-bottom" v-if="jsondata.style['iconUrl'] == 'under_line'"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'edit-icontitle',
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				iconTitle1: 'https://www.51mihuo.com/static/images/icon_title.png',
				iconTitle2: 'https://www.51mihuo.com/static/images/icon_title2.png',
				iconTitle3: 'https://www.51mihuo.com/static/images/icon_title3.png'
			}
		},
		methods: {
			getIconUrl(data) {
				if(!data){
					return this.iconTitle1
				}
				if (data.indexOf('icon_title') > -1) {
					switch (data) {
						case 'icon_title1':
							return this.iconTitle1
							break
						case 'icon_title2':
							return this.iconTitle2
							break
						case 'icon_title3':
							return this.iconTitle3
							break
					}
				} else {
					return this.$util.thumbnailImage(data)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.point {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
	}

	.icon_title1 {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
	}

	.edit-icontitle {
		display: flex;
		flex-flow: wrap;
		align-items: center;
		margin-top: 20rpx;

		.edit-sorted-bottom {
			position: relative;
			height: 10rpx;
			width: 100%;
			background: linear-gradient(90deg, #FFFFFF, #FE6E32, #FFDED1);
			border-radius: 5rpx;
		}

		.edit-icontitle-img {
			width: 45rpx;
			height: 45rpx;
			border-radius: 50%;
			margin-right: 26rpx;
		}

		.icontitle-img-other {
			width: 28rpx;
			height: 28rpx;
			margin-right: 26rpx;
		}

	}

	.wordInput {
		font-size: 30rpx;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #141414;
	}

	.other-input {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #141414;
	}
</style>
