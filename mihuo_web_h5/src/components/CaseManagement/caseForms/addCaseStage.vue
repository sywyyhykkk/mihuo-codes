<template>
  <div>
    <el-drawer
      v-model="isShowDrawer"
      size="45%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="案例阶段维护"
      @close="hideDrawer"
    >
      <el-button type="primary" plain @click="addNewStage">新增阶段</el-button>
      <el-card
        v-for="(item, index) in stageList"
        :key="index"
        :header="'阶段名称: ' + item.stageName"
        class="box-card"
      >
        <div
          class="flex-center"
          style="width: 100%; justify-content: space-between"
        >
          <div
            class="flex-center"
            style="padding: 0 2rem; width: 50%; justify-content: flex-start"
          >
            <img
              v-if="item.userId"
              class="avatar-outer"
              :src="$getUrl.avatarImage(item.userId)"
              @error="$getUrl.imageError($event)"
            >
            <span>{{ item.personName }} [{{ item.personSkillName }}]</span>
          </div>
          <div class="flex-center">
            <el-button
              plain
              @click="editStage(item, index)"
            >编辑阶段</el-button>
            <el-button
              type="text"
              icon="money"
              @click="groupPriceClick(item, index)"
            >报价清单</el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              @click="deleteStage(item, index)"
            >删除阶段</el-button>
            <el-button
              plain
              icon="sort-up"
              @click="sortUpStage(item, index)"
            >上移</el-button>
            <el-button
              plain
              icon="sort-down"
              @click="sortDownStage(item, index)"
            >下移</el-button>
          </div>
        </div>
      </el-card>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveDrawer">保存</el-button>
          <el-button @click="hideDrawer">取消</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog
      v-model="isShowStageForm"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditStageForm ? '编辑施工阶段' : '新增施工阶段'"
      @close="hideDialog"
    >
      <div>
        <el-form
          ref="stageForms"
          :model="stageForm"
          label-width="80px"
          :rules="caseStageRules"
        >
          <el-form-item label="阶段名称" prop="stageName">
            <el-input
              v-model="stageForm.stageName"
              placeholder="请输入阶段名称"
            />
          </el-form-item>
          <el-form-item label="关联人员" prop="personId">
            <el-select
              v-model="stageForm.personId"
              filterable
              placeholder="请选择关联人员"
              remote
              :remote-method="onSearchPeople"
              @change="onSelect"
            >
              <el-option
                v-for="(item, index) in peopleList"
                :key="index"
                :label="item.name + `[${item.skillName}]`"
                :value="item.personId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工种" prop="skillName">
            <el-input
              v-model="stageForm.personSkillName"
              disabled
              placeholder="请选择关联人员工种"
            />
          </el-form-item>
          <el-form-item label="头像" prop="personAvatar">
            <img
              v-if="stageForm.userId"
              class="avatar"
              :src="$getUrl.avatarImage(stageForm.userId)"
              @error="$getUrl.imageError($event)"
            >
          </el-form-item>
          <el-form-item label="阶段状态" prop="status">
            <el-select v-model="stageForm.status" placeholder="请选择阶段状态">
              <el-option
                v-for="(item, index) in stageStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveStageForm">保存</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 报价清单维护 -->
    <group-pricing
      v-if="isGroupPriceDialog"
      v-model="isGroupPriceDialog"
      :stage="currentStage"
      @updateData="confirmAddGroupPricing"
    />
  </div>
</template>

<script lang="ts" setup>
import { caseStageRules } from '../rules'
import { editCase, getCityOperatorPerson } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'getData'])

// 案例ID
const caseId = ref(props.row?.id)
const currentRow = ref(props.row)

onMounted(() => {
  getAllPeople()
})

// 选择关联人员列表
const peopleList = ref([])
// 所有阶段列表
const stageList = ref<any[]>(
  props.row.stage && JSON.parse(props.row.stage).length !== 0
    ? JSON.parse(props.row.stage)
    : []
)
// 搜索关联人员关键字
const searchKeyword = ref('')

// 获取当前运营商所有人员
const getAllPeople = async () => {
  const res = await getCityOperatorPerson({
    size: 30,
    auditStatus: 2,
    keyword: searchKeyword.value
  })
  if (res && res.data) {
    peopleList.value = res.data.records
  }
}

// 搜索关联人员
const onSearchPeople = (query: any) => {
  if (query) {
    searchKeyword.value = query
  } else {
    searchKeyword.value = ''
  }
  setTimeout(() => {
    getAllPeople()
  }, 200)
}

// 控制表单的显示/隐藏
const isShowDrawer = ref(false)

const hideDrawer = () => {
  isShowDrawer.value = false
  emit('update:modelValue', false)
}

// 保存阶段维护
const saveDrawer = async () => {
  const finalData = JSON.stringify(stageList.value)
  const totalPrice = stageList.value.reduce(
    (pre, cur) => pre + Number(cur?.groupPrice?.totalPrice || 0),
    0
  )
  const res: any = await editCase({
    id: caseId.value,
    ...props.row,
    stage: finalData,
    totalPrice
  })
  if (res && res.code === 0) {
    hideDrawer()
    emit('getData')
  }
}

watchEffect(() => {
  isShowDrawer.value = props.modelValue
})

// 是否显示阶段表单弹窗
const isShowStageForm = ref(false)
// 是否是编辑阶段表单
const isEditStageForm = ref(false)
// 阶段表单
const stageForm = ref({
  stageName: '',
  personName: '',
  personSkillName: '',
  userId: '',
  personId: '',
  status: '',
  groupPrice: ''
})
// 编辑表单的index
const stageIndex = ref(-1)

// 隐藏阶段表单
const hideDialog = () => {
  isShowStageForm.value = false
  // 重置表单
  stageForm.value = {
    stageName: '',
    personName: '',
    personSkillName: '',
    userId: '',
    personId: '',
    status: '',
    groupPrice: ''
  }
}

// 新增阶段
const addNewStage = () => {
  isShowStageForm.value = true
  isEditStageForm.value = false
}

// 编辑阶段
const editStage = (item: any, index: number) => {
  stageIndex.value = index
  stageForm.value.stageName = item.stageName
  stageForm.value.personName = item.personName
  stageForm.value.personSkillName = item.personSkillName
  stageForm.value.userId = item.userId
  stageForm.value.personId = item.personId
  stageForm.value.status = item.status
  stageForm.value.groupPrice = item.groupPrice
  isEditStageForm.value = true
  isShowStageForm.value = true
}

// 删除阶段
const deleteStage = (item: any, index: number) => {
  ElMessageBox.confirm(`此操作将删除${item.stageName}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      ElMessage.success('删除成功')
      stageList.value.splice(index, 1)
    })
    .catch((e) => {})
}

const stageForms = ref('')

// 保存阶段表单
const saveStageForm = () => {
  const forms: any = unref(stageForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (isEditStageForm.value) {
        // 编辑阶段
        stageList.value[stageIndex.value] = JSON.parse(
          JSON.stringify(stageForm.value)
        )
        stageIndex.value = -1
      } else {
        // 新增阶段
        const newValue = JSON.parse(JSON.stringify(stageForm.value))
        stageList.value.push(newValue)
      }
      hideDialog()
    }
  })
}

// 选择关联人员
const onSelect = (personId: any) => {
  const person: any = peopleList.value.find(
    (item: any) => item.personId === personId
  )
  stageForm.value.userId = person?.userId
  stageForm.value.personName = person?.name
  stageForm.value.personSkillName = person?.skillName
}

// 阶段上移
const sortUpStage = (item: any, index: number) => {
  if (index === 0) return
  const pre = stageList.value[index - 1]
  stageList.value[index - 1] = item
  stageList.value[index] = pre
}

// 阶段下移
const sortDownStage = (item: any, index: number) => {
  if (index === stageList.value.length - 1) return
  const next = stageList.value[index + 1]
  stageList.value[index + 1] = item
  stageList.value[index] = next
}

// 是否显示报价清单维护
const isGroupPriceDialog = ref(false)

// 确认添加报价清单
const confirmAddGroupPricing = (data: any) => {
  const currentStage = stageList.value[stageIndex.value]
  currentStage['groupPrice'] = data
  stageList.value[stageIndex.value] = currentStage
  isGroupPriceDialog.value = false
  stageIndex.value = -1
}

// 当前选中的阶段
const currentStage = ref({})
// 添加报价清单
const groupPriceClick = (item: any, index: number) => {
  stageIndex.value = index
  currentStage.value = item
  isGroupPriceDialog.value = true
}

// 阶段状态列表
const stageStatusList = ref([
  {
    label: '未购买',
    value: 1
  },
  {
    label: '服务中',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  }
])
</script>

<style lang="less" scoped>
.box-card {
  width: 80rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--el-box-shadow-light) !important;
}

.avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.avatar-outer {
  width: 3.5rem;
  height: 3.5rem;
  margin-right: 1rem;
  border-radius: 50%;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
