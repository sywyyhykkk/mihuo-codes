<template>
  <!--  -->
  <div class="MhButtom" @click="sendEmit">{{ title }}</div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      default: ''
    }
  },
  emits: ['buttonClick'],
  setup(props, { emit }) {
    const sendEmit = () => {
      emit('buttonClick')
    }
    return { sendEmit }
  }
})
</script>
<style scoped></style>
