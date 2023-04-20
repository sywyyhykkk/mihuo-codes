<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="78rem"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="hideDrawer"
    >
      <template #title>
        <span>案例日志维护</span>
        <el-button
          type="primary"
          plain
          @click="addNewLog"
        >新增日志</el-button>
      </template>
      <div>
        <el-card v-for="(item, index) in logList" :key="index" class="box-card">
          <template #header>
            <div class="flex-center" style="justify-content: space-between;">
              <span>[{{ item.logType === 0 ? '服务' : '巡检' }}日志] {{ item.time }}</span>
              <div class="flex-center">
                <el-button
                  plain
                  @click="addLogComment(item, index)"
                >新增评论</el-button>
                <el-button
                  plain
                  @click="editLog(item, index)"
                >编辑日志</el-button>
                <el-button
                  type="text"
                  class="danger"
                  icon="delete"
                  @click="deleteLog(item, index)"
                >删除日志</el-button>
              </div>
            </div>
          </template>
          <div class="content-box">
            <el-form label-width="10rem" disabled>
              <el-form-item label="关联人员" prop="personId">
                {{ item.personName }}[{{ item.personSkillName }}]
              </el-form-item>
              <el-form-item label="评论内容">
                <el-input
                  v-model="item.content"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="点赞数量">
                <el-input
                  v-model="item.likeNum"
                />
              </el-form-item>
              <el-form-item v-if="item.logImg" label="日志图片">
                <uploadImage
                  v-model="item.logImg"
                  :max-count="5"
                  :is-edits="false"
                />
              </el-form-item>
            </el-form>
            <el-table
              stripe
              style="height: 100%;width:100%;"
              :data="item.logComment"
              :height="0"
              border
            >
              <el-table-column prop="reviewer" width="120" label="评论人">
                <template #default="scope">
                  <div class="flex-center">
                    {{ scope.row.reviewer }}
                    <el-image class="avatar" :src=" $getUrl.getPicUrl(scope.row.reviewerAvatar)" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="comment" show-overflow-tooltip label="评论内容" />
              <el-table-column prop="time" width="160" label="评论时间" />
              <el-table-column label="操作" width="90">
                <template #default="scope">
                  <el-button
                    type="text"
                    class="danger"
                    icon="delete"
                    @click="deleteLogComment(scope.$index, item, index)"
                  >删除评论</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDrawer">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog
      v-model="isShowLogForm"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditLogForm ? '编辑服务日志' : '新增服务日志' "
      @close="hideDialog"
    >
      <div>
        <el-form
          ref="logForms"
          :model="logForm"
          label-width="80px"
          :rules="caseLogRules"
        >
          <el-form-item label="关联人员" prop="personId">
            <el-select
              v-model="logForm.personId"
              filterable
              remote
              placeholder="请选择关联人员"
              :remote-method="onSearchPeople"
              @change="onSelect"
            >
              <el-option
                v-for="(item, index) in peopleList"
                :key="index"
                :label="item.name + `[${item.skillName}]`"
                :value="item.personId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日志类型" prop="logType">
            <el-select
              v-model="logForm.logType"
              filterable
              placeholder="请选择日志类型"
            >
              <el-option
                v-for="(item, index) in logTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日志内容" prop="content">
            <el-input
              v-model="logForm.content"
              type="textarea"
              placeholder="请输入日志内容"
            />
          </el-form-item>
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              v-model="logForm.time"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择日志发布时间"
            />
          </el-form-item>
          <el-form-item label="点赞数" prop="likeNum">
            <el-input v-model="logForm.likeNum" placeholder="请输入点赞数" type="number" />
          </el-form-item>
          <el-form-item label="日志图片" prop="logImg">
            <div class="flex-center" style="align-items: flex-start; flex-direction: column">
              <div>
                <uploadImage
                  v-model="logForm.logImg"
                  :max-count="5"
                  :is-edits="true"
                />
              </div>
              <div v-if="importedImages">
                <div style="margin: 2rem 0;">
                  <p style="font-size: 1rem;">从项目导入:</p>
                </div>
                <el-image
                  v-for="(item, index) in importedImages.split(',')"
                  :key="index"
                  class="img"
                  :src=" $getUrl.getPicUrl(item)"
                />
              </div>
              <div>
                <el-button
                  :disabled="checkDisabled(logForm.logImg)"
                  style="margin-top: 2rem !important;"
                  type="primary"
                  @click="importImg()"
                >从项目导入</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveLogForm">确认</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 日志评论弹窗 -->
    <el-dialog
      v-model="isShowLogComment"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新增日志评论"
      @close="hideDialog"
    >
      <el-form
        ref="logCommentForms"
        :model="logCommentForm"
        label-width="10rem"
        :rules="caseLogCommentRules"
      >
        <el-form-item label="评论内容" prop="comment">
          <el-input
            v-model="logCommentForm.comment"
            type="textarea"
            placeholder="请输入评论内容"
          />
        </el-form-item>
        <el-form-item label="评论人" prop="reviewer">
          <el-input
            v-model="logCommentForm.reviewer"
            placeholder="请输入评论人昵称"
          />
        </el-form-item>
        <el-form-item label="评论人头像" prop="reviewerAvatar">
          <uploadImage
            v-model="logCommentForm.reviewerAvatar"
            :max-count="1"
            :is-edits="true"
          />
        </el-form-item>
        <el-form-item label="评论时间" prop="time">
          <el-date-picker
            v-model="logCommentForm.time"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="请选择评论时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveLogCommentForm">确认</el-button>
          <el-button @click="hideCommentDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入项目图片弹窗 -->
    <image-picker v-model="isShowImagePicker" :project-id="projectId" @imagePicked="imagePicked" />
  </div>
</template>

<script lang="ts" setup>
import { caseLogRules, caseLogCommentRules } from '../rules'
import { editCase, getCityOperatorPerson } from '_c/CaseManagement/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'getData'])

onMounted(() => {
  getAllPeople()
})

// 关联的项目ID
const projectId = ref(props.row?.relationProjectId)
// 案例ID
const caseId = ref(props.row?.id)

// 控制表单的显示/隐藏
const isShowDrawer = ref(false)

const hideDrawer = () => {
  isShowDrawer.value = false
  emit('update:modelValue', false)
}

// 保存日志维护
const saveDrawer = async () => {
  const finalData = JSON.stringify(logList.value)
  const res: any = await editCase({
    id: caseId.value,
    ...props.row,
    journal: finalData
  })
  if (res && res.code === 0) {
    hideDrawer()
    emit('getData')
  }
}

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

// 是否显示日志表单弹窗
const isShowLogForm = ref(false)
// 是否是编辑日志
const isEditLogForm = ref(false)
// 日志列表
const logList = ref<any[]>(props.row.journal && JSON.parse(props.row.journal).length !== 0 ? JSON.parse(props.row.journal) : [])
// 日志表单
const logForm = ref({
  content: '', // 日志内容
  likeNum: null, // 点赞数量
  logImg: '', // 日志图片
  time: null, // 发布时间
  userId: '',
  personId: '',
  personName: '',
  personSkillName: '',
  logType: 0, // 日志类型 0=服务日志 1=巡检日志
  logComment: [] // 日志评论
})
// 日志类型列表
const logTypeList = markRaw([
  {
    label: '服务日志',
    value: 0
  },
  {
    label: '巡检日志',
    value: 1
  }
])
const logForms = ref('')

// 编辑表单/新增日志评论的index
const logIndex = ref(-1)

// 新增日志
const addNewLog = () => {
  isShowLogForm.value = true
  isEditLogForm.value = false
}

// 编辑日志
const editLog = (item: any, index: number) => {
  logIndex.value = index
  logForm.value = {
    content: item.content, // 日志内容
    likeNum: item.likeNum, // 点赞数量
    logImg: item.logImg, // 日志图片
    time: item.time, // 发布时间
    userId: item.userId,
    personId: item.personId,
    personName: item.personName,
    personSkillName: item.personSkillName,
    logType: item.logType,
    logComment: item.logComment || [] // 日志评论
  }
  isEditLogForm.value = true
  isShowLogForm.value = true
}

// 删除日志
const deleteLog = (item: any, index: number) => {
  ElMessageBox.confirm(`此操作将删除该日志, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    ElMessage.success('删除成功')
    logList.value.splice(index, 1)
  }).catch(e => {})
}

// 隐藏日志表单
const hideDialog = () => {
  isShowLogForm.value = false
  logForm.value = {
    content: '', // 日志内容
    likeNum: null, // 点赞数量
    logImg: '', // 日志图片
    time: null, // 发布时间
    userId: '',
    personId: '',
    personName: '',
    personSkillName: '',
    logType: 0, // 日志类型
    logComment: [] // 日志评论
  }
}

// 是否显示日志评论
const isShowLogComment = ref(false)
// 日志评论表单
const logCommentForm = ref({
  reviewer: '', // 评论人
  reviewerAvatar: '', // 评论人头像
  comment: '', // 评论内容
  time: ''// // 评论时间
})
const logCommentForms = ref('')

// 新增日志评论
const addLogComment = (item: any, index: number) => {
  logIndex.value = index
  isShowLogComment.value = true
}

// 保存日志评论
const saveLogCommentForm = () => {
  const forms: any = unref(logCommentForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      const newLogComment = JSON.parse(JSON.stringify(logCommentForm.value))
      logList.value[logIndex.value]['logComment'].push(newLogComment)
      logIndex.value = -1
      hideCommentDialog()
    }
  })
}

// 删除日志评论
const deleteLogComment = (rowIndex: any, item: any, index: number) => {
  ElMessageBox.confirm(`此操作将删除该日志评论, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    ElMessage.success('删除成功')
    logList.value[index].logComment.splice(rowIndex, 1)
  }).catch(e => {})
}

// 隐藏日志评论表单
const hideCommentDialog = () => {
  isShowLogComment.value = false
  logCommentForm.value = {
    reviewer: '', // 评论人
    reviewerAvatar: '', // 评论人头像
    comment: '', // 评论内容
    time: ''// // 评论时间
  }
}

// 保存日志表单
const saveLogForm = () => {
  const forms: any = unref(logForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (isEditLogForm.value) {
        // 编辑日志
        const newValue = JSON.parse(JSON.stringify(logForm.value))
        logList.value[logIndex.value] = newValue
        logIndex.value = -1
        hideDialog()
      } else {
        // 新增日志
        const newValue = JSON.parse(JSON.stringify(logForm.value))
        logList.value.push(newValue)
        hideDialog()
      }
    }
  })
}

// 是否显示从项目导入图片弹窗
const isShowImagePicker = ref(false)

// 从项目导入图片
const importImg = () => {
  if (!projectId.value) {
    ElMessage.warning('当前案例未关联项目！')
    return
  }
  isShowImagePicker.value = true
}

// 导入图片回调
const imagePicked = (data: any) => {
  logForm.value.logImg += (logForm.value.logImg ? ',' : '') + data.img.url
  importedImages.value += (importedImages.value ? ',' : '') + data.img.url
}

// 选择关联人员列表
const peopleList = ref([])
// 搜索关联人员关键字
const searchKeyword = ref('')

// 获取当前运营商所有人员
const getAllPeople = async () => {
  const res = await getCityOperatorPerson({
    size: 30,
    auditStatus: 2,
    keyword: searchKeyword.value
  })
  if (res && res.data) {
    peopleList.value = res.data.records
  }
}

// 搜索关联人员
const onSearchPeople = (query: any) => {
  if (query) {
    searchKeyword.value = query
  } else {
    searchKeyword.value = ''
  }
  setTimeout(() => {
    getAllPeople()
  }, 200)
}

// 选择关联人员
const onSelect = (personId: any) => {
  const person: any = peopleList.value.find((item: any) => item.personId === personId)
  logForm.value.userId = person?.userId
  logForm.value.personName = person?.name
  logForm.value.personSkillName = person?.skillName
}

// 从项目导入的日志图片
const importedImages = ref('')

// 导入图片按钮禁用状态
const checkDisabled = (img: any) => {
  if (!img) return false
  const arr = img.split(',')
  return arr.length >= 5
}
</script>

<style lang="less" scoped>
.box-card {
  width: 70rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--el-box-shadow-light) !important;
  ::v-deep.el-card__body{
    width: 100% !important;
    box-sizing: border-box;
  }
}

.content-box{
  width: 100%;
}

.img {
  width: 11rem;
  height: 11rem;
  border-radius: .5rem;
  margin-right: 2rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
}

.flex-center{
  display: flex;
  align-items: center;
}
</style>
