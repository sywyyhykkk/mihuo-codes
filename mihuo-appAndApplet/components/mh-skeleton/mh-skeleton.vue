<template>
	<view>
		<view v-if="loading" class="skeleton" :class="{ animate: animate }" :style="{ 
					margin: hasMargin ? '0 30rpx' : '0',
					justifyContent: flexType,
					marginTop: titleMarginTop + 'rpx',
					display: openFlex ? 'flex' : 'block'
					}">
			<!-- 轮播图 -->
			<view v-if="imgTitle && !mini" class="skeleton-imgTitle" :style="{ height: imgTitleHeight + 'rpx' }"></view>
			<!-- 头像图 -->
			<view v-if="showAvatar" class="skeleton-avatar" v-for="(item, index) in nameRow" :key="index"
				:class="[avatarShape]" :style="{ width: avatarSize, height: avatarSize}"></view>
			<!-- 文字条 -->
			<view class="skeleton-content" v-if="showTitle">
				<view class="skeleton-title" :style="{ width: titleWidth }"></view>
				<view class="skeleton-rows">
					<view class="skeleton-row-item" v-for="(item, index) in rowList" :key="index"
						:style="{ width: item.width }"></view>
				</view>
			</view>
			<!-- 小图 -->
			<view v-if="mini" class="skeleton-img">
				<view class="img-item" v-for="item, index in rowList" :key="index"
					:style="{ height: imgTitleHeight + 'rpx', width: imgTitleWidth - 10 + 'rpx' }">
				</view>
			</view>
		</view>
		<view v-else>
			<slot></slot>
		</view>
	</view>
</template>
<script>
	const DEFAULT_ROW_WIDTH = '100%'
	const DEFAULT_LAST_ROW_WIDTH = '60%'

	export default {
		props: {
			hasMargin: {
				type: Boolean,
				default: true
			},
			loading: {
				type: Boolean,
				default: true
			},
			openFlex: {
				type: Boolean,
				default: false,
			},
			pageTitle: {
				type: Boolean,
				default: true
			},
			titleMarginTop: {
				type: Number,
				default: 0
			},
			// 显示小图
			mini: {
				type: Boolean,
				default: false,
			},
			imgTitle: {
				type: Boolean,
				default: true,
			},
			imgTitleHeight: {
				type: Number,
				default: 200
			},
			imgTitleWidth: {
				type: Number,
				default: 200
			},
			nameRow: {
				type: Number,
				default: 1,
			},
			flexType: {
				type: String,
				default: 'flex-start', // center	居中	√		space-between	两端对齐	√		space-around	子元素拉手分布	√		flex-start	居左		flex-end	居右
			},
			showAvatar: {
				type: Boolean,
				default: false,
			},
			avatarSize: {
				type: String,
				default: '50px',
			},
			avatarShape: {
				type: String,
				default: 'round', // square | round
			},
			showTitle: {
				type: Boolean,
				default: true,
			},
			titleWidth: {
				type: String,
				default: '40%',
			},
			row: {
				type: Number,
				default: 3,
			},
			animate: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {}
		},
		computed: {
			rowList() {
				let list = []
				for (let i = 0; i < this.row; i++) {
					list.push({
						width: i === this.row - 1 && i !== 0 ? DEFAULT_LAST_ROW_WIDTH : DEFAULT_ROW_WIDTH,
					})
				}
				return list
			},
		},
	}
</script>

<style>
	.skeleton {
		/* margin: 0 30rpx; */
		--bg-color: #f2f3f5;
		--row-height: 50rpx;
		--row-margin-top: 30rpx;
	}

	.skeleton-imgTitle {
		flex-wrap: wrap;
		background: var(--bg-color);
		margin: 10px auto 30rpx auto;
		width: 100%;
		border-radius: 10px;
		display: block;
	}

	.skeleton-img {
		width: 100%;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 20rpx;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.img-item {
		border-radius: 10px;
		background: var(--bg-color);
	}

	.skeleton-avatar {
		flex-shrink: 0;
		background: var(--bg-color);
		margin-right: 8px;
	}

	.skeleton-avatar.round {
		border-radius: 50%;
	}

	.skeleton-content {
		width: 100%;
	}

	.skeleton-title {
		background-color: var(--bg-color);
		height: var(--row-height);
	}

	.skeleton-title+.skeleton-rows {
		margin-top: var(--row-margin-top);
	}

	.skeleton-row-item {
		background-color: var(--bg-color);
		height: var(--row-height);
	}

	.skeleton-row-item:not(:first-child) {
		margin-top: var(--row-margin-top);
	}

	.skeleton.animate {
		animation: skeleton-blink 1.2s ease-in-out infinite;
	}

	@keyframes skeleton-blink {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0.6;
		}

		100% {
			opacity: 1;
		}
	}
</style>
