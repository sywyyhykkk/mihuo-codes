<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar-title" v-if="isShowTitle">
				{{ list.title }}
			</view>
		</z-nav-bar>
		<view class="my_cms">
			<mine-mh-edit-view v-if="content" v-model="content" />
		</view>
	</view>
</template>

<script>
	import $http from '@/config/requestConfig'
	export default {
		data() {
			return {
				list: {},
				content: "",
				style: [],
				pageType: false,
				id: 0,
				treeCode: '',
				isShowTitle: true,
				options: {}
			};
		},
		onLoad(option) {
			this.options = option
			if (option.list) {
				this.list = JSON.parse(option.list);
				this.content = this.list.content;
			}
			if (option.isShowTitle && option.isShowTitle == '0') {
				this.isShowTitle = false
			}
			if (option.id) {
				this.id = option.id;
				this.getData(this.id)
			}
			if (option.isFromShare == '1') {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent('内容页', url, this.options.userId)
			}
		},
		onShareAppMessage(e) {
			const coverImg = ''
			const path = `/pages-mine/cms?id=${this.id}&isShowTitle=${!this.isShowTitle ? '0' : '1'}`
			const result = this.$util.shareToWechat(`家装知识早知道：${this.list.title}`, coverImg, path, '内容页', true, 1)
			return result
		},
		methods: {
			getData() {
				$http
					.get(`mall/cms_content_manager/customer`, {
						id: this.id,
					})
					.then((res) => {
						this.content = res.content;
						this.list = res;
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.my_cms {
		background-color: #ffffff;
	}
</style>
