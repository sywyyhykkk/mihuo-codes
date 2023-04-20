<template>
  <div class="pdf-container" v-if="props.data.data">
    <h2 id="title" class="main-title">变更报告</h2>
    <div class="header-info flex-center">
      <div>
        <span id="label">地址：</span
        ><span id="address">
          {{ getProjectAddress }}
        </span>
      </div>
      <div>
        <span id="label">报告人：</span><span id="name">[报告姓名]</span>
        <span id="label">报告日期：</span
        ><span id="time">
          {{ props.data.data.updated }}
        </span>
      </div>
    </div>
    <div class="report-info">
      <div class="change-amount flex-center">
        <div class="left">变更总金额(元)</div>
        <div class="right" id="changed-money">
          {{ props.data.data.alterationMoney }}
        </div>
      </div>
      <div class="info-item flex-center">
        <div class="left">变更后延期</div>
        <div class="right" id="is-delay">
          {{
            props.data.data.deferredDay && props.data.data.deferredDay > 0
              ? '是'
              : '否'
          }}
        </div>
      </div>
      <div class="info-item flex-center">
        <div class="left">延期天数(天)</div>
        <div class="right" id="delay-days">
          {{ props.data.data.deferredDay }}
        </div>
      </div>
      <div class="info-item flex-center">
        <div class="left">变更原因</div>
        <div class="right" id="delay-reason">
          {{ props.data.data.alterationReason }}
        </div>
      </div>
    </div>
    <div class="table-info">
      <div class="table-header flex-center" id="table-header">
        <div class="table-header-1"></div>
        <div class="table-header-2">类型</div>
        <div class="table-header-3">说明</div>
        <div class="table-header-4">金额(元)</div>
      </div>
      <div
        id="table-item"
        class="table-item flex-center"
        v-for="(item, index) in props.data.data.customerAlterationList"
        :key="index"
      >
        <div
          id="item-type"
          :class="item.status === 0 ? 'type-increase' : 'type-decrease'"
        >
          {{ item.status === 0 ? '增项' : '减项' }}
        </div>
        <div id="change-type" class="change-type">
          {{ getLabel(item.type) }}
        </div>
        <div id="change-des" class="change-des text-overflow">
          {{ item.alterationReason }}
        </div>
        <div
          id="change-amount"
          :class="item.status === 0 ? 'change-amount-in' : 'change-amount-de'"
        >
          {{ item.alterationMoney }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  dict: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isShowLog: {
    type: Boolean,
    default: false
  }
})

const getProjectAddress = computed(() => {
  const { districtName, latAddress, poiName, address } = props.data.data
  return (
    (districtName || '') +
    (latAddress || '') +
    (poiName || '') +
    (address || '')
  )
})

// 根据value获取label
const getLabel = (value: string) => {
  return props.dict.data.find((item: any) => item.value === '' + value)?.label
}

if (props.isShowLog) {
  console.log('-------------变更报告-------------', props.data.data)
}
</script>

<style scoped>
.report-info {
  width: 100%;
  height: max-content;
  margin-top: 20px;
  border: 1px #a8a8a8 solid;
}

.change-amount {
  width: 100%;
  height: 40px;
  justify-content: space-between;
  background-color: #eab38b;
}

.change-amount > .left,
.right {
  font-weight: 500;
  font-size: 12px;
  padding: 0 10px;
}

.change-amount > .right {
  text-align: right;
}

.info-item {
  width: calc(100% - 20px);
  height: 40px;
  padding: 0 10px;
  border-bottom: 1px #a8a8a8 solid;
}

.report-info > :last-of-type {
  border-bottom: none;
}

.info-item > .left {
  width: 20%;
  font-weight: 500;
  font-size: 12px;
}

.info-item > .left,
.right {
  font-weight: 500;
  font-size: 12px;
}

.table-info {
  width: 100%;
  height: max-content;
  margin-top: 20px;
  border: 1px #a8a8a8 solid;
}

.table-info > .table-header {
  width: 100%;
  height: 40px;
}

.table-header-1 {
  width: 10%;
  height: 40px;
}

.table-header-2 {
  width: 20%;
  height: 40px;
  border-left: 1px #a8a8a8 solid;
  border-right: 1px #a8a8a8 solid;
  color: #a8a8a8;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.table-header-3 {
  width: 40%;
  height: 40px;
  border-right: 1px #a8a8a8 solid;
  color: #a8a8a8;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.table-header-4 {
  width: 30%;
  height: 40px;
  color: #a8a8a8;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.table-info > .table-item {
  width: 100%;
  height: 40px;
  border-top: 1px #a8a8a8 dashed;
}

.table-item > .type-increase {
  width: calc(10% + 2px);
  height: 40px;
  color: red;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.table-item > .type-decrease {
  width: calc(10% + 2px);
  height: 40px;
  color: green;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.table-item > .change-type {
  width: calc(20% + 2px);
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 40px;
  border-left: 1px #a8a8a8 solid;
  border-right: 1px #a8a8a8 solid;
}

.table-item > .change-des {
  width: calc(40% - 14px);
  min-height: 40px;
  height: max-content;
  font-size: 10px;
  color: #706d6d;
  line-height: 40px;
  border-right: 1px #a8a8a8 solid;
  padding: 0 10px;
}

.table-item > .change-amount-in {
  width: 30%;
  height: 40px;
  color: red;
  font-size: 14px;
  line-height: 40px;
  text-align: right;
  background-color: #fceeed;
  border-top: 1px #a8a8a8 dashed;
  padding-right: 4px;
}

.table-item > .change-amount-de {
  width: 30%;
  height: 40px;
  color: green;
  font-size: 14px;
  line-height: 40px;
  text-align: right;
  background-color: #ebf3ec;
  border-top: 1px #a8a8a8 dashed;
  padding-right: 4px;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
