<template>
  <div>
    <div v-if="pageType === 0">
      <el-card>
        <el-button
          :type="buttonType"
          icon="plus"
          @click="addProductAttrCate()"
        >

          添加
        </el-button>
      </el-card>
      <div>
        <el-table
          ref="productAttrCateTable"
          v-loading="loading"
          stripe
          :data="tableData"
          :height="'calc(100vh - 19rem)'"
          row-key="id"
          border
          lazy
          :load="load"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column
            label="内容分类名称" align="center"
            prop="typeName"
          />
          <el-table-column
            label="内容分类描述" align="center"
            prop="desc"
          />
          <el-table-column label="维护方式" align="center">
            <template
              #default="scope"
            >{{
                scope.row.mark == 2
                  ? '运营商维护'
                  : scope.row.mark == 1
                  ? '平台维护'
                  : '企业维护'
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作" fixed="right"
            width="200" align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                icon="edit"
                type="text"
                @click="handleUpdate(scope.row)"
              > 编辑
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
<!--        <el-pagination-new-->
        <!--          :current-page="currentPage"-->
        <!--          :page-size="pagesize"-->
        <!--          :total="total"-->
        <!--          layout="total, prev, pager, next, jumper"-->
        <!--          @current-change="handleCurrentChange"-->
        <!--        />-->
      </div>

      <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="dialogTitle"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="选择上级分类">
            <el-cascader
              v-model="form.typeTreeCode"
              :options="tableData"
              :props="{
                checkStrictly: true,
                children: 'children',
                label: 'typeName',
                value: 'typeTreeCode',
              }"
              placeholder="不选视为根节点"
              filterable
              :disabled="isEdit ? true : false"
            />
          </el-form-item>
          <el-form-item label="内容分类名称" prop="typeName">
            <el-input v-model="form.typeName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="内容分类描述">
            <el-input v-model="form.desc" autocomplete="off" />
            <!--              <richText v-model="form.desc" platform-type="3" :company-id="companyId"/>-->
          </el-form-item>
          <el-form-item label="维护方式">
            <el-radio-group
              v-model="form.mark"
              :disabled="isEdit ? true : false"
            >
              <el-radio :label="1">平台维护</el-radio>
              <el-radio :label="2">运营商维护</el-radio>
              <el-radio :label="3">企业维护</el-radio>
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
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: {},
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
      type: Number || String,
      default: ''
    },
    cityId: {
      type: Number || String,
      default: 0
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
      pagesize: 1000,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      options: [],
      form: {
        typeTreeCode: '' as any,
        desc: '',
        typeName: '',
        id: 0 as any,
        mark: 2
      },
      typeTreeCode: 0 as any
    })
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加内容分类'
      state.form.desc = ''
      state.form.typeName = ''
      state.form.id = 0
      state.form.typeTreeCode = state.typeTreeCode
    }
    const rules = reactive({
      typeName: [
        { required: true, message: '分类名称不能为空', trigger: 'blur' }
      ]
    })
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑内容分类'
      state.isEdit = true
      state.form = { ...row }
      state.form.typeTreeCode = row.parentId
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(
        `此操作将永久删除${row.typeName}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteData(row.id)
      })
    }
    const handleConfirm = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            const obj = {
              desc: state.form.desc,
              typeName: state.form.typeName,
              typeTreeCode:
                state.form.typeTreeCode === 0
                  ? ''
                  : state.form.typeTreeCode[state.form.typeTreeCode.length - 1],
              mark: state.form.mark
            }

            addData(obj)
          }
          if (state.isEdit) {
            const obj = {
              desc: state.form.desc,
              typeName: state.form.typeName,
              // typeTreeCode: state.form.typeTreeCode,
              id: state.form.id,
              mark: state.form.mark
            }
            editData(obj)
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const addData = async (obj: any) => {
      await fetch({
        url: '/mall/cms_content_type',
        method: 'post',
        data: obj
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleShowNextLevel = (row: any) => {
      state.typeTreeCode = row.typeTreeCode
      getData()
    }
    const handleTransferSuperior = (row: any) => {
      if (row.typeTreeCode.length === 8) {
        state.typeTreeCode = 0
      } else {
        state.typeTreeCode = row.typeTreeCode.substring(
          0,
          row.typeTreeCode.length - 4
        )
      }
      getData()
    }
    const backData = () => {
      if (state.typeTreeCode.length === 4) {
        state.typeTreeCode = 0
      }
      if (state.typeTreeCode.length > 4) {
        state.typeTreeCode = state.typeTreeCode.substring(
          0,
          state.typeTreeCode.length - 4
        )
      }
      getData()
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/cms_content_type/tree',
        method: 'get'
      }).then((res: any) => {
        console.log(res)
        state.tableData = res.data
        state.loading = false
      })
    }
    const editData = async (obj: any) => {
      await fetch({
        url: '/mall/cms_content_type',
        method: 'put',
        data: obj
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/cms_content_type/' + id,
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

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 200
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
      addProductAttrCate,
      handleConfirm,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      editData,
      deleteData,
      handleShowNextLevel,
      handleTransferSuperior,
      backData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

</style>
