<template>
  <div class="">
    <div class="setStyle">内容填写</div>
    <el-form label-width="9rem">
      <el-form-item label="文字内容">
        <el-input type="textarea" :rows="4" v-model="list.content"></el-input>
      </el-form-item>
    </el-form>
    <div class="setStyle">内容设置</div>
    <div class="block">
      <span class="demonstration">文字大小</span>
      <el-slider :min="12" :max="30" height="20px" v-model="list.style.size.fontSize"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">文字间距</span>
      <el-slider :min="0" :max="10" v-model="list.style.size.letterSpacing"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">行高</span>
      <el-slider :min="12" :max="60" v-model="list.style.size.lineHeight"></el-slider>
    </div>
    <div class="setStyle">色彩设置</div>
    <div class="block">
      <el-form label-width="9rem">
        <el-form-item label="文字颜色">
          <el-color-picker v-model="list.style.color.color" show-alpha></el-color-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, reactive} from 'vue';

export default defineComponent({
  name: "Word",
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
.block {
  font-size: 15px;
  margin: 20px;
}
</style>
