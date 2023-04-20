<template>
  <div class="product-step">
    <div v-for="(item,index) in tabs" style="width: 50%" @click="handelActive(index+1)">
      <div class="step-item" :class="index+1==props.active?'step-active':''"
           :style="index!=0?' border-top-left-radius: 0px;border-bottom-left-radius: 0px;':''">
        <div class="step-item-left" v-if="index!=0">
        </div>
        <div class="step-text" :class="index+1!=props.active?'step-text-inactive':''">
          <el-icon v-if="index==0">
            <edit-pen />
          </el-icon>
          <el-icon v-if="index==1">
            <picture-filled />
          </el-icon>
          <el-icon v-if="index==2">
            <shopping-cart-full />
          </el-icon>
          <span style="margin-left: 1rem">{{ item }}</span>
        </div>
        <div class="step-item-right" :class="index+1!=props.active?'step-inactive':''" v-if="index+1!=tabs.length">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { defineEmits, defineProps, ref, watchEffect } from 'vue'

const props = defineProps({
  active: {
    type: Number,
    default: 1
  }, tabs: {
    type: Object,
    default: []
  }
})
const emit = defineEmits(['handelActive'])

const tabs = ref<any>(props.tabs)
const active = ref<number>(2)

const handelActive = (val: any) => {
  emit('handelActive', val)
}

watchEffect(() => {
  tabs.value = props.tabs
})

</script>

<style scoped lang="less">
.product-step {
  background: #FFFFFF;
  height: 86px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

}

.step-active {
  height: 46px;
  background: #0969DA !important;
}

.step-item {
  height: 46px;
  background: #F5F7FA;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #FEFEFE;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 5px);
  cursor: pointer;

  .step-inactive {
    border-bottom: 16px solid #F5F7FA !important;
  }

  .step-text-inactive {
    color: #C0C4CC;
  }

  .step-text {
    flex: 1;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-item-right {
    width: 0;
    height: 0;
    border-top: 18px solid transparent; /*这行去掉也行*/
    border-bottom: 16px solid #0969DA;
    border-right: 23px solid transparent;
    border-left: 23px solid transparent;
    transform: rotate(90deg);
    margin-right: -38px;
    z-index: 20;
  }

  .step-item-left {
    width: 0;
    height: 0;
    border-top: 18px solid transparent; /*这行去掉也行*/
    border-bottom: 16px solid #ffffff;
    border-right: 23px solid transparent;
    border-left: 23px solid transparent;
    transform: rotate(90deg);
    margin-left: -7px;
  }
}


</style>
