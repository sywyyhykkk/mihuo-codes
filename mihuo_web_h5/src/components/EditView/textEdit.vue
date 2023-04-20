<template>
  <div
    contenteditable="true"
    class="text-edit"
    :data-placeholder="props.placeholder"
    @input="handelInput"
    ref="dom"
  >
    {{ props.modelValue }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, watch, watchEffect } from 'vue'

const props = defineProps(['modelValue', 'placeholder'])
const emit = defineEmits(['update:modelValue'])
const dom = ref<any>('')

const handelInput = () => {
  emit('update:modelValue', dom.value.innerText.toString())
}

onMounted(() => {

})

</script>

<style scoped lang="less">
[contenteditable]:focus {
  outline: none;
}

.text-edit {
  margin-top: 10px;
  width: calc(100% - 3rem);
  min-height: 1.5rem;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  line-height: 15px;

  &:empty:before {
    content: attr(data-placeholder);
    color: #909399;
  }
}
</style>
