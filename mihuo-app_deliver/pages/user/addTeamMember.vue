<template>
	<view>
		<z-nav-bar backState="1000">
			<view class="nav-bar-title" slot="default">添加成员</view>
		</z-nav-bar>
		<view class="top-contain">
			<view class="search-contain">
				<u-search
					v-model="keyword"
					:show-action="true"
					:clearabled="true"
					:color="$styleColor.themeColor"
					search-icon-color="#999999"
					placeholder="请输入完整电话号码"
					action-text="搜索"
					@custom="getSearch"
					@search="getSearch"
				/>
			</view>
		</view>
		<view class="main" v-if="memberData.length">
			<view class="member_view">
				<view class="member_item display-center" v-for="(item,index) in memberData" :key="item.id + index">
					<view class="left display-left">
						<u-avatar size="86" :src="$util.avatarImage(item.userId)" />
						<view class="name_view">
							<view class="name">{{item.realName}}</view>
							<view class="skill_name display-left">
								<view class="skill_name_item" v-for="(m,i) in item.label&&item.label.split(',')" :key="i">{{m}}</view>
							</view>
						</view>
					</view>
					<view class="right" @click="addSave(item.userId)">添加</view>
				</view>
			</view>
		</view>
		<mh-empty v-else newIcon="/static/images/no_member.png" title="暂无成员" />
	</view>
</template>

<script>
	export default{
		data(){
			return{
				keyword: '',
				memberData: []
			}
		},
		
		methods: {
			addSave(userId){
				this.$httpApi.addMember(userId).then(res => {
					if(res){
						uni.showToast({
							title: "添加成功",
							icon: "none",
						});
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}
				})
			},
			getSearch(){
				if(!this.$base.phoneRegular.test(this.keyword)){
					uni.showToast({
						title: "手机号码格式不正确",
						icon: "none",
					});
					return
				}
				let params = {
					keyword: this.keyword,
					current: 1,
					size: 999,
				}
				this.$http.get('admin/sysuserteam/getPage',params).then(res => {
					if(res){
						this.memberData = res.records
					}else{
						this.memberData = []
						this.$util.toast('没有该成员')
					}
				})
				.catch(err => console.log(err))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar-title {
		font-weight: bold;
		font-size: 30rpx;
		color: $fontColor33;
	}
	.top-contain {
		background-color: $bgColor;
		padding: 30rpx 20rpx;

		.search-contain {
			background-color: #f2f2f2;
			border-radius: 50rpx;
			padding-right: 18rpx;
		}
	}
	
	.main{
		margin-top: 6rpx;
		height: calc(100vh - var(--status-bar-height) - 226rpx);
		background: #f6f6f6;
		overflow: hidden;
	}
	.member_view{
		.member_item{
			padding: 34rpx 54rpx;
			background: $bgColor;
			border-bottom: 2rpx solid #E5E5E5;
			.left{
				flex: 9;
				.name_view{
					margin-left: 24rpx;
					.name{
						font-size: $middleFontSize;
						color: $fontColor33;

					}
					.skill_name{
						flex-wrap: wrap;
						.skill_name_item{
							background: #EFF1FF;
							border-radius: 2rpx;
							padding: 6rpx 12rpx;
							font-size: 20rpx;
							color: $themeColor;
							margin: 10rpx 10rpx 0 0;
						}
					}
				}
			}
			.right{
				flex: 1;
				line-height: 32rpx;
				border: 1rpx solid $themeColor;
				border-radius: 5rpx;
				text-align: center;
				font-size: 24rpx;
				letter-spacing: 0.02em;
				color: $themeColor;
				padding: 14rpx 26rpx;
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
