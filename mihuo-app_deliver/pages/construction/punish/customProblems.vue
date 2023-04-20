<template>
	<view class="outermost_layer">
		<public-module></public-module>
		<view class="bg_fff own">
			<view class="top_label">
				<text class="label">输入问题</text>
			</view>
			<view class="textarea_box">
				<view class="textarea">
					<textarea placeholder-style="color:#909199" placeholder="请请输入存在的问题"
						style="width:100%;font-size: 25rpx" maxlength=200 v-model="form.name" />
					<view class="num_view">{{form.name && form.name.length + '/200'}}</view>
				</view>
			</view>
		</view>

		<view class="bg_fff">
			<view class="select align-items">
				<view class="top_label">
					<text class="label">罚款金额</text>
				</view>
				<view class="select_con">
					<input placeholder="请输入罚款金额" placeholder-style="color:#999999;font-size:28rpx"
						style="width: 230rpx;" type="digit" v-model="form.money" />
				</view>
			</view>
		</view>
		<view class="bg_fff">
			<view class="select align-items">
				<view class="top_label">
					<text class="label">罚款积分</text>
				</view>
				<view class="select_con">
					<input placeholder="请输入罚款积分" placeholder-style="color:#999999;font-size:28rpx"
						style="width: 230rpx;" type="digit" v-model="form.integral" />
				</view>
			</view>
		</view>
		<view class="bg_fff">
			<view class="select align-items">
				<view class="top_label">
					<text class="label">禁单天数</text>
				</view>
				<view class="select_con">
					<input placeholder="请输入禁单天数" placeholder-style="color:#999999;font-size:28rpx"
						style="width: 230rpx;" type="digit" v-model="form.forbidDay" />
				</view>
			</view>
		</view>
		<!-- <view class="bg_fff">
			<view class="select align-items">
				<view class="top_label">
					<text class="label">罚款分类</text>
				</view>
				<view class="select_con" @click="gotoSelect()">
					<text class="text_type">{{typeName}}</text>
					<image src="../../../static/icon/arrow_select.png" class="arrow_right" mode="aspectFill" />
				</view>
			</view>
		</view> -->

	<!-- 	<view class="btm_btn">
			<button class="cancel" type="default" @click="formReset">取消</button>
			<button :loading="$store.state.loadingShow" class="confirm" type="primary" @tap="submit">提交</button>
		</view> -->

		<!-- <u-popup v-model="typeShow" mode="bottom" class="u-popup">
			<view class="cancel_title_confirm align-items">
				<text class="cancel" @click="typeShow = false">取消</text>
				<text class="title">罚款分类</text>
				<text class="confirm" @click="confirmSelect">确认</text>
			</view>
			<view class="type_view align-items">
				<view class="type_item" :class="typeCurrent === x ? 'isSelect' : ''"
				 v-for="(item,x) in typeList" :key="x" @click="selectType(item,x)">{{item.label}}</view>
			</view>
		</u-popup> -->
		
		<mihuo-bottom-button :buttonList="buttonList" @click="getButton"></mihuo-bottom-button>
		
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				typeCurrent: 0,
				typeName: '',
				typeShow: false,
				typeList: [],
				punishList: [],
				buttonList: [{
					name: '取消',
					status: false
				}, {
					name: '确定',
					status: true
				}],
				form: {
					companyId: '',
					forbidDay: null,
					integral: null,
					money: null,
					name: "",
					ruleId: 0,
					ruleType: 1,
					checked: true,
					content: '',
					ruleCode: '-',
					isCustom: 1
				}
			}
		},

		onLoad(option) {
			this.setParameter()
			if (option) {
				this.punishList = JSON.parse(option.punishList)
			}
		},
		computed: {
			...mapState(['orderInfo'])
		},
		methods: {
			setParameter(){
				this.form.companyId = this.orderInfo.companyId
			},
			submit() {
				
			},
			formReset() {
				this.form = {}
			},
			confirmSelect() {
				this.typeList.map((item, index) => {
					if (index === this.typeCurrent) {
						this.form.type = Number(item.value);
						this.typeName = item.label
					}
				})
				this.typeShow = false
			},
			gotoSelect(id) {
				this.typeShow = true;
				this.getType()
			},
			selectType(item, index) {
				this.typeCurrent = index;
				this.typeList.map(em => {
					if (index === this.typeCurrent) {
						this.typeName = item.label
					}
				})
			},
			getType() {
				this.$http.get({
					type: 'forfeit_type'
				}).then(res => {
					if (res) {
						this.typeList = res
					}
				})
			},
			getButton(item){
				if (item.name == '取消') {
					this.form = {}
					this.goBack()
				}else{
					if (this.form.name === '') {
						return this.$util.toast('请输入问题')
					}
					for (let key in this.form) {
						switch (key) {
							case 'integral':
							case 'money':
							case 'forbidDay':
								this.form[key] = Number(this.form[key])
								break;
						}
					}
					let pages = getCurrentPages(),
						arr = [];
					arr.push(this.form)
					this.punishList.push(...arr)
					let prevPage = pages[pages.length - 2]; //上一个页面
					prevPage.$vm.checkedList = this.punishList
					uni.navigateBack()
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.outermost_layer {
		padding-bottom: 88rpx;
	}

	.bg_fff {
		margin: 2rpx 20rpx;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.inp_box {
			margin-bottom: 25rpx;
			padding: 0 16rpx 15rpx 0;
			border-bottom: 1.5rpx dashed #EEEEEE;
		}

		.textarea_box {
			padding: 25rpx 0;
			padding-bottom: 10rpx;

			.textarea {
				height: 166rpx;
				position: relative;
				padding: 24rpx 26rpx;
				border-radius: 10rpx;
				background: #F7F7F7;

				.num_view {
					position: absolute;
					bottom: 16rpx;
					right: 16rpx;
					font-size: 26rpx;
					color: #909199;
				}
			}
		}

		.top_label {
			margin-left: 12rpx;
		}

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

	.own {
		margin: 10rpx 20rpx;
	}

	.btm_btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;

		button {
			display: inline-block;
			width: 268rpx;
			line-height: 88rpx;
			text-align: center;
			font-weight: bold;
			font-size: $middleFontSize;
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

	.cancel_title_confirm {
		background-color: #FFFFFF;
		padding: 48rpx 40rpx;

		.cancel {
			font-size: 28rpx;
			color: #909199;
		}

		.title {
			font-weight: bold;
			font-size: 30rpx;
			color: #303133;
		}

		.confirm {
			font-weight: bold;
			font-size: 28rpx;
			color: $themeColor;
		}
	}

	.type_view:after {
		content: '';
		display: block;
		width: 200rpx;
		height: 80rpx;
	}

	.type_view {
		padding: 12rpx 40rpx 54rpx;
		background-color: #FFFFFF;
		flex-wrap: wrap;

		.type_item {
			width: 200rpx;
			line-height: 80rpx;
			margin-bottom: 16rpx;
			border: 2rpx solid #EEEEEE;
			color: #303133;
			font-size: 28rpx;
			text-align: center;
			border-radius: 10rpx;
		}

		.isSelect {
			border: 2rpx solid $themeColor;
			color: $themeColor;
			background-image: url(../../../static/icon/isselect.png);
			background-repeat: no-repeat;
			background-position: right bottom;
			background-size: auto;
		}
	}

	.label {
		font-weight: bold;
		font-size: $middleFontSize;
		color: $fontColor33;
	}

	.align-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
