<template>
	<view>
		<public-module></public-module>
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">编辑昵称</view>
		</z-nav-bar>
		
		<view class="form_list">
			<input class="form_list_input" type="text" v-model="name" minlength="2" maxlength="24"  placeholder="请输入昵称" />
		</view>
		
		<view class="tips">请设置2-24个字符，不能包含特殊字符</view>

		<view class="submit" @click="submitEidt">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:''
			}
		},
		
		methods:{
			submitEidt() {
				if(this.name.length<2){
					this.$util.toast('请输入至少两个字符~')
					return
				}
				const reg = /^[\u4E00-\u9FA5]{2,24}$/
				if (reg.test(this.name)) {
					this.$httpApi
						.updateByUserId({
							userId: uni.getStorageSync('userSetting').userId,
							realName: this.name
						})
						.then((res) => {
							if (res) {
								this.$util.toast('修改成功')
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
							}
						})
						.catch(e => console.log(err))
				} else {
					this.$util.toast('您输入的姓名不合法~')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-size: 36rpx;
		color: $fontColor33;
	}

	.submit {
		line-height: 90rpx;
		background: linear-gradient(90deg, $themeColor 0%, $themeColor 100%);
		border-radius: 10rpx;
		font-weight: 400;
		font-size: 28rpx;
		text-align: center;
		color: #FFFFFF;
		margin-left: 60rpx;
		margin-right: 60rpx;
		margin-top: 620rpx;

	}

	.form_list {
		margin: 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.form_list_input {
			padding: 0 30rpx;
			width: 100%;
			height: 120rpx;
			font-size: 28rpx;
			color: $viceFontColor;
			line-height: 120rpx;
		}
	}
	
	.tips{
		margin: 22rpx 56rpx;
		font-size: $smallFontSize;
		color: $viceFontColor;
	}
</style>
