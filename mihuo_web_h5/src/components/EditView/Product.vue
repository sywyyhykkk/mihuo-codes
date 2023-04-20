<template>
  <div>
    <el-popover placement="right" :width="400" trigger="hover">
      <template #reference>
        <div class="product" :class="list.options.classname">
          <template v-if="list.listdata && list.listdata.length > 0">
            <div
              v-for="(item, index) in list.listdata"
              :key="index"
              class="product-item"
            >
              <div class="image">
                <img :src="$imageGlobal + item.coverImg">
              </div>
            </div>
          </template>
          <template v-else />
        </div>
      </template>
      <div style="margin: 0 20px; display: inline-block">
        <el-radio-group v-model="list.options.classname">
          <el-radio-button label="one">纵向排列</el-radio-button>
          <el-radio-button label="three">横向排列</el-radio-button>
        </el-radio-group>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
export default defineComponent({
  name: 'Product',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    const options = computed(() => props.data.options)
    const line = computed(() =>
      options.value.volumeStr && options.value.goodRatio ? '| ' : ''
    )
    return {
      options,
      list,
      line
    }
  }
})
</script>

<style lang="less" scoped>
.product {
  width: 37rem;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &.default .product-item {
    width: 100%;
  }
  &.one .product-item {
    width: 100%;
    display: flex;
    border-bottom: 1px dashed #eee;
    .image {
      overflow: hidden;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .price {
        font-size: 20px;
        margin: 0;
      }
      .num {
        margin: 12px 0 0;
      }
    }
  }
  &.three .product-item {
    width: 33.33%;
    .info .price {
      font-size: 16px;
    }
    &.product-default:nth-of-type(3) {
      display: block;
    }
  }
  .product-item {
    width: 50%;
    &.product-default:nth-of-type(3) {
      display: none;
    }
    .image {
      font-size: 0;
      img {
        max-width: 100%;
      }
    }
    .info {
      .name {
        font-weight: bold;
        font-size: 15px;
        color: #333333;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 18px;
      }
      .num {
        font-size: 12px;
        color: #d23000;
        font-weight: 600;
      }
      .price {
        font-weight: 600;
        margin: 12px 0 0;
        font-size: 18px;
        span:nth-of-type(1) {
          color: red;
        }
        span:nth-of-type(2) {
          color: #b5b5b5;
          font-weight: 400;
          font-size: 12px;
          margin-left: 4px;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>
