<template>
  <!--  -->
  <div class="m-">
    <el-button style="margin-bottom: 20px" type="primary" @click="openAdd"
      >新增</el-button
    >
    <el-table stripe  :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="节点编号" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="parentId" label="父级节点名称" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="companyId" label="所属企业" />
      <el-table-column label="操作" fixed="right" width="160">
        <template #default="scope">
          <el-button type="text" size="small" @click="open(scope.row)"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deletes">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <OrganizationExamineVue
      v-if="OrganizationExamineVue"
      ref="OrganizationExamineRef"
      @dialogVisible="getDialogVisible"
    />
    <OrganizationAddVue
      v-if="OrganizationAddVue"
      ref="OrganizationAddRef"
      @getOrganizationAdd="getOrganizationAdd"
    />
  </div>
</template>
<script lang="ts">
import OrganizationAddVue from '@/components/enterprise/organization/OrganizationAdd.vue'
import OrganizationExamineVue from '@/components/enterprise/organization/OrganizationExamine.vue'
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { companydept } from '../../../api/organization'
export default defineComponent({
  components: { OrganizationExamineVue, OrganizationAddVue },
  setup() {
    const OrganizationExamineRef = ref<HTMLElement | null>(null)
    const OrganizationAddRef = ref<HTMLElement | null>(null)
    const OrganizationExamineVue = ref<boolean>(false)
    const OrganizationAddVue = ref<boolean>(false)
    const deletes = () => {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {})
    }
    const getData = async () => {
      const res = await companydept({ size: 10, page: 1 })
      if (res) {
        state.tableData = res.data.records
      }
      console.log('res :>> ', res)
    }

    onMounted(() => {
      getData()
    })
    const getDialogVisible = () => {
      setTimeout(() => {
        OrganizationExamineVue.value = false
      }, 300)
    }
    const getOrganizationAdd = () => {
      setTimeout(() => {
        OrganizationAddVue.value = false
      }, 300)
    }
    const state = reactive({
      tableData: [],
    })
    const open = () => {
      OrganizationExamineVue.value = true
      setTimeout(() => {
        ;(OrganizationExamineRef.value as any).open()
      }, 30)
    }
    const openAdd = () => {
      OrganizationAddVue.value = true
      setTimeout(() => {
        ;(OrganizationAddRef.value as any).open()
      }, 30)
    }
    return {
      OrganizationAddVue,
      OrganizationAddRef,
      OrganizationExamineRef,
      OrganizationExamineVue,
      deletes,
      openAdd,
      getOrganizationAdd,
      getDialogVisible,
      open,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped></style>
