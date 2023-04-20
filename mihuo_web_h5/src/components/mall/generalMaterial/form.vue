<template>
  <div>
    <el-form ref="rulesForm" label-width="9rem" :rules="rules" :model="form">
      <el-form-item label="素材类型" prop="materialTypeId">
        <!--        <el-select v-model="form.materialTypeId" placeholder="请选择" @change="getMaterialName">-->
        <!--          <el-option-->
        <!--            v-for="item in materialTypeList"-->
        <!--            :key="item.id"-->
        <!--            :label="item.name"-->
        <!--            :value="item.id"-->
        <!--          />-->
        <!--        </el-select>-->
        <el-cascader
          v-model="form.materialTypeId"
          :options="materialTypeList"
          :props="defaultProps"
          clearable
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-select v-model="form.fileType" placeholder="请选择" @change="getFileType">
          <el-option
            v-for="(item,index) in fileTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.fileList.length<=1" label="素材名称" prop="materialName">
        <el-input v-model="form.materialName" />
      </el-form-item>
      <el-form-item label="上传素材" prop="fileList">
        <fileUpload
          :file-type="fileType"
          :is-editor="isEditor"
          :form-batch="formBatch"
          :prop-url-list="propUrlList"
          @changeUpload="changeUpload"
        />
      </el-form-item>
    </el-form>

  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect, watch } from 'vue'
import { selectPmsCommonMaterial, selectPmsMaterialTypeList } from '_c/util/api/mall'
import { thumbnailImage } from '@/utils/utils'

export default defineComponent({
  components: {
    // platformListChange
    // uploadFile
  },
  props: {
    platformType: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: {
        materialTypeId: '',
        materialName: '',
        isImport: 0,
        fileType: 1,
        materialTypeName: '',
        url: '',
        fileList: [] as any
      }
    }, propUrlList: {
      type: Object,
      default: []
    }, isEdit: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: {}
    },
    fileType: {
      type: String,
      default: {}
    }
  },
  setup(props, context) {
    const rules = ref(props.rules)

    const state = reactive({
      rulesForm: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: false
      },
      form: props.modelValue,
      materialTypeList: [],
      pageSize: 10,
      currentPage: 1,
      search: {
        materialName: null,
        materialTypeId: null
      },
      fileType: props.fileType,
      isEditor: props.isEdit,
      formBatch: props.isEdit ? false : true,
      fileTypeList: [
        { value: 1, label: '图片', fileType: 'img' },
        { value: 2, label: '视频', fileType: 'video' },
        { value: 3, label: '音频', fileType: 'audio' }
      ] as any,
      // fileList: [] as any,
      propUrlList: props.propUrlList as any

    })
    const changeUpload = (e: any) => {
      state.form.url = ''
      state.form.fileList = e.value
    }
    const getFileType = (e: any) => {
      state.fileType = state.fileTypeList[e - 1].fileType
      state.form.materialName = ''
    }
    const getData = async () => {
      selectPmsMaterialTypeList({}).then(res => {
        if (Number(props.platformType) === 1) { // 平台
          state.materialTypeList = res.data.filter((item: any) => Number(item.type) === 1)
        } else {
          state.materialTypeList = res.data
        }
      })
    }
    const handleChange = (val: any) => {
      state.form.materialTypeId = state.form.materialTypeId[state.form.materialTypeId.length - 1]
    }
    const validate = (valida: Function) => {
      state.rulesForm.validate((valid: any) => {
        if (valid) {
          valida(true)
        } else {
          alert('请把信息填写完整')
        }
      })
    }
    watchEffect(() => {
      if (state.form.fileList.length === 1) {
        state.form.materialName = state.form.materialName ? state.form.materialName : state.form.fileList[0].name
      }
      context.emit('update:modelValue', state.form)
    })
    onMounted(() => {
      getData()
    })
    return {
      rules,
      validate,
      changeUpload,
      getFileType,
      getData,
      handleChange,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>
