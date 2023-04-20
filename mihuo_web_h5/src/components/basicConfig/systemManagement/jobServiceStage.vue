<template>
  <el-dialog
    v-model="isShowDialog"
    width="50%"
    destroy-on-close
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    title="工种服务阶段"
    @close="hideDialog"
  >
    <div style="height: 50vh; padding: 2rem!important;">
      <el-button
        type="primary"
        icon="plus"
        @click="addForm"
      >添加
      </el-button>
      <el-input
        v-model="keyword"
        clearable
        style="margin-left: 2rem;"
        placeholder="请输入服务阶段"
      />
      <el-button
        icon="search"
        style="margin-left: 2rem;"
        @click="getData"
      >查询
      </el-button>
      <el-table
        v-loading="isLoading"
        stripe
        :data="tableData"
        border
        style="width: 100%; margin-top: 2rem;"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column prop="stageName" label="服务阶段" />
        <el-table-column
          label="操作"
          fixed="right"
          width="240"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="edit"
              @click="editForm(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              @click="deleteForm(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="hideDialog">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'

const props = defineProps<{
  modelValue: Boolean,
  skillId: string
}>()

const emit = defineEmits(['update:modelValue'])

const isLoading = ref(false)
const isShowDialog = ref(props.modelValue)
const cityOperatorId = wsCache.get('cityOperator')?.id
const keyword = ref('')

const tableData = ref([])

// 获取数据
const getData = async() => {
  isLoading.value = true
  await fetch({
    url: ' /admin/sysjobskill/serviceStage/list',
    method: 'get',
    params: {
      skillId: props.skillId,
      operatorId: cityOperatorId,
      keywords: keyword.value,
      size: 99
    }
  }).then((res: any) => {
    if (res.code === 0) {
      isLoading.value = false
      tableData.value = res.data
    }
  })
}

onMounted(() => {
  getData()
})

// 添加服务阶段
const addForm = () => {
  ElMessageBox.prompt('请输入服务阶段', '添加服务阶段', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入服务阶段',
    inputErrorMessage: '请输入正确的服务阶段',
    inputPattern: /\S/
  })
    .then(({ value }) => {
      saveData(value, 1)
    })
    .catch(() => {})
}

const currentId = ref('')

// 编辑服务阶段
const editForm = (row: any) => {
  ElMessageBox.prompt('请输入服务阶段', '编辑服务阶段', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入服务阶段',
    inputValue: row.stageName,
    inputErrorMessage: '请输入正确的服务阶段',
    inputPattern: /\S/
  })
    .then(({ value }) => {
      currentId.value = row.id
      saveData(value, 2)
    })
    .catch(() => {})
}

// 保存数据
const saveData = async (value: string, type: number) => {
  if (type === 1) {
    // 新增数据
    await fetch({
      url: '/admin/sysjobskill/serviceStage/add',
      method: 'post',
      data: {
        stageName: value,
        skillId: props.skillId,
        cityOperatorId: cityOperatorId
      }
    }).then((res: any) => {
      if (res.code === 0) {
        ElMessage.success('添加成功')
        getData()
      }
    })
  } else if (type === 2) {
    // 编辑数据
    await fetch({
      url: '/admin/sysjobskill/serviceStage/modify',
      method: 'post',
      data: {
        id: currentId.value,
        stageName: value,
        skillId: props.skillId,
        cityOperatorId: cityOperatorId
      }
    }).then((res: any) => {
      if (res.code === 0) {
        ElMessage.success('编辑成功')
        getData()
      }
    })
  }
}

// 删除服务项
const deleteForm = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该服务阶段, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: `/admin/sysjobskill/serviceStage/delete/${row.id}`,
      method: 'post'
    }).then((res: any) => {
      if (res.code === 0) {
        ElMessage.success('删除成功')
        getData()
      }
    })
  }).catch(() => {})
}

const hideDialog = () => {
  isShowDialog.value = false
  currentId.value = ''
  emit('update:modelValue', false)
}
</script>

<style lang="less" scoped>

</style>
