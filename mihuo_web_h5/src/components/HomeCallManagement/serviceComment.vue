<template>
  <div>
    <el-dialog
      v-if="isShow"
      v-model="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="服务评价维护"
      width="60%"
      @close="closeDialog"
    >
      <div style="height: max-content; max-height: 50vh;">
        <el-form
          ref="rulesForm"
          :model="commentForm"
          :rules="formRules"
          label-width="10rem"
        >
          <el-form-item label="好评率" prop="rate">
            <el-input v-model="commentForm.rate" placeholder="请输入好评率" type="number">
              <template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="评分" prop="score">
            <el-input v-model="commentForm.score" placeholder="请输入评分" type="number" />
          </el-form-item>
        </el-form>
        <div class="child-container">
          <el-button @click="addComment">添加评价({{ commentForm.comments.length }})</el-button>
          <div class="flex-center comments-container">
            <div v-for="(comment, cIndex) in commentForm.comments" :key="cIndex" class="comment-item">
              <p class="text-item">标题：{{ comment.title }}</p>
              <p class="text-item">内容：{{ comment.content }}</p>
              <p class="text-item">业主名称：{{ comment.customer }}</p>
              <p class="text-item">时间：{{ comment.time }}</p>
              <el-button
                type="text"
                class="primary"
                icon="edit"
                @click="editComment(comment, cIndex)"
              >编辑
              </el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="deleteComment(cIndex)"
              >删除</el-button>
            </div>
          </div>
        </div>
        <div class="child-container">
          <el-button @click="addTag">添加标签({{ commentForm.tags.length }})</el-button>
          <div class="flex-center comments-container">
            <div v-for="(tag, tIndex) in commentForm.tags" :key="tIndex" class="tag-item">
              <p class="text-item">{{ tag.name }}({{ tag.count }})</p>
              <el-button
                type="text"
                class="primary"
                icon="edit"
                @click="editTag(tag, tIndex)"
              >编辑
              </el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                @click="deleteComment(tIndex)"
              >删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="saveDialog"
          >保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 评价/标签弹窗 -->
    <el-dialog
      v-if="isShowChildDialog"
      v-model="isShowChildDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditChild ? `编辑${childType === 0 ? '评价' : ' 标签'}` : `添加${childType === 0 ? '评价' : ' 标签'}`"
      @close="closeChildDialog"
    >
      <el-form
        v-if="childType === 0"
        ref="childForm"
        :model="commentChildForm"
        :rules="childFormRules"
        label-width="10rem"
      >
        <el-form-item label="评价标题" prop="title">
          <el-input v-model="commentChildForm.title" placeholder="请输入评价标题" />
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="commentChildForm.score" placeholder="请输入评分" type="number" />
        </el-form-item>
        <el-form-item label="头像" prop="memberAvatar">
          <upload-image v-model="commentChildForm.memberAvatar" max-count="1" />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            v-model="commentChildForm.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入评价内容"
          />
        </el-form-item>
        <el-form-item label="业主名称" prop="customer">
          <el-input v-model="commentChildForm.customer" placeholder="请输入业主名称" />
        </el-form-item>
        <el-form-item label="评价时间" prop="time">
          <el-date-picker
            v-model="commentChildForm.time"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="请选择评价时间"
          />
        </el-form-item>

      </el-form>
      <el-form
        v-if="childType === 1"
        ref="childForm"
        :model="tagChildForm"
        :rules="childFormRules"
        label-width="8rem"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagChildForm.name" placeholder="请输入评价标签" />
        </el-form-item>
        <el-form-item label="标签数量" prop="count">
          <el-input v-model="tagChildForm.count" type="number" placeholder="请输入评价标签数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="saveChildDialog"
          >保存</el-button>
          <el-button @click="closeChildDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  commentData: any;
}>()
const emit = defineEmits<{(event: 'update:modelValue', value: boolean): void;
  (event: 'save', type: string, data: any): void;
}>()

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    isShow.value = props.modelValue
  }
)

const isShow = ref(props.modelValue)

const validateScore = (rule: any, value: any, callback: any) => {
  if (value && value > 5) {
    callback(new Error())
  } else {
    callback()
  }
}

const formRules = ref({
  rate: [
    { required: true, message: '请输入好评率', trigger: 'blur' }
  ],
  score: [
    { required: true, message: '请输入评分，范围0-5', trigger: 'blur', validator: validateScore }
  ]
})

const commentForm = ref(props.commentData.rate ? props.commentData : {
  rate: null, // 好评率
  score: null, // 评分
  comments: [] as any,
  tags: [] as any // 标签
})

const rulesForm = ref(null)

// 保存弹窗
const saveDialog = () => {
  const forms: any = unref(rulesForm)
  forms.validate((valid: boolean) => {
    if (valid) {
      emit('save', '评价', commentForm.value)
      closeDialog()
    }
  })
}

// 关闭弹窗
const closeDialog = () => {
  isShow.value = false
  commentForm.value = {
    rate: null, // 好评率
    score: null, // 评分
    comments: [] as any,
    tags: [] as any // 标签
  }
  emit('update:modelValue', false)
}

// 是否显示子弹窗
const isShowChildDialog = ref(false)
// 是否编辑评价/标签
const isEditChild = ref(false)
// 评价表单
const commentChildForm = ref({
  title: '',
  content: '',
  customer: '',
  time: '',
  score: 0,
  memberAvatar: ''
})
// 标签表单
const tagChildForm = ref({
  name: '',
  count: null
})
// 当前编辑的评价/标签索引
const childIndex = ref(-1)
// 当前编辑的评价/标签类型
const childType = ref(-1)

const childFormRules = ref({
  title: [
    { required: true, message: '请输入评价标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入评价内容', trigger: 'blur' }
  ],
  customer: [
    { required: true, message: '请输入业主名称', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择评价时间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '请输入标签数量', trigger: 'blur' }
  ]
})

const childForm = ref(null)

// 添加评价
const addComment = () => {
  childType.value = 0
  isShowChildDialog.value = true
  isEditChild.value = false
}

// 编辑评价
const editComment = (comment: any, index: number) => {
  childType.value = 0
  isEditChild.value = true
  commentChildForm.value = JSON.parse(JSON.stringify(comment))
  childIndex.value = index
  isShowChildDialog.value = true
}

// 删除评价
const deleteComment = (index: number) => {
  ElMessageBox.confirm('此操作将永久删除该评价, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    commentForm.value.comments.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
  }).catch(() => {})
}

// 添加标签
const addTag = () => {
  childType.value = 1
  isShowChildDialog.value = true
  isEditChild.value = false
}

// 编辑标签
const editTag = (tag: any, index: number) => {
  childType.value = 1
  isEditChild.value = true
  tagChildForm.value = JSON.parse(JSON.stringify(tag))
  childIndex.value = index
  isShowChildDialog.value = true
}

// 删除标签
const deleteTag = (index: number) => {
  ElMessageBox.confirm('此操作将永久删除该标签, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    commentForm.value.tags.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
  }).catch(() => {})
}

// 保存子弹窗
const saveChildDialog = () => {
  const forms: any = unref(childForm)
  forms.validate((valid: boolean) => {
    if (valid) {
      if (childType.value === 0) {
        // 评价
        if (isEditChild.value) {
          commentForm.value.comments.splice(childIndex.value, 1, commentChildForm.value)
        } else {
          commentForm.value.comments.push(commentChildForm.value)
        }
      } else {
        // 标签
        if (isEditChild.value) {
          commentForm.value.tags.splice(childIndex.value, 1, tagChildForm.value)
        } else {
          commentForm.value.tags.push(tagChildForm.value)
        }
      }
      closeChildDialog()
    }
  })
}

// 关闭子弹窗
const closeChildDialog = () => {
  isShowChildDialog.value = false
  isEditChild.value = false
  childIndex.value = -1
  childType.value = -1
  commentChildForm.value = {
    title: '',
    content: '',
    customer: '',
    time: '',
    score: 0,
    memberAvatar: ''
  }
  tagChildForm.value = {
    name: '',
    count: null
  }
}
</script>

<style lang="less" scoped>
.child-container {
  margin: 1rem 0;

  .comments-container {
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;

    .comment-item {
      width: max-content;
      min-width: 35rem;
      max-width: 50rem;
      padding: 1rem;
      border: 1px solid #a8a8a8;
    }

    .tag-item {
      width: 15rem;
      padding: 1rem;
      border: 1px solid #a8a8a8;
    }

    .text-item {
      font-size: 1.6rem;
      margin: .5rem 0;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
