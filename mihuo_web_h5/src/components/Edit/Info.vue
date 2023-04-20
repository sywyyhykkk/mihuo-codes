<template>
  <div class="info-content">
    <el-form label-width="9rem">
      <el-form-item label="页面标题">
        <el-input v-model="list.title"></el-input>
      </el-form-item>
      <el-form-item label="页面备注">
        <el-input type="textarea" :rows="4" v-model="list.remarks"></el-input>
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="list.backgroundColor" show-alpha></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {defineComponent, reactive} from 'vue';

export default defineComponent({
  name: 'Info',
  props: ['data', 'className'],
  setup(props) {
    let list = reactive(props.data);
    return {
      list
    };
  }
});
</script>

<style lang="less" scoped>
.info-content {
  padding: 20px;
}
</style>
