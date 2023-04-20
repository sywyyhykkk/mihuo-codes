<template>
  <el-dialog
    v-if="dialogVisible"
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="pageTitle"
    width="54rem"
  >
    <FormSetMain ref="ruleForm_d" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loadingBtn" @click="savePre">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, ref } from 'vue'
import FormSetMain from '@/components/CompanyInfo/FormSetMain.vue'
export default defineComponent({
  components: {
    FormSetMain
  },
  setup(props:any, { emit }) {
    const ruleForm_d:any = ref(null)// 绑定子组件ref
    const save:any = inject('save')
    const loadingBtn:any = inject('loadingBtn')
    const dialogVisible = inject('dialogVisible')
    const pageTitle = inject('pageTitle')
    const formData:any = inject('formData')
    async function savePre() {
      // 验证数据
      const res = await ruleForm_d.value.valid()
      if (res) {
        save()
      }
    }
    onMounted(() => {

    })
    return {
      dialogVisible,
      ruleForm_d,
      loadingBtn,
      pageTitle,
      formData,
      savePre
    }
  }
})
</script>

<style scoped lang="scss">

</style>
