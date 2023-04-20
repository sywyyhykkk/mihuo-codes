<template>
  <div>
    <div class="edion-text">
      <div class="et-handel--input">
        <div class="input-left">
          <div>
            <el-dropdown>
              <el-button
                type="text"
                icon="plus"
                style="color: #67c23a; margin: 0 1rem"
              ></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handelClick('(', 0)"
                    >(</el-dropdown-item
                  >
                  <!--                  <el-dropdown-item @click="handelClick(')',0)">)</el-dropdown-item>-->
                  <!--                  <el-dropdown-item @click="handelClick('且',0)">且</el-dropdown-item>-->
                  <!--                  <el-dropdown-item @click="handelClick('或',0)">或</el-dropdown-item>-->
                  <el-dropdown-item @click="handelClick('添加变量', 0)"
                    >变量</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="text" icon="edit-pen" disabled></el-button>
            <el-button
              type="text"
              disabled
              class="danger"
              icon="delete"
            ></el-button>
          </div>
          <div
            v-for="(item, index) in conditionalData"
            :key="index"
            class="select-data"
          >
            <div v-if="item.express != '0'" class="data-express">
              {{ item.expressTranslate }}
            </div>
            <input
              v-else
              v-model="item.expressTranslate"
              class="data-express input"
              @change="handelChange(item.expressTranslate, index)"
              :placeholder="item.express == '0' ? '请输入值' : '请选择值'"
            />
            <div style="width: 10rem">
              <el-dropdown>
                <el-button
                  type="text"
                  icon="plus"
                  style="color: #67c23a; margin: 0 1rem"
                ></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handelClick('(', index + 1)"
                      >(</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick(')', index + 1)"
                      >)</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick('+', index + 1)"
                      >+</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick('-', index + 1)"
                      >-</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick('*', index + 1)"
                      >*</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick('/', index + 1)"
                      >/</el-dropdown-item
                    >
                    <el-dropdown-item @click="handelClick('0', index + 1)"
                      >输入</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="handelClick('添加变量', index + 1)"
                      >变量</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button
                type="text"
                icon="edit-pen"
                :disabled="Object.keys(item.expressJson || {}).length == 0"
                @click="handelClick('编辑条件', index)"
              ></el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="handelClick('删除条件', index)"
              ></el-button>
            </div>
          </div>
        </div>
        <!--        //右边预览模板-->
        <div class="input-right">
          <span
            v-for="(item, index) in conditionalData"
            :key="index"
            class="select-text"
          >
            {{ item.expressTranslate }}
          </span>
        </div>
      </div>
    </div>

    <!--    //条件设置-->
    <collectionSetting
      v-if="showSetting"
      :is-Edit="isEdit"
      v-model="showSetting"
      v-model:expressData="conditionalData[dataIdx]"
      @close="getClose"
      @getExpress="getExpress"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object,
    default: {}
  },
  type: {
    //表达式类型：开始条件：type=start 结束条件：type=end 启用条件：type=enable
    type: String,
    default: 'enablel'
  }
})
const emit = defineEmits(['update:modelValue'])
const conditionalData = ref<any[]>([])
const dataIdx = ref<number>(0)
const showSetting = ref<boolean>(false)
const isEdit = ref<boolean>(false)

//页面的事件
const handelClick = (val: string, idx: number) => {
  switch (val) {
    case '添加变量':
      settingExpressItem(idx)
      showSetting.value = true
      isEdit.value = false
      break
    case '编辑条件':
      dataIdx.value = idx
      showSetting.value = true
      isEdit.value = true
      break
    case '删除条件':
      conditionalData.value.splice(idx, 1)
      getExpress()
      break
    case '(':
      settingExpressItem(idx, '(')
      getExpress()
      break
    case ')':
      settingExpressItem(idx, ')')
      getExpress()
      break
    case '+':
      settingExpressItem(idx, ' + ')
      getExpress()
      break
    case '-':
      settingExpressItem(idx, ' - ')
      getExpress()
      break
    case '*':
      settingExpressItem(idx, ' * ')
      getExpress()
      break
    case '/':
      settingExpressItem(idx, ' / ')
      getExpress()
      break
    case '0':
      settingExpressItem(idx, '0')
      getExpress()
      break
  }
}
const handelChange = (val: string, idx: number) => {
  conditionalData.value.splice(conditionalData.value.length - 1, 1)
  settingExpressItem(idx, val)
  getExpress()
}

//添加条件项事件
const settingExpressItem = (idx: number, val?: string) => {
  if (
    idx > 0 &&
    !conditionalData.value[idx - 1].express &&
    !conditionalData.value[idx - 1].expressTranslate
  ) {
    dataIdx.value = idx - 1
    conditionalData.value.splice(dataIdx.value, 1, {
      express: val || '',
      expressTranslate: val || '',
      expressJson: {}
    })
  } else {
    dataIdx.value = idx
    conditionalData.value.splice(dataIdx.value, 0, {
      express: val || '',
      expressTranslate: val || '',
      expressJson: {}
    })
  }
  console.log(conditionalData)
}

//取消条件item设置
const getClose = () => {
  if (
    !conditionalData.value[dataIdx.value].express &&
    !conditionalData.value[dataIdx.value].expressTranslate
  ) {
    conditionalData.value.splice(dataIdx.value, 1)
  }
}
//条件item设置
const getExpress = () => {
  let express = ''
  let expressTranslate = ''
  conditionalData.value.forEach((item: any) => {
    express = express.concat(item.express || '')
    expressTranslate = expressTranslate.concat(item.expressTranslate)
  })
  props.modelValue.express = express || ''
  props.modelValue.expressTranslate = expressTranslate
  props.modelValue.expressJson = JSON.stringify(conditionalData.value)
  console.log(props.modelValue)
  emit('update:modelValue', props.modelValue)
}

//根据节点id获取启用条件信息
const getByNodeData = async () => {
  await fetch({
    url: '/order/sopnodeexpressconfig/getByNodeId',
    method: 'get',
    showErrorMessage: false,
    params: {
      nodeId: props.modelValue.templateNodeId,
      type: props.type
    }
  }).then((res: any) => {
    if (res.data) {
      emit('update:modelValue', res.data)
      if (res.data.expressJson) {
        conditionalData.value = JSON.parse(res.data.expressJson)
      }
    }
  })
}

onMounted(() => {
  if (props.modelValue.templateNodeId) {
    getByNodeData()
  }
})
</script>

<style scoped lang="less">
.edion-text {
  width: 102rem;
  height: 50rem;
  border: 0.1rem solid #eeeeee;
  border-radius: 0.4rem;
  margin: 2.2rem 0 2.2rem 2rem;

  .et-handel--title {
    height: 8rem;
    background: #f4f4f4;
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    line-height: 5rem;
    align-items: center;

    .el-handel--button {
      line-height: 3.2rem;
      height: 3.2rem;
      border-radius: 0.4rem;
      text-align: center;
      width: 4rem;
      font-weight: bold;
      border: 0.1rem solid #e6e6e6;
      font-size: 1.8rem;
      background: #ffffff;

      &:hover {
        border: 0.1rem solid @mainColor;
        color: @mainColor;
      }
    }
  }

  .et-handel--input {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
    display: flex;

    .input-left {
      width: 50%;
      height: 100%;
      border-right: 1px solid #e6e6e6;
      overflow-y: auto;
    }

    .input-right {
      width: calc(50% - 32px);
      height: 100%;
      padding: 0 1rem;
      overflow-y: auto;
    }
    .select-text {
      font-size: 1.2rem;
      line-height: 3rem;
      justify-content: space-between;
      align-items: center;
      .data-express {
        width: calc(100% - 12rem);
        overflow: hidden; // 超出部分隐藏
        word-break: keep-all; // 换行模式：只在半角空格或连字符处换行
        white-space: nowrap; // 不换行（除遇到 <br> 标签外）
        text-overflow: ellipsis; // 文本超出省略（三个点）
      }
    }
    .data-express.input {
      border: none;
      width: 50%;
      font-size: 1.2rem;
      line-height: 3rem;
      outline: none;
      color: var(--el-text-color-regular);
      &:focus {
        border: none;
      }
    }

    .select-data {
      font-size: 1.2rem;
      line-height: 3rem;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      .data-express {
        width: calc(100% - 12rem);
        overflow: hidden; // 超出部分隐藏
        word-break: keep-all; // 换行模式：只在半角空格或连字符处换行
        white-space: nowrap; // 不换行（除遇到 <br> 标签外）
        text-overflow: ellipsis; // 文本超出省略（三个点）
      }
    }
  }
}
</style>
