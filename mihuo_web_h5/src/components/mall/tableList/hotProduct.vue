<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <el-button
        v-if="$getPression('home_hot_sale_add')"
        class="btn-add"
        style="margin-left: 5px"
        size="mini"
        type="primary"
        icon="plus"
        @click="handleProductCate()"
      >
        添加商品
      </el-button>
    </el-card>

    <div>
      <el-table
        ref="productAttrCateTable"
        v-loading="loading"
        stripe
        :data="tableData"
        :height="tableHeight"
        border
      >
        <el-table-column
          type="index"
          width="50"
          align="center"
          label="序号"
        />
        <el-table-column label="推荐热销商品" align="center">
          <template #default="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="是否热销推荐" align="center">
          <template #default="scope">{{
            scope.row.recommendStatus === 0 ? '推荐' : '不推荐'
          }}</template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="$getPression('home_hot_sale_edit')"
              type="text"
              size="mini"
              icon="edit"
              @click="handleUpdate(scope.row)"
            > 编辑
            </el-button>
            <el-button
              v-if="$getPression('home_hot_sale_del')"
              type="text"
              size="mini"
              icon="delete"
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
      v-model="formDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="50%"
      center
    >
      <div>
        <el-form
          ref="productSaleForm"
          :model="form"
          label-width="120px"
          style="width: calc(100% - 150px)"
          size="small"
          center
        >
          <el-form-item v-if="!isEdit" label="选择企业:">
            <el-select
              v-model="companyId"
              size="small"
              filterable
              placeholder="选择企业"
              @change="getChangeCompany"
            >
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :label="item.companyName"
                :value="item.companyId"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!isEdit" label="选择商品:">
            <el-select
              v-model="form.productId"
              size="small"
              placeholder="选择商品"
              filterable
            >
              <el-option
                v-for="(item, index) in productList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isEdit" label="推荐商品">
            <el-input v-model="form.productName" disabled />
          </el-form-item>
          <el-form-item label="是否热销推荐:">
            <el-radio-group v-model="form.recommendStatus">
              <el-radio :label="0">推荐</el-radio>
              <el-radio :label="1">不推荐</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" type="number" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="handleChange">确 定</el-button>
          <el-button @click="formDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  setup() {
    const state = reactive<any>({
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      formDialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      companyId: '',
      companyList: [],
      productList: [],
      tableData: [],
      form: {
        id: 0,
        productId: '' as any,
        recommendStatus: 1,
        sort: 0
      }
    })
    const handleChange = () => {
      if (state.isEdit) {
        editData()
      } else {
        addData()
      }
    }
    const handleUpdate = (row: any) => {
      state.formDialogVisible = true
      state.dialogTitle = '编辑热销商品'
      state.isEdit = true
      state.form = { ...row }
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }
    const handleProductCate = () => {
      state.formDialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加热销商品'
      state.form.productId = ''
      state.form.recommendStatus = 1
      state.form.sort = 1
      state.form.id = 0
      getCompanyList()
    }
    const getChangeCompany = (e: any) => {
      state.companyId = e
      getProductList()
    }
    const getCompanyList = async () => {
      await fetch({
        url: '/admin/company/page',
        method: 'get',
        params: {
          size: 1000,
          current: 1
        }
      }).then((res: any) => {
        state.companyList = res.data.records
      })
    }
    const getProductList = async () => {
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: 1000,
          current: 1,
          companyId: state.companyId
        }
      }).then((res: any) => {
        state.productList = res.data.records
      })
    }
    const addData = async () => {
      await fetch({
        url: '/mall/home_hot_sale',
        method: 'post',
        data: {
          productId: state.form.productId,
          recommendStatus: state.form.recommendStatus,
          sort: state.form.sort
        }
      }).then((res: any) => {
        if (res.data) {
          state.formDialogVisible = false
          ElMessage.success('添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      await fetch({
        url: '/mall/home_hot_sale/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
        // console.log(res.data.records)
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/home_hot_sale',
        method: 'put',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.formDialogVisible = false
          ElMessage.success('编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/home_hot_sale/' + id,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 210
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
      getCompanyList,
      handleProductCate,
      handleChange,
      getChangeCompany,
      getProductList,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      deleteData,
      editData,
      handleCurrentChange,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

</style>
