<template>
  <div :class="props.placement=='left'?`my-title_${pageType}`:`my-title-r_${pageType}`">
    <div v-if="props.placement=='left'||pageType==2">
      <slot name="title">
        <div :class="`title-left_${pageType}`">
          {{ props.title }}
        </div>
      </slot>
    </div>
    <div>
      <slot name="content">

      </slot>
    </div>
    <div v-if="props.placement=='right'&&pageType==1">
      <slot name="title">
        <div :class="`title-right_${pageType}`">
          {{ props.title }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, inject, onMounted } from 'vue'

const props = defineProps({
  placement: {
    type: String,//left,right
    default: 'left'
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits()

const pageType = inject('pageType')

</script>

<style scoped lang="less">
.title-left_2 {
  font-weight: bold;
  color: #0969DA;
  padding-left: 3rem;
  font-size: 18px;
}

.title-left_1 {
  color: #ffffff;
  padding-left: 3rem;
  font-size: 18px;
  color: #FFFFFF;
}

.title-right_1 {
  color: #ffffff;
  padding-right: 3rem;
  font-size: 18px;
  color: #FFFFFF;
}

.title-right_2 {
  font-weight: bold;
  color: #0969DA;
  padding-right: 3rem;
  font-size: 18px;
}

.my-title_1 {
  height: 50px;
  border-radius: 25px;
  display: flex;
  background: linear-gradient(to right, rgba(#0E78CB, 0.2), rgba(#020D32, 0.2));
  justify-content: space-between;
  align-items: center;

}

.my-title_2 {
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.my-title-r_1 {
  height: 50px;
  border-radius: 25px;
  display: flex;
  background: linear-gradient(to left, rgba(#0E78CB, 0.2), rgba(#020D32, 0.2));
  justify-content: space-between;
  align-items: center;

}

.my-title-r_2 {
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

</style>
