<template>
  <div>
    <div class="app-container">
      <el-card>
        <div>
          <i class="el-icon-search" />
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            class="btn-add"
            size="small"
            :type="buttonType"
            icon="Search"
            @click="searchBrandList()"
          >
            查询
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            label-width="140px"
          >
            <el-form-item label="输入搜索">
              <el-input
                v-model="listQuery.keyword"
                style="width: 203px"
                placeholder="品牌名称/关键字"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card
        class="operate-container"
        style="margin-top: 10px"
        shadow="never"
      >
        <i class="el-icon-tickets" />
        <span>数据列表</span>
        <!--        <el-button-->
        <!--          class="btn-add"-->
        <!--          size="mini"-->
        <!--          :type="buttonType"-->
        <!--          style="float: right"-->
        <!--          -->
        <!--          @click="addBrand()"-->
        <!--        >-->
        <!--          添加-->
        <!--        </el-button>-->
      </el-card>
      <div>
        <el-table
          stripe
          ref="brandTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60" align="center" />
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <!--          <el-table-column label="编号" width="100" align="center">-->
          <!--            <template #default="scope">{{ scope.row.id }}</template>-->
          <!--          </el-table-column>-->
          <el-table-column label="品牌名称" align="center">
            <template #default="scope">{{ scope.row.brandName }}</template>
          </el-table-column>
          <!--          <el-table-column label="品牌首字母" width="100" align="center">-->
          <!--            <template #default="scope">{{ scope.row.firstLetter }}</template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="品牌logo" width="120" align="center">-->
          <!--            <template #default="scope">-->
          <!--              <el-image
preview-teleported-->
          <!--                lazy-->
          <!--                :src="scope.row.logo"-->
          <!--                :preview-src-list="scope.row.logo.split(',')"-->
          <!--              />-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="品牌专区大图" width="120" align="center">-->
          <!--            <template #default="scope">-->
          <!--              &lt;!&ndash;              <img style="height: 80px" :src="scope.row.bigPic">&ndash;&gt;-->
          <!--              <el-image
preview-teleported-->
          <!--                lazy-->
          <!--                :src="scope.row.bigPic"-->
          <!--                :preview-src-list="scope.row.bigPic.split(',')"-->
          <!--              />-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="是否推荐" width="120" align="center">
            <template #default="scope">
              <p @click="handleecommendType(scope.row)">
                <el-switch
                  v-model="scope.row.recommendStatus"
                  :active-value="0"
                  :inactive-value="1"
                  :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                />
              </p>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100" align="center">
            <template #default="scope">{{ scope.row.sort }}</template>
          </el-table-column>
          <!--          <el-table-column label="品牌制造商" width="100" align="center">-->
          <!--            <template #default="scope">-->
          <!--              <el-switch-->
          <!--                v-model="scope.row.factoryStatus"-->
          <!--                :active-value="1"-->
          <!--                :inactive-value="0"-->
          <!--              />-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="是否显示" width="100" align="center">-->
          <!--            <template #default="scope">-->
          <!--              <el-switch-->
          <!--                v-model="scope.row.showStatus"-->
          <!--                :active-value="1"-->
          <!--                :inactive-value="0"-->
          <!--              />-->
          <!--            </template>-->
          <!--          </el-table-column>-->
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
                编辑
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
        v-if="dialogVisible"
        v-model="dialogVisible"
        :title="dialogTitle"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="90px"
        >
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="form.brandName" disabled />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="form.sort" type="number" />
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-radio-group v-model="form.recommendStatus">
              <el-radio :label="1">否</el-radio>
              <el-radio :label="0">是</el-radio>
            </el-radio-group>
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
import { imageGlobal } from '@/global'

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
      imageGlobal: imageGlobal,
      tableType: 0,
      pageType: 0,
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        brandId: 0,
        id: 0,
        recommendStatus: 0,
        sort: 0,
        type: props.protType,
        // cityOperatorId:props.cityOperatorId
      },
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10,
      },
    })
    const rules = reactive({
      // brandName: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const addBrand = () => {
      state.dialogVisible = true
      state.dialogTitle = '添加品牌推荐'
      state.isEdit = false
    }
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑品牌推荐'
      state.isEdit = true
      state.form = { ...row }
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除此条数据, 是否继续?`, '提示', {
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
      await fetch({
        url: '/mall/home_brand/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          // companyId: props.companyId,
          type: props.protType,
          // cityOperatorId:props.cityOperatorId
        },
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
        // console.log(res.data.records)
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/home_brand',
        method: 'put',
        data: {
          id: state.form.id,
          brandId: state.form.brandId,
          recommendStatus: state.form.recommendStatus,
          sort: state.form.sort,
        },
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('品牌推荐编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/home_brand/' + id,
        method: 'delete',
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
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            addData()
          }
          if (state.isEdit) {
            editData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }

    const handleecommendType = async (row: any) => {
      console.log(row)
      await fetch({
        url: '/mall/home_brand',
        method: 'put',
        data: {
          id: row.id,
          brandId: row.brandId,
          recommendStatus: row.recommendStatus,
          sort: row.sort,
        },
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('编辑成功')
          getData()
        } else {
          getData()
          ElMessage.error(res.msg)
        }
      })
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 250
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
      handleecommendType,
      handleConfirm,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
:deep(.el-dialog) {
  height: 50vh;
  overflow: auto;
}
</style>
