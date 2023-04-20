<template>
  <div>
    <el-dialog
      v-if="demandDetailShow"
      v-model="demandDetailShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="查看"
      @close="cancel"
    >
      <el-form
        ref="ruleForms"
        :model="dataForm"
        label-width="9rem"
      >
        <el-form-item label="姓名">
          <el-input
            v-model="dataForm.customerName"
            readonly
          />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="dataForm.customerPhone"
            readonly
          />
        </el-form-item>
        <el-form-item label="施工地址">
          <el-input
            type="textarea"
            v-model="dataForm.address"
            readonly
          />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input
            v-model="dataForm.created"
            readonly
          />
        </el-form-item>
        
        <el-form-item label="图片" prop="imgUrl">
          <uploadImage
            :disabled="true"
            v-model="imgUrl"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick type="primary"
            @click="confirm"
          >确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { putObj, addObj } from '../util/api/banner'
import { ElMessage } from 'element-plus'
import uploadImage from '_c/UploadFile/uploadImage.vue'
import chooseCms from '_c/ChooseCms/index.vue'
import richText from '_c/AppTextEdit/index.vue'
import { fetch } from '_@/axios-config/axios'
import { defineComponent, reactive, toRefs, ref, onMounted, watch } from 'vue'
import wsCache from '@/cache'

export default defineComponent({
  components: { uploadImage, chooseCms, richText },
  props: ['getData', 'hideDialog', 'isEdit', 'row', 'clientType', 'clientId', 'modelValue'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const isLink = ref(false)
    const state = reactive({
      imgUrl:'',
      demandDetailShow: props.modelValue,
      content: '[]',
      cmsMessage: '',
      dataForm: props.row
    })

    const confirm = () => {
      emit('getData')
      emit('hideDialog')
    }

    const cancel = () => {
      emit('getData')
      emit('hideDialog')
      emit('update:modelValue', false)
    }

    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        state.demandDetailShow = props.modelValue
      }
    )

    watch(
      () => props.row,
      (newValue, oldValue) => {
        state.dataForm = newValue
      }
    )

    onMounted(() => {
      let str = '';
      JSON.parse(props.row.attachments).map((item:any) => {
        if(item.type==='img'){
          str += item.url + ','
        }
      })
      state.imgUrl = str.substr(0, str.length -1)
    })

    return {
      confirm,
      cancel,
      isLink,
      ruleForms,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
