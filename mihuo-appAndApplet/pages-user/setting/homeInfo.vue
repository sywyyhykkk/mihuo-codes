<template>
	<view>
		<!-- 顶部导航栏 -->
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				首页信息展示设置
			</view>
			<view slot="right" @click="save" style="margin-right: 40rpx;">
				<u-icon name="checkmark"></u-icon>
			</view>
		</z-nav-bar>

		<view class="main-container">
			<user-mh-menu-item title="选择工种" @click="selectSkillType">
				<view class="slot-content">
					{{selectedSkill}}
				</view>
			</user-mh-menu-item>
			<u-select v-model="showPicker" :list="skillTypeList" @confirm="confirm"></u-select>
			<user-mh-menu-item title="工价设置">
				<view class="slot-box flex-center">
					<u-tag text="平米" @click="clickTag(1, '平米')" :style="tag === 1 ? activedTag : normalTag"
						mode="light">
					</u-tag>
					<u-tag text="天" @click="clickTag(2,'天')" mode="light" :style="tag === 2 ? activedTag : normalTag">
					</u-tag>
					<u-tag text="小时" @click="clickTag(3,'小时')" mode="light" :style="tag === 3 ? activedTag : normalTag">
					</u-tag>
					<u-tag text="起" @click="clickTag(4,'起')" mode="light" :style="tag === 4 ? activedTag : normalTag">
					</u-tag>
				</view>
			</user-mh-menu-item>
			<view class="price-box flex-center">
				<u-field v-model="price" :field-style="fieldFtyle" class="filed" type="digit"
					placeholder-style="font-family: PingFang SC;font-style: normal;font-weight: bold;font-size: 26rpx;line-height: 36rpx;color: #999999;"
					placeholder="请填写价格" :clearable="false" :border-bottom="false">
					<view slot="right" class="text">{{unit ? '/'+unit : ''}}</view>
				</u-field>
			</view>
			<!-- <user-mh-menu-item title="个性签名">
				<view class="slot-content">
					个性签名
				</view>
			</user-mh-menu-item> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPicker: false,
				userSetting: {},
				selectedSkill: '选择工种',
				skillTypeData: [],
				price: '',
				tag: -1,
				unit: '',
				personId: 0,
				skillTypeList: [],
				fieldFtyle: {
					marginLeft: '-110rpx',
					fontFamily: 'PingFang SC',
					fontStyle: 'normal',
					fontWeight: 'bold',
					fontSize: '26rpx',
					lineHeight: '36rpx',
					color: '#999999'
				},
				activedTag: {
					backgroundColor: "#FFE7E1",
					borderColor: "#FF5D35",
					color: "#FF5D35",
					borderRadius: '10rpx'
				},
				normalTag: {
					backgroundColor: "#fff",
					borderColor: "#D9D9D9",
					color: "#666666",
					borderRadius: '10rpx'
				}
			};
		},
		onShow() {
			this.$httpApi.getPersonSettingInfo().then(res => {
				this.userSetting = res;
				uni.setStorageSync('userSetting', res);
				if (this.userSetting.personageList) {
					let skillTypeList = [];
					let skillTypeData = []
					this.userSetting.personageList.forEach(item => {
						skillTypeData.push(item)
						skillTypeList.push({
							value: item.personId,
							label: item.skillName,
						});
					});
					this.skillTypeData = skillTypeData;
					this.skillTypeList = skillTypeList;
				} else {
					this.skillTypeList = [{
						label: '请先完成技能认证',
						value: '1'
					}];
				}
			}).catch(e => console.log(e));
		},
		methods: {
			clickTag(index, unit) {
				this.unit = unit;
				this.tag = index;
			},
			selectSkillType() {
				this.showPicker = true;
			},
			confirm(e) {
				if (e[0].label === '请先完成技能认证') {
					return;
				}
				this.selectedSkill = e[0].label;
				this.personId = e[0].value;
			},
			save() {
				if (this.selectedSkill === '选择工种') {
					uni.showToast({
						title: '请选择工种',
						icon: 'none'
					});
					return;
				}
				if (this.unit === '') {
					uni.showToast({
						title: '请选择单位',
						icon: 'none'
					});
					return;
				}
				if (this.price === '') {
					uni.showToast({
						title: '请选择价格',
						icon: 'none'
					});
					return;
				}
				this.$http.put('basic/person', {
					personId: this.personId,
					servicePrice: this.price,
					priceUnit: this.unit
				}).then(res => {
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';
	
	.nav-bar {
		width: 600rpx;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: bold;
		line-height: 50rpx;
		@include nav-bar-title(#333333);
	}

	.main-container {
		margin-top: 20rpx;

		.slot-content {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #909199;
			margin-right: 20rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.slot-box {
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			width: 500rpx;
			justify-content: space-around;

			.tag {
				background: rgba(255, 231, 225, 0.5);
				border: 1rpx solid #FF5D35;
				border-radius: 10rpx;
			}
		}

		.price-box {
			height: 124rpx;
			background-color: #fff;

			.text {
				font-family: PingFang SC;
				font-style: normal;
				font-weight: bold;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #999999;
				margin-left: -80rpx;
			}

			.filed {
				width: 100%;
			}
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
