<template>
  <div>
    <el-button style="margin-bottom: 20px" type="primary" @click="openAdd"
    >新增
    </el-button
    >
    <div>
      <el-form :inline="true" :model="formTop" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="formTop.roleName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="formTop.roleCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-select v-model="formTop.dsType" placeholder="请选择">
            <el-option
              v-for="item in [
                { value: 0, label: '全部' },
                { value: 1, label: '自定义' },
                { value: 2, label: '本级及子级' },
                { value: 3, label: '本级' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色标识" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column prop="dsTypes" label="数据权限" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <el-button type="text" @click="edit(scope.row)"
            >编辑
            </el-button
            >
            <el-button type="text" @click="deletes(scope.row)"
            >删除
            </el-button
            >
            <el-button type="text">+ 权限</el-button>
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
    <RoleAddVue v-if="RoleAddVue" ref="RoleAddRef" @Add="addClose" />
    <RoleEditVue
      v-if="RoleEditVue"
      ref="RoleEditRef"
      v-bind="forms"
      @edit="editClose"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { rolePage, deleteRole } from '_@/api/role'

import RoleAddVue from '@/components/Role/RoleAdd.vue'
import RoleEditVue from '@/components/Role/RoleEdit.vue'

interface StateVerify {
  tableData: Array<any>
  loading: Boolean
  forms: {}
}

export default defineComponent({
  components: {
    RoleAddVue,
    RoleEditVue
  },
  setup() {
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const RoleAddRef = ref<HTMLElement | null>(null)
    const RoleEditRef = ref<HTMLElement | null>(null)
    const RoleAddVue = ref<boolean>(false)
    const RoleEditVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const auditStatusV = ref<number | undefined>(0)
    const skillId = ref<number | undefined>(0)
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const deletes = (e: any) => {
      ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('eeeee :>> ', e)
          deleteRole(e.roleId).then((res) => {
            if (res) {
              ElMessage({
                type: 'success',
                message: `${e.roleName}删除成功!`
              })
              getData()
            }
          })
        })
        .catch(() => {
        })
    }
    const initForm = () => {
      return {
        roleName: '',
        roleCode: '',
        dsType: []
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      state.loading = true
      const res = await rolePage({
        size: pagesize.value,
        current: currentPage.value,
        roleName: formTop.roleName,
        roleCode: formTop.roleCode,
        dsType: formTop.dsType
      })
      if (res) {
        console.log('res :>> ', res)
        state.tableData = res.data.records
        total.value = res.data.total
        state.tableData.forEach((i) => {
          i.dsTypes =
            i.dsType === 0
              ? '全部'
              : i.dsType === 1
              ? '自定义'
              : i.dsType === 2
                ? '本级及子级'
                : '本级'
        })
        state.loading = false
      }
    }
    const getRole = async () => {

    }
    onMounted(() => {
      getData()
    })

    const addClose = (e: boolean) => {
      console.log('efffff :>> ', e)
      setTimeout(() => {
        if (e) {
          getData()
        }
        RoleAddVue.value = false
      }, 300)
    }
    const state = reactive<StateVerify>({
      tableData: [],
      loading: true,
      forms: {}
    })
    const edit = (e: any) => {
      state.forms = e
      console.log('state.forms :>> ', state.forms)
      RoleEditVue.value = true
      setTimeout(() => {
        ;(RoleEditRef.value as any).open()
      }, 30)
    }
    const editClose = (e: boolean) => {
      console.log('efffff :>> ', e)
      setTimeout(() => {
        if (e) {
          getData()
        }
        RoleEditVue.value = false
      }, 300)
    }
    const openAdd = () => {
      RoleAddVue.value = true
      setTimeout(() => {
        ;(RoleAddRef.value as any).open()
      }, 30)
    }
    return {
      editClose,
      addClose,
      handleCurrentChange,
      total,
      currentPage,
      pagesize,
      reset,
      formTop,
      getData,
      skillId,
      auditStatusV,
      dialogVisible,
      RoleEditVue,
      RoleEditRef,
      RoleAddRef,
      RoleAddVue,
      deletes,
      openAdd,
      edit,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
