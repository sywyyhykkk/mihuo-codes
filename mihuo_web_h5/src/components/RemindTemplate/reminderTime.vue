<template>
  <div>
    <el-select placeholder="请选择提醒时间" ref="elSelects" v-model="state.dateTime">
      <template #empty>
        <div class="select-empty">
          <div class="select-empty-handel">
            <div class="empty-handel-center">
              <div
                class="handel-center--button"
                :class="index===state.dateIndex?'button-checked':''"
                v-for="(item,index) in state.dateTimeList"
                :key="index"
                @click="selectDate(item,index)">
                <div>{{ item.dateTitle }}</div>
                <el-icon class="el-icon--right">
                  <arrow-right />
                </el-icon>
              </div>
            </div>
            <div class="empty-handel-center" v-if="state.dateIndex===1||state.dateIndex===2">
              <div v-for="(item,index) in state.dateList" :key="index" class="checked-item">
                <el-checkbox v-model="item.checked" v-if="state.dateIndex==1" :label="item.dateTitle" />
                <el-checkbox v-model="item.checked" @change="checkValueChange(index)" v-if="state.dateIndex==2"
                             :label="item.dateTitle" />
              </div>
            </div>
            <div class="empty-handel-center">
              <pickerDate v-model="state.timeSelect" />
            </div>
          </div>
          <div class="select-empty-bottom">
            <el-button type="text" style="color:#606266" @click="cronCancel">取消</el-button>
            <el-button type="text" style="color:#0969DA;margin-right: 2rem" @click="cronConfirm">确定</el-button>
          </div>
        </div>
      </template>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object || String || Number,
    default: {}
  }
})
const emit = defineEmits()
const elSelects = ref<any>('')

const state = reactive({
  dateTime: props.modelValue as any,
  dateSelect: '',
  timeSelect: '',
  dateIndex: -1,
  dateTimeList: [{
    dateTitle: '每天',
    value: '*' + ' ' + '*' + ' ' + '?'
  }, {
    dateTitle: '每周',
    value: '?' + ' ' + '*'
  }, {
    dateTitle: '每月',
    value: '*' + ' ' + '?'
  }],
  dateList: [] as any
})
const checkValueChange = (index: Number) => {
  if (state.dateList[31].checked) {
    for (let i = 0; i < 31; i++) {
      state.dateList[i].checked = false
    }
  }
}
const cronCancel = () => {
  state.dateTime = ''
  state.dateIndex = -1
  state.dateSelect = ''
  state.timeSelect = ''
  state.dateList = []
  elSelects.value.blur()
}
const cronConfirm = () => {
  if (state.dateIndex === 0) {
    state.dateTime = state.timeSelect + ' ' + state.dateSelect
    elSelects.value.blur()
  }
  var checkedList: any = []
  state.dateList.map((res: any) => {
    if (res.checked) {
      checkedList.push(res.value)
    }
  })

  if (state.dateIndex === 1) {
    if (checkedList.length == 0) {
      ElMessage.warning('请选择星期')
    } else {
      state.dateTime = state.timeSelect + ' ' + state.dateSelect + ' ' + checkedList.toString()
      elSelects.value.blur()
    }
  }
  if (state.dateIndex === 2) {
    if (checkedList.length == 0) {
      ElMessage.warning('请选择天')
    } else {
      state.dateTime = state.timeSelect + ' ' + checkedList.toString() + ' ' + state.dateSelect
      elSelects.value.blur()
    }
  }
  if (state.dateIndex === -1) {
    ElMessage.warning('请选择提醒时间')
    state.dateTime = ''
  }
  emit('update:modelValue', state.dateTime)
  console.log(state.dateTime)
}
const selectDate = (item: any, index: any) => {
  state.dateList = []
  state.dateIndex = index
  state.dateSelect = item.value
  state.dateTimeList.map((res: any) => {
    if (res.dateTitle === item.dateTitle) {
      res.checked = true
    } else {
      res.checked = false
    }
  })
  if (index === 1) {
    state.dateList = [{
      dateTitle: '星期一',
      value: '2'
    }, {
      dateTitle: '星期二',
      value: '3'
    }, {
      dateTitle: '星期三',
      value: '4'
    }, {
      dateTitle: '星期四',
      value: '5'
    }, {
      dateTitle: '星期五',
      value: '6'
    }, {
      dateTitle: '星期六',
      value: '1'
    }, {
      dateTitle: '星期天',
      value: '7'
    }]
  }
  if (index === 2) {
    for (let i = 1; i <= 31; i++) {
      state.dateList.push({
        dateTitle: i + '号',
        value: i
      })
    }
    state.dateList.push({
      dateTitle: '每月最后一天',
      value: 'L'
    })
  }
}
</script>

<style scoped lang="less">
.select-empty {
  height: 28rem;
  position: relative;
  width: 65.2rem;

  .select-empty-handel {
    position: absolute;
    bottom: 4rem;
    top: 0;
    display: flex;

    .empty-handel-center {
      height: 100%;
      width: 21.7rem;
      border-right: solid 1px #E4E7ED;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #606266;
      overflow-y: auto;

      .checked-item {
        padding: 1rem 0 0 2rem;
      }

      .button-checked {
        color: #0969DA !important;
      }

      .handel-center--button {
        height: 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem 0 2rem;
        color: #606266;

        .el-icon--right {
          width: 1.1rem;
          height: 1.1rem;
        }

      }
    }
  }

  .select-empty-bottom {
    position: absolute;
    height: 4rem;
    width: 100%;
    border-top: solid 1px #E4E7ED;
    bottom: 0;
    display: flex;
    justify-content: right;
  }
}
</style>
