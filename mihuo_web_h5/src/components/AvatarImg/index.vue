<template>
  <div>
    <el-image
      class="avatar-img"
      :src="
        props.avatarId
          ? avatarImage(props.avatarId)
          : require('@/assets/img/avatar.png')
      "
      :style="props.styles"
    >
      <template #error>
        <img
          class="avatar-img"
          :src="require('@/assets/img/avatar.png')"
          :style="props.styles"
        >
      </template>
    </el-image>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { avatarImage } from '@/utils/utils'
const props = defineProps({
  // 展示的数据
  styles: {
    type: Object,
    default: () => {}
  },
  avatarId: {
    type: [String, Number],
    default: ''
  }
})

</script>

<style scoped lang="less">
.avatar-img{
  border-radius: 50%;
}
</style>
