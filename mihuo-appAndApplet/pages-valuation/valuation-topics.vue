<script>
import common from '@/config/common.js'
import operation from '@/plugins/mathoperation.js'
import ValuationQuestion from './components/valuation-question/valuation-question.vue'
import { deepClone } from '@/plugins/utils.js'
import { expressionCalc } from '@/plugins/expressionCalc.js'
import { masterAvatar } from '@/plugins/orderStatus'

export default {
  components: { ValuationQuestion },

  data() {
    return {
      options: {},
      initTopic: [],
      topicList: [],
      referListMap: {},
      currentTopicList: [],
      currentTopicIndex: 1,
      currentTopic: {},
      currentQuestion: {},
      fulfilledTopicList: [],
      currentFeeRules: [],
      estimatedAmounts: { minAmount: 0, maxAmount: 0 ,minAmountRuleDesc:'', maxAmountRuleDesc:''},
      defaultValue: {},
      currentHasValue: false,
      currentSurvey: {},
      topicType: ['Checkbox', 'Radio'],
      uploadFiles: [],
      imageGlobal: '',
      showPopup: false,
      isCallMaster: false,
      showDetail: false,
      curMaster: {},
      masterStatus: [],
      ipImage: masterAvatar,
      gapHeight:"450"
    }
  },

  onLoad(options) {
    this.options = options
  },

  mounted() {
    this.loadData()
    this.imageGlobal = this.$image.imageGlobal
  },

  methods: {
    loadData() {
      uni.showLoading({ mask: true })
      this.$http
        .get(`basic/standard/survey/public/loadProject?projectId=${this.options.suryId}`)
        .then(data => {
          this.currentSurvey = deepClone(data.survey)
          this.topicList = this.getAllSurveyList(data.survey.children)
          const topic = data.survey.children[0]
          const option = topic.children.find(item => item.id === this.options.id)
          topic.answer = [
            {
              ...option,
              referValue: option.attribute.referValue
            }
          ]

          this.currentQuestion = option
          this.fulfilledTopicList = [topic]
          this.currentFeeRules = topic.attribute?.customFeeRules
          this.getReferMap()
          this.changeComputationalCosts(topic)
          if (option.children?.length) {
            this.currentTopicList = [topic, ...option.children]
            this.currentTopic = this.currentTopicList[1]
            this.initTopic = deepClone([topic, ...option.children])
          }
        })
        .catch(e => {
          console.error(e.message)
        })
        .finally(() => {
          uni.hideLoading()
        })
    },

    handleEditTopic(topic, index) {
      const children = deepClone(topic.children)
      const results = children.map(item => {
        delete item.checked
        return item
      })
      topic.children = results

      this.currentTopicIndex = index
      this.fulfilledTopicList.length = index
      if (topic.type === 'Upload') {
        topic.answer[0].title = this.uploadFiles
        this.defaultValue = topic.answer
      }
      if (index === 0) {
        this.currentTopicList = []
        this.currentTopicList.push(topic)
        this.currentTopic = topic
        return
      }
      if (index !== 0 && index + 1 <= this.initTopic.length) {
        this.currentTopicList = this.initTopic
        this.currentTopic = this.initTopic[index]
        return
      }
      this.currentTopicList.length = index
      this.currentTopicList.push(topic)
      this.currentTopic = topic
    },

    addTopicListById(topicIds, data) {
      if (!data.children?.length) return
      for (const item of data.children) {
        if (!topicIds.includes(item.id)) {
          this.currentTopicList.push(item)
        }
      }
    },

    handleContinue() {
      this.fulfilledTopicList.push(this.currentTopic)
      this.currentFeeRules = this.currentTopic.attribute?.customFeeRules

      if (this.topicType.includes(this.currentTopic.type)) {
        const currentTopicIds = this.currentTopicList.map(item => item.id)
        if (Array.isArray(this.currentQuestion)) {
          for (const item of this.currentQuestion) {
            this.addTopicListById(currentTopicIds, item)
          }
        } else {
          this.addTopicListById(currentTopicIds, this.currentQuestion)
        }
      }

      const topicCount = this.currentTopicList?.length
      if (this.currentTopicIndex !== topicCount - 1) {
        this.currentTopicIndex += 1
        const topic = this.currentTopicList[this.currentTopicIndex]
        this.currentTopic = deepClone(topic)
      } else {
        this.currentTopic = {}
      }
      this.defaultValue = {}
      this.currentHasValue = false
    },

    handleSaveScheme(type) {
      if (!this.fulfilledTopicList.length) return
      uni.showLoading({ mask: true })
      const answer = this.getAnswerMap()
      const fees = this.getFeesList(this.currentFeeRules)
      const { minAmount, maxAmount } = this.estimatedAmounts

      this.$http
        .post('basic/standard/survey/public/saveAnswer', {
          answer,
          examInfo: { fees, minAmount, maxAmount },
          projectId: this.currentSurvey.id,
          survey: this.currentSurvey
        })
        .then(data => {
          if (data.id) {
            this.$util.toast('方案保存成功')
            uni.redirectTo({
              url: `/pages-valuation/estimated-amounts?dataId=${data.id}`
            })
          }
        })
        .catch(e => {
          console.error(e.message)
        })
        .finally(() => {
          uni.hideLoading()
        })
    },

    getAnswerMap() {
      const maps = this.fulfilledTopicList.flatMap(item => {
        const topicKey = item.id
        const children = item.answer
        const arr = children.flatMap(v => [
          [v.id ?? topicKey, Array.isArray(v.title) ? v.title.join(',') : v.title]
        ])
        const answer = Object.fromEntries(arr)
        return [[topicKey, answer]]
      })
      return Object.fromEntries(maps)
    },

    getFeesList(feeRules) {
      if (!feeRules?.length) return
      for (const item of feeRules) {
        const { minAmount, maxAmount } = this.nlms(item)
        item.minAmount = minAmount
        item.maxAmount = maxAmount
      }
      return feeRules
    },

    handleChange(options) {
      if (options?.title?.length || options?.length) {
        this.currentHasValue = true
      } else {
        this.currentHasValue = false
        return
      }
      if (this.currentTopic.type === 'Upload') {
        this.uploadFiles = []
      }

      this.currentQuestion = options
      let answer = []
      if (Array.isArray(options)) {
        answer = options.map(item => ({
          id: item.id,
          title: item.title,
          referValue: item.attribute?.referValue ?? 0
        }))
      } else {
        if (Array.isArray(options.title)) {
          const { id, title } = options
          const images = title.map(item => item.url)
          answer = [{ id, title: images, referValue: 0 }]
        } else {
          if (this.currentTopic.type !== 'FillBlank') {
            if (this.currentTopic.type === 'Radio') {
              const { attribute } = options
              answer = [{ ...options, referValue: attribute.referValue }]
            } else {
              const { id, title } = options
              answer = [{ id, title: title, referValue: 0 }]
            }
          } else {
            const { id, title } = options
            answer = [{ id, title: title, referValue: title }]
          }
        }
      }
      this.currentTopic.answer = answer
      this.changeComputationalCosts(this.currentTopic)
    },

    getReferMap() {
      this.topicList.forEach(item => {
        if ('referValue' in item.attribute) {
          this.referListMap[item.id] = item.attribute.referValue ?? 0
        }
      })
    },

    getAmountNum(amount) {
      return Number.isFinite(Number(amount))
    },

    changeComputationalCosts(topic) {
      if (topic.type === 'Upload' || topic.type === 'Textarea') return
      if (topic.type === 'Checkbox') {
        const n = topic.answer.reduce((prev, cur) => (prev += Number(cur.referValue)), 0)
        this.referListMap[[topic.id]] = n.toString()
      } else if (topic.type === 'Radio' || topic.type === 'FillBlank') {
        this.referListMap[[topic.id]] = topic.answer[0].referValue ?? 0
      } else {
        this.referListMap[[topic.id]] = 0
      }

      let attribute = null
      if (topic.type === 'Radio') {
        const option = topic.answer[0]
        if (option.attribute?.minAmountRule || option.attribute?.maxAmountRule) {
          attribute = option.attribute
        } else {
          attribute = topic.attribute
        }
      } else {
        attribute = topic.attribute
      }
      const { minAmount, maxAmount } = this.nlms(attribute)
      this.estimatedAmounts = { minAmount, maxAmount }
      this.estimatedAmounts["minAmountRuleDesc"] = attribute.minAmountRuleDesc
      this.estimatedAmounts["maxAmountRuleDesc"] = attribute.maxAmountRuleDesc
      this.currentFeeRules = attribute?.customFeeRules
    },

    nlms(attribute) {
      const regex = /(\{\w+\})/g
      const estimate = { minAmount: 0, maxAmount: 0 }
      const { minAmountRule, maxAmountRule } = attribute

      if (minAmountRule === undefined) {
        attribute.minAmountRule = 0
      }
      if (maxAmountRule === undefined) {
        attribute.maxAmountRule = 0
      }

      if (this.getAmountNum(minAmountRule) && this.getAmountNum(maxAmountRule)) {
        estimate.minAmount = minAmountRule
        estimate.maxAmount = maxAmountRule
        return estimate
      }

      if (this.getAmountNum(minAmountRule)) {
        estimate['minAmount'] = minAmountRule
      } else {
        let minRule = deepClone(minAmountRule)
        const minIds = minAmountRule?.match(regex)?.filter(item => item.length >= 4)

        minIds?.forEach(it => {
          const key = it.replace(/\{|\}/g, '').toString()
          const str = it.replace(/(?=[\{|\}])/g, '\\')
          const reg = new RegExp(str, 'g')
          minRule = minRule.replace(reg, this.referListMap[key] ?? '0')
        })
        estimate['minAmount'] = Math.round(expressionCalc(minRule))
      }

      if (this.getAmountNum(maxAmountRule)) {
        estimate['maxAmount'] = maxAmountRule
      } else {
        let maxRule = deepClone(maxAmountRule)
        const maxIds = maxAmountRule?.match(regex)?.filter(item => item.length >= 4)

        maxIds?.forEach(it => {
          const key = it.replace(/\{|\}/g, '')
          const str = it.replace(/(?=[\{|\}])/g, '\\')
          const reg = new RegExp(str, 'g')
          maxRule = maxRule.replace(reg, this.referListMap[key] ?? '0')
        })
        estimate['maxAmount'] = Math.round(expressionCalc(maxRule))
      }
      return estimate
    },

    getAllSurveyList(children) {
      let count = 0
      let results = children
      while (results.length !== count) {
        let item = results[count]
        if (item.children) {
          results = results.concat(item.children)
        }
        count += 1
      }
      return results
    },

    getOrder(value) {
      return value.toString()[1] ? '' + value : '0' + value
    },

    getFloatpMyriad(num) {
      return operation.floatp(num, 10000)
    },

    onPreview(list, index) {
      uni.previewImage({
        current: index,
        indicator: 'number',
        loop: true,
        urls: list.map(item => common.imageGlobal + item),
        fail: () => {
          uni.showToast({
            icon: 'error',
            title: '图片加载失败',
            duration: 2000
          })
        }
      })
    },

    toValuationHistory() {
      uni.navigateTo({
        url: '/pages-valuation/valuation-history'
      })
    },

    toEstimatedAmounts() {
      const feeRules = this.getFeesList(this.currentFeeRules)
      if (!feeRules?.length) return

      const { minAmount, maxAmount } = this.estimatedAmounts
      const topicData = {
        topics: this.fulfilledTopicList,
        examInfo: { fees: feeRules, minAmount, maxAmount }
      }
      this.$store.commit('SET_FULFILLED_TOPICS', topicData)
      if (topicData.topics.length) {
        uni.navigateTo({
          url: '/pages-valuation/estimated-amounts'
        })
      }
    },

    async getCommonDesign() {
      //  登陆后获取呼工人呼叫状态
      if (uni.getStorageSync('userData')) {
        this.masterStatus = await this.$httpApi.getOrderSkillTypeStatus()
      }
      this.$httpApi
        .getPlatformSkills({
          type: '', // 查询全部
          clientType: 'platform'
        })
        .then(res => {
          if (res) {
            res.forEach(item => {
              if (item.jobCode == 'JOB_MANAGER') {
                this.curMaster = item
              }
              this.ipImage.some((v, i) => {
                if (item.skillName.indexOf(v.name) != -1) {
                  item.img = v.img
                }
              })
            })
            if (this.masterStatus && this.masterStatus.length) {
              this.masterStatus.map(item => {
                res.forEach(ele => {
                  if (item?.skillId == ele.skillId) {
                    ele.isServe = true // true:代表服务中
                  }
                })
              })
            }
            this.showDetail = true
          }
        })
    },

    findMasterHome() {
      this.showDetail = false
      setTimeout(() => {
        this.isCallMaster = true
      }, 200)
    },

    // 取消订单
    cancel(id) {
      this.showDetail = false
      uni.showModal({
        title: '确认操作',
        content: '是否确认取消呼叫',
        cancelText: '再等等',
        confirmText: '确认',
        confirmColor: '#FE6E32',
        success: res => {
          if (res.confirm) {
            uni.showLoading({
              title: '取消中',
              mask: true
            })
            this.$http.post('order/capp/biz_order/cancelCall?skillId=' + id).then(res => {
              if (res) {
                this.$util.toast('取消呼叫成功')
                this.isCallMaster = true
              }
            })
          }
          if (res.cancel) {
            this.showDetail = true
          }
        }
      })
    },

    handleCallManage() {
      if (uni.getStorageSync('userData')) {
        this.getCommonDesign()
      } else {
        this.$util.goToLoginPage()
      }
    }
  }
}
</script>

<template>
  <view class="valuation-topics">
    <z-nav-bar :titleCenter="false">
      <view class="nav-bar" slot="default"> 快速估价 </view>
      <view class="right-btn" slot="right" @click="toValuationHistory"> 估价历史 </view>
    </z-nav-bar>
    <view class="topic-list">
      <view v-for="(topic, index) in fulfilledTopicList" :key="topic.id" class="topic-content">
        <text class="order">{{ getOrder(index + 1) }}</text>
        <view class="topic-box">
          <view class="topic-title">
            <text>{{ topic.title }}</text>
            <u-icon
              name="edit-pen"
              color="#808080"
              size="28"
              @click="handleEditTopic(topic, index)"
            ></u-icon>
          </view>
          <view v-if="topic.type === 'Upload'" class="topic-answer__image">
            <image
              v-for="(url, index2) in topic.answer[0].title"
              :key="index2"
              :src="imageGlobal + url"
              mode="aspectFill"
              class="custom-image"
              @click="onPreview(topic.answer[0].title, index2)"
            ></image>
          </view>
          <view v-else class="topic-answer">
            <view v-for="(item, index2) in topic.answer" :key="index2" class="topic-answer-item">{{
              item.title
            }}</view>
          </view>
          <!-- <view v-else class="topic-answer">
            <view class="topic-answer-item">{{ topic.answer.title }}</view>
          </view> -->
        </view>
      </view>
      <view class="hint_info">
        <text v-if="fulfilledTopicList.length && currentTopic.title"
          >再回答这几个问题，结果可以更精确</text
        >
      </view>

      <ValuationQuestion
        v-if="currentTopic.id"
        :order="getOrder(fulfilledTopicList.length + 1)"
        :topic="currentTopic"
        :defaultValue="defaultValue"
        @change="handleChange"
      />
    </view>
    <u-gap :height="gapHeight" bg-color="rgba(0,0,0,0)"></u-gap>
    <view class="operation" id="operation_id">
      <view class="calculate-result">
        <view class="calculate-title">
          <view @click="showPopup = true">
            <text class="text">预估费用</text>
            <view class="collapse-icon" :class="{ 'collapse-icon__active': showPopup }">
              <u-icon
                name="arrow-down"
                color="#000"
                size="24"
                :custom-style="{ zoom: 'calc(18 / 24)' }"
              ></u-icon>
            </view>
          </view>
          <view class="call-btn" @click="handleCallManage">
            <text class="text">立即呼叫</text>
          </view>
        </view>
        <view class="calculate-item" @click="toEstimatedAmounts">
          <text class="title">最高价</text>
          <text class="value"> <text class="unit">￥</text> {{ estimatedAmounts.maxAmount || 0 }} </text>
          <view class="text">
            {{ estimatedAmounts.maxAmountRuleDesc || '' }}</view>
        </view>
        <view class="calculate-item" @click="toEstimatedAmounts">
          <text class="title">最低价</text>
          <text class="value"> <text class="unit">￥</text> {{ estimatedAmounts.minAmount || 0 }} </text>
          <view class="text">{{ estimatedAmounts.minAmountRuleDesc || ''}}</view>
        </view>
      </view>
      <view class="buttons">
        <button class="btn btn-save" @click="handleSaveScheme(1)"><text>保存方案</text></button>
        <button
          v-if="currentTopic.id"
          :disabled="!currentHasValue"
          class="btn btn-select"
          :style="{
            'background-color': currentHasValue ? '#000' : '#bfbebd'
          }"
          @click="handleContinue"
        >
          <text>下一步</text>
        </button>
        <button
          v-else
          class="btn btn-select"
          :style="{ 'background-color': '#000' }"
          @click="handleSaveScheme(2)"
        >
          <text>选好了</text>
        </button>
      </view>
    </view>
    <u-popup v-model="showPopup" mode="bottom" border-radius="50" height="1000">
      <view class="estimated-amounts-container">
        <view class="title">预估费用</view>
        <view class="calculate-item">
          <text class="value">
            <text class="unit">￥</text> {{ estimatedAmounts.maxAmount || 0 }}
            <text class="sub-title">价格说明</text>
          </text>
          <view class="text">
            {{ estimatedAmounts.maxAmountRuleDesc || '' }}
          </view>
        </view>
        <view class="calculate-item">
          <text class="value">
            <text class="unit">￥</text> {{ estimatedAmounts.minAmount || 0 }}
            <text class="sub-title">价格说明</text>
          </text>
          <view class="text"> {{ estimatedAmounts.minAmountRuleDesc || '' }}</view>
        </view>
      </view>
    </u-popup>
    <!-- 工种简介 -->
    <master-worker-detail
      v-model="showDetail"
      :data="curMaster"
      @cancel="cancel"
      @findMasterNow="findMasterHome"
    />
    <!-- 我要同款 -->
    <call-master v-model="isCallMaster" :data="curMaster" />
  </view>
</template>

<style scoped lang="scss">
.valuation-topics {
  .nav-bar {
    .nav-bar-text {
      width: 100%;
    }
  }

  .right-btn {
    margin-right: 30rpx;

    color: #000;

    font-size: 28rpx;
    font-weight: 500;
  }

  .topic-list {
    margin: 0 30rpx;

    .topic-content {
      margin-top: 40rpx;

      display: flex;
      align-items: flex-start;

      .order {
        color: #000;
        font-size: 20rpx;
        /* #ifdef H5 */
        zoom: calc(20 / 24);
        /* #endif */
        font-weight: 400;
        font-style: italic;
        font-family: 'HuXiaoBo-NanShen';
        /* #ifndef H5 */
        line-height: 37.5rpx;
        /* #endif */
        /* #ifdef H5 */
        zoom: 0.83;
        margin-top: 12rpx;
        /* #endif */
      }

      .topic-box {
        flex: 1;
        margin-left: 11rpx;
      }

      .topic-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        text {
          color: #808080;

          font-size: 28rpx;
          font-weight: 400;
        }
      }

      .topic-answer {
        margin-top: 23rpx;
      }

      .topic-answer-item {
        display: inline-block;

        padding: 9rpx 13rpx;
        border-radius: 6rpx;

        color: #fe6e32;
        background-color: rgba(254, 110, 50, 0.1);

        font-size: 24rpx;
        font-weight: 500;

        & + .topic-answer-item {
          margin-left: 20rpx;
        }
      }

      .topic-answer__image {
        margin-top: 23rpx;

        display: grid;
        grid-template: auto / repeat(3, minmax(200rpx, 1fr));
        gap: 20rpx;

        .custom-image {
          height: 200rpx;
          border-radius: 20rpx;
          background-color: #f7f7f7;
        }
      }
    }

    .hint_info {
      margin-top: 42rpx;
      text-align: center;
      margin-bottom: 40rpx;

      text {
        color: #808080;

        font-size: 20rpx;
        /* #ifdef H5 */
        zoom: calc(20 / 24);
        /* #endif */
        font-weight: 500;
      }
    }
  }

  .operation {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 406rpx;
    background: #f7f7f7;
    border-radius: 30rpx 30rpx 0 0;
    padding: 30rpx;
    z-index: 99;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    .calculate-result {
      margin-bottom: 30rpx;

      .calculate-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .text {
          color: #000000;
          font-size: 28rpx;
          font-family: 'Noto Sans S Chinese';
          font-weight: 500;
          line-height: 34rpx;
          margin-right: 11rpx;
        }

        .collapse-icon {
          display: inline-block;
          transform: perspective(100rpx) rotateZ(0);
          transition: transform 300ms ease-in-out;
        }

        .collapse-icon__active {
          transform: rotateZ(180deg);
        }

        .call-btn {
          width: 118rpx;
          height: 42rpx;
          background: #ffffff;
          border: 1rpx solid #fe6e32;
          border-radius: 21rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          .text {
            color: #fe6e32;
            font-size: 20rpx;
            /* #ifdef H5 */
            zoom: calc(20 / 24);
            /* #endif */
            font-family: 'HuXiaoBo-NanShen';
            font-weight: 400;
            line-height: 34rpx;
          }
        }
      }

      .calculate-item {
        margin-top: 20rpx;

        .unit {
          font-size: 24rpx;
          font-weight: 500;
          color: #fe6e32;
          zoom: 0.8;
        }

        .title {
          color: #000;
          font-size: 20rpx;
          /* #ifdef H5 */
          zoom: calc(20 / 24);
          /* #endif */
          font-weight: 500;
          margin-right: 12rpx;
        }

        .value {
          color: #fe6e32;
          font-size: 28rpx;
          font-weight: 500;
        }

        .text {
          color: #999999;
          font-size: 20rpx;
          /* #ifdef H5 */
          zoom: calc(20 / 24);
          /* #endif */
          font-family: 'Noto Sans S Chinese';
          font-weight: 400;
          line-height: 34rpx;
          margin-top: 10rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    .buttons {
      display: flex;
      align-items: center;

      .btn {
        height: 100rpx;
        border-radius: 20rpx;

        display: flex;
        justify-content: center;
        align-items: center;

        text {
          font-size: 28rpx;
        }
      }

      .btn-save {
        width: 170rpx;
        border: 1px solid #000;
        background-color: #f7f7f7;

        text {
          font-weight: 400;
          color: #000;
        }
      }

      .btn-select {
        flex: 1;
        margin-left: 20rpx;
        // background: #000000;

        text {
          font-weight: 500;
          color: #fff;
        }
      }
    }
  }

  /deep/ .custom-radio {
    min-width: 150rpx;

    &::before {
      display: none;
    }

    .uni-radio-wrapper,
    .wx-radio-wrapper {
      text {
        color: #000;
        font-size: 28rpx;
        font-weight: 500;
      }
    }

    .uni-radio-input,
    .wx-radio-input {
      width: 30rpx;
      height: 30rpx;
      margin-right: 23rpx;
      border: 1px solid #e6e6e6;
    }

    .uni-radio-input-checked,
    .wx-radio-input-checked {
      position: relative;
      border-color: #fe6e32 !important;
      background-color: #fff !important;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;

        width: 14rpx;
        height: 14rpx;
        border-radius: 50%;

        background-color: #fe6e32;
      }
    }
  }

  /deep/ .custom-checkbox {
    min-width: 150rpx;

    &::before {
      display: none;
    }

    .uni-checkbox-wrapper,
    .wx-checkbox-wrapper {
      text {
        color: #000;
        font-size: 28rpx;
        font-weight: 500;
      }
    }

    .uni-checkbox-input,
    .wx-checkbox-input {
      width: 30rpx;
      height: 30rpx;
      margin-right: 23rpx;
      border: 1px solid #e6e6e6;
      border-radius: 50%;
    }

    .uni-checkbox-input-checked,
    .wx-checkbox-input-checked {
      position: relative;
      border-color: #fe6e32 !important;
      background-color: #fff !important;

      &::after {
        content: '\2714';
        position: absolute;
        inset: 0;

        zoom: 0.94;
        font-size: 24rpx;
        text-align: center;

        width: 100%;
        height: 100%;
        margin: auto;
        border-radius: 50%;

        color: #fff;
        background-color: #fe6e32;
      }
    }
  }

  /deep/ .estimated-amounts-container {
    width: 100%;
    height: 100%;
    padding: 50rpx 30rpx;
    background-color: #f7f7f7 !important;

    .title {
      color: #000000;
      font-size: 32rpx;
      font-family: Noto Sans S Chinese;
      font-weight: 500;
      line-height: 34rpx;
    }

    .calculate-item {
      margin-top: 30rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;

      .unit {
        font-size: 24rpx;
        font-weight: 500;
        color: #fe6e32;
        zoom: 0.8;
      }

      .sub-title {
        color: #000;
        font-size: 20rpx;
        /* #ifdef H5 */
        zoom: calc(20 / 24);
        /* #endif */
        font-weight: 500;
        margin-left: 12rpx;
      }

      .value {
        color: #fe6e32;
        font-size: 28rpx;
        font-weight: 500;
      }

      .text {
        color: #4d4d4d;
        font-size: 24rpx;
        font-family: Noto Sans S Chinese;
        font-weight: 500;
        line-height: 34rpx;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
