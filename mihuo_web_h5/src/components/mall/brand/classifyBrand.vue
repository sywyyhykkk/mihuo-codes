<template>
  <div>
    <div class="el-card-form">
      <div class="el-card-formLeft">
        <!--          <div class="add">-->
        <!--            <el-input-->
        <!--              v-model="filterText"-->
        <!--              style="width: 100%"-->
        <!--              placeholder="输入关键字进行过滤"-->
        <!--            />-->
        <!--          </div>-->
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="addClass"
        >
          <template #default="{ node, data }">
            <div class="el-card-custom">
              <span
                :style="treeCode == data.treeCode ? 'color: #0969DA;' : ''"
              >{{ node.label }}</span>
            </div>
          </template>
        </el-tree>
      </div>

      <div class="el-card-formRight">
        <el-card>
          <el-input
            v-model="listQuery.name"
            prefix-icon="Search"
            clearable
            placeholder="品牌名称"
            @change="getData()"
          />
          <div class="el-card-right">
            <el-button
              :type="buttonType"
              icon="plus"
              @click="addBrand()"
            >添加
            </el-button>
          </div>
        </el-card>
        <el-table
          ref="brandTable"
          v-loading="loading"
          stripe
          :data="tableData"
          :height="tableHeight"
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
          <el-table-column label="品牌LOGO" width="120" align="center">
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
          <el-table-column label="品牌专区大图" width="120" align="center">
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
          <el-table-column label="是否推荐" width="120" align="center">
            <template #default="scope">
              <p @click="changeRecommand(scope.row)">
                <el-switch
                  v-model="scope.row.recommandStatus"
                  :active-value="1"
                  :inactive-value="0"
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
          <el-table-column label="是否显示" width="100" align="center">
            <template #default="scope">
              {{ scope.row.showStatus == 0 ? '显示' : '不显示' }}
            </template>
          </el-table-column>
          <el-table-column label="相关" width="220" align="center">
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
                type="text"
                size="mini"
                class="danger"
                icon="delete"
                @click="handleDelete(scope.row)"
              >移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination-new
          :current-page="currentPage"
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        /> -->
      </div>
    </div>

    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="dialogTitle"
    >
      <div style="height: 20vh; overflow-y: scroll">
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="9rem"
        >
          <el-form-item label="选择分类" prop="treeCodeList">
            <el-cascader
              v-model="form.treeCodeList"
              :options="treeData"
              :props="defaultProps"
              clearable
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="选择品牌" prop="brandNames">
            <el-input
              v-model="form.brandNames"
              @click="selectBrandType = true"
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
    <el-dialog
      v-model="selectBrandType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="选择品牌（单选,选中某条）"
      width="110rem"
    >
      <div style="width: 100%; height: 65vh">
        <selectBrand :get-brand-name-type="true" @getBrandIds="getBrandIds" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="handleConfirmBrand()"
          >确 定</el-button>
          <el-button
            @click=";(selectBrandType = false), (form.brandNames = '')"
          >取 消</el-button>
        </span>
      </template>
    </el-dialog>
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
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
// import uploadImage from '@/components/UploadFile/uploadImage.vue'
// import uploadFile from '_c/UploadFile/uploadImage.vue'
// import Sortable from 'sortablejs'
import selectBrand from '@/components/mall/brand/brand.vue'

export default defineComponent({
  components: { selectBrand },
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
    }
  },
  setup(props) {
    const tree = ref<any>('')
    const ruleForms = ref<any>('')
    const state = reactive({
      filterText: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'treeCode'
      },
      selectBrandType: false,
      current: {} as any,
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
        treeCode: '',
        brandNames: '',
        treeCodeList: [] as any,
        brandIds: [] as any
      },
      listQuery: {
        name: ''
      }
    })

    const rules = reactive({
      treeCodeList: [
        { required: true, message: '请选择分类', trigger: 'blur' }
      ],
      brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const getBrandIds = (data: any) => {
      // state.form.brandName = val
      let ids = [] as any
      let names = [] as any
      if (data && data.length) {
        ids = data.map((item:any) => { return item.id })
        names = data.map((item:any) => { return item.name })
      }
      state.form.brandNames = names.join(',')
      state.form.brandIds = ids
    }
    const handleConfirmBrand = () => {
      if (state.form.brandIds.length === 0) {
        ElMessage.warning('请选择品牌')
      } else {
        state.selectBrandType = false
      }
    }
    const addBrand = () => {
      state.form = {
        treeCode: state.treeCode || '',
        brandNames: '',
        brandIds: [] as any,
        treeCodeList: [] as any
      }
      const newArr = [] as any
      if (state.treeCode) {
        const codeArr = state.treeCode.split('-') as any
        if (codeArr && codeArr.length) {
          for (let i = 0; i < codeArr.length; i++) {
            const newList = codeArr.slice(0, i + 1)
            newArr.push(newList.join('-'))
          }
        }
        state.form.treeCodeList = newArr
      }
      state.dialogTitle = '添加品牌关联分类'
      state.isEdit = false
      state.dialogVisible = true
    }
    const changeRecommand = async(val:any) => {
      if (val && val.id) {
        await fetch({
          url: '/mall/brand/relation/setRecommandStatus',
          method: 'get',
          params: {
            recommandStatus: val.recommandStatus,
            brandId: val.id,
            treeCode: state.treeCode
          }
        }).then((res: any) => {
          if (res.data) {
            ElMessage.success('设置成功')
            getData()
          } else {
            ElMessage.error(res.msg)
          }
        })
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
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑品牌'
      state.isEdit = true
      state.form = { ...row }
    }
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row)
      })
    }
    const addData = async () => {
      await fetch({
        url: '/mall/brand/addRelation',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('分类关联品牌添加成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/brand/relation/listByTreeCode',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          treeCode: state.treeCode,
          ...state.listQuery
        }
      }).then((res: any) => {
        console.log(res)
        state.tableData = res.data
        state.loading = false
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
        }
      })
    }
    const deleteData = async (row: any) => {
      await fetch({
        url: '/mall/brand/removeRelation',
        method: 'get',
        params: {
          brandId: row.id || '',
          treeCode: row.treeCode || ''
        }
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg || '删除失败')
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
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          const codeList: any = []
          state.form.treeCodeList.map((item: any) => {
            codeList.push(item[item.length - 1])
          })
          state.form.treeCodeList = codeList
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
    const productcategoryPlat = async () => {
      await fetch({
        url: `/mall/platformcategory/tree`,
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data
      })
    }
    const handleChange = (val: any) => {
      console.log(val)
      // state.form.treeCode = val[val.length - 1]
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
      if (props.protType == 2) {
        getProductTree()
      } else {
        productcategoryPlat()
      }
      // getData()
      // rowDrop()
    })

    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.name.indexOf(value) !== -1
    }
    watch(state, (value) => {
      tree.value.filter(state.filterText)
    })
    return {
      tree,
      rules,
      ruleForms,
      // rowDrop,
      getBrandIds,
      handleConfirmBrand,
      productcategoryPlat,
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
      changeRecommand,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
