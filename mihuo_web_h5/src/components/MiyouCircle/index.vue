<template>
  <div>
    <el-card>
      <el-input v-model="formTop.userNickName" placeholder="请输入发布者姓名" />
      <el-input v-model="formTop.title" placeholder="请输入觅友圈主题" />
      <el-select v-model="formTop.verifyStatus" placeholder="审核状态">
        <el-option
          v-for="item in [
            { value: 0, label: '待审核' },
            { value: 1, label: '审核通过' },
            { value: 2, label: '审核未通过' }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-if="$getPression('basic_basicfindcircle_add')"
        type="primary"
        icon="plus"
        @click="addNewOne"
      >新增觅友圈</el-button>
      <el-button type="primary" icon="search" @click="getData">查询</el-button>
      <el-button icon="refreshLeft" @click="reset">重置</el-button>
    </el-card>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData"
      border
      height="'0'"
      style="width: 100%; height: calc(100vh - 23rem) !important"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      />
      <el-table-column prop="userNickName" label="姓名" align="center" />
      <el-table-column label="主题" prop="title" align="center" />
      <el-table-column label="来源" prop="userId" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.userId < 0"
            type="warning"
          >平台
          </el-tag>
          <el-tag
            v-else
            type="success"
          >用户
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
        align="center"
        width="200"
      />
      <el-table-column prop="verifyReason" label="审核意见" align="center" />
      <el-table-column prop="auditStatus" label="审核状态" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.verifyStatus === 1"
            type="success"
          >审核通过
          </el-tag>
          <el-tag
            v-if="scope.row.verifyStatus === 2"
            type="danger"
          >审核不通过
          </el-tag>
          <el-tag
            v-if="scope.row.verifyStatus === 0"
            type="warning"
          >待审核
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="350"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            icon="view"
            @click="open(scope.row)"
          >查看
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="edit"
            :disabled="scope.row.userId > 0"
            @click="editMiyou(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            icon="comment"
            @click="manageComment(scope.row)"
          >评论管理
            ({{ scope.row.commentCount }})
          </el-button>
          <el-button
            v-if="$getPression('basic_basicfindcircle_edit')"
            type="text"
            icon="edit"
            size="small"
            @click="audit(scope.row)"
          >
            审核
          </el-button>
          <el-button
            v-if="$getPression('basic_basicfindcircle_del')"
            :disabled="scope.row.userId > 0"
            type="text"
            class="danger"
            icon="delete"
            @click="deleteMiyou(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pageSize"
      :total="+total"
      @current-change="handleCurrentChange"
    />
    <MiyouDetailDialog
      v-if="enterpriseExamineVue"
      ref="enterpriseExamineRef"
      v-model="enterpriseExamineVue"
      :row="forms"
      @getData="getData"
      @hideDialog="hideDialog"
    />
    <MiyouCommentDialog
      v-if="isShowCommentDialog"
      v-model="isShowCommentDialog"
      :row="forms"
      @getData="getData"
    />
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      destroy-on-close
      title="提示"
      :before-close="handleClose"
    >
      <div class="item-input">
        <div class="item-input-label">审核意见</div>
        <div class="item-input-value">
          <el-input
            v-model="auditRemark"
            type="textarea"
            border="0"
            class="paperview-input-text"
            placeholder="请输入审核意见"
            style="width: 90%; height: 80px"
            :input-style="{ border: '0' }"
            :clearable="clearable"
            :autosize="{ minRows: 3, maxRows: 6 }"
            show-word-limit
          />
        </div>
      </div>
      <el-radio-group v-model="auditStatusV">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">审核未通过</el-radio>
      </el-radio-group>
      <div style="height: 2rem" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="audits()">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-if="isShowAddDialog"
      v-model="isShowAddDialog"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="miyouForm.id ? '编辑觅友圈' : '新增觅友圈'"
      @close="hideDialog"
    >
      <div style="height: 70vh; overflow-y: scroll; padding: 2rem;">
        <el-form
          ref="miyouFormRef"
          :model="miyouForm"
          label-width="10rem"
          :rules="formRules"
        >
          <el-form-item label="用户名称" prop="userNickName">
            <el-input
              v-model="miyouForm.userNickName"
              maxlength="20"
              placeholder="请输入用户名称"
            />
          </el-form-item>
          <el-form-item label="用户头像" prop="userAvatar">
            <uploadImage
              v-model="miyouForm.userAvatar"
              :max-count="1"
              :is-edits="true"
            />
          </el-form-item>
          <el-form-item label="封面图" prop="images">
            <uploadImage
              v-model="miyouForm.images"
              :max-count="1"
              :is-edits="true"
            />
          </el-form-item>
          <el-form-item label="话题" prop="topics">
            <el-select
              v-model="miyouForm.topics"
              multiple
              clearable
              filterable
              allow-create
              remote
              :remote-method="getTagByKeyword"
              placeholder="请选择觅友圈话题"
              multiple-limit="2"
              value-key="series"
            >
              <el-option
                v-for="(item, index) in miyouTags"
                :key="index"
                :label="item.content"
                :value="item.content"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="miyouForm.title"
              maxlength="30"
              placeholder="请输入觅友圈标题"
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <AppTextEdit v-model="miyouForm.content" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveDialog">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, unref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMiyouPage,
  auditsMiyou
} from '@/pages/admin/api/miyouAudio'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  setup() {
    // 是否显示觅友圈评论弹窗
    const isShowCommentDialog = ref(false)
    const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const enterpriseExamineVue = ref<boolean>(false)
    const clearable = ref<boolean>(true)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(1)
    const auditId = ref<number | undefined>(0)
    const auditRemark = ref<string>('')
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pageSize = ref<number>(15)

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }

    const formTop = ref({
      userNickName: '',
      title: '',
      verifyStatus: ''
    })

    const reset = () => {
      formTop.value = {
        userNickName: '',
        title: '',
        verifyStatus: ''
      }
      getData()
    }

    const isShowAddDialog = ref(false)
    const miyouFormRef = ref('')
    const miyouForm = ref({
      id: '',
      userAvatar: '',
      userId: -1,
      userNickName: '',
      images: '',
      content: '[]', // 觅友圈内容
      topics: [], // 觅友圈话题
      title: '' // 觅友圈标题
    })

    const keyword = ref('')

    // 远程搜索觅友圈话题
    const getTagByKeyword = (str: any) => {
      if (str) {
        keyword.value = str
        getMiyouTags()
      } else {
        keyword.value = ''
        getMiyouTags()
      }
    }

    const formRules = ref({
      userNickName: [
        { required: true, message: '请输入用户名称', trigger: 'blur' }
      ],
      userAvatar: [
        { required: true, message: '请上传用户头像', trigger: 'blur' }
      ],
      images: [
        { required: true, message: '请上传封面图', trigger: 'blur' }
      ],
      title: [
        { required: true, message: '请输入觅友圈标题', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请维护觅友圈内容', trigger: 'blur' }
      ],
      topics: [
        { required: true, message: '请选择觅友圈话题', trigger: 'blur' }
      ]
    })

    // 觅友圈话题
    const miyouTags = ref([])

    // 获取觅友圈话题
    const getMiyouTags = async () => {
      await fetch({
        url: '/mall/smsfindcircle/admin/topic/page',
        method: 'get',
        params: {
          current: 1,
          size: 10,
          keyword: keyword.value
        }
      }).then((res: any) => {
        if (res.code === 0) {
          miyouTags.value = res.data.records
        }
      })
    }

    // 编辑觅友圈
    const editMiyou = (row: any) => {
      miyouForm.value = JSON.parse(JSON.stringify(row))
      miyouForm.value.images = row.images[0].url
      isShowAddDialog.value = true
    }

    // 删除觅友圈
    const deleteMiyou = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.title}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await fetch({
          url: 'mall/smsfindcircle/admin/remove?circleId=' + row.id,
          method: 'delete'
        }).then((res: any) => {
          if (res.data) {
            ElMessage.success('删除成功')
            getData()
          } else {
            ElMessage.error(res.msg)
          }
        })
      }).catch(e => {})
    }

    // 新增觅友圈
    const addNewOne = async () => {
      isShowAddDialog.value = true
    }

    // 保存弹窗
    const saveDialog = () => {
      const forms: any = unref(miyouFormRef)
      forms.validate(async (valid: Boolean) => {
        if (miyouForm.value.content === '[]') {
          ElMessage.warning('请维护觅友圈内容')
          return
        }
        if (valid) {
          if (miyouForm.value.id) {
            await editData()
          } else {
            await addData()
          }
        }
      })
    }

    // 编辑觅友圈
    const editData = async () => {
      const form = JSON.parse(JSON.stringify(miyouForm.value))
      // 这里images只会有一张
      form.images = [{
        type: 'img',
        url: form.images
      }]
      await fetch({
        url: 'mall/smsfindcircle/admin/modify',
        method: 'put',
        data: form
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('编辑觅友圈成功')
          closeDialog()
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    // 新增觅友圈
    const addData = async () => {
      const form = JSON.parse(JSON.stringify(miyouForm.value))
      // 这里images只会有一张
      form.images = [{
        type: 'img',
        url: form.images
      }]
      await fetch({
        url: 'mall/smsfindcircle/admin/publish',
        method: 'post',
        data: form
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('新增觅友圈成功')
          closeDialog()
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    // 关闭弹窗
    const closeDialog = () => {
      isShowAddDialog.value = false
      miyouForm.value = {
        id: '',
        userAvatar: '',
        userId: -1,
        userNickName: '',
        images: '',
        content: '[]', // 觅友圈内容
        topics: [], // 觅友圈话题
        title: '' // 觅友圈标题
      }
    }

    // 获取数据
    const getData = async () => {
      const res = await getMiyouPage({
        size: pageSize.value,
        current: currentPage.value,
        cityOperatorId: cityOperatorId.value,
        'orders[0].asc': false,
        'orders[0].column': 'create_time',
        ...formTop.value
      })
      if (res) {
        state.tableData = res.data.records
        state.loading = false
        total.value = res.data.total
      }
    }

    // 显示审核弹窗
    const audit = (row: any) => {
      dialogVisible.value = true
      auditRemark.value = ''
      auditStatusV.value = row.verifyStatus || 2
      auditId.value = Number(row.id)
    }

    // 确认审核
    const audits = () => {
      auditsMiyou({
        id: auditId.value,
        reason: auditRemark.value,
        status: auditStatusV.value
      }).then((res: any) => {
        if (res && res.code === 0) {
          if (auditStatusV.value === 2) {
            ElMessage.success({
              message: '操作成功',
              type: 'success'
            })
          } else if (auditStatusV.value === 1) {
            ElMessage.success({
              message: '操作成功',
              type: 'success'
            })
          }
          dialogVisible.value = false
          getData()
        }
      })
    }

    onMounted(() => {
      getData()
      getMiyouTags()
    })

    const state = reactive({
      tableData: [],
      loading: true,
      forms: {}
    })

    const hideDialog = () => {
      enterpriseExamineVue.value = false
    }

    const open = (e: any) => {
      enterpriseExamineVue.value = true
      state.forms = JSON.parse(JSON.stringify(e))
    }

    // 关闭审核觅友圈弹窗
    const handleClose = () => {
      dialogVisible.value = false
    }

    // 管理评论
    const manageComment = (row: any) => {
      state.forms = JSON.parse(JSON.stringify(row))
      isShowCommentDialog.value = true
    }

    return {
      miyouTags,
      miyouFormRef,
      miyouForm,
      formRules,
      isShowCommentDialog,
      cityOperatorId,
      formTop,
      total,
      pageSize,
      auditId,
      auditRemark,
      clearable,
      auditStatusV,
      dialogVisible,
      currentPage,
      enterpriseExamineRef,
      enterpriseExamineVue,
      isShowAddDialog,
      getTagByKeyword,
      editMiyou,
      deleteMiyou,
      saveDialog,
      closeDialog,
      addNewOne,
      manageComment,
      hideDialog,
      reset,
      getData,
      audits,
      audit,
      open,
      handleCurrentChange,
      handleClose,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped>
.item-input-label {
  margin: 2rem 0;
}

.user-header {
  cursor: pointer;
}

:deep(.el-image__error) {
  font-size: 12px;
  background: #ffffff;
}
.paperview-input-text :deep(.el-input__inner) {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 0px;
  width: 100%;
}
</style>
