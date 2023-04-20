<template>
	<view class="score-contain">
		<view class="score-label" v-if="title">{{title}}</view>
		<view class="imge-star">
			<image :src="item.src" mode="" v-for="(item,index) in starList" :key="index" @click="getStar(item,index)">
			</image>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 评星
	 * @property {String}			  title       名称
	 * @property {String || Boolean}  show         是否使用默认图片、默认关闭
	 * @property {String | Number}	  value
	 */
	export default {
		props: {
			title: {
				default: '按时交付',
				type: String
			},
			show:{
				default: false,
				type: [String, Boolean],
			},
			value:{
				type: [String, Number],
				default: 4
			}
		},
		data() {
			return {
				starList: [],
				activeIndex: 0,
				count:0,
			}
		},
		watch: {
			starList: {
				handler(newVal, oldVal) {
					this.count = 0
					newVal.map(item =>{
						if(item.status){
							this.count++
						}
					})
					this.$emit('input',this.count)
				},
				deep: true
			}
		},
		mounted() {
			this.initializeData()
		},
		methods: {
			initializeData() {
				for (let i = 0; i < 5; i++) {
					this.starList.push({
						src: i < Number(this.value) ? '/static/images/star-active.png' : '/static/images/star-no.png',
						default: '/static/images/star-no.png',
						active: '/static/images/star-active.png',
						status: i <  Number(this.value) ? 1 : 0
					})
				}
			},
			getStar(item, index) {
				if(this.show){
					return
				}

				if (item.status) {
					if (index === 0) {
						this.activeIndex++
					} else {
						this.activeIndex = 0
					}
					for (let i = this.starList.length; i > index + 1; i--) {
						this.starList[i - 1].src = item.default
						this.starList[i - 1].status = 0

						if (index === 0 && this.starList[i - 1].status === 0 && this.activeIndex === 2) {
							this.starList[0].src = item.default
							this.starList[0].status = 0
							this.activeIndex = 0
						}
					}
				} else {
					if (index !== 0) {
						this.activeIndex = 0
					}
					for (let i = 0; i < index + 1; i++) {
						this.starList[i].src = item.active
						this.starList[i].status = 1
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.score-contain {
		display: flex;

		.score-label {
			font-size: 28rpx;
			color: #606166;
			margin-right: 20rpx;
		}

		.imge-star {
			display: flex;

			image {
				width: 34rpx;
				height: 32rpx;
				margin-right: 14rpx;

				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
</style>
