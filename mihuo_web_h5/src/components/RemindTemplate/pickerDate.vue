<template>
  <div class="picker-date" ref="pickerDate">
    <div class="select-picker-date">
      <div class="hour-list ">
        <div class="hour-item-arrowup">
          <el-icon @click="arrowUpHandel('h')">
            <arrow-up />
          </el-icon>
        </div>
        <div class="hour-item">
          {{ state.house - 1 < 0 ? null : state.house - 1 <= 9 ? '0' + (state.house - 1) : state.house - 1 }}
        </div>
        <div class="hour-item active">{{ state.house <= 9 ? '0' + state.house : state.house }}</div>
        <div class="hour-item">
          {{ state.house + 1 > 23 ? null : state.house + 1 <= 9 ? '0' + (state.house + 1) : state.house + 1 }}
        </div>
        <div class="hour-item-arrowdown">
          <el-icon @click="arrowDownHandel('h')">
            <arrow-down />
          </el-icon>
        </div>
      </div>
      <div class="hour-list" style="left:33.3%">
        <div class="hour-item-arrowup">
          <el-icon @click="arrowUpHandel('m')">
            <arrow-up />
          </el-icon>
        </div>
        <div class="hour-item">
          {{ state.minute - 1 < 0 ? null : state.minute - 1 <= 9 ? '0' + (state.minute - 1) : state.minute - 1 }}
        </div>
        <div class="hour-item active">{{ state.minute <= 9 ? '0' + state.minute : state.minute }}</div>
        <div class="hour-item">
          {{ state.minute + 1 > 59 ? null : state.minute + 1 <= 9 ? '0' + (state.minute + 1) : state.minute + 1 }}
        </div>
        <div class="hour-item-arrowdown">
          <el-icon @click="arrowDownHandel('m')">
            <arrow-down />
          </el-icon>
        </div>
      </div>
      <div class="hour-list" style="right:0">
        <div class="hour-item-arrowup">
          <el-icon @click="arrowUpHandel('s')">
            <arrow-up />
          </el-icon>
        </div>
        <div class="hour-item">
          {{ state.second - 1 < 0 ? null : state.second - 1 <= 9 ? '0' + (state.second - 1) : state.second - 1 }}
        </div>
        <div class="hour-item active">{{ state.second <= 9 ? '0' + state.second : state.second }}</div>
        <div class="hour-item">
          {{ state.second + 1 > 59 ? null : state.second + 1 <= 9 ? '0' + (state.second + 1) : state.second + 1 }}
        </div>
        <div class="hour-item-arrowdown">
          <el-icon @click="arrowDownHandel('s')" size="11">
            <arrow-down />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="picker-date-confirm">

    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, reactive, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object || String || Number,
    default: {}
  }
})
const emit = defineEmits()

const pickerDate = ref<any>('')
const hourList = ref<any>('')
const houseItem = ref<any>('')
const state = reactive({
  house: 0 as any,
  minute: 0 as any,
  second: 0 as any
})

const arrowDownHandel = (row: any) => {
  if (row === 'h') {
    state.house = state.house < 23 ? state.house + 1 : 0
  }
  if (row === 'm') {
    state.minute = state.minute < 59 ? state.minute + 1 : 0
  }
  if (row === 's') {
    state.second = state.second < 59 ? state.second + 1 : 0
  }

}
const arrowUpHandel = (row: any) => {
  if (row === 'h') {
    state.house = state.house > 0 ? state.house - 1 : 23
  }
  if (row === 'm') {
    state.minute = state.minute > 0 ? state.minute - 1 : 59
  }
  if (row === 's') {
    state.second = state.second > 0 ? state.second - 1 : 59
  }
}


watchEffect(() => {
  emit('update:modelValue', state.second + ' ' + state.minute + ' ' + state.house)
})
</script>

<style scoped lang="less">
.picker-date {
  height: 100%;
  position: relative;

  .picker-date-confirm {
    position: absolute;
    height: 3.2rem;
    width: calc(100% - 4rem);
    margin: 0 2rem 0 2rem;
    border-top: solid 1px #E4E7ED;
    border-bottom: solid 1px #E4E7ED;
    bottom: calc((100% - 3.2rem) / 2);

  }
}

.select-picker-date {
  display: flex;
  height: 24rem;
  position: relative;

  .hour-list {
    position: absolute;
    top: 3rem;
    width: 33.3%;

    .hour-item {
      height: 3.2rem;
      line-height: 3.2rem;
      text-align: center;
    }

    .active {
      font-weight: 700;
      color: #303133;
    }

    .hour-item-arrowup {
      line-height: 3.2rem;
      text-align: center;
      margin-bottom: 1rem;
      cursor: pointer;
    }

    .hour-item-arrowdown {
      line-height: 3.2rem;
      text-align: center;
      margin-top: 1rem;
      cursor: pointer;
    }
  }
}
</style>
