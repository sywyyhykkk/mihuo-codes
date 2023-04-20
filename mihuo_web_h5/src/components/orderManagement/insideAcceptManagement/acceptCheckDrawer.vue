<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="订单查看"
      direction="rtl"
      size="80rem"
      @close="closeHandelDrawer"
    >
      <!--      <div style="display: flex;justify-content: center;align-items: center;flex-flow: column;">-->
      <!--        <el-empty-->
      <!--          :image-size="218"-->
      <!--          description="水电工【张三】2022-05-18 11:35 发起验收"-->
      <!--          :image="require('@/assets/img/empty/no_data.png')"-->
      <!--        />-->
      <!--        <el-button type="primary">去验收</el-button>-->
      <!--      </div>-->
      <div class="card-list">
        <acceptCard class="list-item" v-for="item in 10" :data="{acceptanceCreateName:'s'}"
                    @getData="acceptDetailShow=true" />
      </div>
      <div class="drawer-footer footer-center">
        <el-button type="primary" @click="handelClick('去验收')">去验收</el-button>
      </div>
      <!--验收详情-->
      <acceptDetailDrawer :acceptId="68" v-model="acceptDetailShow" />
      <!--去验收-->
      <surveyPreview
        v-model="surveyPreviewShow"
        surveyId="8"
        :disabled="false"
        :surveyName="'验收'"
        @saveSurvey="saveSurvey"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  }
})
const emit = defineEmits()

const checkShow = ref<boolean>(false)
const acceptDetailShow = ref<boolean>(false)
const surveyPreviewShow = ref<boolean>(false)

const handelClick = (val: any) => {
  surveyPreviewShow.value = true
}

watchEffect(() => {
  checkShow.value = props.modelValue
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}

</script>

<style scoped lang="less">
.card-list {
  padding: 4rem;
  position: absolute;
  bottom: 85px;
  top: 75px;
  left: 0;
  right: 0;
  overflow-y: auto;

  .list-item {
    margin-top: 0;
  }
}

.footer-center {
  position: absolute;
  height: 85px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  border-top: solid 1px #F3F4F8;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

</style>
