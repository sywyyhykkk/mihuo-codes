<template>
	<view>
		<public-module></public-module>
		<z-nav-bar>
			<view slot="default" class="nav-bar">存在问题</view>
			<view slot="right" class="determine" @click="toBack">确定</view>
		</z-nav-bar>

		<view class="content">
			<view class="selected_problems">
				<view class="title" style="padding-top: 40rpx;">已选问题</view>
				<view>
					<u-checkbox-group style="width: 100%;">
						<u-checkbox active-color="$themeColor"
							style="width: 100%;height: 98rpx;border-bottom: 2rpx dashed #EEEEEE;"
							@change="checkedboxChange" v-model="item.checked" v-for="(item, index) in checkedList"
							:key="index" :name="item.ruleId" shape="circle" size=28 label-size=26>
							{{item.name}}
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="search_view align-center">
					<view class="title">存在问题<text>（可多选）</text></view>
					<view class="search_box align-center">
						<image class="search_icon" src="/static/icon/search_icon.png"></image>
						<input type="text" :class="isSearchShow ? 'focus_input' : ''" placeholder="搜问题"
							placeholder-style="color:#c2c2c2" confirm-type="search" :auto-blur="true"
							@input="changeValue" @focus="getFocus" @blur="loseBlur" @confirm="searchData"
							v-model="keyword" class="search-input" />
					</view>
				</view>
				<view class="scroll_view">
					<scroll-view class="scroll" scroll-x="false" @scroll="scroll">
						<view class="item_view">
							<view class="item" :class="current === x ? 'isActive' : ''" v-for="(m,x) in typeList"
								:key="x" @click="selectedItem(m,x,()=>{})">
								{{m}}
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="checked_view">
					<u-checkbox-group style="width: 100%;">
						<u-checkbox active-color="$themeColor"
							style="width: 100%;height: 98rpx;border-bottom: 2rpx dashed #EEEEEE;"
							@change="checkboxChange" v-model="item.checked" v-for="(item, index) in checkList"
							:key="index" :name="item.ruleId" shape="circle" size=28 label-size=26>
							{{item.name}}
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<mh-empty v-show="checkList.length === 0" icon="/static/images/no_recommend.png" title="没有数据～～" />
			</view>
			<view class="btn_view" @click="toCustom">+ 自定义问题</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		data() {
			return {
				keyword: '',
				isSearchShow: false,
				total: 0,
				page: 1,
				size: 10,
				pages: 0,
				pageCurrent: 1,
				current: -1,
				checkedList: [],
				checkList: [],
				typeList: [],
				punishObj: {},
				skillId: '',
				ruleCategory: ''
			};
		},
		onLoad(option) {
			this.skillId = option.skillId
			this.getType()
			// 判断上个页面带过来的数据默认被选中
			this.punishObj = JSON.parse(option.punishListItem)
			this.checkedList = this.punishObj.forfeitLogAddDTOList
			//''只是占位
			this.selectedItem(this.ruleCategory, this.current, () => {
				if (this.checkedList && this.checkedList.length) {
					this.checkedList.map(item => {
						this.checkList.map(item2 => {
							if (item2.ruleId === item.ruleId && item2.name === item.name) {
								item2['checked'] = item.checked
							}
						})
					})
				}
			})
		},

		onShow() {
			this.pageCurrent = 1
			this.punishObj['forfeitLogAddDTOList'] = this.checkedList
			this.checkList = this.checkList.map(item => {
				this.checkedList.map(itm => {
					if (item.ruleId === itm.ruleId && item.name === itm.name) {
						item['checked'] = true
					}
				})
				return item
			})
		},

		onReachBottom() {
			if (this.checkList.length === this.total) return
			this.selectedItem(this.ruleCategory, this.current, () => {});
		},
		computed: {
			...mapState(['orderInfo'])
		},
		methods: {
			changeValue(e) {
				this.keyword = e.target.value;
				this.selectedItem(this.ruleCategory, this.current, () => {});
			},
			loseBlur() {
				this.isSearchShow = false;
				this.selectedItem(this.ruleCategory, this.current, () => {});
			},
			getFocus() {
				this.isSearchShow = true
			},
			toCustom() {
				uni.navigateTo({
					url: `/pages/construction/punish/customProblems?punishList=${JSON.stringify(this.checkedList)}`
				})
			},
			toBack() {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.$vm.punishData = this.punishObj
				uni.navigateBack()
			},
			searchData() {
				this.selectedItem(this.ruleCategory, this.current, () => {});
			},
			getType() {
				this.$httpApi.getRuleCategory({
					clientId: uni.getStorageSync('cityOperatorId'),
					ruleType: 1,
					skillIds: this.skillId !== 'undefined' ? this.skillId : ''
				}).then(res => {
					if (res) {
						this.typeList = res
						let array = [];
						//去重
						for (let i = 0; i < this.typeList.length; i++) {
							if (array.indexOf(this.typeList[i]) === -1) {
								array.push(this.typeList[i])
							}
						}
						this.typeList = array
					}
				})
			},
			selectedItem(item, index, callback) {
				if (item !== '') {
					this.pageCurrent = 1
				}
				this.current = index;
				this.ruleCategory = item;
				this.$httpApi.getAppPage( {
					clientId: uni.getStorageSync('cityOperatorId'),
					clientType: "companyweb",
					ruleType: 1, //规则类型 0-奖励 1-处罚
					current: this.pageCurrent,
					size: this.size,
					ruleCategory: item ? item : '',
					fuzzyName: this.keyword,
					skillIds: this.skillId !== 'undefined' ? this.skillId : ''
				}).then(res => {
					if (res) {
						this.total = res.total
						res.records = res.records.map(item => {
							this.checkedList.map(m => {
								//切换tab选过的就选中
								if (item.ruleId === m.ruleId && item.ruleCode === m.ruleCode) {
									item['checked'] = true
								}
							})
							return item
						})
						this.checkList = this.pageCurrent > 1 ? this.checkList.concat(res.records) : res.records
						this.pageCurrent += 1
					}
					callback()
				})
			},
			scroll(e) {
				// console.log(e)
			},
			// 选中某个复选框时，添加到已选，否则删除
			checkboxChange(e) {
				let temList = this.checkList;
				if (e.value) {
					for (let i = 0; i < temList.length; i++) {
						if (temList[i].ruleId === e.name) {
							this.checkedList.push(temList[i]);
						}
					}
					this.punishObj['forfeitLogAddDTOList'] = this.checkedList
				} else {
					let temedList = this.checkedList;
					for (let i = 0; i < temedList.length; i++) {
						if (temedList[i].ruleId === e.name) {
							temedList.splice(i, 1)
						}
					}
					this.checkedList = temedList
					this.punishObj['forfeitLogAddDTOList'] = temedList
				}
			},
			//取消添加
			checkedboxChange(e) {
				this.checkList.map(item => {
					if (item.ruleId === e.name) {
						item.checked = e.value
					}
				})
				this.checkedList.map((item, index) => {
					if (!e.value && item.ruleId === e.name) {
						this.checkedList.splice(index, 1)
					}
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.nav-bar {
		font-weight: bold;
		font-size: $mainFontSize;
		color: $darkTitle;
	}

	.determine {
		font-weight: bold;
		font-size: 14px;
		color: $themeColor;
		margin-right: 24rpx;
	}

	.content {
		height: 100vh;
		margin-top: 10rpx;
		padding: 0 62rpx;
		background-color: #FFFFFF;
		overflow-y: auto;

		.search_view {
			padding-top: 30rpx;
		}
	}

	.scroll_view {
		width: 100%;
		height: auto;
		overflow: hidden;
		white-space: nowrap;

		.scroll {
			overflow: hidden;
			width: 100%;
			height: auto;

			.item_view {
				.item {
					display: inline-block;
					margin-right: 36rpx;
					padding: 24rpx 0;
					font-size: 24rpx;
					color: #909199;
				}

				.isActive {
					font-weight: bold;
					font-size: 26rpx;
					color: $themeColor;
				}
			}
		}
	}

	.search_box {
		height: 64rpx;
		padding: 0 20rpx;
		border-radius: 46rpx;
		background-color: #F3F3F3;

		.search_icon {
			width: 16px;
			height: 16px;
			margin-right: 12rpx;
		}

		input {
			width: 85rpx;
			font-size: 26rpx;
			transition: width .5s;
			-webkit-transition: width .5s;
		}

		.search-input {
			color: $themeColor;
		}

		.focus_input {
			width: 286rpx;
		}
	}

	.btn_view {
		text-align: center;
		margin: 46rpx 0;
		font-weight: bold;
		font-size: 28rpx;
		color: $themeColor;
	}

	.title {
		font-weight: bold;
		font-size: $middleFontSize;
		color: $seconFontColor;

		text {
			font-weight: 500;
			font-size: $middleFontSize;
			color: #909199;
		}
	}

	.align-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
