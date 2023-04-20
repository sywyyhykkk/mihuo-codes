<template>
	<!-- 工艺标准、统一工价、品质保障、售后无忧 -->
	<view class="process-contain">
		<z-nav-bar>
			<view class="nav-bar" slot="default">
				{{ title }}
			</view>
		</z-nav-bar>
		<view class="order-classification">
			<view class="order-status-list">
				<u-tabs :list="orderTypeList" :show-bar="false" font-size="28" :gutter="60" inactive-color="#909299"
					active-color="#002FA5" :is-scroll="true" :current="currentNew" @change="changeStatus">
				</u-tabs>
			</view>
		</view>
		<view class="item-content" v-if="orderList.length > 0">
			<view v-for="(item,index) in orderList" :key="index" @click="cutType(item,index)">
				<!-- 有封面图 -->
				<view class="process-item-bg" v-if="item.facePic">
					<view class="bg-content" :style="{backgroundImage: `url(${$util.thumbnailImage(item.facePic)})`}">
						<!-- 有封面图时不显示标题 -->
						<!-- <text class="bg-title">{{ item.title }}</text> -->
					</view>
					<text class="bg-des">{{ item.desc }}</text>
				</view>
				<!-- 没有封面图 -->
				<view class="process-item" v-else>
					<view class="content">
						<view><text style="color: #33333; font-size: 32rpx; line-height: 72rpx;">{{ item.title }}</text>
						</view>
						<view><text style="font-size: 24rpx; color: #333333;">{{ item.desc }}</text></view>
					</view>
				</view>
			</view>
			<view style="margin: 20rpx 0;">
				<u-loadmore :status="status"></u-loadmore>
			</view>
		</view>
		<mh-empty v-else title="暂时没有相关内容~"></mh-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option: {},
				currentNew: 0,
				orderTypeList: [],
				orderList: [],
				current: 1,
				typeTreeCode: '' ,// 内容分类
				typeName: '',
				current: 1,
				pages: 0,
				status: 'loadmore',
				title: ''
			}
		},
		onLoad(option) {
			this.typeName = option.typeName
			this.title = this.typeName
			this.getCMSType()
		},
		onReachBottom() {
			if(this.current < this.pages){
				this.current += 1
				this.selectCmsDetails()
				this.status = 'loadmore'
			} else {
				this.status = 'nomore'
				return
			}
		},
		methods: {
			cutType(item, index) {
				uni.navigateTo({
					url: '/pages/mine/cms?list=' + JSON.stringify(item)
				})
			},
			changeStatus(index) {
				this.current = 1
				this.currentNew = index
				this.typeTreeCode = this.orderTypeList[index].typeTreeCode
				this.selectCmsDetails()
			},
			// 获取内容分类
			getCMSType() {
				this.$httpApi.getCMSType({
					typeName: this.typeName,
					typeTreeCodeExtra: 'SUB_ONLY',
					size: 99,
				}).then(res => {
					if(res){
						this.typeTreeCode = res.records[0].typeTreeCode // 获取第一个二级分类的内容
						this.selectCmsDetails()
						res.records.forEach(item => {
							this.orderTypeList.push({
								name: item.typeName,
								...item
							})
						})
					}
				})
			},
			// 获取内容列表
			selectCmsDetails() {
				this.$httpApi.getCMSContent({
					size: 10,
					current: this.current,
					typeTreeCode: this.typeTreeCode,
				}).then(res => {
					if(res){
						this.pages = res.pages
						if(this.current === 1){
							this.orderList = res.records
						} else {
							this.orderList = this.orderList.concat(res.records)
						}
						if(this.orderList.length === +res.total){
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}
					}
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	
	.nav-bar {
		@include nav-bar-title(#333333)
	}
	
	.process-contain {
		height: max-content;

		.item-content {
			.process-item {
				width: 100vw;
				min-height: 112rpx;
				height: max-content;
				display: flex;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.content {
					flex: 1;
				}

				.image {
					width: 300rpx;
				}
			}

			.process-item-bg {
				width: 100vw;
				height: max-content;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.bg-content {
					width: 100%;
					height: 300rpx;
					background-size: cover;
					border-radius: 20rpx;
					margin-bottom: 20rpx;

					.bg-title {
						width: 100%;
						height: 108rpx;
						padding: 10rpx 20rpx;
						color: #FFFFFF;
						font-size: 32rpx;
						text-shadow: 5rpx 5rpx #000000;
						font-weight: bold;
						position: relative;
						left: 40rpx;
						top: 100rpx;
					}
				}

				.bg-des {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}
</style>
