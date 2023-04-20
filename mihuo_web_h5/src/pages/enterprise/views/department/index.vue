<template>
  <div class="department">
    <div>
      <div class="department_content" style="height: 80vh">
        <div class="left" style="width: 40vw">
          <div class="add">
            <el-button
              size="mini"
              type="primary"
              icon="plus"
              @click="addTrees(0)"
              > 添加
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="edit"
              @click="eidtTrees(0)"
              > 编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="delete"
              @click="deleteTrees(0)"
              >删除
            </el-button>
          </div>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          >
            <template #default="{ node }">
              <div class="custom">
                <span>{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </div>
        <div class="right">
          <el-form
            :model="forms"
            :disabled="disableType"
            label-width="150px"
            :rules="rules"
          >
            <el-form-item
              v-if="addOrEidt !== '更新'"
              label="父级节点"
              :label-width="formLabelWidth"
              prop="roleName"
            >
              <el-input
                v-model="forms.parentId"
                disabled="true"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              v-if="addOrEidt !== '立即创建'"
              label="节点编号"
              :label-width="formLabelWidth"
              prop="roleCode"
            >
              <el-input v-model="forms.id" disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="部门名称" :label-width="formLabelWidth">
              <el-input v-model="forms.name" autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="排序"
              :label-width="formLabelWidth"
              prop="dsType"
            >
              <el-input v-model="forms.sort" placeholder="" type="number" />
            </el-form-item>

            <el-form-item v-if="!disableType">
              <el-button type="primary" @click="onSubmit"
                >{{ addOrEidt }}
              </el-button>
              <el-button @click="disableType = true"> 取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <DepartmentAddVue
      v-if="DepartmentAddVue"
      ref="DepartmentAddRef"
      @Add="addClose"
    />
    <DepartmentEditVue
      v-if="DepartmentEditVue"
      ref="DepartmentEditRef"
      v-bind="forms"
      @edit="editClose"
    />
    <NewEmployeeVue
      v-if="NewEmployeeVue"
      ref="NewEmployeeRef"
      :tree-data="treeData"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  watchEffect,
} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  treePage,
  deleteRole,
  companydeptPage,
  addDepartment,
  eidtDepartment,
} from '_@/api/department'
import DepartmentAddVue from '@/components/Department/DepartmentAdd.vue'
import DepartmentEditVue from '@/components/Department/DepartmentEdit.vue'
import NewEmployeeVue from '@/components/Department/NewEmployee.vue'
import wsCache from '@/cache'

interface StateVerify {
  tableData: Array<any>
  treeData: Array<any>
  loading: Boolean
  forms: {}
}

export default defineComponent({
  components: {
    DepartmentAddVue,
    DepartmentEditVue,
    NewEmployeeVue,
  },
  setup() {
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const parentId = ref<number>(666)
    const DepartmentAddRef = ref<HTMLElement | null>(null)
    const DepartmentEditRef = ref<HTMLElement | null>(null)
    const DepartmentAddVue = ref<boolean>(false)
    const DepartmentEditVue = ref<boolean>(false)
    const dialogVisible = ref<boolean>(false)
    const NewEmployeeVue = ref<boolean>(false)
    const NewEmployeeRef = ref<HTMLElement | null>(null)
    const auditStatusV = ref<number | undefined>(0)
    const skillId = ref<number | undefined>(0)
    const tableHeight = ref<any>(0)
    const disableType = ref<boolean>(true)
    const addOrEidt = ref<string>('')
    const handleNodeClick = async (v: any) => {
      console.log('object :>> ', v)
      state.loading = true
      disableType.value = true
      const res = await companydeptPage(v.id)
      if (res) {
        console.log(res.data)
        state.tableData = res.data
        state.forms = res.data
        state.loading = false
      }
    }

    const defaultProps = reactive({
      children: 'children',
      label: 'name',
    })
    const addEmployee = () => {
      NewEmployeeVue.value = true
      setTimeout(() => {
        ;(NewEmployeeRef.value as any).open()
      }, 30)
    }
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }
    const addTree = (data: any) => {
      const v: any = data.id
      console.log('data :>> ', data)
      DepartmentAddVue.value = true
      setTimeout(() => {
        ;(DepartmentAddRef.value as any).open(v)
      }, 30)
    }

    // 新增部门
    const addTrees = (way: any) => {
      disableType.value = false
      addOrEidt.value = '立即创建'
      state.forms.parentId = state.forms.id
      state.forms.id = 0
      state.forms.name = ''
      state.forms.sort = 0
    }
    // 更改部门
    const eidtTrees = (way: any) => {
      if (state.forms.parentId === 0 && state.forms.name === '') {
        return
      }
      disableType.value = false
      addOrEidt.value = '更新'
      // DepartmentAddVue.value = true
    }
    // 删除
    const deleteTrees = (e: any) => {
      ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRole(state.forms.id).then((res) => {
            if (res.data) {
              state.forms = {
                parentId: 0,
                id: 0,
              }
              ElMessage({
                type: 'success',
                message: `删除成功!`,
              })
              getData()
            } else {
              ElMessage({
                type: 'success',
                message: `删除失败!`,
              })
            }
          })
        })
        .catch(() => {})
    }
    const initForm = () => {
      return {
        employeeName: '',
        name: '',
        employeeTitle: '',
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    const getData = async () => {
      state.loading = true
      treePage()
        .then((res) => {
          if (res) {
            // console.log('treePage :>> ', res.data)
            state.treeData = res.data
            addOrEidt.value = ''
            disableType.value = true
          }
        })
        .catch((error) => {
          console.log(error)
          state.loading = false
        })
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      tableHeight.value = document.documentElement.clientHeight - 190
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
    })

    const addClose = (e: boolean) => {
      console.log('efffff :>> ', e)
      setTimeout(() => {
        if (e) {
          getData()
        }
        DepartmentAddVue.value = false
      }, 300)
    }
    const state = reactive<any>({
      tableData: [],
      treeData: [],
      loading: true,
      forms: {
        parentId: 0,
        id: 0,
        name: '',
        sort: '',
        companyId: wsCache.get('companys')[0].companyId,
      },
    })

    const onSubmit = () => {
      if (addOrEidt.value === '立即创建') {
        console.log(state.forms)

        addDepartment(state.forms)
          .then((res: any) => {
            if (res.data) {
              ElMessage.success('创建成功')
              state.forms = {
                parentId: 0,
                deptId: 0,
              }
              getData()
            } else {
              ElMessage.error(res.msg)
            }
          })
          .catch((erro: any) => {
            ElMessage.error(erro.msg)
          })
      }
      if (addOrEidt.value === '更新') {
        eidtDepartment(state.forms)
          .then((res: any) => {
            if (res.data) {
              ElMessage.success('修改成功')
              getData()
              state.forms = {
                parentId: 0,
                deptId: 0,
              }
            } else {
              ElMessage.error(res.msg)
            }
          })
          .catch((erro: any) => {
            ElMessage.error(erro.msg)
          })
      }
    }
    const edit = (e: any) => {
      state.forms = e
      console.log('state.forms :>> ', state.forms)
      DepartmentEditVue.value = true
      setTimeout(() => {
        ;(DepartmentEditRef.value as any).open()
      }, 30)
    }
    const editClose = (e: boolean) => {
      console.log('efffff :>> ', e)
      setTimeout(() => {
        if (e) {
          getData()
        }
        DepartmentEditVue.value = false
      }, 300)
    }

    return {
      addEmployee,
      addOrEidt,
      NewEmployeeVue,
      NewEmployeeRef,
      disableType,
      parentId,
      addTrees,
      addTree,
      defaultProps,
      handleNodeClick,
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
      DepartmentEditVue,
      DepartmentEditRef,
      DepartmentAddRef,
      DepartmentAddVue,
      deleteTrees,
      tableHeight,
      edit,
      onSubmit,
      eidtTrees,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped></style>
