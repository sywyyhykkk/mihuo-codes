<template>
  <div>
    <el-card class="operate-containers" shadow="never">
      <div class="name">
        <span v-show="superior.length > 0">
          上级分类名称:
          <span v-for="(item, index) in superior" :key="index">
            <span v-show="index > 0" class="item-segmentation"> / </span>
            <span
              class="item-name"
              :class="[superior.length === index + 1 ? 'item-name-active' : '']"
              @click="getFallback(item, index)"
            >
              {{ item.name }}</span>
          </span>
        </span>
      </div>
      <div class="el-card-right">
        <el-button
          v-if="platformType === '2'"
          type="primary"
          plain
          @click="pullCate()"
        >
          导入平台分类
        </el-button>
        <el-button
          type="primary" icon="plus"
          @click="handleAddProductCate()"
        >
          添加分类
        </el-button>
      </div>
    </el-card>
    <div>
      <el-table
        ref="productCateTable"
        v-loading="loading"
        stripe
        style="height: calc(100vh - 31rem) !important"
        :data="tableData"
        :height="'0'"
        border
      >
        <el-table-column
          prop="name" label="分类名称"
          align="center"
        />
        <el-table-column label="图标" align="center">
          <template #default="scope">
            <!--              <img style="height: 80px" :src="scope.row.bigPic">-->
            <el-image
              preview-teleported
              style="height: 80px; width: 80px"
              lazy
              :src="$getUrl.getPicUrl(scope.row.icon, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.icon)"
            />
          </template>
        </el-table-column>
        <el-table-column label="banner图" align="center">
          <template #default="scope">
            <!--              <img style="height: 80px" :src="scope.row.bigPic">-->
            <el-image
              preview-teleported
              style="height: 80px; width: 80px"
              lazy
              :src="$getUrl.getPicUrl(scope.row.bannerImg, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.bannerImg)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="treeCode"
          label="分类编码"
          width="100"
          align="center"
        />
        <el-table-column
          prop="level" label="级别"
          width="100" align="center"
        />
        <el-table-column
          prop="description" label="描述"
          align="center"
        />
        <el-table-column
          label="导航栏" width="100"
          align="center"
        >
          <template #default="scope">
            <p @click="handleNavStatusChange(scope.row)">
              <el-switch
                v-model="scope.row.navStatus"
                :active-value="1"
                :inactive-value="0"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="是否显示" width="100"
          align="center"
        >
          <template #default="scope">
            <p @click="handleShowStatusChange(scope.row)">
              <el-switch
                v-model="scope.row.showStatus"
                :active-value="1"
                :inactive-value="0"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort" label="排序 "
          width="100" align="center"
        />
        <el-table-column
          label="设置" align="center"
          width="230"
        >
          <template #default="scope">
            <el-button
              size="mini" @click="handleShowNextLevel(scope.row)"
            >查看下级
            </el-button>
            <el-button
              v-show="scope.row.level !== 1"
              size="mini"
              @click="handleTransferSuperior(scope.row)"
            >查看上级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" fixed="right"
          width="200" align="center"
        >
          <template #default="scope">
            <div v-if="form.type === 3">
              <el-button
                icon="edit"
                type="text"
                :disabled="scope.row.type === 1?true:false"
                @click="handleUpdate(scope.row)"
              >编辑
              </el-button>
              <el-button
                type="text"
                icon="delete"
                class="danger"
                :disabled="scope.row.type === 1?true:false"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </div>
            <div v-if="platformType == '1'">
              <el-button
                type="text" icon="edit"
                @click="handleUpdate(scope.row)"
              >编辑
              </el-button>
              <el-button
                class="danger"
                type="text"
                icon="delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </div>
            <div v-if="form.type === 2">
              <el-button
                type="text"
                icon="edit"
                :disabled="scope.row.type === 1 || scope.row.type === 3"
                @click="handleUpdate(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                class="danger"
                icon="delete"
                :disabled="scope.row.type === 1 || scope.row.type === 3"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager,next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="formDialogVisible"
      v-model="formDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :title="formType === 'add' ? '添加商品分类' : '修改商品分类'"
      width="54rem"
    >
      <el-form
        ref="rulesForm"
        label-width="10rem"
        :rules="rules"
        :model="form"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" clearable />
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            v-model="form.sort" type="number"
            clearable
          />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="typeList"
            clearable
            disabled
            :props="defaultProps"
            @change="handleChangee"
          />
        </el-form-item>
        <!--     ddddd {{form.parentId}}-->
        <el-form-item label="图标" prop="parentId">
          <uploadImage
            v-model="form.icon" :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="banner图" prop="parentId">
          <uploadImage
            v-model="form.bannerImg"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="是否显示" prop="showStatus">
          <el-radio-group v-model="form.showStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示在导航栏" prop="navStatus">
          <el-radio-group v-model="form.navStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            clearable
            :autosize="true"
          />
        </el-form-item>
        <!--        <el-form-item label="banner跳转" prop="bannerUrl">-->
        <!--          <richText-->
        <!--            :key="1"-->
        <!--            v-model="form.bannerUrl"-->
        <!--            :buttons="['icontitle','word','images','listItem','productItem','caseItem', 'imageGrid', 'link']"-->
        <!--            platform-type="2"-->
        <!--            :company-id="companyId"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reset()">取消</el-button>
          <el-button type="primary" @click="handleSave()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect
} from 'vue'
import {
  productCategoryCreate,
  productCategoryDelete,
  productCategoryPage,
  productCategoryTree,
  productCategoryUpdate
} from '_c/util/api/mall'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// import mForm from './form.vue'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/utils/utils'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import richText from '_c/AppTextEdit/index.vue'

export default defineComponent({
  components: {
    richText
  },
  props: {
    platformType: {
      type: String || Number,
      default: ''
    },
    propCompanyId: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const rulesForm = ref()
    const router = useRouter()
    const total = ref<number>(0)
    const superior = ref<any>([])
    const typeList = ref<any>([])

    const Initialize = ref<any>([
      {
        id: '0',
        name: '无上级分类'
      }
    ])
    const currentPage = ref<number>(1)
    const tableHeight = ref<any>(0)
    const pageSize = ref<number>(20)
    const parentId = ref<number>(0)
    const formDialogVisible = ref<boolean>(false)
    const formType = ref<string>('')
    const rules = reactive({
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    })
    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'id',
      checkStrictly: true
    })

    const handleSave = () => {
      const forms = unref(rulesForm)
      forms.validate((valid: boolean) => {
        if (valid) {
          state.form.productAttributeIdList = []
          submit(state.form)
        }
      })
    }
    const reset = () => {
      formDialogVisible.value = false
    }
    const handleChangee = (value: any) => {
      for (const key in value) {
        state.form.parentId = value[key]
      }
    }
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    onMounted(() => {
      getData()
      getTypeList()
    })
    const state = reactive<any>({
      tableData: [],
      loading: false,
      form: {
        type: Number(props.platformType),
        parentId: 0,
        // companyId: Number(props.propCompanyId),
        bannerImg: '',
        icon: '',
        bannerUrl: '[]'
      }
    })
    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 250
    }

    const getThumbnailImage = (url: any, thumbnail: any) => {
      return thumbnailImage(url, thumbnail)
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    const handleChange = () => {
      state.dialogFormVisible = false
      state.dialogTree = false
      state.selectCheck = []
    }
    const handleDelete = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (props.platformType === '1') {
          deleteData(e.id)
        } else {
          productCategoryDelete(e.id).then((res) => {
            if (res) {
              ElMessage.success({
                message: '删除成功',
                type: 'success'
              })
              getData()
            }
          })
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: `/mall/platformcategory/delete/${id}`,
        method: 'post'
      }).then((res: any) => {
        if (res.code == '0') {
          ElMessage.success({
            message: '删除成功',
            type: 'success'
          })
          getData()
        }
      })
    }
    // 查询
    const getData = async () => {
      if (props.platformType === '1') {
        getIndexData()
      } else {
        productCategoryPage({
          // companyId: state.form.companyId,
          parentId: parentId.value,
          current: currentPage.value,
          size: pageSize.value,
          type: props.platformType
        }).then((res: any) => {
          if (res.code == '0') {
            state.tableData = res.data.records
            total.value = res.data.total
          }
        })
      }
    }

    const getIndexData = async () => {
      await fetch({
        url: `/mall/platformcategory/page`,
        method: 'get',
        params: {
          parentId: parentId.value,
          current: currentPage.value,
          size: pageSize.value
        }
      }).then((res: any) => {
        if (res) {
          state.tableData = res.data.records
          total.value = res.data.total
        }
      })
    }

    const getTypeList = async () => {
      if (props.platformType === '1') {
        platformcategory()
      } else {
        await productCategoryTree({ type: props.platformType }).then((res) => {
          typeList.value = res.data
          typeList.value.unshift(...Initialize.value)
        })
      }
    }
    const platformcategory = async () => {
      await fetch({
        url: `/mall/platformcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        if (res) {
          typeList.value = res.data
          typeList.value.unshift(...Initialize.value)
        }
      })
    }

    const submit = (value: object) => {
      const temp = { ...value, type: props.platformType }
      if (formType.value === 'add') {
        if (props.platformType === '1') {
          addData(temp)
        } else {
          productCategoryCreate(temp).then((res) => {
            formDialogVisible.value = !formDialogVisible.value
            ElMessage.success({
              message: '新增成功',
              type: 'success'
            })
            getData()
            getTypeList()
          })
        }
      } else {
        if (props.platformType === '1') {
          updateData(temp)
        } else {
          productCategoryUpdate(temp).then((res) => {
            formDialogVisible.value = !formDialogVisible.value
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
            getTypeList()
          })
        }
      }
    }
    const addData = async (temp: any) => {
      await fetch({
        url: `/mall/platformcategory/create`,
        method: 'post',
        data: temp
      }).then((res: any) => {
        formDialogVisible.value = !formDialogVisible.value
        ElMessage.success({
          message: '新增成功',
          type: 'success'
        })
        getData()
        getTypeList()
      })
    }
    const updateData = async (temp: any) => {
      await fetch({
        url: `/mall/platformcategory/update`,
        method: 'post',
        data: temp
      }).then((res: any) => {
        formDialogVisible.value = !formDialogVisible.value
        ElMessage.success({
          message: '修改成功',
          type: 'success'
        })
        getData()
        getTypeList()
      })
    }

    const handleUpdate = (row: any) => {
      formType.value = ''
      state.form.bannerImg = ''
      state.form = JSON.parse(JSON.stringify(row))
      if (!state.form.bannerUrl) {
        state.form.bannerUrl = '[]'
      }
      formDialogVisible.value = !formDialogVisible.value
    }

    const handleAddProductCate = () => {
      formDialogVisible.value = !formDialogVisible.value
      formType.value = 'add'
      state.form.name = ''
      state.form.description = ''
      state.form.sort = 0
      state.form.navStatus = 1
      state.form.showStatus = 1
      state.form.parentId = parentId.value
      state.form.bannerImg = ''
      state.form.icon = ''
    }

    const handleNavStatusChange = (e: any) => {
      e.type = state.form.type
      if (props.platformType === '1') {
        fetch({
          url: 'mall/platformcategory/update',
          method: 'post',
          data: e
        }).then((res: any) => {
          if (res.code == '0') {
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
          }
        })

      } else {
        productCategoryUpdate(e).then((res: any) => {
          if (res.code == '0') {
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
          }
        })
      }

    }
    const handleShowStatusChange = (e: any) => {
      e.type = state.form.type
      if (props.platformType === '1') {
        fetch({
          url: 'mall/platformcategory/update',
          method: 'post',
          data: e
        }).then((res: any) => {
          if (res.code == '0') {
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
          }
        })
      } else {
        productCategoryUpdate(e).then((res: any) => {
          if (res.code == '0') {
            ElMessage.success({
              message: '修改成功',
              type: 'success'
            })
            getData()
          }
        })
      }
    }
    const pullCate = async () => {
      ElMessageBox.confirm(`是否确定要导入平台分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        importProductcategory()
      })
    }

    const importProductcategory = async () => {
      await fetch({
        url: `/mall/productcategory/import`,
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success({
            message: '导入成功',
            type: 'success'
          })
        }
        getData()
        getTypeList()
      })
    }
    const handleShowNextLevel = (e: any) => {
      // 查看下级
      // parentId.value = Number(e.id)
      parentId.value = e.id

      superior.value.push(e)
      superior.value = unique(superior.value)
      getData()
    }
    const unique = (arr: any) => {
      // 数组去重
      const res = new Map()
      return arr.filter((arr: any) => !res.has(arr.id) && res.set(arr.id, 1))
    }
    const handleTransferSuperior = (e: any) => {
      // 查看上级
      superior.value = superior.value.filter((item: any) => item.id !== e.id)
      if (e.level === 2) {
        parentId.value = Number(0)
        superior.value = []
      } else if (e.level > 2) {
        parentId.value = Number(
          superior.value[superior.value.length - 1].parentId
        )
        superior.value = superior.value.splice(0, superior.value.length - 1)
      }
      getData()
    }
    const getFallback = (e: any, index: any) => {
      console.log('e', e)
      console.log('superior', superior.value)
      if (superior.value.length > 0) {
        if (index + 1 < superior.value.length) {
          superior.value = superior.value.splice(0, index + 1)
        } else {
          superior.value = superior.value.filter(
            (item: any) => item.id !== e.id
          )
        }
        if (e.level === 1) {
          superior.value = []
        }
      }

      parentId.value = Number(e.parentId)
      getData()
    }

    return {
      total,
      currentPage,
      pageSize,
      formDialogVisible,
      formType,
      tableHeight,
      parentId,
      router,
      superior,
      typeList,
      Initialize,
      rules,
      rulesForm,
      defaultProps,
      handleChangee,
      reset,
      handleSave,
      getThumbnailImage,
      importProductcategory,
      getTypeList,
      pullCate,
      getData,
      addData,
      updateData,
      submit,
      handleChange,
      handleCurrentChange,
      handleAddProductCate,
      handleNavStatusChange,
      handleShowStatusChange,
      handleShowNextLevel,
      handleTransferSuperior,
      handleUpdate,
      handleDelete,
      getFallback,
      unique,
      getIndexData,
      platformcategory,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
