<template>
    <view class="custom-service">
        <view class="item-material-list" v-if="list.length > 0">
            <view class="item-material" v-for="(item, index) in list" :key="index">
                <image-lazy-load v-if="typeName !== '自定义'" :image="item.coverImg" :key="index"
                    height="120"></image-lazy-load>
                <view class="item-right-material">
                    <view class="material-name">
                        {{ item.coverImg ? item.name : item.title }}
                    </view>
                    <view class="material-other">
                        <view class="left">
                            <text class="specifications"></text>
                            <text class="unit">￥{{ item.price }}/{{ item.unit }}</text>
                        </view>
                        <view class="right">
                            <view v-if="item.operationShow || item.selectNum" class="public-item-calculate">
                                <add-and-subtract :info="item" v-model="item.selectNum"
                                    @calculate="customDataCalculate"></add-and-subtract>
                            </view>
                            <view v-else class="add-listing" @click="$emit('addCustomData', item)">
                                加入清单
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="no-material-list">
            <view class="item-no">
                <image src="/static/images/sousuo.png" mode=""></image>
                <view class="desc">
                    <view class="no-text">没有找到你要的内容</view>
                    <view class="try-text">你可以试试增加自定义工作项</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'custom-data',
    props: {
        list: {
            type: Array,
            default: () => []
        },
        typeName: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            option: {}
        }
    },
    computed: {

    },
    mounted() {

    },
    onShow() {

    },
    onLoad(option) {
        this.option = option
    },
    methods: {
        /**
		 * @description 加减、输入操作
		 * @pamar type 1 加 2 减
		 * @pamar even 当前数据
		 * @pamar operationNumber 当前操作的数量
		 * */
         customDataCalculate(type, even, operationNumber) {
			this.$emit('customDataCalculate', type, even, operationNumber)
		},
        addListing() {

        },
        setInput() {

        }
    }
}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */

.item-material-list {

    .item-gropus_name {
        color: #3D3D3D;
        font-size: 28rpx;
        padding-bottom: 20rpx;
    }


    .item-specifications {
        margin-top: 20rpx;

        .item-name {
            color: #303133;
            font-size: $smallFontSize;
        }

        .specifications {
            color: $viceFontColor;
            font-size: $smallFontSize;
            margin-bottom: 4rpx;
            height: 30rpx;
        }
    }

    .item-material {
        padding-bottom: 30rpx;
        border-bottom: 2rpx solid #F3F3F3;
        margin-bottom: 28rpx;
        display: flex;

        .item-select-other {
            display: flex;
        }

        .item-right-material {
            display: flex;
            flex-direction: column;
            flex: 1;
            margin-left: 20rpx;

            .material-name {
                color: $seconFontColor;
                font-size: $middleFontSize;
                margin-bottom: 10rpx;
            }


            .material-other {
                display: flex;
                justify-content: space-between;

                .left {
                    display: flex;
                    flex-direction: column;
                    max-width: 500rpx;

                    .specifications {
                        color: $viceFontColor;
                        font-size: $smallFontSize;
                        margin-bottom: 4rpx;
                        height: 30rpx;
                    }

                    .unit {
                        color: $seconFontColor;
                        font-size: $smiddleFontSize;
                    }
                }

                .right {
                    display: flex;
                    align-items: flex-end;
                }

                .add-listing {
                    padding: 8rpx 16rpx;
                    background: $themeColor;
                    border-radius: $miniBorderRadius;
                    color: #FFF;
                    font-size: $smallFontSize;
                    font-weight: 400;
                }

                .add-display {
                    padding: 8rpx 16rpx;
                    background: #e3e1e1;
                    border-radius: $miniBorderRadius;
                    color: #FFF;
                    font-size: $smallFontSize;
                    font-weight: 400;
                }



            }
        }
    }
}
</style>
