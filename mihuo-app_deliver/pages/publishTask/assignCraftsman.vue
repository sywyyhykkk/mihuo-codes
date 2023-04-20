<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar-title" slot="default">指派工匠</view>
		</z-nav-bar>
		<view class="top-contain">
			<view class="search-contain">
				<u-search
					v-model="keyword"
					:show-action="true"
					:clearabled="true"
					:color="$styleColor.themeColor"
					search-icon-color="#999999"
					action-text="搜索"
					@custom="getSearch"
					@search="getSearch"
				/>
			</view>
		</view>
		
		<u-tabs class="u-tabs" :active-color="$styleColor.themeColor"
			:list="tabList" font-size="26" bar-height="4"
			inactive-color="#606166" :is-scroll="false" :current="current" @change="changeTab"></u-tabs>
			
		<view class="main">
			<scroll-view class="scroll-con" scroll-y v-if="craftsmanList.length > 0">
				<view class="member_view" v-for="item in craftsmanList" :key="item.workerUserId">
					<view class="member_item">
						<view class="left display-left">
							<u-avatar size="136" :src="$util.avatarImage(item.workerUserId)" v-if="item.workerUserId" />
							<view class="name_view">
								<view class="display-center" style="width: 100%;">
									<view class="display-left">
										<view class="name">{{item.workerName}}</view>
										<skill-level-tag :title="item.workerSkillName || '其他'" :level="`${item.workerLevel}`" />
									</view>
									<view class="paidan" @click="assign(item)">派单</view>
								</view>
								
								<view class="skill_name display-left">
									<view class="skill_name_item">{{item.workerWorkYear}}</view>
								</view>
								
								<view class="display-center">
									<view class="evaluate_view">
										<text class="label">合作过</text><text class="num">{{item.workerCooperationCount}}次</text>
									</view>
									<view class="evaluate_view">
										<text class="label">好评率</text><text class="num">{{item.workerGoodRate?item.workerGoodRate:100}}%</text>
									</view>
									<view class="evaluate_view">
										<text class="label">在施工</text><text class="num">1单</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="loadmoreShow" />
			</scroll-view>
			<mh-empty v-else newIcon="/static/images/no_member.png" title="暂无团队成员" />
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				loadmoreShow: true,
				status: 'loadmore',
				page: 1,
				size: 10,
				pages: 0,
				total: 0,
				keyword: '',
				craftsmanList: [],
				current: 0,
				tabList: [{
						name: '全部',
						value: 0
					},
					// {
					// 	name: '只看内部',
					// 	value: 0
					// },
					{
						name: '合作过',
						value: 1
					},
					// {
					// 	name: '可接单',
					// 	value: 2
					// }
				],
			}
		},
		
		onShow() {
			this.getMemberData()
		},
		
		onLoad(option) {
			this.skillId = option.skillId
		},
		
		methods:{
			assign(item){
				uni.$emit('selectedData',JSON.stringify(item))
				uni.navigateBack()
			},
			getSearch(){
				this.craftsmanList = []
				this.getMemberData(this.keyword)
			},
			getMemberData(keyWord,val){
				let param = {
					isCooperation: val?val:0,
					keyword: keyWord?keyWord:'',
					skillId: this.skillId?this.skillId:'',
					current: this.page,
					size: this.size,
				}
				this.$httpApi.getUserPerson(param).then(res => {
					this.total = res.total;
					if (res.records.length !== 0) {
						if (this.page == 1) {
							this.craftsmanList = res.records;
						} else {
							this.craftsmanList = this.craftsmanList.concat(res.records);
						}
						if (this.page == res.pages) {
							this.loadmoreShow = false
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
					} else {
						this.craftsmanList = []
						this.status = "nomore";
					}
				}).catch(err => this.status = "nomore")
			},
			changeTab(index) {
				this.current = index
				this.getMemberData('',this.tabList[index].value)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar-title {
		font-weight: bold;
		font-size: 30rpx;
		color: $fontColor33;
	}
	.u-tabs {
		// box-shadow: 0px 3px 4px rgba(183, 183, 183, 0.25);
		width: 100%;
		position: fixed;
		top: calc(120rpx + 80rpx + var(--status-bar-height));
		z-index: 20;
	}
	.top-contain {
		width: 100%;
		background-color: $bgColor;
		padding: 30rpx 20rpx;
		position: fixed;
		top: calc(80rpx + var(--status-bar-height));
		z-index: 20;
	
		.search-contain {
			background-color: #f2f2f2;
			border-radius: 50rpx;
			padding-right: 18rpx;
		}
	}
	
	.main {
		margin-top: 195rpx;
		height: calc(100vh - var(--status-bar-height) - 295rpx);
		background: $bgColor;
		overflow: hidden;
	}
	
	.scroll-con {
		height: 100%;
		background: #f6f6f6;
	}
	
	.member_view {
		.member_item {
			padding: 34rpx 54rpx;
			background: #FFFFFF;
			margin-bottom: 2rpx;
	
			.left {
				.name_view {
					flex: 1;
					margin-left: 24rpx;
					.paidan{
						width: 100rpx;
						height: 46rpx;
						background: #002FA5;
						border-radius: 10rpx;
						font-size: 24rpx;
						line-height: 46rpx;
						color: #FFFFFF;
						text-align: center;
					}
					.name {
						font-size: $middleAddFontSize;
						color: $fontColor33;
					}
	
					.skill_name {
						margin-top: 10rpx;
	
						.skill_name_item {
							background: #EFF1FF;
							border-radius: 2rpx;
							padding: 6rpx 12rpx;
							font-size: 20rpx;
							color: $themeColor;
							margin-right: 8rpx;
						}
					}
					.evaluate_view{
						margin-top: 20rpx;
						.label{
							font-size: 26rpx;
							color: #909199;
						}
						.num{
							font-size: 26rpx;
							color: #333333;
						}
					}
				}
			}
		}
	}
	
	.display-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.display-left {
		display: flex;
		align-items: center;
	}
</style>
