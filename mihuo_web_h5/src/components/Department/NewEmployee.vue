<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    title="新增员工"
    :before-close="handleClose"
  >
    <el-form ref="rulesForm" label-width="110px" :model="form" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="选择用户" prop="userId">
                <el-input
                  v-model="form.userId"
                  size="mini"
                  readonly
                  @click="openUser"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="选择部门" prop="deptId">
                <el-input v-model="form.dsType" size="mini" readonly />
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工姓名" prop="name">
            <el-input
              v-model="form.employeeName"
              size="mini"
              placeholder="请输入员工姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工手机号" prop="sort">
            <el-input
              v-model="form.phone"
              size="mini"
              placeholder="请输入员工手机号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工身份证号" prop="sort">
            <el-input
              v-model="form.sort"
              size="mini"
              placeholder="员工身份证号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工职称" prop="sort">
            <el-input v-model="form.employeeTitle" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="sort">
            <el-input v-model="form.remark" size="mini" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="角色" prop="deptId">
                <el-select
                  v-model="form.role"
                  style="width: 100%"
                  size="mini"
                  placeholder="请选择角色"
                >
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
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirms">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
    <SelectUserVue
      v-if="SelectUserVue"
      ref="SelectUserRef"
      @username="getUsername"
    />
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  unref,
  PropType,
  onMounted,
} from 'vue'
import { ElMessage } from 'element-plus'
import { addDepartment } from '_@/api/department'
import SelectUserVue from './SelectUser.vue'

interface FormModule {
  name: string | number
  parentId: string | number
  sort: number | string
  userId: number | string
  dsType: number | string
}
interface RulesModule {
  name: any[]
  sort: any[]
}
export default defineComponent({
  components: { SelectUserVue },
  props: {
    treeData: {
      type: Object as PropType<object>,
      default: () => {},
    },
  },
  emits: ['Add'],
  setup(props, { emit }) {
    const SelectUserVue = ref<boolean>(false)
    const visible = ref<boolean>(false)
    const rulesForm = ref<HTMLElement | null>(null)
    const SelectUserRef = ref<HTMLElement | null>(null)
    const ids = ref<string>('')
    const handleClose = () => {
      visible.value = false
      emit('Add')
    }
    const defaultProps = reactive({
      children: 'children',
      label: 'name',
    })
    const handleNodeClick = async (v: any) => {
      console.log('object :>> ', v)
      ids.value = v.id
      form.dsType = v.name
    }
    const form = reactive<FormModule>({
      userId: '',
      name: '',
      parentId: '',
      sort: '',
      dsType: '',
    })
    const getUsername = (e: string) => {
      form.userId = e
    }
    const rules = reactive<RulesModule>({
      name: [{ required: true, message: '请输入部门名称' }],
      sort: [{ required: true, message: '请输入部门排序' }],
    })
    let treeDatas = reactive({})
    const openUser = () => {
      SelectUserVue.value = true
      setTimeout(() => {
        ;(SelectUserRef.value as any).open()
      }, 30)
    }
    onMounted(() => {
      treeDatas = props.treeData
      console.log('treeDatas :>> ', treeDatas)
    })
    const open = (e: any) => {
      visible.value = true
      form.parentId = e
      console.log('visible :>> ', visible.value)
    }
    const confirms = async () => {
      const formWrap = unref(rulesForm) as any
      if (!formWrap) return
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
            const res = await addDepartment(form)
            if (res) {
              ElMessage({
                type: 'success',
                message: `新增${form.name}成功`,
              })
              visible.value = false
              emit('Add', true)
            }
          } else {
            return false
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
    return {
      ids,
      defaultProps,
      treeDatas,
      handleNodeClick,
      getUsername,
      openUser,
      SelectUserVue,
      SelectUserRef,
      rulesForm,
      confirms,
      rules,
      visible,
      open,
      handleClose,
      form,
    }
  },
})
</script>
<style scoped></style>
