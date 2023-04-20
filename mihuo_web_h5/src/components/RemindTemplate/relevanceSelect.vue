<template>
  <el-select placeholder="请选择关联功能" ref="elSelects" v-model="businessName" @change="handleNodeClick">
    <!--    <el-option-->
    <!--      v-if="props.pageType=='1001'"-->
    <!--      v-for="(item, index) in selectTypeList"-->
    <!--      :key="index"-->
    <!--      :label="item.name"-->
    <!--      :value="item.code"-->
    <!--    />-->
    <template #empty>
      <div class="select-empty">
        <el-tree :data="selectTypeList" :props="props.pageType!='1001'?{
  children: 'items',
  label: 'name'
}:{
  children: 'nodes',
  label: 'name'
}" @node-click="handleNodeClick" />
      </div>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits, onMounted, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    type: Object || String || Number,
    default: {}
  },
  pageType: {
    type: String,
    default: ''
  },
  businessName: {
    type: String,
    default: ''
  },
  businessCode: {
    type: String,
    default: ''
  }
})
const defaultProps = {
  children: 'items',
  label: 'name'
}
const emit = defineEmits(['getBusinessName', 'update:businessCode', 'update:modelValue'])
const businessName = ref<any>('')
const businessCode = ref<any>('')
const elSelects = ref<any>('')
const selectTypeList = ref<any>([])

const handleNodeClick = (row: any) => {
  console.log(row)
  //功能规则提醒
  if (row.code) {
    businessName.value = row.groupName + '/' + row.name
    businessCode.value = row.code
    emit('getBusinessName', row.groupName + '/' + row.name)
    emit('update:modelValue', businessCode.value)
    emit('update:businessCode', businessCode.value)
    elSelects.value.blur()
  }
  //节点提醒
  if (props.pageType == '1001' && row.businessType) {
    businessName.value = row.name
    businessCode.value = row.id
    emit('getBusinessName', row.name)
    emit('update:modelValue', businessCode.value)
    emit('update:businessCode', row.businessType)
    elSelects.value.blur()
    // selectTypeList.value.forEach((res: any) => {
    //   if (res.code == row) {
    //     businessName.value = res.name
    //     emit('getBusinessName', res.name)
    //     emit('update:modelValue', res.code)
    //   }
    // })
  }
}


const getByTypeData = async () => {
  await fetch({
    url: `/order/remindtemplate/getByType/${props.pageType}`,
    method: 'get'
  }).then((res) => {
    if (res) {
      selectTypeList.value = res.data

      if (props.pageType == '1002') {
        selectTypeList.value.forEach((res2: any) => {
          if (res2.groupName) {
            res2.name = res2.groupName
          }
        })
      }

    }
  })
}
const getTemplateData = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/default`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      selectTypeList.value = res.data.stages
      if (props.modelValue) {
        selectTypeList.value.forEach((item: any) => {
          item.nodes.forEach((item2: any) => {
            if (item2.id == props.modelValue) {
              emit('update:businessCode', item2.businessType)
            }
          })
        })

      }
    }
  })
}
watchEffect(() => {
  businessCode.value = props.modelValue
  businessName.value = props.businessName
})
onMounted(() => {
  if (props.pageType != '1001') {
    emit('update:businessCode', props.modelValue)
    getByTypeData()
  } else {
    getTemplateData()
  }
})

</script>

<style scoped lang="less">
.select-empty {
  height: 20rem;
  padding: 2rem;
  overflow-y: auto;

}
</style>
