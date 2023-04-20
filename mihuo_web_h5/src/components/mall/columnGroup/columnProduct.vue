<template>
  <div>
    <div class="el-card-form">
      <div class="el-card-formLeft">
        <!--        <div class="add">-->
        <!--          <el-input-->
        <!--            v-model="filterText"-->
        <!--            size="mini"-->
        <!--            style="width: 100%"-->
        <!--            placeholder="输入关键字进行过滤"-->
        <!--          />-->
        <!--        </div>-->
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="addClass"
        >
          <template #default="{ node, data }">
            <div class="el-card-custom">
              <span :style="data.id === treeCode ? 'color: #0969DA;' : ''">{{
                  node.label
                }}</span>
            </div>
          </template>
        </el-tree>
      </div>

      <div class="el-card-formRight">
        <el-card>
          <div class="el-card-right">
            <el-button :type="buttonType" icon="plus" @click="addBrand()"
            >添加
            </el-button
            >
          </div>
        </el-card>
        <el-table
          stripe
          ref="brandTable"
          v-loading="loading"
          :data="tableData"
          :height="'0'"
          style="height: calc(100vh - 31rem) !important"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" sortable />
          <el-table-column label="商品图片" width="120" align="center">
            <template #default="scope">
              <el-image
                preview-teleported
                lazy
                style="height: 80px"
                :src="$imageGlobal + scope.row.coverImg"
                :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" sortable>
            <template #default="scope">
              <p>{{ scope.row.name }}</p>
              <p>品牌：{{ scope.row.brandName }}</p>
              <p>关键字：{{ scope.row.keywords }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="价格/货号"
            align="center"
            width="200"
            sortable
          >
            <template #default="scope">
              <p>价格：￥{{ scope.row.price }}</p>
              <p>货号：{{ scope.row.productSn }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            prop="sort"
            width="90"
            align="center"
            sortable
          />
          <el-table-column label="销量" prop="sale" align="center" sortable />
          <el-table-column label="审核状态" width="100" align="center">
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
                  scope.row.verifyStatus == 0
                    ? '未审核'
                    : scope.row.verifyStatus == 1
                    ? '通过'
                    : '驳回'
                }}
              </el-tag>
              <!-- <p>
                <el-button
                  type="text"
                  @click="handleShowVerifyDetail(scope.$index, scope.row)"
                >审核详情
                </el-button>
              </p> -->
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
        width="54rem"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="10rem"
        >
          <el-form-item label="选择栏目" prop="groupId">
            <el-cascader
              v-model="form.groupId"
              :options="treeData"
              :props="defaultProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="选择商品" prop="ids">
            <el-input
              v-model="form.ids"
              @click="showProductTable = true"
            ></el-input>
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

    <productTable v-model="showProductTable" @getIds="getIds" />
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
import productTable from '@/components/mall/columnGroup/productTable.vue'
// import Sortable from 'sortablejs'

export default defineComponent({
  components: { productTable },
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
      showProductTable: false,
      filterText: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: false
      },
      current: -1,
      treeCode: '',
      treeId: 0 as any,
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
        groupId: '' as any,
        ids: []
      },
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10
      }
    })

    const rules = reactive({
      groupId: [{ required: true, message: '请选择栏目', trigger: 'blur' }],
      ids: [{ required: true, message: '请选择商品', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const addBrand = () => {
      state.dialogVisible = true
      state.dialogTitle = '商品归类'
      state.isEdit = false
      state.form = {
        groupId: state.treeId,
        ids: []
      }
    }
    const handleUpdate = (row: any) => {
      state.dialogVisible = true
      state.dialogTitle = '编辑栏目'
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
        url: '/mall/productgroup/addGroup',
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
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          // companyId: props.companyId,
          groupId: state.treeId,
          type: props.protType
          // cityOperatorId:props.cityOperatorId
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
        // console.log(res.data.records)
      })
    }
    const editData = async () => {
      // await fetch({
      //   url: '/mall/brand/update',
      //   method: 'post',
      //   data: state.form
      // }).then((res: any) => {
      //   if (res.data) {
      //     state.dialogVisible = false
      //     ElMessage.success('品牌编辑成功')
      //     getData()
      //   } else {
      //     ElMessage.error(res.msg)
      //   }
      // })
    }
    const deleteData = async (row: any) => {
      await fetch({
        url: '/mall/productgroup/removeGroup',
        method: 'post',
        data: {
          groupId: state.treeId,
          ids: row.id.split(',')
        }
      }).then((res: any) => {
        if (res.data) {
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
      state.treeId = i.id
      state.treeCode = i.groupCode
      state.form.groupId = state.treeId
      getData()
    }
    const handleConfirm = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.form)
          if (!state.isEdit) {
            state.form.groupId = parseInt(state.form.groupId)
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
        url: `/mall/productgroup/tree`,
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data
      })
    }
    const handleChange = (val: any) => {
      console.log(val)
      state.form.groupId = val[val.length - 1]
    }
    const getIds = (val: any) => {
      state.form.ids = val
      console.log('ssd', val)
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 251
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    onMounted(() => {
      getProductTree()
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
      getIds,
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
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.department_content {
  display: flex;

  .left {
    width: 20vw;
    margin-right: 20px;
    overflow-y: auto;
    background-color: white;
    border-radius: 5px;
    text-align: center;
    padding-top: 20px;

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

    .workerClass {
      color: #fd6d34;
      //background-color: yellow;
      list-style: none;
      line-height: 25px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 12px;

      li {
        cursor: pointer;
      }
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
}
</style>
