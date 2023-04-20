<template>
	<view>
		<public-module></public-module>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view class="nav-bar" slot="default">首页信息展示设置</view>
			<view slot="right" @click="save" class="right_finish">完成</view>
		</z-nav-bar>
		<view class="main-container">
			<menu-item title="选择工种" @click="selectSkillType">
				<view class="slot-content">
					{{ selectedSkill }}
				</view>
			</menu-item>
			<u-action-sheet :safe-area-inset-bottom="false" @click="confirm" :list="skillTypeList" v-model="showPicker">
			</u-action-sheet>
			<menu-item title="工价单位" :border="true">
				<view class="slot-box flex-center">
					<u-tag class="u-tag" text="平米" @click="clickTag(1, '平米')" mode="light"
						:style="tag === 1 ? activedTag : normalTag">
					</u-tag>
					<u-tag class="u-tag" text="天" @click="clickTag(2,'天')" mode="light" :style="tag === 2 ? activedTag : normalTag">
					</u-tag>
					<u-tag class="u-tag" text="小时" @click="clickTag(3,'小时')" mode="light" :style="tag === 3 ? activedTag : normalTag">
					</u-tag>
				</view>
			</menu-item>
			<view class="inp_price flex-center">
				<input class="text" type="number" v-model=" price" style="flex: 1;"
					placeholder-style="font-family: PingFang SC;font-style: normal;font-size: 26rpx;line-height: 36rpx;color: #999999;"
					placeholder="请输填写价格" />
				<view class="text">{{unit ? '/'+unit : ''}}</view>
			</view>
			<menu-item title="个性签名" :isShowArrow="false" :border="true">
				<view class="slot-content" style="padding-left: 10rpx;">
					<input class="text" maxlength="24" type="text" v-model="selfIntro" style="width: 100%;"
						placeholder-style="font-family: PingFang SC;font-style: normal;font-size: 26rpx;line-height: 36rpx;color: #999999;"
						placeholder="请输入个性签名" />
				</view>
			</menu-item>
			<menu-item title="当前状态" @click="selectStatus" :border="true">
				<view class="slot-content" :style="{color: getColor(selectedStatusIndex)}">
					{{ selectedStatus }}
				</view>
			</menu-item>
			<u-action-sheet :safe-area-inset-bottom="false" @click="confirmStatus" :list="statusList" v-model="showStatusPicker">
			</u-action-sheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showStatusPicker: false, // 状态选择picker
				selectedStatus: '',
				selectedStatusIndex: 0,
				selfIntro: '', // 个性签名
				showPicker: false,
				tag: 0, // 所选单位
				selectedSkill: '选择工种',
				price: '', // 工种价格
				unit: '', // 工种价格单位
				personId: 0, // 工种ID
				skillTypeList: [],
				statusList: [
					{
						text: '空闲中',
						value: 0
					},
					{
						text: '勿打扰',
						value: 1
					},
					{
						text: '忙碌中',
						value: 2
					},
				],
				activedTag: {
					backgroundColor: "rgba(0,47,165,.3)",
					color: "#FFFFFF",
					borderColor: 'transparent',
					borderRadius: '10rpx'
				},
				normalTag: {
					backgroundColor: "#FFFFFF",
					borderColor: "#D9D9D9",
					color: "#666666",
					borderRadius: '10rpx',
				},
				personageList: [], // 工种列表
			};
		},
		onLoad() {
			this.getPersonData()
			this.confirm(0) // 获取第一个工种的信息
		},
		
		methods: {
			getColor(status){
				switch (+status) {
					case 0:
						return '#6CDEAE'; //空闲中
					case 1:
						return '#FF5D35'; //勿打扰
					case 2:
						return '#FFCB00'; //忙碌中
					default:
						return '#6CDEAE';
				}
			},
			getPersonData() {
				let userSetting = uni.getStorageSync('userSetting')
				if (userSetting && userSetting.personageList) {
					this.personageList = userSetting.personageList
					userSetting.personageList.forEach((item, index) => {
						this.skillTypeList.push({
							value: item.personId,
							text: item.skillName,
						});
					});
				}
			},
			clickTag(index, unit) {
				this.unit = unit;
				this.tag = index;
			},
			selectSkillType() {
				if(this.skillTypeList.length === 0){
					// 引导去技能认证
					uni.showModal({
						title: "温馨提示",
						content: "还没有认证的工种，是否去认证？",
						confirmText: '去认证',
						confirmColor: '#002FA5',
						cancelText: '暂不认证',
						cancelColor: '#999999',
						success: (res) => {
							if (res.confirm) {
								this.toPage('/pages/setting/skillInfo')
							}
						},
					});
				} else {
					this.showPicker = true;
				}
			},
			selectStatus() {
				this.showStatusPicker = true;
			},
			confirm(e) {
				this.selectedSkill = this.skillTypeList[e].text;
				this.personId = this.skillTypeList[e].value;
				this.selfIntro = this.personageList[e].servicePromise || ''
				this.unit = this.personageList[e].priceUnit || ''
				let index = ['平米', '天', '小时'].indexOf(this.unit)
				this.tag = index + 1;
				this.price = this.personageList[e].servicePrice || 0
				if(this.personageList[e].status){
					let { text, value } = this.statusList.find(item => item.value === +this.personageList[e].status)
					this.selectedStatus = text
					this.selectedStatusIndex = value
				} else {
					this.selectedStatus = '空闲中'
					this.selectedStatusIndex = 0
				}
			},
			confirmStatus(e){
				this.selectedStatusIndex = this.statusList[e].value
				this.selectedStatus= this.statusList[e].text
			},
			save() {
				if (!this.selectedSkill) {
					this.$util.toast('请选择工种')
					return;
				}
				if (this.unit === '') {
					this.$util.toast('请选择单位')
					return;
				}
				if (this.price === '') {
					uni.showToast({
						title: '请输入价格',
						icon: 'none'
					});
					return;
				}
				if (Number(this.price) < 0) {
					uni.showToast({
						title: '价格不能为负数',
						icon: 'none'
					});
					return;
				}
				// console.log("$trimSpecial",this.$trimSpecial(this.price));
				this.$httpApi.editWorkTypeInfo({
					personId: this.personId,
					servicePrice: this.price,
					priceUnit: this.unit,
					servicePromise: this.selfIntro,
					status: this.selectedStatusIndex
				}).then(res => {
					if (res) {
						uni.showToast({
							title: '修改成功~',
							icon: 'none'
						});
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					}
				})
			},
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		font-size: 30rpx;
		line-height: 50rpx;
		color: #333333;
	}
	
	.right_finish{
		margin-right: 40rpx;
		color: $themeColor;
	}

	.main-container {
		margin-top: 20rpx;

		.text {
			font-family: PingFang SC;
			font-style: normal;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #999999;
		}
		.inp_price{
			width: 100%;
			background: #FFFFFF;
			padding: 0 28rpx 28rpx;
		}
		.slot-content {
			width: 500rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #999999;
			margin-right: 20rpx;
			padding-left: 20rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.slot-box {
			width: 500rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			justify-content: flex-start;
			.u-tag{
				margin-right: 20rpx;
			}
			.tag {
				background: rgba(255, 231, 225, 0.5);
				border: 1rpx solid $themeColor;
				border-radius: 10rpx;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
