<template>
  <view class="page-content">
    <view class="item desc-contain">
      <view class="item-tltle">
        <view class="left label">需求说明</view>
        <view class="right" @click="getPopupType()">
          <image class="list_icon" src="/static/icon/list.png"></image>
          常用语
        </view>
      </view>
      <view class="item-desc">
        <u-input
          v-model="form.name"
          placeholder-style="color: #999999;fontSize: 26rpx;"
          class="describe-input"
          maxlength="200"
          height="150"
          type="textarea"
          placeholder="请输入需求说明"
          :border="true"
        />
      </view>
      <view class="item-attachment">
        <view class="file-contain">
          <image-upload-new
            :uploadType="uploadType"
            :count="9"
            v-model="fileJson"
          />
        </view>
        <view
          class="voice-contain"
          v-if="isShowRecording"
          @click="isShowButton = false"
        >
          <sound-recording
            @chooseVoice="chooseVoice"
            v-model="audioFile"
            @close="isShowButton = true"
          />
        </view>
      </view>
    </view>

    <view class="item contact-number">
      <view class="display-center">
        <view class="label">联系电话</view>
        <view class="display-left">
          <text class="right-label"
            >{{ isSwitch ? '' : '不' }}允许显示号码</text
          >
          <u-switch
            v-model="isSwitch"
            @change="changeSwitch"
            active-color="#002FA5"
            inactive-color="#C4C4C4"
            size="26"
          />
        </view>
      </view>
      <view class="display-center" v-if="isSwitch">
        <u-input
          class="input-tel"
          :clearable="false"
          v-model="customerPhone"
          maxlength="11"
          placeholder="请输入联系电话"
          placeholder-style="color: #909999;fontSize: 26rpx;"
          style="width: 200rpx"
          @input="changeVal"
        />
        <view class="tel-tips">用户可通过电话直接与您联系</view>
      </view>
      <view class="display-center" v-else>
        <u-input
          class="input-tel"
          :clearable="false"
          v-model="customerPhone"
          maxlength="11"
          placeholder="请输入联系电话"
          placeholder-style="color: #909999;fontSize: 26rpx;"
          style="width: 200rpx"
          @input="changeVal"
        />
        <view class="tel-tips">用户可通过在线聊天与您联系</view>
      </view>
    </view>

    <view class="work-place">
      <view style="padding: 0 19rpx">
        <view class="label">有效期</view>
        <view class="radio-view">
          <u-radio-group
            v-model="form.days"
            @change="radioGroupChange"
            class="display-center"
          >
            <u-radio
              v-for="(item, index) in validDays"
              :key="index"
              :name="item.value"
              :active-color="$styleColor.themeColor"
            >
              <text class="label">{{ item.name }}</text>
            </u-radio>
          </u-radio-group>
        </view>

        <view class="item-bottom">
          <view class="no-address">
            <view class="time-view display-center">
              <view
                class="public-item-placeholder time-width"
                style="color: #606166"
                >{{ startTime }}</view
              >
              <view class="interval"></view>
              <view
                class="public-item-placeholder time-width"
                :style="endDate ? 'color:#606166' : ''"
                @click="selectionEndTime"
                >{{ endTime && endTime.slice(0, 10) }}
                <image class="arrow-down" src="/static/icon/arrow_down_2.png" />
              </view>
            </view>
          </view>
          <u-picker
            mode="time"
            v-model="endTimeShow"
            :params="params"
            :default-time="endDate"
            :start-year="nowYear"
            @confirm="confirmEnd"
          />
        </view>
      </view>
    </view>

    <view class="work-place">
      <view style="padding: 0 19rpx">
        <view class="label">施工地点</view>
        <view class="item-bottom" @click.stop="getJump('施工地点')">
          <view class="no-address" v-if="!form.address">
            <view class="public-item-placeholder display-center"
              >请选择施工地点</view
            >
            <image class="icon-arrow" src="/static/images/right-vector.png" />
          </view>
          <view class="select-address" v-else>
            <view class="item-name">
              <text class="name">{{ form.contactName }}</text>
              <text class="phone">{{ form.contactPhone }}</text>
            </view>
            <view class="item-bottom-address">
              <view class="address">{{ form.address }}</view>
              <image class="icon-arrow" src="/static/images/right-vector.png" />
            </view>
          </view>
        </view>
      </view>

      <view class="location-view display-center" v-if="locationShow">
        <view class="left" @click="selectCurLocation">
          <view class="btn">当前定位</view>
          {{ locationAddress ? '选择' + locationAddress + '为工作点' : '' }}
        </view>
        <image
          class="right-close"
          src="/static/icon/close2.png"
          @click="closeLocation"
        />
        <view class="triangle"></view>
      </view>
    </view>

    <!-- 服务须知 -->
    <view class="service-notice">
      <view class="title">服务须知</view>
      <view class="content">
        觅活平台无法对线下交易的施工质量进行监控，请务必自行沟通施工需求，甄别交易的真实性。
        在线发布需求仅为撮合服务，不作为退款、售后和质保的凭证。
      </view>
    </view>

    <!-- 常用语 -->
    <send-order-popup
      ref="sendOrderPopupPhrase"
      titleName="请选择常用语"
      :commitStatus="false"
    >
      <view class="popup-type-contain">
        <view class="workers-type-item-value phrase-list">
          <scroll-view class="right-nav-bar" :scroll-y="true">
            <view
              @click="getPhraseListType(item, index)"
              v-for="(item, index) in phraseList"
              :key="index"
              class="item-phrase"
              >{{ item.label }}</view
            >
          </scroll-view>
        </view>
      </view>
    </send-order-popup>

    <bottom-button
      v-show="isShowButton"
      :title="pageType == 'edit' ? '确认修改' : '发布需求'"
      @click="onSubmit"
    />
  </view>
</template>

<script>
import moment from '@/static/js/moment.js'
import { judgePermission, gotoAppPermissionSetting } from '@/plugins/permission'
import { CommonUpload } from '@/plugins/uploadPic.js'
export default {
  data() {
    return {
      customerPhone: uni.getStorageSync('userData').sysUser.phone,
      allowLocation: uni.getStorageSync('allowLocation') || 1,
      pageType: '',
      locationInfo: {},
      locationAddress: '',
      locationShow: true,
      isShowButton: true,
      isSwitch: true,
      phraseList: [],
      isShowRecording: true,
      fileJson: '',
      uploadType: ['图片', '视频'],
      audioFile: {
        type: 'audio',
        url: '',
        timeLength: ''
      },
      form: {
        latitude: '',
        longitude: '',
        provinceName: '', // 省
        cityName: '', //  城市
        districtName: '', //区
        latAddress: '', //街道
        poiName: '',
        contactPhone: '',
        address: '',
        name: '',
        customerPhone: uni.getStorageSync('userData').sysUser.phone,
        companyId: uni.getStorageSync('userAddress').defaultCompanyId,
        cityOperatorId:
          uni.getStorageSync('cityOperatorId') ||
          uni.getStorageSync('userAddress').areaCode ||
          -1,
        // endDate: moment(new Date()).add(5, 'days').format("YYYY-MM-DD"),
        permanentStatus: 0,
        showPhone: 1,
        days: 5
      },
      params: {
        year: true,
        month: true,
        day: true
      },
      endDate: '',
      endTimeShow: false,
      nowYear: moment().year(),
      startTime: moment(new Date()).format('YYYY-MM-DD').replace(/-/g, '.'), //将日期的横杠替换成点
      endTime: moment(new Date())
        .add(5, 'days')
        .format('YYYY-MM-DD')
        .replace(/-/g, '.'),
      isValid: false,
      validDays: [
        {
          name: '5天',
          value: 5
        },
        {
          name: '10天',
          value: 10
        },
        {
          name: '30天',
          value: 30
        },
        {
          name: '永久有效',
          value: -1
        }
      ]
    }
  },

  onLoad(option) {
    let info = {}
    if (option.demandInfo) {
      info = JSON.parse(option.demandInfo)
    }
    if (info.id) {
      ;(this.pageType = 'edit'), (this.form = info)

      if (info.permanentStatus) {
        this.form.days = -1
        this.endTime = '永久有效'
      } else {
        this.form.days = moment(info.endDate).diff(
          moment(info.startDate).format('YYYY-MM-DD'),
          'days'
        )
      }

      //编辑电话号码的回显showPhone==0不显示全部
      if (!info.showPhone) {
        this.customerPhone = info.customerPhone.replace(
          /(\d{3})\d{5}(\d{3})/,
          '$1*****$2'
        )
      } else {
        this.customerPhone = info.customerPhone
      }

      this.isSwitch = info.showPhone == 1 ? true : false
      this.isValid = info.permanentStatus == 1 ? true : false
      let list =
        info.attachments &&
        info.attachments !== '' &&
        JSON.parse(info.attachments)
      this.fileJson =
        list && list.length
          ? JSON.stringify(
              list.filter((item) => item.type == 'img' || item.type == 'video')
            )
          : ''
      if (list && list.length > 0) {
        list.map((item) => {
          if (item.timeLength) {
            this.audioFile.url = item.url
            this.audioFile.timeLength = item.timeLength
          }
        })
      }
      uni.setNavigationBarTitle({
        title: '修改需求'
      })
    }
  },

  onShow() {
    this.allowLocation = uni.getStorageSync('allowLocation')
    this.getLocation()
    this.getPhrase()
    uni.$once('updateData', (data) => {
      if (JSON.stringify(data) !== '{}') {
        this.form.longitude = data.location.lng
        this.form.latitude = data.location.lat
        this.form.provinceName = data.pname
        this.form.cityName = data.cityname
        this.form.districtName = data.adname
        this.form.latAddress = data.address
        this.form.poiName = data.name
        this.form.address = data.cityname + data.adname + data.name
      }
    })
  },

  onUnload() {
    uni.$off('updateData')
  },

  methods: {
    changeVal(value) {
      this.form.customerPhone = value
    },

    radioGroupChange(val) {
      this.form.days = val
      if (val === -1) {
        this.endTime = '永久有效'
      } else {
        this.endTime = moment(new Date())
          .add(val, 'days')
          .format('YYYY-MM-DD')
          .replace(/-/g, '.')
        this.endDate = moment(new Date()).add(val, 'days').format('YYYY-MM-DD')
      }
    },

    confirmEnd(timeInfo) {
      this.endTime = timeInfo.year + '.' + timeInfo.month + '.' + timeInfo.day
      this.endDate = timeInfo.year + '-' + timeInfo.month + '-' + timeInfo.day
      this.form.days = moment(this.endDate).diff(
        moment(new Date()).format('YYYY-MM-DD'),
        'days'
      )
    },
    selectionEndTime() {
      if (this.isValid) return
      this.endTimeShow = true
    },
    closeLocation() {
      this.locationShow = false
    },
    changeSwitch(e) {
      // showPhone 1显示 0不显示
      let tel = uni.getStorageSync('userData').sysUser.phone
      if (e) {
        this.form.showPhone = 1
        this.customerPhone = tel
      } else {
        this.form.showPhone = 0
        this.customerPhone = tel.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2')
      }
    },
    changeTimeSwitch(e) {
      // permanentStatus 0仅有效期内生效 1永久有效
      this.form.permanentStatus = e ? 1 : 0
    },
    //选择当前定位
    selectCurLocation() {
      let info = this.locationInfo.address
      if (!info) return
      this.form.longitude = this.locationInfo.longitude
      this.form.latitude = this.locationInfo.latitude
      this.form.provinceName = info.province
      this.form.cityName = info.city
      this.form.districtName = info.district
      this.form.latAddress = info.street
      this.form.poiName = info.poiName
      this.form.address = this.address = this.locationAddress
      this.locationShow = false
    },

    getLocation() {
      // #ifdef APP-PLUS
      const { locationAuthorized } = uni.getAppAuthorizeSetting()
      if (locationAuthorized == 'authorized') {
        // 已授权 直接获取位置
        this.allowLocation = 1
        uni.setStorageSync('allowLocation', 1)
        uni.getLocation({
          type: 'gcj02',
          geocode: true,
          success: (res) => {
            if (res && res.address) {
              this.locationInfo = res
              this.locationAddress =
                res.address.city + res.address.district + res.address.poiName
            }
          },
          fail: (err) => {
            uni.showModal({
              title: '信息错误',
              content: err
            })
          }
        })
      } else if (locationAuthorized == 'denied' && this.allowLocation != 0) {
        // 拒绝授权 提示去设置
        // 安卓首次是denied
        this.allowLocation = -1
        uni.setStorageSync('allowLocation', -1)
        uni.showModal({
          title: '提示',
          content: '您暂未开启位置使用权限，是否立即设置？',
          confirmText: '去设置',
          cancelText: '暂时不设置',
          confirmColor: '#FF9A52',
          success: (data) => {
            if (data.confirm) {
              gotoAppPermissionSetting()
            } else {
              // 只进行一次弹窗
              this.allowLocation = 0
              uni.setStorageSync('allowLocation', 0)
            }
          }
        })
      } else if (
        uni.getSystemInfoSync().platform == 'ios' &&
        locationAuthorized == 'not determined'
      ) {
        // ios首次是not determined 需要直接用getLocation发起一次弹窗
        uni.getLocation({
          type: 'gcj02',
          geocode: true,
          success: (res) => {
            if (res && res.address) {
              this.locationInfo = res
              this.locationAddress =
                res.address.city + res.address.district + res.address.poiName
            }
          },
          fail: (err) => {
            uni.showModal({
              title: '信息错误',
              content: err
            })
          }
        })
      }
      // #endif
    },
    getJump(typeName) {
      uni.navigateTo({
        url: '/pages/mapChoose/mapChoose',
        animationType: 'slide-in-bottom'
      })
    },
    onSubmit() {
      this.debounce(() => {
        if (!this.form.name) {
          this.$util.toast('请填写需求描述')
          return
        }
        if (!this.form.address) {
          this.$util.toast('请填写施工地址')
          return
        }
        if (!this.form.customerPhone) {
          uni.showToast({
            title: '请输入手机号码',
            icon: 'none'
          })
          return
        }
        if (!this.$base.phoneRegular.test(this.form.customerPhone)) {
          uni.showToast({
            title: '手机号码格式不正确',
            icon: 'none'
          })
          return
        }
        // 先判断上传是否完成，上传完成后的url才是网络路径
        if (!this.$checkUploadProcess(this.fileJson)) {
          return
        }
        // 处理附件
        let attachmentsFile = this.fileJson !== '' && JSON.parse(this.fileJson)
        let fileAll = []
        if (attachmentsFile) {
          fileAll = [...attachmentsFile]
        }
        if (this.audioFile.url) {
          fileAll.push(this.audioFile)
        }
        this.form.attachments = JSON.stringify(fileAll)

        if (this.form.days == -1) {
          this.form.permanentStatus = 1
          this.endDate = ''
        } else {
          this.form.permanentStatus = 0
          this.endDate = this.endDate + ' ' + '23:59:59'
        }

        console.log(this.form)

        if (this.pageType !== 'edit') {
          this.$httpApi.releaseDemand(this.form).then((res) => {
            if (res) {
              this.$util.toast('发布成功')
              setTimeout(() => {
                uni.navigateBack()
              }, 1000)
            }
          })
        } else {
          this.$httpApi.editDemand(this.form).then((res) => {
            if (res) {
              this.$util.toast('编辑成功')
              setTimeout(() => {
                uni.navigateBack()
              }, 1000)
            }
          })
        }
      }, 300)
    },
    // 获取常用短语
    getPhrase() {
      this.$httpApi
        .getDicType({
          type: 'common_words_of_demand'
        })
        .then((res) => {
          if (res) {
            this.phraseList = res
          }
        })
    },
    // 常用语添加到需求描述中
    getPhraseListType(item, index) {
      this.form.name = item.label
      this.$refs.sendOrderPopupPhrase.requirementListShow = false
    },
    async chooseVoice(file) {
      if (file.buttonType !== 'clear') {
        this.isShowButton = true
      }
      // 音频
      if (!file.path) {
        return
      }
      if (file.duration > 0 && file.path) {
        this.audioFile.url = await CommonUpload(file.path)
        this.audioFile.timeLength = file.duration
      }
    },
    getPopupType() {
      this.$refs['sendOrderPopupPhrase'].requirementListShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  margin: 10rpx 20rpx 0;
}

.label {
  font-size: $middleFontSize;
  color: $seconFontColor;
}

.item {
  background-color: #fff;
  padding: 26rpx 44rpx 30rpx;
  margin-top: 2rpx;
}

.desc-contain {
  border-radius: 0rpx 0rpx 10rpx 10rpx;

  .item-tltle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .right {
      display: flex;
      align-items: center;
      font-size: $middleFontSize;
      color: #606166;

      .list_icon {
        width: 26rpx;
        height: 26rpx;
        margin-right: 10rpx;
      }
    }
  }

  .item-desc {
    background: #f6f7f9;
    border-radius: 10rpx;
    margin-bottom: 40rpx;

    .describe-input {
      border: 0px;
    }

    .speech-recognition {
      color: #666666;
      font-size: $smiddleFontSize;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0rpx 20rpx 20rpx 0rpx;

      image {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }

  .item-attachment {
    .file-contain {
      margin-bottom: 22rpx;
    }
  }
}

.contact-number {
  background-color: #fff;
  .tel-tips {
    font-size: 26rpx;
    color: #909199;
  }
}

.right-label {
  margin-right: 28rpx;
  font-size: 26rpx;
  color: #606166;
}

.popup-type-contain {
  .workers-type-item-value {
    padding: 40rpx;
    display: flex;
    flex-wrap: wrap;
  }

  .phrase-list {
    height: 360rpx;
    padding-top: 16rpx;

    .right-nav-bar {
      height: 100%;
    }

    .item-phrase {
      width: 100%;
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx dashed #e4e4e4;

      &:hover {
        color: #7b7878;
      }
    }
  }
}

.work-place {
  padding: 36rpx 28rpx;
  margin-top: 2rpx;
  background-color: #ffffff;
  .radio-view {
    margin-top: 10rpx;
    .label {
      color: #909199;
      font-size: 26rpx;
    }
  }
  .item-bottom {
    display: flex;
    align-items: center;
    margin-left: 10rpx;
    width: 100%;

    .no-address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .time-view {
        width: 100%;
        margin-top: 10rpx;
        .time-width {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 228rpx;
          height: 72rpx;
          border-radius: 10rpx;
          background: #f6f7f9;
          .arrow-down {
            width: 18rpx;
            height: 10rpx;
            margin-left: 36rpx;
          }
        }
        .interval {
          width: 38rpx;
          height: 4rpx;
          background-color: #d8d8d8;
        }
      }
    }

    .public-item-placeholder {
      width: 100%;
      color: #999999;
      font-size: $smiddleFontSize;
      margin: 8rpx 0 0 -10rpx;
    }

    .icon-arrow {
      width: 14rpx;
      height: 26rpx;
    }

    .select-address {
      width: 100%;

      .item-name {
        margin-bottom: 6rpx;

        .name,
        .phone {
          color: $viceFontColor;
          font-size: $middleFontSize;
        }
      }

      .item-bottom-address {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10rpx;

        .address {
          width: 90%;
          color: $seconFontColor;
          font-size: $smiddleFontSize;
        }
      }
    }
  }

  .location-view {
    padding: 20rpx;
    background: #e8eefe;
    border-radius: 10rpx;
    margin-top: 20rpx;
    position: relative;

    .left {
      width: calc(100% - 80rpx);
      font-size: $middleFontSize;
      color: $themeColor;
      line-height: 40rpx;
      @include bov(3);

      .btn {
        display: inline-block;
        padding: 4rpx 10rpx;
        background: #ffffff;
        font-size: $smallFontSize;
        color: $themeColor;
        margin-right: 10rpx;
      }
    }

    .right-close {
      width: 40rpx;
      height: 40rpx;
    }

    .triangle {
      width: 0;
      height: 0;
      border-width: 12rpx;
      border-style: solid;
      border-color: transparent #e8eefe transparent transparent;
      transform: rotate(90deg);
      position: absolute;
      left: 32rpx;
      top: -22rpx;
    }
  }
}

.service-notice {
  margin: 20rpx 20rpx 0;

  .title,
  .content {
    text-align: center;
    font-size: $middleFontSize;
    color: $seconFontColor;
  }

  .content {
    text-align: left;
    margin-top: 24rpx;
  }
}

.display-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.display-left {
  display: flex;
  align-items: center;
}
</style>
