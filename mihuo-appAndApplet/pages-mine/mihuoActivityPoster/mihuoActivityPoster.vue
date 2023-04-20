<template>
	<view>
		<z-nav-bar :title="activity.title"></z-nav-bar>
		<view class="main-container">
			<edit-view v-model="activity.backgroundImage"></edit-view>
			<bottom-button title="立即报名" :styleObj="{ backgroundColor: '#ED3832' }" bgColor="transparent" @click="goToActivityPage">
			</bottom-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				activity: {},
			}
		},
		onLoad(options) {
			this.options = options
			this.getData()
		},
		methods: {
			getData() {
				this.$httpApi.getAppEventById(this.options.id).then(res => {
					this.activity = res
				})
			},
			goToActivityPage() {
				this.toPage(`/pages-mine/mihuoActivity/mihuoActivity?id=${this.options.id}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main-container {
		width: 100vw;
		height: 100vh;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
