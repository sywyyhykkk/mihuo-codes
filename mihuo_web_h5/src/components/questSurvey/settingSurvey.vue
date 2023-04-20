<template>
  <div class="el-card-form">
    <div
      class="el-card-formLeft"
      :style="!props.pageType ? '' : 'height:calc(100vh - 20rem)'"
    >
      <div class="survey-title">问卷大纲</div>
      <el-button
        class="part-add"
        icon="plus"
        @click="handelChangeButton('新增段落')"
      >
        新增段落
      </el-button>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="{
          children: 'surveyTemplateQuesDTOList'
        }"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        @filter-node-method="filterNodeMethod"
      >
        <template #default="{ node, data }">
          <div v-if="data.status != 'DEL'" class="custom-tree-node">
            <span v-if="data.partName" class="node-name">{{
              data.partName || data.quesName
            }}</span>
            <div v-if="data.quesName" class="node-quesName">
              <span style="color: #909399">{{ data.quesIndex }}</span>
              <span>&nbsp;{{ data.quesName }}</span>
            </div>

            <el-tooltip v-if="data.quesName" placement="bottom">
              <template #content>复制并新增</template>
              <el-icon
                class="copy-hover"
                color="#67C23A"
                size="1.2rem"
                @click.stop="handelChangeButton('复制并新增', data)"
              >
                <copy-document />
              </el-icon>
            </el-tooltip>

            <el-dropdown v-if="data.partName">
              <el-icon color="#0969DA" size="1.4rem">
                <circle-plus-filled />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click.stop="
                      handelChangeButton('新增单选标题', data, data.index)
                    "
                    >单选</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.stop="
                      handelChangeButton('新增多选标题', data, data.index)
                    "
                    >多选</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.stop="
                      handelChangeButton('新增文本标题', data, data.index)
                    "
                    >文本</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.stop="
                      handelChangeButton('新增文件标题', data, data.index)
                    "
                    >文件</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="el-card-formRight">
      <div class="option-data">
        <el-form
          ref="ruleForms"
          :model="state.form"
          :rules="rules"
          :scroll-to-error="true"
          label-width="12rem"
        >
          <el-empty
            v-if="state.form.partList.length == 0"
            style="margin-top: 4rem"
            :image-size="218"
            description="暂无数据~"
            :image="require('@/assets/img/empty/no_data.png')"
          />
          <div v-for="(item, index) in state.form.partList" :key="index">
            <div v-if="item.status !== 'DEL'" class="part-data">
              <div :id="item.anchorCode" class="part-item">
                <el-form-item
                  label="段落名称"
                  :rules="rules.partName"
                  :prop="`partList.${index}.partName`"
                >
                  <el-input
                    v-model="item.partName"
                    autocomplete="off"
                    placeholder=""
                    @change="item.id ? (item.status = 'EDIT') : ''"
                  />
                  <div style="flex: 1; text-align: right">
                    <el-button
                      type="text"
                      icon="top"
                      :disabled="index == 0"
                      @click="
                        handelChangeButton(
                          '上移段落',
                          state.form.partList,
                          index
                        )
                      "
                    >
                      上移
                    </el-button>
                    <el-button
                      type="text"
                      icon="bottom"
                      :disabled="index == state.form.partList.length - 1"
                      @click="
                        handelChangeButton(
                          '下移段落',
                          state.form.partList,
                          index
                        )
                      "
                    >
                      下移
                    </el-button>
                    <el-button
                      icon="delete"
                      type="text"
                      class="danger"
                      @click="
                        handelChangeButton(
                          '删除段落',
                          state.form.partList,
                          index
                        )
                      "
                    >
                      删除
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="段落描述" prop="partDesc">
                  <el-input
                    v-model="item.partDesc"
                    style="width: 100%"
                    @change="item.id ? (item.status = 'EDIT') : ''"
                  />
                </el-form-item>
              </div>
              <div
                v-for="(item2, index2) in item.surveyTemplateQuesDTOList"
                :key="index2"
              >
                <div
                  v-if="item2.status !== 'DEL'"
                  class="title-item"
                  :style="index2 == 0 ? 'border:none;' : ''"
                >
                  <div :id="item2.anchorCode" class="title-row">
                    <span class="row-index">{{ item2.quesIndex }}</span>
                    <el-form-item
                      label="标题"
                      :rules="rules.quesName"
                      :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.quesName`"
                    >
                      <el-input
                        v-model="item2.quesName"
                        @change="item2.id ? (item2.status = 'EDIT') : ''"
                      />
                      <el-button
                        type="text"
                        icon="top"
                        :disabled="index2 == 0"
                        @click="
                          handelChangeButton(
                            '上移标题',
                            item.surveyTemplateQuesDTOList,
                            index,
                            index2
                          )
                        "
                      />
                      <el-button
                        type="text"
                        icon="bottom"
                        :disabled="
                          index2 == item.surveyTemplateQuesDTOList.length - 1
                        "
                        @click="
                          handelChangeButton(
                            '下移标题',
                            item.surveyTemplateQuesDTOList,
                            index,
                            index2
                          )
                        "
                      />
                      <el-button
                        icon="delete"
                        type="text"
                        class="danger"
                        @click="
                          handelChangeButton(
                            '删除标题',
                            item.surveyTemplateQuesDTOList,
                            index,
                            index2
                          )
                        "
                      />
                    </el-form-item>
                  </div>
                  <el-form-item
                    label="题目描述"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.quesDesc`"
                  >
                    <el-input
                      v-model="item2.quesDesc"
                      :autosize="{ minRows: 2 }"
                      type="textarea"
                      placeholder="请输入题目描述"
                      @change="item2.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    label="题目描述(C端)"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.quesNote`"
                  >
                    <el-input
                      v-model="item2.quesNote"
                      :autosize="{ minRows: 2 }"
                      type="textarea"
                      placeholder="请输入题目描述"
                      @change="item2.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    label="是否必填"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.requiredFlag`"
                  >
                    <el-switch
                      v-model="item2.requiredFlag"
                      active-value="1"
                      inactive-value="0"
                      @change="item.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item2.quesType !== '3'"
                    label="是否允许补充说明"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.allowAddDescFlag`"
                  >
                    <el-switch
                      v-model="item2.allowAddDescFlag"
                      active-value="1"
                      inactive-value="0"
                      @change="item.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="item2.quesType !== '4'"
                    label="是否允许上传文件"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.allowUploadFileFlag`"
                  >
                    <el-switch
                      v-model="item2.allowUploadFileFlag"
                      active-value="1"
                      inactive-value="0"
                      @change="item.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    label="是否允许暂不确认"
                    label-width="14rem"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.allowTempUnConfirmFlag`"
                  >
                    <el-switch
                      v-model="item2.allowTempUnConfirmFlag"
                      active-value="1"
                      inactive-value="0"
                      @change="item.id ? (item2.status = 'EDIT') : ''"
                    />
                  </el-form-item>
                  <el-form-item
                    label-width="14rem"
                    label="答案类型"
                    :rules="rules.quesType"
                    :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.quesType`"
                  >
                    <el-select
                      v-model="item2.quesType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      style="width: 19rem"
                      @change="changeQuesType(item2, index, index2)"
                    >
                      <el-option
                        v-for="(ev, nums) in state.answerTypeList"
                        :key="nums"
                        :label="ev.label"
                        :value="ev.value"
                      />
                    </el-select>
                  </el-form-item>
                  <div
                    v-for="(item3, index3) in filterData(
                      item2.surveyTemplateOptionDTOList
                    )"
                    :key="index3"
                  >
                    <el-form-item
                      label-width="14rem"
                      :label="`选项${index3 + 1}`"
                      :rules="rules.optionName"
                      :prop="`partList.${index}.surveyTemplateQuesDTOList.${index2}.surveyTemplateOptionDTOList.${index3}.optionName`"
                    >
                      <div>
                        <el-input
                          v-model="item3.optionName"
                          style="width: 19rem"
                          @change="item3.id ? (item3.status = 'EDIT') : ''"
                        />
                        <el-button
                          type="text"
                          icon="top"
                          :disabled="index3 == 0"
                          @click="
                            handelChangeButton(
                              '上移选项',
                              item2.surveyTemplateOptionDTOList,
                              index,
                              index2,
                              index3
                            )
                          "
                        />
                        <el-button
                          type="text"
                          icon="bottom"
                          :disabled="
                            index3 ==
                            filterData(item2.surveyTemplateOptionDTOList)
                              .length -
                              1
                          "
                          @click="
                            handelChangeButton(
                              '下移选项',
                              item2.surveyTemplateOptionDTOList,
                              index,
                              index2,
                              index3
                            )
                          "
                        />
                        <el-button
                          icon="delete"
                          type="text"
                          class="danger"
                          @click="
                            handelChangeButton(
                              '删除选项',
                              filterData(item2.surveyTemplateOptionDTOList),
                              index,
                              index2,
                              index3
                            )
                          "
                        />
                        <el-button
                          icon="FolderChecked"
                          type="text"
                          :class="item3.defaultFlag == '1' ? 'confirm' : 'info'"
                          @click="
                            handelChangeButton(
                              '设为默认',
                              item2.surveyTemplateOptionDTOList,
                              index,
                              index2,
                              index3,
                              item2.quesType
                            )
                          "
                        >
                          设为默认
                        </el-button>
                        <span style="margin-left: 1rem">
                          是否允许补充说明
                        </span>
                        <el-switch
                          v-model="item3.allowAddDescFlag"
                          active-value="1"
                          inactive-value="0"
                          @change="item3.id ? (item3.status = 'EDIT') : ''"
                        />
                        <span style="margin-left: 1rem">
                          是否允许上传文件
                        </span>
                        <el-switch
                          v-model="item3.allowUploadFileFlag"
                          active-value="1"
                          inactive-value="0"
                          @change="item3.id ? (item3.status = 'EDIT') : ''"
                        />
                      </div>
                    </el-form-item>
                  </div>
                  <el-form-item
                    v-if="item2.quesType == '1' || item2.quesType == '2'"
                    label-width="14rem"
                  >
                    <el-button
                      type="text"
                      icon="plus"
                      style="margin-top: -1rem"
                      @click="
                        handelChangeButton(
                          '添加选项',
                          item2.surveyTemplateOptionDTOList,
                          index,
                          index2
                        )
                      "
                    >
                      添加选项
                    </el-button>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="button-footer">
        <el-button
          style="background: #f2aa3d; color: #fff; margin-right: 1rem"
          @click="handelfooter('预览')"
        >
          预览
        </el-button>
        <el-button
          type="primary"
          style="margin-right: 1rem"
          :loading="loading"
          @click="handelfooter('保存')"
        >
          保存
        </el-button>
        <el-button v-if="!props.pageType" @click="handelfooter('取消')">
          取消
        </el-button>
      </div>
    </div>
    <!--    预览问卷信息-->
    <surveyPreview
      v-model="surveyPreviewShow"
      :survey-id="props.surveyId"
      :survey-name="state.surveyName"
      :data="state.form.partList"
    />

    <el-dialog
      v-if="copyShow"
      v-model="copyShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="复制并新增"
    >
      <el-form label-width="9rem">
        <el-form-item label="复制到" prop="">
          <el-select v-model="state.copyIndex" placeholder="请选择段落">
            <div v-for="(item, index) in state.form.partList" :key="item.index">
              <el-option
                v-if="item.status != 'DEL'"
                :label="item.partName"
                :value="index"
              />
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="copyConfirmData">确 定</el-button>
          <el-button @click="copyShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getTemplateDetailsById,
  updateTemplateDetails
} from '_@/api/basicConfig'
import {
  defineEmits,
  defineProps,
  reactive,
  watchEffect,
  ref,
  computed
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepClone } from '@/utils/utils'
import LockManager from '@/utils/Lock'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  surveyId: {
    type: String || Number,
    default: '0'
  },
  pageType: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const ruleForms = ref<any>('')
const copyShow = ref<boolean>(false) // 复制并新增
const surveyPreviewShow = ref<boolean>(false) // 预览
const loading = ref<boolean>(false)
const state = reactive<any>({
  tempQuestItem: {} as any,
  copyIndex: 0,
  copyData: {} as any,
  version: 0, // 问卷版本号
  answerTypeList: [
    { label: '单选', value: '1' },
    { label: '多选', value: '2' },
    { label: '文本', value: '3' },
    { label: '文件', value: '4' }
  ],
  form: {
    surveyName: '',
    partList: [
      {
        id: '', // 段落id
        surveyId: '', // 问卷id
        partDesc: '',
        partName: '',
        status: 'ADD', // ADD,DEL,EDIT,UN_CHANGE
        surveyTemplateQuesDTOList: [
          {
            id: '', // 问题id
            partId: '', // 段落id
            quesDesc: '',
            quesName: '',
            quesSort: 0,
            quesType: '', // 1 单选 2多选 3填空 4文件
            requiredFlag: '1', // 是否必填，
            status: 'ADD',
            surveyTemplateOptionDTOList: [
              {
                id: '', // 选项id
                optionName: '',
                optionSort: 0,
                status: 'ADD'
              }
            ] as any
          }
        ] as any
      }
    ] as any
  }
})

const treeData = computed(() => {
  const initData: any = deepClone(state.form.partList)
  const list: any = state.form.partList
  list.forEach((res: any, index: number) => {
    if (res.status == 'DEL') {
      list.splice(index, 1)
    } else {
      res.surveyTemplateQuesDTOList.forEach((res2: any, index2: number) => {
        if (res2.status == 'DEL') {
          res.surveyTemplateQuesDTOList.splice(index2, 1)
        }
      })
    }
  })
  state.form.partList = initData
  return list
})

const filterNodeMethod = (value: any, data: any, node: any) => {
  if (data.status == 'DEL') {
    return false
  }
}
const checkoutType = (rule: any, value: any, callback: any) => {
  // 判断值不能全为空格
  if (value && value.trim() === '') {
    callback(new Error('请输入选项'))
  }
  if (value.length === 0) {
    callback(new Error('请输入选项'))
  } else {
    if (rule.fullField) {
      const list: any = rule.fullField.split('.')
      const surveyTemplateOptionDTOList =
        state.form.partList[list[1]].surveyTemplateQuesDTOList[list[3]]
          .surveyTemplateOptionDTOList
      let legth = 0
      surveyTemplateOptionDTOList.some((res: any, index: any) => {
        legth++
        if (
          index != list[5] &&
          value === res.optionName &&
          res.status != 'DEL'
        ) {
          callback(new Error('选项值重复'))
          return
        } else if (legth == surveyTemplateOptionDTOList.length) {
          callback()
        }
      })
    } else {
      callback()
    }
  }
}

const rules = reactive({
  partName: [{ required: true, message: '请输入段落名称', trigger: 'blur' }],
  quesName: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
  quesType: [{ required: true, message: '请选择题目类型', trigger: 'blur' }],
  quesDesc: [{ required: true, message: '请输入题目描述', trigger: 'blur' }],
  optionName: [{ required: true, validator: checkoutType, trigger: 'blur' }]
})
// 判断其能不能删除标题
const getDeleteStatus = (data: any) => {
  let val: any = 0
  data.forEach((res: any) => {
    if (res.status == 'DEL') {
      val++
    }
  })
  if (val == data.length || data.length <= 1) {
    return false
  } else {
    return true
  }
}

//
const handelChangeButton = (
  val: any,
  item: any,
  partIndex: number,
  quesIndex: number,
  optionIndex: number,
  quesType?: string | number
) => {
  switch (val) {
    case '新增段落':
      state.form.partList.push({
        surveyId: props.surveyId, // 问卷id
        partDesc: '',
        partName: '新建段落',
        status: 'ADD', // ADD,DEL,EDIT,UN_CHANGE
        surveyTemplateQuesDTOList: [
          {
            id: '', // 问题id
            partId: '', // 段落id
            quesDesc: '',
            quesName: '新建题目',
            quesSort: 0,
            quesType: '', // 1 单选 2多选 3填空 4文件
            requiredFlag: '1', // 是否必填，
            status: 'ADD',
            surveyTemplateOptionDTOList: []
          }
        ]
      })
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '新增单选标题':
      addQues(partIndex, '1')
      break
    case '新增多选标题':
      addQues(partIndex, '2')
      break
    case '新增文本标题':
      addQues(partIndex, '3')
      break
    case '新增文件标题':
      addQues(partIndex, '4')
      break
    case '添加选项':
      item.push({
        id: '', // 选项id
        optionName: '',
        optionSort: 0,
        status: 'ADD'
      })
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '下移段落':
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(downData(item, partIndex)))
      )
      break
    case '上移段落':
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(upData(item, partIndex)))
      )
      break
    case '下移标题':
      item = downData(item, quesIndex)
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '上移标题':
      item = upData(item, quesIndex)
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '下移选项':
      item = downData(item, optionIndex)
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '上移选项':
      item = upData(item, optionIndex)
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '删除段落':
      item[partIndex]['status'] = 'DEL'
      item[partIndex].surveyTemplateQuesDTOList.forEach((item: any) => {
        item.status = 'DEL'
      })
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      break
    case '删除标题':
      item[quesIndex]['status'] = 'DEL'
      item[quesIndex].surveyTemplateOptionDTOList.forEach((item2: any) => {
        if (Number(item2.quesIndex) < Number(quesIndex)) {
          item2.status = 'DEL'
        }
      })
      state.form.partList = JSON.parse(
        JSON.stringify(diffData(state.form.partList))
      )
      console.log(state.form.partList)
      break
    case '删除选项':
      item[optionIndex]['status'] = 'DEL'
      break
    case '设为默认':
      item[optionIndex]['status'] = 'EDIT'
      item.forEach((item: any, index: any) => {
        if (index == optionIndex) {
          item.defaultFlag = item.defaultFlag == '1' ? '0' : '1'
        } else {
          if (quesType == '1') {
            item.defaultFlag = '0'
          }
        }
      })
      break
    case '复制并新增':
      console.log(item)
      copyShow.value = true
      state.copyData = JSON.parse(JSON.stringify(item))
      break
  }
}

// 因为选项下标的显示问题，切换类型的时候过滤选项，只显示status!=='DEL'
const filterData = (data: any) => {
  if (!data.length) return
  const list = data.filter((item: any) => item.status !== 'DEL')
  return list
}

// 复制并新增
const copyConfirmData = () => {
  state.copyData.status = 'ADD'
  state.copyData.id = ''
  state.copyData.surveyTemplateOptionDTOList.forEach((res: any) => {
    res.status = 'ADD'
    res.id = ''
  })
  state.form.partList[state.copyIndex].surveyTemplateQuesDTOList.push(
    state.copyData
  )
  state.form.partList = JSON.parse(
    JSON.stringify(diffData(state.form.partList))
  )
  copyShow.value = false
}

// 数组移动
const swapItems = (arr: any, index1: any, index2: any) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  arr[index1].status = 'EDIT'
  arr[index2].status = 'EDIT'
  return arr
}

// 上移
const upData = (arr: any, index: number) => {
  let newArr: any = []
  if (arr.length > 1 && index !== 0) {
    newArr = swapItems(arr, index, index - 1)
  }
  return newArr
}
// 下移
const downData = (arr: any, index: number) => {
  let newArr: any = []
  if (arr.length > 1 && index !== arr.length - 1) {
    newArr = swapItems(arr, index, index + 1)
  }
  return newArr
}

// 新增题目
const addQues = (partIndex: number, quesType: number | string) => {
  if (quesType == '1' || quesType == '2') {
    state.form.partList[partIndex].surveyTemplateQuesDTOList.push({
      id: '', // 问题id
      partId: '', // 段落id
      quesDesc: '',
      quesName: '新建题目',
      quesSort: 0,
      quesType: quesType, // 1 单选 2多选 3填空 4文件
      requiredFlag: '1', // 是否必填，
      status: 'ADD',
      surveyTemplateOptionDTOList: [
        {
          id: '', // 选项id
          optionName: '',
          optionSort: 0,
          status: 'ADD'
        }
      ]
    })
  } else {
    state.form.partList[partIndex].surveyTemplateQuesDTOList.push({
      id: '', // 问题id
      partId: '', // 段落id
      quesDesc: '',
      quesName: '',
      quesSort: 0,
      quesType: quesType, // 1 单选 2多选 3填空 4文件
      requiredFlag: '1', // 是否必填，
      status: 'ADD',
      surveyTemplateOptionDTOList: []
    })
  }

  state.form.partList = JSON.parse(
    JSON.stringify(diffData(state.form.partList))
  )
  // window.location.hash = `#${anchorCode}`
}

// 选择题目类型事件
const changeQuesType = (
  questItem: any,
  partIndex: number,
  quesIndex: number
) => {
  const tempLength =
    state.form.partList[partIndex].surveyTemplateQuesDTOList[quesIndex]
      .surveyTemplateOptionDTOList?.length
  if (tempLength) {
    ElMessageBox.confirm(
      `切换类型会清空该问题下的所有选项，是否确定操作?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then((res) => {
      changeItem(questItem, partIndex, quesIndex, tempLength)
    })
  } else {
    changeItem(questItem, partIndex, quesIndex, tempLength)
  }
}

const changeItem = (
  questItem: any,
  partIndex: number,
  quesIndex: number,
  tempLength: number
) => {
  questItem.id ? (questItem.status = 'EDIT') : ''
  state.form.partList[partIndex].surveyTemplateQuesDTOList[
    quesIndex
  ].surveyTemplateOptionDTOList.forEach((res: any, index: any) => {
    handelChangeButton(
      '删除选项',
      state.form.partList[partIndex].surveyTemplateQuesDTOList[quesIndex]
        .surveyTemplateOptionDTOList,
      partIndex,
      quesIndex,
      index
    )
  })
  state.form.partList = JSON.parse(JSON.stringify(state.form.partList))
  ruleForms.value.validate()

  if (tempLength) {
    saveSurveyData()
  }
}

// 点击树形节点事件
const handleNodeClick = (val: any) => {
  // 滚动到指定dom的位置
  const dom: any = document.getElementById(`${val.anchorCode}`)
  dom.scrollIntoView(true)
  const sheet: any = dom.sheet
}

// 底部表单预览，保存，取消事件
const handelfooter = (val: any) => {
  switch (val) {
    case '预览':
      surveyPreviewShow.value = true
      break
    case '保存':
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          loading.value = true
          saveSurveyData()
        }
      })
      break
    case '取消':
      LockManager.detory('question' + props.surveyId)
      handelClose()
      break
  }
}

const handelClose = () => {
  emit('update:modelValue', false)
}

// 获取问卷信息
const getSurveyData = () => {
  getTemplateDetailsById({ id: props.surveyId }).then((res) => {
    if (res.data) {
      loading.value = false
      state.surveyName = res.data.surveyName
      state.version = res.data.version
      state.form.partList = diffData(res.data.surveyTemplatePartDTOList)
    }
  })
}

// 比较重要，数据处理
const diffData = (data: any) => {
  const list = data
  list.forEach((res: any, index: number) => {
    res.index = index
    res.anchorCode = `anchor-${index}`
    res.partSort = index + 1
    if (res.surveyTemplateQuesDTOList) {
      const filterArr = res.surveyTemplateQuesDTOList.filter(
        (item: any) => item.status !== 'DEL'
      )
      filterArr.forEach((res2: any, index2: number) => {
        res2.anchorCode = `anchor-${index}-${index2}`
        res2.quesIndex = index2 < 9 ? `0${index2 + 1}` : index2 + 1
        res2.quesSort = index2 + 1
        if (res2.surveyTemplateOptionDTOList) {
          res2.surveyTemplateOptionDTOList.forEach(
            (res3: any, index3: number) => {
              res3.optionSort = index3 + 1
            }
          )
        }
      })
    }
  })
  return list
}

// 保存问卷
const saveSurveyData = () => {
  updateTemplateDetails({
    id: props.surveyId,
    surveyTemplatePartDTOList: state.form.partList,
    version: state.version
  })
    .then((res: any) => {
      if (res.code == 0) {
        ElMessage({
          type: 'success',
          message: `操作成功!`
        })
        getSurveyData()
      }
    })
    .catch((erro: any) => {
      ElMessage.error(erro.msg)
      loading.value = false
      console.log(erro)
    })
}

watchEffect(() => {
  if (props.modelValue) {
    getSurveyData()
  }
})
</script>

<style scoped lang="less">
.title-row {
  display: flex;
  align-items: center;
  margin-bottom: -2rem;

  .row-index {
    margin-left: -2rem;
    width: 6rem;
    text-align: right;
    font-size: 12px;
    font-weight: 400;
    color: #0969da;
  }
}

.part-add {
  height: 46px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  color: #0969da;
  width: 246px;
  margin-left: 2rem;
  margin-bottom: 1.5rem;
}

.survey-title {
  font-size: 14px;
  font-weight: 400;
  color: #303133;
  margin: 2rem;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .copy-hover {
    display: none;
  }

  &:hover {
    .copy-hover {
      display: block;
    }
  }
}

.node-name {
  font-size: 12px;
  font-weight: 400;
  color: #303133;
  max-width: 20rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.node-quesName {
  font-size: 12px;
  font-weight: 400;
  color: #303133;
  max-width: 20rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: -2rem;
}

.button-footer {
  height: 80px;
  background: #f3f4f8;
  position: absolute;
  bottom: -1rem;
  left: 30.6rem;
  right: -2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.option-data {
  //height: calc(100vh - 21rem);
  position: absolute;
  bottom: 9rem;
  right: 0rem;
  left: 34.6rem;
  top: 0;
  overflow-y: auto;
  padding-right: 2rem;
  margin-right: -2rem;
  padding-bottom: 2rem;
  margin-left: -2rem;
}

.part-data {
  background: #fafafa;
  border-radius: 4px;
  margin-top: 4rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;

  .title-item {
    border-top: dashed 1px #e4e7ed;
    margin: -1px 2rem;
  }

  .part-item {
    border-bottom: solid 2px #e4e7ed;
    padding: 0 2rem 0 0;
  }
}
</style>
