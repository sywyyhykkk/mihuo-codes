<template>
  <view>
    <z-nav-bar
      fontColor="black"
      :title="options.acceptanceName || options.title"
    ></z-nav-bar>
    <view class="report">
      <!-- <view class="report-time">
				<text class="time">提交时间</text>
				<text>{{ reportContent.time }}</text>
			</view> -->
      <view
        v-if="reportContent.reports && reportContent.reports.length"
        class="report-content"
      >
        <view
          v-for="(item, index) in reportContent.reports"
          :key="index"
          class="content-item"
        >
          <view class="report-title" v-if="!options.acceptanceName">
            {{ item.acceptanceName }}
          </view>
          <view
            v-for="(child, cIndex) in item.items"
            :key="cIndex"
            style="margin-bottom: 20rpx"
          >
            <view class="items-title">
              {{ cIndex + 1 }}、{{ child.acceptanceName }}
			  <uni-icons type="checkbox" size="20" :color="child.isPass == '1' ? 'green' : '#fe6e32'"></uni-icons>
            </view>
            <view class="standard">
              <view class="items-standard">{{ child.standard }}</view>
              <view class="items-images" v-if="child.realImg">
                <u-lazy-load
                  v-for="(img, index2) in child.realImg.split(',')"
                  :key="index2"
                  height="100"
                  class="item-img"
                  imgMode="aspectFill"
                  border-radius="10"
                  :image="$util.thumbnailImage(img, true)"
                >
                </u-lazy-load>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reportContent: {},
      title: '',
      options: {}
    }
  },
  onLoad(options) {
    this.options = options
    this.getDetails()
  },
  methods: {
    getDetails() {
      let params = {
        id: this.options.id
      }
      if (uni.getStorageSync('userData')) {
        params.userId = uni.getStorageSync('userData').sysUser.userId
      }
      this.$httpApi.getConstruCaseDetail(params).then(res => {
        if (res) {
          // 报告
          res.homeInspection = JSON.parse(res.homeInspection)
          if (res.homeInspection && res.homeInspection.length) {
            res.homeInspection.map(item => {
              if (this.options.title == item.label) {
                this.reportContent = item
                return true
              }
            })
          }
          if (this.options.acceptanceName) {
            if (
              this.reportContent.reports &&
              this.reportContent.reports.length
            ) {
              this.reportContent.reports = this.reportContent.reports.filter(
                item => item.acceptanceName === this.options.acceptanceName
              )
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report {
  padding: 0 30rpx;

  .report-time {
    text {
      color: #808080;
      font-size: 22rpx;
    }

    .time {
      margin-right: 10rpx;
    }
  }

  .report-content {
    .content-item {
      padding: 20rpx 0;

      &:last-child {
        border: none;
      }

      .report-title {
        color: #000000;
        font-size: 36rpx;
        font-weight: bold;
        font-family: MicrosoftYaHei;
        margin-bottom: 20rpx;
      }

      .items-title {
        color: #000000;
        font-size: 28rpx;
        font-weight: bold;
        font-family: MicrosoftYaHei;
        padding-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
      }

      .standard {
        padding-left: 40rpx;

        .items-standard {
          color: #999999;
          font-size: 24rpx;
          padding-bottom: 20rpx;
        }

        .items-images {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10rpx;
          margin-bottom: 20rpx;

          .item-img {
            width: 100rpx;
            height: 100rpx;
          }
        }
      }
    }
  }
}
</style>
