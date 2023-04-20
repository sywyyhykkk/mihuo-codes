<template>
  <div class="">
    <div class="setStyle">星级设置</div>
    <el-form label-width="9rem">
      <el-form-item label="最大星级">
        <el-input type="number" v-model="list.data.max"></el-input>
      </el-form-item>
      <el-form-item label="实际星级">
        <el-input type="number" v-model="list.data.real"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'MaterialRate',
  props: ['data', 'className'],
  setup(props) {
    let list = reactive(props.data)
    return {
      list
    }
  }
})
</script>

<style lang="less" scoped>
.block {
  font-size: 15px;
  margin: 20px;
}
</style>
