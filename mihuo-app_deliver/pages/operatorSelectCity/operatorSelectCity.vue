<template>
	<view style="margin: 100px 0 0 0;">
		<view class="select-city-wrap" :style="'height:' + windowHeight">
			<!-- 内容 -->
			<view class="top getHeight" id="top" style="background-color: #fff;">
				<uni-easyinput class="search-input" prefixIcon="search" :placeholderStyle="placeholderStyle"
					:inputBorder="false" v-model="keyword" placeholder="请输入城市名或拼音查询" />
				<!-- <text>选择服务区</text> -->
				<image src="/static/images/icon_close/close.png" class="iconfont close" @click="()=>onClose()" />
			</view>
			<scroll-view class="scroll" :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="true"
				:show-scrollbar="false" :style="'height:'+windowHeight">
				<!--定位-->
				<view style="background-color: #FFFFFF;">
					<view style="padding-top: 20rpx;">
						<view class="current-city" id="current" v-if="position.address">当前/历史:
							{{ addressCity(position.address) }}
						</view>
						<!-- <view class="city-item" v-if="position.address">
							<view class="city-item-view" style="display: flex;">
								<uni-icons type="map-pin-ellipse" color="#999999" style="margin-top: -4rpx;"></uni-icons>
								<image class='address-icon' src='@/static/images/address_mini_icon.png' />
								<text class="city-item-text" @click="onSelect(position)">
									{{ addressCity(position.address) }}
								</text>
							</view>
						</view> -->
					</view>
					<view class="line"></view>
					<!-- 定位城市 -->
					<text class="name">定位城市{{ allowLocation == 1 ? '' : '(未开启定位)' }}</text>
					<view class="city-item" style="padding-bottom: 40rpx;">
						<view class="city-item-view" v-if="allowLocation == 1" @click="onSelect(locationCity)">
							<text class="city-item-text">
								{{ addressCity(locationCity.address) }}
							</text>
						</view>
						<view class="city-item-view" v-else @click="askPermisson">
							<text class="city-item-text">
								点击开启
							</text>
						</view>
					</view>
					<!-- 热门城市 -->
					<text class="name">热门城市</text>
					<view class="city-item" style="padding-bottom: 40rpx;">
						<view :class="city.id == cityitem.id?'city-item-viewa':'city-item-view' "
							v-for="(cityitem, i) in hotCitys" :key="cityitem.id" @click="onSelect(cityitem)">
							<text :class="city.id== cityitem.id?'city-item-texta':'city-item-text' ">
								{{ addressCity(cityitem.address) }}
							</text>
						</view>
					</view>
				</view>
				<view :id="item._id" v-for="item in cityData" :key="item._id">
					<!-- ABCD -->
					<view class="letter-content" :class="scrollIntoId === item._id ? 'blinking' : ''">
						<text class="letter">{{ item._id }}</text>
					</view>
					<!-- 城市 -->
					<view class="city-item-list">
						<view :class="city.id == cityitem.id?'city-item-viewa':'city-item-view' "
							v-for="(cityitem, i) in item.data" :key="cityitem.id" @click="onSelect(cityitem)">
							<text
								:class="city.id == cityitem.id?'city-item-texta':'city-item-text' ">{{ addressCity(cityitem.address) }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 右边锚点 -->
			<view class="anchor" @touchstart="start" @touchmove="move" @touchend="end" v-if="sliding">
				<view>
					<view class="anchor-item" @click="scrollIntoId = 'current'"><text class="anchor-text">#</text>
					</view>
					<view class="anchor-item" v-for="(item,index) in anchorArr" :key="index" @click="srcollToItem(item)"
						:class="{'chooseItem':scrollIntoId == item}">
						<text class="anchor-text">{{ item }}</text>
					</view>
				</view>
			</view>
			<view class="anchor" v-else>
				<view>
					<view class="anchor-item" @click="scrollIntoId = 'current'"><text class="anchor-text">#</text>
					</view>
					<view class="anchor-item" v-for="(item,index) in anchorArr" :key="index"
						@click="srcollToItem(item)">
						<text class="anchor-text">{{item}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		judgePermission,
		gotoAppPermissionSetting,
	} from '@/plugins/permission'
	import {
		deepClone
	} from '@/plugins/utils.js'
	// hotCitys  热门城市  
	// value 当前选中城市
	// windowHeight  scroll的高 也是滑块的高 记得带单位!!! px rpx upx都支持
	// sliding 是否开始滑动选择 默认开启  false true
	// @onSelect   点击切换城市事件 参数为城市名称
	// import cityData from './cityData.js'
	let anchorArr = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X",
		"Y", "Z"
	];
	let kList = [{
			sort: 1,
			_id: 'A',
			data: []
		}, {
			sort: 2,
			_id: 'B',
			data: []
		}, {
			sort: 3,
			_id: 'C',
			data: []
		},
		{
			sort: 4,
			_id: 'D',
			data: []
		}, {
			sort: 5,
			_id: 'E',
			data: []
		}, {
			sort: 6,
			_id: 'F',
			data: []
		},
		{
			sort: 7,
			_id: 'G',
			data: []
		}, {
			sort: 8,
			_id: 'H',
			data: []
		}, {
			sort: 9,
			_id: 'I',
			data: []
		},
		{
			sort: 10,
			_id: 'J',
			data: []
		}, {
			sort: 11,
			_id: 'K',
			data: []
		}, {
			sort: 12,
			_id: 'L',
			data: []
		},
		{
			sort: 13,
			_id: 'M',
			data: []
		}, {
			sort: 14,
			_id: 'N',
			data: []
		}, {
			sort: 15,
			_id: 'O',
			data: []
		},
		{
			sort: 16,
			_id: 'P',
			data: []
		}, {
			sort: 17,
			_id: 'Q',
			data: []
		}, {
			sort: 18,
			_id: 'R',
			data: []
		},
		{
			sort: 19,
			_id: 'S',
			data: []
		}, {
			sort: 20,
			_id: 'T',
			data: []
		}, {
			sort: 21,
			_id: 'U',
			data: []
		},
		{
			sort: 22,
			_id: 'V',
			data: []
		}, {
			sort: 23,
			_id: 'W',
			data: []
		}, {
			sort: 24,
			_id: 'X',
			data: []
		},
		{
			sort: 25,
			_id: 'Y',
			data: []
		}, {
			sort: 26,
			_id: 'Z',
			data: []
		}
	];
	export default {
		data() {
			return {
				locationCity: uni.getStorageSync('locationCity') || {
					address: '获取定位中'
				},
				position: uni.getStorageSync('oldLocation') || {
					address: '定位未开启 定位未开启'
				},
				currentCity: {},
				windowHeight: uni.getSystemInfoSync().windowHeight - 100 + "px",
				// 开启滑动选择
				default: true,
				hotCitys: [],
				cityData: [],
				scrollIntoId: '',
				city: {},
				anchorArr: [],
				sliding: true,
				// 滑动中选中的具体值
				slidingChoice: "",
				//开始滑动位置
				startY: "",
				// 滑动中当前选中下标
				downIndex: -1,
				keyword: '',
				placeholderStyle: `
					font-family: 'PingFang SC';
					font-style: normal;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #999999;`,
				tempCityData: [],
				locationPermission: false,
				allCityOperators: [],
				allowLocation: uni.getStorageSync('allowLocation') || 1, // 默认允许
			}
		},
		computed: {},
		onLoad() {
			// #ifdef APP-PLUS
			let locationPermission = uni.getStorageSync('位置')
			// 没有这个值时说明用户还没有明确点击拒绝授权，允许弹窗
			if (locationPermission === undefined || locationPermission === '') {
				locationPermission = true
			}
			this.locationPermission = locationPermission
			if (uni.getSystemInfoSync().platform == "android") {
				if (this.locationPermission) {
					// 允许申请使用位置信息
					judgePermission('location', res => {
						// 未请求，1 = 已允许，0 = 拒绝 null 未请求
						if (res == 1) {
							this.allowLocation = 1
						} else {
							this.allowLocation = res
							uni.setStorageSync('位置', false)
						}
						uni.setStorageSync('allowLocation', this.allowLocation)
						this.getOperator()
					})
				} else {
					// 拒绝使用位置信息 不显示弹窗
					this.getOperator()
				}
			} else {
				judgePermission('location', res => {
					// 未请求，1 = 已允许，0 = 拒绝 null 未请求
					if (res == 1) {
						this.allowLocation = 1
					} else {
						this.allowLocation = res
						uni.removeStorageSync('locationCity')
					}
					uni.setStorageSync('allowLocation', this.allowLocation)
					this.getOperator()
				})
			}
			// #endif
			// #ifdef H5
			this.getOperator()
			// #endif
		},
		onUnload() {
			if (JSON.stringify(this.city) === '{}' && !uni.getStorageSync('userAddress')) {
				// 用户没有选择运营商并返回上一页面
				// 默认选择第一个
				uni.$emit('operatorSelected', this.hotCitys[0]);
			}
		},
		watch: {
			keyword() {
				let result = [] // 返回的结果
				let oriCityData = this.tempCityData // 进行查询的城市列表
				if (this.keyword === '') {
					// 如果keyword为空, 直接将保存的tempCityData赋值给cityData
					result = this.tempCityData
				} else {
					var reg = /^[\u4e00-\u9fa5]{0,}$/; // 检测是否为中文的正则
					if (reg.test(this.keyword)) {
						// 如果输入了中文, 则对城市名称进行模糊查询
						oriCityData.forEach(item => {
							let findData = item.data.filter(city => city.address.includes(this.keyword))
							let obj = {
								...item
							}
							if (findData.length) {
								obj.data = [...findData]
								result.push(obj)
							}
						})
					} else {
						// 输入的是英文
						if (this.keyword.length === 1) {
							// 只输入了一个字母, 则对城市首字母进行模糊查询
							result = oriCityData.filter(item => item._id === this.keyword.toUpperCase())
						} else {
							// 输入了大于一个字母, 则将城市名称转换成拼音进行模糊查询
							oriCityData.forEach(item => {
								let findData = item.data.filter(city => city.pinyin.toLowerCase().includes(this
									.keyword.toLowerCase()))
								let obj = {
									...item
								}
								if (findData.length) {
									obj.data = [...findData]
									result.push(obj)
								}
							})
						}
					}
				}
				this.cityData = result
			},
		},
		methods: {
			// 手动点击申请使用位置信息
			askPermisson() {
				if (!this.allowLocation) {
					uni.showModal({
						content: '您当前暂未开启定位，是否开启定位？开启后可以为您提供对应运营商的服务。',
						cancelText: '取消',
						confirmText: '去开启',
						success: (res) => {
							if (res.confirm) {
								gotoAppPermissionSetting()
								this.allowLocation = 1
								uni.setStorageSync('allowLocation', 1)
								// 这里应该存储一次 res = 1 默认是同意
								uni.setStorageSync('位置', true)
							} else {
								uni.setStorageSync('位置', false)
							}
						}
					})
				}
			},
			// 右侧锚点跳转
			srcollToItem(item) {
				this.scrollIntoId = item
			},
			// 运营商名称显示处理
			addressCity(operatorName) {
				if (!operatorName) return ' '
				if(operatorName === '获取定位中'){
					return operatorName
				}
				let cities = ['北京市', '天津市', '上海市', '重庆市']
				let province = operatorName.split(' ')[0] // 省份名称
				let city = operatorName.split(' ')[1] // 城市名称
				if (cities.indexOf(province) !== -1) {
					// 如果是直辖市, 则使用省份名称
					return province
				}
				return city
			},
			//获取运营商
			getOperator() {
				this.$httpApi.getCityOperator().then(res => {
					if (!res) {
						return
					}
					this.allCityOperators = res
					this.hotCitys = res.slice(0, 5);
					let dataList = deepClone(kList);
					let dataCityLetter = [];
					res.forEach(item => {
						let index = dataList.findIndex(value => {
							return value._id === item.letter.toUpperCase()
						});
						if (!dataCityLetter.find((mitem) => mitem == item.letter.toUpperCase())) {
							dataCityLetter.push(item.letter.toUpperCase());
						}
						if (index !== -1) {
							dataList[index].data.push(item)
						}
					});
					this.anchorArr = dataCityLetter.sort();
					this.cityData = dataList.filter(item => item.data.length > 0);
					this.tempCityData = this.cityData
					if (this.allowLocation == 1) {
						this.getMatchedCityOperator()
					}
				})
			},
			// 根据位置信息匹配运营商
			getMatchedCityOperator() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						if (res) {
							uni.setStorageSync('latitude', res.latitude)
							uni.setStorageSync('longitude', res.longitude)
							if (res.address) {
								let provinceCity = res.address.province + ' ' + res.address.city
								// 获取地址后自动选择运营商
								for (let item of this.allCityOperators) {
									if (item.address === provinceCity) {
										this.locationCity = item
										uni.setStorageSync('locationCity', item)
										if(!uni.getStorageSync('cityOperatorId')){
											this.city = item;
											uni.setStorageSync('userAddress', this.city)
											uni.setStorageSync('cityOperatorId', this.city.id)
											uni.setStorageSync('oldLocation', this.city);
											uni.$emit('operatorSelected', this.city);
										}
										return
									}
								}
							}
						}
					},
					fail: (error) => {},
					complete: (end) => {}
				})
			},
			onClose() {
				uni.reLaunch({
					url: '../home/home'
				})
			},
			// 点击城市
			onSelect(city) {
				if(city.address == '获取定位中'){
					return
				}
				this.city = city;
				uni.setStorageSync('oldLocation', this.city);
				uni.$emit('operatorSelected', this.city);
				uni.navigateBack()
			},
			// 开始滑动
			start(e) {
				// console.log("开始滑动",e);
				// #ifdef MP
				let eY = e.changedTouches[0].clientY
				// #endif
				// #ifdef APP-PLUS
				let eY = e.changedTouches[0].screenY
				// #endif
				this.startY = eY;
				// 计算点击时候下标
				let index = eY / (eY / eY);
				index = parseInt((index - 200) / 40) - 1;
				this.downIndex = index;
			},
			// 开始移动
			move(e) {
				// console.log("开始移动",e);
				// #ifdef MP
				let downY = e.changedTouches[0].clientY;
				// #endif
				// #ifdef APP-PLUS
				let downY = e.changedTouches[0].screenY;
				// #endif

				let gap = this.startY - downY;
				let index = parseInt(gap / (uni.upx2px(gap) / gap) / 40);
				// 选中下标
				let optforIndex = this.downIndex - index;
				if (optforIndex < -1) {
					optforIndex = -1;
				} else if (optforIndex > 21) {
					optforIndex = 21;
				}
				this.slidingChoice = this.anchorArr[optforIndex];
				this.scrollIntoId = this.anchorArr[optforIndex];
			},
			// 滑动结束
			end(e) {
				// console.log("结束滑动",e)
				this.slidingChoice = '';
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: rgba($color: #000000, $alpha: 0.3);
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32rpx;
		font-weight: bold;
		padding-top: 20rpx;
		padding-bottom: 20rpx;

		.close {
			margin: 30rpx 25rpx;
			height: 50rpx;
			width: 50rpx;
		}

		.search-input {
			margin: 0 40rpx;
			border-radius: 50rpx;
			background: #F6F6F6;
		}
	}

	.line {
		width: 95%;
		height: 2rpx;
		margin: 30rpx auto;
		background-color: #EEEEEE;
	}

	.select-city-wrap {
		overflow: hidden;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #f6f6f6;
	}

	/* 滑块 */
	.scroll {
		height: 100%;
		padding-bottom: 160rpx;
	}

	.name {
		margin: 30rpx 30rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #303133;
	}

	.current-city {
		margin-left: 56rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 44rpx;
		color: #909199;
	}

	/* 城市 */
	.letter-content {
		width: 100%;
		background-color: #F6F6F6;
		line-height: 88rpx;
		font-size: 32rpx;

		.letter {
			color: #303133;
			font-size: 28rpx;
			line-height: 44rpx;
			text-align: center;
			margin-left: 15rpx;
		}
	}
	.blinking {
		background-color: #F6F6F6;
		animation: blinking-animation .5s linear;
	}
	@keyframes blinking-animation {
		from {
			background-color: #F6F6F6;
		}

		50% {
			background-color: rgba(102, 102, 102, .2);
		}

		to {
			background-color: #F6F6F6;
		}
	}

	.city-item {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin: 0 20rpx;
		margin-top: 30rpx;

		.city-item-view {
			width: max-content;
			min-width: 180rpx;
			height: 55rpx;
			line-height: 50rpx;
			margin: 15rpx;
			border-radius: 6rpx;
			justify-content: center;
			align-items: center;
			background-color: #f6f6f6;
			text-align: center;

			.address-icon {
				width: 25rpx;
				height: 25rpx;
			}
		}

		.city-item-viewa {
			width: 180rpx;
			height: 55rpx;
			margin: 15rpx;
			line-height: 50rpx;
			border-radius: 6rpx;
			justify-content: center;
			align-items: center;
			text-align: center;
			background-color: #f6f6f6;
		}
	}

	.city-item-list {
		background-color: #FFFFFF;

		.city-item-view {
			line-height: 80rpx;
			margin: 0 20rpx;
			border-bottom: 1px solid #f6f6f6;
		}

		.city-item-viewa {
			margin: 15rpx;
			line-height: 80rpx;
			border-bottom: 1px solid #f6f6f6;
		}
	}

	.city-item-text {
		width: max-content;
		color: #999;
		font-size: 28rpx;
		padding: 0 20rpx;
	}

	.city-item-texta {
		font-size: 28rpx;
		color: $themeColor;
	}

	/* 右锚点 */
	.anchor {
		/* background-color: pink; */
		position: fixed;
		right: 20rpx;
		top: 200px;
		z-index: 10;
		flex-direction: row;
	}

	.anchor-item {
		&.chooseItem {
			color: #fff;
			background: #002FA5;
			border-radius: 0rpx 200rpx 200rpx 0rpx;

			.anchor-text {
				color: #fff;
			}
		}

		align-items: center;
		flex-direction: row;
		padding: 10rpx 0;
		margin: 5rpx 0;
		text-align: center;
	}

	.anchor-text-position {
		height: 40rpx;
		width: 40rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 32rpx;
		color: #333;
		background-color: #E5E5E5;
		border-radius: 20rpx;
	}

	.anchor-text {
		font-size: 32rpx;
		line-height: 40rpx;
		padding: 0 15rpx;
		color: #909199;
	}
</style>
