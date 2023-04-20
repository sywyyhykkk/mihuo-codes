<template>
  <div class="estimate-cost">
    <div>
      <el-button type="primary" @click.stop="addNewServiceQuestion(1)">
        新增问题
      </el-button>
      <el-button type="primary" @click.stop="addNewServiceQuestion(2)">
        新增选项
      </el-button>
    </div>
    <div class="main-container">
      <el-collapse v-model="activeName">
        <el-collapse-item v-if="estimateCost.questions" name="question" :title="`问题(${estimateCost?.questions.length})`">
          <el-card
            class="box-card flex-center"
            :style="{ justifyContent: estimateCost?.questions.length ? 'flex-start' : 'center' }"
            shadow="never"
          >
            <div
              v-for="(sItem, sIndex) in estimateCost.questions"
              :key="sIndex"
              class="card-item"
            >
              <el-button
                type="text"
                class="primary"
                icon="edit"
                @click="editQuestionForm(sItem, 1, sIndex)"
              >编辑
              </el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="deleteQuestionForm(1, sIndex)"
              >删除
              </el-button>
              <el-form disabled>
                <el-form-item label="问题">
                  <el-input
                    v-model="sItem.label"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                  <uploadImage
                    v-model="sItem.icon"
                    disabled
                    :max-count="1"
                    :is-edits="false"
                  />
                </el-form-item>
                <el-form-item label="值">
                  <el-input
                    v-model="sItem.value"
                    type="number"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-empty v-if="!estimateCost?.questions.length" description="暂无预估费用问题" />
          </el-card>
        </el-collapse-item>
        <el-collapse-item v-if="estimateCost.items" name="items" :title="`选项(${estimateCost.items.length})`">
          <el-card
            class="box-card flex-center"
            :style="{ justifyContent: estimateCost?.items.length ? 'flex-start' : 'center' }"
            shadow="never"
          >
            <div
              v-for="(sItem, sIndex) in estimateCost.items"
              :key="sIndex"
              class="card-item"
            >
              <el-button
                type="text"
                class="primary"
                icon="edit"
                @click="editQuestionForm(sItem, 2, sIndex)"
              >编辑
              </el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="deleteQuestionForm(2, sIndex)"
              >删除
              </el-button>
              <el-form disabled>
                <el-form-item label="选项">
                  <el-input
                    v-model="sItem.label"
                  />
                </el-form-item>
                <el-form-item label="值">
                  <el-input
                    v-model="sItem.value"
                    type="number"
                  />
                </el-form-item>
                <template v-if="currentServer.code !='home_service_1'">
                  <el-form-item label="关联项">
                    <el-select
                      v-model="sItem.relatedItems"
                      multiple
                      placeholder=""
                      value-key="label"
                      collapse-tags
                    >
                      <el-option
                        v-for="(item,index) in estimateCost.questions"
                        :key="index"
                        :label="item.label"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="默认值" prop="defaultValue">
                    <el-input
                      v-model="sItem.defaultValue"
                      placeholder="请输入默认值"
                      type="number"
                    />
                  </el-form-item>
                </template>
              </el-form>
            </div>
            <el-empty v-if="!estimateCost.items.length" description="暂无预估费用选项" />
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      v-model="isShowQuestionDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`${isEditQuestion ? '编辑' : '新增' }` + `${currentType === 1 ? '问题' : '选项'}`"
      @close="hideQuestionDialog"
    >
      <div style="padding: 2rem">
        <el-form
          v-if="currentType === 1"
          ref="questionFormRef"
          :model="questionForm"
          :rules="questionFormRules"
          label-width="8rem"
        >
          <el-form-item label="问题" prop="label">
            <el-input
              v-model="questionForm.label"
              placeholder="请输入问题"
            />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <uploadImage
              v-model="questionForm.icon"
              :max-count="1"
              :is-edits="false"
            />
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input
              v-model="questionForm.value"
              placeholder="请输入值"
              type="number"
            />
          </el-form-item>
        </el-form>
        <el-form
          v-if="currentType === 2"
          ref="itemFormRef"
          :model="itemForm"
          :rules="questionFormRules"
          label-width="8rem"
        >
          <el-form-item label="选项" prop="label">
            <el-input
              v-model="itemForm.label"
              placeholder="请输入选项"
            />
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input
              v-model="itemForm.value"
              placeholder="请输入值"
              type="number"
            />
          </el-form-item>
          <template v-if="currentServer.code !='home_service_1'">
            <el-form-item label="关联项">
              <el-select
                v-model="itemForm.relatedItems"
                multiple
                placeholder="请选择关联项"
                value-key="label"
              >
                <el-option
                  v-for="(item,index) in estimateCost.questions"
                  :key="index"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="默认值" prop="defaultValue">
              <el-input
                v-model="itemForm.defaultValue"
                placeholder="请输入默认值"
                type="number"
              />
            </el-form-item>
          </template>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveQuestionDialog">保存</el-button>
          <el-button @click="hideQuestionDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { questionFormRules } from '_c/HomeServiceManagement/data'
import { ElMessageBox } from 'element-plus/es'

const props = defineProps<{
  estimateCost: any,
  current: any
}>()
const activeName = ref('')
const currentServer = ref(props.current)
const estimateCost = ref(props.estimateCost || {
  questions: [],
  items: []
})
const emit = defineEmits<{(event: 'addItem', type: number, data: any): any,
  (event: 'editItem', type: number, index: number, data: any): any,
  (event: 'deleteItem', type: number, index: number): any
}>()
// 当前新增类型 1=问题 2=选项
const currentType = ref(-1)
// 是否显示新增弹窗
const isShowQuestionDialog = ref(false)
// 是否编辑
const isEditQuestion = ref(false)
// 问题表单
const questionForm = ref({
  label: '',
  icon: '',
  value: 1
})
// 选项表单
const itemForm = ref({
  label: '',
  value: 1,
  relatedItems:[],
  defaultValue: 1
})
// 当前编辑的问题index
const currentIndex = ref(-1)
// 新增预估费用问题/选项
const addNewServiceQuestion = (type: number) => {
  currentType.value = type
  isShowQuestionDialog.value = true
  isEditQuestion.value = false
}

// 编辑问题/选项
const editQuestionForm = (sItem: any, type: number, serviceIndex: number) => {
  currentType.value = type
  currentIndex.value = serviceIndex
  if (type === 1) {
    questionForm.value = Object.assign({}, sItem)
  } else {
    itemForm.value = Object.assign({}, sItem)
  }
  isEditQuestion.value = true
  isShowQuestionDialog.value = true
}

// 隐藏新增问题/选项弹窗
const hideQuestionDialog = () => {
  questionForm.value = {
    label: '',
    icon: '',
    value: 1
  }
  itemForm.value = {
    label: '',
    value: 1,
    relatedItems:[],
    defaultValue: 1
  }
  currentIndex.value = -1
  currentType.value = -1
  isShowQuestionDialog.value = false
  isEditQuestion.value = false
}

// 删除问题/选项
const deleteQuestionForm = (type: number, sIndex: number) => {
  ElMessageBox.confirm(`确定删除该${type === 1 ? '问题' : '选项'}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('deleteItem', type, sIndex)
  }).catch(e => {})
}

const questionFormRef = ref(null)
const itemFormRef = ref(null)

// 保存新增问题/选项弹窗
const saveQuestionDialog = () => {
  if (currentType.value === 1) {
    // 问题
    const forms: any = unref(questionFormRef)
    forms.validate(async (valid: Boolean) => {
      if (valid) {
        if (isEditQuestion.value) {
          // 编辑
          emit('editItem', currentType.value, currentIndex.value, unref(questionForm))
        } else {
          // 新增
          emit('addItem', currentType.value, unref(questionForm))
        }
        hideQuestionDialog()
      }
    })
  } else {
    // 选项
    const forms: any = unref(itemFormRef)
    forms.validate(async (valid: Boolean) => {
      if (valid) {
        if (isEditQuestion.value) {
          // 编辑
          emit('editItem', currentType.value, currentIndex.value, unref(itemForm))
        } else {
          // 新增
          emit('addItem', currentType.value, unref(itemForm))
        }
        hideQuestionDialog()
      }
    })
  }
}
</script>

<style lang="less" scoped>
.estimate-cost {
  width: 100%;
}

.main-container {
  width: 100%;
  padding: 1rem 0;

  .box-card {
    width: 92%;
    height: max-content;
    border: .1rem solid #a8a8a8;
    padding: 1rem;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    .card-item {
      width: 25rem;
      height: max-content;
      padding: 1rem;
      border: .1rem solid #a8a8a8;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
/deep/.el-card__body{
  flex-flow: row wrap;
}
</style>
