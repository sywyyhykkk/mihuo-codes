<template>
  <div>
    <div v-if="pageType === 0">
      <div class="el-card-form" style="background: #ffffff">
        <div class="el-card-formLeft">
          <!--          <div class="add">-->
          <!--            <el-input-->
          <!--              v-model="filterText"-->
          <!--              size="mini"-->
          <!--              placeholder="输入关键字进行过滤"-->
          <!--            />-->
          <!--          </div>-->
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="el-card-custom">
                <span
                  :style="
                    data.typeTreeCode === typeTreeCode ? 'color: #0969DA;' : ''
                  "
                >{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
        <div class="el-card-formRight">
          <el-card>
            <div class="el-card-right">
              <el-button
                icon="refreshLeft"
                @click="updateTableData()"
              >重置
              </el-button>
              <el-button
                type="primary"
                icon="plus"
                @click="addProductAttrCate()"
              >添加
              </el-button>
            </div>
          </el-card>
          <el-table
            ref="productAttrCateTable"
            v-loading="loading"
            stripe
            :height="'calc(100vh - 19rem)'"
            :data="tableData"
            row-key="id"
            border
          >
            <template #empty>
              <el-empty
                :image-size="218"
                description="暂无数据~"
                :image="require('@/assets/img/empty/no_data.png')"
              />
            </template>
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <el-table-column label="标题" align="center">
              <template #default="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column label="分类名称" align="center">
              <template #default="scope">{{ scope.row.typeName }}</template>
            </el-table-column>
            <el-table-column label="封面图片" align="center">
              <template #default="scope">
                <el-image
                  preview-teleported
                  :src="$getUrl.getPicUrl(scope.row.facePic, true)[0]"
                  :preview-src-list="$getUrl.getPicUrl(scope.row.facePic)"
                  style="height: 30px; width: 30px"
                />
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template #default="scope">{{ scope.row.desc }}</template>
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
                  type="text"
                  size="small"
                  icon="edit"
                  @click="handleUpdate(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  class="danger"
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
            :total="+total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
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
          label-width="9rem"
        >
          <el-form-item label="分类" prop="type">
            <el-cascader
              v-model="form.type"
              :options="treeData"
              :props="{
                checkStrictly: true,
                children: 'children',
                label: 'typeName',
                value: 'id',
              }"
              placeholder="选择分类"
              filterable
            />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="封面图片">
            <uploadImage
              v-model="form.facePic"
              :max-count="1"
              :is-edits="isEdit"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-input
              v-model="form.sort"
              style="width: 19rem"
              type="tel"
              oninput="value=value.replace(/[^0-9.]/g, '').replace('.','')"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="内容">
            <!--            <div v-html="myHtml" style="width: 300px;height: 600px"></div>-->
            <richText
              v-model="form.content"
              platform-type="3"
              :company-id="companyId"
            />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.desc" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              :loading="loading"
              @click="handleConfirm()"
            >确 定</el-button>
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
  watch
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import richText from '@/components/AppTextEdit/index.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'

export default defineComponent({
  components: { richText, uploadFile },
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
    const tree = ref<any>('')
    const state = reactive({
      filterText: '',
      buttonType: props.buttonType,
      tableType: 0,
      pageType: 0,
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 20,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      treeData: [],
      typeTreeCode: '',
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'typeName',
        value: 'id'
      },
      form: {
        cityId: props.cityId,
        // cityOperatorId: props.cityOperatorId,
        desc: '',
        typeName: '',
        id: 0 as any,
        content: '[]' as any,
        facePic: '',
        title: '',
        type: [] as any,
        sort: 0
      } as any,
      options: []
    })
    const addProductAttrCate = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.dialogTitle = '添加内容'
      state.form = {
        cityId: props.cityId,
        desc: '',
        typeName: '',
        id: 0 as any,
        content: '[]' as any,
        facePic: '',
        title: '',
        type: state.form.type as any,
        sort: 0
      }
    }
    const rules = reactive({
      type: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
    })
    const handleUpdate = async (row: any) => {
      await fetch({
        url: `/mall/cms_content_manager/${row.id}`,
        method: 'get'
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = true
          state.dialogTitle = '编辑内容'
          state.isEdit = true
          state.form = { ...res.data }
          state.form
        }
      }
      )
      // state.form.content = '[]'
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除此条数据, 是否继续?`, '提示', {
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
          state.form.type = state.form.type.length > 0 &&
          typeof state.form.type === 'object'
            ? +state.form.type[state.form.type.length - 1]
            : +state.form.type
          if (!state.isEdit) {
            addData(state.form)
          }
          if (state.isEdit) {
            editData(state.form)
          }
          state.loading = false
        }
      })
    }
    const addData = async (obj: any) => {
      state.loading = true
      await fetch({
        url: '/mall/cms_content_manager',
        method: 'post',
        data: obj
      }).then((res: any) => {
        if (res.code == '0') {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          state.loading = false
          getData()
        }
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/cms_content_manager/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          typeTreeCode: state.typeTreeCode,
          type: '' // 分类
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }
    const getContentList = async () => {
      await fetch({
        url: '/mall/cms_content_type/page',
        method: 'get',
        params: {
          size: 9999,
          current: 1,
          // companyId: props.companyId,
          type: '',
          cityId: props.cityId
          // cityOperatorId: props.cityOperatorId
        }
      }).then((res: any) => {
        state.options = res.data.records
      })
    }
    const editData = async (obj: any) => {
      state.loading = true
      await fetch({
        url: '/mall/cms_content_manager',
        method: 'put',
        data: obj
      }).then((res: any) => {
        if (res.code == '0') {
          state.dialogVisible = false
          ElMessage.success('编辑成功')
          state.loading = false
          getData()
        }
      })
    }
    const deleteData = async (id: any) => {
      state.loading = true
      await fetch({
        url: '/mall/cms_content_manager/' + id,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          state.loading = false
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleNodeClick = async (v: any) => {
      // console.log(v)
      state.form.type = v.id
      state.typeTreeCode = v.typeTreeCode
      getData()
    }
    const updateTableData = () => {
      state.typeTreeCode = ''
      getData()
    }
    const getTreeData = async () => {
      await fetch({
        url: '/mall/cms_content_type/tree/content',
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data
        state.loading = false
      })
    }
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    onMounted(() => {
      getTreeData()
      getContentList()
      getData()
    })
    return {
      rules,
      tree,
      ruleForms,
      addProductAttrCate,
      handleCurrentChange,
      handleConfirm,
      handleUpdate,
      handleDelete,
      addData,
      getData,
      editData,
      deleteData,
      getContentList,
      handleNodeClick,
      updateTableData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.department_content {
  display: flex;
  //margin-top: 15px;

  .left {
    width: 20vw;
    margin-right: 20px;
    height: auto;
    background-color: white;
    border-radius: 5px;
    text-align: center;

    .add {
      margin-top: 20px;
      margin-bottom: 20px;
      width: calc(100% - 40px);
      margin-left: 20px;
    }

    .custom {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-right: 10px;
    }

    .woker-ul {
      list-style: none;
      background-color: #fff;
      line-height: 25px;
      padding: 10px;
      box-sizing: border-box;
      color: #666;
      font-size: 12px;

      li {
        cursor: pointer;
      }
    }
  }

  .right {
    width: 100% !important;
    height: auto;
  }
}

.table-container {
  margin-top: 15px;
}
</style>
