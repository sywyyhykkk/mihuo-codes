<template>
  <div class="container_boxshow">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BoxshowContainer'
}
</script>

<style scoped lang="less">
 .container_boxshow:hover{
   box-shadow: 0px 0px 10px  #e6e6e6;
 }
</style>
