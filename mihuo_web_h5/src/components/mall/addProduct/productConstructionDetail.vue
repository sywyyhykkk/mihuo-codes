<template>
  <div style="margin-top: 10px">
    <div style="height: 60vh;overflow-y: scroll">
      <el-form ref="productAttrForm" :model="dataValue.productProcess" label-width="120px"
               style="width:calc( 100% - 150px)"
               size="small">
        <el-form-item label="施工内容">
          <richText v-model="dataValue.productProcess.buildContent" platform-type="2" :company-id="companyId" />
        </el-form-item>
        <el-form-item label="施工流程">
          <title-add v-model="dataValue.productProcess.buildProcess" title="添加施工流程" />
        </el-form-item>
        <el-form-item label="施工标准">
          <richText v-model="dataValue.productProcess.buildStandard" :key="4" platform-type="2"
                    :company-id="companyId" />
        </el-form-item>
        <el-form-item label="验收标准">
          <title-add v-model="dataValue.productProcess.checkStandard" title="添加验收标准" :standard="true" />
        </el-form-item>
        <el-form-item label="温馨提示">
          <richText v-model="dataValue.productProcess.prompt" :key="2" platform-type="2" :company-id="companyId" />
        </el-form-item>
        <el-form-item label="工程质保权益">
          <richText v-model="dataValue.productProcess.qualityRight" :key="3" platform-type="2"
                    :company-id="companyId" />
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;width: 100%; margin-top: 2.2rem;position: absolute;">
      <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
      <el-button :type="buttonType" class="btn-add" size="medium" @click="handleFinishCommit">完成，提交信息</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'
import richText from '@/components/AppTextEdit/index.vue'
import uploadImage from '_c/UploadFile/uploadImage.vue'
import titleAdd from '_c/mall/addProduct/titleAdd.vue'

export default defineComponent({
  components: { richText, uploadImage, titleAdd },
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }, protType: { //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    }, companyId: { // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    }, buttonType: {
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {

    const ruleForms = ref<any>('')
    const state = reactive({
      dataValue: props.modelValue,
      isEdit: props.isEdit,
      options: []
    })
    const handleFinishCommit = () => {
      console.log(state.dataValue)
      emit('finishCommit')
    }
    const handlePrev = () => {
      emit('prevStep')
    }
    const getData = async () => {
      await fetch({
        url: `/mall/pmsimagematerial/list`,
        method: 'get'
      }).then((res: any) => {
        if (res.code === 0) {
          state.options = res.data
        }
      })
    }

    onMounted(() => {
      // getData()
    })

    return {
      ruleForms,
      handleFinishCommit,
      handlePrev,
      getData,
      ...toRefs(state)
    }
  }
})

</script>

<style scoped lang="less">
.my_phone_style {
  height: 667px;
  width: 375px;
  border: solid 1px #999999;
  border-radius: 5px;
  overflow-y: hidden;
  margin-top: 15px;
  float: left;
}

.my_phone_style2 {
  float: left;
  width: calc(100% - 300px);
}
</style>
