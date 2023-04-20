<script>
import baseConfig from '@/config/baseUrl'
import { CommonUpload } from '@/plugins/uploadPic.js'
export default {
  emits: ['change'],
  props: {
    order: {
      type: String,
      require: true,
      default: '01'
    },
    defaultValue: {
      type: Object | Array,
      require: false
    },
    topic: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  data() {
    return {
      currentRadio: '',
      checkedList: [],
      fileList: [],
      inputValue: '',
      inputText: '',
      action: baseConfig.apiUrl + 'admin/sys-file/upload'
    }
  },

  created() {
    if (this.topic.type === 'Upload') {
      const [{ title }] = this.defaultValue
      this.fileList = title
    }
  },

  methods: {
    handleClickRadio(item) {
      this.currentRadio = item.id
      this.$emit('change', item)
    },

    checkboxGroupChange(evt) {
      const items = this.topic.children
      const values = evt.detail.value
      const data = items.filter(item => values.includes(item.id))
      this.checkedList = values
      this.$emit('change', data)
    },

    isChecked(item) {
      return this.checkedList.includes(item.id)
    },

    handleInput() {
      this.$emit('change', { title: this.inputValue })
      this.inputText = ''
    },

    handleField() {
      this.$emit('change', { title: this.inputText })
      this.inputValue = ''
    },

    onListChange(lists) {
      this.$emit('change', { title: JSON.parse(lists) })
    }
  }
}
</script>

<template>
  <view class="questions">
    <view class="topic-title">
      <text class="order">{{ order }}</text>
      <text class="title">{{ topic.title }}</text>
    </view>
    <view class="topic-options">
      <view
        v-if="topic.type == 'Radio'"
        key="question-radio"
        class="topic-options-item"
      >
        <radio-group v-model="currentRadio" class="custom-radio-group">
          <view v-for="item of topic.children" :key="item.id" class="radio-box">
            <radio
              :value="item.id"
              :checked="currentRadio == item.id"
              class="custom-radio"
              @click="handleClickRadio(item)"
            >
              <text
                :style="{
                  color: currentRadio == item.id ? '#FE6E32' : '#000'
                }"
              >
                {{ item.title }}
              </text>
            </radio>
          </view>
        </radio-group>
      </view>

      <view
        v-else-if="topic.type == 'Checkbox'"
        key="question-checkbox"
        class="topic-options-item"
      >
        <checkbox-group
          class="custom-checkbox-group"
          @change="checkboxGroupChange"
        >
          <view
            v-for="item of topic.children"
            :key="item.id"
            class="checkbox-box"
          >
            <checkbox
              :value="item.id"
              :checked="isChecked(item)"
              class="custom-checkbox"
            >
              <text
                :style="{
                  color: isChecked(item) ? '#FE6E32' : '#000'
                }"
              >
                {{ item.title }}
              </text>
            </checkbox>
          </view>
        </checkbox-group>
      </view>

      <view
        v-else-if="topic.type == 'FillBlank'"
        key="question-number"
        class="topic-options-item__number"
      >
        <input
          focus
          auto-blur
          v-model="inputValue"
          type="number"
          :min="0"
          class="custom-input"
          placeholder="请输入数值"
          placeholder-style="fons-size: 12rpx; zoom: 0.9"
          @input="handleInput"
        />
        <!-- <text class="unit">m²</text> -->
      </view>

      <view
        v-else-if="topic.type == 'Textarea'"
        key="question-text"
        class="topic-options-item__text"
      >
        <u-field
          focus
          v-model="inputText"
          type="textarea"
          :clearable="false"
          label-width="0"
          maxlength="200"
          class="custom-textarea"
          placeholder="输入文本信息"
          @input="handleField"
        />
      </view>

      <view
        v-else-if="topic.type == 'Upload'"
        key="question-image"
        class="topic-options-item__image"
      >
        <image-upload-new @input="onListChange" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.questions {
  .topic-title {
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;

    .title {
      color: #000;

      font-size: 28rpx;
      font-weight: 500;
    }

    .order {
      margin-right: 10rpx;
      margin-top: 4rpx;

      color: #000;

      font-size: 20rpx;
      font-weight: 400;
      font-style: italic;
      font-family: 'HuXiaoBo-NanShen';

      /* #ifdef H5 */
      zoom: 0.83;
      /* #endif */
    }
  }

  .topic-options {
    .topic-options-item {
      min-height: 320rpx;
      border-radius: 20rpx;
      padding: 40rpx 30rpx;

      background-color: #f7f7f7;
    }

    .topic-options-item__number,
    .topic-options-item__text {
      border-radius: 20rpx;
      background-color: #f7f7f7;
    }

    .uni-input-placeholder,
    .uni-textarea-placeholder {
      color: #a8a8a8;
      font-size: 28rpx;
      font-weight: 400;
    }

    .topic-options-item__number {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding-right: 20rpx;

      .unit {
        color: #000;
        font-size: 24rpx;
        font-weight: 500;
      }

      .custom-input {
        flex: 1;
        height: auto;
        padding: 36rpx 0 36rpx 20rpx;
        box-sizing: content-box;

        .uni-input-input {
          color: #000;
          font-size: 28rpx;
        }

        &::placeholder {
          font-size: 22rpx;
        }
      }
    }

    .topic-options-item__text {
      padding: 36rpx 20rpx;

      /deep/ .u-field {
        padding: 0 !important;
      }

      /deep/ .uni-textarea-textarea {
        color: #000;
        font-size: 28rpx;
      }
    }

    .radio-box {
      & + .radio-box {
        margin-top: 40rpx;
      }
    }

    .checkbox-box {
      & + .checkbox-box {
        margin-top: 40rpx;
      }
    }

    /deep/ .topic-options-item__image {
      .evaluation-file {
        width: 200rpx;
        height: 200rpx;
        background-color: #f7f7f7;
      }

      .upload-preview {
        width: 200rpx !important;
        height: 200rpx !important;
        border-radius: 20rpx;
      }

      .upload-preview-mask {
        width: 200rpx;
        height: 200rpx;
      }

      .upload-preview-mask-default {
        width: 200rpx;
      }
    }
  }
}
</style>
