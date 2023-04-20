<template>
	<view class="star-contain">
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" bgColor="#FFFFFF">
			<view slot="default" class="nav-bar">明星工匠</view>
		</z-nav-bar>
		<image src="https://www.51mihuo.com/static/images/home_work_bg.JPG" mode="widthFix" class="header-bg"></image>
		<scroll-view 
			id="sticky_id"
			class="tabs"
			:class="{'sticky':isSticky}" 
			scroll-x="true" 
			>
			<u-tabs 
				:list="tabList" 
				:current="current"
				@change="change"
				active-color="#000000"
				inactive-color="#000000" 
				font-size="28"
				bg-color="#F7F7F7"
			></u-tabs>
		</scroll-view>
		<view class="scroll-list">
			<view v-if="dataList && dataList.length">
				<common-mh-craftsmen-list bg-color="#FFFFFF" :data="dataList" :rank="true"/>
			</view>
			<u-loadmore v-if="dataList && dataList.length" :status="status"/>
			<mh-empty v-else title="暂无该明星工匠~~"></mh-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				stickHeight: 0,
				isSticky: false,
				tabList:[],
				current:0,
				status:'loadmore',
				dataList:[
					// {
					// 	name:'张三',
					// 	skillName:'项目管家',
					// 	workYear: '从业五年以上',
					// 	num:222,
					// 	level:'精英',
					// 	userId:235
					// },
					// {
					// 	name:'张三',
					// 	skillName:'项目管家',
					// 	workYear: '从业五年以上',
					// 	num:222,
					// 	level:'精英',
					// 	userId:235
					// },
				]
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			this.isSticky = e.scrollTop + 88 > this.stickHeight ? true : false;
		},
		onLoad(option) {
		},
		onShow() {
			this.getMasterList()
		},
		mounted() {
			// 获取标签距离顶部的高度
			const query = uni.createSelectorQuery();
			query.select('#sticky_id').boundingClientRect(data => {
				this.stickHeight = data.top;
			}).exec();
		},
		methods: {
			getMasterList(){
				this.$httpApi.getPlatformSkills({
						type: '', // 查询全部
						clientType: 'platform'
					})
					.then((res) => {
						if(res && res.length){
							res.map(item=>{
								item.name = item.skillName;
							})
							this.tabList = res;
						}
					})
			},
			change(index) {
				this.current = index;
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	page{
		background: #F7F7F7;
	}
	.flex-center {
		display: flex;
		align-items: center;
	}
	.sticky {
		position: fixed;
		z-index: 999;
		/* #ifndef MP */
		top: calc(var(--status-bar-height) + 68rpx);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: calc(var(--status-bar-height) + 88rpx);
		/* #endif */
	}
	.star-contain {
		width: 100vw;
		height: 100vh;
		.tabs{
			width: 750rpx;
			padding: 20rpx 0;
		}
		.nav-bar {
			@include nav-bar-title(#000000);
		}
		.header-bg {
			width: 750rpx;
			height: 400rpx;
		}
		.scroll-list {
			padding: 0 30rpx;
			@include safearea();
		}
	}
</style>
