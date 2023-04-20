<template>
  <div>
    <div class="app-container">
      <el-card shadow="never">
        <el-input
          v-model="listQuery.name"
          prefix-icon="Search"
          placeholder="品牌名称"
          clearable
          @change="getData()"
        />

        <div class="el-card-right">
          <el-button
            :type="buttonType"
            icon="plus"
            @click="addBrand()"
          >
            添加
          </el-button>
        </div>
      </el-card>

      <div :class="getBrandNameType ? '' : 'department_content'">
        <div style="width: 100%">
          <el-table
            ref="brandTable"
            v-loading="loading"
            stripe
            :data="tableData"
            highlight-current-row
            border
            row-key="id"
            :height="tableHeight"
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChangeGet"
          >
            <!--            <el-table-column type="selection" width="60" align="center" />-->
            <el-table-column
              reserve-selection
              align="center"
              type="selection"
              width="50"
            />
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <el-table-column
              label="品牌名称"
              align="center"
              prop="name"
            />
            <el-table-column
              label="品牌首字母"
              width="100"
              align="center"
              prop="firstLetter"
            />
            <el-table-column
              label="品牌LOGO"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-image
                  preview-teleported
                  lazy
                  style="height: 50px; width: 50px"
                  :src="$getUrl.getPicUrl(scope.row.logo, true)"
                  :preview-src-list="$getUrl.getPicUrl(scope.row.logo)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="品牌专区大图"
              width="120"
              align="center"
            >
              <template #default="scope">
                <!--              <img style="height: 80px" :src="scope.row.bigPic">-->
                <el-image
                  preview-teleported
                  style="height: 50px; width: 50px"
                  lazy
                  :src="$getUrl.getPicUrl(scope.row.bigPic, true)"
                  :preview-src-list="$getUrl.getPicUrl(scope.row.bigPic)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="是否推荐"
              width="120"
              align="center"
            >
              <template #default="scope">
                <p
                  @click="
                    !getBrandNameType ? handleecommendType(scope.row) : ''
                  "
                >
                  <el-switch
                    v-model="scope.row.recommandStatus"
                    :disabled="getBrandNameType"
                    :active-value="1"
                    :inactive-value="0"
                    :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                  />
                </p>
              </template>
            </el-table-column>
            <el-table-column
              label="排序"
              width="100"
              align="center"
              prop="sort"
            />
            <!--          <el-table-column label="品牌制造商" width="100" align="center">-->
            <!--            <template #default="scope">-->
            <!--              <el-switch-->
            <!--                v-model="scope.row.factoryStatus"-->
            <!--                :active-value="1"-->
            <!--                :inactive-value="0"-->
            <!--              />-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <el-table-column
              label="是否显示"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.showStatus"
                  :disabled="getBrandNameType"
                  :active-value="0"
                  :inactive-value="1"
                  :active-color="buttonType === 'warning' ? '#fd6d34' : ''"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="数据来源"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.type==1" size="mini">平台</el-tag>
                <el-tag v-if="scope.row.type==2" size="mini">企业</el-tag>
                <el-tag v-if="scope.row.type==3" size="mini">运营</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="相关"
              width="220"
              align="center"
            >
              <template #default="scope">
                <span>商品：</span>
                <el-button
                  size="mini"
                  type="text"
                  @click="getProductList(scope.$index, scope.row)"
                >100
                </el-button>
                <span>评价：</span>
                <el-button
                  size="mini"
                  type="text"
                  @click="getProductCommentList(scope.$index, scope.row)"
                >1000
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
                  type="text"
                  icon="edit"
                  :disabled="getBrandNameType"
                  @click="handleUpdate(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="danger"
                  icon="delete"
                  :disabled="getBrandNameType"
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
            style="position: relative"
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
        width="55rem"
      >
        <div style="height: 65vh; overflow-y: auto">
          <el-form
            ref="ruleForms"
            :model="form"
            :rules="rules"
            label-width="11rem"
          >
            <!--            <el-form-item label="选择分类" prop="treeCode">-->
            <!--              <el-cascader-->
            <!--                v-model="form.treeCodeList"-->
            <!--                :options="treeData"-->
            <!--                :props="defaultProps"-->
            <!--                @change="handleChange"-->
            <!--              ></el-cascader>-->
            <!--            </el-form-item>-->
            <el-form-item label="品牌名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="品牌首字母" prop="firstLetter">
              <el-input
                v-model="form.firstLetter"
                @change="onChangeFirstLetter"
              />
            </el-form-item>
            <el-form-item label="品牌LOGO" prop="logo">
              <uploadImage
                v-model="form.logo"
                :max-count="1"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="品牌专区大图">
              <uploadImage
                v-model="form.bigPic"
                :max-count="1"
                :is-edits="isEdit"
              />
            </el-form-item>
            <el-form-item label="品牌故事">
              <el-input
                v-model="form.brandStory"
                placeholder="请输入内容"
                type="textarea"
              />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="form.sort" style="width: 19rem" />
            </el-form-item>
            <el-form-item label="是否显示">
              <el-radio-group v-model="form.showStatus">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否推荐" prop="dsType">
              <el-radio-group v-model="form.recommandStatus">
                <el-radio :label="0">不推荐</el-radio>
                <el-radio :label="1">推荐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="品牌制造商">
              <el-radio-group v-model="form.factoryStatus">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
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
  watch,
  computed
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
// import uploadImage from '@/components/UploadFile/uploadImage.vue'
// import uploadFile from '_c/UploadFile/uploadImage.vue'
// import Sortable from 'sortablejs'

export default defineComponent({
  // components: { uploadFile },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
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
    getBrandName: {
      type: Function,
      default: null
    },
    getBrandNameType: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const tree = ref<any>('')
    const ruleForms = ref<any>('')
    const state = reactive({
      filterText: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'treeCode',
        multiple: true
      },
      current: -1,
      treeCode: '',
      tableType: 0,
      pageType: 0,
      treeData: [] as any,
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
        bigPic: '',
        brandStory: '',
        factoryStatus: 0,
        firstLetter: '',
        logo: '',
        name: '',
        showStatus: 0,
        sort: 0,
        id: 0,
        recommandStatus: 0,
        // companyId: props.companyId,
        type: props.protType,
        treeCodeList: [] as any,
        treeCode: ''
        // cityOperatorId:props.cityOperatorId
      },
      listQuery: {
        name: ''
      }
    })
    const rules = reactive({
      // treeCode: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
      firstLetter: [
        { required: true, message: '品牌首字母必填', trigger: 'blur' },
        {
          min: 1,
          max: 1,
          message: '首字母长度在1个字符',
          trigger: 'blur'
        }
      ]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const addBrand = () => {
      state.dialogVisible = true
      state.dialogTitle = '添加品牌'
      state.isEdit = false
      state.form.bigPic = ''
      state.form.brandStory = ''
      state.form.factoryStatus = 0
      state.form.firstLetter = ''
      state.form.logo = ''
      state.form.name = ''
      state.form.showStatus = 0
      state.form.sort = 0
      state.form.treeCode = ''
      state.form.recommandStatus = 0
    }
    const handleCurrentChangeGet = (val: any) => {
      if (props.getBrandNameType) {
        emit('getBrandName', val.name)
      }
    }
    const handleSelectionChange = (data: any) => {
      if (props.getBrandNameType) {
        emit('getBrandIds', data)
      }
    }
    // const rowDrop = () => {
    //   // 此时找到的元素是要拖拽元素的父容器
    //   const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
    //
    //   Sortable.create(tbody, {
    //     //  指定父元素下可被拖拽的子元素
    //     draggable: '.el-table__row',
    //     onEnd({ newIndex, oldIndex }) {
    //       const currRow = state.tableData.splice(oldIndex, 1)[0]
    //       state.tableData.splice(newIndex, 0, currRow)
    //     }
    //   })
    // }
    const handleUpdate = async (row: any) => {
      await fetch({
        url: `/mall/brand/${row.id}`,
        method: 'get'
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = true
          state.dialogTitle = '编辑品牌'
          state.isEdit = true
          state.form = res.data
        } else {
          ElMessage.error(res.msg)
        }
      })
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
        url: '/mall/brand/create',
        method: 'post',
        data: state.form
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
        url: '/mall/brand/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          treeCode: state.treeCode,
          ...state.listQuery
        }
      }).then((res: any) => {
        state.loading = false
        state.tableData = res.data.records
        state.total = res.data.total
        // console.log(res.data.records)
      })
    }
    const editData = async () => {
      await fetch({
        url: '/mall/brand/update',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('品牌编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
          state.loading = false
        }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/mall/brand/delete/' + id,
        method: 'post'
      }).then((res: any) => {
        if (res.data == null) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const addClass = (i: any, x: number) => {
      state.loading = true
      state.current = x
      state.treeCode = i.treeCode
      getData()
    }
    const handleConfirm = () => {
      state.loading = true
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          // const codeList: any = []
          // console.log(state.form)
          // state.form.treeCodeList.map((item: any) => {
          //   codeList.push(item[item.length - 1])
          // })
          // state.form.treeCodeList = codeList
          // console.log(state.form)
          if (!state.isEdit) {
            addData()
          }
          if (state.isEdit) {
            editData()
          }
          state.loading = false
        } else {
          alert('请完善信息')
          state.loading = false
          return false
        }
      })
    }
    const onChangeFirstLetter = (value: any) => {
      state.form.firstLetter = state.form.firstLetter.toUpperCase()
    }
    const handleecommendType = async (row: any) => {
      await fetch({
        url: `/mall/brand/setRecommandStatus/${row.id}?recommandStatus=${row.recommandStatus}`,
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('设置成功')
          getData()
        } else {
          ElMessage.error(res.msg)
          getData()
        }
      })
    }
    const getProductTree = async () => {
      await fetch({
        url: `/mall/productcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data
      })
    }
    const handleChange = (val: any) => {
      console.log(val)
      // val.forEach.
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
      getProductTree()
      getData()
      // rowDrop()
    })

    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.name.indexOf(value) !== -1
    }
    // watch(state, (value) => {
    //   tree.value.filter(state.filterText)
    // })
    return {
      tree,
      rules,
      ruleForms,
      // rowDrop,
      handleChange,
      filterNode,
      addClass,
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
      getProductTree,
      handleCurrentChangeGet,
      onChangeFirstLetter,
      handleSelectionChange,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

.el-table {
  height: calc(100vh - 24rem) !important;
}
</style>
