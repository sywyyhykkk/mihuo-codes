<template>
  <div>
    <el-drawer
      v-model="evaluateDrawerShow"
      destroy-on-close
      :show-close="false"
      direction="rtl"
      size="70%"
      @close="closeHandelDrawer"
    >
      <div class="content">
        <div class="wrap">
          <div class="row">
            <div class="left">
              <p class="label">商品名称:</p>
              <p class="info">{{ props.productInfo?.name }}</p>
            </div>
            <div class="left">
              <p class="label">星级:</p>
              <el-rate v-model="state.starRating" disabled allow-half />
              <p class="info">(根据所有星级取平均等级)</p>
            </div>
          </div>
          <div class="right">
            <el-button
              type="primary"
              :disabled="protType !== 3"
              @click="handleEvaluate('evaluate', {})"
              v-if="$getPression('generator_omsorderreply_add')"
            >添加评价
            </el-button>
          </div>
        </div>
        <div>
          <el-table
            v-loading="isTableLoading"
            stripe
            style="width: 100%"
            :height="tableHeight"
            :data="evaluateData"
            border
          >
            <el-table-column
              label="序号"
              type="index"
              align="center"
            />
            <el-table-column
              label="评价人"
              prop="memberName"
              align="center"
            />
            <el-table-column
              label="星级"
              prop="averageScore"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-rate
                  v-model="scope.row.averageScore"
                  disabled
                  allow-half
                />
              </template>
            </el-table-column>
            <el-table-column
              label="点赞数"
              prop="likes"
              align="center"
            />
            <el-table-column
              label="评价时间"
              prop="createTime"
              align="center"
              width="150"
            />
            <el-table-column
              label="评价内容"
              prop="comment"
              width="200"
            >
              <template #default="scope">
                <el-tag
                  v-if="scope.row.curation === 1"
                  type="danger"
                  size="mini"
                  disable-transitions
                  style="margin-right: .5rem"
                >精选
                </el-tag>
                <span> {{ scope.row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              align="center"
              width="250"
            >
              <template #default="scope">
                <el-button type="text" 
                @click="viewCommentDetail(scope.row)"
                v-if="$getPression('generator_omsorderreply_view')"
                >
                  查看</el-button>
                <el-button
                  type="text"
                  :disabled="protType !== 3"
                  @click="handleEvaluate('viewReply', scope.row, scope.$index)"
                >回复({{ scope.row.replyCount }})</el-button>
                <el-button
                  type="text"
                  :disabled="protType !== 3"
                  @click="handleEvaluate('edit', scope.row, scope.$index)"
                  v-if="$getPression('generator_omsorderreply_add')"
                >编辑</el-button>
                <el-button
                  type="text"
                  class="danger"
                  :disabled="protType !== 3"
                  @click="handleEvaluate('delete', scope.row)"
                  v-if="$getPression('generator_omsorderreply_del')"
                >删除</el-button>
                <el-button
                  type="text"
                  :disabled="protType !== 3"
                  :icon="scope.row.status === 0 ? 'view' : 'close'"
                  @click="showHide(scope.row.status === 1 ? 0 : 1, scope.row.id)"
                  v-if="$getPression('generator_omsorderreply_edit')"
                >
                  {{ scope.row.status === 1 ? '隐藏' : '显示' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination-new
            :current-page="+current"
            :page-size="15"
            :total="+total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-drawer>
    <!-- 添加评价和回复 -->
    <el-dialog
      v-if="addEvaluateDialog"
      v-model="addEvaluateDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="addType === 'evaluate' ? '添加评价' : addType === 'view' ? '查看评价' : addType === 'edit' ? '编辑评价' : '回复评价'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="evaluateFormRef"
        :model="state.evaluateForm"
        label-width="8rem"
        :rules="rules"
        :disabled="addType === 'view'"
      >
        <div v-show="addType === 'evaluate'">
          <p class="form-title" style="margin-top: 20px">商品</p>
          <el-form-item label="已选商品" prop="">
            {{ props.productInfo?.name }}
          </el-form-item>
          <el-form-item label="选择sku" prop="skuId">
            <el-select
              v-model="state.evaluateForm.skuId"
              placeholder="请选择商品sku"
            >
              <el-option
                v-for="item in props.skuData"
                :key="item.id"
                :label="JSON.parse(item.spData).map((sku: any) => `${sku.key}: ${sku.value}`).join('，')"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <p class="form-title">评价</p>
        </div>
        <div>
          <el-form-item label="精选评论" prop="curation">
            <el-switch
              v-model="state.evaluateForm.curation"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item v-if="addType !== 'reply'" label="评价星级" prop="productScore">
            <el-rate v-model="state.evaluateForm.productScore" style="margin-top: 1.2rem !important;" allow-half />
          </el-form-item>
          <el-form-item
            label="用户名称"
            prop="memberName"
          >
            <el-input
              v-model="state.evaluateForm.memberName"
              placeholder="请输入用户名称"
            />
          </el-form-item>
          <el-form-item
            label="头像"
            prop="memberAvatar"
          >
            <uploadImage
              v-model="state.evaluateForm.memberAvatar"
              :max-count="1"
              :is-edits="true"
              :disabled="addType === 'view'"
            />
          </el-form-item>
          <el-form-item label="点赞数" prop="likes">
            <el-input
              v-model="state.evaluateForm.likes"
              placeholder="请输入点赞数"
              oninput="value = value.replace(/^(0+)|[^\d]+/g,'')"
            />
          </el-form-item>
          <el-form-item
            label="时间"
            prop="createTime"
          >
            <el-date-picker
              v-model="state.evaluateForm.createTime"
              type="datetime"
              placeholder="请选择时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
            />
          </el-form-item>
          <el-form-item
            label="图片"
            prop="pics"
          >
            <div v-if="addType === 'view'">
              <el-image
                v-for="(m, i) in state.evaluateForm.pics?.split(',')"
                :key="i"
                style="width: 10rem !important; margin:0 2rem 2rem 0 !important;"
                :preview-src-list="imgSrcList(state.evaluateForm.pics)"
                :initial-index="i"
                fit="cover"
                :src="$getUrl.getPicUrl(m)"
              />
            </div>
            <uploadImage
              v-else
              v-model="state.evaluateForm.pics"
              :max-count="9"
              :is-edits="true"
            />
          </el-form-item>
          <el-form-item
            label="内容"
            prop="comment"
          >
            <el-input
              v-model="state.evaluateForm.comment"
              maxlength="500"
              placeholder="请输入内容"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            v-if="addType === 'evaluate'"
            label="评价标签"
            prop="tags"
          >
            <el-select
              v-model="state.evaluateForm.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请输入评价标签"
            >
              <el-option
                v-for="tag in state.evaluateForm.tags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addEvaluateDialog = false">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看回复 -->
    <el-dialog
      v-if="viewCommentReply"
      v-model="viewCommentReply"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="查看回复"
      width="60vw"
      destroy-on-close
    >
      <el-button
        :disabled="protType !== 3"
        style="margin: 1rem 0"
        @click="handleEvaluate('reply', state.currentComment, state.commentIndex)"
      >添加回复
      </el-button>
      <el-table
        stripe
        style="width: 100%"
        height="400"
        :data="currentCommentReplies"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
        />
        <el-table-column
          label="评价人"
          prop="memberName"
          align="center"
        />
        <el-table-column
          label="星级"
          prop="averageScore"
          align="center"
          width="200"
        >
          <template #default="scope">
            <el-rate v-model="scope.row.averageScore" disabled allow-half />
          </template>
        </el-table-column>
        <el-table-column
          label="点赞数"
          prop="likes"
          align="center"
        />
        <el-table-column
          label="评价时间"
          prop="createTime"
          align="center"
          width="150"
        />
        <el-table-column
          label="评价内容"
          prop="comment"
          width="200"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.curation === 1"
              type="danger"
              size="mini"
              disable-transitions
              style="margin-right: .5rem"
            >精选
            </el-tag>
            <span> {{ scope.row.comment }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        style="position: relative"
        :current-page="+currentReplyPage.current"
        :page-size="10"
        :total="+currentReplyPage.total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleReplyCurrentChange"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="viewCommentReply = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus/lib/components'
import {
  defineEmits,
  defineProps,
  reactive,
  onMounted,
  watchEffect,
  ref,
  provide,
  inject
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/utils/utils'
import { ElMessageBox } from 'element-plus'
import { now } from 'moment'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  skuData: {
    type: Array,
    default: () => []
  },
  productInfo: {
    type: Object,
    default: () => {}
  },
  protType: {
    //	type=1平台，type=2企业,type=3运营
    type: Number,
    default: 2
  }
})
const emit = defineEmits(['getData', 'update:modelValue'])
const evaluateDrawerShow = ref<boolean>(false)
const addEvaluateDialog = ref<boolean>(false)
const viewCommentReply = ref<boolean>(false)
const evaluateFormRef = ref<any>('')
const evaluateData = ref<any>([])
const addType = ref<any>([])
const isTableLoading = ref(false)
const tableHeight = ref(0)

const getHeight = () => {
  tableHeight.value = document.documentElement.clientHeight - 210
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

// 查看评论内容详情
const viewCommentDetail = (row: any) => {
  addType.value = 'view'
  state.evaluateForm = JSON.parse(JSON.stringify(row))
  state.evaluateForm.tags = state.evaluateForm.tags?.split(',')
  addEvaluateDialog.value = true
}

const state = reactive({
  starRating: props.productInfo?.newScore,
  evaluateForm: {
    memberId: '0',
    productScore: 5,
    tags: '',
    curation: 0 // 是否精选评价 0=否 1=是
  } as any,
  userInfo: {} as any,
  commentIndex: 0,
  commentId: null,
  replyIndex: 0,
  sameDay: '' as any,
  currentComment: {} as any // 当前选择的评价
})

const rules = reactive({
  comment: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
  memberName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }]
})

// 需要禁选的分钟
const disabledMinutes = () => {
  let arrs = [] as any
  const n = evaluateData.value[state.commentIndex]?.replyData?.length
  const createTime1 = evaluateData.value[state.commentIndex]?.createTime
  const createTime2 = state.currentComment.createTime
  if (addType.value === 'reply') {
    for (let i = 0; i < 60; i++) {
      if (n) {
        // 禁用之前,如果有回复，当前回复不可提前于最后一条回复（仅限制同一天）
        if (i <= new Date(createTime2).getMinutes()) {
          if (state.evaluateForm.createTime?.slice(11, 13) === createTime2?.slice(11, 13)) {
            arrs.push(i)
            // 若已是最后一秒，禁用当前分钟(只限制到分钟，先注释，需要再放开)
            // if(createTime2?.slice(17, 19) == 59){
            // 	arrs.unshift(Number(createTime2?.slice(14, 16)))
            // }
          } else {
            arrs = []
          }
        }
      } else {
        // 第一条回复时间不可提前于评价时间
        if (i <= new Date(createTime1).getMinutes()) {
          if (state.evaluateForm.createTime?.slice(11, 13) === createTime1?.slice(11, 13)) {
            arrs.push(i)
          } else {
            arrs = []
          }
        }
      }
    }
  } else if (addType.value === 'edit') {
    for (let i = 0; i < 60; i++) {
      if (state.replyIndex === 0) {
        // 第一条回复时间不可提前于评价时间
        if (i <= new Date(createTime1).getMinutes()) {
          if (state.evaluateForm.createTime?.slice(11, 13) === createTime1?.slice(11, 13)) {
            arrs.push(i)
          } else {
            arrs = []
          }
        }
      }
    }
  }
  return [...new Set(arrs)]
}

// 需要禁选的小时
const disabledHours = () => {
  let arrs = [] as any
  const n = currentCommentReplies.value.length
  const createTime1 = evaluateData.value[state.commentIndex]?.createTime
  const createTime2 = state.currentComment.createTime
  if (addType.value === 'reply') {
    for (let i = 0; i < 24; i++) {
      if (n) {
        // 禁用之前,如果有回复，当前回复不可提前于最后一条回复（仅限制同一天）
        if (i < new Date(createTime2).getHours()) {
          if (state.evaluateForm.createTime?.slice(8, 10) === createTime2?.slice(8, 10)) {
            arrs.push(i)
            // 若已是最后一分钟，禁用当前小时
            if (createTime2?.slice(14, 16) === 59) {
              arrs.unshift(Number(createTime2?.slice(11, 13)))
            }
          } else {
            arrs = []
          }
        }
      } else {
        // 第一条回复时间不可提前于评价时间
        if (i < new Date(createTime1).getHours()) {
          if (state.evaluateForm.createTime?.slice(8, 10) === createTime1?.slice(8, 10)) {
            arrs.push(i)
            if (Number(createTime1?.slice(14, 16)) < 59) {
              arrs.unshift(Number(createTime1?.slice(8, 10)))
            }
          } else {
            arrs = []
          }
        }
      }
    }
  } else if (addType.value === 'edit') {
    for (let i = 0; i < 24; i++) {
      if (state.replyIndex === 0) {
        // 第一条回复时间不可提前于评价时间
        if (i < new Date(createTime1).getHours()) {
          if (state.evaluateForm.createTime?.slice(8, 10) === createTime1?.slice(8, 10)) {
            arrs.push(i)
            if (Number(createTime1?.slice(14, 16)) < 59) {
              arrs.unshift(Number(createTime1?.slice(8, 10)))
            }
          } else {
            arrs = []
          }
        }
      }
    }
  }
  return [...new Set(arrs)]
}

// 需要禁选的日期
const disabledDate = (time: any) => {
  const oneDayTime = 24 * 60 * 60 * 1000
  const n = evaluateData.value[state.commentIndex]?.replyData?.length
  if (addType.value === 'reply') {
    if (n) {
      // 如果有回复，当前回复不可提前于最后一条回复
      return (
        new Date(
          evaluateData.value[state.commentIndex]?.replyData[n - 1]?.createTime
        ).getTime() -
          oneDayTime >
        time.getTime()
      )
    }
    // 第一条回复时间不可提前于评价时间
    return (
      new Date(evaluateData.value[state.commentIndex].createTime).getTime() -
        oneDayTime >
      time.getTime()
    )
  } else if (addType.value === 'edit') {
    if (n > 1 && state.replyIndex > 0) {
      // 如果有上一条的编辑，当前编辑回复时间不可提前于上一条回复时间
      return (
        new Date(
          evaluateData.value[state.commentIndex].replyData[
            state.replyIndex - 1
          ].createTime
        ).getTime() -
          oneDayTime >
        time.getTime()
      )
    } else if (state.replyIndex === 0) {
      // 第一条回复时间不可提前于评价时间
      return (
        new Date(evaluateData.value[state.commentIndex].createTime).getTime() -
          oneDayTime >
        time.getTime()
      )
    }
  }
  // return time.getTime() - oneDayTime < Date.now()
}

// 当前查看评论的回复
const currentCommentReplies = ref([]) as any

// 当前评价回复分页
const currentReplyPage = ref({
  current: 1,
  total: 0
})
// 查询当前回复
const toViewReply = async (id: any) => {
  await fetch({
    url: '/mall/omsorderreply/getReplies',
    method: 'get',
    params: {
      commentId: id,
      current: currentReplyPage.value.current
    }
  })
    .then((res: any) => {
      if (res.code === 0) {
        currentReplyPage.value.total = res.data.total
        currentCommentReplies.value = res.data.records
      }
    })
}

const imgSrcList = (urls: any) => {
  const arr = [] as any
  try {
    const imgArr = JSON.parse(urls)
    imgArr.forEach((item: any) => {
      arr.push(thumbnailImage(item.url, false))
    })
    return arr
  } catch (e) {
    urls?.split(',').forEach((item: any) => {
      arr.push(thumbnailImage(item, false))
    })
    return arr
  }
}

// 保存表单
const submit = async () => {
  if (typeof state.evaluateForm.tags === 'object') {
    state.evaluateForm.tags = state.evaluateForm.tags?.join(',')
  }
  state.evaluateForm.deliveryScore = state.evaluateForm.serviceScore =
    state.evaluateForm.productScore
  state.evaluateForm.productId = props.productInfo?.id
  state.evaluateForm.type = 0
  const data = {
    serviceType: 0,
    orderId: 0,
    ...state.evaluateForm
  }
  await evaluateFormRef.value.validate((valid: any) => {
    if (valid) {
      fetch({
        url: '/mall/omsorderreply/add',
        method: 'post',
        data
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功')
          addEvaluateDialog.value = false
          getEvaluatePage()
          // 更新当前查看的评价回复数据
          toViewReply(state.commentId)
        }
      })
    }
  })
}

const current = ref(1)
const total = ref(1)

const handleCurrentChange = (val: any) => {
  current.value = val
  getEvaluatePage()
}

const handleReplyCurrentChange = (val: any) => {
  currentReplyPage.value.current = val
  toViewReply(state.commentId)
}

// 获取评价分页信息
const getEvaluatePage = async () => {
  isTableLoading.value = true
  await fetch({
    url: '/mall/omsorderreply/getComments',
    method: 'get',
    params: {
      type: 0,
      current: current.value,
      size: 15,
      productId: props.productInfo?.id
    }
  }).then((res: any) => {
    if (res.code === 0) {
      isTableLoading.value = false
      total.value = res.data.total
      evaluateData.value = res.data.records
    }
  })
}

const getUserInfo = async () => {
  await fetch({
    url: '/admin/person/getPersonInfo',
    method: 'get'
  }).then((res: any) => {
    if (res.code === 0) {
      state.userInfo = res.data
      state.evaluateForm.memberId = res.data.userId
      state.evaluateForm.memberAvatar = res.data.avatar
      state.evaluateForm.memberName = res.data.realName
    }
  })
}

watch(
  () => addEvaluateDialog.value,
  (nval) => {
    if (!nval) {
      state.evaluateForm = {}
      evaluateFormRef.value.resetFields()
    } else {
      // 不理解这里为什么要这样, 先注释了
      // getUserInfo()
    }
  }
)

// 删除评价
const deleteEvaluate = async (id: any) => {
  await ElMessageBox.confirm(`此操作将永久删除该评价, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fetch({
      url: '/mall/omsorderreply/delByIds',
      method: 'post',
      data: {
        ids: id.split(),
        status: 0
      }
    }).then((res: any) => {
      if (res.code === 0 && res.data) {
        ElMessage({
          type: 'success',
          message: `删除成功!`
        })
        getEvaluatePage()
      } else {
        ElMessage.warning('删除失败')
      }
    })
  })
}

// 显示隐藏
const showHide = async (status: number, id: any) => {
  await fetch({
    url: '/mall/omsorderreply/editByStatus',
    method: 'post',
    data: {
      status: status,
      ids: id.split()
    }
  }).then((res: any) => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: `操作成功!`
      })
      getEvaluatePage()
    }
  })
}

// 添加评价或回复
const handleEvaluate = (type: string, item: any, i?: number, ii?: number) => {
  addType.value = type
  state.currentComment = item
  switch (type) {
    case 'evaluate':
      state.evaluateForm.productScore = 5
      addEvaluateDialog.value = true
      break
    case 'reply':
      const index = currentCommentReplies.length
      if (index > 0) {
        // 第一人条回复commentId，replyId取评论id，第二人回复第一人，replyId取第一人的id，第三人回复第二人，replyId取第二人的id
        state.evaluateForm.commentId = item.id
        state.evaluateForm.replyId = evaluateData.value[i!]?.replyData[index]?.id
      } else {
        // 没回复过取当前评论的id
        state.evaluateForm.commentId = state.evaluateForm.replyId = item.id
      }
      state.evaluateForm.memberId = state.userInfo.memberId || '0'
      state.evaluateForm.memberName = state.userInfo.memberName
      state.evaluateForm.memberAvatar = state.userInfo.memberAvatar
      addEvaluateDialog.value = true
      break
    case 'edit':
      state.evaluateForm = JSON.parse(JSON.stringify(item))
      state.evaluateForm.tags = state.evaluateForm.tags?.split(',')
      state.commentIndex = i || -1
      state.replyIndex = ii || -1
      addEvaluateDialog.value = true
      break
    case 'delete':
      deleteEvaluate(item.id)
      break
    case 'viewReply':
      state.commentId = item.id
      state.commentIndex = i || 0
      toViewReply(state.commentId)
      viewCommentReply.value = true
      break
    default:
      addEvaluateDialog.value = false
      break
  }
}

onMounted(() => {
  evaluateDrawerShow.value = props.modelValue
  if (evaluateDrawerShow.value) {
    getEvaluatePage()
  }
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
  emit('getData')
}
</script>

<style scoped lang="less">
/deep/.el-drawer__header {
  margin: 0;
  padding: 0;
  height: 0 !important;
}
/deep/.el-drawer__body {
  padding: 0;
}
/deep/.el-rate {
  height: 10px;
}

.content {
  background: #f8f6f6;
  .wrap {
    background: #ffffff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
  }
  .item {
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
  }
  .row {
    flex: 10;
    .left {
      padding: 5px 0;
      display: flex;
      align-items: center;

      .label {
        font-size: 1.6rem;
      }

      .info {
        font-size: 1.4rem;
        color: #333333;
      }

      .label,
      .info {
        margin-right: 1rem;
        text-align: justify;
        font-weight: 500;
      }
    }
  }
  .right {
    flex: 2;
    text-align: right;
  }
}
.view-empty {
  text-align: center;
  padding: 20px 0;
}
.view-btn {
  text-align: center;
  line-height: 40px;
  .view-remaining {
    border: none;
    background: transparent;
  }
}

.reply-btn {
  padding: 0 24px 10px;
  .el-button {
    width: 100%;
  }
}
.form-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
