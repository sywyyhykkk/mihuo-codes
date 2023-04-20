<template>
  <div>
    <div v-if="pageType === 0" class="app-container">
      <el-card shadow="never">
        <div class="el-card-right">
          <el-button
            :type="buttonType"
            icon="plus"
            @click="addProductAttrCate()"
          >添加
          </el-button>
        </div>
      </el-card>
      <div>
        <el-table
          ref="productAttrCateTable"
          v-loading="loading"
          stripe
          :data="tableData"
          row-key="id"
          border
          style="height: calc(100vh - 20rem) !important"
          :height="'0'"
          :tree-props="{ children: 'children', hasChildren:'hasChildren' }"
          lazy
          :load="loadTree"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column
            label="栏目名称" 
            header-align="center"
            prop="name"
            width="150"
          />
          <el-table-column
            label="栏目描述" 
            align="center"
            prop="description"
          />
          <el-table-column
            label="图标" width="120"
            align="center"
          >
            <template #default="scope">
              <!--              <img style="height: 80px" :src="scope.row.bigPic">-->
              <el-image
                v-if="scope.row.icon"
                preview-teleported
                style="height: 80px; width: 80px"
                lazy
                :src="$getUrl.getPicUrl(scope.row.icon, true)"
                :preview-src-list="$getUrl.getPicUrl(scope.row.icon)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="banner图" width="120"
            align="center"
          >
            <template #default="scope">
              <!--              <img style="height: 80px" :src="scope.row.bigPic">-->
              <el-image
                v-if="scope.row.icon"
                preview-teleported
                style="height: 80px; width: 80px"
                lazy
                :src="$getUrl.getPicUrl(scope.row.bannerImg, true)"
                :preview-src-list="$getUrl.getPicUrl(scope.row.bannerImg)"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center">
            <template
              #default="scope"
            >{{ scope.row.showStatus == 1 ? '显示' : '不显示' }}
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
        width="54rem"
      >
        <div style="height: 65vh; overflow-y: scroll">
          <el-form
            ref="ruleForms"
            :model="form"
            :rules="rules"
            label-width="10rem"
          >
            <el-form-item label="上级栏目">
              <el-cascader
                v-model="typeTreeCode"
                :options="tableData"
                :props="{
                  checkStrictly: true,
                  children: 'children',
                  label: 'name',
                  value: 'id',
                }"
                placeholder="不选视为根节点"
                filterable
                :disabled="isEdit ? true : false"
              />
            </el-form-item>
            <el-form-item label="栏目名称" prop="name">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="栏目内容页" prop="bannerUrl">
              <AppTextEdit
                :key="1"
                v-model="form.bannerUrl"
                :is-edit="true"
                :buttons="['icontitle','word','images','productItem','caseItem', 'imageGrid', 'link']"
                platform-type="1"
              />
            </el-form-item>
            <el-form-item label="栏目描述">
              <el-input v-model="form.description" autocomplete="off" />
              <!--              <richText v-model="form.desc" platform-type="3" :company-id="companyId"/>-->
            </el-form-item>
            <el-form-item label="是否显示">
              <el-radio-group v-model="form.showStatus">
                <el-radio :label="0">不显示</el-radio>
                <el-radio :label="1">显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图标">
              <uploadImage
                v-model="form.icon"
                :max-count="1"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="banner图">
              <uploadImage
                v-model="form.bannerImg"
                :max-count="1"
                :is-edits="isEdit"
              />
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
import uploadFile from '_c/UploadFile/uploadImage.vue'

export default defineComponent({
  components: { uploadFile },
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
        description: '',
        parentId: '0',
        showStatus: 1,
        sort: 0,
        name: '',
        id: 0,
        groupCode: '',
        bannerImg: '',
        icon: '',
        bannerUrl: '[]'
      },
      typeTreeCode: [] as any
    })
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加栏目'
      state.form = {
        description: '',
        parentId: '0',
        showStatus: 1,
        sort: 0,
        name: '',
        id: 0,
        groupCode: '',
        bannerImg: '',
        icon: '',
        bannerUrl: '[]'
      }
      state.typeTreeCode = '0'
    }
    const rules = reactive({
      name: [{ required: true, message: '栏目名称不能为空', trigger: 'blur' }]
    })
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑栏目'
      state.isEdit = true
      state.form = { ...row }
      if (!state.form.bannerUrl) {
        state.form.bannerUrl = '[]'
      }
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
    const handleConfirm = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          state.form.parentId =
            state.typeTreeCode[state.typeTreeCode.length - 1]
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
    const addData = async () => {
      await fetch({
        url: '/mall/productgroup/create',
        method: 'post',
        data: state.form
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
        url: '/mall/productgroup/tree',
        method: 'get'
      }).then((res: any) => {
        state.tableData = res.data
        state.loading = false
      })
    }
    const loadTree = (row: any,treeNode: unknown,resolve: (date: any[]) => void) => {
      resolve(row.children)
    }
    const editData = async () => {
      await fetch({
        url: '/mall/productgroup/update',
        method: 'post',
        data: state.form
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
        url: '/mall/productgroup/delete/' + id,
        method: 'post'
      }).then((res: any) => {
        if (res.data.code !== 1) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }

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
      loadTree,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
