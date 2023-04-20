<template>
  <el-dialog
    v-model="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    title="编辑项目模版配置"
    :before-close="handleClose"
    width="56rem"
  >
    <el-form
      label-width="12rem"
      :model="form"
    >
      <el-form-item label="需求类型">
        <el-input
          v-model="forms.requirementTypeName"
          disabled
          readonly
        />
      </el-form-item>
      <el-form-item label="SOP模版">
        <el-select v-model="forms.sopTemplateId" placeholder="请选择">
          <el-option
            v-for="item in sopList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选材模版">
        <el-select v-model="forms.materialTemplateId" placeholder="请选择">
          <el-option
            v-for="item in bizList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
            @click="checkVal(item)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSave"
        >确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, PropType, computed, onMounted, reactive, toRaw } from 'vue'
import { reqSaveuirementconfigList } from '../../pages/enterprise//api/enterprise'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<object>,
      default: () => {}
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
    const visible = ref<boolean>(false)
    const handleClose = () => {
      visible.value = false
      emit('dialogVisible')
    }
    const state = reactive({
      bizList: [],
      sopList: [],
      templateType: ''
    })
    onMounted(() => {
      state.sopList = props.soptemplateList
    })
    const forms: any = computed(() => {
      return props.form
    })
    const open = () => {
      visible.value = true
    }
    const checkVal = (obj:any) => {
      state.templateType = obj.templateType
      // console.log(obj.templateType,'obj')
    }
    const handleSave = async () => {
      const res = await reqSaveuirementconfigList({
        id: forms.value.id,
        materialTemplateId: forms.value.materialTemplateId,
        requirementType: forms.value.requirementType,
        requirementTypeName: forms.value.requirementTypeName,
        sopTemplateId: forms.value.sopTemplateId
      })
      if (res) {
        ElMessage.success({
          message: '操作成功',
          type: 'success'
        })
        props.getData()
        // console.log('res :>> ', res)
      }
      visible.value = false
    }

    return {
      forms,
      visible,
      open,
      handleClose,
      handleSave,
      checkVal,
      ...toRefs(state)
    }
  }
})
</script>
<style scoped></style>
