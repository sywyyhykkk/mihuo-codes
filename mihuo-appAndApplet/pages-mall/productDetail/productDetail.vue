<template>
	<view>
		<!-- #ifndef APP-PLUS -->
		<z-nav-bar :scrollTop="scrollTop" type="transparentFixed" :bgColor="['#FF9A52', '#FF6A32']">
			<view slot="transparentFixedLeft">
				<view class="nav-icon flex-center2" @click="goBackPage">
					<image style="width: 36rpx; height: 26rpx"
						src="https://www.51mihuo.com/static/icon/icon_back_white.png"></image>
				</view>
			</view>
			<view slot="left" class="flex-center2">
				<view class="nav-icon-color flex-center2" @click="goBackPage">
					<image style="width: 36rpx; height: 26rpx"
						src="https://www.51mihuo.com/static/icon/icon_back_white.png"></image>
				</view>
			</view>
			<view slot="default" class="nav-bar-title">
				<u-tabs :list="tabList" :current="currentTab" @change="onClickTab" active-color="#FFFFFF"
					inactive-color="#f7f7f7" bgColor="transparent" :barStyle="{ bottom: '10rpx' }" font-size="28">
				</u-tabs>
			</view>
		</z-nav-bar>
		<!-- #endif -->
		<!-- <mh-skeleton :loading="!isShowPage" :imgTitleHeight="600" :row="10"> -->
		<view class="page-container">
			<view class="image-content">
				<swiper @change="bannerChange" :indicator-dots="false" :autoplay="false" class="swiper">
					<swiper-item class="swiper-item" v-for="(item, index) in imgUrlList" :key="index">
						<image class="swiper-img" @click="previewImage(item)" v-if="item.type == 'image'"
							imgMode="aspectFill" :src="$util.thumbnailImage(item.url, true, 1500)" />
						<!-- <video v-else :src="item.url" muted :autoplay="true"></video> -->
					</swiper-item>
				</swiper>
				<!-- <u-swiper ref="swiper" height="1000" :list="imgUrlList" :autoplay="false" name="url" :circular="false"
					border-radius="0" img-mode="aspectFill" @click="previewImage" @change="bannerChange">
				</u-swiper> -->
				<view class="img-count flex-center2">
					<view class="text">
						{{ imgUrlList.length ? current : 0 }} /
						{{ imgUrlList.length || 0 }}
					</view>
				</view>
			</view>
			<view class="main-container">
				<view class="header-container" id="product-info">
					<view class="title">
						<text class="package-label" v-if="commodity.customCategory === '1003'">
							品质套餐
						</text>
						{{ commodity.name || '商品名称' }}
					</view>
					<view class="sale">
						{{ getProductSales }}
					</view>
					<view class="price-container flex-center2">
						<view class="price">
							<text class="price-symbol">¥</text>
							{{ Math.floor(showPrice) || 0 }}
							<text class="text" v-if="showPrice !== 0">
								{{ showPrice | priceFormat }}/{{ commodity.unit }}
							</text>
							<text class="stage-pay" v-if="isStagePay">
								分期支付
							</text>
						</view>
						<view class="price-right flex-center2" @click="viewProductPackage" v-if="isPackage">
							<view class="text"> 查看套餐清单 </view>
							<uni-icons type="right" color="#FE6E32" size="10"></uni-icons>
						</view>
						<view class="price-right flex-center2" v-if="isGroupDeal">
							<view class="group-text">
								拼团抢购
							</view>
						</view>
					</view>
					<view class="group-deal" v-if="isGroupDeal && groupDealList.length !== 0">
						<view class="deal-title flex-center2">
							<view class="left text">
								这些人已发起拼团，可参与拼团
							</view>
							<view class="right text" @click="viewMoreGroup">
								查看更多
								<uni-icons type="right" color="#000000" size="10"></uni-icons>
							</view>
						</view>
						<view class="group-item flex-center2" v-for="item, index in groupDealList" :key="index"
							style="margin-top: 20rpx;">
							<view class="group-member flex-center2">
								<u-avatar size="50" v-for="user, uIndex in item.members"
									:src="$util.avatarImage(user.userId)" :key="user.userId"></u-avatar>
								<view class="circle" v-for="circle in (item.groupCount - item.members.length)"
									:key="circle">
									?
								</view>
							</view>
							<view class="button" @click="addGroup(item)">
								去拼单
							</view>
						</view>
					</view>
					<view class="product-info" v-if="isService">
						<view class="topper flex-center2">
							<view class="left"> 觅活服务体系 </view>
							<view class="right">
								<!-- MORE -->
							</view>
						</view>
						<view class="icons flex-center2">
							<view class="icon-item flex-center2" @click="clickContent('工艺标准', 1001)">
								<image src="https://www.51mihuo.com/static/images/productDetail/button_1.png"
									class="icon">
								</image>
								<text class="text">工艺标准</text>
							</view>
							<view class="icon-item flex-center2" @click="clickContent('统一工价', 1002)">
								<image src="https://www.51mihuo.com/static/images/productDetail/button_2.png"
									class="icon">
								</image>
								<text class="text">统一工价</text>
							</view>
							<view class="icon-item flex-center2" @click="clickContent('品质保障', 1003)">
								<image src="https://www.51mihuo.com/static/images/productDetail/button_3.png"
									class="icon">
								</image>
								<text class="text">品质保障</text>
							</view>
							<view class="icon-item flex-center2" @click="clickContent('优质服务', 1004)">
								<image src="https://www.51mihuo.com/static/images/productDetail/button_4.png"
									class="icon">
								</image>
								<text class="text">优质服务</text>
							</view>
						</view>
					</view>
				</view>
				<view class="menu-item-container">
					<mall-mh-menu-item class="menu-item" v-if="!isPackage" title="选择" :border="true" @click="selectSku"
						height="100" iconColor="#141414">
						<view class="slot-content flex-center2">
							<view class="left-wrap"> {{ getSelectedSkuLabel() }} </view>
							<view class="right"></view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" :border="true" title="配送至" height="100"
						v-if="checkIsShow('配送')" @click="selectPostAddress" iconColor="#141414">
						<view class="slot-content flex-center2">
							<view class="left-wrap">
								{{ getSelectedAddress }}{{ deliveryTime }}
							</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" v-if="commodity.pricingRules" title="计价" height="100"
						:border="true" iconColor="#141414" @click="viewContent('计价', 'pricingRules')">
						<view class="slot-content flex-center2">
							<view class="left-wrap"> {{ commodity.pricingRules }} </view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" v-if="checkIsShow('配置') && commodity.configuration" title="配置"
						height="100" :border="true" iconColor="#141414" @click="viewContent('配置', 'configuration')">
						<view class="slot-content flex-center2">
							<view class="left-wrap">{{ commodity.configuration }}</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" v-if="checkIsShow('适用') && commodity.applicable" title="适用"
						height="100" :border="true" iconColor="#141414" @click="viewContent('适用', 'applicable')">
						<view class="slot-content flex-center2">
							<view class="left-wrap">{{ commodity.applicable }}</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" v-if="checkIsShow('最低消费') && commodity.minAmount" title="最低"
						height="100" :border="true" iconColor="#141414"
						@click="viewContent('最低消费', 'minAmountDescription')">
						<view class="slot-content flex-center2">
							<view class="left-wrap left-wrap_only">
								最低消费
								<text>¥</text>
								<text class="price">{{ commodity.minAmount }}</text>
								<view class="left-wrap">
									{{ commodity.minAmountDescription || '' }}
								</view>
							</view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item v-if="checkIsShow('运费') && commodity.freightTemplateId" class="menu-item"
						:border="true" title="运费" iconColor="#141414" @click="viewRules(1)">
						<view class="slot-content flex-center2">
							<view class="left-wrap"> {{ freightStr }} </view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item v-if="checkIsShow('安装费') && commodity.freightInstallationTemplateId"
						class="menu-item" :border="true" title="安装费" iconColor="#141414" @click="viewRules(2)">
						<view class="slot-content flex-center2">
							<view class="left-wrap"> {{ installationStr }} </view>
						</view>
					</mall-mh-menu-item>
					<mall-mh-menu-item class="menu-item" :border="true" title="属性" iconColor="#141414"
						style="border-bottom: 2rpx #f7f7f7 solid" @click="viewContent('属性')">
						<view class="slot-content flex-center2">
							<view class="left-wrap">查看更多属性</view>
						</view>
					</mall-mh-menu-item>
				</view>
				<view class="comment-container" id="product-comment">
					<view class="comment-header flex-center2">
						<view class="left flex-center2">
							买家评价
							<text class="comment-count">({{ commentTotal }})</text>
						</view>
						<view class="right flex-center2" @click="goToMoreComments(1)">
							查看更多
							<uni-icons type="right" size="8" />
						</view>
					</view>
					<view class="comment-item" v-if="commodityComments.length">
						<view class="info flex-center2">
							<view class="left flex-center2">
								<u-avatar :src="$util.thumbnailImage(commodityComments[0].memberAvatar, true, 60)"
									size="60"></u-avatar>
								<view class="comment-user">
									<view class="name">
										{{ commodityComments[0].memberName || '未知用户' }}
									</view>
									<view class="rating flex-center2">
										<u-rate disabled :current="commodityComments[0].productScore" :allow-half="true"
											size="20" active-color="#EC7744" />
										<view class="divider-line" v-if="commodityComments[0].pmsSkuStock"></view>
										<view class="comment-sku" v-if="commodityComments[0].pmsSkuStock">
											{{ $tools.getSkuStr(commodityComments[0].pmsSkuStock.spData) }}
										</view>
									</view>
								</view>
							</view>
							<view class="right">
								{{ commodityComments[0].createTime }}
							</view>
						</view>
						<view class="content">
							{{ commodityComments[0].comment }}
						</view>
					</view>
					<view class="comment-header flex-center2 images" v-if="isShowCommentImage">
						<view class="left flex-center2"> 买家相册 </view>
						<view class="right flex-center2" @click="goToMoreComments(2)">
							查看更多
							<uni-icons type="right" size="8" />
						</view>
					</view>
					<view v-if="isShowCommentImage" style="margin-top: 30rpx">
						<image-show :imgSrc="getItemPics(commentImage)" width="200" height="200" right="20" />
					</view>
				</view>
				<!-- 店铺信息 -->
				<view class="product-shop" style="padding: 0 30rpx" v-if="storeArr && storeArr.length">
					<mall-mh-shop-info :shop-list="storeArr" @callBack="goShop"></mall-mh-shop-info>
				</view>
				<view id="product-detail" />
				<!-- 服务详情 -->
				<view class="product-detail" v-if="isService && !isShowPackage">
					<productDetailPage :productId="Number(commodityId)" />
				</view>
				<!-- 商品详情 -->
				<view class="product-detail" v-if="commodityDetail != '[]'">
					<view class="detail-title">商品详情</view>
					<mall-mh-edit-view v-if="commodityDetail && !isShowPackage" v-model="commodityDetail" />
				</view>
				<view class="recommend-container" v-if="relateProducts && relateProducts.length">
					<view class="title">猜您喜欢</view>
					<view class="cards flex-center2">
						<mall-mh-commodity-card-mini v-for="item in relateProducts" :key="item.id" :commodity="item">
						</mall-mh-commodity-card-mini>
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<cover-view class="bottom-buttons flex-center2" v-if="!isShowPackage && isShowButton">
				<cover-view class="buttons-mini flex-center2">
					<cover-view class="button-mini flex-center2" @click="goShop(storeArr[0])"
						v-if="storeArr && storeArr.length">
						<cover-image src="../static/icon/shop.png" class="icon" @click="goShop(storeArr[0])">
						</cover-image>
						<cover-view class="button-mini-text" @click="goShop(storeArr[0])">店铺</cover-view>
					</cover-view>
					<cover-view class="button-mini flex-center2" @click="goCustomerServer()">
						<cover-image src="../static/icon/cs.png" class="icon" @click="goCustomerServer()">
						</cover-image>
						<cover-view class="button-mini-text" @click="goCustomerServer()">客服</cover-view>
					</cover-view>
					<cover-view class="button-mini flex-center2" @click="addToFav">
						<cover-image src="../static/icon/fav.png" v-if="!isHold" class="icon" @click="addToFav">
						</cover-image>
						<cover-image src="../static/icon/fav_2.png" v-else class="icon" @click="addToFav">
						</cover-image>
						<cover-view class="button-mini-text" @click="addToFav">收藏</cover-view>
					</cover-view>
					<cover-view class="button-mini flex-center2" @click="goToShoppingCart">
						<cover-image src="../static/icon/shopping_cart.png" class="icon" @click="goToShoppingCart">
						</cover-image>
						<cover-view class="count" :style="{ top: '20rpx' }" @click="goToShoppingCart">
							{{ shoppingCartCount > 99 ? '...' : shoppingCartCount }}
						</cover-view>
						<cover-view class="button-mini-text" @click="goToShoppingCart">购物车</cover-view>
					</cover-view>
				</cover-view>
				<cover-view v-if="!isGroupDeal" class="buttons flex-center2"
					:style="{ opacity: commodity.stock == 0 ? '0.5' : '1' }">
					<cover-view class="left" v-if="isShowLeftButton" @click="selectSku(2)">
						{{ isShowLeftButton ? '加入购物车' : '' }}
					</cover-view>
					<cover-view class="right" v-if="!isStagePay && !isGroupDeal" @click="goToSubmitOrderPage()">
						{{ (isGroupDeal || isPackage || isStagePay) ? '' : commodity.stock == 0 ? '缺货' : '立即购买' }}
					</cover-view>
					<cover-view class="stage-container" v-if="isStagePay">
						<cover-view class="stage-button" @click="goToSubmitOrderPage()"
							v-if="commodity.flashOutputList && commodity.flashOutputList.length">
							{{ `立即付${commodity.payStages[0].name} ${commodity.payStages[0].type === 0 ? '¥' + commodity.payStages[0].amount : '' }` }}
						</cover-view>
						<cover-view class="stage-text" @click="goToSubmitOrderPage()">
							分期商品 装修有保障
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view v-if="isGroupDeal" class="buttons flex-center2">
					<cover-view class="buy-single">
						<cover-view class="button-price">
							<cover-view class="text flex-center2" style="width: 100%; justify-content: center;">
								<cover-view style="font-size: 20rpx; margin-top: 10rpx;" @click="goToSubmitOrderPage()">
									¥
								</cover-view>
								<cover-view style="font-size: 32rpx;" @click="goToSubmitOrderPage()">
									{{ showPrice }}
								</cover-view>
							</cover-view>
						</cover-view>
						<cover-view class="text" @click="goToSubmitOrderPage()">
							单独购买
						</cover-view>
					</cover-view>
					<cover-view class="buy-group" @click="clickGroupDeal()">
						<cover-view class="button-price">
							<cover-view class="text flex-center2" style="width: 100%; justify-content: center;">
								<cover-view style="font-size: 20rpx; margin-top: 10rpx;" @click="clickGroupDeal()">
									¥
								</cover-view>
								<cover-view style="font-size: 32rpx;" @click="clickGroupDeal()"
									v-if="commodity.flashOutputList && commodity.flashOutputList.length">
									{{ commodity.flashOutputList[0].flashPromotionPrice }}
								</cover-view>
							</cover-view>
						</cover-view>
						<cover-view class="text" @click="clickGroupDeal()">
							发起拼团
						</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<view class="bottom-buttons flex-center2">
				<view class="buttons-mini flex-center2">
					<view class="button-mini flex-center2" @click="goShop(storeArr[0])"
						v-if="storeArr && storeArr.length">
						<image src="../static/icon/shop.png" class="icon"></image> 店铺
					</view>
					<view class="button-mini flex-center2" @click="goCustomerServer()">
						<image src="../static/icon/cs.png" class="icon"></image> 客服
					</view>
					<view class="button-mini flex-center2" @click="addToFav">
						<image src="../static/icon/fav_2.png" v-if="isHold" class="icon"></image>
						<image src="../static/icon/fav.png" v-if="!isHold" class="icon"></image>
						收藏
					</view>
					<view class="button-mini flex-center2" @click="goToShoppingCart">
						<image src="../static/icon/shopping_cart.png" class="icon"></image>
						<view class="count" :style="{ top: '20rpx' }">
							{{ shoppingCartCount }}
						</view>
						购物车
					</view>
				</view>
				<view v-if="!isGroupDeal && !isStagePay" class="buttons flex-center2"
					:style="{ opacity: commodity.stock == 0 ? '0.5' : '1' }">
					<view class="left" v-if="!isPackage && !isStagePay" @click="selectSku(2)">
						加入购物车
					</view>
					<view class="right" @click="goToSubmitOrderPage">
						{{ commodity.stock == 0 ? '缺货' : '立即购买' }}
					</view>
				</view>
				<view class="buttons flex-center2" v-if="isStagePay"
					:style="{ opacity: commodity.stock == 0 ? '0.5' : '1' }">
					<view class="stage-container flex-center2" @click="goToSubmitOrderPage">
						<view class="stage-button" v-if="commodity.payStages && commodity.payStages.length">
							{{ `立即付${commodity.payStages[0].name} ${commodity.payStages[0].type === 0 ? '¥' + commodity.payStages[0].amount : '' }` }}
						</view>
						<view class="stage-text">
							分期商品 装修有保障
						</view>
					</view>
				</view>
				<view v-if="isGroupDeal" class="buttons flex-center2">
					<view class="buy-single" @click="goToSubmitOrderPage">
						<view class="button-price">
							<text class="text" style="font-size: 20rpx;">
								¥
							</text>
							<text class="text" style="font-size: 32rpx;">
								{{ Math.floor(showPrice) }}
							</text>
							<text class="text" style="font-size: 20rpx;">
								{{ showPrice | priceFormat }}
							</text>
						</view>
						<view class="text">
							单独购买
						</view>
					</view>
					<view class="buy-group" @click="clickGroupDeal">
						<view class="button-price">
							<text class="text" style="font-size: 20rpx;">
								¥
							</text>
							<text class="text" style="font-size: 32rpx;"
								v-if="commodity.flashOutputList && commodity.flashOutputList.length">
								{{ Math.floor(commodity.flashOutputList[0].flashPromotionPrice) }}
							</text>
							<text class="text" style="font-size: 20rpx;"
								v-if="commodity.flashOutputList && commodity.flashOutputList.length">
								{{ commodity.flashOutputList[0].flashPromotionPrice | priceFormat }}
							</text>
						</view>
						<view class="text">
							发起拼团
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- </mh-skeleton> -->
		<!-- sku选择弹窗 -->
		<!-- #ifndef APP-PLUS -->
		<mall-mh-sku-popup ref="skuPopup" :groupSku="groupSku" :isGroupProduct="isGroupBuy" :product="commodity"
			:isPackage="isPackage" :amountType="0" v-model="isShowSku" border-radius="20" :mode="popupType"
			:localdata="goodsInfo" :selected-init="false" :defaultSelect="defaultSelect" @getSkuLabel="getSkuLabel"
			@cart="addToShoppingCart" @buy="submitOrder">
		</mall-mh-sku-popup>
		<!-- #endif -->
		<!-- 运费模版/入户搬运费模版弹窗 -->
		<mihuo-popup ref="mihuoPopup" :title="currentRuleType === 1 ? '运费' : '安装费'">
			<mall-mh-freight-popup v-if="currentRuleType === 1" :freights="freight"></mall-mh-freight-popup>
			<mall-mh-installation-popup v-if="currentRuleType === 2" :installations="installation">
			</mall-mh-installation-popup>
		</mihuo-popup>
		<!-- 查看更多拼团弹窗 -->
		<mihuo-popup ref="groupPopup" title="这些人已发起拼团，可参与拼团">
			<view class="group-container">
				<view class="group-item flex-center2 popup-group-item" v-for="item, index in groupDealList"
					:key="index">
					<view class="group-member flex-center2" style="align-items: flex-start">
						<view class="avatar-item flex-center2" v-for="user, uIndex in item.members" :key="user.userId">
							<u-avatar size="60" :src="$util.avatarImage(user.userId)"></u-avatar>
							<view class="user-name">
								{{ user.nickName }}
							</view>
						</view>
						<view class="circle" v-for="circle in (item.groupCount - item.members.length)" :key="circle"
							style="width: 60rpx; height: 60rpx; line-height: 60rpx; margin-left: 10rpx;">
							?
						</view>
					</view>
					<view class="button" style="height: 60rpx; line-height: 60rpx;" @click="addGroup(item)">
						去拼单
					</view>
				</view>
			</view>
		</mihuo-popup>
		<!-- 质保/计价内容弹窗 -->
		<mihuo-popup ref="isShowContent" title="商品属性" :safe-area-inset-bottom="true" border-radius="20"
			:mask-close-able="true" :closeable="true">
			<view class="popup-container">
				<!-- 公用说明 -->
				<view class="content-item" v-if="checkIsShow('计价', true) && commodity.pricingRules">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						计价说明
					</view>
					<view v-if="checkIsShow('计价', true) && commodity.pricingRules" class="popup-text"
						v-html="commodity.pricingRules.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('质保', true) && commodity.qualityAssurance">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						质保说明
					</view>
					<view v-if="checkIsShow('质保', true) && commodity.qualityAssurance" class="popup-text"
						v-html="commodity.qualityAssurance.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('最低消费', true) && commodity.minAmountDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						最低消费
					</view>
					<view v-if="checkIsShow('最低消费', true) && commodity.minAmountDescription" class="popup-text"
						v-html="commodity.minAmountDescription.replace(/\n/g, '<br/>')" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<!-- 材料类型说明 -->
				<view class="content-item" v-if="checkIsShow('配置', true) && commodity.configuration">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						配置说明
					</view>
					<view v-if="checkIsShow('配置', true) && commodity.configuration"
						v-html="commodity.configuration.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('定额', true) && commodity.quoteDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						定额说明
					</view>
					<view v-if="checkIsShow('定额', true) && commodity.quoteDescription"
						v-html="commodity.quoteDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('发货', true) && commodity.deliveryDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						发货说明
					</view>
					<view v-if="checkIsShow('发货', true) && commodity.deliveryDescription"
						v-html="commodity.deliveryDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('退货', true) && commodity.refundDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						退货说明
					</view>
					<view v-if="checkIsShow('退货', true) && commodity.refundDescription"
						v-html="commodity.refundDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<!-- 服务类型说明 -->
				<view class="content-item" v-if="checkIsShow('适用', true) && commodity.applicable">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						适用说明
					</view>
					<view v-if="checkIsShow('适用', true) && commodity.applicable"
						v-html="commodity.applicable.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('发包', true) && commodity.issueDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						发包说明
					</view>
					<view v-if="checkIsShow('发包', true) && commodity.issueDescription"
						v-html="commodity.issueDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('工时', true) && commodity.hoursDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						工时说明
					</view>
					<view v-if="checkIsShow('工时', true) && commodity.hoursDescription"
						v-html="commodity.hoursDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('计费', true) && commodity.billingDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						计费说明
					</view>
					<view v-if="checkIsShow('计费', true) && commodity.billingDescription"
						v-html="commodity.billingDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-if="checkIsShow('结算', true) && commodity.settlementDescription">
					<view class="popup-title flex-center2">
						<view class="title-icon"></view>
						结算说明
					</view>
					<view v-if="checkIsShow('结算', true) && commodity.settlementDescription"
						v-html="commodity.settlementDescription.replace(/\n/g, '<br/>')" class="popup-text" />
					<view v-else class="popup-text">
						{{ emptyDescription }}
					</view>
				</view>
				<view class="content-item" v-for="(attr, idx) in productAttributeValueList" :key="idx">
					<view v-if="attr.productAttributeId" class="popup-title flex-center2">
						<view class="title-icon"></view>
						{{ getAttrName(attr.productAttributeId) }}
					</view>
					<view v-if="attr.value" v-html="attr.value.replace(/\n/g, '<br/>')" class="popup-text" />
				</view>
			</view>
		</mihuo-popup>
		<!-- #ifndef APP-PLUS -->
		<!-- 套餐弹框 -->
		<mihuo-popup ref="isShowPackage" :buttonsText="['取消', '购买']" :isShowButton="true" title="套餐选择"
			@confirm="confirmPackage" @cancel="cancelPackage">
			<mall-mh-set-meal-poup ref="productPackage" :buttonType="popupType" @submit="getMealList"
				:detailId="commodity.id" :treeList="treeList">
			</mall-mh-set-meal-poup>
		</mihuo-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		getCommoditySku,
		getGoodsInfo,
		getFreightRule,
		getInstallationRule
	} from '@/plugins/utils.js'
	import productDetailPage from './productDetailPage.vue'
	import CryptoJS from '@/plugins/crypto-js.js'

	export default {
		components: {
			productDetailPage
		},
		data() {
			var statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			return {
				shareGroupId: '', // 邀请好友拼单 拼团ID
				isGroupBuy: false, // 是否点击拼团购买
				groupSku: [], // 拼团时显示的价格
				isShowButton: false,
				isShowLeftButton: true, // 是否显示加入购物车按钮
				groupDealList: [], // 拼团信息
				selectedGroup: '', // 当前选择的拼团
				isGroupDeal: false, // 是否是团购商品
				isFlashSale: false, // 是否是秒杀商品
				isStagePay: false, // 是否是分期支付商品
				commentImage: '', // 买家相册
				isShowCommentImage: false, // 是否显示买家相册
				emptyDescription: '当前还没有该项说明~', // 无属性说明时显示的默认说明
				isShowPackage: false, // 是否显示套餐
				treeList: [], // 平台分类
				freight: [], // 运费模版
				installation: [], // 入户搬运费模版
				currentRuleType: 0, // 当前查看的模版
				freightStr: '', // 运费规则
				installationStr: '无需安装或不提供安装服务', // 入户搬运费规则
				defaultSelect: {}, // 默认选中的sku
				popupType: 1, // 选择规格弹窗的按钮模式
				goodsInfo: {}, // 选择sku弹窗的商品信息
				isShowPage: false,
				currentTab: 0,
				tabList: [{
						name: '商品'
					},
					{
						name: '评价'
					},
					{
						name: '详情'
					}
				],
				imgUrlList: [], // 商品相册
				commodity: {}, // 商品信息
				isShowSku: false, // 是否显示sku弹窗
				selectedSku: {}, // 选中的sku
				selectedPostAddress: {}, // 选中的收货地址
				amount: 1, // 商品数量
				commodityId: -1,
				userPostAddress: {}, // 用户收货地址
				scrollTop: 0,
				commodityComments: [], // 商品评价
				commentTotal: 0, // 商品评价的总数
				picsCommentTotal: 0, // 有图评价的总数
				isService: false, // 是否是服务类型商品
				current: 1, // 当前封面banner索引
				commodityDetail: '', // 商品详情
				shoppingCartCount: 0, // 购物车商品数量
				likeProducts: [], // 猜你喜欢
				isHold: false, // 是否已经收藏
				isFromShare: false,
				storeArr: [], // 店铺详情
				deliveryTime: '', // 配送时间
				relateProducts: [], // 关联商品
				showNativeTitle: false,
				currentViewType: '属性', // 当前查看的属性
				showPrice: 0, // 商品显示的价格
				isOfflineMaterials: false, // 是否是线下材料
				productAttributeValueList: [], // 商品自定义参数列表
				eleTop: {}, // 页面滚动锚点
				options: {}, // 页面参数
				isCityOperatorProduct: false, // 是否是运营端商品
				sourceInvitationCode: '', // 分享来源用户邀请码
				isPackage: false // 是否是套餐
			}
		},
		onLoad(options) {
			// 查询平台分类
			this.getTypeList()
			this.options = options
			if (options.scene && decodeURIComponent(options.scene)) {
				let tempOptions = decodeURIComponent(options.scene)
				let tempOptionsList = tempOptions.split('&')
				let resultOptions = []
				tempOptionsList.forEach((item) => {
					resultOptions.push(item.split('='))
				})
				options = this.getOption(resultOptions)
				if (options.source) {
					// 扫描二维码进入事件上报
					let base64Code = options.source.replace(/-/g, '+').replace(/_/g, '/')
					while (base64Code.length % 4) {
						base64Code += '='
					}
					const result = CryptoJS.enc.Base64.parse(base64Code).toString(
						CryptoJS.enc.Utf8
					)
					wx.reportEvent('scan_qr', {
						source: result
					})
				}
				this.commodityId = options.id
				this.isFromShare = true
			} else {
				this.commodityId = options.id
			}
			if (options.isFromShare == '1') {
				this.isFromShare = true
				// 上报分享链接打开事件
				this.reportShareLog()
				this.sourceInvitationCode = options.invitationCode // 分享来源的邀请码
				uni.setStorageSync('invitatonCode', options.invitationCode)
			}
			if (options.groupId) {
				// 邀请好友拼单
				this.shareGroupId = options.groupId
			}
			// 获取商品基本信息
			this.fetchCommodityDetailData()
			// 获取商品评论
			this.fetchCommodityCommentsData()
		},
		onShow() {
			if (uni.getStorageSync('userInfo').access_token) {
				// 获取拼团数据
				this.getAllProductGroup()
				// 获取购物车内商品数量
				this.getShoppingCartCount()
				// 查询是否已经收藏
				this.getCommodityIsHold()
				if (this.commodity.id) {
					this.getUserAddress()
				}
			}
		},
		onReady() {
			const query = uni.createSelectorQuery().in(this)
			let shiftValue = 20
			// #ifdef MP-WEIXIN
			shiftValue = -144
			// #endif
			query
				.select('#product-info')
				.boundingClientRect((data) => {
					if (data) {
						this.eleTop['info'] = data.top + shiftValue
					}
				})
				.exec()
			const query2 = uni.createSelectorQuery().in(this)
			query2
				.select('#product-comment')
				.boundingClientRect((data) => {
					if (data) {
						this.eleTop['comment'] = data.top + shiftValue
					}
				})
				.exec()
			const query3 = uni.createSelectorQuery().in(this)
			query3
				.select('#product-detail')
				.boundingClientRect((data) => {
					if (data) {
						this.eleTop['detail'] = data.top + shiftValue
					}
				})
				.exec()
		},
		onHide() {
			this.isShowPackage = false
			// #ifndef APP-PLUS
			this.$refs.isShowPackage.close()
			// #endif
			this.isShowSku = false
		},
		onShareAppMessage(e) {
			const coverImg = this.$util.thumbnailImage(
				this.commodity.coverImg,
				true,
				750
			)
			const path = `/pages-mall/productDetail/productDetail?id=${this.commodity.id}&isFromShare=1`
			const result = this.$util.shareToWechat(
				this.commodity.subTitle || this.commodity.name,
				coverImg,
				path,
				'商品详情',
				true,
				1
			)
			return result
		},
		onNavigationBarButtonTap(e) {
			this.share()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			switch (true) {
				case 0 < this.scrollTop && this.scrollTop <= this.eleTop['comment']:
					this.currentTab = 0
					break
				case this.eleTop['comment'] < this.scrollTop &&
				this.scrollTop <= this.eleTop['detail']:
					this.currentTab = 1
					break
				case this.eleTop['detail'] < this.scrollTop:
					this.currentTab = 2
					break
			}
		},
		computed: {
			getSelectedAddress() {
				if (!this.selectedPostAddress.id) return '请选择地址'
				return (
					this.selectedPostAddress.province +
					this.selectedPostAddress.city +
					this.selectedPostAddress.region
				)
			},
			getProductSales() {
				if (!this.commodity.id) return ''
				return Number(this.commodity.sale) <= 10 ?
					this.commodity.sale + '人付款' :
					Math.floor(Number(this.commodity.sale) / 10) * 10 + '+人付款'
			}
		},
		methods: {
			// 去拼单
			addGroup(item) {
				this.$refs.groupPopup.close()
				// #ifdef APP-PLUS
				uni.$emit('setIsGroupBuy', true)
				// #endif
				this.isGroupBuy = true
				this.selectedGroup = item
				this.selectSku(4)
			},
			// 发起拼团
			clickGroupDeal() {
				this.selectSku(4)
				// #ifdef APP-PLUS
				uni.$emit('setIsGroupBuy', true)
				// #endif
				this.isGroupBuy = true
				this.selectedGroup = null
			},
			// 查看更多拼团
			viewMoreGroup() {
				this.$refs.groupPopup.open()
			},
			// 评论图片预览
			previewImg(imgs, index) {
				uni.previewImage({
					current: index,
					urls: imgs.map((item) => this.$util.thumbnailImage(item))
				})
			},
			// 处理评论图片
			getItemPics(pics) {
				if (!pics) return ''
				try {
					// 真实用户的评价
					// 格式是 [{"type":"img","url":"29a056a5382d4a9f9f385044fcb2fbce.jpg"}]
					const images = JSON.parse(pics)
					return pics
				} catch (e) {
					// 平台维护的评价
					// 格式是 29a056a5382d4a9f9f385044fcb2fbce.jpg,29a056a5382d4a9f9f385044fcb2fbce.jpg
					const images = pics.split(',')
					return JSON.stringify(
						images.map((item) => {
							return {
								url: item,
								type: 'img'
							}
						})
					)
				}
			},
			// 取消选择套餐
			cancelPackage() {
				// 用于H5和小程序
				this.$refs.isShowPackage.close()
			},
			// 确认选择套餐
			confirmPackage() {
				// 用于H5和小程序
				this.$refs.productPackage.submitPackage()
			},
			// 获取已选套餐
			getMealList(data) {
				if (!uni.getStorageSync('userData')) {
					this.$util.goToLoginPage()
					return
				}
				if (this.popupType === 2) {
					// 加入购物车
					// 不允许加入购物车
					return
				} else if (this.popupType === 3) {
					// 立即购买
					const info = {
						shoppingCart: false,
						enableDiffAmount: true,
						memberReceiveAddressId: this.selectedPostAddress.id,
						products: [{
							skuId: data.skuId,
							count: data.selectNum,
							packageInfo: {
								packageId: this.commodity.id,
								...data.packageInfo
							}
						}],
						sourceType: 1 // app订单
					}
					this.$httpApi.generateMallOrder(info).then((res) => {
						uni.setStorageSync('orderConfirmInfo', res)
						this.toPage('/pages-mall/submitOrder/submitOrder')
						this.isShowPackage = false
						// #ifndef APP-PLUS
						this.$refs.isShowPackage.close()
						// #endif
					})
				}
			},
			// 查询平台分类
			getTypeList() {
				this.$httpApi
					.getListByTreeCode({
						clientType: 'platform'
					})
					.then((res) => {
						if (res) {
							// 平台分类
							this.treeList = res
						}
					})
			},
			// 查看套餐清单
			viewProductPackage() {
				this.toPage(
					`/pages-mall/productDetail/productPackage?id=${this.commodity.id}`
				)
			},
			// 上报分享链接打开事件
			reportShareLog() {
				const pages = getCurrentPages()
				const url = pages[pages.length - 1].route
				this.$util.reportShareEvent(
					'商品详情',
					url,
					this.options.userId,
					this.options
				)
			},
			// 点击顶部tab
			onClickTab(index) {
				this.currentTab = index
				uni.pageScrollTo({
					scrollTop: Object.values(this.eleTop)[index]
				})
			},
			// 解析路由参数
			getOption(arr) {
				let obj = {}
				arr.forEach((v) => {
					let key = v[0]
					let value = v[1]
					obj[key] = value
				})
				return obj
			},
			// 查看更多评价
			goToMoreComments(type) {
				const url =
					`/pages-mall/productDetail/productComment?id=${this.commodity.id}&type=${type}&total=${this.commentTotal}&picsTotal=${this.picsCommentTotal}&serviceType=${this.commodity.customCategory}`
				this.toPage(url)
			},
			// 获取spu名称
			getAttrName(id) {
				if (!this.commodity.id) return ''
				return this.commodity.productAttributeList.find((item) => item.id === id)
					?.name
			},
			// 菜单项显示状态
			checkIsShow(type, optional = false) {
				// 服务/材料都显示的菜单项
				const commonMenuItems = ['选择', '配送', '计价', '最低', '质保', '最低消费']
				// 服务类型显示的菜单项
				const serviceMenuItems = [
					...commonMenuItems,
					'适用',
					'发包',
					'工时',
					'计费',
					'结算'
				]
				// 材料类型显示的菜单项
				const materialMenuItems = [
					...commonMenuItems,
					'配置',
					'定额',
					'发货',
					'退货',
					'运费',
					'安装费'
				]
				if (optional) {
					const flag =
						this.currentViewType === type || this.currentViewType === '属性'
					return (
						(this.isService ?
							serviceMenuItems.includes(type) :
							materialMenuItems.includes(type)) && flag
					)
				} else {
					return this.isService ?
						serviceMenuItems.includes(type) :
						materialMenuItems.includes(type)
				}
			},
			// 获取已选规格label
			getSelectedSkuLabel() {
				if (JSON.stringify(this.selectedSku) == '{}') {
					return '请选择规格'
				}
				if (!this.selectedSku.label && this.commodity.id) {
					// 找到第一个库存不为0的sku
					const sku = this.commodity.skuStocks.find((item) => item.stock > 0)
					const spData = JSON.parse(sku.spData)
					let skuStr = ''
					spData.forEach((each, index) => {
						skuStr += `${each.value}${index == spData.length - 1 ? '' : '/'}`
					})
					return '已选：' + skuStr || ''
				}
				return '已选：' + (this.selectedSku ? this.selectedSku.label : '')
			},
			// 获取配送时长
			getDeliveryTime() {
				if (!this.selectedPostAddress.adcode) return
				this.$httpApi
					.getCommodityDeliveryTime({
						companyId: this.commodity.companyId,
						areaCode: this.selectedPostAddress.adcode
					})
					.then((res) => {
						if (res > 0) this.deliveryTime = '配送预计' + res + '天'
					})
			},
			// 查看商品说明信息
			viewContent(type, attr = '属性') {
				this.currentViewType = type
				this.$refs.isShowContent.open()
				// if (attr === '属性') {
				// 	this.currentViewType = type
				// 	this.$refs.isShowContent.open()
				// } else if (this.commodity[attr]) {
				// 	this.currentViewType = type
				// 	this.$refs.isShowContent.open()
				// }
			},
			// 查看运费模版/入户/安装费模版
			viewRules(type) {
				// type=1 查看运费模版 type=2 查看入户/安装费模版
				this.currentRuleType = type
				this.$refs.mihuoPopup.open()
			},
			// 获取运费模版
			async getFreightTemplate() {
				// 西山区发货 | 运费20元起，满2000元免运费，(具体以结算页为准)
				const freight = await this.$httpApi.getCommodityFreightTemplate(
					this.commodity.freightTemplateId
				)
				if (freight.templateId) {
					this.freight = [freight]
					const address = freight.address.name + '发货'
					const rule = getFreightRule(freight)
					// 不显示发货地
					this.freightStr = rule + ' (具体以结算页为准)'
				}
			},
			// 获取入户/安装费模版
			async getInstallationTemplate() {
				// 入户/安装费20元起，满2000元免运费｜上楼费5元/层 (具体以结算页为准)
				const installation = await this.$httpApi.getCommodityInstallationTemplate(
					this.commodity.freightInstallationTemplateId
				)
				if (installation.templateId) {
					this.installation = [installation]
					const rule = getInstallationRule(installation)
					this.installationStr = rule + ' (具体以结算页为准)'
				}
			},
			// 进店铺
			goShop(data) {
				if (!this.isCityOperatorProduct) {
					this.toPage(
						`/pages-mall/shopInformation/shopInformation?companyId=${data.companyId}`
					)
				} else {
					const url = `/pages-mall/shopInformation/shopInformation?cityOperatorId=${
								this.commodity.cityOperatorId
								}&data=${JSON.stringify(data)}`
					this.toPage(url)
				}
			},
			// 获取已选的sku
			getSkuLabel(e, buy_num) {
				if (this.isPackage) {
					this.showPrice = this.commodity.basePrice || this.commodity.price
				} else {
					this.showPrice = e.price
					this.selectedSku = e
					this.selectedSku['buy_num'] = buy_num
				}
			},
			// 获取收货地址
			getUserAddress(isOnLoad = false) {
				if (!uni.getStorageSync('userData')) {
					this.selectedPostAddress = {}
					return
				}
				if (isOnLoad) {
					// 首次加载时直接获取默认地址，如果没有就取第一个
					this.$httpApi.getPostAddress().then((res) => {
						if (res && res.length !== 0) {
							const findItem = res.find((item) => item.defaultStatus == 0)
							if (findItem) this.selectedPostAddress = findItem
							else this.selectedPostAddress = res[0]
							uni.setStorageSync('roomAddress', this.selectedPostAddress)
							uni.setStorageSync("userPostAddress", this.selectedPostAddress)
							// 获取配送时长
							this.getDeliveryTime()
						}
					})
					return
				}
				let addressLocal = uni.getStorageSync('userPostAddress')
				const userData = uni.getStorageSync('userData')
				// 先获取本地缓存的地址
				if (addressLocal) {
					if (addressLocal.memberId != userData.sysUser.userId) {
						uni.removeStorageSync('userPostAddress')
						addressLocal = null
					}
				}
				if (addressLocal && addressLocal.id) {
					this.selectedPostAddress = addressLocal
					this.getDeliveryTime()
				} else {
					// 如果本地没有缓存的地址 就获取默认地址 如果没有设置默认地址 就取第一个
					this.$httpApi.getPostAddress().then((res) => {
						if (res && res.length !== 0) {
							const findItem = res.find((item) => item.defaultStatus == 0)
							if (findItem) this.selectedPostAddress = findItem
							else this.selectedPostAddress = res[0]
							// 获取配送时长
							this.getDeliveryTime()
						}
					})
				}
			},
			// 跳转到内容页
			clickContent(title, treeCode) {
				switch (title) {
					case '工艺标准':
						this.toPage(
							`/pages-processstabdard/processstabdard?typeName=${title}`
						)
						break
					default:
						this.toPage(
							`/pages/home/article?title=${title}&typeTreeCode=${treeCode}`
						)
				}
			},
			// 查询是否已经收藏
			getCommodityIsHold() {
				this.$httpApi.getCommodityIsHold(this.commodityId).then((res) => {
					// 0 已收藏 1 未收藏
					this.isHold = res === 0 ? true : false
				})
			},
			getShoppingCartCount() {
				this.$httpApi.getShoppingCartCount().then((res) => {
					this.shoppingCartCount = res
				})
			},
			addToFav() {
				if (uni.getStorageSync('userData')) {
					this.$httpApi
						.addItemToFav({
							id: this.commodity.id,
							operation: this.isHold ? 6 : 5
						})
						.then((res) => {
							if (res) {
								if (this.isHold) {
									this.$util.toast('取消收藏成功')
								} else {
									this.$util.toast('收藏成功')
								}
								setTimeout(() => {
									this.getCommodityIsHold()
								}, 1000)
							}
						})
				} else {
					this.$util.goToLoginPage()
				}
			},
			// 切换商品相册
			bannerChange(e) {
				this.current = e.detail.current + 1
				this.$refs.swiper && this.$refs.swiper.pasueVideo()
			},
			// 跳转客服
			goCustomerServer() {
				if (uni.getStorageSync('userData')) {
					let data = this.commodity
					this.$util.goToWeixin()
				} else {
					this.$util.goToLoginPage()
				}
			},
			// 添加到足迹
			addToHistory() {
				this.$httpApi
					.addItemToHistory({
						dataId: this.commodity.id,
						dataType: 1
					})
					.then((res) => {})
			},
			previewImage(index) {
				const obj = this.imgUrlList[index]
				if (obj.type === 'image') {
					uni.previewImage({
						current: this.$util.thumbnailImage(obj.url),
						urls: this.imgUrlList
							.filter((item) => item.type === 'image')
							.map((item) => item.url)
					})
				}
			},
			// 获取商品评论
			async fetchCommodityCommentsData() {
				const param = {
					productId: this.commodityId,
					status: 1,
					status: 1,
					current: this.current,
					'orders[0].asc': false,
					'orders[0].column': 'curation',
					'orders[1].asc': false,
					'orders[1].column': 'create_time'
				}
				const normalComment = await this.$httpApi.getProductComments(param)
				const picsComment = await this.$httpApi.getProductComments({
					...param,
					isPics: true
				})
				if (normalComment.records.length) {
					this.commentTotal = normalComment.total
					this.commodityComments = normalComment.records
				}
				if (picsComment.records.length) {
					this.isShowCommentImage = true
					const result = []
					for (let i = 0; i <= 2; i++) {
						if (picsComment.records[i] && picsComment.records[i].pics) {
							result.push(...picsComment.records[i]?.pics?.split(','))
						}
					}
					this.commentImage = result.join(',')
					this.picsCommentTotal = picsComment.total
				}
			},
			// 获取商品信息
			async fetchCommodityDetailData() {
				// 获取基础信息
				const res = await this.$httpApi.getCommodityOverView({
					id: this.commodityId,
					holdUid: uni.getStorageSync('userData') &&
						uni.getStorageSync('userData').sysUser.userId
				})
				if (!res) {
					this.$util.toast('该商品已下架～')
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
					return
				}
				this.commodity = res
				// 是否是团购商品 0不是 1=是
				this.isGroupDeal = res.groupBuyFlag === 1
				if (this.isGroupDeal) {
					// 查询拼团信息
					this.getAllProductGroup()
					this.groupSku = res.flashOutputList
				}
				// 是否是秒杀商品 0不是 1=是
				this.isFlashSale = res.flashPromotionFlag === 1
				// 是否是分期商品 0不是 1=是
				this.isStagePay = res.payStagesEnable === 1
				// 是否是套餐类商品
				// this.isPackage = this.commodity.customCategory == '1003'
				// app上用于判断是否显示加入购物车按钮
				this.isShowLeftButton = !this.isGroupDeal && !this.isStagePay && !this.isPackage
				setTimeout(() => {
					this.isShowButton = true
				})
				const skuData = getGoodsInfo(this.commodity)
				this.goodsInfo = skuData
				// #ifdef MP-WEIXIN
				// 微信程序上报
				wx.reportEvent('wxdata_browse_goods', {
					spu_id: this.commodity.id, // 商品id
					spu_name: this.commodity.name, // 商品名称
					sku_id: this.commodity.skuStocks[0].id, // 第一个sku id
					sku_name: this.goodsInfo.sku_list[0].sku_name_arr.join(' | '), // 第一个sku 名称
					price_original: this.commodity.originalPrice ?
						Number(this.commodity.originalPrice) * 100 : Number(this.commodity.price) *
						100, // 商品原始价格（单位：分）
					price_current: Number(this.commodity.price) * 100, // 商品价格（单位：分）
					spu_standard_catg_id: '', // we分析分类id
					spu_catg_first_id: this.commodity.platformCategoryId, // 平台分类id
					spu_catg_first_name: this.commodity.platformCategoryName, // 平台分类名称
					spu_catg_second_id: this.commodity.productCategoryId, // 商品分类id
					spu_catg_second_name: this.commodity.productCategoryName // 商品分类名称
				})
				// #endif
				if (this.isPackage) {
					this.showPrice =
						this.commodity.basePrice || this.commodity.skuStocks[0].price
				} else {
					this.showPrice = this.commodity.skuStocks[0].price
				}
				uni.setNavigationBarTitle({
					title: this.commodity.name
				})
				if (uni.getStorageSync('userInfo').access_token) {
					// 获取用户收货地址
					this.getUserAddress(true)
					// 添加至足迹
					this.addToHistory()
				}
				if (this.commodity.freightTemplateId) {
					this.getFreightTemplate()
				}
				if (this.commodity.freightInstallationTemplateId) {
					this.getInstallationTemplate()
				}
				// 商品详情
				this.commodityDetail = res.detailDesc
				if (res.companyId !== '-1') {
					this.getShopInfo(res.companyId)
				} else {
					// 企业id为-1 说明为运营端商品
					this.isCityOperatorProduct = true
					this.storeArr.push({
						companyLogo: this.commodity.companyLogo,
						companyShortName: this.commodity.companyName,
						completeAddress: this.commodity.completeAddress,
						contactTel: this.commodity.companyTel
					})
				}
				// type=1001商品 type=1002服务 type=1003套餐
				this.isService = res.customCategory === '1002'
				this.isOfflineMaterials = res.customCategory === '1010'
				if (this.isOfflineMaterials || res.customCategory === '1003') {
					// 线下材料显示参数列表
					this.productAttributeValueList =
						this.commodity.productAttributeValueList
				}
				const imgType = ['jpg', 'jpeg', 'png']
				if (this.commodity.albumPics) {
					this.imgUrlList = this.commodity.albumPics
						.split(',')
						.map((item) => {
							const obj = {
								type: imgType.includes(item.split('.')[1].toLowerCase()) ?
									'image' : 'video',
								url: this.$image.imageGlobal +
									item.replace(this.$image.imageGlobal, '')
							}
							return obj
						})
						.filter((item) => item.type === 'image')
				} else {
					this.imgUrlList.push({
						type: 'image',
						url: this.$image.imageGlobal + this.commodity.coverImg
					})
				}
				// 获取商品相关推荐(猜你喜欢)
				// TODO 更换接口
				// this.$httpApi.getRecommendProduct({
				// 	clientType: 'APP',
				// 	id: this.commodityId
				// }).then((res) => {
				// 	console.log(res)
				// 	if (!res) return
				// 	this.isShowPage = true
				// 	// 关联商品
				// 	this.relateProducts = res.relateProducts
				// }).catch((e) => console.log(e))
			},
			// 获取店铺详情
			getShopInfo(comId) {
				this.$httpApi
					.getShopNews({
						companyIds: comId
					})
					.then((res) => {
						if (res && res.length) {
							this.storeArr = res
						}
					})
			},
			selectPostAddress() {
				this.toPage(
					`/pages-common/addressList/addressList?isShow=${true}&lastPage=product`
				)
			},
			selectSku(type = 1) {
				if (!this.commodity.stock) return
				// 1=显示两种按钮 2=只显示加入购物车 3=只显示立即购买 4=显示拼单购买
				this.popupType = type
				if (!this.selectedSku.label) {
					// 默认选择第一个sku
					const defaultSku = []
					this.goodsInfo['spec_list'] && this.goodsInfo['spec_list'].forEach((item) => {
						defaultSku.push(item.list[0].name)
					})
					this.defaultSelect = {
						sku: defaultSku,
						num: 1
					}
				} else {
					this.defaultSelect = {
						sku: this.selectedSku.sku_name_arr,
						num: this.selectedSku.buy_num
					}
				}
				// #ifdef APP-PLUS
				if (this.isPackage) {
					// 套餐选择
					const packageInfo = {
						popupType: this.popupType,
						commodityId: this.commodity.id,
						treeList: this.treeList
					}
					uni.setStorageSync('selectPackageInfo', packageInfo)
					uni.$on('selectPackageCallback', (data) => {
						this.getMealList(data)
					})
					uni.navigateTo({
						url: '/pages-mall/packageSelect/packageSelect'
					})
				} else {
					// sku选择
					let skuInfo = {
						goodsInfo: this.goodsInfo,
						popupType: this.popupType,
						defaultSelect: this.defaultSelect,
						product: this.commodity,
					}
					if (type === 4) {
						skuInfo['groupSku'] = this.groupSku
						skuInfo['isGroupBuy'] = this.isGroupBuy
					}
					uni.setStorageSync('selectSkuInfo', skuInfo)
					uni.$on('selectSkuCallback', (res) => {
						const {
							type,
							data
						} = res
						switch (type) {
							case 'getSkuLabel':
								this.getSkuLabel(data.e, data.buy_num)
								break
							case 'addToShoppingCart':
								setTimeout(() => {
									this.addToShoppingCart(data.selectedData)
								}, 20)
								break
							case 'submitOrder':
								setTimeout(() => {
									this.submitOrder(data.selectedData)
								}, 20)
								break
							default:
								break
						}
					})
					uni.navigateTo({
						url: '/pages-mall/skuSelect/skuSelect'
					})
				}
				// #endif
				// #ifndef APP-PLUS
				if (this.isPackage) {
					this.isShowPackage = true
					this.$refs.isShowPackage.open()
					return
				}
				this.isShowSku = true
				// #endif
			},
			// 返回上一页
			goBackPage() {
				if (this.isFromShare) {
					this.toTab('/pages/home/home')
				} else {
					this.goBack()
				}
			},
			// 分享商品至小程序
			share() {
				let userId = -1
				let invitationCode = ''
				const userData = uni.getStorageSync('userData')
				if (userData) {
					userId = userData.sysUser.userId
					invitationCode = userData.sysUser.inviteCode
				}
				const coverImg = this.$util.thumbnailImage(
					this.commodity.coverImg,
					true,
					750
				)
				const path = `pages-mall/productDetail/productDetail?id=${this.commodity.id}&isFromShare=1`
				this.$util.shareToWechat(
					this.commodity.subTitle || this.commodity.name,
					coverImg,
					path,
					'商品详情',
					true,
					2
				)
			},
			// 跳转到购物车
			goToShoppingCart() {
				this.toPage('/pages-mall/shoppingCart/shoppingCart')
			},
			// 立即购买
			goToSubmitOrderPage() {
				// #ifdef APP-PLUS
				this.$refs.isShowContent.close()
				uni.$emit('setIsGroupBuy', false)
				// #endif
				this.isGroupBuy = false
				this.selectSku(3)
			},
			// 查询所有拼团信息
			getAllProductGroup() {
				if (this.commodity.id) {
					this.$httpApi.getProductGroupList({
						productId: this.commodity.id,
						status: 0,
						size: 20
					}).then(res => {
						this.groupDealList = res.records
					})
				}
			},
			// 提交订单
			submitOrder(selectedData) {
				if (uni.getStorageSync('userData')) {
					// 1=显示两种按钮 2=只显示加入购物车 3=只显示立即购买 4=显示拼单购买
					let activeType = 0
					let promotionProductRelationId = ''
					let groupId = ''
					if (this.popupType == 4) {
						// 拼团
						activeType = 1
						const groupDealSkuList = this.commodity.flashOutputList
						if (!groupDealSkuList) {
							this.$util.toast('所选规格未参与团购')
							// #ifdef APP-PLUS
							plus.nativeUI.toast('所选规格未参与团购', {
								verticalAlign: 'center'
							})
							// 去除选择sku的蒙版
							uni.navigateBack()
							// #endif
							return
						}
						// 查找和所选sku相同的团购
						const find = groupDealSkuList.find(item => item.skuId == selectedData._id)
						if (find && find.flashPromotionId) {
							// 活动ID
							promotionProductRelationId = find.promotionProductRelationId
							if (this.selectedGroup) {
								// 加入拼团
								groupId = this.selectedGroup.id
							}
						} else {
							this.$util.toast('所选规格未参与团购')
							// #ifdef APP-PLUS
							plus.nativeUI.toast('所选规格未参与团购', {
								verticalAlign: 'center'
							})
							// 去除选择sku的蒙版
							uni.navigateBack()
							// #endif
							return
						}
					}
					this.$httpApi
						.generateMallOrder({
							activeType: activeType, // 0=无活动 1=拼团 2=秒杀 必填
							promotionProductRelationId: promotionProductRelationId, // 活动ID 必填
							groupId: this.shareGroupId || groupId, // 拼团ID 加入团购时必填 有shareGroupId时优先使用shareGroupId
							shoppingCart: false,
							enableDiffAmount: true,
							memberReceiveAddressId: this.selectedPostAddress.id,
							products: [{
								count: selectedData.buy_num,
								skuId: selectedData._id
							}],
							sourceType: 1 // app订单
						}, false)
						.then((res) => {
							if (res) {
								// #ifdef APP-PLUS
								// 去除选择sku的蒙版
								uni.navigateBack()
								// #endif
								uni.setStorageSync('orderConfirmInfo', res)
								this.toPage('/pages-mall/submitOrder/submitOrder')
							}
						}).catch(e => {
							if (e.codeData.data === 'mall_address_not_exist') {
								// 收货地址不存在
								this.$util.toast('地址不存在，请重新维护')
								// #ifdef APP-PLUS
								// https://ask.dcloud.net.cn/question/90442
								plus.nativeUI.toast('地址不存在，请重新维护', {
									verticalAlign: 'center'
								});
								// #endif
							} else if (e.codeData.data === 'mall_address_code_error') {
								// 收货地址不正确
								this.$util.toast('地址不正确，请重新选择')
								// #ifdef APP-PLUS
								// https://ask.dcloud.net.cn/question/90442
								plus.nativeUI.toast('地址不正确，请重新选择', {
									verticalAlign: 'center'
								});
								// #endif
							}
							// #ifdef APP-PLUS
							// 去除选择sku的蒙版
							uni.navigateBack()
							// #endif
							setTimeout(() => {
								this.selectPostAddress()
							}, 2000)
						})
				} else {
					this.$util.goToLoginPage()
				}
			},
			addToShoppingCart(selectedData) {
				if (uni.getStorageSync('userData')) {
					this.$httpApi
						.addItemToShoppingCart({
							price: selectedData.price,
							productId: selectedData.goods_id,
							productSkuId: selectedData._id,
							quantity: selectedData.buy_num,
							companyAddressId: 1 // TODO 发货地址
						})
						.then((res) => {
							if (res) {
								this.isShowSku = false
								this.getShoppingCartCount()
								this.$util.toast('添加成功!')
							}
						}).finally(res => {
							// #ifdef APP-PLUS
							// 去除选择sku的蒙版
							uni.navigateBack()
							// #endif
						})
				} else {
					this.$util.goToLoginPage()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/style/mixin.scss';

	.share-mask-fixed {
		width: 70rpx;
		height: 70rpx;
		margin-right: 30rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.share-mask {
		width: 70rpx;
		height: 70rpx;
		margin-right: 30rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.share-icon {
		width: 34rpx;
		height: 34rpx;
	}

	.nav-icon {
		justify-content: center;
		width: 70rpx;
		height: 70rpx;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 50%;
		margin: 0rpx 30rpx;
	}

	.nav-icon-color {
		justify-content: center;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin: 0rpx 30rpx;
	}

	.nav-bar-title {
		width: 400rpx;
	}

	.page-container {
		width: 100vw;

		.image-content {
			width: 100vw;
			height: 100vw;

			.swiper {
				width: 100vw;
				height: 100vw;

				.swiper-item {
					.swiper-img {
						width: 100%;
						height: 100%;
					}
				}
			}

			.img-count {
				float: right;
				margin-top: -60rpx;
				margin-right: 20rpx;
				padding-left: 20rpx;
				width: max-content;
				height: 40rpx;
				border-radius: 30rpx;
				background: #000000;
				opacity: 0.5;
				padding: 20rpx;

				.text {
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 900;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #ffffff;
				}
			}
		}

		.main-container {
			width: 100vw;
			height: max-content;
			padding-bottom: 140rpx;

			.header-container {
				width: 750rpx;
				height: max-content;
				padding: 30rpx;
				margin-top: 16rpx;
				background-color: #ffffff;
				border-radius: 20rpx 20rpx 0 0;

				.title {
					width: 100%;
					height: max-content;
					max-height: 146rpx;
					font-family: PingFang SC;
					font-weight: bold;
					font-size: 36rpx;
					line-height: 44rpx;
					color: #141414;
					@include bov(2);

					.package-label {
						padding: 0 10rpx;
						background: #fe6e32;
						border-radius: 6rpx;
						text-align: center;
						font-size: 26rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #ffffff;
						margin-right: 8rpx;
					}
				}

				.sale {
					width: 100%;
					height: 34rpx;
					font-family: PingFang SC;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #141414;
					margin-top: 32rpx;
				}

				.price-container {
					margin-top: 16rpx;

					.price {
						width: 50%;
						height: 40rpx;
						font-family: Microsoft YaHei;
						font-style: normal;
						font-weight: bold;
						font-size: 40rpx;
						line-height: 34rpx;
						color: #ff5d35;

						.price-symbol {
							height: 40rpx;
							font-family: Microsoft YaHei;
							font-style: normal;
							font-weight: bold;
							font-size: 24rpx;
							color: #ff5d35;
							margin-right: 2rpx;
						}

						.text {
							height: 40rpx;
							font-family: Microsoft YaHei;
							font-style: normal;
							font-weight: bold;
							font-size: 24rpx;
							color: #ff5d35;
						}
					}

					.stage-pay {
						width: max-content;
						height: 34rpx;
						padding: 0 10rpx;
						background: #FFE6E5;
						border-radius: 6rpx;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #ED3832;
						line-height: 34rpx;
						margin-left: 10rpx;
					}

					.price-right {
						width: 50%;
						height: 40rpx;
						justify-content: flex-end;

						.text {
							height: 40rpx;
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #fe6e32;
							line-height: 40rpx;
						}

						.group-text {
							width: 116rpx;
							height: 42rpx;
							background: linear-gradient(90deg, #FFB54D, #FF3A33);
							border-radius: 6rpx;
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 42rpx;
							text-align: center;
						}
					}
				}

				.group-deal {
					width: 100%;
					height: max-content;
					margin-top: 30rpx;
					background: #FFEDE5;
					border-radius: 15rpx;
					padding: 20rpx;

					.deal-title {
						width: 100%;
						justify-content: space-between;

						.text {
							font-size: 18rpx;
							font-family: Noto Sans S Chinese;
							color: #000000;
							line-height: 34rpx;
						}

						.left {
							font-weight: 500;
						}

						.right {
							font-weight: 400;
						}
					}
				}

				.product-info {
					width: 100%;
					height: max-content;
					margin-top: 34rpx;
					padding-top: 30rpx;
					border-top: 2rpx #f7f7f7 solid;

					.topper {
						width: 100%;
						justify-content: space-between;

						.left,
						.right {
							width: 50%;
							height: 40rpx;
						}

						.left {
							font-size: 28rpx;
							font-family: FZRuiZhengHei_GBK;
							font-weight: 800;
							color: #333333;
							line-height: 40rpx;
						}

						.right {
							font-size: 16rpx;
							font-family: FZRuiZhengHei_GBK;
							font-weight: bold;
							color: #fe6e32;
							line-height: 34rpx;
							text-align: right;
						}
					}

					.icons {
						width: 100%;
						margin-top: 20rpx;

						.icon-item {
							width: 25%;
							height: 40rpx;
							justify-content: center;

							.icon {
								width: 30rpx;
								height: 30rpx;
								margin-right: 11rpx;
							}

							.text {
								font-size: 23rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: #141414;
								line-height: 36rpx;
							}
						}
					}
				}
			}

			.menu-item-container {
				width: 750rpx;

				.menu-item {
					width: 750rpx;
					margin-bottom: 14rpx;
					background-color: #ffffff;
				}
			}

			.product-shop {
				width: 750rpx;
				background-color: #ffffff;
				border-top: 2rpx #f7f7f7 solid;
				padding: 0rpx 30rpx 20rpx;
				box-sizing: border-box;
				margin-top: 20rpx;
			}

			.product-detail {
				width: 750rpx;
				margin-top: 16rpx;
				background-color: #ffffff;
				border: 2rpx #f7f7f7 solid;

				.detail-title {
					padding: 20rpx 30rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #141414;
					line-height: 46rpx;
				}
			}

			.comment-container {
				width: 750rpx;
				height: max-content;
				margin: 16rpx 0;
				background-color: #ffffff;
				padding: 30rpx;

				.images {
					margin-top: 30rpx;
					padding-top: 30rpx;
					border-top: 2rpx #f0f0f0 solid;
				}

				.comment-header {
					width: 100%;
					height: max-content;
					justify-content: space-between;

					.left {
						width: 50%;
						height: 34rpx;
						font-size: 28rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #010101;
						line-height: 34rpx;

						.comment-count {
							color: #868686;
							font-size: 24rpx;
							font-family: Noto Sans S Chinese;
							line-height: 34rpx;
							margin-left: 10rpx;
						}
					}

					.right {
						width: max-content;
						padding: 0 10rpx;
						height: 40rpx;
						background: #ffffff;
						justify-content: center;
						border-radius: 20rpx;
						font-size: 18rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #000000;
						line-height: 40rpx;
					}
				}

				.comment-item {
					width: 690rpx;
					margin-top: 30rpx;

					.info {
						justify-content: space-between;
						align-items: flex-start;

						.left {
							align-items: center;
							justify-content: space-between;

							.comment-user {
								margin-left: 20rpx;

								.name {
									font-size: 24rpx;
									font-family: Noto Sans S Chinese;
									font-weight: 400;
									color: #000000;
									line-height: 34rpx;
								}

								.rating {
									margin-left: -6rpx;
									margin-top: -4rpx;
								}

								.divider-line {
									width: 2rpx;
									height: 16rpx;
									margin: 0 10rpx;
									background-color: #E6E6E6;
								}

								.comment-sku {
									font-size: 20rpx;
									font-family: Noto Sans S Chinese;
									font-weight: 400;
									color: #B3B3B3;
									line-height: 34rpx;
								}
							}
						}

						.right {
							font-size: 20rpx;
							font-family: Noto Sans S Chinese;
							font-weight: 400;
							color: #999999;
							line-height: 34rpx;
						}
					}

					.content {
						width: 100%;
						font-size: 26rpx;
						margin-top: 20rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #000000;
						line-height: 40rpx;
						@include bov(3);
					}
				}
			}

			.recommend-container {
				width: 690rpx;
				height: max-content;
				background-color: #ffffff;
				margin: 10rpx 30rpx 20rpx 30rpx;
				padding: 20rpx 0;

				.title {
					width: max-content;
					height: 42rpx;
					text-align: left;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: bold;
					font-size: 30rpx;
					line-height: 42rpx;
					color: #303133;
				}

				.cards {
					width: 100%;
					height: max-content;
					margin-top: 20rpx;
					flex-direction: row;
					overflow-x: scroll;
				}
			}
		}

		.bottom-buttons {
			width: 100vw;
			height: 140rpx;
			position: fixed;
			bottom: 0;
			background-color: #ffffff;
			border-top: 2rpx #f5f5f5 solid;
			z-index: 99;

			.buttons-mini {
				width: calc(45vw - 20rpx);
				height: 100%;
				justify-content: space-around;

				.button-mini {
					width: 80rpx;
					height: 100%;
					flex-direction: column;
					justify-content: center;
					font-family: PingFang SC;
					font-style: normal;
					font-size: 20rpx;
					line-height: 34rpx;
					color: #000;

					.button-mini-text {
						font-family: PingFang SC;
						font-style: normal;
						font-size: 20rpx;
						line-height: 34rpx;
						color: #000;
					}

					.count {
						width: 30rpx;
						height: 30rpx;
						margin-left: 20rpx;
						border-radius: 50%;
						position: absolute;
						background: #ff9a52;
						font-size: 20rpx;
						line-height: 28rpx;
						color: #ffffff;
						text-align: center;
					}

					.icon {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}

			.buttons {
				width: calc(55vw - 20rpx);
				height: 100%;
				justify-content: flex-end;

				.stage-container {
					width: 370rpx;
					height: 80rpx;
					background: #ED3832;
					border-radius: 10rpx;
					padding: 4rpx 0;
					/* #ifndef APP-PLUS */
					flex-direction: column;
					justify-content: space-between;
					/* #endif */

					.stage-button {
						width: 100%;
						text-align: center;
						font-size: 28rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 500;
						color: #FFFFFF;
						/* #ifdef APP-PLUS */
						margin-top: 4rpx;
						/* #endif */
					}

					.stage-text {
						width: 100%;
						text-align: center;
						font-size: 20rpx;
						font-family: Noto Sans S Chinese;
						color: #FFFFFF;
						/* #ifdef APP-PLUS */
						margin-top: 4rpx;
						/* #endif */
					}
				}

				.left {
					width: 180rpx;
					height: 80rpx;
					line-height: 80rpx;
					border: 2rpx solid #141414;
					border-radius: 12rpx;
					text-align: center;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #141414;
				}

				.right {
					width: 180rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 12rpx;
					background-color: #424242;
					text-align: center;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #ffffff;
					margin-left: 10rpx;
				}

				.button-price {
					margin-top: 4rpx;
					text-align: center;

					.text {
						line-height: 30rpx;
						font-family: Noto Sans S Chinese;
						font-weight: 400;
						color: #FFFFFF;
					}
				}

				.text {
					font-size: 24rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40rpx;
					text-align: center;
				}

				.buy-single {
					width: 180rpx;
					height: 80rpx;
					background: #000000;
					border-radius: 12rpx;
				}

				.buy-group {
					width: 180rpx;
					height: 80rpx;
					border-radius: 12rpx;
					margin-left: 10rpx;
					/* #ifdef APP-PLUS */
					background-color: $themeColor;
					/* #endif */
					/* #ifndef APP-PLUS */
					background: linear-gradient(90deg, #FFB54D, #FF3A33);
					/* #endif */
				}
			}
		}
	}

	.group-container {
		width: 100vw;
		height: 100%;
		background-color: #F7F7F7;

		.popup-group-item {
			width: 100vw;
			padding: 0 30rpx;
			height: 130rpx;
			margin-bottom: 2rpx;
			background-color: #FFFFFF;
		}
	}

	.group-item {
		width: 100%;
		height: 50rpx;

		.group-member {
			flex: 1;
			gap: 10rpx;

			.avatar-item {
				flex-direction: column;
				justify-content: center;

				.user-name {
					width: 80rpx;
					text-align: center;
					font-size: 20rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 34rpx;
					@include toe();
					margin-top: 6rpx;
				}
			}

			.circle {
				width: 50rpx;
				height: 50rpx;
				text-align: center;
				line-height: 50rpx;
				font-weight: 400;
				font-size: 32rpx;
				background: rgba(255, 255, 255, 0);
				border: 2rpx solid #CCCCCC;
				border-radius: 50%;
				color: #CCCCCC;
			}
		}

		.button {
			width: 120rpx;
			height: 50rpx;
			background: linear-gradient(90deg, #FFB54D, #FF3A33);
			border-radius: 25rpx;
			font-size: 24rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 50rpx;
			text-align: center;
		}
	}

	.slot-content {
		width: 560rpx;
		justify-content: space-between;

		.left {
			font-size: 24rpx;
			font-family: PingFang SC;
			color: #141414;
			line-height: 48rpx;
			@include toe();
		}

		.left-wrap {
			font-size: 24rpx;
			font-family: PingFang SC;
			color: #141414;
			@include bov(2);
		}

		.right {
			margin-right: 10rpx;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: bold;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #909199;
		}
	}

	.left-wrap_only {
		display: flex;

		text {
			color: #ff5d35;
			font-size: 24rpx;
			margin-left: 10rpx;
		}

		.price {
			font-size: 28rpx;
			font-weight: bold;
			margin: 0 10rpx 0 0;
		}
	}

	.popup {
		width: 100vw;
		height: 55vh;
		padding: 30rpx;

		.popup-title {
			width: 100%;
			text-align: center;
			font-family: PingFang SC;
			font-style: normal;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 40rpx;
			color: #333333;
		}

		.popup-contnet {
			width: 100%;
			margin-top: 30rpx;

			.contetn-item {
				width: 100%;
				margin-bottom: 30rpx;

				.upper {
					width: 100%;
					height: max-content;

					.left {
						min-width: 200rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-weight: 500;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #333333;
					}

					.right {
						border-left: 2rpx #a8a8a8 solid;
						padding-left: 30rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 26rpx;
						line-height: 40rpx;
						color: #333333;
					}
				}

				.address-content {
					width: 100%;
					height: max-content;
					margin-top: 10rpx;

					.address-name {
						width: 200rpx;
						height: max-content;

						.name {
							font-family: PingFang SC;
							font-style: normal;
							font-size: 24rpx;
							line-height: 40rpx;
							color: #333333;
						}
					}

					.rule {
						max-width: 500rpx;
						border-left: 2rpx #a8a8a8 solid;
						padding-left: 30rpx;
						font-family: PingFang SC;
						font-style: normal;
						font-size: 22rpx;
						line-height: 40rpx;
						color: #333333;
					}
				}
			}
		}
	}

	.popup-container {
		width: 100vw;
		padding: 30rpx;
		background-color: #ffffff;
		/* #ifdef APP-PLUS */
		padding-bottom: 140rpx;
		/* #endif */

		.content-item {
			margin-bottom: 20rpx;

			.popup-title {
				width: 100%;
				text-align: left;
				font-family: PingFang SC;
				font-style: normal;
				font-weight: 500;
				font-size: 32rpx;
				line-height: 40rpx;
				color: #000000;

				.title-icon {
					width: 20rpx;
					height: 20rpx;
					background: #fe6e32;
					border: 6rpx solid #fcd9ca;
					border-radius: 50%;
					margin-right: 8rpx;
				}
			}

			.popup-text {
				font-family: PingFang SC;
				font-style: normal;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #000000;
				margin-top: 20rpx;
			}
		}
	}

	.flex-center2 {
		display: flex;
		align-items: center;
	}
</style>
