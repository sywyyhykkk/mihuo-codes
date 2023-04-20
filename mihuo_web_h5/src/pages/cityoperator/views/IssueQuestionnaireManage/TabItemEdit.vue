

<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElDrawer } from 'element-plus'
import {
  Delete,
  Edit,
  CirclePlus,
  Money,
  CopyDocument
} from '@element-plus/icons-vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DropType } from 'element-plus/es/components/tree/src/tree.type'
import { ref, reactive } from 'vue'
import { fetch } from '../../axios-config/axios'
import { useRoute } from 'vue-router'
import { customAlphabet } from 'nanoid'
import { deepClone } from '@/utils'

const route = useRoute()

const initTreeData = ref<any>({})
const treeData = ref<any[]>([])
const loading = ref(false)
const treeRef = ref()
const currentTreeData = ref()
const defaultTreeKeys = ref<any>(undefined)

const editTopicType = ref<string>()
const showTopicForm = ref(false)
const ruleTopicFormRef = ref()
const topicForm = ref<any>({})
const topicFormRules = reactive({
  title: [{ required: true, message: '请先输入标题内容', trigger: 'blur' }]
})

const showFormulaForm = ref(false)
const formulaOptionForm = ref<any>({})
const directType = ref(1)

const showEstimateForm = ref(false)
const estimateForm = ref<any>({})
const tagList = ref<any[]>()
const showTagListLabel = ref('')
const showTagMask = ref()
const showTagListIndex = ref<number>(0)
const ruleEstimateFormRef = ref()

const dialogCopyVisible = ref(false)
const copyData = ref<any>({})
const topicList = ref<any[]>([])
const copyList = ref<any>([])
const currentCopyInfo = ref<any>({})

const defaultProps = {
  label: 'title',
  children: 'children'
}

type EleDrawer = InstanceType<typeof ElDrawer>
const drawerRef = ref<EleDrawer>()

const getNanoid = () => {
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 4)()
}

const topicTypes = [
  { label: '单选', value: 'Radio' },
  { label: '多选', value: 'Checkbox' },
  { label: '数值', value: 'FillBlank' },
  { label: '文本', value: 'Textarea' },
  { label: '上传', value: 'Upload' }
]

const getTemplate = () => ({
  attribute: { required: true, customFeeRules: [{}] },
  children: [{ id: getNanoid(), title: '', attribute: { referValue: 0 } }],
  id: getNanoid(),
  title: '',
  type: 'Radio'
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await fetch({
      method: 'get',
      url: '/basic/standard/survey/project',
      params: { id: route.query.id }
    })

    if (res.code === 0) {
      initTreeData.value = res.data
      if (!initTreeData.value.survey) {
        initTreeData.value.survey = { children: [{}] }
      } else {
        treeData.value = initTreeData.value.survey?.children
        topicList.value = getTopicList(treeData.value)
      }
      defaultTreeKeys.value = treeData.value[0]
        ? defaultTreeKeys.value ?? [treeData.value[0]['id']]
        : []
      ruleTopicFormRef.value?.resetFields()
      ruleEstimateFormRef.value?.resetFields()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getTopicList = (children: any[]) => {
  let count = 0
  let results = children
  while (results.length !== count) {
    const item = results[count]
    if (item.children?.length) {
      if (item.type) {
        if (item.type === 'Radio' || item.type === 'Checkbox') {
          item.isLeaf = false
          item.children.forEach((v: any) => {
            v.isLeaf = false
          })
        } else {
          item.isLeaf = true
          item.children.forEach((v: any) => {
            v.isLeaf = true
          })
        }
      }
      results = results.concat(item.children)
    }
    count += 1
  }
  return results
}

const getParentData = (node: any, data: any) => {
  if (node.level % 2 === 0) {
    if (node.parent.data.type === 'FillBlank') {
      return false
    } else if (node.parent.data.type === 'Textarea') {
      return false
    } else if (node.parent.data.type === 'Upload') {
      return false
    } else {
      return true
    }
  }
}

const getTopicTypeLabel = (node: any, data: any) => {
  if (data.type && node.level % 2 !== 0) {
    const cur = topicTypes.find((item) => item.value === data.type)
    return `[${cur?.label}]`
  }
}

const changeSelect = () => {
  topicForm.value.children = topicForm.value.children ?? [{}]
}

const addTopicFirst = () => {
  showTopicForm.value = true
  topicForm.value = deepClone(getTemplate())
  const data = {
    id: getNanoid(),
    attribute: {},
    children: [] as any,
    description: '',
    title: '',
    type: 'Survey'
  }
  data.children.push(topicForm.value)
  initTreeData.value.survey = data
}

const addTopic = (node: any, data: any) => {
  editTopicType.value = 'add'
  showTopicForm.value = true
  topicForm.value = deepClone(getTemplate())
  currentTreeData.value = data.children ?? (data.children = [])
  defaultTreeKeys.value = [data['id']]
  getTagList(node, data)
}

const editTopic = (node: any, data: any) => {
  editTopicType.value = 'edit'
  topicForm.value = data
  defaultTreeKeys.value = [data['id']]
  showTopicForm.value = true
  getTagList(node, data)
}

const onSubmit = (formEl?: any) => {
  formEl.validate((valid: any, fields: any) => {
    if (valid) {
      saveNodeEdit()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const saveNodeEdit = async () => {
  if (
    topicForm.value.type === 'FillBlank' ||
    topicForm.value.type === 'Textarea' ||
    topicForm.value.type === 'Upload'
  ) {
    const item = deepClone(getTemplate())
    delete item.children
    topicForm.value.children = [item]
  }
  topicForm.value.children = topicForm.value.children.filter(
    (item: any) => item.title
  )
  if (editTopicType.value === 'add') {
    currentTreeData.value.push(topicForm.value)
  }

  try {
    const res: any = await fetch({
      method: 'post',
      url: '/basic/standard/survey/project/update',
      data: initTreeData.value
    })

    if (res.code === 0) {
      ElMessage.success('编辑成功!')
      showTopicForm.value = false
    } else {
      if (editTopicType.value === 'add') {
        treeRef.value?.remove(topicForm.value)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const onClosedDialog = () => {
  showTagListLabel.value = ''
  if (showEstimateForm.value) showEstimateForm.value = false
  if (showTopicForm.value) showTopicForm.value = false
  loadData()
}

const onAddOption = (type: string) => {
  if (type === 'option') {
    topicForm.value.children.push({
      id: getNanoid(),
      title: '',
      attribute: {}
    })
  } else if (type === 'estimate') {
    estimateForm.value.attribute?.customFeeRules?.push({
      id: getNanoid(),
      name: '',
      maxAmountRule: '',
      minAmountRule: '',
      feeType: 'labor'
    })
  } else if (type === 'formula') {
    const attrs = formulaOptionForm.value.attribute
    ;(attrs.customFeeRules || (attrs.customFeeRules = [])).push({
      id: getNanoid(),
      name: '',
      maxAmountRule: '',
      minAmountRule: '',
      feeType: 'labor'
    })
  }
}

const deleteAddOption = (index: number, type: string) => {
  if (type === 'option') {
    topicForm.value.children.splice(index, 1)
  } else if (type === 'estimate') {
    estimateForm.value.attribute?.customFeeRules?.splice(index, 1)
  } else if (type === 'formula') {
    formulaOptionForm.value.attribute?.customFeeRules?.splice(index, 1)
  }
}

const onEstimate = (data: any, node: any, type: number) => {
  getTagList(node, data)
  defaultTreeKeys.value = [data['id']]
  if (node.level % 2 === 0) {
    directType.value = type
    changeOption(data, type)
  } else {
    showEstimateForm.value = true
    data.attribute = {
      ...data.attribute,
      customFeeRules: data.attribute.customFeeRules ?? [
        {
          id: getNanoid(),
          name: '',
          maxAmountRule: '',
          minAmountRule: '',
          feeType: 'labor'
        }
      ]
    }
    estimateForm.value = data
  }
}

const getTagList = (node: any, data: any) => {
  let childIds: any[] = []
  if ('type' in data) {
    childIds = data.children
      ?.map((item: any) => ({
        id: item.id,
        label: item.title
      }))
      .reverse()
  }

  if (node.level > 1) {
    const pArrIds = node.parent.data.children
      .map((item: any) => {
        if (item.type !== 'Textarea' || item.type === 'Upload') {
          return { id: item.id, label: item.title }
        }
      })
      .filter((v: any) => v)
      .reverse()
    childIds = childIds.concat(pArrIds)
  }
  tagList.value = getParentIdList(node, childIds)
}

const getParentIdList: any = (node: any, results: any[] = []) => {
  if (node.level >= 1) {
    const Ids = results.map((v) => v.id)
    const isType = node.data.type !== 'Upload' || node.data.type !== 'Textarea'
    if (!Ids.includes(node.data.id) && isType) {
      results.push({ id: node.data.id, label: node.data.title })
    }
    return getParentIdList(node.parent, results)
  } else {
    return results.reverse()
  }
}

const onEstimateSubmit = async () => {
  let rules = estimateForm.value.attribute?.customFeeRules
  rules = rules?.filter((item: any) => item.name)
  estimateForm.value.attribute.customFeeRules = rules

  try {
    const res: any = await fetch({
      method: 'post',
      url: '/basic/standard/survey/project/update',
      data: initTreeData.value
    })
    if (res.code === 0) {
      ElMessage.success('预估费用编辑成功!')
      showEstimateForm.value = false
    }
  } catch (error) {
    console.error(error)
  }
  showEstimateForm.value = false
}

const onCloseBoldNode = (node: any, data: any) => {
  ElMessageBox.confirm('确认删除数据？是否继续？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    treeRef.value?.remove(node)
    try {
      const res: any = await fetch({
        method: 'post',
        url: '/basic/standard/survey/project/update',
        data: initTreeData.value
      })
      if (res.code === 0) {
        ElMessage.success('删除成功!')
      }
    } catch (error) {
      console.error(error)
    }
  })
}

const onCopy = (node: any, data: any) => {
  copyData.value = {}
  dialogCopyVisible.value = true
  currentCopyInfo.value = data
  const parent = node.parent.data
  if (data.type) {
    copyList.value = topicList.value.filter(
      (item) => !item.type && item.id !== parent.id && !item.isLeaf
    )
  } else {
    copyList.value = topicList.value.filter(
      (item) =>
        item.type &&
        (item.type === 'Checkbox' || item.type === 'Radio') &&
        item.id !== parent.id
    )
  }
}

const handleSubmitCopy = () => {
  const curObj = topicList.value.find((v) => v.id === copyData.value.region)
  const data = window.structuredClone(currentCopyInfo.value)
  const list = getTopicList(data.children)
  for (const item of list) {
    item.id = getNanoid()
    if (item.type) {
      item.attribute.minAmountRule = ''
      item.attribute.maxAmountRule = ''
      item.attribute.customFeeRules = []
    }
  }
  data.attribute.minAmountRule = ''
  data.attribute.maxAmountRule = ''
  data.attribute.customFeeRules = []
  const results = { ...data, id: getNanoid() }
  ;(curObj.children || (curObj.children = [])).push(results)
  dialogCopyVisible.value = false
  handleDrop()
}

const setFromCharCode = (code: number) => {
  let initCode = 65
  initCode += code
  return String.fromCharCode(initCode)
}

const handleBlur = () => {
  showTagMask.value = setTimeout(() => {
    showTagListLabel.value = ''
  }, 300)
}

const handleFocus = (type: string) => {
  showTagListLabel.value = type
  clearTimeout(showTagMask.value)
}

const handleFocusRule = (type: string, index: number) => {
  showTagListLabel.value = type
  showTagListIndex.value = index
  clearTimeout(showTagMask.value)
}

const changeTagCheck = (tag: string) => {
  if (showTagListLabel.value === 'min') {
    estimateForm.value.attribute.minAmountRule =
      estimateForm.value.attribute.minAmountRule.replaceAll('@', `{${tag}}`)
  } else if (showTagListLabel.value === 'max') {
    estimateForm.value.attribute.maxAmountRule =
      estimateForm.value.attribute.maxAmountRule.replaceAll('@', `{${tag}}`)
  } else if (showTagListLabel.value === 'Fmin') {
    formulaOptionForm.value.attribute.minAmountRule =
      formulaOptionForm.value.attribute.minAmountRule.replaceAll(
        '@',
        `{${tag}}`
      )
  } else if (showTagListLabel.value === 'Fmax') {
    formulaOptionForm.value.attribute.maxAmountRule =
      formulaOptionForm.value.attribute.maxAmountRule.replaceAll(
        '@',
        `{${tag}}`
      )
  }
}

const changeTagCheckRule = (tag: string) => {
  if (!showTagListLabel.value.startsWith('F')) {
    const objT =
      estimateForm.value.attribute.customFeeRules[showTagListIndex.value]
    if (showTagListLabel.value === 'maxRule') {
      objT.maxAmountRule = objT.maxAmountRule.replaceAll('@', `{${tag}}`)
    } else if (showTagListLabel.value === 'minRule') {
      objT.minAmountRule = objT.minAmountRule.replaceAll('@', `{${tag}}`)
    }
  } else {
    const objF =
      formulaOptionForm.value.attribute.customFeeRules[showTagListIndex.value]
    if (showTagListLabel.value === 'FmaxRule') {
      objF.maxAmountRule = objF.maxAmountRule.replaceAll('@', `{${tag}}`)
    } else if (showTagListLabel.value === 'FminRule') {
      objF.minAmountRule = objF.minAmountRule.replaceAll('@', `{${tag}}`)
    }
  }
}

const changeOption = (option: any, type: number) => {
  directType.value = type
  option.attribute = {
    ...option.attribute,
    customFeeRules: option.attribute.customFeeRules ?? [
      {
        id: getNanoid(),
        name: '',
        maxAmountRule: '',
        minAmountRule: '',
        feeType: 'labor'
      }
    ]
  }
  formulaOptionForm.value = option
  showFormulaForm.value = true
}

const onFormulaSubmit = async () => {
  if (directType.value === 1) {
    let rules = formulaOptionForm.value.attribute?.customFeeRules
    rules = rules?.filter((item: any) => item.name)
    formulaOptionForm.value.attribute.customFeeRules = rules
    try {
      const res: any = await fetch({
        method: 'post',
        url: '/basic/standard/survey/project/update',
        data: initTreeData.value
      })
      if (res.code === 0) {
        ElMessage.success('预估费用编辑成功!')
        showFormulaForm.value = false
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    showFormulaForm.value = false
  }
}

const onClosedFormula = () => {
  formulaOptionForm.value = { attribute: {} }
  showFormulaForm.value = false
  if (directType.value === 1) {
    loadData()
  }
}

const handleDrop = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/basic/standard/survey/project/update',
      data: initTreeData.value
    })
    if (res.code === 0) {
      ElMessage.success('更新成功')
    }
  } catch (error) {
    console.error(error)
  }
}

const allowDrag = (draggingNode: Node) => {
  if (draggingNode.level <= 1) return false
  return true
}

const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  const d1 = draggingNode.data // 被拖拽的节点
  const d2 = dropNode.data // 进入的节点
  if ((d1.type && d2.type) || (!d1.type && !d2.type)) {
    return type !== 'inner'
  }
  if ((d1.type && !d2.type) || (!d1.type && d2.type)) {
    if (d2.isLeaf) {
      return false
    } else {
      return true
    }
  }
  return true
}
</script>

<template>
  <div class="questionnaire-edit">
    <el-empty v-if="!treeData.length && !loading" key="result-empty">
      <el-button type="primary" size="large" @click="addTopicFirst">
        添加
      </el-button>
    </el-empty>

    <div v-else key="results-list" class="topic-tree">
      <el-tree
        ref="treeRef"
        v-loading="loading"
        :data="treeData"
        draggable
        node-key="id"
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        :indent="20"
        :props="defaultProps"
        :default-expanded-keys="defaultTreeKeys"
        class="tree-line"
        @node-drop="handleDrop"
      >
        <template #default="{ node, data }">
          <el-tag
            effect="dark"
            size="small"
            :type="node.level % 2 !== 0 ? 'primary' : 'success'"
          >
            {{ data.id.toLocaleUpperCase() }}
          </el-tag>
          <span
            style="margin-right: 2rem"
            :style="{ fontWeight: node.level % 2 !== 0 ? 'bold' : 'initial' }"
          >
            {{ node.label }}
            {{ getTopicTypeLabel(node, data) }}
          </span>
          <el-button
            v-if="getParentData(node, data)"
            key="btn-add"
            type="text"
            :underline="false"
            :icon="CirclePlus"
            @click.stop="addTopic(node, data)"
          />
          <el-button
            v-if="node.level % 2 !== 0"
            key="btn-edit"
            type="text"
            :underline="false"
            :icon="Edit"
            @click.stop="editTopic(node, data)"
          />
          <el-button
            v-if="data.type || node.parent.data.type === 'Radio'"
            type="text"
            :underline="false"
            :icon="Money"
            @click.stop="onEstimate(data, node, 1)"
          />
          <el-button
            type="text"
            :underline="false"
            :icon="CopyDocument"
            @click.stop="onCopy(node, data)"
          />
          <el-button
            type="text"
            :underline="false"
            :icon="Delete"
            @click.stop="onCloseBoldNode(node, data)"
          />
          <div style="width: 1rem" />
          <el-tag v-if="data.attribute?.maxAmountRule" type="info">
            {{ data.attribute?.maxAmountRule }}
          </el-tag>
          <el-tag v-if="data.attribute?.minAmountRule" type="info">
            {{ data.attribute?.minAmountRule }}
          </el-tag>
        </template>
      </el-tree>
    </div>

    <el-drawer
      v-model="showTopicForm"
      append-to-body
      :modal="false"
      size="40%"
      direction="rtl"
      custom-class="form-topic"
      :close-on-press-escape="false"
      title="添加题目/答案"
      @closed="onClosedDialog"
    >
      <el-form
        ref="ruleTopicFormRef"
        :model="topicForm"
        :rules="topicFormRules"
        label-width="70px"
      >
        <el-form-item label="题目" prop="title">
          <el-input
            v-model="topicForm.title"
            type="textarea"
            placeholder="输入题目内容"
          />
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
          <el-select
            v-model="topicForm.type"
            popper-class="questionnaire-select-popper"
            placeholder="选择类型"
            @change="changeSelect"
          >
            <el-option
              v-for="item of topicTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="topicForm.description"
            :autosize="{ minRows: 2 }"
            type="textarea"
            placeholder="输入备注内容"
          />
        </el-form-item>
        <template
          v-if="topicForm.type === 'Radio' || topicForm.type === 'Checkbox'"
        >
          <el-space
            v-for="(item, index) in topicForm.children"
            :key="item.id"
            :size="0"
          >
            <el-form-item :label="`选项 ${setFromCharCode(index)}`">
              <el-input v-model="item.title" placeholder="输入备注内容" />
            </el-form-item>
            <el-form-item label="参考值">
              <el-input-number
                v-model="item.attribute.referValue"
                :min="0"
                :controls="false"
              />
            </el-form-item>
            <el-button
              v-if="topicForm.type === 'Radio'"
              type="text"
              style="
                min-width: 6rem;
                font-size: 1rem;
                margin-left: 2rem;
                margin-top: -2rem;
                color: #337ecc;
              "
              @click="changeOption(item, 2)"
            >
              配置公式
            </el-button>
            <el-button
              v-if="topicForm.children.length > 1"
              type="text"
              style="
                min-width: 4rem;
                font-size: 1rem;
                margin-left: 1rem;
                margin-top: -2rem;
                color: #f56c6c;
              "
              @click="deleteAddOption(index, 'option')"
            >
              移除
            </el-button>
          </el-space>
        </template>
        <el-form-item
          v-if="topicForm.type === 'Radio' || topicForm.type === 'Checkbox'"
        >
          <el-button size="large" type="text" @click="onAddOption('option')">
            新增选项
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          size="large"
          type="primary"
          @click="onSubmit(ruleTopicFormRef)"
        >
          保存
        </el-button>
        <!--        <el-button type="danger" size="large" @click="onClosedDialog">-->
        <!--          取消-->
        <!--        </el-button>-->
      </template>
    </el-drawer>

    <el-drawer
      ref="drawerRef"
      v-model="showEstimateForm"
      append-to-body
      :modal="false"
      direction="rtl"
      size="50%"
      custom-class="form-estimate"
      :close-on-press-escape="false"
      @closed="onClosedDialog"
    >
      <template #title>
        <div style="display: flex; align-items: center; gap: 5px">
          <span style="margin-right: 1rem">[题目]</span>
          <el-tag effect="dark" size="small">
            {{ estimateForm.id }}
          </el-tag>
          <strong>{{ estimateForm.title }}</strong>
        </div>
      </template>
      <el-form
        ref="ruleEstimateFormRef"
        :model="estimateForm"
        label-position="top"
      >
        <p>预估费用</p>
        <el-space direction="vertical" alignment="start" class="formula">
          <el-form-item label="最大值" prop="maxAmountRule">
            <el-input
              v-model="estimateForm.attribute.maxAmountRule"
              placeholder="输入最大值"
              @click.stop="handleFocus('max')"
              @blur="handleBlur"
            />
            <Transition>
              <div v-if="showTagListLabel === 'max'" class="formula-options">
                <template v-for="item in tagList" :key="item.id">
                  <el-check-tag
                    round
                    size="small"
                    @change="changeTagCheck(item.id)"
                  >
                    {{ item.id }}
                  </el-check-tag>
                </template>
              </div>
            </Transition>
          </el-form-item>
          <el-form-item label="最大值说明">
            <el-input
              v-model="estimateForm.attribute.maxAmountRuleDesc"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="输入最大值说明"
            />
          </el-form-item>
          <el-form-item label="最小值" prop="minAmountRule">
            <el-input
              v-model="estimateForm.attribute.minAmountRule"
              placeholder="输入最小值"
              @click.stop="handleFocus('min')"
              @blur="handleBlur"
            />
            <Transition>
              <div v-if="showTagListLabel === 'min'" class="formula-options">
                <template v-for="item in tagList" :key="item.id">
                  <el-check-tag
                    round
                    size="small"
                    @change="changeTagCheck(item.id)"
                  >
                    {{ item.id }}
                  </el-check-tag>
                </template>
              </div>
            </Transition>
          </el-form-item>
          <el-form-item label="最小值说明">
            <el-input
              v-model="estimateForm.attribute.minAmountRuleDesc"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="输入最小值说明"
            />
          </el-form-item>
        </el-space>
        <el-divider />
        <template
          v-for="(item, index) in estimateForm.attribute?.customFeeRules"
          :key="item.id"
        >
          <el-space :size="10" alignment="flex-start">
            <el-form-item label="自定义名称">
              <el-input v-model="item.name" placeholder="输入名称" />
            </el-form-item>
            <el-form-item label="最大值">
              <el-input
                v-model="item.maxAmountRule"
                placeholder="输入最大值"
                @click.stop="handleFocusRule('maxRule', index)"
                @blur="handleBlur"
              />
              <Transition>
                <div
                  v-if="
                    showTagListLabel === 'maxRule' && showTagListIndex === index
                  "
                  class="formula-options"
                >
                  <template v-for="tag in tagList" :key="tag.id">
                    <el-check-tag
                      round
                      size="small"
                      @change="changeTagCheckRule(tag.id)"
                    >
                      {{ tag.id }}
                    </el-check-tag>
                  </template>
                </div>
              </Transition>
            </el-form-item>
            <el-form-item label="最小值">
              <el-input
                v-model="item.minAmountRule"
                placeholder="输入最小值"
                @click.stop="handleFocusRule('minRule', index)"
                @blur="handleBlur"
              />
              <Transition>
                <div
                  v-if="
                    showTagListLabel === 'minRule' && showTagListIndex === index
                  "
                  class="formula-options"
                >
                  <template v-for="tag in tagList" :key="tag.id">
                    <el-check-tag
                      round
                      size="small"
                      @change="changeTagCheckRule(tag.id)"
                    >
                      {{ tag.id }}
                    </el-check-tag>
                  </template>
                </div>
              </Transition>
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="item.feeType"
                popper-class="questionnaire-select-popper"
                placeholder="选择类型"
              >
                <el-option label="人工" value="labor" />
                <el-option label="主材" value="mainMaterial" />
                <el-option label="辅材" value="auxiliaryMaterial" />
                <el-option label="服务" value="service" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="item.description"
                style="width: 24rem"
                placeholder="请输入备注"
                type="textarea"
              />
            </el-form-item>
            <el-button
              type="text"
              :underline="false"
              style="
                min-width: 4rem;
                font-size: 1rem;
                margin-top: 5rem;
                color: #f56c6c;
              "
              @click="deleteAddOption(index, 'estimate')"
            >
              移除
            </el-button>
          </el-space>
        </template>
        <el-form-item>
          <el-button size="large" type="text" @click="onAddOption('estimate')">
            新增项
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="large" type="primary" @click="onEstimateSubmit">
          保存
        </el-button>
        <!--        <el-button type="danger" size="large" @click="onClosedDialog">-->
        <!--          取消-->
        <!--        </el-button>-->
      </template>
    </el-drawer>

    <el-drawer
      v-model="showFormulaForm"
      append-to-body
      :modal="false"
      direction="rtl"
      size="40%"
      custom-class="form-estimate"
      @closed="onClosedFormula"
    >
      <template #title>
        <div style="display: flex; align-items: center; gap: 5px">
          <span style="margin-right: 1rem">[选项]</span>
          <el-tag effect="dark" size="small">
            {{ formulaOptionForm?.id }}
          </el-tag>
          <strong>{{ formulaOptionForm?.title }}</strong>
        </div>
      </template>
      <el-form
        ref="ruleEstimateFormRef"
        :model="formulaOptionForm"
        label-position="top"
      >
        <p>预估费用</p>
        <el-space direction="vertical" alignment="start" class="formula">
          <el-form-item label="最大值" prop="maxAmountRule">
            <el-input
              v-model="formulaOptionForm.attribute.maxAmountRule"
              placeholder="输入最大值"
              @click.stop="handleFocus('Fmax')"
              @blur="handleBlur"
            />
            <Transition>
              <div v-if="showTagListLabel === 'Fmax'" class="formula-options">
                <template v-for="item in tagList" :key="item.id">
                  <el-check-tag
                    round
                    size="small"
                    @change="changeTagCheck(item.id)"
                  >
                    {{ item.id }}
                  </el-check-tag>
                </template>
              </div>
            </Transition>
          </el-form-item>
          <el-form-item label="最大值说明">
            <el-input
              v-model="formulaOptionForm.attribute.maxAmountRuleDesc"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="输入最大值说明"
            />
          </el-form-item>
          <el-form-item label="最小值" prop="minAmountRule">
            <el-input
              v-model="formulaOptionForm.attribute.minAmountRule"
              placeholder="输入最小值"
              @click.stop="handleFocus('Fmin')"
              @blur="handleBlur"
            />
            <Transition>
              <div v-if="showTagListLabel === 'Fmin'" class="formula-options">
                <template v-for="item in tagList" :key="item.id">
                  <el-check-tag
                    round
                    size="small"
                    @change="changeTagCheck(item.id)"
                  >
                    {{ item.id }}
                  </el-check-tag>
                </template>
              </div>
            </Transition>
          </el-form-item>
          <el-form-item label="最小值说明">
            <el-input
              v-model="formulaOptionForm.attribute.minAmountRuleDesc"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="输入最小值说明"
            />
          </el-form-item>
        </el-space>
        <el-divider />
        <template
          v-for="(item, index) in formulaOptionForm.attribute.customFeeRules"
          :key="item.id"
        >
          <el-space :size="10" alignment="flex-start">
            <el-form-item label="自定义名称">
              <el-input v-model="item.name" placeholder="输入名称" />
            </el-form-item>
            <el-form-item label="最大值">
              <el-input
                v-model="item.maxAmountRule"
                placeholder="输入最大值"
                @click.stop="handleFocusRule('FmaxRule', index)"
                @blur="handleBlur"
              />
              <Transition>
                <div
                  v-if="
                    showTagListLabel === 'FmaxRule' &&
                    showTagListIndex === index
                  "
                  class="formula-options"
                >
                  <template v-for="tag in tagList" :key="tag.id">
                    <el-check-tag
                      round
                      size="small"
                      @change="changeTagCheckRule(tag.id)"
                    >
                      {{ tag.id }}
                    </el-check-tag>
                  </template>
                </div>
              </Transition>
            </el-form-item>
            <el-form-item label="最小值">
              <el-input
                v-model="item.minAmountRule"
                placeholder="输入最小值"
                @click.stop="handleFocusRule('FminRule', index)"
                @blur="handleBlur"
              />
              <Transition>
                <div
                  v-if="
                    showTagListLabel === 'FminRule' &&
                    showTagListIndex === index
                  "
                  class="formula-options"
                >
                  <template v-for="tag in tagList" :key="tag.id">
                    <el-check-tag
                      round
                      size="small"
                      @change="changeTagCheckRule(tag.id)"
                    >
                      {{ tag.id }}
                    </el-check-tag>
                  </template>
                </div>
              </Transition>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="item.feeType" placeholder="选择类型">
                <el-option label="人工" value="labor" />
                <el-option label="主材" value="mainMaterial" />
                <el-option label="辅材" value="auxiliaryMaterial" />
                <el-option label="服务" value="service" />
              </el-select>
            </el-form-item>
            <el-button
              type="text"
              :underline="false"
              style="
                min-width: 4rem;
                font-size: 1rem;
                margin-top: 5rem;
                color: #f56c6c;
              "
              @click="deleteAddOption(index, 'formula')"
            >
              移除
            </el-button>
          </el-space>
        </template>
        <el-form-item>
          <el-button size="large" type="text" @click="onAddOption('formula')">
            新增项
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="large" type="primary" @click="onFormulaSubmit">
          保存
        </el-button>
        <el-button type="danger" size="large" @click="showFormulaForm = false">
          取消
        </el-button>
      </template>
    </el-drawer>

    <!-- <el-drawer
      v-model="showFormulaForm"
      append-to-body
      destroy-on-close
      :modal="false"
      direction="rtl"
      size="25%"
      custom-class="form-formula"
      @closed="onClosedFormula"
    >
      <template #title>
        <div style="display: flex; align-items: center; gap: 5px">
          <span style="margin-right: 1rem">[选项]</span>
          <el-tag effect="dark" size="small">
            {{ formulaOptionForm?.id }}
          </el-tag>
          <strong>{{ formulaOptionForm?.title }}</strong>
        </div>
      </template>
      <div class="formula-box">
        <p style="color: dimgray; margin-bottom: 2rem">配置选项公式</p>
        <el-input v-model="formulaOptionForm.value" placeholder="输入公式" />
        <div class="formula-options">
          <template v-for="item in tagList" :key="item.id">
            <el-check-tag round size="small" @change="changeTagCheck(item.id)">
              {{ item.id }}
            </el-check-tag>
          </template>
        </div>
        <div style="margin-top: 6rem; display: flex; justify-content: center">
          <el-button size="large" type="primary" @click="onFormulaSubmit">
            保存
          </el-button>
          <el-button
            type="danger"
            size="large"
            @click="showFormulaForm = false"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-drawer> -->

    <el-dialog
      v-model="dialogCopyVisible"
      z-index="999"
      custom-class="form-copy"
      append-to-body
      title="复制并新增"
      width="40rem"
      @close="dialogCopyVisible = false"
    >
      <el-form :model="copyData" label-width="60px">
        <el-form-item label="复制到">
          <el-select
            v-model="copyData.region"
            filterable
            placeholder="选择复制到的目标"
          >
            <el-option
              v-for="item in copyList"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              <span
                style="
                  float: left;
                  color: #909399;
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 12px;
                "
              >
                {{ item.id }}
              </span>
              <span style="margin-left: 1rem">
                {{ item.title }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="text" size="large" @click="dialogCopyVisible = false">
          取消
        </el-button>
        <el-button size="large" type="primary" @click="handleSubmitCopy">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.questionnaire-edit {
  height: 88vh;
  margin-top: 2rem;
  overflow: auto;

  :deep(.tree-line) {
    min-width: 40rem;

    .el-tag {
      margin-right: 1rem;
      padding: 1rem 0.3rem;
      font-family: 'Courier New', Courier, monospace;
    }

    .el-tag--dark {
      font-weight: bold;
      letter-spacing: 1px;
    }

    & > .el-tree-node[draggable='true'] {
      cursor: pointer !important;
    }

    .el-tree-node {
      position: relative;
      padding-left: 1.8rem;

      &::before {
        content: '';
        position: absolute;
        height: 100%;
        left: -4px;
        right: 0;
        border-width: 1px;
        border-left: 1px dashed #52627c;
      }

      &::after {
        content: '';
        position: absolute;
        width: 4rem;
        left: -4px;
        top: 2rem;
        border-width: 1px;
        border-top: 1px dashed #52627c;
      }

      &:last-child::before {
        height: 2rem;
      }
    }

    & > .el-tree-node::after,
    & > .el-tree-node::before {
      border: none;
    }

    .el-tree-node__expand-icon {
      font-size: 16px;

      &.is-leaf {
        width: 0;
      }
    }

    .el-tree-node__children {
      padding-left: 3.8rem;
    }

    .el-tree-node__content {
      height: 4rem !important;
      padding-left: 0 !important;
      padding-right: 2rem;
      margin-left: 20px;

      & > span:not(.el-tag) {
        max-width: 20rem;
        min-width: 3rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .el-button--text {
      min-width: 3rem;
      font-size: 18px;
      margin: 0;
    }
  }
}
</style>
