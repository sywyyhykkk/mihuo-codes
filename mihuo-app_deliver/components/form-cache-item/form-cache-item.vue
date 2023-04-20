<template>
	<view class="form-cache-item" v-if="show">
		<text class="item-text" @click="recoveryCache()">您在{{time}}分修改记录未正常保存，点击恢复</text>
		<u-icon name="close-circle" color="#FF5D35" size="28" @click="getShow()"></u-icon>
	</view>
</template>

<script>
	import formCache from '@/plugins/formCache'
	import moment from '@/static/js/moment.js'
	export default {

		props: {
			cacheId: {
				type: [String, Number],
				default: ''
			},
			type:{
				type: String,
				default: '问卷'
			}
		},
		data() {
			return {
				option: {},
				show: false,
				time: ''
			}
		},
		computed: {},
		mounted() {
			this.getTime()
			uni.$on('formCache', (data) => {
				if (data) {
					this.show = new formCache().isCacheTimeShow(data, this.type)
				}
			})
		},
		beforeDestroy() {
			uni.$off('formCache')
		},
		methods: {
			getTime() {
				if (!this.cacheId) {
					return
				}
				let tempFormCache = new formCache().getCacheTime(this.cacheId)
				if (tempFormCache) {
					this.time = moment(tempFormCache.createdTime).startOf('minute').fromNow()
				}
			},
			recoveryCache() {
				this.$emit('recovery')
			},
			getShow() {
				let tempParameter = {
					cacheId: this.cacheId,
					items: ''
				}
				new formCache().removelCache(tempParameter, this.type)
				this.show = false
			},
			/**
			 * 巡检、内验、外验
			 * */
			getCacheOther(data,type){
				this.show = new formCache().isCacheTimeShow(data, type)
			},
			eliminate() {
				this.show = false
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* @import url(); 引入css类 */
	.form-cache-item {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 34rpx;
		margin-bottom: 12rpx;
		background-color: rgba(255, 93, 53, 0.1);
		display: flex;
		justify-content: space-between;

		.item-text {
			color: #FF5D35;
			font-size: 28rpx;
		}


	}
</style>
