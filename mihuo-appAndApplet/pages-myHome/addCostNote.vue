<template>
	<view>
		<z-nav-bar backState="1000">
			<view slot="default" class="nav-bar">
				记一笔
			</view>
			<view slot="right" class="nav-bar-right" @click="deleteMode">
				{{ isManage ? '完成' : '管理分类' }}
			</view>
		</z-nav-bar>
		<view class="cost-type flex-center">
			<view
				:class="{ 'shaking': isManage, 'type-item-active': currentTypeIndex == index,  'type-item': currentTypeIndex != index }"
				@longpress="deleteType(item)" v-for="item, index in noteTypeList" :key="index"
				@click="selectNoteType(item, index)">
				{{ item.name }}
			</view>
			<view class="type-item" @click="isShowAddType = !isShowAddType" v-if="!isManage">
				<uni-icons type="plusempty" color="#000000"></uni-icons>
			</view>
		</view>
		<view class="input-container">
			<view class="input-area flex-center">
				<view class="amount-symbol">
					¥
				</view>
				<uni-easyinput v-model="amount" type="digit" placeholder="请输入金额" :clearable="false"
					:inputBorder="false" />
			</view>
			<uni-easyinput class="input-textarea" v-model="remark" maxlength="60" type="textarea" placeholder="添加备注"
				:inputBorder="false" :clearable="false" />
		</view>
		<bottom-button :style="{ opacity: disabled ? '0.3' : '1' }" title="完成" @click="saveForm"
			:styleObj="{backgroundColor: '#000000'}"></bottom-button>
		<u-popup v-model="isShowAddType" mode="bottom" :safe-area-inset-bottom="true" border-radius="20"
			:mask-close-able="false">
			<view class="add-type">
				<view class="popup-header flex-center">
					<view class="left flex-center" @click="isShowAddType = false">
						<uni-icons type="left"></uni-icons>
						添加分类
					</view>
					<view class="right" @click="addNoteType">
						完成
					</view>
				</view>
				<uni-easyinput maxlength="4" class="type-input" v-model="newNoteType" @confirm="addNoteType"
					placeholder="不能与已有类型名称重复" :inputBorder="false" :clearable="false" />
				<view class="input-length">
					{{ newNoteType.length }}/4
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowAddType: false, // 是否显示新增类型的输入框
				disabled: true, // 是否禁用提交按钮
				noteTypeList: [], // 记账类型
				currentType: {}, // 当前选中的记账类型
				currentTypeIndex: 0, // 当前选中的记账类型index
				amount: 0, // 记账金额
				remark: '', // 备注
				myHomeInfo: uni.getStorageSync('roomAddress'), // 当前我的家
				newNoteType: '', // 新增的类型名称
				projectId: '', // 项目ID
				isManage: false, // 是否点击分类删除
			}
		},
		onLoad(option) {
			if (option.projectId) {
				this.projectId = option.projectId
			}
			this.getNoteType()
		},
		watch: {
			amount() {
				if (this.amount <= 0) this.disabled = true
				else this.disabled = false
			}
		},
		methods: {
			// 启用点击删除分类
			deleteMode() {
				if(this.isManage){
					this.isManage = false
				} else {
					this.isManage = true
					this.$util.toast('点击分类删除')
				}
			},
			// 删除记账类型
			deleteType(item) {
				if (item.userId == -1) {
					this.$util.toast('默认分类无法删除')
					return
				}
				uni.showModal({
					title: '确认操作',
					content: `确认删除${item.name}？`,
					success: (res) => {
						if (res.confirm) {
							this.$httpApi.deleteCostNoteType(item.id).then(response => {
								if (response) {
									this.getNoteType(true)
									this.$util.toast('删除成功')
								}
							})
						}
					}
				})
			},
			// 提交表单
			saveForm() {
				if(this.disabled) return
				let obj = {}
				if (this.projectId) {
					obj = {
						addressId: this.myHomeInfo.id,
						projectId: this.projectId,
						bookkeepingTypeId: this.currentType.id,
						bookkeepingTypeName: this.currentType.name,
						money: this.amount,
						remark: this.remark
					}
				} else {
					obj = {
						addressId: this.myHomeInfo.id,
						bookkeepingTypeId: this.currentType.id,
						bookkeepingTypeName: this.currentType.name,
						money: this.amount,
						remark: this.remark
					}
				}
				this.$httpApi.addCostNote(obj).then(res => {
					if (res) {
						this.$util.toast('添加成功~')
						setTimeout(() => {
							this.goBack()
						}, 500)
					}
				})
			},
			// 选择记账类型
			selectNoteType(item, index) {
				if (this.isManage) {
					this.deleteType(item)
				} else {
					this.currentType = item
					this.currentTypeIndex = index
				}
			},
			// 新增自定义记账类型
			addNoteType(type) {
				if (!this.newNoteType) return
				const index = this.noteTypeList.findIndex(item => item.name == this.newNoteType)
				if (index !== -1) {
					this.$util.toast('已有相同分类')
					return
				}
				this.$httpApi.addCostNoteType({
					addressId: this.myHomeInfo.id,
					name: this.newNoteType,
				}).then(res => {
					if (res) {
						this.getNoteType(true)
						this.newNoteType = ''
						this.isShowAddType = false
					}
				})
			},
			// 获取记账类型
			getNoteType(autoSelect = false) {
				this.$httpApi.getCostNoteType().then(res => {
					if (res) {
						this.noteTypeList = res
						if (autoSelect) {
							// 新增分类以后自动选择
							this.currentType = res[res.length - 1]
							this.currentTypeIndex = res.length - 1
						} else {
							this.currentType = res[0]
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar {
		@include nav-bar-title(#000000)
	}

	.nav-bar-right {
		/* #ifdef MP-WEIXIN */
		margin-left: 30rpx;
		/* #endif */
		/* #ifndef MP */
		margin-right: 30rpx;
		/* #endif */
		font-size: 24rpx;
	}

	.shaking {
		animation-name: shake;
		animation-duration: .5s;
		animation-iteration-count: infinite;
		transform-origin: 50% 0%;

		@keyframes shake {
			0% {
				transform: rotate(-2deg);
				animation-timing-function: ease-in;
			}

			50% {
				transform: rotate(2.5deg);
				animation-timing-function: ease-out;
			}
		}
	}

	.cost-type {
		width: 100vw;
		padding: 30rpx;
		flex-wrap: wrap;

		.type-item-active {
			width: max-content;
			height: 54rpx;
			background: rgba(254, 110, 50, 0.1000);
			border-radius: 10rpx;
			padding: 0 20rpx;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #FE6E32;
			line-height: 54rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
		}

		.type-item {
			width: max-content;
			height: 54rpx;
			background: #F7F7F7;
			border-radius: 10rpx;
			padding: 0 20rpx;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
			line-height: 54rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
		}
	}

	.add-type {
		width: 100vw;
		height: 30vh;
		padding: 30rpx;

		.popup-header {
			justify-content: space-between;

			.left {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}

			.right {
				font-size: 28rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #4060c4;
				line-height: 34rpx;
			}
		}

		.input-length {
			margin-left: 30rpx;
			font-size: 28rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #000000;
			line-height: 34rpx;
		}

		.type-input {
			height: 74rpx;
			margin-top: 20rpx;
		}
	}

	.input-container {
		width: 690rpx;
		min-height: 210rpx;
		height: max-content;
		border-radius: 20rpx;
		background-color: #F7F7F7;
		margin: 30rpx 30rpx 0 30rpx;
		padding-bottom: 20rpx;

		.input-area {
			width: 100%;
			height: 130rpx;
			border-bottom: 2rpx solid #E6E6E6;
			padding: 0 30rpx;

			.amount-symbol {
				font-size: 48rpx;
				font-family: Noto Sans S Chinese;
				font-weight: 500;
				color: #000000;
				line-height: 34rpx;
			}
		}

		.input-textarea {
			height: 96rpx;
		}
	}

	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
