<template>
	<view class="recommended-mall">
		<view class="mall-list flex-center">
			<u-waterfall v-model="jsondata.listdata" ref="waterfall">
				<template v-slot:left="{ leftList }">
					<view class="mall-item" :key="index" v-for="(item, index) in leftList">
						<commodity-card :commodity="item"></commodity-card>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="flex-center mall-item" style="justify-content: flex-end" :key="index"
						v-for="(item, index) in rightList">
						<commodity-card :commodity="item"></commodity-card>
					</view>
				</template>
			</u-waterfall>
		</view>
	</view>
</template>

<script>
	export default {
		name: "edit-product",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {},
		data() {
			let fontStyle = {}
			const sizeStyle = {}
			const colorStyle = {}
			for (const key in this.jsondata.style.size) {
				sizeStyle[key] = key === 'fontWeight' ? this.jsondata.style.size[key] : this.jsondata.style.size[key] +
					'px'
			}
			fontStyle = {
				...sizeStyle,
				...this.jsondata.style.color
			}
			return {
				fontStyle: fontStyle
			};
		}
	}
</script>

<style lang="scss" scoped>
	.recommended-mall {
		width: 690rpx;
		padding: 0 30rpx 0;
		flex-direction: column;

		.mall-list {
			width: 690rpx;
			margin-top: 10rpx;
			flex-direction: row;
			justify-content: space-between;

			.mall-item {
				width: 345rpx;
			}
		}
	}
	
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
