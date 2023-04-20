<template>
  <div class="department">
    <div>
      <div>
        <div class="left" style="width: 40vw">
          <div class="add">
            <el-button size="mini" type="text" icon="plus" @click="addTrees(0)" v-if="$getPression('generator_pmsmaterialtype_add')">
              添加
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="edit"
              @click="eidtTrees(0)"
              v-if="$getPression('generator_pmsmaterialtype_edit')"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="delete"
              @click="deleteTrees(0)"
              v-if="$getPression('generator_pmsmaterialtype_del')"
              >删除
            </el-button>
          </div>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :style="'height:' + tableHeight + 'px;overflow-y:auto'"
          >
            <template #default="{ node }">
              <div class="custom">
                <span>{{ node.label }}</span>
                <el-dropdown>
                  <svg-icon icon-class="more_vertical"></svg-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="addTrees(0)"
                      v-if="$getPression('generator_pmsmaterialtype_add')"
                        >添加子类</el-dropdown-item
                      >
                      <el-dropdown-item @click="eidtTrees(0)"
                      v-if="$getPression('generator_pmsmaterialtype_edit')"
                        >编辑分类</el-dropdown-item
                      >
                      <el-dropdown-item @click="deleteTrees(0)"
                      v-if="$getPression('generator_pmsmaterialtype_del')"
                        >删除分类</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-tree>
        </div>
        <el-dialog
          v-model="centerDialogVisible"
          :title="dialogTitle"
          width="30%"
          top="10%"
        >
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
            <el-form-item label="素材分类名称" :label-width="formLabelWidth">
              <el-input v-model="forms.name" autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="排序"
              :label-width="formLabelWidth"
              prop="dsType"
            >
              <el-input v-model="forms.sort" placeholder="" type="number" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer" v-if="!disableType">
              <el-button type="primary" @click="onSubmit"
                >{{ addOrEidt }}
              </el-button>
              <el-button @click="disableType = true"> 取消</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
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
  getSourceTree,
  deletePmsMaterialType,
  pmsMaterialType,
  sourceById,
  updatePmsMaterialType,
} from '_c/util/api/mall'
import wsCache from '@/cache'

interface StateVerify {
  tableData: Array<any>
  treeData: Array<any>
  loading: Boolean
  forms: {}
}

export default defineComponent({
  setup() {
    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const pagesize = ref<number>(10)
    const parentId = ref<number>(666)
    const DepartmentAddRef = ref<HTMLElement | null>(null)
    const DepartmentEditRef = ref<HTMLElement | null>(null)
    const dialogVisible = ref<boolean>(false)
    const NewEmployeeRef = ref<HTMLElement | null>(null)
    const auditStatusV = ref<number | undefined>(0)
    const skillId = ref<number | undefined>(0)
    const tableHeight = ref<any>(0)
    const disableType = ref<boolean>(true)
    const addOrEidt = ref<string>('')
    const state = reactive<any>({
      tableData: [],
      treeData: [],
      loading: true,
      centerDialogVisible: false,
      dialogTitle: '分类',
      formLabelWidth: '100px',
      forms: {
        parentId: 0,
        id: 0,
        name: '',
        sort: '',
      },
    })
    const handleNodeClick = async (v: any) => {
      state.loading = true
      disableType.value = true
      const res = await sourceById(v.id)
      if (res) {
        state.tableData = res.data
        state.forms = res.data
        state.loading = false
      }
    }

    const defaultProps = reactive({
      children: 'children',
      label: 'name',
    })

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
      getData()
    }

    // 新增
    const addTrees = (way: any) => {
      disableType.value = false
      state.centerDialogVisible = !state.centerDialogVisible
      state.dialogTitle = '新增节点'
      addOrEidt.value = '立即创建'
      state.forms.parentId = state.forms.id
      state.forms.id = 0
      state.forms.name = ''
      state.forms.sort = 0
    }
    // 修改
    const eidtTrees = (way: any) => {
      if (state.forms.parentId === 0 && state.forms.name === '') {
        return
      }
      state.dialogTitle = '修改节点'
      state.centerDialogVisible = !state.centerDialogVisible
      disableType.value = false
      addOrEidt.value = '更新'
    }
    // 删除
    const deleteTrees = (e: any) => {
      ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePmsMaterialType(state.forms.id).then((res) => {
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
      getSourceTree()
        .then((res) => {
          if (res) {
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
      tableHeight.value = document.documentElement.clientHeight - 200
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
      setTimeout(() => {
        if (e) {
          getData()
        }
      }, 300)
    }

    const onSubmit = () => {
      if (addOrEidt.value === '立即创建') {
        pmsMaterialType(state.forms)
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
        updatePmsMaterialType(state.forms)
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

    return {
      addOrEidt,
      NewEmployeeRef,
      disableType,
      parentId,
      addTrees,
      defaultProps,
      handleNodeClick,
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
      DepartmentEditRef,
      DepartmentAddRef,
      deleteTrees,
      tableHeight,
      onSubmit,
      eidtTrees,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped></style>
