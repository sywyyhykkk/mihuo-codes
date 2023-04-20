<template>
	<view class="add-work-item">
		<view class="item-contain ">
			<view class="public-item-left">
				<text class="symbol">*</text>
				<text class="label">服务内容</text>
			</view>
			<view class="item-right">
				<u-input v-model="form.title" :border="false" placeholder="请输入服务内容" placeholder-style="color:#999999" />
			</view>
		</view>
		<view class="item-contain-other">
			<view class="public-item-left">
				<text class="symbol">*</text>
				<text class="label">施工总量</text>
			</view>
			<view class="item-type-list">
				<view class="item-type" @click="getType(index,item)"
					:class="[index == typeListActiveIndex ? 'item-type-active':'']" v-for="(item,index) in typeList"
					:key="index">
					{{item.label}}
				</view>
			</view>
			<view class="public-item-bottom">
				<u-input v-model="form.quantity" @input="setOtherInput" class="describe-input" maxlength="200" height="120" type="textarea"
					placeholder="请填写施工总量" :border="true" />
			</view>
		</view>
		<view class="item-contain">
			<view class="public-item-left">
				<text class="symbol">*</text>
				<text class="label">价格</text>
			</view>
			<view class="item-right">
				<u-input v-model="form.price" type="digit" @input="setInput" @blur="setBlur" :border="false"
					placeholder="请输入价格" placeholder-style="color:#999999" />
			</view>
		</view>
		<view class="item-contain-bottom">
			<view class="public-item-left item-bottom">
				<text class="label serverdec">服务描述</text>
			</view>
			<view class="public-item-bottom ">
				<u-input v-model="form.description" class="describe-input" maxlength="200" height="160" type="textarea"
					placeholder="请输入服务描述内容" :border="true" />
			</view>
		</view>
		<bottom-button title="确认添加" @click="submit"></bottom-button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				form: {
					price: '', // 服务价格
					quantity: '', // 施工总量
					status: '1',
					title: '', // 	服务名称
					unit: '', // 	施工总量单位
					userId: ''
				},
				typeListActiveIndex: 0,
				typeList: [{
					label: '平方米',
					value: 1
				}, {
					label: '米',
					value: 2
				}, {
					label: '天',
					value: 3
				}]
			}
		},
		onShow() {
			this.initialization()
		},
		computed: {
			...mapState(['serviceGoodsList']),
		},
		onLoad() {

		},
		methods: {
			setInput(value) {
				this.$setInput((result) => {
					this.form.price = result
				}, value)
			},
			setBlur(value){
				this.$setBlur((result)=>{
					this.form.price = result
				},value)
			},
			setOtherInput(value){
				this.$setInput((result) => {
					this.form.quantity = result
				}, value)
			},
			initialization() {
				this.form.unit = this.typeList[this.typeListActiveIndex].label
				this.form.userId = uni.getStorageSync('userData').sysUser.userId
			},
			getType(index, item) {
				this.typeListActiveIndex = index
				this.unit = item.label
			},
			submit() {
				if (!this.form.title) {
					this.$util.toast('请输入服务内容');
					return
				}
				if (!this.form.quantity) {
					this.$util.toast('请输入施工总量');
					return
				}
				if (!this.form.price) {
					this.$util.toast('请输入价格');
					return
				}
				this.$httpApi.addCustomService(this.form).then(res => {
					if (res) {
						this.addListing(res)
						this.$util.toast('操作成功，将返回上一页面');
						setTimeout(() => {
							this.goBack()
						}, 2500)
					}
				})
			},
			addListing(item) {
				let tempList = this.serviceGoodsList
				item['selectNum'] = 1
				item['totalPice'] = item.price
				item['tempPrice'] = item.price
				item['price'] = item.price
				item['name'] = item.title
				tempList.push(item)
				this.$store.commit('setServiceGoodsList', tempList)
			},
		}

	}
</script>

<style lang="scss" scoped>
	.public-flex-all-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.public-flex-align-center {
		display: flex;
		align-items: center;
	}

	.public-flex-justify-center {
		display: flex;
		justify-content: center;
	}

	.public-flex-column {
		display: flex;
		flex-direction: column;
	}

	.public-flex-row {
		display: flex;
		flex-direction: row;
	}

	.add-work-item {
		margin-top: 8rpx;

		.item-contain {
			background-color: #fff;
			display: flex;
			align-items: center;
			flex-direction: row;
			padding: 42rpx 36rpx;
			margin-bottom: 2rpx;

			.item-right {
				width: 100%;
			}
		}

		.item-contain-other {
			background-color: #fff;
			display: flex;
			flex-direction: column;
			padding: 42rpx 36rpx;
			margin-bottom: 2rpx;

			.item-type-list {
				margin-top: 20rpx;
				display: flex;
				margin-bottom: 28rpx;

				.item-type {
					width: 136rpx;
					height: 56rpx;
					text-align: center;
					line-height: 56rpx;
					margin-right: 18rpx;
					border: 1rpx solid #D9D9D9;
					border-radius: 10rpx;
					color: #666666;
					font-size: $smallFontSize;
				}

				.item-type-active {
					border: 2rpx solid #002FA5;
					color: #002FA5;
				}
			}
		}
	}

	.item-contain-bottom {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding: 42rpx 36rpx;
		margin-bottom: 2rpx;

		.item-bottom {
			margin-bottom: 32rpx;
		}
	}

	.public-item-bottom {
		// padding: 24rpx;
		background: #F6F7F9;
		border-radius: 5px;
		// height: 140rpx;
	}

	.describe-input {
		border: 0px;
	}

	.public-item-left {
		margin-right: 40rpx;
		display: flex;
		align-items: center;
		.symbol {
			color: $errorFontColor;
			display: inline-block;
			height: 10px;
		}

		.label {
			font-size: $middleFontSize;
			color: $seconFontColor;
			width: 120rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: justify;
		    &.serverdec{
				text-indent: 5rpx;
			}
			&:after{
				content: "";
				display: inline-block;
				width: 100%;
			}
			// display: inline-block;
			// text-align: justify;
			// text-align-last: justify;
		}
	}
	
	/deep/ .u-input__input{
		color: #303133;
	}
</style>
