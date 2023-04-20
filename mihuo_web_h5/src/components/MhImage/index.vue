<template>
  <el-image
    preview-teleported
    style="width: 100px; height: 100px"
    :src="$imageGlobal + url"
    :fit="fit"
    :hide-on-click-modal="hideOnClickModal"
    :lazy="lazy"
    :preview-src-list="previewSrcList"
    :referrer-policy="referrerPolicy"
    :scroll-container="scrollContainer"
    :z-index="zIndex"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MhImage',
  components: {},
  props: {
    url: {
      type: String,
      default: '',
    },
    fit: {
      type: String,
      default: '',
    },
    hideOnClickModal: {
      type: Boolean,
      default: false,
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    previewSrcList: {
      type: Array,
      default: () => [],
    },
    referrerPolicy: {
      type: String,
      default: '',
    },
    scrollContainer: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: 99,
    },
  },
  setup(props, { attrs, slots }) {
    console.log(props)
  },
})
</script>

<style lang="less" scoped>
.pagination__wrap {
  margin-top: 15px;
  background: #fff;
  padding: 10px;
}
</style>
