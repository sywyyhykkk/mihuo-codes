<template>
	<view class="house flex-box" v-if="data && data.length" @click="showPopup">
		<view class="flex-box house-left">
			<view v-for="(item, index) in copyData" :key="index" class="flex-box">
				<input type="number" disabled class="house-input"
					placeholder-style="font-size:28rpx;text-align:center;font-weight: normal;" placeholder="0"
					v-model="item.extra">
				<text>{{ item.label }}</text>
			</view>
		</view>
		<view class="house-right">
			<!-- #ifdef APP-PLUS -->
			<image class="icon" mode="aspectToFit" src="@/pages-homeCall/static/icon/arrow_18x12.png" />
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<mihuo-image class="icon" src="https://www.51mihuo.com/static/icon/home_v3/arrow_18x12.png">
			</mihuo-image>
			<!-- #endif -->
		</view>
		<mihuo-popup :is-show-button="true" ref="mihuoPopup" title="选择户型" @cancel="cancel" @confirm="confirm">
			<view class="flex-box">
				<view class="content-item flex-box" v-for="item, index in data" :key="index"
					:style="{ height: itemHeight + 'rpx'}">
					{{ item.label }}
					<view class="number-box" v-for="num, i in list[index]" :key="i"
						@click="selectValue(num.extra, index)" :class="{ selected: i === defaultValue[index] }">
						{{ num.extra }}
					</view>
				</view>
			</view>
		</mihuo-popup>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Array,
				default: () => []
			}
		},
		data() {
			let containerHeigt = 962 - 118 - 127
			let itemHeight = 962 - 118 - 127 - 20
			// #ifdef MP-WEIXIN
			containerHeigt += 40
			itemHeight += 40
			// #endif
			return {
				containerHeigt,
				itemHeight,
				list: [],
				data: [],
				copyData: [],
				defaultValue: [],
				copyDefaultValue: []
			}
		},
		mounted() {
			this.data = this.value
			this.list = []
			this.defaultValue = []
			if (this.data && this.data.length) {
				this.data.some((item, index) => {
					item.extra = item.defaultValue || null
					let defaults = item.extra > 0 ? Number(item.extra) - 1 : item.extra
					this.defaultValue.push(defaults)
					let arr = []
					for (let i = 1; i < 6; i++) {
						let obj = {};
						obj.label = i + item.label
						obj.extra = i
						obj.value = i
						arr.push(obj)
					}
					this.list.splice(index, 0, arr)
				})
				this.copyData = JSON.parse(JSON.stringify(this.data))
				this.$emit("change", this.copyData)
			}
		},
		methods: {
			showPopup() {
				this.copyDefaultValue = JSON.parse(JSON.stringify(this.defaultValue))
				this.$refs.mihuoPopup.open()
			},
			confirm() {
				this.$emit("change", this.data)
				this.copyData = JSON.parse(JSON.stringify(this.data))
				this.$refs.mihuoPopup.close()
			},
			selectValue(value, index) {
				const arr = this.defaultValue
				this.defaultValue = []
				this.data[index].extra = '' + value
				arr[index] = value - 1
				this.defaultValue = arr
			},
			cancel() {
				this.defaultValue = this.copyDefaultValue
				this.defaultValue.forEach((item, index) => {
					this.data[index].extra = item + 1
				})
				this.$refs.mihuoPopup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-box {
		display: flex;
		align-items: center;
	}

	.house {
		width: 690rpx;

		.house-left {
			flex: 1;

			.house-input {
				background: #F7F7F7;
				color: #000000;
				font-weight: bold;
				font-size: 28rpx;
				text-align: center;
				border-radius: 10rpx;
				background: #F7F7F7;
			}

			text {
				color: #808080;
				font-size: 24rpx;
				font-family: NotoSansHans-Regular;
				white-space: nowrap;
				padding: 0 20rpx;
			}
		}

		.house-right {
			flex-shrink: 0;
			width: 18rpx;
			height: 12rpx;

			.icon {
				width: 100%;
				height: 100%;
			}
		}
	}

	.header-container {
		width: 100vw;
		height: 118rpx;
		justify-content: space-between;
		padding: 0 30rpx;

		.title {
			height: 118rpx;
			line-height: 118rpx;
			font-size: 30rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			color: #000000;
		}
	}

	.content-container {
		width: 100vw;
		border-top: #F7F7F7 20rpx solid;

		.content-item {
			@include safearea();
			align-items: center;
			flex-direction: column;
			padding-top: 30rpx;
			flex: 1;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
			line-height: 34rpx;

			.number-box {
				width: 112rpx;
				height: 72rpx;
				text-align: center;
				background: #F0F0F0;
				border-radius: 10rpx;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 400;
				color: #000000;
				line-height: 72rpx;
				margin-top: 20rpx;
			}

			.selected {
				width: 112rpx;
				height: 72rpx;
				text-align: center;
				background-color: #FCEBE3;
				border: 2rpx solid #FE6E32;
				border-radius: 10px;
				font-size: 24rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #FE6E32;
				line-height: 72rpx;
			}
		}
	}

	.button-container {
		width: 100vw;
		height: 127rpx;
		justify-content: space-around;

		.button-item {
			width: 335rpx;
			height: 88rpx;
			background: #F0F0F0;
			border-radius: 44rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 500;
			line-height: 88rpx;
		}

		.cancel {
			background: #F0F0F0;
			color: #666666;
		}

		.confirm {
			background: #FE6E32;
			color: #FFFFFF;
		}
	}
</style>
