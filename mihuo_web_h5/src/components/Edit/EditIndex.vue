<template>
  <section>
    <div class="tab-content">
      <h2>{{ type && list[type]['tit'] }}</h2>
      <div class="tab" v-if="type != 'info'">
        <span
          v-for="(val, key, index) in tabType"
          :key="index"
          @click="tab(key)"
          :class="{ active: val }"
          ><i class="el-icon-s-data"></i> {{ key }}</span
        >
      </div>
    </div>
    <MaterialLayout :data="dataSource" />
    <component
      :is="type && list[type]['component']"
      :data="dataSource"
      @changeTab="tab()"
    ></component>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, markRaw } from 'vue'
import { editItem } from '@/editMiniItem'
import MaterialLayout from '@/components/Edit/MaterialLayout'

export default defineComponent({
  name: 'EditIndex',
  components: { MaterialLayout },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, content) {
    let tabType = reactive({
      1: false,
      2: true,
      3: false
    })
    let dataSource = markRaw(props.data)
    console.log(dataSource)
    let type = ref(props.data.type)
    const list = markRaw(editItem)
    const tab = (key) => {
      for (let i in tabType) {
        if (key == i) {
          tabType[key] = true
          dataSource['tabType'] = key
        } else {
          tabType[i] = false
        }
      }
    }
    return {
      dataSource,
      type,
      list,
      tabType,
      tab
    }
  }
})
</script>

<style scoped lang="less">
section {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
.setStyle {
  background: red;
}

.tab-content {
  padding: 0 15px;

  h2 {
    font-size: 16px;
    color: #333;
  }

  .tab {
    display: flex;
    justify-content: space-around;
    border: 1px solid #ddd;
    border-radius: 6px;

    span {
      width: 33.33%;
      text-align: center;
      font-size: 14px;
      color: #666;
      display: block;
      height: 36px;
      line-height: 36px;
      cursor: pointer;

      &.active {
        color: #fff;
        background: #409eff;
        border-radius: 2px;
      }

      &:nth-of-type(2) {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
      }
    }
  }
}
</style>
