<template>
	<view class="mh-empty-page">
		<u-empty margin-top='260' icon-size='300' :src="newIcon" :text="title" mode="list">
		</u-empty>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "mh-empty",
		props: {
			icon: {
				type: String,
				default: '../../static/images/no_order_2.png'
			},
			newIcon: {
				type: String,
				default: '/static/images/no_order_2.png'
			},
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>

</style>
