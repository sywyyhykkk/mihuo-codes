<template>
  <div>
    <el-card>
      <el-input
        v-model="search.name"
        placeholder="类型"
        prefix-icon="Search"
        clearable
        @change="getData()"
      />
      <!--      <el-select placeholder="字典类型" v-model="search.type" />-->
      <!--      <el-button type="primary" size="mini" @click="getData()">查询</el-button>-->
      <!--      <div class="el-card-right">-->
      <!--        <el-button icon="plus" type="primary" v-if="protType=='1'" @click="editData('添加',{})">添加</el-button>-->
      <!--      </div>-->
    </el-card>
    <DictionaryCustomerTable
      :handleWidth="200"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :total="total"
      :pagesize="pagesize"
      :form="form"
      @handleChange="handleChange"
      @handleSwitch="handleSwitch"
      @handleChecked="handleChecked"
    >
      <template #handle="scope">
        <el-button
          type="text"
          icon="grid"
          @click="() => editData('字典项', scope.row)"
          >字典项</el-button
        >
        <!--        <el-button type="text" :disabled="protType=='2'" icon="edit" @click="editData('编辑',scope.row)">编辑</el-button>-->
        <!--        <el-button type="text" class="danger" :disabled="protType=='2'" icon="delete" @click="editData('删除',scope.row)">-->
        <!--          删除-->
        <!--        </el-button>-->
      </template>
    </DictionaryCustomerTable>
    <el-dialog
      title="字典项"
      :close-on-click-modal="false"
      v-model="showDia"
      v-if="showDia"
      width="110rem"
    >
      <div style="height: 65vh; padding-right: 2rem">
        <el-card>
          <div class="el-card-right">
            <el-button type="primary" icon="plus" @click="addItemDic">
              新增
            </el-button>
          </div>
        </el-card>
        <DictionaryCustomerTable2
          v-if="showDia"
          :handleWidth="200"
          :tableTitle="tableItemTitle"
          :tableData="dicItemData"
          :total="itemTotal"
          :pagesize="pagesize"
          @handleChange="handleItemChange"
        >
          <template #handle="scope">
            <el-button
              class=""
              type="text"
              icon="edit"
              :disabled="companyId != scope.row.companyId"
              @click="editItemData(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              icon="delete"
              class="danger"
              :disabled="companyId != scope.row.companyId"
              @click="deleteData(scope.row)"
              >删除
            </el-button>
          </template>
        </DictionaryCustomerTable2>
      </div>
    </el-dialog>
    <el-dialog
      v-model="showEdit"
      :title="dialogTitle == 'add' ? '新增' : '编辑'"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="itemFrom"
        ref="dicForm"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="类型" prop="type">
          <el-input
            placeholder="类型"
            v-model="itemFrom.type"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="数据值" prop="value">
          <el-input
            placeholder="数据值"
            v-model="itemFrom.value"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input
            placeholder="名称"
            v-model="itemFrom.label"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            placeholder="描述"
            v-model="itemFrom.description"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input
            placeholder="序号"
            v-model="itemFrom.sort"
            autocomplete="off"
            type="number"
          />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            type="textarea"
            placeholder="备注信息"
            v-model="itemFrom.remarks"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="editSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <settingDictType
      v-model="showDictType"
      :isEdit="isEdit"
      :data="chooseDict"
      @getData="getData"
    />
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  defineComponent,
  markRaw,
  reactive,
  ref,
  onMounted,
  toRefs,
  unref
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import wsCache from '@/cache'

export default defineComponent({
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    }
  },
  components: { Search },
  setup(props) {
    const total = ref(0)
    const pagesize = ref(12)
    const currentPage = ref(0)
    const currentItemPage = ref(1)
    const showDia = ref(false)
    const dialogTitle = ref('add')
    const buttonLoading = ref(false)
    const dicForm = ref()
    const companyId = ref(
      wsCache.get('companys') ? wsCache.get('companys')[0].companyId : null
    )
    const rules = reactive({
      type: [
        {
          required: true,
          message: '请输入类型',
          trigger: 'blur'
        }
      ],
      description: [
        {
          required: true,
          message: '请输入字典描述',
          trigger: 'blur'
        }
      ],
      label: [
        {
          required: true,
          message: '请选择字典类型',
          trigger: 'change'
        }
      ],
      value: [
        {
          required: true,
          message: '请输入数据值',
          trigger: 'change'
        }
      ],
      sort: [
        {
          required: true,
          message: '请输入排序序号',
          trigger: 'change'
        }
      ]
    })
    const tableTitle = markRaw([
      {
        prop: 'type',
        label: '类型',
        width: '100'
      },
      {
        prop: 'description',
        label: '描述',
        width: '100',
        filter: 'switch'
      },
      {
        prop: 'system',
        label: '字典类型',
        width: '200',
        filter: 'dictionary',
        dictionary: {
          0: '业务类',
          1: '系统类'
        }
      },
      {
        prop: 'remarks',
        label: '备注信息',
        width: '200'
      },
      {
        prop: 'createTime',
        label: '创建日期',
        width: '100',
        filter: 'date'
      }
    ])
    const tableItemTitle = markRaw([
      {
        prop: 'type',
        label: '类型',
        width: '100'
      },
      {
        prop: 'value',
        label: '数据值',
        width: '100'
      },
      {
        prop: 'label',
        label: '名称',
        width: '100'
      },
      {
        prop: 'description',
        label: '描述',
        width: '100',
        filter: 'switch'
      },
      {
        prop: 'sort',
        label: '排序',
        width: '200'
      },
      {
        prop: 'remarks',
        label: '备注信息',
        width: '200'
      }
    ])
    const state = reactive({
      showDictType: false,
      tableData: [],
      dicItemData: [],
      chooseDict: {},
      itemFrom: {},
      search: {},
      itemTotal: 0,
      dictId: 0,
      showEdit: false,
      isEdit: false
    })
    const handleChange = (current) => {
      // 分页改变时的回调----   size: 每页的数量   current: 第几页
      currentPage.value = current
      getData(current)
    }
    const handleItemChange = (current) => {
      currentItemPage.value = current
      getItemData(current)
    }
    const handleSwitch = (row, index) => {
      // 切换开关时的回调-========   this.tableData: 滑块值改变后的数据.row: 当前行数据 index: 当前行的索引
      console.log(this.tableData, '--tableData---', row, dictionary)
    }
    const handleChecked = (val) => {
      // 勾选时的回调----   val: 选中的数据  多选是val是数组, 单选时是对象
      console.log(val, 'val===')
    }

    //字典项
    const editData = (val, row) => {
      state.dictId = row.id
      state.chooseDict = row
      switch (val) {
        case '字典项':
          showDia.value = true
          getItemData(1)
          break
        case '添加':
          state.showDictType = true
          state.isEdit = false
          break
        case '编辑':
          state.showDictType = true
          state.isEdit = true
          break
        case '删除':
          ElMessageBox.confirm(
            `此操作将永久删除${row.type}, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            deleteTableData(row.id)
          })
          break
      }
    }
    //新增
    const addItemDic = () => {
      dialogTitle.value = 'add'
      state.showEdit = true
      state.itemFrom.type = state.chooseDict.type
      state.itemFrom.dictId = state.chooseDict.id
    }
    const editItemData = (row) => {
      dialogTitle.value = 'edit'
      state.showEdit = true
      state.itemFrom = row
    }
    //编辑和新增提交
    const editSubmit = () => {
      const dicFormV = unref(dicForm)
      dicFormV &&
        dicFormV.validate((res) => {
          if (res) {
            buttonLoading.value = true
            fetch({
              url: `/admin/dict/item`,
              method: dialogTitle.value === 'add' ? 'post' : 'put',
              data: state.itemFrom
            })
              .then((res) => {
                buttonLoading.value = false
                if (res.code == 0) {
                  state.itemFrom = {}
                  dicFormV.resetFields()
                  getItemData(currentItemPage.value)

                  ElMessage({
                    type: 'success',
                    message:
                      (dialogTitle.value === 'add' ? '新增' : '编辑') + '成功'
                  })

                  state.showEdit = false
                }
              })
              .catch((res) => {
                buttonLoading.value = false
              })
          } else {
            return false
          }
        })
    }
    //删除字典
    const deleteTableData = (id) => {
      fetch({
        url: `/admin/dict/${id}`,
        method: 'delete'
      }).then((res) => {
        if (res.code == 0) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData()
        }
      })
    }
    //删除字典项
    const deleteData = (row) => {
      ElMessageBox.confirm('该操作将会删除该条数据，是否继续?', '提示', {
        showCancelButton: false,
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        fetch({
          url: `/admin/dict/item/${row.id}`,
          method: 'delete'
        }).then((res) => {
          if (res.code == 0) {
            ElMessage({
              type: 'success',
              message: '已为你删除该条字典'
            })
            getItemData(currentItemPage.value)
          }
        })
      })
    }
    //得到数据
    const getData = async (current = 1) => {
      await fetch({
        url: '/admin/dict/page',
        method: 'get',
        params: {
          current: current,
          size: pagesize.value,
          descs: 'id',
          system: '0',
          type: state.search.name
        }
      }).then((res) => {
        state.tableData = res.data.records
        total.value = res.data.total
      })
    }
    //得到字典项
    const getItemData = (current = 1) => {
      fetch({
        url: '/admin/dict/item/page',
        method: 'get',
        params: {
          current: current,
          size: pagesize.value,
          dictId: state.dictId,
          descs: 'id'
        }
      }).then((res) => {
        state.dicItemData = res.data.records
        state.itemTotal = res.data.total
      })
    }
    onMounted(() => {
      //获取数据
      getData()
    })
    return {
      tableTitle,
      tableItemTitle,
      total,
      pagesize,
      dialogTitle,
      showDia,
      buttonLoading,
      rules,
      dicForm,
      companyId,
      getData,
      addItemDic,
      editSubmit,
      editItemData,
      handleItemChange,
      ...toRefs(state),
      handleChange,
      handleSwitch,
      handleChecked,
      editData,
      deleteData
    }
  }
})
</script>

<style>
:deep(.el-overlay) {
  z-index: 99 !important;
}
</style>
