<template>
  <div class="el-card-form">
    <div class="el-card-formLeft">
      <el-scrollbar>
        <el-tree
          ref="tree"
          v-loading="loadTree"
          :data="workerList"
          :props="{ label: 'skillName' }"
          highlight-current
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="el-card-custom">
                <span>{{ node.label }}</span>
              </div>
              <el-dropdown>
                <el-icon
                  v-if="data.skillId"
                  size="10"
                  color="#0969DA"
                  class="tree-node-icon"
                >
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.stop="handelClick(data, '添加')">
                      添加常用语
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>

    <div class="el-card-formRight">
      <el-table
        v-loading="loadTable"
        stripe
        :data="tableData"
        style="
          height: 100vh !important;
          max-height: calc(100vh - 17rem) !important;
          margin-top: 2rem;
        "
        :height="'0'"
        border
      >
        <el-table-column type="index" width="50" align="center" label="序号" />
        <el-table-column prop="content" align="center" label="内容" />
        <el-table-column prop="categoryFlag" align="center" label="分类标识" />
        <el-table-column prop="labels" align="center" label="分类标签" />
        <el-table-column prop="sort" align="center" label="排序" />
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              icon="edit"
              type="text"
              @click="handelClick(scope.row, '编辑')"
            >
              编辑
            </el-button>

            <el-button
              size="mini"
              type="text"
              icon="delete"
              class="danger"
              @click="handelClick(scope.row, '删除')"
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
    </div>

    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置常用语"
      @close="handelClose"
      width="55rem"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="11rem"
        :scrollToError="true"
      >
        <el-form-item label="分类标识" prop="categoryFlag">
          <el-input v-model="state.form.categoryFlag" disabled />
        </el-form-item>
        <el-form-item label="分类标签" prop="labels">
          <el-select
              v-model="state.form.labels"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in state.typeTags"
                :key="item.id"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="state.form.content" type="textarea" maxlength="128" :autosize="{ minRows: 2, maxRows: 5 }" show-word-limit />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="state.form.sort"
            type="number"
            min="0"
            style="width: 19rem"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm()"
            >确 定</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loadTree = ref(false)
const loadTable = ref(false)
const current = ref<number>(-1)
const workerList = ref<any[]>([])
const tableData = ref<object[]>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(20)
const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const ruleForms = ref<any>('')

const state = reactive({
  loadTable: false,
  form: {} as any,
  typeTags:[]
})
const searchData = reactive<any>({
  categoryFlag: ''
})
const rules = reactive({
  content: [{ required: true, message: '请输入内容', trigger: 'change' }]
})

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}
const handleNodeClick = (data: any) => {
  console.log(data)

  if (data.categoryFlag === 'ORDER_ALL') {
    searchData.categoryFlag = ''
  } else {
    searchData.categoryFlag = data.categoryFlag
  }
  getData()
}

const handelClick = (data: any, val: string) => {
  switch (val) {
    case '添加':
      dialogVisible.value = true
      isEdit.value = false
      state.form = {
        categoryFlag: data.categoryFlag,
        content: '',
        sort: 0
      }
      break
    case '编辑':
      dialogVisible.value = true
      isEdit.value = true
      state.form = { ...data }
      break
    case '删除':
      ElMessageBox.confirm('此操作将永久删除该常用语, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delData(data.id)
      })
      break
  }
}

const handleConfirm = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (!isEdit.value) {
        addData()
      }
      if (isEdit.value) {
        editData()
      }
    }
  })
}
const handelClose = () => {
  dialogVisible.value = false
}
//删除
const delData = async (id: any) => {
  await fetch({
    url: `/basic/basiccommonstatement/delete/${id}`,
    method: 'get'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除成功')
      getData()
    }
  })
} //添加
const addData = async () => {
  await fetch({
    url: '/basic/basiccommonstatement/create',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      handelClose()
      getData()
      ElMessage.success('添加成功')
    }
  })
}
//编辑
const editData = async () => {
  await fetch({
    url: '/basic/basiccommonstatement/modify',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.code == '0') {
      handelClose()
      getData()
      ElMessage.success('编辑成功')
    }
  })
}

// 查询工种岗位
const getWorkerData = async () => {
  loadTree.value = true
  try {
    const res: any = await fetch({
      url: `/admin/sysjobskill/list/platform`,
      method: 'get'
    })

    if (res.code !== 0) {
      loadTree.value = false
      return
    }
    workerList.value = res.data
    for (const item of workerList.value) {
      item.categoryFlag = `ORDER_${item.skillId}`
    }
    workerList.value.unshift({ skillName: '全部', categoryFlag: 'ORDER_ALL' })
    loadTree.value = false
  } catch (error) {
    console.error(error)
    loadTree.value = false
  }
}

const getData = async () => {
  loadTable.value = true
  try {
    const res = await fetch({
      url: `/basic/basiccommonstatement/page`,
      method: 'get',
      params: {
        size: pagesize.value,
        current: currentPage.value,
        ...searchData
      }
    })
    tableData.value = res.data.records
    total.value = res.data.total
    loadTable.value = false
  } catch (error) {
    console.error(error)
    loadTable.value = false
  }
}
// 获取分类标签
const getTypeTags = async() =>{
  await fetch({
      url: `/admin/dict/type?type=issue_statement_label`,
      method: 'get',
    }).then((res:any)=>{
      state.typeTags = res.data
    })
}
onMounted(() => {
  getWorkerData()
  getData()
  getTypeTags()
})
</script>

<style scoped lang="less">
:deep(.el-tree-node__content) {
  padding: 6px 0 !important;

  .el-tree-node__expand-icon {
    padding: 0;
  }
}
</style>
