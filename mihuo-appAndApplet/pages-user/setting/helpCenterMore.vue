<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar-title" slot="default"> {{ typeName }}</view>
			<uni-icons v-if="isShowPhone" slot="right" size="22" type="phone" style="margin-right: 40rpx;"
				color="#909199" @click="makePhoneCall"></uni-icons>
		</z-nav-bar>
		<view class="help_center">
			<view class="" v-if="itemList.length > 0">
				<view class="list" v-for="(item, index) in itemList" :key="index" @click="open(index)">
					<view class="top_view">
						<view class="dot" />
						<view class="title">{{item.title}}</view>
						<u-icon size="22" class="arrow" :name="item.open ?'arrow-down':'arrow-up'"></u-icon>
					</view>
					<view class="body" v-if="item.open && item.content">
						<view v-html="getTextData(contentItem.content)" class="content" v-for="contentItem, index in JSON.parse(item.content)" :key="index">
						</view>
					</view>
				</view>
			</view>
			<user-mh-empty v-show="itemList.length === 0" icon="https://www.51mihuo.com/static/images/no_recommend.png" title="还没有数据～～" />
			<u-action-sheet :safe-area-inset-bottom="true" v-model="isShowSheet" :list="actionList" @click="confirmAction"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				actionList: [{
						text: '19988450915'
					},
					{
						text: '13880286443'
					}
				],
				isShowSheet: false,
				itemList: [],
				typeTreeCode: '',
				typeName: '帮助中心',
				isShowPhone: false,
				current: 1,
				pages: 0,
				status: 'loadmore'
			}
		},
		onLoad(option) {
			if (option.typeTreeCode) {
				this.typeTreeCode = option.typeTreeCode
			}
			if (option.typeName) {
				this.typeName = option.typeName
			}
			if (option.typeName === '投诉举报') {
				this.isShowPhone = true
			}
			this.getCMSData()
		},
		onReachBottom() {
			if (this.current < this.pages) {
				this.current += 1
				this.status = 'loadmore'
				this.getCMSData()
			} else {
				this.status = 'nomore'
				return
			}
		},
		methods: {
			getTextData(content){
				return content.replace(/\n/g, '<br/>')
			},
			getCMSData() {
				this.$httpApi.getCMSContent({
					size: 20,
					current: this.current,
					cityOperatorId: -1,
					typeTreeCode: this.typeTreeCode
				}).then(res => {
					if (res) {
						this.pages = res.pages
						if (this.current === 1) {
							this.itemList = []
						}
						res.records.forEach(item => {
							this.itemList.push({
								open: false,
								...item
							})
						})
						if (this.itemList.length === +res.total) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}
					}
				})
			},
			confirmAction(e){
				uni.makePhoneCall({
					phoneNumber: this.actionList[e].text
				})
			},
			makePhoneCall() {
				this.isShowSheet = true
			},
			open(i) {
				this.itemList[i].open = !this.itemList[i].open
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.help_center {
		background: #FFFFFF;
		padding: 0 54rpx 0 34rpx;
		padding-bottom: 10rpx;

		.list {
			padding: 40rpx 0;
			border-bottom: 1px dashed #E7E7E7;

			&:nth-last-child(1) {
				border-bottom: none;
			}

			.top_view {
				display: flex;
				align-items: center;

				.dot {
					width: 12rpx;
					height: 12rpx;
					margin-right: 12rpx;
					border-radius: 50%;
					background: $themeColor;
				}

				.title {
					width: calc(100% - 12rpx - 16rpx);
					font-weight: 400;
					font-size: $middleFontSize;
					color: $seconFontColor;
					@include toe()
				}

				.arrow {
					transition: all .2s;
				}
			}

			.body {
				margin: 26rpx 28rpx 0 12rpx;
				
				.content {
					font-size: $smiddleFontSize;
					line-height: 18px;
					color: $viceFontColor;
				}
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
