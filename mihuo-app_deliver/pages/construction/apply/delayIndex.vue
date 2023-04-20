<template>
	<view>
		<public-module></public-module>
		<z-nav-bar>
			<view slot="default" class="nav-title">申请延期</view>
			<view slot="right" class="nav_right" @click="seeRecord">申请记录</view>
		</z-nav-bar>
		
		<view class="p_top">
			<form>
				<view class="bg_fff m_top">
					<view class="select align-items">
						<text class="label">申请类型</text>
						<view class="select_con" @click="gotoSelect()">
							<text class="text_type">{{form.type ? form.type : '请选择申请类型'}}</text>
							<image src="../../../static/icon/arrow_select.png" class="arrow_right" mode="aspectFill" />
						</view>
					</view>
				</view>
				<view class="bg_fff">
					<view class="select align-items">
						<text class="label">发送至</text>
						<view class="select_con" @click="gotoSelect()">
							<text class="text_type">请选择人员</text>
							<image src="../../../static/icon/arrow_select.png" class="arrow_right" mode="aspectFill" />
						</view>
					</view>
				</view>
				<view class="bg_fff">
					<view class="top_label">
						<text class="label">申请内容</text>
					</view>
					<view class="textarea_box">
						<view class="textarea">
							<textarea placeholder-style="color:#909199" placeholder="请输入申请内容"
							 style="width:100%;font-size: 25rpx" maxlength=200
							/>
							<view class="num_view">0/200</view>
						</view>
					</view>
				</view>
				<view class="bg_fff">
					<text class="label">上传图片</text>
					<view class="upload">
						<image-upload-new :count="5" />
					</view>
					<view class="voice-contain">
						<sound-recording />
					</view>
				</view>
				<view class="bg_fff align-items">
					<text class="label">罚款时间</text>
					<view class="time">2020-01-01 12:13</view>
				</view>
				
				<view class="btm_btn">
					<button class="cancel" type="default" @click="formReset">取消</button>
					<button :loading="$store.state.loadingShow" class="confirm" type="primary"
						@tap="submit">申请</button>
				</view>
			</form>
		</view>
		<u-popup v-model="typeShow" mode="bottom" class="u-popup">
			<view class="cancel_title_confirm align-items">
				<text class="cancel" @click="typeShow = false">取消</text>
				<text class="title">标题</text>
				<text class="confirm" @click="confirmSelect">确认</text>
			</view>
			<view class="type_con">
				<text class="type_label">材料类</text>
				<view class="type_view align-items">
					<view class="type_item" :class="typeCurrent === x ? 'isSelect' : ''"
					 v-for="(item,x) in typeList" :key="x" @click="selectType(item,x)">{{item.label}}</view>
				</view>
			</view>
			<view class="type_con">
				<text class="type_label">材料类</text>
				<view class="type_view align-items">
					<view class="type_item" :class="typeCurrent === x ? 'isSelect' : ''"
					 v-for="(item,x) in typeList" :key="x" @click="selectType(item,x)">{{item.label}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				typeShow: false,
				typeCurrent:0,
				typeList:[],
				form:{
					type:'',
					
				}
			}
		},
		
		methods:{
			selectType(item,index){
				this.typeCurrent = index;
				// this.termlist.map(em => {
				// 	if(em.itemId === this.distinguishId){
				// 		em.type = Number(item.value);
				// 		em.title = item.label
				// 	}
				// })
			},
			confirmSelect(){
				this.termlist.map(em => {
					this.typeList.map((item,index) => {
						if(em.itemId === this.distinguishId && index === this.typeCurrent){
							em.type = Number(item.value);
							em.title = item.label
						}
					})
				})
				this.typeShow = false
			},
			gotoSelect(id){
				this.typeShow = !this.typeShow;
				this.getType()
				// this.distinguishId = id
			},
			getType() {
				this.$httpApi.getDicType({type: 'order_alteration_type'}).then(res => {
					if(res){
						this.typeList = res
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	.nav-title{
		font-size: 32rpx;
		font-weight: bold;
		color: #303133;
	}
	.nav_right{
		padding-right: 26rpx;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: $smallFontSize;
		color: $fontColor99;
	}
	.p_top{
		padding-top: 8rpx;
	}
	.bg_fff{
		margin: 1rpx 20rpx;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		.inp_box{
			margin-bottom: 25rpx;
			padding: 0 16rpx 15rpx 0;
			border-bottom: 1.5rpx dashed #EEEEEE;
		}
		.textarea_box{
			padding: 25rpx 0;
			padding-bottom: 10rpx;
			.textarea{
				height: 166rpx;
				position: relative;
				padding: 24rpx 26rpx;
				border-radius: 10rpx;
				background: #F7F7F7;
				.num_view{
					position: absolute;
					bottom: 16rpx;
					right: 16rpx;
					font-size: 26rpx;
					color: #909199;
	
				}
			}
			
		}
		.upload{
			margin: 25.5rpx 0;
			.upload_tool{
				width: 108rpx;
				height: 108rpx;
				border: 1.5rpx solid #E0E0E0;
				box-sizing: border-box;
				border-radius: 10rpx;
			}
		}
		.top_label{
			margin-left: 12rpx;
		}
		.select {
			.label {
				width: 50%;
				font-weight: bold;
				font-size: 28rpx;
				color: $fontColor33;
			}
					
			.select_con {
				margin-left: 11rpx;
					
				.text_type {
					padding-right: 26rpx;
					font-size: 28rpx;
					color: $fontColor99;
				}
					
				.arrow_right {
					display: inline-block;
					width: 12rpx;
					height: 21.5rpx;
				}
			}
		}
		
		.time {
			font-size: 26rpx;
			color: #909199;
			margin-right: 88rpx;
		}
	}
	.btm_btn {
		margin-top: 146rpx;
		text-align: center;
	
		button {
			display: inline-block;
			width: 268rpx;
			line-height: 88rpx;
			text-align: center;
			font-weight: bold;
			font-size: $smallFontSize;
			border-radius: 10rpx;
		}
	
		.cancel {
			margin-right: 24rpx;
			border: 1.5rpx solid #E0E0E0;
			background: #FFFFFF;
			color: #909299;
		}
	
		.confirm {
			background: $themeColor;
		}
	}
	.cancel_title_confirm{
		background-color: #FFFFFF;
		padding: 48rpx 40rpx 32rpx;
		// border-radius: 30rpx 30rpx 0 0;
		.cancel{
			font-size: 28rpx;
			color: #909199;
		}
		.title{
			font-weight: bold;
			font-size: 30rpx;
			color: #303133;
		}
		.confirm{
			font-weight: bold;
			font-size: 28rpx;
			color: $themeColor;
		}
	}
	.type_con{
		background-color: #FFFFFF;
		.type_label{
			margin-left: 68rpx;
			font-size: 28rpx;
			color: #909199;
		}
	}
	.type_view{
		padding: 28rpx 40rpx 50rpx;
		flex-wrap: wrap;
		.type_item{
			width: 200rpx;
			line-height: 80rpx;
			margin-bottom: 16rpx;
			border: 2rpx solid #EEEEEE;
			color: #303133;
			font-size: 28rpx;
			text-align: center;
			border-radius: 10rpx;
		}
		.isSelect{
			border: 2rpx solid $themeColor;
			color: $themeColor;
			background-image: url(../../../static/icon/isselect.png);
			background-repeat: no-repeat;
			background-position: right bottom;
			background-size: auto;
		}
	}
	.type_view:after{
		content: '';
		display: block;
		width: 200rpx;
		height: 80rpx;
	}
	
	.label{
		font-weight: bold;
		font-size: $middleFontSize;
		color: $darkTitle;
	}
	.align-items{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
