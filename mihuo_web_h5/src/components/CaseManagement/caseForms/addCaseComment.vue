<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="40%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="案例评价维护"
      @close="hideDrawer"
    >
      <el-button
        type="primary"
        plain
        @click="addNewComment"
      >新增评价</el-button>
      <div v-if="isShowComment">
        <el-card v-for="(item, index) in commentList" :key="index" class="box-card">
          <template #header>
            <div class="flex-center" style="justify-content: space-between;">
              <div class="flex-center">
                <el-image
                  class="avatar"
                  :src=" $getUrl.getPicUrl(item.reviewerAvatar)"
                />
                {{ item.reviewer }} {{ item.time }}
              </div>
              <div class="flex-center">
                <el-button
                  plain
                  @click="editComment(item, index)"
                >编辑评价</el-button>
                <el-button
                  type="text"
                  class="danger"
                  icon="delete"
                  @click="deleteComment(item, index)"
                >删除评价</el-button>
              </div>
            </div>
          </template>
          <div>
            <el-form label-width="8rem" disabled>
              <el-form-item label="关联人员" prop="personId">
                {{ item.personName }}[{{ item.personSkillName }}]
              </el-form-item>
              <el-form-item label="评价内容">
                <el-input
                  v-model="item.comment"
                  type="textarea"
                  maxlength="120"
                />
              </el-form-item>
              <el-form-item label="评价星级">
                <el-rate
                  v-model="item.stars"
                  allow-half
                  disabled
                  style="margin-top: 1rem;"
                />
              </el-form-item>
              <el-form-item v-if="item.pics" label="评价图片">
                <uploadImage
                  v-model="item.pics"
                  :max-count="5"
                  :is-edits="false"
                />
              </el-form-item>
            </el-form>
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
      v-model="isShowCommentForm"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditCommentForm ? '编辑评价' : '新增评价'"
      @close="hideDialog"
    >
      <div>
        <el-form
          ref="commentForms"
          :model="commentForm"
          label-width="10rem"
          :rules="caseCommentRules"
        >
          <el-form-item label="关联人员" prop="personId">
            <el-select
              v-model="commentForm.personId"
              filterable
              placeholder="请选择关联人员"
              remote
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
          <el-form-item label="评价星级" prop="stars">
            <el-rate v-model="commentForm.stars" allow-half style="margin-top: 1rem;" />
          </el-form-item>
          <el-form-item label="评价内容" prop="comment">
            <el-input
              v-model="commentForm.comment"
              type="textarea"
              maxlength="120"
              placeholder="请输入评价内容"
            />
          </el-form-item>
          <el-form-item label="评价人" prop="reviewer">
            <el-input
              v-model="commentForm.reviewer"
              maxlength="20"
              placeholder="请输入评价人昵称"
            />
          </el-form-item>
          <el-form-item label="评价人头像" prop="reviewerAvatar">
            <uploadImage
              v-model="commentForm.reviewerAvatar"
              :max-count="1"
              :is-edits="true"
            />
          </el-form-item>
          <el-form-item label="评价时间" prop="time">
            <el-date-picker
              v-model="commentForm.time"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择评价时间"
            />
          </el-form-item>
          <el-form-item label="评价图片" prop="pics">
            <uploadImage
              v-model="commentForm.pics"
              :max-count="5"
              :is-edits="true"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveCommentForm">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { caseCommentRules } from '../rules'
import { editCase, getCityOperatorPerson } from '../api'
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

// 案例ID
const caseId = ref(props.row?.id)

onMounted(() => {
  getAllPeople()
})

// 控制表单的显示/隐藏
const isShowDrawer = ref(false)
// 评价列表
const commentList = ref<any[]>(props.row.appraisal && JSON.parse(props.row.appraisal).length !== 0 ? JSON.parse(props.row.appraisal) : [])
// 评价表单
const commentForm = ref({
  comment: '', // 评价内容
  time: '', // 评价时间
  stars: '', // 评价星级
  userId: '', // 被评价人userId
  personId: '', // 被评价人personId
  personName: '', // 被评价人名称
  personSkillName: '', // 被评价人工种
  reviewer: '', // 评价人昵称
  pics: '', // 评价图片
  reviewerAvatar: '' // 评价人头像
})
// 是否显示阶段表单弹窗
const isShowCommentForm = ref(false)
// 是否是编辑阶段表单
const isEditCommentForm = ref(false)
// 编辑表单的index
const commentIndex = ref(-1)

const hideDrawer = () => {
  isShowDrawer.value = false
  emit('update:modelValue', false)
}

// 保存评价维护
const saveDrawer = async () => {
  const finalData = JSON.stringify(commentList.value)
  const res: any = await editCase({
    id: caseId.value,
    ...props.row,
    appraisal: finalData
  })
  if (res && res.code === 0) {
    hideDrawer()
    emit('getData')
  }
}

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

// 新增评价
const addNewComment = () => {
  isShowCommentForm.value = true
  isEditCommentForm.value = false
}

// 编辑评价
const editComment = (item: any, index: any) => {
  commentIndex.value = index
  commentForm.value = {
    comment: item.comment, // 评价内容
    time: item.time, // 评价时间
    stars: item.stars, // 评价星级
    userId: item.userId, // 被评价人userId
    personId: item.personId, // 被评价人personId
    personName: item.personName, // 被评价人名称
    personSkillName: item.personSkillName, // 被评价人工种
    reviewer: item.reviewer, // 评价人昵称
    pics: item.pics, // 评价图片
    reviewerAvatar: item.reviewerAvatar // 评价人头像
  }
  isShowCommentForm.value = true
  isEditCommentForm.value = true
}

// 删除评价
const deleteComment = (item: any, index: any) => {
  ElMessageBox.confirm(`此操作将删除该评价, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    ElMessage.success('删除成功')
    commentList.value.splice(index, 1)
  }).catch(e => {})
}

// 是否显示评论列表
const isShowComment = ref(true)
const commentForms = ref('')
// 保存评价表单
const saveCommentForm = () => {
  const forms: any = unref(commentForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (isEditCommentForm.value) {
        isShowComment.value = false
        // 编辑评价
        const newValue = JSON.parse(JSON.stringify(commentForm.value))
        commentList.value[commentIndex.value] = newValue
        commentIndex.value = -1
        setTimeout(() => {
          isShowComment.value = true
        }, 100)
      } else {
        // 新增评价
        const newValue = commentForm.value
        commentList.value.push(newValue)
      }
      hideDialog()
    }
  })
}

// 隐藏评价
const hideDialog = () => {
  isShowCommentForm.value = false
  commentForm.value = {
    comment: '', // 评价内容
    time: '', // 评价时间
    stars: '', // 评价星级
    userId: '', // 被评价人userId
    personId: '', // 被评价人personId
    personName: '', // 被评价人名称
    personSkillName: '', // 被评价人工种
    reviewer: '', // 评价人昵称
    pics: '', // 评价图片
    reviewerAvatar: '' // 评价人头像
  }
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
  commentForm.value.userId = person?.userId
  commentForm.value.personName = person?.name
  commentForm.value.personSkillName = person?.skillName
}

</script>

<style lang="less" scoped>
.box-card {
  width: 70rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--el-box-shadow-light) !important;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.flex-center{
  display: flex;
  align-items: center;
}
</style>
