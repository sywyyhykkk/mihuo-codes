<template>
  <div class="template-data">
    <div class="data-left">
      <div
        v-for="(item,index) in data"
        :key="index"
        class="handel-center--button"
        :class="index===dataIndex?'button-checked':''"
        @click="selectDate(item,index)"
      >
        <div>{{ item.name || item.groupName }}</div>
        <el-icon class="el-icon--right">
          <arrow-right />
        </el-icon>
      </div>
    </div>

    <div v-if="data.length>0&&data[dataIndex].nodes" class="data-right">
      <div v-for="(item,index) in nodeList" :key="index">
        <div class="checked-item">
          <el-checkbox
            v-model="item.checked"
            :label="item.name||item.nodeName"
            @change="checkValueChange(item,index)"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, onMounted, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getGroupType } from '_c/project/projectItem/projectDetailNewData'

const props = defineProps({
  modelValue: {
    type: Object,
    default: []
  },
  templateId: {
    type: String,
    default: ''
  },
  checkNodeList: { // 已经选中的节点id
    type: Object,
    default: []
  }, stageData: { // 阶段和节点列表
    type: Object,
    default: []
  },
  editNodeId: { // 编辑时的当前节点id
    type: String || Number,
    default: 0
  }, projectId: { // 项目id
    type: String || Number,
    default: 0
  }, addType: { // 业务类型
    type: String,
    default: ''
  }
})
const emit = defineEmits(['getNodeIds', 'update:modelValue'])
const dataIndex = ref<number>(0)
const data = ref<any>([])
const nodeList = ref<any>([])
const selectData = ref<any>([])
const nodeIds = ref<any>([])

const selectDate = (item: any, index: number) => {
  dataIndex.value = index
  nodeList.value = []
  setTimeout(() => {
    nodeList.value = item.nodes
  }, 300)
}
const checkValueChange = (item: any, index: number) => {
  if (item.checked) {
    selectData.value.push(item)
  } else {
    selectData.value.forEach((res: any, idx: number) => {
      if ((res.id && res.id == item.id) || (res.nodeId && res.nodeId == item.nodeId)) {
        selectData.value.splice(idx, 1)
      }
    })
  }
  nodeIds.value = []
  selectData.value.map((res: any) => {
    if (props.projectId == '0') {
      // sop模板
      nodeIds.value.push(res.id)
    } else {
      // 项目详情
      nodeIds.value.push(res.templateNodeId)
    }
  })
  emit('update:modelValue', selectData.value)
  emit('getNodeIds', nodeIds.value.toString(), selectData.value)
}

watchEffect(() => {
  selectData.value = props.modelValue
  if (props.checkNodeList.length > 0) {
    selectData.value = []
    data.value.forEach((res: any) => {
      res.nodes ? res.nodes.forEach((res2: any) => {
        res2.checked = false
        props.checkNodeList.forEach((res3: any) => {
          if ((res2.id && res2.id == res3) || (res2.nodeId && res2.nodeId == res3)) {
            res2.checked = true
            selectData.value.push(res2)
          }
        })
      }) : ''
    })
    nodeList.value = data.value.length > 0 ? data.value[dataIndex.value].nodes : []
  } else {
    selectData.value = []
    data.value.forEach((res: any) => {
      res.nodes ? res.nodes.forEach((res2: any) => {
        res2.checked = false
      }) : ''
    })
    nodeList.value = data.value.length > 0 ? data.value[dataIndex.value].nodes : []
  }
})

// 获取项目模板列表信息
const getProjectTemplateList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/default`,
    method: 'get'
  }).then((res) => {
    if (res.data) { // 当有模板时
      // 获取项目模板下对应的阶段和节点
      data.value = res.data.stages
    }
  })
}
// 获取项目分组信息
const getProjectDetailData = async () => {
  await fetch({
    url: `/order/bizproject/detail/sop/group`,
    method: 'get',
    params: {
      groupType: 0,
      projectId: props.projectId
    }
  }).then((res: any) => {
    data.value = res.data.groups
  })
}

const getConstructionNodeDataList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/view/${props.templateId}`,
    method: 'get'
    // params: {
    //   businessType: '1004'
    // }
  }).then((res) => {
    if (res.data) {
      data.value = res.data.stages
    }
  })
}
onMounted(() => {
  if (props.templateId) {
    if (props.addType === 'customAdd') {
      // 项目详情
      getProjectDetailData()
    } else {
      // sop模版
      getConstructionNodeDataList()
    }
  } else {
    // 获取项目模板列表信息
    getProjectTemplateList()
    selectData.value = []
  }
})

</script>

<style scoped lang="less">
.template-data {
  display: flex;
  height: 25rem;

  .data-right {
    height: 100%;
    width: 24rem;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #606266;
    overflow-y: auto;

    .checked-item {
      padding: 1rem 0 0 2rem;
    }
  }

  .data-left {
    height: 100%;
    width: 21.7rem;
    border-right: solid 1px #E4E7ED;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #606266;
    overflow-y: auto;

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
      cursor: pointer;

      .el-icon--right {
        width: 1.1rem;
        height: 1.1rem;
      }

    }

  }
}
</style>
