<template>
  <div>
    <!--        <projectDetail/>-->
    <div class="app-container">
      <el-card shadow="never">
        <el-input
          v-model="listQuery.address"
          prefix-icon="Search"
          clearable
          placeholder="请输入项目地址"
        />
        <el-input
          v-model="listQuery.customerName"
          prefix-icon="Search"
          clearable
          placeholder="请输入客户姓名"
        />
        <el-input
          v-model="listQuery.customerPhone"
          prefix-icon="Search"
          type="number"
          maxlength="11"
          clearable
          placeholder="请输入客户电话"
        />
        <el-input
          v-model="listQuery.customerCode"
          prefix-icon="Search"
          clearable
          placeholder="请输入客户编码"
        />
        <el-select
          v-model="listQuery.templateId"
          style="width: 24rem !important"
          placeholder="请选择SOP模版"
          clearable
        >
          <el-option
            v-for="(item, index) in sopTemplates"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          type="primary"
          icon="Search"
          style="margin-left: 2rem"
          @click="getData()"
        >查询</el-button>
        <el-button
          icon="refresh"
          style="margin-left: 2rem"
          @click="clearSearch()"
        >重置</el-button>
        <div v-if="!isReadonly" class="el-card-right">
          <el-button>导出</el-button>
          <el-button type="primary" plain>导入</el-button>
          <el-button
            v-if="$getPression('order_bizproject_add')"
            type="primary"
            icon="plus"
            @click="addProjectHandel()"
          >新增项目
          </el-button>
        </div>
      </el-card>
      <!--      :height="getBrandNameType ? '55vh' : '0'"-->
      <div :class="getBrandNameType ? '' : 'department_content'">
        <div style="width: 100%">
          <el-table
            ref="brandTable"
            v-loading="loading"
            stripe
            :data="tableData"
            :style="
              getBrandNameType
                ? 'height:50vh !important'
                : 'height:calc(100vh - 24rem) !important;'
            "
            :height="
              getBrandNameType
                ? '50vh !important'
                : 'calc(100vh - 24rem) !important;'
            "
            highlight-current-row
            border
            @cell-dblclick="onDoubleClick"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChangeGet"
          >
            <!--            <el-table-column type="selection" width="60" align="center" />-->
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <!-- <el-table-column label="项目地址" prop="latAddress" width="260" /> -->
            <el-table-column label="项目地址" align="left" width="260">
              <template #default="{ row }">
                <div class="nameBox" @click="goProjectDetail(row)">
                  <img src="@/assets/img/block.png" class="block">
                  <span>{{ row.districtName || '' }}{{ row.poiName
                  }}{{ row.address }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模版名称" prop="templateName" width="140" />
            <el-table-column
              label="客户姓名"
              width="140"
              align="center"
              prop="customerName"
            />
            <el-table-column label="客户性别" width="100" align="center">
              <template #default="{ row }">
                <div>
                  {{
                    row.customerGender == 2
                      ? '女'
                      : row.customerGender == 1
                        ? '男'
                        : row.customerGender
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="客户电话"
              width="140"
              align="center"
              prop="customerPhone"
            />
            <el-table-column
              label="客户编码"
              width="180"
              align="center"
              prop="customerCode"
            >
              <template #default="scope">
                <el-tooltip content="双击复制客户编码">
                  {{ scope.row.customerCode }}
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="施工合同编号"
              align="center"
              width="180"
              prop="contractCode"
            />
            <el-table-column
              label="合同工期(天)"
              align="center"
              width="150"
              prop="contractDuration"
            />
            <el-table-column label="合同金额(元)" align="center" width="150">
              <template #default="scope">
                <div class="contract-amount">
                  ￥{{ scope.row.contractAmount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="户型"
              width="100"
              align="center"
              prop="model"
            />
            <el-table-column
              label="房型"
              width="100"
              align="center"
              prop="roomType"
            />
            <el-table-column
              label="面积(m²)"
              width="100"
              align="center"
              prop="usableArea"
            />
            <el-table-column
              label="装修方式"
              width="100"
              align="center"
              prop="way"
            />
            <el-table-column
              v-if="!isReadonly"
              label="操作"
              fixed="right"
              width="220"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-if="$getPression('order_bizproject_edit')"
                  size="mini"
                  type="text"
                  icon="edit"
                  :disabled="getBrandNameType"
                  @click="handleUpdate(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="$getPression('order_bizproject_del')"
                  type="text"
                  size="mini"
                  icon="delete"
                  class="danger"
                  :disabled="getBrandNameType"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
                <el-button
                  v-if="$getPression('order_bizproject_obsolete')"
                  type="text"
                  size="mini"
                  class="danger"
                  icon="documentDelete"
                  :disabled="getBrandNameType"
                  @click="handleObsolete(scope.row)"
                >
                  作废
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination-new
            :style="{ position: isReadonly ? 'relative' : 'absolute' }"
            :current-page="currentPage"
            :page-size="pagesize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!--    //新增编辑项目-->
    <projectSetting
      v-model="dialogVisible"
      :is-edit="isEdit"
      :project-id="projectId"
      @getData="getData"
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
  watchEffect,
  watch,
  getCurrentInstance,
  provide,
  inject,
  computed,
  onActivated
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import projectDetail from '_c/project/projectItem/projectDetail.vue'
import { useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import MapContainer from '_c/MapContainer/index.vue'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { baseDecode, baseEncode } from '@/utils/utils'
import store from '_@/store'
import { set } from 'lodash'

export default defineComponent({
  components: {},
  props: {
    isReadonly: {
      type: Boolean,
      default: false
    },
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
    getSelectData: {
      type: Function,
      default: null
    },
    getBrandNameType: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { ctx: _this }: any = getCurrentInstance()
    const { push, addRoute, currentRoute, afterEach } = useRouter()
    const tree = ref<any>('')
    const brandTable = ref<any>(null)
    const ruleForms = ref<any>('')
    const visitedViews = computed(() => tagsViewStore.visitedViews)
    const state = reactive({
      sopTemplates: [], // 项目模版
      projectId: '', // 项目id
      mapDialogVisible: false,
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
      pagesize: 20,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        latAddress: '',
        address: '',
        backupPhone: '',
        city: '',
        contractAmount: null,
        contractCode: '',
        contractDuration: null,
        customerCode: '',
        customerGender: '',
        customerName: '',
        customerPhone: '',
        latitude: 0,
        longitude: 0,
        model: '',
        province: '',
        referrer: '',
        referrerId: 0,
        region: '',
        roomType: '',
        source: 0,
        usableArea: '',
        way: ''
      },
      listQuery: {
        address: '',
        templateId: '',
        customerPhone: '',
        customerName: '',
        customerCode: '' // 客户编码
      },
      detailForm: {} as any
    }) as any

    const goProjectDetail = (row: any) => {
      if (props.isReadonly) return
      if (props.getBrandNameType) return
      state.detailForm = row
      wsCache.set('projectDetail', Object.assign(row))
      sessionStorage.setItem('detailFrom', JSON.stringify(row))
      sessionStorage.setItem('projectId', row.id)
      push({ path: `/bizproject/projectDetail/${baseEncode(row.id)}` })
    }
    
    afterEach((to, from) => {
      if (to.name === 'projectAbolish' || to.name === 'projectDetail') {
        const address =
          state.detailForm.districtName +
          state.detailForm.poiName +
          state.detailForm.address
        to.meta.title = address
      }
    })

    // 右键点击项目
    const onDoubleClick = (row: any, column: any, cell: any, event: any) => {
      ElMessage.success('客户编码复制成功')
      const save = function (e: any) {
        e.clipboardData.setData('text/plain', event.target.innerText)
        e.preventDefault() // 阻止默认行为
      }
      document.addEventListener('copy', save)
      document.execCommand('copy')
    }

    // 关联项目时点击项目
    const onRowClick = (row: any) => {
      emit('update:modelValue', false)
      emit('projectPicked', row)
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const addProjectHandel = () => {
      state.dialogVisible = true
      state.isEdit = false
      state.projectId = ''
    }
    const handleCurrentChangeGet = (val: any) => {
      if (props.getBrandNameType) {
        emit('getSelectData', val)
        emit('getBrandName', val.name)
      }
    }

    const handleUpdate = async (row: any) => {
      state.projectId = row.id
      state.dialogVisible = true
      state.isEdit = true
    }

    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除当前数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row.id)
      })
    }

    const handleObsolete = (row: any) => {
      state.detailForm = row
      push({ path: `/bizproject/projectAbolish/${baseEncode(row.id)}` })
    }

    const clearSearch = () => {
      state.listQuery = {
        address: '',
        templateId: '',
        customerPhone: '',
        customerName: '',
        customerCode: ''
      }
      getData()
    }

    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/order/bizproject/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          treeCode: state.treeCode,
          ...state.listQuery
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        // console.log(res.data.records)
      }).finally(() => {
        state.loading = false
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/order/bizproject/' + id,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        }
      })
    }
    const addClass = (i: any, x: number) => {
      state.loading = true
      state.current = x
      state.treeCode = i.treeCode
      getData()
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
      // console.log(val)
    }

    watch(
      () => store.state.allowRefresh,
      (newv) => {
        if (newv) {
          getData()
        }
      }
    )

    onMounted(() => {
      getProductTree()
      getData()
      getSopTemplates()
    })
    onActivated(() => {
      setTimeout(() => {
        brandTable.value.$refs.scrollWrapper.setScrollTop(600)
      }, 1)
    })

    // 获取sop模版
    const getSopTemplates = async () => {
      await fetch({
        url: 'order/soptemplate/getList?size=1000&templateType=1&showStatus=1',
        method: 'get'
      }).then((res: any) => {
        state.sopTemplates = res.data.filter((item: any) => item.defaultFlag === 0)
      })
    }

    const filterNode = (value: any, treeData: any) => {
      if (!value) return true
      return treeData.name.indexOf(value) !== -1
    }
    onBeforeRouteLeave((to: any, form: any, next: any) => {
      to.meta.tableScrollTop = 200
      next()
    })
    onBeforeRouteUpdate((to: any) => {
    })

    return {
      tree,
      brandTable,
      ruleForms,
      onDoubleClick,
      goProjectDetail,
      handleChange,
      filterNode,
      addClass,
      getData,
      deleteData,
      addProjectHandel,
      handleUpdate,
      handleDelete,
      handleObsolete,
      handleCurrentChange,
      getProductTree,
      handleCurrentChangeGet,
      onRowClick,
      clearSearch,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.block {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.el-dialog-form {
  height: 70vh;
  overflow-y: auto;
}

.el-dialog-form::-webkit-scrollbar {
  //display: none;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/ input[type='number'] {
  -moz-appearance: textfield;
}

.department_content {
  display: flex;
  //margin-top: 10px;

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

.contract-amount {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #4d4d4d;
  float: right;
}
</style>
