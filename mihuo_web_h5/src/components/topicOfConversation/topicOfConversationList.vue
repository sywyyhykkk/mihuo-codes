<template>
  <div>
    <el-card>
      <el-input v-model="keyword" placeholder="请输入觅友圈话题" />
      <el-button type="primary" icon="search" @click="getData">查询 </el-button>
      <el-button icon="refreshLeft" @click="resetSearch">重置 </el-button>
      <div class="el-card-right">
        <el-button
          icon="plus"
          type="primary"
          @click="handelClick('添加', {})"
        >新增</el-button>
      </div>
    </el-card>
    <el-table
      stripe
      :data="tableData"
      style="height: calc(100vh - 22rem)"
      :height="'0'"
      border
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序号"
      />
      <el-table-column prop="createTime" align="center" label="创建时间" />
      <el-table-column prop="content" align="center" label="话题" />
      <el-table-column prop="referenceCount" align="center" label="话题出现次数" />
      <el-table-column
        label="操作"
        fixed="right"
        width="200"
        align="center"
      >
        <template #default="scope">
          <el-button
            v-if="$getPression('mall_smstopic_del')"
            :disabled="scope.row.referenceCount > 0"
            size="mini"
            type="text"
            icon="delete"
            class="danger"
            @click="handelClick('删除', scope.row)"
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
      :title="state.dialogTitle"
      width="56rem"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        label-width="13rem"
        :rules="rules"
      >
        <!-- <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="state.form.createTime"
            type="datetime"
            style="width: 60%"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-value="new Date()"
          />
        </el-form-item> -->
        <el-form-item label="话题名称" prop="content">
          <el-input v-model="state.form.content" maxlength="24" placeholder="请输入话题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="handelClose">取 消</el-button>
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
import { async } from '@antv/x6/lib/registry/marker/main'

const tableData = ref<object[]>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(30)
const dialogVisible = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  form: {} as any,
  operationType: '',
  dialogTitle: ''
})

const rules = reactive({
  content: [{ required: true, message: '请输话题名称', trigger: 'blur' }]
})

const handelClick = (val: string, data: any) => {
  state.operationType = val
  switch (val) {
    case '添加':
      state.dialogTitle = '新增话题'
      dialogVisible.value = true
      break
    case '删除':
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        deleteData(data.id)
      })
      break
  }
}

const handelConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (state.operationType === '添加') {
        addData()
      }
    }
  })
}

const handelClose = () => {
  dialogVisible.value = false
  state.form = {}
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const addData = async () => {
  await fetch({
    url: '/mall/smsfindcircle/admin/topic/create?topic=' + state.form.content,
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      handelClose()
      ElMessage.success('添加成功')
      getData()
    }
  })
}

const deleteData = async (id: any) => {
  await fetch({
    url: `/mall/smsfindcircle/admin/topic/remove?topicId=${id}`,
    method: 'delete'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除成功')
      getData()
    }
  })
}

const keyword = ref('')

const resetSearch = () => {
  keyword.value = ''
  getData()
}

const getData = async () => {
  await fetch({
    url: `/mall/smsfindcircle/admin/topic/page`,
    method: 'get',
    params: {
      size: pagesize.value,
      current: currentPage.value,
      keyword: keyword.value
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

<style scoped lang="less">
/deep/.el-input-number.is-controls-right .el-input__inner {
  width: 150px;
}
</style>
