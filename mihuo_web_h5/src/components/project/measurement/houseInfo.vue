<template>
  <div style="margin-top: -4rem">
    <settingSurvey
      style="height: calc(100vh - 18.5rem)"
      v-if="showType===0"
      :surveyId="surveyId"
      :pageType="'量房'"
      v-model="settingSurveyShow" />
    <div v-if="showType===1">
      <el-empty
        :image-size="300"
        description="暂无问卷信息~"
        :image="require('@/assets/img/empty/no_data.png')"
      />
      <el-button
        icon="download"
        type="primary"
        class="button-down2"
        @click="importTemplate()"
      >导入问卷模板
      </el-button>
    </div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="导入模板"
      v-model="downloadType"
    >
      <el-form
        ref="ruleForms"
        :model="form"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="选择模板" prop="surveyTemplateId">
          <!--          <el-select-->
          <!--            v-model="form.surveyTemplateId"-->
          <!--            filterable-->
          <!--            placeholder="请选择模板"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="(item, index) in templateList"-->
          <!--              :key="index"-->
          <!--              :label="item.surveyName"-->
          <!--              :value="item.id"-->
          <!--            />-->
          <!--          </el-select>-->
          <ques-select @change="changeQues" v-model="form.surveyTemplateId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm()">确 定</el-button>
          <el-button @click="downloadType = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import { updateTemplateDetails } from '_@/api/basicConfig'

export default defineComponent({
  props: {
    modelValue: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const state = reactive({
      settingSurveyShow: true,
      surveyId: '',//问卷id
      ruleForms: '' as any,
      rules: {
        surveyTemplateId: [{ required: true, message: '请选择模板', trigger: 'blur' }]
      },
      surveyTemplatePartDTOList: [],
      downloadType: false,
      showType: -1,
      isEdit: false,
      form: {
        surveyTemplateId: ''
      },
      templateList: [],
      answerTypeList: [
        { label: '单选', value: '1' },
        { label: '多选', value: '2' },
        { label: '文本输入', value: '3' },
        { label: '文件上传', value: '4' }
      ] as any

    })
    const changeQues = () => {
      state.ruleForms.validateField('surveyTemplateId', (valid: boolean) => {})
    }
    const handleConfirm = () => {
      state.ruleForms.validate((valid: any) => {
        if (valid) {
          saveTemplate()
        }
      })
    }
    //选择模板后的保存请求
    const saveTemplate = async () => {
      await fetch({
        url: '/order/room_survey_config/save',
        method: 'post',
        data: state.form
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功')
          getSurveyTemplate()
          state.downloadType = false
        }
      })
    }
    const handleCancel = () => {
      emit('update:modelValue', false)
    }
    watchEffect(() => {
      state.isEdit = props.modelValue
    })
    const importTemplate = () => {
      state.downloadType = true
    }
    const getTemplateList = async () => {
      await fetch({
        url: '/basic/surveytemplate/getAllTemplates',
        method: 'get'
      }).then((res: any) => {
        state.templateList = res.data
      })
    }
    const getSurveyTemplate = async () => {
      await fetch({
        url: '/order/room_survey_config/get',
        method: 'get'
      }).then((res: any) => {
        if (res.data) {
          state.surveyId = res.data
          state.showType = 0
        } else {
          state.showType = 1
        }
      })
    }

    onMounted(() => {
      getSurveyTemplate()
      getTemplateList()
    })
    return {
      changeQues,
      getSurveyTemplate,
      handleConfirm,
      saveTemplate,
      importTemplate,
      handleCancel,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.button-down2 {
  width: 160px;
  margin-left: calc((100% - 160px) / 2);
  margin-top: 15px;
}
</style>
