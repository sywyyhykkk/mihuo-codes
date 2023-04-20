<template>
	<view class="container">
		<view class="status_bar"></view>
		<!--头部-->
		<view class="header">
			<view class="left flex-row" @tap="goBack" style="justify-content: flex-start;">
				<uni-icons type="arrowleft" size="18"></uni-icons>
				<view style="font-size: 28rpx;">{{ group.name }}</view>
			</view>
			<view class="center"></view>
			<view class="right"></view>
		</view>
		<view @tap="toMember" class="items flex-row">
			<text class="label">成员管理</text>
			<view class="flex-row">
				<text class="value">查看</text>
				<uni-icons type="arrowright" size="18" color="#999"></uni-icons>
			</view>
		</view>
		<view @tap="showEdit" class="items flex-row">
			<text class="label">群聊名称</text>
			<view class="flex-row">
				<text class="value">{{ group.name }}</text>
				<uni-icons type="arrowright" size="18" color="#999"></uni-icons>
			</view>
		</view>
		<view @tap="uploadFace" class="items flex-row">
			<text class="label">群聊头像</text>
			<view class="flex-row">
				<image v-if="group.face" :src="group.face" class="face"></image>
				<image v-else src="../../../static/images/face.png" class="face"></image>
				<uni-icons type="arrowright" size="18" color="#999"></uni-icons>
			</view>
		</view>
		
		<view v-if="userId == group.userId" @tap="delGroup" class="main-btn flex-column">删除群聊</view>
		<view v-else @tap="quitGroup" class="main-btn flex-column">退出群聊</view>
		
		<!--修改名称-->
		<uni-popup ref="edit">
			<view class="dialog">
				<view class="title">群聊名称</view>
				<input class="input" v-model="groupName" type="text" placeholder="请输入群聊名称" />
				<view @tap="editAction" class="btn" :class="{disabled: !groupName}">完成</view>
				<view @tap="cancelEdit" class="close">
					<uni-icons type="closeempty" size="26" color="#999"></uni-icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default{
	data(){
		return {
			userId: uni.getStorageSync('userId') || '',
			groupId: '',
			groupName: '',
			group: {}
		}
	},
	onLoad(option){
		this.groupId = option.groupId
		this.getDetail()
	},
	methods: {
		delGroup(){
			uni.showModal({
				title: '确认',
				content: '是否删除群聊?',
				success: res=>{
					if(res.cancel) return
					this.$util.loading('删除中')
					uni.request({
						method: 'POST',
						url: this.$api.delGroup,
						data: {
							userId: this.userId,
							groupId: this.groupId
						},
						header: this.$util.getHeader(),
						success: ress=>{
							uni.hideLoading()
							if(ress.data.code){
								return this.$util.toast('删除失败')
							}
							this.toTab('/pages/message/index')
						},
						fail: err=>{
							uni.hideLoading()
							this.$util.toast('删除失败')
						}
					})
				}
			})
		},
		quitGroup(){
			uni.showModal({
				title: '确认',
				content: '是否退出群聊?',
				success: res=>{
					if(res.cancel) return
					this.$util.loading('退出中')
					uni.request({
						method: 'POST',
						url: this.$api.quitGroup,
						data: {
							userId: this.userId,
							groupId: this.groupId
						},
						header: this.$util.getHeader(),
						success: ress=>{
							uni.hideLoading()
							if(ress.data.code){
								return this.$util.toast('退出失败')
							}
							this.toTab('/pages/message/index')
						},
						fail: err=>{
							uni.hideLoading()
							this.$util.toast('退出失败')
						}
					})
				}
			})
		},
		toMember(){
			this.toPage('/pages/message/group/member?groupId='+this.groupId)
		},
		showEdit(){
			this.groupName = this.group.name
			this.$refs.edit.open()
		},
		cancelEdit(){
			this.$refs.edit.close()
		},
		editAction(){
			if(this.$validate.isNull(this.groupName)) return
			this.$util.loading('保存中')
			uni.request({
				method: 'POST',
				url: this.$api.updateGroupName,
				data: {
					groupId: this.groupId,
					userId: this.userId,
					name: this.groupName
				},
				header: this.$util.getHeader(),
				success: res=>{
					uni.hideLoading()
					this.$util.toast(res.data.msg)
					if(!res.data.code){
						this.$refs.edit.close()
						this.group.name = this.groupName
						uni.setStorageSync('groupName', this.groupName)
					}
				},
				fail: res=>{
					uni.hideLoading()
					this.$util.toast('保存失败')
				}
			})
		},
		// 上传头像
		uploadFace(){
			uni.chooseImage({
				count: 1,
				success: chooseRes=>{
					const tempFilePaths = chooseRes.tempFilePaths
					
					this.$util.loading('上传中')
					tempFilePaths.forEach(temp=>{
						uni.uploadFile({
							url: this.$api.uploadGroupFace,
							filePath: temp,
							formData: {
								groupId: this.groupId,
								userId: this.userId
							},
							name: 'file',
							header: this.$util.getHeader(),
							success: uploadRes=>{
								uni.hideLoading()
								if(uploadRes.data.code) return
								let data = JSON.parse(uploadRes.data)
								this.group.face = this.$api.staticPath + data.data
							}
						})
					})
				}
			})
		},
		// 获取群信息
		getDetail(){
			this.$util.loading()
			uni.request({
				url: this.$api.getGroupDetail,
				data: {
					groupId: this.groupId
				},
				header: this.$util.getHeader(),
				success: res=>{
					uni.hideLoading()
					this.group = res.data.data
					this.group.name = this.group.name || '群聊'+this.groupId
					this.groupName = this.group.name
					this.group.face = this.group.face ? this.$api.staticPath + this.group.face : ''
				},
				fail: err=>{
					uni.hideLoading()
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.status_bar,
.header{
	background-color: #F7F7F7;
}
.container{
	background-color: #F9F9F9;
}
.items{
	height: 100rpx;
	padding: 0 30rpx;
	background-color: #FFF;
	border-bottom: 2rpx solid #F2F2F2;
	
	.label{
		color: #666;
		font-size: 32rpx;
	}
	
	.value{
		color: #999;
		font-size: 30rpx;
	}
	
	.face{
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
	}
}
.main-btn{
	color: red;
	height: 100rpx;
	padding: 0 30rpx;
	margin-top: 100rpx;
	background-color: #FFF;
}
.dialog{
	width: 600rpx;
	height: 460rpx;
	padding: 0 40rpx;
	border-radius: 10rpx;
	background-color: #FFF;
	position: relative;
	
	.close{
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}
	
	.title{
		height: 120rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 120rpx;
	}
	
	.input{
		height: 80rpx;
		padding: 0 30rpx;
		border-radius: 10rpx;
		margin: 40rpx 0 80rpx;
		border: 2rpx solid #ddd;
	}
	
	.btn{
		color: #FFF;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
		background-color: #2CA246;
		
		&.disabled,
		&:active{
			opacity: 0.8;
		}
	}
}
</style>
