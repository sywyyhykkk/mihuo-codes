<template>
  <div>
    <el-drawer
      v-model="checkShow"
      title="验收"
      direction="rtl"
      size="80rem"
      @close="closeHandelDrawer"
    >
      <div style="padding: 0 2rem">
        <!--        <div class="accept-name">-->
        <!--          <p>{{ state.acceptData.name }}</p>-->
        <!--        </div>-->
        <div v-for="(item,index) in state.acceptData">
          <acceptQuest :dataIndex="index+1" :data="item" isEdit="true" />
        </div>
      </div>
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
  }, data: {
    type: Object,
    default: []
  }
})
const emit = defineEmits()

const checkShow = ref<boolean>(false)
const acceptDetailShow = ref<boolean>(false)
const surveyPreviewShow = ref<boolean>(false)
const state = reactive({
  acceptData: []
})

const handelClick = (val: any) => {
  surveyPreviewShow.value = true
}

onMounted(() => {
  checkShow.value = props.modelValue
  state.acceptData = JSON.parse(JSON.stringify(props.data))
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
