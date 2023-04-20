<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
export default defineComponent({
  name: 'SOP交付配置'
})
</script>
<script setup lang="ts">
import { fetch } from '../../axios-config/axios'
import { ElMessage } from 'element-plus'
import { reqSopTempLateList } from '../../api/enterprise'
import { filter } from 'lodash'

const loading = ref(false)
const deliveryList = ref([])
const showDialog = ref(false)
const SoptemplateList = ref<any>([])
const formData = ref<any>({})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    const res: any = await fetch({
      url: '/order/jobdeliveryconfig/getList',
      method: 'get'
    })

    if (res.code === 0) {
      deliveryList.value = res.data
    }
  } catch (error) {
    console.error(error)
  }
}

const getTemplateList = async () => {
  try {
    const res2: any = await reqSopTempLateList({
      size: 1000,
      templateType: 1,
      showStatus: 1
    })

    if (res2.code === 0) {
      SoptemplateList.value = res2.data.filter((item: any) => item.defaultFlag === 0)
    }
  } catch (error) {
    console.error(error)
  }
}

const handleEdit = (row: any) => {
  showDialog.value = true
  formData.value = row
  getTemplateList()
}

const onSubmit = () => {
  if (formData.value.id) onEditSave()
  else onAddSave()
}

const onAddSave = async () => {
  loading.value = true
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/order/jobdeliveryconfig/add',
      data: {
        materialTemplateId: formData.value.materialTemplateId,
        skillId: formData.value.skillId,
        skillName: formData.value.skillName,
        sopTemplateId: formData.value.sopTemplateId
      }
    })

    if (res.code === 0) {
      ElMessage.success('添加成功!')
      loadData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    showDialog.value = false
    loading.value = false
  }
}

const onEditSave = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/order/jobdeliveryconfig/edit',
      data: {
        id: formData.value.id,
        materialTemplateId: formData.value.materialTemplateId,
        skillId: formData.value.skillId,
        skillName: formData.value.skillName,
        sopTemplateId: formData.value.sopTemplateId
      }
    })

    if (res.code === 0) {
      ElMessage.success('修改成功!')
      loadData()
    }
  } catch (error) {
    console.error(error)
  } finally {
    showDialog.value = false
    loading.value = false
  }
}
</script>

<template>
  <div class="SOP-delivery">
    <!-- <el-card>
      <div />
      <el-button type="primary" size="large" @click="handleAdd">新增</el-button>
    </el-card> -->
    <el-table v-loading="loading" :data="deliveryList">
      <el-table-column prop="skillName" label="岗位名称" />
      <el-table-column prop="materialTemplateName" label="选材模板" />
      <el-table-column prop="sopTemplateName" label="SOP模板" />
      <el-table-column prop="updated" label="更新时间" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="showDialog"
      title="编辑交付模板"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      z-index="99"
      width="40rem"
    >
      <el-form :model="formData" class="oreder-report-form" label-width="10rem">
        <el-form-item label="岗位名称">
          <el-input v-model="formData.skillName" readonly />
        </el-form-item>
        <el-form-item label="SOP模板">
          <el-select
            v-model="formData.sopTemplateId"
            clearable
            class="m-2"
            size="large"
            placeholder="SOP模板"
          >
            <el-option
              v-for="item in SoptemplateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.SOP-delivery {
  margin-top: 3rem;
}

:deep(.el-card) {
  .el-card__body {
    justify-content: space-between;
  }

  .el-button {
    width: 10rem;
    height: 4rem;
  }
}
</style>
