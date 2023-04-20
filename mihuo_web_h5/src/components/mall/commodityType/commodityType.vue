<template>
  <div>
    <div v-if="pageType === 0" class="app-container">
      <el-card shadow="never">
        <div class="el-card-right">
          <el-button
            icon="plus"
            :type="buttonType"
            @click="addProductAttrCate()"
            >添加
          </el-button>
        </div>
      </el-card>
      <div>
        <el-table
          stripe
          ref="productAttrCateTable"
          v-loading="loading"
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
          <!--          <el-table-column label="编号" width="100" align="center">-->
          <!--            <template #default="scope">{{ scope.row.id }}</template>-->
          <!--          </el-table-column>-->
          <el-table-column label="类型名称" align="center">
            <template #default="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <!--          <el-table-column label="属性数量" align="center">-->
          <!--            <template #default="scope">{{ scope.row.attributeCount == null ? 0 : scope.row.attributeCount }}</template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="参数数量" align="center">-->
          <!--            <template #default="scope">{{ scope.row.paramCount == null ? 0 : scope.row.paramCount }}</template>-->
          <!--          </el-table-column>-->
          <el-table-column label="设置" align="center">
            <template #default="scope">
              <el-button size="mini" @click="getAttrList(scope.row)"
                >属性列表
              </el-button>
              <el-button size="mini" @click="getParamList(scope.row)"
                >参数列表
              </el-button>
              <el-button size="mini" @click="getAddList(scope.row)"
                >输入列表
              </el-button>
            </template>
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
                icon="edit"
                type="text"
                @click="handleUpdate(scope.row)"
                >编辑
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
        top="8rem"
      >
        <div style="height: 80px">
          <el-form
            ref="ruleForms"
            :model="form"
            :rules="rules"
            label-width="10rem"
          >
            <el-form-item label="类型名称" prop="name">
              <el-input v-model="form.name" auto-complete="off" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <productAttrList
      v-else-if="pageType === 1"
      v-model="form"
      v-model:tableType="tableType"
      :prot-type="protType"
      :company-id="companyId"
      :cityOperatorId="cityOperatorId"
      :button-type="buttonType"
      @eidtPageType="eidtPageType"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import productAttrList from '@/components/mall/commodityType/productAttrList.vue'

export default defineComponent({
  components: { productAttrList },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    cityOperatorId: {
      // 运营端id
      type: Number || String,
      default: ''
    }
  },
  setup(props) {
    const ruleForms = ref<any>('')
    const state = reactive({
      buttonType: props.buttonType,
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
      form: {
        name: '',
        // companyId: '',
        attributeCount: 0,
        created: '',
        id: 0,
        paramCount: 0,
        updated: '',
        type: props.protType
        // cityOperatorId: props.cityOperatorId
      }
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.dialogTitle = '添加类型'
      state.form.name = ''
    }
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑类型'
      state.form.name = row.name
      state.form.id = row.id
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }
    const addData = async () => {
      await fetch({
        url: 'mall/productattributecategory/create',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('商品类型添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/productattributecategory/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          // companyId: props.companyId,
          type: props.protType
          // cityOperatorId: props.cityOperatorId
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
        url: '/mall/productattributecategory/update',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('商品类型编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/productattributecategory/delete/' + id,
        method: 'post'
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
          if (state.dialogTitle === '添加类型') {
            addData()
          }
          if (state.dialogTitle === '编辑类型') {
            editData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }

    const getAttrList = async (row: any) => {
      state.pageType = 1
      state.form.id = row.id
      state.form.name = row.name
      state.tableType = 0
    }
    const getParamList = async (row: any) => {
      state.pageType = 1
      state.form.id = row.id
      state.form.name = row.name
      state.tableType = 1
    }
    const getAddList = async (row: any) => {
      state.pageType = 1
      state.form.id = row.id
      state.form.name = row.name
      state.tableType = 2
    }
    const eidtPageType = () => {
      state.pageType = 0
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 190
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
      addProductAttrCate,
      handleUpdate,
      handleDelete,
      handleCurrentChange,
      handleConfirm,
      getAttrList,
      eidtPageType,
      getParamList,
      getAddList,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less"></style>
