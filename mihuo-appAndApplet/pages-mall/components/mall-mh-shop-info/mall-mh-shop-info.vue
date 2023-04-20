<template>
    <view class="shop" v-if="shopList && shopList.length">
        <view class="shop-item" v-for="(item,index) in shopList" :key="index" @click="()=>$emit('callBack', item)">
            <image class="shop_logo" :src="$util.thumbnailImage(item.companyLogo)" mode="aspectFit"></image>
            <view class="shop_news">
                <view class="shop_news-name">
                    <view class="shop_name">{{ item.companyShortName }}</view>
                    <view class="shop_go">
                        <u-icon size="24" color="rgb(20, 20, 20)" name="arrow-right"></u-icon>
                    </view>
                </view>
                <view class="shop_detail">{{ item.completeAddress || '商家很神秘，没有留下地址'}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    props:{
        shopList:{
            type:Array,
            default:()=>[]
        }
    },
    methods: {},
};
</script>

<style scoped lang="scss">
.shop{
    width: 100%;
    box-sizing: border-box;
    .shop-item{
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 2rpx solid #E6E6E6;
        &:last-child{
            border-bottom:0;
        }
        .shop_logo{
            max-height: 75rpx;
            max-width: 75rpx;
            border-radius: 12rpx;
        }
        .shop_news{
            flex: 1;
            padding-left:20rpx;
            .shop_news-name{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .shop_name{
                    font-size: 32rpx;
                    font-weight: bold;
                }
                .shop_go{
                    color: #A8A8A8;
                    font-size: 26rpx;
                    flex-shrink: 0;
                }
            }
            .shop_detail{
                font-size: 26rpx;
                color: #808080;
                padding-top: 10rpx;
            }
        }
    }
}
</style>
