<template>
	<view class="materials-type-screen" v-if="data.length > 0">
		<view class="children-item-contain">
			<scroll-view class="right-nav-bar" :scroll-y="true">
				<view class="children-item" :class="[childrenActiveIndex === index ? 'children-item-active':'']"
					@click="getchildren(index)" v-for="(item,index) in data" :key="item.id">
					{{item.name}}
					<u-icon v-if="item.children && item.children.length > 0" name="arrow-right" class="x6-icon"
						:color="childrenActiveIndex === index ? '#002FA5':'#d1d1d1' " size="28"></u-icon>
				</view>
			</scroll-view>
		</view>
		<!-- 递归出口  @selectActive-->
		<view class="recursive"
			v-if="data[dataActiveIndex] && data[dataActiveIndex].children &&  data[dataActiveIndex].children.length > 0 ">
			<materials-type-screen-item @selectActive="emitItem" :data="data[dataActiveIndex].children">
			</materials-type-screen-item>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 材料类型筛选
	 * @property {Array}
	 */
	export default {
		name: 'materials-type-screen-item',
		props: {
			data: {
				type: Array,
				default: function(e) {
					return []
				}
			}
		},
		data() {
			return {
				childrenActiveIndex: -1,
				dataActiveIndex:-1,
			}
		},
		methods: {
			getchildren(index) {
				if(this.data[index].show){
					this.dataActiveIndex = index
				}else{
					this.dataActiveIndex = -1
				}
				this.childrenActiveIndex = index
				this.emitItem(this.data[index])
				this.data[index].show = !this.data[index].show
			},
			emitItem(data) {
				this.$emit('selectActive', data);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.materials-type-screen {
		display: flex;
		flex: 1;

		.children-item-contain {
			.children-item {
				padding: 20rpx 20rpx;
				margin: 0rpx 12rpx;
				font-size: $smallFontSize;
				display: flex;
				align-items: center;
				justify-content: space-between;
				white-space: nowrap;
				border-bottom: 2rpx solid #ebebeb;


				image {
					width: 24rpx;
					height: 24rpx;
				}
			}

			.children-item-active {
				color: $themeColor;
			}
		}
	}

	.children-item-contain {
		display: flex;
		flex-direction: column;
		flex: 1;
		border-right: 2rpx solid #ebebeb;
		height: 90%;
		overflow: hidden;

		.right-nav-bar {
			height: calc(100% - 70rpx);
		}

	}

	.recursive {
		display: flex;
		flex: 1;
	}
</style>
