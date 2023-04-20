<template>
    <view v-if="JSON.stringify(info) !== '{}'" class="order-information-details">
        <view class="title">
            订单信息
        </view>
        <view class="item-introduction item-num">
            <view class="item-other">
                <text class="lable">订单编号：</text>
                <text class="value">{{ info.orderSn }}</text>
            </view>
            <image src="/static/icon/copy.png" class="copy-icon" @click="copy(info.orderSn)" mode="">
            </image>
        </view>
        <view class="item-introduction">
            <text class="lable">创建时间：</text>
            <text class="value">{{ info.createTime }}</text>
        </view>

        <view class="item-introduction" v-if="info.status > 0 && info.status < 7">
            <text class="lable">付款时间：</text>
            <text class="value">{{ info.paymentTime }}</text>
        </view>
        <!-- 支付方式：1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额。 -->
        <view class="item-introduction" v-if="info.status > 0 && info.status < 7 && setPayType(info.payType)">
            <text class="lable">付款方式：</text>
            <text class="value">{{ setPayType(info.payType) }}</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    },
    onLoad() {

    },
    methods: {
        setPayType(item) {
            // 支付方式：1-微信扫码，2-微信原生App，3-微信小程序，4-支付宝扫码，5-支付宝原生App，6-余额。
            switch (item) {
                case 1:
                    return '微信扫码'
                case 4:
                    return '支付宝扫码'
                default:
                    return ''
            }
        },
        copy(data) {
            uni.setClipboardData({
                data,
                success: () => { // 复制成功的回调函数
                    this.$util.toast("复制成功");
                }
            });
        },
    },
}
</script>
<style lang="scss" scoped >
/* @import url(); 引入css类 */
.copy-icon {
	width: 44rpx;
	height: 44rpx;
}
.order-information-details {
	margin-top: 10rpx;
	border-top: 2rpx dashed #EEE;
	border-radius: 16rpx;
	background-color: #fff;
	.title {
		margin-bottom: 20rpx;
		padding: 28rpx 20rpx;
		border-bottom: 2rpx solid #EEE;
		font-weight: bold;
		font-size: $middleFontSize;
		color: $seconFontColor;
	}
	.item-introduction {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 28rpx;
		padding-left: 40rpx;
		&:last-child {
			margin-bottom: 0rpx;
			padding-bottom: 30rpx;
		}
		.lable,
		.value {
			font-size: $middleFontSize;
			color: $viceFontColor;
		}
		.copy-icon {
			margin-right: 40rpx;
		}

	}
	.item-num {
		display: flex;
		justify-content: space-between;
	}
}</style>