<template>
	<view>
		<!-- 工艺标准、统一工价、品质保障、售后无忧 -->
		<z-nav-bar backState="1000" :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">
				{{ title }}
			</view>
		</z-nav-bar>
		<view class="article-contain" v-if="status">
			<edit-view v-model="detail.content"></edit-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				option: {},
				detail: '[]',
				status: false,
				treeCode: '',
				title: '',
			}
		},
		onLoad(option) {
			this.option = option
			this.title = option.title
			this.selectCmsDetails()
			if (option.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('内容页', url, this.option.userId)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onShareAppMessage() {
			const coverImg = ''
			const query = this.option.id ? `id=${this.option.id}` : `typeTreeCode=${this.option.typeTreeCode}`
			const path = `/pages/home/article?${query}`
			const result = this.$util.shareToWechat(`家装知识早知道：${this.title}`, coverImg, path, '内容页', true, 1)
			return result
		},
		methods: {
			selectCmsDetails() {
				if (!this.option.id) {
					this.$httpApi.getCMSContent({
						typeTreeCode: this.option.typeTreeCode
					}).then(res => {
						if (res) {
							this.detail = res.records[0]
							this.status = true
						}
					})
				} else {
					this.$httpApi.getCMSContentById({
						id: this.option.id,
					}).then(res => {
						if (res) {
							this.detail = res
							this.status = true
						}
					});
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	.nav-bar {
		@include nav-bar-title(#333333)
	}

	.article-contain {
		height: auto;
		background-color: #FFFFFF;
	}
</style>
