<template>
  <div>
    <div class="app-container">
      <!--      <el-card shadow="never">-->
      <!--        <el-button-->
      <!--          class="btn-add"-->
      <!--          size="mini"-->
      <!--          :type="buttonType"-->
      <!--          style="margin-right: 20px"-->
      <!--          -->
      <!--          @click="addBrand()"-->
      <!--        >-->
      <!--          添加-->
      <!--        </el-button>-->
      <!--        <el-input-->
      <!--          v-model="listQuery.name"-->
      <!--          style="width: 203px"-->
      <!--          placeholder="品牌名称"-->
      <!--        />-->
      <!--        <el-button-->
      <!--          style="margin-left: 20px"-->
      <!--          class="btn-add"-->
      <!--          size="mini"-->
      <!--          icon="Search"-->
      <!--          :type="buttonType"-->
      <!--          @click="getData()"-->
      <!--        >-->
      <!--          查询-->
      <!--        </el-button>-->
      <!--      </el-card>-->

      <div class="department_content">
        <div class="left" :style="'height: ' + tableHeight + 'px'">
          <div class="add">
            <el-input
              v-model="filterText"
              size="mini"
              style="width: 100%"
              placeholder="输入关键字进行过滤"
            />
          </div>
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="changeTypName"
          >
          </el-tree>
        </div>

        <div style="width: 80%">
         <el-table stripe  ref="brandTable"
            v-loading="loading"
            :data="tableData"
            style="width: 100%; margin-top: 10px"
            :height="tableHeight"
            border
            @selection-change="handleSelectionChange"
          >
            <!--            <el-table-column type="selection" width="60" align="center" />-->
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <el-table-column
              label="配置名称"
              align="center"
              prop="configName"
            ></el-table-column>
            <el-table-column
              label="配置标识"
              width="100"
              align="center"
              prop="configCode"
            ></el-table-column>
            <el-table-column label="值" align="center">
              <template #default="scope">
                <div v-if="scope.row.configValueType === 4">
                  {{ scope.row.charValue }}
                </div>
                <div v-if="scope.row.configValueType === 3">
                  {{ scope.row.lowValue }}~{{ scope.row.highValue }}
                </div>
                <div v-if="scope.row.configValueType === 2">
                  {{ scope.row.numericValue }}
                </div>
                <div v-if="scope.row.configValueType === 1">
                  {{ scope.row.charValue }}
                </div>
                <div v-if="scope.row.configValueType === 0">
                  {{ scope.row.bitValue ? '是' : '否' }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作" fixed="right"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="edit"
                  @click="handleUpdate(scope.row)"
                > 编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--          <el-pagination-new-->
          <!--            :current-page="currentPage"-->
          <!--            :page-size="pagesize"-->
          <!--            :total="total"-->
          <!--            layout="total, prev, pager, next, jumper"-->
          <!--            @current-change="handleCurrentChange"-->
          <!--          />-->
        </div>
      </div>

      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-if="dialogVisible"
        v-model="dialogVisible"
        :title="dialogTitle"
        width="53rem"
      >
        <div style="height: 100px; overflow-y: auto">
          <el-form
            ref="ruleForms"
            :model="form"
            :rules="rules"
            label-width="60px"
          >
            <el-form-item
              label="值"
              prop=""
              v-if="form.configValueType === 0"
            >
              <el-select v-model="form.bitValue" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值" v-if="form.configValueType === 1">
              <el-input v-model="form.charValue" />
            </el-form-item>
            <el-form-item label="值" v-if="form.configValueType === 2">
              <el-input
                v-model="form.numericValue"
                type="number"
              />
            </el-form-item>
            <el-form-item label="值" v-if="form.configValueType === 4">
              <el-select
                v-model="charValue"
                placeholder="请选择"
                multiple
              >
                <el-option
                  v-for="item in options2"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上限值" v-if="form.configValueType === 3">
              <el-input v-model="form.highValue"  />
            </el-form-item>
            <el-form-item label="下限值" v-if="form.configValueType === 3">
              <el-input v-model="form.lowValue" />
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
  watchEffect,
  watch
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
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
      options2: [] as any,
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      filterText: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'configTypeName',
        value: 'configTypeCode',
        multiple: true
      },
      selectBrandType: false,
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
      charValue: [] as any,
      form: {
        bitValue: true as any,
        charValue: '',
        companyId: 0,
        configCode: '',
        configId: 0,
        configName: '',
        configTypeCode: '',
        configTypeId: 0,
        configTypeName: '',
        configValueType: 0, // configValueType	值类型 0-真假型 1-字符型 2-数值型 3-区间型 4-下拉多选
        highValue: 0,
        lowValue: 0,
        numericValue: 0,
        options: '',
        remark: '',
        skillId: 0 as any
      },
      listQuery: {
        name: ''
      },
      configTypeCode: ''
    })

    const rules = reactive({
      treeCodeList: [
        { required: true, message: '请选择分类', trigger: 'blur' }
      ],
      brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }]
    })

    const changeTypName = (row: any) => {
      state.configTypeCode = row.configTypeCode
      getData()
      // getValue()
    }
    const getValue = async () => {
      await fetch({
        url: ' /admin/skillconfig/val/bool',
        method: 'get',
        params: {
          configCode: state.configTypeCode,
          skillId: sessionStorage.getItem('skillId')
        }
      }).then((res: any) => {
      })
    }
    const handleUpdate = (row: any) => {
      // configValueType	值类型 0-真假型 1-字符型 2-数值型 3-区间型 4-下拉多选
      state.dialogVisible = true
      state.dialogTitle = '编辑岗位配置'
      state.isEdit = true
      state.form = { ...row }
      state.form.skillId = sessionStorage.getItem('skillId')
      state.charValue = state.form.charValue.split(',')
      state.options2 = state.form.options.split(',')
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/admin/skillconfig/list',
        method: 'get',
        params: {
          configTypeCode: state.configTypeCode,
          skillId: sessionStorage.getItem('skillId')
        }
      }).then((res: any) => {
        state.tableData = res.data
        // state.total = res.data.total
        state.loading = false
        // console.log(res.data.records)
      })
    }
    const editData = async () => {
      await fetch({
        url: '/admin/skillconfig/modify',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.code === 0) {
          state.dialogVisible = false
          ElMessage.success('岗位配置编辑成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const handleConfirm = () => {
      if (state.form.configValueType == 4) {
        state.form.charValue = state.charValue.toString()
      }

      ruleForms.value.validate((valid: any) => {
        if (valid) {
          if (!state.isEdit) {
            // addData()
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

    const getTypeList = async () => {
      await fetch({
        url: `/admin/skillconfig/type/list`,
        method: 'get'
      }).then((res: any) => {
        console.log(res)
        state.treeData = res.data
      })
    }
    const handleChange = (val: any) => {
      console.log(val)
      // state.form.treeCode = val[val.length - 1]
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 150
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.configTypeName.indexOf(value) !== -1
    }
    watch(state, (value) => {
      tree.value.filter(state.filterText)
    })
    onMounted(() => {
      getTypeList()
      // getValue()
    })

    return {
      tree,
      rules,
      ruleForms,
      // rowDrop,
      filterNode,
      getTypeList,
      handleChange,
      getData,
      editData,
      handleUpdate,
      handleConfirm,
      changeTypName,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.configTypeName {
  line-height: 50px;
  text-align: left;
  cursor: pointer;
  padding-left: 20px;
  padding-right: 20px;
  overflow: auto;
}

.department_content {
  display: flex;
  margin-top: 10px;

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
