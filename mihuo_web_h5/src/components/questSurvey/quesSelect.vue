<template>
  <el-dropdown
    :hide-on-click="false"
    trigger="click"
    placement="bottom-start"
    @visible-change="visibleChange"
  >
    <!--    <slot name="header"></slot>-->
    <el-input
      v-model="radio"
      placeholder="请选择"
      readonly
      :suffix-icon="suffixIcon"
    />
    <template #dropdown>
      <div v-if="questionType.length" class="quest-dropdown-item">
        <ul>
          <li
            v-for="(item,index) in questionType"
            :key="index"
            :class="item.id == surveyTypeId?'li-current':''"
            @click="nodeClickType(item)"
          >
            <span>{{ item.typeName }}</span>
            <el-icon>
              <arrow-right />
            </el-icon>
          </li>
        </ul>
        <div>
          <el-radio-group v-model="radio" class="radio-group">
            <el-radio
              v-for="(item,index) in questionChild"
              :key="index"
              :label="item.surveyName"
              @change="checkChange(item)"
            >
              {{ item.surveyName }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-else class="quest-dropdown-item">
        <span class="quest-dropdown-item_empyt">暂无数据</span>
      </div>
    </template>
  </el-dropdown>
</template>

<script lang='ts' setup>
import { inject, nextTick, ref, defineProps, watch, defineEmits } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
    }
  }
})
const emit = defineEmits(['visible', 'change', 'update:modelValue'])
const questionType: any = ref([])
const questionChild: any = ref([])
const radio: any = ref()
const surveyTypeId: any = ref()
const suffixIcon = ref(ArrowDown)

const nodeClickType = (node: any) => {
  surveyTypeId.value = node.id
  getTemplateChild(node.id)
}

const checkChange = (node: any) => {
  emit('update:modelValue', node.id)
  emit('change', {
    quesId: node.id,
    quesName: node.surveyName
  })
}
// 获取模板类型
const getTemplateDate = async () => {
  const enableFlagQus: any[] = []
  await fetch({
    url: '/basic/surveytype/list',
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      res.data.map((item: any) => {
        if (item.enableFlag == '1') {
          enableFlagQus.push(item)
        }
      })
      questionType.value = enableFlagQus
      if (surveyTypeId.value) {
        getTemplateChild(surveyTypeId.value)
      }
    }
  })
}

// 获取获取模板子节点
const getTemplateChild = async (id: any) => {
  const enableFlagQus: any[] = []
  await fetch({
    url: '/basic/surveytemplate/page',
    method: 'get',
    params: {
      size: 9999,
      current: 1,
      surveyTypeId: id,
      templateName: ''
    }
  }).then((res: any) => {
    if (res.code == 0) {
      res.data.records.map((item: any) => {
        if (item.enableFlag == '1') {
          enableFlagQus.push(item)
        }
      })
      questionChild.value = enableFlagQus
    }
  })
}

const getTemplateChildAll = async () => {
  await fetch({
    url: '/basic/surveytemplate/page',
    method: 'get',
    params: {
      size: 9999,
      current: 1,
      surveyTypeId: '',
      templateName: ''
    }
  }).then((res: any) => {
    if (res.code == 0) {
      if (props.modelValue) {
        res.data.records.some((item: any) => {
          if (item.id == props.modelValue) {
            surveyTypeId.value = item.surveyTypeId
            radio.value = item.surveyName
          }
        })
      }
      getTemplateDate()
    }
  })
}

const visibleChange = (visible: any) => {
  emit('visible', visible)
}

watch(() => props.modelValue, (news) => {
  getTemplateChildAll()
}, { deep: true, immediate: true })

</script>

<style scoped lang="less">
.quest-dropdown {
  // height: 20rem;
}

.quest-dropdown-item {
  height: 25rem;
  display: flex;
  justify-content: space-between;

  .quest-dropdown-item_empyt {
    display: block;
    height: 10rem;
    line-height: 10rem;
    text-align: center;
    width: 20rem;
    color: #C0C4CC;
  }

  ul {
    height: calc(100% - 2rem);
    overflow-y: auto;
    min-width: 20rem;
    padding: 1rem 0 1rem 1rem;
    border-right: solid 1px #E4E7ED;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding: 1rem;
      padding: .6rem;
      font-size: 14px;
      color: #606266;

      &:hover {
        background: #F5F7FA;
      }

      // &:first-child{
      //     padding: .4rem .5rem;
      // }
      cursor: pointer;

      .el-icon {
        margin-left: 1rem;
      }
    }
  }

  & > div {
    width: 22rem;
    height: calc(100% - 2rem);
    overflow-y: auto;
    padding: 1rem;

    .radio-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      //justify-content: space-between;

      .el-radio {
        width: 100%;
        display: flex;
        margin-right: 0;
        //justify-content: space-between;

      }
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
  min-width: 15rem
}

.li-current {
  color: #0969DA !important;
  //background-color: #ECF5FF !important;
}
</style>
