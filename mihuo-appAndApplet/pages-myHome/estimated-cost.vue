<script>
import operation from '@/plugins/mathoperation.js'

export default {
  data() {
    return {
      estimatedDataList: [],
      current: 0,
      option: {},
      nodeData: {}
    }
  },
  onLoad(option) {
    this.option = option
	if(option.noticeId){
		this.$util.readNotice(option.noticeId)
	}
    this.loadEstimatedList(option.projectId)
  },
  onShow() {
    this.getNode()
  },
  computed: {
    currentTotal() {
      return this.estimatedDataList.reduce(
        (prev, cur) => operation.floatAdd(prev, cur.totalPrice),
        0
      )
    },
    tabList() {
      return this.estimatedDataList.map((item, index) => ({
        name: item.name,
        type: item.type,
        money: item.totalPrice
      }))
    },
    changeIsScroll() {
      return this.tabList.length > 4 ? true : false
    }
  },
  methods: {
    // 查询节点信息
    getNode() {
      this.$httpApi.getCheckNode(this.option.reviewId).then(res => {
        this.nodeData = res
      })
    },
    changeTab(index) {
      this.current = index
    },
    loadEstimatedList(projectId) {
      uni.showLoading({
        mask: true
      })
      this.$http
        .get('order/bizordergroupprice/typeByCondition', {
          projectId,
          source: 3
        })

        .then(data => {
          this.estimatedDataList = data || []
          this.current = 0
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          uni.hideLoading()
        })
    },
    handleSkuParse(value) {
      const skus = JSON.parse(value)
      return skus.map(item => `${item.key}:${item.value}`).join('; ')
    },
    handleConfirm(status) {
      uni.navigateTo({
        url: `/pages-myHome/commonHandleTodo?reviewId=${
          this.option.reviewId
        }&status=${status}&nodeId=${this.option.nodeId}`
      })
    }
  }
}
</script>

<template>
  <view>
    <view v-if="!estimatedDataList.length" class="estimated-cost">
      <z-nav-bar>
        <view class="nav-bar" slot="default"> 预算费用 </view>
      </z-nav-bar>
      <mh-empty></mh-empty>
    </view>
    <view v-else class="estimated-cost">
      <z-nav-bar>
        <view class="nav-bar" slot="default"> 预算费用 </view>
      </z-nav-bar>
      <view class="title-cost">
        <text class="title">当前总金额:</text>
        <text class="value">￥{{ currentTotal }}</text>
      </view>
      <u-tabs
        :list="tabList"
        height="100"
        bar-width="48"
        bar-height="6"
        inactive-color="#898989"
        active-color="#FE6E32"
        :isScroll="changeIsScroll"
        :current="current"
        @change="changeTab"
      >
        <template v-slot="{ default: item }">
          <view
            class="tabs-item-box"
            :class="{ 'tabs-item-box-active': current === item.index }"
          >
            <text class="label">{{ item.name }}</text>
            <text class="money">(￥{{ item.money }})</text>
          </view>
        </template>
      </u-tabs>
      <scroll-view scroll-y="true" class="scroll-view">
        <view
          v-for="(estimate, index) of estimatedDataList"
          :key="estimate.type"
          class="scroll-view-item"
        >
          <view class="tabs-content" v-if="current === index">
            <view class="tabs-content-item">
              <template v-if="estimate.groupPrices.length">
                <view
                  v-for="group in estimate.groupPrices"
                  :key="group.id"
                  class="estimated-type"
                >
                  <view class="estimated-type-head">
                    <text class="type-name">{{ group.businessName }}</text>
                    <text class="type-cost">￥{{ group.totalAmount }}</text>
                  </view>
                  <view class="estimated-type-list">
                    <view
                      v-for="item in group.products"
                      :key="item.id"
                    >
                      <view class="estimated-type-list-item">
                        <image
                          :src="$util.thumbnailImage(item.productImg, true)"
                          mode="aspectFill"
                          class="good-img"
                        ></image>
                        <view class="good-info">
                          <view>
                            <view class="title">{{ item.productName }}</view>
                            <view class="pricing">{{
                              handleSkuParse(item.productSku)
                            }}</view>
                          </view>
                          <view class="good-money-num">
                            <text>￥{{ item.price }}</text>
                            <text>x{{ item.budgetNum }}</text>
                          </view>
                        </view>
                      </view>
                      <view v-if="item.remark" class="good-remark">{{ item.remark}}</view>
                    </view>
                  </view>
                </view>
              </template>
              <mh-empty v-else></mh-empty>
            </view>
          </view>
        </view>
        <u-gap height="104" bg-color="rgba(0,0,0,0)"></u-gap>
      </scroll-view>
    </view>
    <myHome-mh-form-bottom-button v-if="nodeData.status == 0" @onCancel="()=>handleConfirm(1)" @onSure="()=>handleConfirm(2)"/>
  </view>
</template>

<style>
page {
  height: 100%;
  background-color: #f7f7f7;
}
</style>
<style scoped lang="scss">
.estimated-cost {
  background-color: #f7f7f7;

  .title-cost {
    height: 86rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    background-color: #fff;

    .title,
    .value {
      color: #000000;
      font-size: 28rpx;
      font-weight: 600;
    }

    .value {
      margin-left: 20rpx;
    }
  }

  /deep/ .u-tabs {
    .u-tab-item {
      line-height: initial !important;
    }

    .tabs-item-box {
      flex: 1;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .label,
      .money {
        color: #898989;
        font-size: 24rpx;
        font-weight: 500;
      }

      .money {
        margin: 8rpx 0;
      }

      .tab-active {
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          width: 48rpx;
          height: 4rpx;
          border-radius: 2rpx;
          margin: auto;

          background: #fe6e32;
        }
      }

      .tab-inactive {
        width: 100%;
        height: 4rpx;
        margin-top: 16rpx;

        position: relative;
      }
    }

    .tabs-item-box-active {
      .label,
      .money {
        color: #fe6e32;
      }
    }
  }

  .scroll-view {
    max-height: calc(100vh - 44px - 86rpx - 100rpx);
    background-color: #f7f7f7;

    .tabs-content {
      margin: 35rpx 30rpx;

      .estimated-type {
        .estimated-type-head {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .type-name {
            color: #000000;
            font-size: 28rpx;
            font-weight: 400;
          }

          .type-cost {
            color: #fe6e32;
            font-size: 28rpx;
          }
        }

        .estimated-type-list {
          margin: 36rpx 0;
          padding: 0 24rpx;
          border-radius: 20rpx;
          background-color: #fff;
          .good-remark{
            color: #898989;
            font-size: 24rpx;
            padding-bottom: 20rpx;
          }
          .estimated-type-list-item {
            padding: 24rpx 0;
            display: flex;
            gap: 24rpx;

            & + .estimated-type-list-item {
              /* #ifndef APP-NVUE */
              border-top: 1px solid #eee;
              /* #endif */
              /* #ifdef APP-NVUE */
              border-top: 0.5px solid #eee;
              /* #endif */
            }

            .good-img {
              width: 140rpx;
              height: 140rpx;
              border-radius: 14rpx;
            }

            .good-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 4rpx 0;

              .title {
                color: #000;
                font-size: 24rpx;
                font-weight: 500;
              }

              .pricing {
                color: #898989;
                font-size: 24rpx;
                margin: 10rpx 0 20rpx;
                zoom: 0.9;
              }

              .good-money-num {
                display: flex;
                justify-content: space-between;
                align-items: center;

                text {
                  color: #000;
                  font-size: 24rpx;
                  zoom: 0.88;

                  &:first-child {
                    color: #fe6e32;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .bottom-button {
    width: 100%;
    padding: 10rpx 30rpx;
    background-color: #fff;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;

    position: fixed;
    bottom: 0;

    .btn-item {
      flex: 1;
      height: 84rpx;
      border: 1px solid #000000;
      border-radius: 42rpx;

      display: flex;
      align-items: center;
      justify-content: center;

      .btn-text {
        font-size: 28rpx;
        font-weight: 400;
      }
    }

    .btn-not-confirm {
      background-color: #fff;

      .btn-text {
        color: #000;
      }
    }

    .btn-confirm {
      background-color: #000;

      .btn-text {
        color: #fff;
      }
    }
  }
}
</style>
