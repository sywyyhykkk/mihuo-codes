<template>
  <div>
    <el-button type="primary" @click="addNewProcess">
      新增流程
    </el-button>
    <div class="main-container">
      <el-card
        class="box-card flex-center"
        :style="{ justifyContent: processList.length ? 'flex-start' : 'center' }"
        shadow="never"
      >
        <div
          v-for="(item, index) in processList"
          :key="index"
          class="card-item"
        >
          <el-button
            type="text"
            class="primary"
            icon="edit"
            @click="editProcess(item, index)"
          >编辑
          </el-button>
          <el-button
            type="text"
            class="danger"
            icon="delete"
            @click="deleteProcess(index)"
          >删除
          </el-button>
          <el-form disabled>
            <el-form-item label="名称">
              <el-input
                v-model="item.name"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-empty v-if="!processList.length" description="暂无装修流程" />
      </el-card>
    </div>
    <el-dialog
      v-model="isShowProcess"
      width="60%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="`${isEditProcess ? '编辑' : '新增' }装修流程`"
      @close="hideProcessDialog"
    >
      <div class="add-process">
        <el-form
          ref="processFormRef"
          :model="processForm"
          :rules="processFormRules"
          label-width="8rem"
          :disabled="isViewProcess"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="processForm.name"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item label="工种" prop="skillName">
            <el-select
              v-model="processForm.skillName"
              placeholder="请选择服务者工种"
            >
              <el-option
                v-for="(option, index) in skillOptions"
                :key="index"
                :label="option.skillName"
                :value="option.skillName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工期" prop="day">
            <el-input
              v-model="processForm.day"
              placeholder="请输入工期"
              type="number"
            >
              <template #append>
                天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="费用" prop="price">
            <el-input
              v-model="processForm.price"
              placeholder="请输入费用"
              type="number"
            >
              <template #append>
                元</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeName" style="margin-top: 2rem">
          <el-collapse-item name="服务内容" title="服务内容">
            <service-content v-model="processForm.serviceContents" />
          </el-collapse-item>
          <el-collapse-item name="交付成果" title="交付成果">
            <common-result v-model="processForm.deliveryOutputs" :type="1" />
          </el-collapse-item>
          <el-collapse-item name="内容页" title="内容页">
            <AppTextEdit v-model="processForm.contentPage" :disabled="isViewProcess" />
          </el-collapse-item>
          <el-collapse-item name="常见问题" title="常见问题">
            <common-result v-model="processForm.commonProblems" :type="2" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveProcessDialog">保存</el-button>
          <el-button @click="hideProcessDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { processFormRules } from '_c/HomeServiceManagement/data'
import { fetch } from '_@/axios-config/axios'
import CommonResult from '_c/HomeServiceManagement/commonResult.vue'

const props = defineProps<{
 processList: any[]
}>()

const processList = ref(props.processList || [])

const activeName = ref('')
const isShowProcess = ref(false)
const isEditProcess = ref(false)
const isViewProcess = ref(false)
// 当前编辑的流程
const currentIndex = ref(-1)
onMounted(() => {
  getPlatformSkills()
})

// 获取平台工种
const getPlatformSkills = async () => {
  await fetch({
    url: '/admin/sysjobskill/getPlatformJobSkill',
    method: 'get'
  }).then((res: any) => {
    if (res && res.data) {
      skillOptions.value = res.data.filter((item: any) => item.quickCallFlag === 1)
    }
  })
}

const skillOptions = ref([])
const processForm = ref({
  name: '', // 流程名称
  skillName: '', // 服务者工种
  day: '', // 工期
  price: '', // 费用
  serviceContents: [] as any, // 服务内容
  deliveryOutputs: [] as any, // 交付成果
  contentPage: '[]', // 内容页
  commonProblems: [] as any // 常见问题
})
// 新增流程
const addNewProcess = () => {
  isShowProcess.value = true
  isEditProcess.value = false
}

const processFormRef = ref(null)
// 保存流程
const saveProcessDialog = () => {
  const forms: any = unref(processFormRef)
  forms.validate(async (valid: any) => {
    if (valid) {
      if (isEditProcess.value) {
        processList.value[currentIndex.value] = processForm.value
      } else {
        processList.value.push(processForm.value)
      }
    }
  })
  hideProcessDialog()
}

// 隐藏流程弹窗
const hideProcessDialog = () => {
  isShowProcess.value = false
  isEditProcess.value = false
  processForm.value = {
    name: '', // 流程名称
    skillName: '', // 服务者工种
    day: '', // 工期
    price: '', // 费用
    serviceContents: [], // 服务内容
    deliveryOutputs: [], // 交付成果
    contentPage: '[]', // 内容页
    commonProblems: [] // 常见问题
  }
}

// 编辑服务内容
const editProcess = (data: any, index: number) => {
  processForm.value = Object.assign({}, data)
  isEditProcess.value = true
  isShowProcess.value = true
  currentIndex.value = index
}

// 删除装修流程
const deleteProcess = (index: number) => {
  processList.value.splice(index, 1)
}
</script>

<style lang="less" scoped>
.add-process {
  width: 100%;
  height: 60rem;
}

.main-container {
  width: 78vw;
  padding: 1rem 0;
  .box-card {
    width: 100%;
    height: max-content;
    border: .1rem solid #a8a8a8;
    padding: 1rem;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;

    .card-item {
      width: 20rem;
      height: max-content;
      padding: 1rem;
      border: .1rem solid #a8a8a8;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
/deep/.el-card__body{
  flex-flow: row wrap;
}
</style>
