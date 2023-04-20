<template>
  <div class="app-container">
    <el-card shadow="never">
      <div class="el-card-right">
        <el-button icon="refreshLeft" @click="backPage()"> 返回 </el-button>
        <el-button :type="buttonType" icon="plus" @click="addProductAttr()"
          >添加
        </el-button>
      </div>
    </el-card>
    <el-table
      ref="productAttrTable"
      v-loading="state.loading"
      stripe
      :data="state.tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column prop="id" label="Id" width="100" align="center" />
      <el-table-column
        prop="name"
        label="属性名称"
        width="100"
        align="center"
      />
      <el-table-column label="商品类型" width="140" align="center">
        <template #default>{{ state.typeName }}</template>
      </el-table-column>
      -->
      <el-table-column label="属性是否可选" width="120" align="center">
        <template #default="{ row }">
          {{ selectTypeFilter(row.selectType) }}
        </template>
      </el-table-column>
      <el-table-column label="属性值的录入方式" width="150" align="center">
        <template #default="{ row }">
          {{ inputTypeFilter(row.inputType) }}
        </template>
      </el-table-column>
      <el-table-column label="可选值列表" align="center">
        <template #default="{ row }">{{ row.inputList }}</template>
      </el-table-column>
      <el-table-column label="排序" width="100" align="center">
        <template #default="{ row }">{{ row.sort }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template #default="{ row }">
          <el-button
            type="text"
            size="mini"
            icon="edit"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="delete"
            class="danger"
            @click="handleDelete(row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--      <div class="batch-operate-container">-->
    <!--        <el-select-->
    <!--          v-model="operateType"-->
    <!--          size="small"-->
    <!--          placeholder="批量操作"-->
    <!--        >-->
    <!--          <el-option-->
    <!--            v-for="item in operates"-->
    <!--            :key="item.value"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--        <el-button-->
    <!--          style="margin-left: 20px"-->
    <!--          class="btn-add"-->
    <!--          :type="buttonType"-->
    <!--          size="small"-->
    <!--          @click="handleBatchOperate()"-->
    <!--        >-->
    <!--          确定-->
    <!--        </el-button>-->
    <!--      </div>-->

    <el-pagination-new
      :current-page="state.currentPage"
      :page-size="state.pagesize"
      :total="state.total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-model="state.dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="state.dialogTitle"
      lock-scroll="false"
      width="57rem"
    >
      <div style="height: 68vh; overflow-y: scroll">
        <el-form
          ref="ruleForms"
          :model="formData"
          :rules="rules"
          label-width="13rem"
        >
          <el-form-item label="属性名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <!-- <el-form-item label="商品类型">
            <el-input v-model="formData.name" disabled />
          </el-form-item> -->
          <el-form-item label="分类筛选样式">
            <el-radio-group v-model="formData.filterType">
              <el-radio :label="0">普通</el-radio>
              <el-radio :label="1">颜色</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="能否进行检索">
            <el-radio-group v-model="formData.searchType">
              <el-radio :label="0">不需要检索</el-radio>
              <el-radio :label="1">关键字检索</el-radio>
              <el-radio :label="2">范围检索</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品属性关联">
            <el-radio-group v-model="formData.relatedStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性是否可选">
            <el-radio-group v-model="formData.selectType">
              <el-radio :label="0">唯一</el-radio>
              <el-radio :label="1">单选</el-radio>
              <el-radio :label="2">复选</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性录入方式">
            <el-radio-group v-model="formData.inputType">
              <el-radio :label="0">手工录入</el-radio>
              <el-radio :label="1">从下面列表中选择</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性可选值">
            <!--            <el-input v-model="formDatatListFormat" :autosize="true" type="textarea" />-->
            <el-select
              v-model="formData.inputListFormat"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请输入可选属性"
            >
              <el-option
                v-for="item in state.inputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支持手动新增">
            <el-radio-group v-model="formData.handAddStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序属性">
            <el-input v-model="formData.sort" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm()">确 定</el-button>
          <el-button @click="state.dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import form from '@/pages/enterprise/store/modules/form'

const emit = defineEmits(['eidtPageType'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  tableType: {
    type: Number,
    default: null
  },
  protType: {
    //	type=1平台分类，type=2企业分类,type=3 运营分类
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
})

const ruleForms = ref<any>('')
const state = ref({
  inputOptions: [],
  tableData: [],
  loading: false,
  tableHeight: 0,
  currentPage: 1,
  total: 0,
  pagesize: 10,
  operates: [],
  dialogVisible: false,
  dialogTitle: '',
  typeName: props.modelValue.name,
  isEdit: false
})

const formData = ref<any>({
  name: '',
  filterType: 0,
  handAddStatus: 0,
  inputList: '',
  inputType: 1,
  productAttributeCategoryId: props.modelValue.id,
  inputListFormat: [],
  relatedStatus: 0,
  searchType: 0,
  selectType: 0,
  sort: 0,
  type: props.tableType,
  id: 0
})

const rules = reactive({
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
})
const handleCurrentChange = (val: number) => {
  state.value.currentPage = val
  getData()
}
const addProductAttr = () => {
  state.value.dialogVisible = true
  state.value.dialogTitle =
    props.tableType === 0
      ? '添加属性'
      : props.tableType === 1
      ? '添加参数'
      : '添加输入'
  state.value.isEdit = false
  formData.value.name = ''
  formData.value.id = 0
  formData.value.filterType = 0
  formData.value.handAddStatus = 0
  formData.value.inputList = ''
  formData.value.inputListFormat = []
  formData.value.inputType = 1
  formData.value.productAttributeCategoryId = props.modelValue.id
  formData.value.relatedStatus = 0
  formData.value.searchType = 0
  formData.value.selectType = 0
  formData.value.sort = 0
  // state.value.form.type = 0
}
const handleUpdate = (row: any) => {
  state.value.dialogVisible = true

  state.value.dialogTitle =
    props.tableType === 0
      ? '编辑属性'
      : props.tableType === 1
      ? '编辑参数'
      : '编辑输入'

  state.value.isEdit = true
  // state.form.name = row.name
  // state.form.id = row.id
  // state.form.filterType = row.filterType
  // state.form.handAddStatus = row.handAddStatus
  // state.form.inputList = row.inputList
  // state.form.inputType = row.inputType
  // state.form.productAttributeCategoryId = row.productAttributeCategoryId
  // state.form.relatedStatus = row.relatedStatus
  // state.form.searchType = row.searchType
  // state.form.selectType = row.selectType
  // state.form.sort = row.sort\
  formData.value = {}
  formData.value = { ...row, inputListFormat: row.inputList?.split(',') }

  console.log(formData.value)

  // state.form.type = row.type
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
    url: '/mall/productattribute/create',
    method: 'post',
    data: formData.value
  }).then((res: any) => {
    if (res.data) {
      state.value.dialogVisible = false

      ElMessage.success(
        props.tableType === 0
          ? '商品属性添加成功'
          : props.tableType === 1
          ? '商品参数添加成功'
          : '输入类参数添加成功'
      )
      getData()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const getData = async () => {
  state.value.loading = true

  try {
    const res: any = await fetch({
      url: '/mall/productattribute/page',
      method: 'get',
      params: {
        productAttributeCategoryId: formData.value.productAttributeCategoryId,
        size: state.value.pagesize,
        current: state.value.currentPage,
        type: props.tableType
        // cityOperatorId:props.cityOperatorId
      }
    })

    if (res.code === 0) {
      state.value.tableData = res.data.records
      state.value.total = res.data.tota
      state.value.loading = false
    }
  } catch (error) {
    console.error(error)
  }
}
const editData = async () => {
  await fetch({
    url: '/mall/productattribute/update',
    method: 'post',
    data: formData.value
  }).then((res: any) => {
    if (res.data) {
      state.value.dialogVisible = false

      ElMessage.success(
        props.tableType === 0
          ? '商品属性编辑成功'
          : props.tableType === 1
          ? '商品参数编辑成功'
          : '输入类参数编辑成功'
      )
      getData()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const deleteData = async (id: any) => {
  await fetch({
    url: '/mall/productattribute/delete/' + id,
    method: 'post'
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('删除成功')
      getData()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      formData.value.inputList = formData.value.inputListFormat.toString()
      delete formData.value.inputListFormat
      if (!state.value.isEdit) {
        addData()
      } else {
        editData()
      }
    } else {
      alert('请完善信息')
      return false
    }
  })
}

const getAttrList = async (row: any) => {
  await fetch({
    url: '/mall/productattribute/' + row.id,
    method: 'get'
  }).then((res: any) => {
    state.value.tableData = res.data.records
    state.value.total = res.data.total
    state.value.loading = false
  })
}
const inputTypeFilter = (value: any) => {
  if (value === 1) {
    return '从列表中选取'
  } else {
    return '手工录入'
  }
}
const selectTypeFilter = (value: any) => {
  if (value === 1) {
    return '单选'
  } else if (value === 2) {
    return '多选'
  } else {
    return '唯一'
  }
}
const backPage = () => {
  emit('eidtPageType')
}

const getHeight = () => {
  // 获取浏览器高度并计算得到表格所用高度。
  state.value.tableHeight = document.documentElement.clientHeight - 220
}
watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})
onMounted(() => {
  getData()
})
</script>

<style scoped lang="less">
.batch-operate-container {
  float: left;
  margin-top: 20px;
}
</style>
