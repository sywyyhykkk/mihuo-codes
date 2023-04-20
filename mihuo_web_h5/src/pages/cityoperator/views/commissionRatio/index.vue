<template>
  <div>
    <el-table
      border
      stripe
      :data="state.data"
      highlight-current-row
      height="100vh"
      style="margin-top: 3rem"
    >
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column
        align="center"
        prop="cityOperatorName"
        label="运营商名称"
      />
      <el-table-column align="center" prop="skillName" label="工种名称" />
      <el-table-column align="center" label="抽成比例">
        <template #default="{ row }">
          <strong>{{ getPerCentum(row.cutScale) }}</strong>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="skillId" label="工种ID" />
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button
            link
            size="small"
            type="text"
            :icon="Edit"
            @click="handleEdit(row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="state.total"
      :current-page="state.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog"
      title="修改抽成比例"
    >
      <el-form :model="formData" label-width="12rem">
        <el-form-item label="抽成比例" prop="cutScale">
          <el-input-number
            v-model="formData.cutScale"
            :step="0.1"
            :min="0"
            :max="1"
            :precision="3"
            :controls="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handelConfirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '抽成比例设置',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { fetch } from '../../axios-config/axios'

const dialogVisible = ref(false)
const state = reactive({
  total: 0,
  current: 1,
  data: []
})
const formData = ref({ cutScale: 0, skillId: null })

const getPerCentum = computed(() => (val: number) => {
  if (!val) return '0%'
  return ((val * 1000) / 10).toPrecision() + '%'
})

onMounted(() => {
  loadSkillData()
})

const loadSkillData = () => {
  fetch({
    url: '/admin/sysjobskillcutscale/pageSkillCutScale',
    method: 'get',
    params: { current: state.current, size: 10 }
  }).then((res: any) => {
    if (res.code === 0) {
      const { total, pages, records } = res.data
      state.total = Number(total)
      state.data = records
    }
  })
}

function currentChange(page: number) {
  state.current = page
  loadSkillData()
}

function handleEdit({ skillId, cutScale }: any) {
  formData.value.skillId = skillId
  formData.value.cutScale = cutScale
  dialogVisible.value = true
}

function handelConfirm() {
  fetch({
    url: '/admin/sysjobskillcutscale/modifySysJobSkillCutScaleInfo',
    method: 'post',
    data: formData.value
  }).then((res: any) => {
    if (res.code === 0) {
      dialogVisible.value = false
      ElMessage.success('修改成功')
      loadSkillData()
    }
  })
}
</script>

<style scoped lang="less">
:deep(.el-input-number .el-input) {
  width: 20rem !important;
}
</style>
