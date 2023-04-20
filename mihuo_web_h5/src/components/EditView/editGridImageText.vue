<template>
  <div class="edit-data">
    <el-button type="primary" icon="plus" @click="handelClick">添加项</el-button>
    <div class="grid-data">
      <div class="grid-item"
           v-for="(item,index) in form.textContent"
           :key="index"
           :style="`width:calc((100%/${Number(form.gridNum?form.gridNum:1)}) - 2rem)`"
      >
        <upload-image v-if="showImage" v-model="item.imageUrl" />
        <!--        <textEdit placeholder="标题" style="margin-top: 2rem" v-model="item.title" v-if="form.titleShow==1" />-->
        <!--        <textEdit placeholder="副标题" v-model="item.subtitle" v-if="form.subtitleShow==1" />-->
        <el-input style="width: calc(100% - 2rem)!important;margin: 2rem 0" v-if="form.titleShow==1"
                  v-model="item.title"
                  placeholder="标题" />
        <el-input style="width: calc(100% - 2rem)!important;" placeholder="副标题" v-model="item.subtitle"
                  v-if="form.subtitleShow==1" />
        <div class="link-data" @click="handelLink(index)">
          链接内容: {{ item.linkData?.name }}
        </div>
        <el-icon size="2rem" color="red" class="delete-icon" @click="deleteItem(index)">
          <delete />
        </el-icon>
      </div>
    </div>
    <linkContent v-if="form.textContent.length>0&&showLink" v-model="showLink"
                 v-model:linkData="form.textContent[linkIndex].linkData" />
  </div>
</template>

<script lang="ts" setup>

import { defineProps, onMounted, watch, defineEmits, ref, reactive, watchEffect } from 'vue'
import { deepClone } from '@/utils'

const props = defineProps({
  modelValue: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue'])

const showLink = ref<boolean>(false)
const showImage = ref<boolean>(true)
const form = ref<any>(props.modelValue)
const linkIndex = ref<number>(0)

const handelClick = () => {
  form.value.textContent.push({
    imageUrl: '',
    title: '',
    subtitle: '',
    linkData: {} as any
  })
}
const deleteItem = (index: number) => {
  showImage.value = false
  form.value.textContent.splice(index, 1)
  emit('update:modelValue', deepClone(props.modelValue))
  setTimeout(() => {
    showImage.value = true
  }, 100)

}
const handelLink = (index: number) => {
  linkIndex.value = index
  showLink.value = true
}

onMounted(() => {
  // console.log('网格图文modelValue', props.modelValue)

})
watchEffect(() => {
  form.value = props.modelValue
})


</script>

<style scoped lang="less">
.link-data {
  line-height: 20px;
  margin-top: 10px;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}

.edit-data {
  margin-top: 2rem;
}

.grid-data {
  display: flex;
  flex-wrap: wrap !important;
  max-height: 50vh;
  overflow-y: auto;

}

.grid-item {
  border: 1px solid #e4e7ed;
  padding: 10px 0;
  //height: 200px;
  margin: 8px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: relative;

  .delete-icon {
    position: absolute;
    right: 0;
    top: 0;
    margin-right: -5px;
    margin-top: -5px;
    display: none;
  }

  &:hover {
    .delete-icon {
      display: block;
    }
  }
}

</style>
