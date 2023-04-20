<template>
  <div class="banner">
    <el-carousel
      v-if="data.listdata && data.listdata.length > 0"
      height="176px"
    >
      <el-carousel-item v-for="(item, index) in data.listdata" :key="index">
        <img style="height: 100%;width: 100%" :src="item.url">
      </el-carousel-item>
    </el-carousel>
    <div v-else class="image-null"><span class="el-icon-picture" /></div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: ['data']
}
</script>

<style lang="less" scoped>
.banner{
    font-size: 0;
    img{
        width: 100%;
    }
    .el-carousel__indicator--horizontal{
        padding: 12px 4px;
    }
    .el-carousel__button{
        width: 12px;
    }
}
.image-null{
  background: #ffffff;
  height: 176px;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c1c1c1;
}
</style>
