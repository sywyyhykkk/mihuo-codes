<template>
	<view class="view">
		<z-nav-bar>
			<view slot="default" class="right-nav">方案图纸</view>
		</z-nav-bar>
		<view class="view-select">
			<view class="select-Input" @click="()=>showService=true">
				<view class="select-Input_value">{{ title }}</view>
				<u-icon class="select-Input_arrow" name="arrow-down-fill" size="20"></u-icon>
			</view>
		</view>
		<!-- 按户型查看 -->
		<view class="view-content">
			<view v-if="groupList.length">
				<view v-for="(item,index) in groupList" :key="index">
					<view class="view-title">{{ item.groupName }}</view>
					<view class="view-house" v-if="item.uploadGroup == '1002'">
						<view class="view-house_swiper" v-for="(v,i) in item.sopUploadList" :key="i">
							<swiper @change="swiperChange($event,v.id)" class="swiper" circular :indicator-dots="false"
								:autoplay="false">
								<swiper-item class="swiper-item" @click="previewImage(v1.url,v.uploadItemList)"
									v-for="(v1,i1) in v.uploadItemList" :key="i1">
									<image class="swiper-item_image" :src="$util.thumbnailImage(v1.url, true)"
										mode="scaleToFill" />
								</swiper-item>
							</swiper>
							<text
								class="swiper_tips">{{ curId == v.id?curIndex:1 }}/{{v.uploadItemList.length || 0}}</text>
							<view class="view-house_remarks">{{ v.remark }}</view>
						</view>
						<myHome-mh-empty v-if="item.sopUploadList === 0" marginTop="100" size="200" title="暂无文件～～" />
					</view>
					<view v-else>
						<view class="view-design" v-if="item.uploadList.length">
							<image-show num="5" v-if="item.uploadList" :imgSrc="JSON.stringify(item.uploadList)" width="150" height="150" />
							<!-- <view v-for="(item1,index1) in item.uploadList" :key="index1" class="view-design_image">
								<image class="image" @click="previewImage(item1.url,item.uploadList)"
									:src="$util.thumbnailImage(item1.url, true)" mode="scaleToFill" />
							</view> -->
						</view>
						<myHome-mh-empty v-else marginTop="0" size="200" title="暂无方案图纸～～" />
					</view>
				</view>
			</view>
			<myHome-mh-empty v-else title="暂无方案图纸～～" />
		</view>
		<u-select v-model="showService" :list="projectList" @confirm="confirm" value-name="projectId"
			label-name="projectName"></u-select>
	</view>
</template>

<script>
	/**
	 * uploadGroup 1002 户型图
	 */
	export default {
		data() {
			return {
				curIndex: 1,
				curId: '',
				groupList: [],
				options: {},
				showService: false,
				projectList: [],
				title: '全屋图纸'
			}
		},
		onLoad(options) {
			this.options = options;
		},
		onShow() {
			this.getListData({
				addressId: this.options.addressId
			})
			this.getProjectList()
		},
		methods: {
			previewImage(url, data) {
				uni.previewImage({
					current: this.$util.thumbnailImage(url),
					urls: data.map(item => this.$util.thumbnailImage(item.url))
				})
			},
			swiperChange(e, id) {
				this.curId = id;
				this.curIndex = e.detail.current + 1;
			},
			getListData(data) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$httpApi.getSopupload(data)
					.then(res => {
						let data = res;
						if (data && data.length) {
							data.map(v => {
								v.uploadList = []
								if (v.uploadGroup != '1002') {
									if (v.sopUploadList && v.sopUploadList.length) {
										v.sopUploadList.some(item => {
											v.uploadList = v.uploadList.concat(item.uploadItemList)
										})
									}
								}
							})
						}
						this.groupList = data;
					}).finally(() => {
						uni.hideLoading();
					})
			},
			// 按地址获取项目
			getProjectList() {
				let obj = {
					projectName: '全屋图纸',
					projectId: 0
				}
				this.$httpApi.getProjectsByAddressId(this.options.addressId)
					.then(res => {
						if (res) {
							res.unshift(obj);
							this.projectList = res;
							this.title = this.projectList[0].projectName
						}
					})
			},
			confirm(e) {
				let query = {};
				if (e) {
					this.title = e[0].label;
					if (e[0].value) {
						query.projectId = e[0].value;
					} else {
						query.addressId = this.options.addressId;
					}
					this.getListData(query)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.view {
		padding: 0 30rpx;

		.right-nav {
			margin-right: 30rpx;
			/*  #ifdef  MP  */
			margin-right: 0;
			/*  #endif  */
			font-size: 28rpx;
		}

		.view-content {
			padding-top:100rpx;
			.view-title {
				color: #000000;
				padding: 20rpx 0;
			}

			.view-house_swiper {
				position: relative;
				margin-bottom: 20rpx;

				.view-house_remarks {
					color: #808080;
					font-size: 28rpx;
					padding-top: 10rpx;
				}

				.swiper_tips {
					position: absolute;
					background: #fff;
					font-size: 24rpx;
					padding: 10rpx 20rpx;
					border-radius: 30rpx;
					top: 240rpx;
					right: 20rpx;
				}

				.swiper {
					height: 300rpx;
					border-radius: 10rpx;

					.swiper-item {
						width: 100%;
						height: 100%;

						.swiper-item_image {
							width: 100%;
							height: 100%;
							border-radius: 10rpx !important;
						}
					}
				}
			}

			.view-design {
				display: flex;
				flex-flow: row wrap;

				.view-design_image {
					.image {
						height: 196rpx;
						width: 196rpx;
						margin-right: 20rpx;
						margin-bottom: 20rpx;
						border-radius: 12rpx;
					}
				}
			}

			.view-tabs {
				height: 110rpx;
				width: 690rpx;
			}
		}

		.view-select {
			z-index: 99;
			background: #fff;
			height: 100rpx;
			margin-bottom: 20rpx;
			position: fixed;
			.select-Input {
				width: 690rpx;
				padding: 30rpx;
				background: #F7F7F7;
				border-radius: 14rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.select-Input_value {
					font-size: 28rpx;
					color: #000000;
					font-family: NotoSansHans;
					@include toe();
				}

				.select-Input_arrow {
					margin-left: 20rpx;

				}
			}
		}
	}
</style>
