<template>
    <div class="divider" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Divider'
})
</script>

<style scoped>
.divider{
  position: relative;
}
.divider:before{
  content: ' ';
  position: absolute;
  width: 100%;
  top: 0px;
  height: 1px;
  margin: 7px 0;
  background: #e6e6e6;
}
</style>
