<template>
  <div>
    <el-form
      ref="rulesForm" label-width="90px"
      :rules="rules" :model="form"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="排序">
        <el-input
          v-model="form.sort" type="number"
          clearable
        />
      </el-form-item>
      <el-form-item label="上级分类" prop="parentId">
        <el-cascader
          v-model="form.parentId"
          :options="typeList"
          clearable
          disabled
          :props="defaultProps"
          @change="handleChange"
        />

      </el-form-item>
      <!--     ddddd {{form.parentId}}-->
      <el-form-item label="图标" prop="parentId">
        <uploadImage
          v-model="form.icon" :max-count="1"
          :is-edits="isEdit"
        />
      </el-form-item>
      <el-form-item label="banner图" prop="parentId">
        <uploadImage
          v-model="form.bannerImg" :max-count="1"
          :is-edits="isEdit"
        />
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-radio-group v-model="form.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示在导航栏" prop="navStatus">
        <el-radio-group v-model="form.navStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="form.description" type="textarea"
          clearable :autosize="true"
        />
      </el-form-item>
      <el-form-item label="banner跳转" prop="bannerUrl">
        <richText
          :key="1" v-model="form.bannerUrl"
          platform-type="2" :company-id="companyId"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { productCategoryTree } from '_c/util/api/mall'
import wsCache from '@/cache'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import richText from '_c/AppTextEdit/index.vue'

export default defineComponent({
  components: { uploadFile, richText },
  props: {
    propForm: {
      type: Object,
      default: () => {
      }
    },
    propType: {
      type: String,
      default: ''
    },
    typeList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    platformType: {
      type: String || Number,
      default: ''
    }
  },
  setup(props, { emit, expose }) {
    const rulesForm = ref()
    const form = computed(() => {
      return props.propForm
    })
    const typeList = computed(() => {
      return props.typeList
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    })
    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'id',
      checkStrictly: true
    })

    const handleSave = () => {
      const forms = unref(rulesForm)
      forms.validate((valid: boolean) => {
        if (valid) {
          form.value.productAttributeIdList = []
          emit('submit', form.value)
        }
      })
    }
    const reset = () => {
      const form = unref(rulesForm)
      form.resetFields()
    }
    const handleChange = (value: any) => {
      for (const key in value) {
        form.value.parentId = value[key]
      }
    }
    return {
      form,
      rules,
      rulesForm,
      typeList,
      defaultProps,
      reset,
      handleSave,
      handleChange
    }
  }
})
</script>

<style lang="less" scoped>
.m-container-footer {
  text-align: right;
}
.m-container{
  height: 65vh;
  overflow-y: auto;
}
</style>
