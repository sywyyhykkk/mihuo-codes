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
      <div style="height: 60vh;">
        <el-form ref="ruleForms" :model="dataForm" label-width="9rem">
          <el-form-item label="姓名">
            <span>{{ dataForm.userNickName }}</span>
          </el-form-item>
          <el-form-item label="主题">
            <span>{{ dataForm.title }}</span>
          </el-form-item>
          <el-form-item label="发布时间">
            <span>{{ dataForm.createTime }}</span>
          </el-form-item>
          <el-form-item v-if="dataForm.userId !== -1" :label="Number(dataForm.userId) > 0 ? '内容图片' : '封面图'">
            <uploadImage
              v-model="dataForm.images"
              :is-edits="false"
              disabled
            />
          </el-form-item>
          <el-form-item label="发布内容">
            <span v-if="dataForm.userId > 0">{{ dataForm.content }}</span>
            <AppTextEdit v-else v-model="dataForm.content" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="confirm"
          >确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  getCurrentInstance
} from 'vue'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  props: [
    'getData',
    'hideDialog',
    'row',
    'modelValue'
  ],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const isLink = ref(false)
    const state = reactive({
      imgUrl: [],
      demandDetailShow: props.modelValue,
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
      const imgUrl = state.dataForm.images ? state.dataForm.images : []
      state.dataForm.images = imgUrl.map((item: any) => {
        return (
          item.url
        )
      }).join()
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
.image-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: 2rem;
}

.grid {
  width: 100px;
  height: 100px;
}
</style>
