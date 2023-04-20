<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title">
				觅友圈
			</view>
			<view slot="right" class="right-icon" @click="goToAddMiyou">
				<image src="https://www.51mihuo.com/static/icon/miyou/button_1.png" class="icon"></image>
			</view>
		</z-nav-bar>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" top="80" :topbar="true" :down="downOption" :up="upOption"
			@down="downCallback" @up="upCallback">
			<view class="waterfall" v-if="miyouList.length > 0">
				<user-mh-u-waterfall v-model="miyouList" ref="waterfall" addTime="250">
					<template v-slot:left="{ leftList }">
						<mh-miyou-card v-for="(item, index) in leftList" :key="item.id" :miyouItem="item">
						</mh-miyou-card>
					</template>
					<template v-slot:right="{ rightList }">
						<mh-miyou-card v-for="(item, index) in rightList" :key="item.id" :miyouItem="item">
						</mh-miyou-card>
					</template>
				</user-mh-u-waterfall>
			</view>
			<user-mh-empty v-else title="这里还什么都没有" marginTop="0"></user-mh-empty>
		</mescroll-uni>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downOption: {
					use: true,
					auto: false
				},
				upOption: {
					use: true,
					auto: false,
					textNoMore: '',
				},
				mescroll: null,
				total: 0,
				currentPage: 1,
				miyouList: [],
				userId: uni.getStorageSync('userData') ? uni.getStorageSync('userData').sysUser.userId : ''
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {},
		methods: {
			goToAddMiyou() {
				this.toPage('/pages-user/miyou/addMiyou')
				uni.$once('updateMiyou', () => {
					this.downCallback()
					this.mescroll.resetUpScroll()
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback() {
				this.currentPage = 1
				this.$refs.waterfall && this.$refs.waterfall.clear();
				this.miyouList = []
				this.getData()
			},
			upCallback() {
				this.currentPage++;
				this.getData()
			},
			getData() {
				this.$httpApi.getMiYouList({
					size: 10,
					current: this.currentPage,
					userId: this.userId
				}).then(res => {
					if (res.records) {
						this.miyouList = this.currentPage > 1 ? this.miyouList.concat(res.records) : res.records
						this.total = res.total;
						this.mescroll.endBySize(10, this.total, true);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.right-icon {
		margin-right: 20rpx;

		.icon {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.tabs {
		width: 100vw;
		height: 88rpx;
		margin-bottom: 20rpx;
	}

	.waterfall {
		width: 690rpx;
		margin: 0 auto;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
