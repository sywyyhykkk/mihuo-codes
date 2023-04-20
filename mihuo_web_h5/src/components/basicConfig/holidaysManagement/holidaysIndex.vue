<template>
  <div>
    <el-card>
      <el-date-picker
        v-model="searchData.year"
        type="year"
        value-format="YYYY"
        placeholder="选择年"
        @change="handelChange"
      />
      <el-button type="primary" @click="handelClick('一键导入',{})">一键导入</el-button>
      <div class="el-card-right">
        <el-button icon="plus" type="primary" @click="handelClick('添加',{})">添加</el-button>
      </div>
    </el-card>
    <el-table
      stripe
      :data="tableData"
      style="height: calc(100vh - 22rem) "
      :height="'0'"
      border
    >
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column prop="date" align="center" label="日期" />
      <el-table-column prop="name" align="center" label="节假日名称" />
      <el-table-column prop="type" align="center" label="类型">
        <template #default="scope">
          {{
            scope.row.type == '10' ? '国家法定节假日' : scope.row.type == '20' ? '周末休息日' : '其他'
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="delete"
            class="danger"
            @click="handelClick('删除',scope.row)"
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
      @current-change="handleCurrentChange"
    />
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="设置节假日"
      width="56rem"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        label-width="12rem"
        :rules="rules"
      >
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="state.form.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            :default-value="new Date()"
          />
        </el-form-item>
        <el-form-item label="节假日名称" prop="name">
          <el-input v-model="state.form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="节假日类型" prop="type">
          <el-select
            v-model="state.form.type"
            filterable
            allow-create
            placeholder="选择类型"
          >
            <el-option
              v-for="item in state.optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="dialogVisible=false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>


import { onMounted, reactive, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'
import moment from 'moment'
import { ElMessageBox, ElMessage } from 'element-plus'

const tableData = ref<object[]>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(30)
const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const ruleForms = ref<any>('')
const searchData = reactive<any>({
  year: moment(new Date()).format('YYYY')
})
const state = reactive({
  form: {} as any,
  optionsType: [
    { label: '国家法定节假日', value: 10 },
    { label: '周末休息日', value: 20 },
    { label: '其他', value: 30 }
  ]
})
const rules = reactive({
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  name: [{ required: true, message: '请输入节假日名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择节假日类型', trigger: 'change' }]
})

const handelClick = (val: string, data: any) => {
  switch (val) {
    case '添加':
      dialogVisible.value = true
      state.form = {}
      break
    case '删除':
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        deleteData(data.date)
      })
      break
    case '一键导入':
      importData()
      break
  }
}
const handelConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      addData()
    }
  })
}

const handelChange = () => {
  getData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}
const importData = async () => {
  await fetch({
    url: `/admin/sysholiday/importHoliday/${searchData.year}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == 0) {
      ElMessage.success('导入成功')
      getData()
    }
  })
}
const addData = async () => {
  await fetch({
    url: '/admin/sysholiday/add',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      dialogVisible.value = false
      ElMessage.success('添加成功')
      getData()
    }
  })
}
const deleteData = async (date: any) => {
  await fetch({
    url: `/admin/sysholiday/remove/${date}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除成功')
      getData()
    }
  })
}
const getData = async () => {
  await fetch({
    url: `/admin/sysholiday/page`,
    method: 'get',
    params: {
      size: pagesize.value,
      current: currentPage.value,
      ...searchData
    }
  }).then((res: any) => {
    tableData.value = res.data.records
    total.value = res.data.total
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>
