<template>
	<view class="list-tab">
		<u-tabs :item-width="itemWidth" :active-color="activeColor" :height="height" :inactive-color="inactiveColor"
			:font-size="fontSize" :list="list" :is-scroll="isScroll" :current="current"
			:active-item-style="activeItemStyle" @change="changTab" :bar-width="barWidth" :bar-height="barHeight"
			:bg-color="baColor"></u-tabs>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: []
			},
			barWidth: {
				type: [String, Number],
				default: '28'
			},
			itemWidth: {
				type: [String, Number],
				default: '175'
			},
			height: {
				type: [String, Number],
				default: '72'
			},
			fontSize: {
				type: [String, Number],
				default: '28'
			},
			activeColor: {
				type: String,
				default: '#002FA5'
			},
			inactiveColor: {
				type: String,
				default: '#787878'
			},
			baColor: {
				type: String,
				default: '#fff'
			},
			barHeight: {
				type: String,
				default: '6'
			},
			isScroll: {
				type: Boolean,
				default: true
			},
			activeItemStyle: {
				type: Object,
				default: function() {
					return {
						color: '#002FA5',
						fontSize: '30rpx'
					}
				},
			}
		},
		data() {
			return {
				option: {},
				current: 0,
			}
		},
		computed: {

		},
		mounted() {

		},
		onShow() {

		},
		onLoad() {},
		methods: {
			changTab(index) {
				this.current = index
				this.$emit('change', index)
			}
		}
	}
</script>
<style scoped>
	/* @import url(); 引入css类 */
</style>
