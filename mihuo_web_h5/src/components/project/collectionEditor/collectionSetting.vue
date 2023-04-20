<template>
  <el-dialog
    v-if="props.modelValue"
    v-model="props.modelValue"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    title="配置条件"
    width="55rem"
    @close="handelClose"
  >
    <el-form
      ref="ruleForms"
      label-width="11rem"
      :model="state.form"
      :rules="rules"
    >
      <el-form-item label="数据来源" prop="source">
        <el-select
          v-model="state.form.source"
          :loading="true"
          filterable
          placeholder="请选择来源"
          @change="handelChange('选择来源')"
        >
          <el-option
            v-for="(item, index) in state.sourceData"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="state.form.source" label="变量" prop="name">
        <el-select
          v-model="state.form.name"
          filterable
          placeholder="请选择变量"
          @change="handelChange('选择变量')"
        >
          <el-option
            v-for="(item, index) in state.varNameList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          state.infoData.paramsList?.length > 0 &&
            state.paramValuesList?.length > 0
        "
        label="参数"
        prop="params"
      >
        <el-cascader
          :key="value"
          v-model="state.form.params"
          :options="state.paramValuesList"
          :props="{ children: 'children', label: 'desc', value: 'value' }"
          @change="handelChange('选择参数')"
        />
      </el-form-item>
      <!-- <el-form-item v-if="state.form.name" label-width="0"> -->
      <!-- <el-form-item label="条件" prop="supportOperator" style="margin-top: 0">
          <el-select
            v-model="state.form.supportOperator"
            filterable
            placeholder="请选择条件符"
            style="width: 15rem"
            @change="handelChange('选择条件符')"
          >
            <el-option
              v-for="(item, index) in state.infoData.supportOperators"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
      <!-- <el-form-item
          prop="dataValue"
          :rules="[
            { required: true, message: '请输入条件值', trigger: 'blur' }
          ]"
          style="margin-top: 0"
          v-if="state.enumsValuesList.length == 0"
        >
          <el-input
            style="width: 22rem; margin-left: 1rem"
            :type="state.infoData.valueType == '数值' ? 'number' : 'text'"
            v-model="state.form.dataValue"
          ></el-input>
        </el-form-item> -->
      <!-- <el-form-item
          v-if="state.enumsValuesList.length > 0"
          prop="dataValue"
          style="margin-top: 0"
          :rules="[
            { required: true, message: '请选择条件值', trigger: 'change' }
          ]"
        >
          <el-select
            v-model="state.form.dataValue"
            filterable
            style="width: 22rem; margin-left: 1rem"
          >
            <el-option
              v-for="(item, index) in state.enumsValuesList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handelConfirm">确定</el-button>
        <el-button @click="handelClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, ref, reactive } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: {
    // 弹框显示控制
    type: Boolean,
    default: false
  },
  expressData: {
    // 条件值
    type: Object,
    default: {}
  },
  isEdit: {
    // 是否编辑
    type: Boolean,
    default: false
  }
})
const emit = defineEmits([
  'update:modelValue',
  'update:expressData',
  'getExpress',
  'close'
])
const ruleForms = ref<any>('')
const state = reactive<T>({
  form: {} as any,
  varNameList: [],
  sourceData: [],
  infoData: {},
  paramValuesList: [],
  enumsValuesList: []
})
const rules = reactive<any>({
  name: [{ required: true, message: '请选择变量', trigger: 'change' }],
  source: [{ required: true, message: '请选择来源', trigger: 'change' }],
  params: [{ required: true, message: '请选择参数', trigger: 'change' }]
})

// 提交表单的事件
const handelConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      const paramsName: string[] = []
      const paramsValue: string[] = []
      if (state.form.params) {
        state.paramValuesList.forEach((item: any) => {
          if (item.value == state.form.params[0]) {
            paramsName.push(item.desc)
            paramsValue.push(item.value)
            item.children?.forEach((item2: any) => {
              if (item2.value == state.form.params[1]) { paramsName.push(item2.desc) }
              paramsValue.push(item2.value)
            })
          }
        })
      }
      const expressData: any = JSON.parse(JSON.stringify(props.expressData))
      expressData.express = `${state.form.source}_${state.form.name}${
        paramsName.length > 0 ? '(' + paramsValue.toString() + ')' : ''
      }${''}${state.infoData.valueType !== '数值' ? '' : ''}${''}${
        state.infoData.valueType !== '数值' ? '' : ''
      }`
      expressData.expressTranslate = `${state.form.source}_${state.form.name}${
        paramsName.length > 0 ? '(' + paramsName.toString() + ')' : ''
      }${''}${state.infoData.valueType !== '数值' ? '' : ''}${''}${
        state.infoData.valueType !== '数值' ? '' : ''
      }`
      expressData.expressJson = state.form

      console.log(expressData)
      emit('update:expressData', expressData)
      emit('getExpress')
      handelClose()
    }
  })
}

// 取消表单的事件
const handelClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

// change表单事件
const handelChange = (val: string) => {
  switch (val) {
    case '选择来源':
      getNameBySource()
      state.form = {
        source: state.form.source
      }
      state.infoData = {}
      break
    case '选择变量':
      state.form = {
        source: state.form.source,
        name: state.form.name
      }
      state.infoData = {}
      getInfoBySourceAndName()
      getParamValuesList()
      break
    case '选择参数':
      state.form.dataValue = ''
      getValueEnums()
      break
  }
}

// 获取来源
// 线上收款公式设置 只获取收款节点
const getSourceData = () => {
  fetch({
    url: '/order/formula/variable/source/get',
    method: 'get',
    params: {
      onlyQuery: '收款'
    }
  }).then((res) => {
    state.sourceData = res.data || []
  })
}
// 根据来源获取公式变量
const getNameBySource = async () => {
  await fetch({
    url: '/order/formula/variable/name/get',
    method: 'get',
    params: {
      source: state.form.source,
      onlyNumber: true
    }
  }).then((res) => {
    state.varNameList = res.data || []
  })
}
// 根据来源和变量名获取公式变量详情
const getInfoBySourceAndName = async () => {
  await fetch({
    url: '/order/formula/variable/info/get',
    method: 'get',
    params: {
      source: state.form.source,
      name: state.form.name
    }
  }).then((res) => {
    state.infoData = res.data
    if (!res.data.paramsList || res.data.paramsList?.length == 0) {
      state.form.params = res.data.paramsList
      getValueEnums()
    }
  })
}
// 根据来源和变量名获取公式变量参数值列表
const getParamValuesList = async () => {
  await fetch({
    url: '/order/formula/variable/paramValuesList/get',
    method: 'get',
    params: {
      source: state.form.source,
      name: state.form.name
    }
  }).then((res) => {
    console.log(res.data)
    state.paramValuesList = res.data || []
  })
}

// 根据来源和变量名、参数获取公式值枚举
const getValueEnums = async () => {
  await fetch({
    url: '/order/formula/variable/valueEnums/get',
    method: 'get',
    params: {
      source: state.form.source,
      params: state.form.params?.toString(),
      name: state.form.name
    }
  }).then((res) => {
    state.enumsValuesList = res.data || []
  })
}

onMounted(() => {
  if (props.isEdit) {
    console.log(props.expressData)
    state.form = props.expressData.expressJson
    getSourceData() // 获取来源
    getNameBySource() // 根据来源获取公式变量
    getInfoBySourceAndName() // 根据来源和变量名获取公式变量详情
    getParamValuesList() // 根据来源和变量名获取公式变量详情
    getValueEnums() // 根据来源和变量名、参数获取公式值枚举
  } else getSourceData()
})
</script>

<style scoped>
</style>
