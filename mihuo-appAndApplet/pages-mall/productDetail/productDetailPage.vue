<template>
	<view class="product-page">
		<view class="servie-detail">服务详情</view>
		<!-- <image class="preferred-services" src="@/pages-mall/static/product/preferred_services.png" />
		<view class="product-name">
			<view class="product-name-text">石膏板造型吊顶</view>
			<image class="mi-huo-icon" src="@/pages-mall/static/product/mi_huo.png" />
		</view>
		<view class="product-desc">行业精英认证工匠 · 服务有保障</view>
		<view class="product-img">
			<image class="person-icon1" src="@/pages-mall/static/product/person_icon1.png" />
			<image class="img-data" :src="$util.thumbnailImage(productData.coverImg)" />
			<image class="person-icon2" src="@/pages-mall/static/product/person_icon2.png" />
		</view> -->
		<!-- 施工内容,服务内容 -->
		<view class="build-content" v-if="productProcess.buildContent && JSON.parse(productProcess.buildContent).length !== 0">
			<!-- <image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/build_content.png" /> -->
			<mall-mh-richTextParsing :data="productProcess.buildContent" />
		</view>
		<!-- 施工流程 -->
		<view class="build-process" v-if="buildProcess.length !== 0 && buildProcess[0].title">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/build_process.png" />
			<image mode='widthFix' class="build-content-img" style="margin-top: 20rpx"
				src="@/pages-mall/static/product/build_process_title.png" />
			<view class="build-process-content-back" />
			<view class="build-process-content" v-for="(item,index) in buildProcess" v-if="item.title" :key="index">
				<view v-if="index<2||arrowType">
					<view class="content-title">
						<view class="title-index">
							<view>Step{{ index < 9 ? `0${index + 1}` : index + 1 }}</view>
							<view class="index-bottom" />
						</view>
						<view class="title-text">{{ item.title }}</view>
					</view>
					<view class="content-desc">{{ item.description }}</view>
					<image class="process-img" v-if="item.processPic" mode="widthFix"
						:src="$util.thumbnailImage(item.processPic, true, 1500)" />
				</view>
			</view>
			<view class="complete-process" @click="handelClick" v-if="buildProcess.length>2">
				<span>{{ arrowTitle }}</span>
				<image :class="arrowType?'arrow-img-up':'arrow-img'" src="@/pages-mall/static/product/arrow.png">
			</view>
		</view>
		<!-- 施工标准 -->
		<view class="build-standard" v-if="productProcess.buildStandard && JSON.parse(productProcess.buildStandard).length !== 0">
			<image class="build-content-img" mode='widthFix' src="@/pages-mall/static/product/build_standard.png" />
			<image mode='widthFix' class="build-content-img" style="margin-top: 20rpx"
				src="@/pages-mall/static/product/build_standard_title.png" />
			<view class="standard-content">
				<mall-mh-richTextParsing :data="productProcess.buildStandard" />
			</view>
		</view>
		<!-- 验收标准 -->
		<view class="build-process acceptance-standard" v-if="checkStandard.length !== 0 && checkStandard[0].title">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/check_standard.png" />
			<image mode='widthFix' class="build-content-img" style="margin-top: 20rpx"
				src="@/pages-mall/static/product/check_standard_title.png" />
			<view class="check-standard-back" />
			<view class="check-standard-content" v-for="(item,index) in checkStandard" v-if="item.title" :key="index">
				<view class="check-index">
					<view class="check-index-text">验收</view>
					<view class="check-index-text">{{ index < 9 ? `0${index + 1}` : `${index + 1}` }}</view>
				</view>
				<image class="check-standard-img" :src="$util.thumbnailImage(item.processPic, true, 1500)" mode="widthFix">
					<view class="check-standard-title">{{ item.title }}</view>
					<view class="check-standard-desc">
						{{ item.description }}
					</view>
			</view>
		</view>
		<!-- 施工现场展示 -->
		<view class="build-content" v-if="constructionScene.length > 0 && constructionScene[0].title">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/construction_scene.png" />
			<view class="check-standard-content" v-for="(item,index) in constructionScene" :key="index">
				<image class="check-standard-img" v-if="item.processPic" :src="$util.thumbnailImage(item.processPic, true, 1500)"
					mode="widthFix" />
				<view class="check-standard-title">{{ item.title }}</view>
			</view>
		</view>
		<!-- 注意事项 -->
		<view class="build-content" v-if="productProcess.prompt && JSON.parse(productProcess.prompt).length !== 0">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/prompt_title.png" />
			<mall-mh-richTextParsing :data="productProcess.prompt" />
		</view>
		<!-- 适用范围 -->
		<view class="build-content" v-if="productProcess.scope && JSON.parse(productProcess.scope).length !== 0">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/scope_title.png" />
			<mall-mh-richTextParsing :data="productProcess.scope" />
		</view>
		<!-- 报价说明-->
		<view class="build-content" v-if="productProcess.priceDescription && JSON.parse(productProcess.priceDescription).length !== 0">
			<image mode='widthFix' class="build-content-img"
				src="@/pages-mall/static/product/tender_clarification_title.png" />
			<mall-mh-richTextParsing :data="productProcess.priceDescription" />
		</view>
		<!-- 质保权益 -->
		<view class="build-content" v-if="productProcess.qualityRight && JSON.parse(productProcess.qualityRight).length !== 0">
			<image mode='widthFix' class="build-content-img" src="@/pages-mall/static/product/quality_right_title.png" />
			<mall-mh-richTextParsing :data="productProcess.qualityRight" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'productDetailPage',
		props: {
			productId: {
				type: Number || String,
				default: 0
			}
		},
		data() {
			return {
				productData: {},
				productProcess: {},
				buildProcess: [],
				constructionScene: [],
				checkStandard: [],
				arrowType: false,
				arrowTitle: '查看完整施工流程'
			}
		},
		mounted() {
			this.getProductData()
		},
		methods: {
			getProductData() {
				this.$httpApi.getCommodityDetail({
					clientType: "APP",
					id: this.productId
				}).then(res => {
					this.productData = res
					this.productProcess = res.productProcess
					this.buildProcess = res.productProcess.buildProcess ? JSON.parse(res.productProcess
						.buildProcess) : []
					this.checkStandard = res.productProcess.checkStandard ? JSON.parse(res.productProcess
						.checkStandard) : []
					this.constructionScene = res.productProcess.constructionScene ? JSON.parse(res.productProcess
						.constructionScene) : []
				})
			},
			handelClick() {
				this.arrowType = !this.arrowType
				this.arrowTitle = this.arrowType ? '收起完整施工流程' : '查看完整施工流程'
			}
		}
	}
</script>

<style scoped lang="scss">
	.product-page {
		background: #FFFFFF;
		padding: 40rpx 30rpx;
		padding-bottom: 0;
		overflow: hidden;
		
		.servie-detail {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #141414;
			line-height: 46rpx;
			margin-bottom: 37rpx;
		}
	}

	.check-standard-title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
		line-height: 46rpx;
		text-align: center;
		margin-top: 16rpx;
	}

	.check-standard-desc {
		font-size: 13rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #808080;
		text-align: center;
		margin-top: 10rpx;
	}

	.check-standard-content {
		margin: 30rpx 0;
		position: relative;

		.check-index {
			.check-index-text {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				text-align: center;
				line-height: 30rpx;
			}

			width: 76rpx;
			height: 93rpx;
			position: absolute;
			z-index: 20;
			right: 20rpx;
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			background: url('@/pages-mall/static/product/check_index.png');
			background-size: 100% 100%;
		}

		.check-standard-img {
			width: 100%;
			height: 420rpx;
			background: #141414;
			border: 6rpx solid #FFFFFF;
			border-radius: 12rpx;
		}
	}

	.build-standard {
		padding: 40rpx 0;

		.standard-content {
			border: 5rpx solid #FFEDAB;
			border-radius: 6rpx;
			margin-top: 25rpx;
			padding: 40rpx;
		}
	}

	.build-content-img {
		width: calc(100% - 100rpx);
		margin-left: 50rpx;
		object-fit: contain;
		margin-bottom: 20rpx;
	}

	.acceptance-standard {}

	.build-process {
		background: #FFFFFF;
		margin: 0 -50rpx;
		padding: 60rpx 50rpx;
		position: relative;
		display: flex;
		flex-flow: column;
		overflow: hidden;

		.build-process-content-back {
			background: url('@/pages-mall/static/product/back_ip.png');
			background-size: 100% 100%;
			width: 100%;
			height: 665rpx;
			position: absolute;
			margin-right: -156rpx;
			right: 0;
			top: 200rpx;
		}

		.check-standard-back {
			background: url('@/pages-mall/static/product/back_ip.png') no-repeat;
			background-size: 100% 100%;
			width: 480rpx;
			height: 665rpx;
			margin-left: -156rpx;
			position: absolute;
			left: 0;
			top: 200rpx;
		}

		.complete-process {
			height: 69rpx;
			border: 3rpx solid #FE6E32;
			border-radius: 35rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FE6E32;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 70rpx;
			cursor: pointer;

			.arrow-img {
				width: 20rpx;
				height: 20rpx;
				margin-left: 20rpx;
			}

			.arrow-img-up {
				width: 20rpx;
				height: 20rpx;
				margin-left: 20rpx;
				transform: rotate(180deg);
			}
		}

		.build-process-content {
			margin-top: 40rpx;
			width: 100%;
			z-index: 20;

			.process-img {
				width: 100%;
				height: 414rpx;
				background: #92859F;
				border: 6rpx solid #FFFFFF;
				border-radius: 24rpx;
				margin-top: 36rpx;
			}

			.content-desc {
				margin-top: 25rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #141414;
			}

			.content-title {
				display: flex;
				align-items: center;

				.title-index {
					font-size: 34rpx;
					font-family: FZGDCTiS;
					font-weight: 500;
					color: #333333;

					.index-bottom {
						height: 10rpx;
						background: linear-gradient(90deg, #FFFFFF, #FE6E32, #FFDED1);
						border-radius: 5rpx;
						margin: -2rpx -5rpx;
					}
				}

				.title-text {
					font-size: 28rpx;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #141414;
					margin-left: 20rpx;
				}
			}
		}
	}

	.build-content {
		margin-top: 30rpx;
		padding-bottom: 30rpx;
	}

	.product-img {
		background: rgba(146, 133, 159, 0.24);
		box-shadow: 0rpx 13rpx 27rpx 0rpx rgba(0, 0, 0, 0.19);
		border-radius: 24rpx;
		margin-top: 47rpx;
		width: calc(100% - 20rpx);
		margin-left: 10rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		position: relative;

		.person-icon1 {
			position: absolute;
			width: 149rpx;
			right: 144rpx;
			height: 67rpx;
			top: -40rpx;
			z-index: 20;
		}

		.person-icon2 {
			position: absolute;
			width: 87rpx;
			right: 20rpx;
			height: 167rpx;
			bottom: -45rpx;
		}

		.img-data {
			margin-top: 10rpx;
			width: calc(100% + 20rpx);
			box-shadow: 0rpx 13rpx 27rpx 0rpx rgba(0, 0, 0, 0.19);
			border-radius: 24rpx;
		}
	}

	.product-desc {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #141414;
		margin-top: 26rpx;
	}

	.product-name {
		display: flex;
		margin-top: 20rpx;

		.product-name-text {
			font-size: 48rpx;
			font-family: FZRuiZhengHei_GBK;
			font-weight: 800;
			color: #141414;
		}

		.mi-huo-icon {
			width: 56rpx;
			height: 28rpx;
			color: #FFFFFF;
			background: #FE6E32;
			border-radius: 10rpx 2rpx 10rpx 0rpx;
			line-height: 28rpx;
			text-align: center;
			font-size: 18rpx;
			font-family: FZRuiZhengHei_GBK;
			font-weight: 800;
			margin-left: 20rpx;
			margin-top: -20rpx;
		}
	}

	.preferred-services {
		width: 176rpx;
		height: 40rpx;
		font-size: 43rpx;
		font-family: Edwardian Script ITC;
		font-weight: 400;
		color: #141414;
		line-height: 62rpx;
		opacity: 0.58;
	}
</style>
