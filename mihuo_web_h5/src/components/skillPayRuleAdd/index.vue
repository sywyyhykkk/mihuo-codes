<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="tName+'规则'"
    center
    :before-close="handleClose"
    width="56rem"
  >
    <el-form
      ref="ruleForms"
      label-width="12rem"
      :model="form"
      :rules="dataRule"
    >
      <!-- <el-form-item label="装修类型" prop="requirementpType">
        <el-select v-model="forms.requirementpType" placeholder="请选择">
          <el-option
            v-for="item in requirementTypeNameList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="岗位" prop="skillId">
        <el-select
          v-model="forms.skillId" placeholder="请选择"
        >
          <el-option
            v-for="item in bizList"
            :key="item.skillId"
            :label="item.skillName"
            :value="item.skillId"
            :disabled="item.disabled"
            @click="checkVal(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付比例">
        <div>
          <el-form-item
            label-width="16rem"
            label="工种验收"
            prop="skillAcceptanceRatio"
          >
            <el-input
              v-model="forms.skillAcceptanceRatio"
              style="width:140px;"
              oninput="value=value.replace(/[^0-9.]/g, '')"
              @blur="checkValNext(forms.skillAcceptanceRatio)"
              @input="filterVal(forms.skillAcceptanceRatio,'skillAcceptanceRatio')"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label-width="16rem"
            label="工种验收存疑天数"
            prop="skillAcceptanceLimit"
          >
            <el-input
              v-model="forms.skillAcceptanceLimit"
              style="width:140px;"
              @input="forms.skillAcceptanceLimit = forms.skillAcceptanceLimit.replace(/^0(0+)|[^\d]+/g, '')"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label-width="16rem"
            label="项目验收"
            prop="projectAcceptanceRatio"
          >
            <el-input
              v-model="forms.projectAcceptanceRatio"
              style="width:140px;"
              oninput="value=value.replace(/[^0-9.]/g, '')"
              @change="filterVal(forms.projectAcceptanceRatio,'projectAcceptanceRatio')"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item
            label-width="16rem"
            label="项目验收存疑天数"
            prop="projectAcceptanceLimit"
          >
            <el-input
              v-model="forms.projectAcceptanceLimit"
              style="width:140px;"
              @input="forms.projectAcceptanceLimit = forms.projectAcceptanceLimit.replace(/^0(0+)|[^\d]+/g, '')"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </div> -->
      </el-form-item>
      <el-form-item label="备注" prop="">
        <el-input
          v-model="forms.remark" type="textarea"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSave"
        >保存</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, PropType, computed, getCurrentInstance, onMounted, reactive } from 'vue'
import { reqSkillPayRuleAddSave, reqSkillPayRuleEditUpdate } from '../../pages/cityoperator/api/enterprise'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<object>,
      default: () => {}
    },
    title: {
      type: String as PropType<String>,
      default: () => '新增'
    },
    biztemplateList: {
      type: Array as PropType<any>,
      default: () => []
    },
    soptemplateList: {
      type: Array as PropType<any>,
      default: () => []
    },
    getData: {
      type: Function as PropType<Function>,
      default: () => {}
    }
  },
  emits: ['dialogVisible'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const visible = ref<boolean>(false)
    const handleClose = () => {
      visible.value = false
      forms.value = {}
      emit('dialogVisible')
    }
    const { proxy } = getCurrentInstance() as any
    const state = reactive({
      dataRule: {
        skillId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        skillAcceptanceRatio: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        skillAcceptanceLimit: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        projectAcceptanceRatio: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
      },
      bizList: [],
      // 需求类型：1=装修，2=维修，3=安装，4=设计，5=其他
      requirementTypeNameList: [
        {
          name: '装修',
          id: 1
        },
        {
          name: '维修',
          id: 2
        },
        {
          name: '安装',
          id: 3
        },
        {
          name: '设计',
          id: 4
        },
        {
          name: '其他',
          id: 5
        }
      ],
      skillName: ''
    })
    onMounted(() => {
      state.bizList = props.biztemplateList
    })
    const forms: any = computed(() => {
      return props.form
    })
    const tName: any = computed(() => {
      return props.title || '新增'
    })
    const open = () => {
      visible.value = true
    }
    const checkVal = (e:any) => {
      state.skillName = e.skillName
    }
    const filterVal = (value:any, name:string) => {
      if (!value) return
      // 清除"数字"和"."以外的字符
      value = value.replace(/[^\d.]/g, '')
      // 验证第一个字符是数字而不是
      value = value.replace(/^\./g, '')
      // 只保留第一个. 清除多余的
      value = value.replace(/\.{2,}/g, '.')
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      // 只能输入两个小数
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      // console.log(value, 'value')
      // console.log(forms.value['projectAcceptanceRatio'], 'forms')
      forms.value[name] = value
    }
    const checkValNext = (val:any) => {
      if (!val) return
      forms.value.projectAcceptanceRatio = (100 - (+val))
    }
    const handleSave = async () => {
      ruleForms.value.validate(async (valid: any) => {
        let apiURL
        if (props.title === '新增') {
          apiURL = reqSkillPayRuleAddSave
        } else {
          apiURL = reqSkillPayRuleEditUpdate
        }
        if (valid) {
          const res:any = await apiURL({
            id: forms.value.id,
            companyId: forms.value.companyId,
            projectAcceptanceRatio: proxy.$getNum.numDiv(forms.value.projectAcceptanceRatio, 100), // (forms.value.projectAcceptanceRatio / 100).toFixed(4),
            remark: forms.value.remark,
            skillAcceptanceLimit: forms.value.skillAcceptanceLimit,
            skillAcceptanceRatio: proxy.$getNum.numDiv(forms.value.skillAcceptanceRatio, 100), // (forms.value.skillAcceptanceRatio / 100).toFixed(4),
            skillId: forms.value.skillId || '1',
            skillName: state.skillName
          })
          if (res.code == 0) {
            ElMessage.success({
              message: '操作成功',
              type: 'success'
            })
            visible.value = false;
            props.getData()
          }
        }
      })
    }

    return {
      forms,
      visible,
      open,
      tName,
      handleClose,
      handleSave,
      checkVal,
      filterVal,
      ruleForms,
      checkValNext,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
