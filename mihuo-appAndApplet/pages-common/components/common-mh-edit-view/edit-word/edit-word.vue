<template>
	<view class="editWord flex-center" :style="[fontStyle]">
		<text :style="[fontStyle]"
			:class="jsondata.options.classname">{{jsondata.content.replace(new RegExp(/( )/g),"&nbsp")}}</text>
	</view>
</template>

<script>
	export default {
		name: "edit-word",
		props: {
			jsondata: {
				type: Object,
				default: () => ({})
			}
		},
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
	.editWord {
		background-color: #fff;
		.small {
			font-size: 28rpx;
			line-height: 1.8;
		}

		.default {
			font-size: 32rpx;
			line-height: 1.8;
		}

		.middle {
			font-size: 36rpx;
			line-height: 1.8;
		}
		.large {
			font-size: 40rpx;
			line-height: 1.8;
		}
	}
</style>
