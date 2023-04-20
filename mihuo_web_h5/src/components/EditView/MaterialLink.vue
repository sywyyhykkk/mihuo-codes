<template>
  <div class="image-box" :class="className">
    <template v-if="data.listdata && data.listdata.length > 0">
      <div v-for="(item, index) in data.listdata" :key="index">
        <img v-if="item.linkType == 1" :src="$imageGlobal + item.url">
        <span v-else class="linkText">{{ item.textContent || item.name }}</span>
      </div>
    </template>
    <template v-else>
      <div class="image-null"><span class="el-icon-picture" /></div>
    </template>
  </div>
</template>
<script>
import { defineComponent, markRaw } from 'vue'
export default defineComponent({
  name: 'MaterialLink',
  props: ['data', 'className']
})
</script>

<style lang="less" scoped>
.image-box {
  width: 355px;
  overflow: hidden;
  .linkText {
    color: #1b8bff;
    text-decoration: underline;
    line-height: 18px;
  }
  img {
    width: 100%;
    max-width: 100%;
  }
  .image-null {
    background: #ffffff;
    height: 300px;
    font-size: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
    width: 100%;
  }
  a {
    display: block;
  }
  &.two {
    display: flex;
    flex-wrap: wrap;
    box-sizing: content-box;
    a {
      width: 50%;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      display: block;
      padding-bottom: 50%;
      background: #e4e4e4;
      img {
        position: absolute;
      }
    }
  }
  &.three {
    height: 100px;
    overflow-y: auto;
    white-space: nowrap;
    box-sizing: content-box;
    a {
      width: 100px;
      height: 100px;
      margin: 0 4px;
      display: inline-block;
      vertical-align: bottom;
      background: #e4e4e4;
    }
  }
}
</style>
