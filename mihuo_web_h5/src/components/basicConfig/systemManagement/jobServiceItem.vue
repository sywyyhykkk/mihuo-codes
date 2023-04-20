<template>
  <div>
    <el-dialog
      v-model="isShowDialog"
      width="50%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="工种服务内容"
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
          placeholder="请输入服务内容"
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
          <el-table-column prop="itemName" label="服务内容" />
          <el-table-column prop="groupName" label="分组名称" />
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
    <el-dialog
      v-model="isShowFormDialog"
      width="30%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit ? '编辑服务内容' : '添加服务内容'"
      @close="hideFormDialog"
    >
      <el-form
        ref="rulesForm"
        label-width="8rem"
        :model="serviceItem"
        :rules="rules"
      >
        <el-form-item label="服务内容" prop="itemName">
          <el-input v-model="serviceItem.itemName" placeholder="请输入服务内容" />
        </el-form-item>
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="serviceItem.groupName" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="描述图片" prop="pics">
          <uploadImage
            v-model="serviceItem.pics"
            :max-count="99"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveData">保 存</el-button>
          <el-button @click="hideFormDialog">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
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
const isShowFormDialog = ref(false)
const isEdit = ref(false)

const tableData = ref([])

// 获取数据
const getData = async() => {
  isLoading.value = true
  await fetch({
    url: ' /admin/sysjobskill/serviceItem/list',
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

const serviceItem = ref({
  id: '',
  itemName: '',
  skillId: props.skillId,
  cityOperatorId: cityOperatorId
})

const rules = ref({
  itemName: [
    { required: true, message: '请输入服务内容', trigger: 'blur' }
  ],
  groupName: [
    { required: true, message: '请输入分组名称', trigger: 'blur' }
  ]
})

const rulesForm = ref(null)

// 添加服务项
const addForm = () => {
  isEdit.value = false
  isShowFormDialog.value = true
}

const currentId = ref('')

// 编辑服务项
const editForm = (row: any) => {
  isEdit.value = true
  isShowFormDialog.value = true
  Object.assign(serviceItem.value, row)
}

// 保存数据
const saveData = () => {
  const forms: any = unref(rulesForm)
  forms.validate(async (valid: boolean) => {
    if (valid) {
      if (!isEdit.value) {
        // 新增数据
        await fetch({
          url: '/admin/sysjobskill/serviceItem/add',
          method: 'post',
          data: {
            ...serviceItem.value
          }
        }).then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('添加成功')
            hideFormDialog()
            getData()
          }
        })
      } else {
        // 编辑数据
        await fetch({
          url: '/admin/sysjobskill/serviceItem/modify',
          method: 'post',
          data: {
            ...serviceItem.value
          }
        }).then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('编辑成功')
            hideFormDialog()
            getData()
          }
        })
      }
    }
  })
}

// 删除服务项
const deleteForm = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该服务项, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: `/admin/sysjobskill/serviceItem/delete/${row.id}`,
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

const hideFormDialog = () => {
  isShowFormDialog.value = false
  isEdit.value = false
  serviceItem.value = {
    id: '',
    itemName: '',
    skillId: props.skillId,
    cityOperatorId: cityOperatorId
  }
}
</script>

<style lang="less" scoped>

</style>
