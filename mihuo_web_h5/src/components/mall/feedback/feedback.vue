<template>
  <div>
    <div class="app-container">
      <el-card>
        <el-input
          v-model="listQuery.keyword"
          style="width: 203px"
          placeholder="品牌名称/关键字"
        />
        <el-button
          style="margin-left: 10px"
          class="btn-add"
          size="small"
          :type="buttonType"
          icon="Search"
          @click="searchBrandList()"
        >
          查询
        </el-button>
      </el-card>
      <div style="margin-top: 10px">
        <el-table
          stripe
          ref="brandTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%; max-height: 1000px !important"
          border
          @selection-change="handleSelectionChange"
        >
          <!--          <el-table-column type="selection" width="60" align="center" />-->
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column label="反馈意见" align="center">
            <template #default="scope">{{ scope.row.description }}</template>
          </el-table-column>
          <el-table-column label="意见类型" align="center">
            <template #default="scope">
              <el-tag
                style="
                  margin-left: 5px;
                  margin-top: 5px;
                  background: linear-gradient(to right, #fd8e4b, #fd6d34);
                  color: white;
                "
                type="primary"
                size="mini"
                disable-transitions
                >{{
                  scope.row.problemType === 1001
                    ? '功能异常'
                    : scope.row.problemType === 1002
                    ? '优化建议'
                    : '其他反馈'
                }}
              </el-tag>
            </template>
            <!--            1001->功能异常；1002->优化建议；1003->其他反馈-->
          </el-table-column>
          <el-table-column label="意见图片" width="120" align="center">
            <template #default="scope">
              <el-image
                preview-teleported
                style="width: 100px; height: 100px"
                lazy
                :src="$getUrl.getPicUrl(scope.row.urls, true)"
                :preview-src-list="$getUrl.getPicUrl(scope.row.urls)"
              />
            </template>
          </el-table-column>

          <el-table-column label="是否回复" align="center">
            <template #default="scope">
              <el-tag
                style="
                  margin-left: 5px;
                  margin-top: 5px;
                  background: linear-gradient(to right, #fd8e4b, #fd6d34);
                  color: white;
                "
                type="primary"
                size="mini"
                disable-transitions
                >{{ scope.row.isReply == 0 ? '未回复' : '已回复' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="回复内容" align="center">
            <template #default="scope">{{
              scope.row.merchantReplyContent
            }}</template>
          </el-table-column>
          <el-table-column label="联系电话" align="center">
            <template #default="scope">{{ scope.row.phone }}</template>
          </el-table-column>

          <el-table-column
            label="操作"
            fixed="right"
            width="200"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                icon="edit"
                @click="handleUpdate(scope.row)"
              >
                回复
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="delete"
                class="danger"
                @click="handleDelete(scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination-new
          :current-page="currentPage"
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-model="dialogVisible"
        :title="dialogTitle"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="90px"
        >
          <el-form-item label="回复意见" prop="name">
            <el-input v-model="form.merchantReplyContent" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect,
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
// import uploadImage from '@/components/UploadFile/uploadImage.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'

export default defineComponent({
  components: { uploadFile },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2,
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0,
    },
    buttonType: {
      type: String,
      default: 'primary',
    },
    cityOperatorId: {
      type: Number || String,
      default: '',
    },
  },
  setup(props) {
    const ruleForms = ref<any>('')
    const state = reactive({
      tableType: 0,
      pageType: 0,
      tableData: [] as any,
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        id: 0,
        merchantReplyContent: '',
      },
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10,
      },
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const addBrand = () => {
      state.dialogVisible = true
      state.dialogTitle = '添加意见'
      state.isEdit = false
    }
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '意见回复'
      state.isEdit = true
      state.form.id = row.id
      state.form.merchantReplyContent = row.merchantReplyContent
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteData(row.id)
      })
    }
    const addData = async () => {
      await fetch({
        url: '/mall/brand/create',
        method: 'post',
        data: state.form,
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('品牌添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/pmsfeedback/getPmsFeedbackPage',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          type: props.protType,
        },
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/pmsfeedback/updateById',
        method: 'post',
        data: state.form,
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('回复成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/pmsfeedback/removeById/' + id,
        method: 'get',
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleConfirm = () => {
      ruleForms.value.validate((valid: any) => {
        // if (valid) {
        console.log(state.form)
        if (!state.isEdit) {
          addData()
        }
        if (state.dialogTitle) {
          editData()
        }
        // } else {
        //   alert('请完善信息')
        //   return false
        // }
      })
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 220
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    onMounted(() => {
      getData()
    })
    return {
      rules,
      ruleForms,
      addData,
      getData,
      editData,
      deleteData,
      addBrand,
      handleUpdate,
      handleDelete,
      handleCurrentChange,
      handleConfirm,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>

