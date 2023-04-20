<template>
	<view class="sop-operation" v-if="examineType !== '审查方' && bottomList.length > 0">
		<view class="seize-seat">
		</view>
		<view class="custom-nodes-page-button">
			<scroll-view :scroll-x="true" class="scroll-X">
				<view class="item-button-list">
					<view class="item-button-default"
						:class="[item.active ? 'item-button-default-active':'',item.borderActive ? 'item-button-default-border':'',setDisableClass(item) ]"
						v-for="(item,index) in bottomList" :key="index" @click="getButton(item)">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 项目模板=》节点配置=》手动开始、结束
	 * */
	import {
		mapState,
	} from 'vuex'
	export default {
		name: 'sop-operation',
		props: {
			addButtonList: { // 补充的按钮
				type: Array,
				default: function() {
					return []
				},
			},
		},
		data() {
			return {
				option: {},
				resultButtonList: [{
						name: '开始',
						active: false,
						disable: false,
						borderActive: true,
						startWay: 1
					},
					{
						name: '完成',
						active: true,
						disable: false,
						borderActive: false,
						finishWay: 1
					}
				],
				buttonList: []
			}
		},
		computed: {
			...mapState(['projectInfo', 'nodeInfo', 'userPersonInfo', 'examineType']),
			bottomList(){
				let isShow =  this.$permissionRouting.getInstance().isShow()
				if(isShow){
					return this.buttonList
				}
				return []
			}
		},
		watch: {
			addButtonList: {
				handler(newVal, oldVal) {
					this.$forceUpdate()
				},
				deep: true
			}
		},
		mounted() {
			this.getDetails()
		},
		onLoad(option) {
			this.option = option
		},
		methods: {
			getDetails() {
				this.details = this.nodeInfo
			},
			/**
			 * @description 
			 * startWay  手动开始(value = 1)
			 * finishWay 手动结束(value = 1)
			 * */
			getButtonList() {
				let tempButtonList = []
				this.buttonList = []

				// 其他按钮
				if (this.addButtonList.length > 0) {
					this.addButtonList.forEach(el => {
						tempButtonList.unshift({
							name: el.name,
							disable: el.disable, // 按钮禁用启用
							active: el.active, // 按钮背景色显示主色
							borderActive: el.borderActive // 按钮边框、文字显示主色
						})
					})
				}
				// 添加开始、完成按钮
				this.resultButtonList.forEach(el => {
					if (el.startWay == this.nodeInfo.startWay) {
						tempButtonList.push(el)
					} else if (el.finishWay == this.nodeInfo.finishWay) {
						// 如果是施工节点，则不预选手动完成
						if(Number(this.nodeInfo.businessType) !== 1005){
							tempButtonList.push(el)
						}
					}
				})
				this.buttonList = tempButtonList
				// console.log('buttonList',this.buttonList);
				this.setButtonDisable()
			},
			getUpdate() {
				this.$forceUpdate()
			},
			getButton(item) {
				if (this.setNodeSkip()) {
					this.$setNodeSkipStatus('tips')
					return
				}
				if (!item.disable) {
					if (['开始', '完成'].includes(item.name)) {
						this.toPage(`/pages/construction/customNodes/customNodesAdd?type=${item.name}`)
					} else {
						this.$emit('getButton', item.name)
					}
				}
			},
			setDisableClass(item) {
				if (this.setNodeSkip()) {
					return 'item-disable'
				}
				// , 
				if (['开始', '完成','撤销验收','提交验收'].includes(item.name)) {
					if (item.disable) {
						return 'item-disable'
					}
				} else {
					return ''
				}
			},
			/**
			 * @description 按钮禁用
			 * 节点状态： 0=未开始；1=(保留状态，未使用) 2=执行中 3=执行结束（完工）4=异常 5待审查  6待审核
			 * */
			setButtonDisable() {
				this.buttonList.forEach(el => {
					// , 
					if (['开始', '完成','提交验收'].includes(el.name)) {
						if ([5, 3].includes(Number(this.details.status))) {
							el.disable = true
						}
					}
					if (this.details.status == 2) {
						if (el.name == '开始') {
							el.disable = true
						}
					}
					if (this.details.status == 6) {
						el.disable = false
					}
					if (this.setNodeSkip()) {
						el.disable = true
					}
				})
				if (this.details.status == 3) {
					this.buttonList = this.buttonList.filter(item => item.name !== '开始')
					this.buttonList = this.buttonList.filter(item => item.name !== '完成')
				}
				this.$forceUpdate()
			},
			setNodeSkip() { // 见 tfs 26436
				if (!this.$setNodeSkipStatus('show')) {
					return true
				}
				// if (this.nodeInfo.skipStatus == 1 && this.nodeInfo.status == 1) {
				// 	return true
				// }
			}
		}
	}
</script>
<style lang="scss" scoped>
	.sop-operation {
		height: 100%;
		position: relative;
		z-index: 10;

		.seize-seat {
			height: 160rpx;
		}

		.custom-nodes-page-button {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			// width: 200rpx;

			.scroll-X {
				width: 100%;
				background-color: #fff;
			}

			.item-button-list {
				margin: 18rpx 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);

				.item-button-default {
					height: 88rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 1;
					color: #606166;
					border: 2rpx solid #EBEBEB;
					border-radius: 10rpx;
					font-size: 32rpx;
					margin-right: 24rpx;
					white-space: nowrap;

					padding: 0 20rpx;

					&:last-child {
						margin-right: 0rpx;
					}
				}

				.item-button-default-active {
					border: 2rpx solid $themeColor;
					color: #fff;
					background-color: $themeColor;
				}

				.item-button-default-border {
					border: 2rpx solid $themeColor;
					// margin-right: 24rpx;
					color: $themeColor;
				}

				.item-disable {
					opacity: 0.5;
				}
			}
		}
	}

	/* @import url(); 引入css类 */
</style>
