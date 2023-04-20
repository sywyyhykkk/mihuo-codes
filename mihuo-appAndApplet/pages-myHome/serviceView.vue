<template>
	<view class="view">
		<z-nav-bar title="按服务查看">
			<view slot="right" class="right-nav" @click="switchView">按户型查看</view>
		</z-nav-bar>
		<!-- 按服务查看 -->
		<view class="view-tabs">
			<myHome-mh-mihuo-tabs
			:data="tabs" 
			fixed
			:subStyle="{
				width:'60rpx',
				marginTop:'20rpx'
			}"
			@click="tabsClick"
			/>
			<view class="view-content">
				<view v-if="groupList.length">
					<view v-for="(item,index) in groupList" :key="index">
						<view class="view-title">{{ item.groupName }}</view>
						<view class="view-house" v-if="item.uploadGroup == '1002'">
							<view class="view-house_swiper" v-for="(v,i) in item.sopUploadList" :key="i">
								<swiper @change="swiperChange($event,v.id)" class="swiper" circular :indicator-dots="false" :autoplay="false">
									<swiper-item  class="swiper-item" @click="previewImage(v1.url,v.uploadItemList)" v-for="(v1,i1) in v.uploadItemList" :key="i1">
										<image class="swiper-item_image" :src="$util.thumbnailImage(v1.url, true)" mode="scaleToFill"/>
									</swiper-item>
								</swiper>
								<text class="swiper_tips">{{ curId == v.id?curIndex:1 }}/{{v.uploadItemList.length || 0}}</text>
								<view class="view-house_remarks">{{ v.remark }}</view>
							</view>
							<myHome-mh-empty v-if="item.sopUploadList === 0" marginTop="100" size="200" title="暂无文件～～" />
						</view>
						<view v-else>
							<view class="view-design" v-if="item.uploadList.length">
								<view v-for="(item1,index1) in item.uploadList" :key="index1" class="view-design_image">
									<image class="image" @click="previewImage(item1.url,item.uploadList)" :src="$util.thumbnailImage(item1.url, true)" mode="scaleToFill"/>
								</view>
							</view>
							<myHome-mh-empty v-else marginTop="0" size="200" title="暂无文件～～" />
						</view>
					</view>
				</view>
				<myHome-mh-empty v-else title="暂无文件～～" />
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * uploadGroup  1002 户型图
	 */
	export default {
		data() {
			return {
				curIndex:1,
				curId:'',
				tabs:[
					{name:"服务"},
				],
				groupList:[],
				options:{}
			}
		},
		onShow() {
			this.getProjectList()
			this.getListData();
		},
		onLoad(options) {
			this.options = options;
		},
		methods: {
			previewImage(url,data) {
				uni.previewImage({
					current: this.$util.thumbnailImage(url),
					urls: data.map(item=> this.$util.thumbnailImage(item.url))
				})
			},
			switchView(){
				this.toPage(`/pages-myHome/houseView?projectId=${this.options.projectId}&addressId=${this.options.addressId}`)
			},
			// 根据地址获取项目
			getProjectList(){
				this.$http.get(`order/biz_order/myHomeOrders/${this.options.addressId}`)
				.then(res=>{
					if(res){
						res.some(v=>{
							if(this.options.projectId == v.projectId){
								this.tabs[0].name = v.skillName + '服务'
								return true
							}
						})
					}
				})
			},
			getListData(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				// this.$http.get(`order/sopupload/group/list?projectId=${this.options.projectId}`)
				this.$httpApi.getSopupload({
					projectId:250
				})
				.then(res=>{
					let data = res;
					if(data && data.length){
						data.map(v=>{
							v.uploadList = []
							if(v.uploadGroup != '1002'){
								if(v.sopUploadList && v.sopUploadList.length){
									v.sopUploadList.some(item=>{
										v.uploadList = v.uploadList.concat(item.uploadItemList)
									})
								}

							}
						})
					}
					this.groupList = data;
				}).finally(() => {
					uni.hideLoading();
				})
			},
			swiperChange(e,id){
				this.curId = id;
				this.curIndex = e.detail.current + 1;
			},
			// 按服务查看点切换tabs事件
			tabsClick(data,index){

			},
		}
	}
</script>

<style lang="scss" scoped>
.view{
	padding: 0 30rpx;
	.right-nav{
		margin-right: 30rpx;
		/*  #ifdef  MP  */
		margin-right:0;
		/*  #endif  */
		font-size: 28rpx;
	}
	.view-content{
		.view-title{
			color: #000000;
			padding: 20rpx 0;
		}
		.view-house_swiper{
			position: relative;
			margin-bottom: 20rpx;
			.view-house_remarks{
				color: #808080;
				font-size: 28rpx;
				padding-top: 10rpx;
			}
			.swiper_tips{
				position: absolute;
				background: #fff;
				font-size: 24rpx;
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				top: 240rpx;
				right: 20rpx;
			}
			.swiper{
				height: 300rpx;
				border-radius: 10rpx;
				.swiper-item{
					width: 100%;
					height: 100%;
					.swiper-item_image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx !important;
					}
				}
			}
		}
		.view-design{
			display: flex;
			flex-flow: row wrap;
			.view-design_image{
				.image{
					height: 196rpx;
					width: 196rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					border-radius: 12rpx;
				}
			}
		}
		.view-tabs{
			height: 110rpx;
			width: 690rpx;
		}
	}
}
</style>
