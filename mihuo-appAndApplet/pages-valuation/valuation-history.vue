<script>
import operation from '@/plugins/mathoperation.js'
export default {
  data() {
    return {
      historyList: [],
      myRef: null,
      total: 0,
      current: 1,
      status: 'loadmore',
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '没有更多'
      }
    }
  },

  onReachBottom() {
    if (!this.hasLoadStatus && this.status === 'loadmore') {
      this.current += 1
      this.loadData()
    }
  },

  mounted() {
    this.loadData()
  },

  computed: {
    hasLoadStatus() {
      return this.historyList.length === this.total
    }
  },

  methods: {
    loadData() {
      if (this.current > 1) {
        this.status = 'loading'
      } else {
        uni.showLoading({ mask: true })
      }
      this.$http
        .get('basic/standard/survey/public/list', {
          size: '15',
          current: this.current
        })
        .then(data => {
          this.total = Number(data.total)
          this.current = Number(data.current)
          this.historyList = [...this.historyList, ...data.records]
          this.historyList.map((item)=>{
            item.title = []
            let answer = Object.values(item?.answer)
            if(answer && answer.length){
              answer.some(v=>{
                item.title = item.title.concat(Object.values(v) || [])
              })
            }
          })
          if (this.hasLoadStatus) {
            this.status = 'nomore'
          }
        })
        .catch(e => {
          console.error(e.message)
        })
        .finally(() => {
          if (this.current > 1) {
            if (this.hasLoadStatus) {
              this.status = 'nomore'
            } else {
              this.status = 'loadmore'
            }
          } else {
            uni.hideLoading()
          }
        })
    },

    getFloatpMyriad(item) {
      if (!item.examInfo?.minAmount) return 0
      return item.examInfo.minAmount
    },

    toEstimatedAmounts(id) {
      uni.navigateTo({
        url: `/pages-valuation/estimated-amounts?dataId=${id}`
      })
    }
  }
}
</script>

<template>
  <view class="valuation-history">
    <z-nav-bar>
      <view class="nav-bar" slot="default"> 估价历史 </view>
    </z-nav-bar>
    <mh-empty v-if="!historyList.length" key="results-empty"></mh-empty>
    <view v-else ref="myRef" key="results-status" class="history-data-list">
      <view
        v-for="(item, index) of historyList"
        :key="index"
        class="history-item"
        @click="toEstimatedAmounts(item.id)"
      >
        <view class="left-box">
          <view class="title" v-if="item.title && item.title.length">{{ item.title.join(',')}}</view>
          <view class="datatime">{{ item.createTime }}</view>
        </view>
        <view class="right-box">
          <view class="subtitle">
            <text class="unit">￥</text>
            <text class="value"> {{ getFloatpMyriad(item) }} </text>
          </view>
          <u-icon name="arrow-right" color="#000" size="15" />
        </view>
      </view>
      <u-gap height="30"></u-gap>
    </view>
    <u-loadmore
      v-if="historyList.length"
      :status="status"
      icon-type="iconType"
      :load-text="loadText"
    />
    <u-gap height="20"></u-gap>
  </view>
</template>

<style scopeda lang="scss">
.valuation-history {

  .history-data-list {
    margin: 0 30rpx;
    .history-item {
      // height: 100rpx;
      padding: 20rpx;
      margin-top: 30rpx;
      border-radius: 20rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;

      background: #f7f7f7;
      .left-box{
        .title{
          margin-bottom: 10rpx;
          font-size: 24rpx;
          color: #000000;
        }
      }
      .right-box {
        display: flex;
        align-items: center;
      }

      .datatime {
        color: #000000;

        font-size: 24rpx;
        font-weight: 400;
      }

      .subtitle {
        margin-right: 14rpx;

        .value,
        .unit {
          font-weight: 500;
          color: #fe6e32;
        }

        .value {
          font-size: 28rpx;
          font-weight: 600;
        }

        .unit {
          font-size: 20rpx;
          margin-left: 8rpx;
        }
      }
    }
  }
}
</style>
