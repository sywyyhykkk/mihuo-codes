<template>
  <div class="pdf-container" v-if="props.data.data">
    <h2 id="inspection-title" class="main-title">巡检报告</h2>
    <div class="header-info flex-center">
      <div>
        <span id="label">地址：</span
        ><span id="address">
          {{ getProjectAddress }}
        </span>
      </div>
      <div>
        <span id="label">报告人： </span
        ><span id="name">
          {{ props.data.data.person.name }}
        </span>
        <span id="label">报告日期：</span
        ><span id="time">
          {{ props.data.data.updated }}
        </span>
      </div>
    </div>
    <div id="inspection-report-title">
      {{ props.data.data.title }}
    </div>
    <div id="inspection-report-des">
      {{ props.data.data.content }}
    </div>
    <div class="inspection-table flex-center">
      <div class="inspection-table-header header-1">序号</div>
      <div class="inspection-table-header header-2">巡检描述</div>
      <div class="inspection-table-header header-3">责任人</div>
    </div>
    <div
      id="inspection-table-contents"
      v-for="(item, index) in props.data.data.customInspectList"
      :key="index"
    >
      <div id="inspection-item" class="flex-center">
        <div class="item-1" id="item-index">
          {{ index + 1 }}
        </div>
        <div class="item-2 text-overflow-hidden" id="item-name">
          {{ item.contents }}
        </div>
        <div class="item-3" id="item-result" v-if="item.personList">
          {{ item.personList[0].name }}
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

if (props.isShowLog) {
  console.log('-------------巡检报告-------------', props.data.data)
}
</script>

<style scoped>
#inspection-report-title {
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  color: rgb(128, 128, 128);
  font-weight: bold;
  margin-top: 20px;
}

.inspection-table-header {
  height: 40px;
  background-color: rgb(222, 131, 68);
  color: white;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
}

#inspection-report-des {
  width: 100%;
  font-size: 12px;
  color: rgb(128, 128, 128);
}

#inspection-table-contents {
  width: calc(100% - 2px);
  border: 1px #a8a8a8 solid;
}

#inspection-table-contents > :last-of-type {
  border-bottom: none;
}

#inspection-table-contents > :nth-of-type(2n) {
  background-color: rgba(241, 241, 241);
}

#inspection-item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  border-bottom: 1px #a8a8a8 dashed;
}
</style>
