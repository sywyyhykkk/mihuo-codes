<template>
	<view class="view">
		<z-nav-bar :title="title">
			<view slot="right" class="right-nav" @click="switchView">
				{{ isSwitch?"按户型查看":"按服务查看"}}
			</view>
		</z-nav-bar>
		<!-- 按服务查看显示 -->
		<view class="view-tabs" v-if="isSwitch && tabs.length">
			<myHome-mh-mihuo-tabs
			:data="tabs" 
			fixed
			:subStyle="{
				width:'60rpx',
				marginTop:'20rpx'
			}"
			value="requirementName"
			@click="tabsClick"
			/>
		</view>
		<!-- 按户型查看 -->
		<view class="view-content">
			<view v-if="groupList.length">
				<view v-for="(item,index) in groupList" :key="index">
					<view class="view-title">{{ item.groupName }}</view>
					<view class="view-house" v-if="item.uploadGroup == '1002'">
						<view class="view-house_swiper" v-for="(v,i) in item.sopUploadList" :key="i">
							<swiper @change="swiperChange($event,v.id)" class="swiper" circular :indicator-dots="false" :autoplay="false">
								<swiper-item  class="swiper-item"  @click="previewImage(item.url,v.uploadItemList)" v-for="(v1,i1) in v.uploadItemList" :key="i1">
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
</template>

<script>
	/**
	 * uploadGroup  1002 户型图
	 */
	export default {
		data() {
			return {
				isSwitch:false,	//是否为项目：false(根据地址) true(根据项目)
				curIndex:1,
				curId:'',
				tabs:[],
				groupList:[],
				options:{},
				projectId:'',
			}
		},
		onShow() {
			this.getListData()
		},
		onLoad(options) {
			this.options = options;
		},
		computed:{
			title(){
				let name = '按户型查看'
				if(this.isSwitch){
					name = '按服务查看'
				}else{
					name = '按户型查看'
				}
				return name;
			}
		},
		methods: {
			previewImage(url,data) {
				uni.previewImage({
					current: this.$util.thumbnailImage(url),
					urls: data.map(item=> this.$util.thumbnailImage(item.url))
				})
			},
			swiperChange(e,id){
				this.curId = id;
				this.curIndex = e.detail.current + 1;
			},
			getListData(){
				let query = {}
				if(this.isSwitch){
					query.projectId = this.projectId;
				}else{
					query.addressId = this.options.addressId;
				}
				this.$httpApi.getSopupload(query)
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
				})
			},
			switchView () {
				this.isSwitch = !this.isSwitch;
				if(this.isSwitch){
					this.getProjectList()
				}
			},
			// 按服务查看点切换tabs事件
			tabsClick(data,index){
				this.projectId = data.projectId;
				this.getListData()
			},
			// 根据地址获取项目
			getProjectList(){
				this.$httpApi.getProjectsByAddressId(this.options.addressId)
				.then(res=>{
					if(res){
						this.tabs = res;
						if(res.length){
							this.projectId = res[0].projectId;
							this.getListData()
						}
					}
				})
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
