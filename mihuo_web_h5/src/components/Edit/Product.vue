<template>
  <div class="product-content">
    <p class="tit">商品列表 <span>（可拖动排序）</span></p>
    <el-button class="add-btn" type="primary" @click="toggleSearchPopup"><i class="el-icon-plus"></i> 添加商品</el-button>
    <template v-if="state.list.listdata && state.list.listdata.length > 0">
      <vuedraggable
        v-model="state.list.listdata"
        tag="ul"
        draggable="li"
        v-if="state.list.listdata && state.list.listdata.length > 0"
        class="list"
      >
        <li
          class="item"
          v-for="(item, index) in state.list.listdata"
          :key="index"
        >
          <img :src="item.productImg">
          <i class="el-icon-error" @click="deleteItem(index)"></i>
        </li>
      </vuedraggable>
    </template>

    <div class="options">
      <el-form label-width="9rem">
        <template v-for="(key, val, index) in state.options">
          <el-form-item :label="key" :key="index" v-if="state.loadingOption">
            <el-switch
              v-model="state.list['options'][val]"
              :name="val"
              @change="optionsChange(val, $event)"
            ></el-switch>
          </el-form-item>
        </template>
      </el-form>
    </div>

    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false"  title="添加商品" v-model="state.show" @close="close">
      <el-form label-width="100px">
        <el-form-item label="选择商品">
          <el-select
            v-model="state.selectProduct"
            filterable
            remote
            reserve-keyword
            placeholder=""
            :remote-method="searchProductList"
            @change="addProduct"
            :loading="state.loading"
          >
            <el-option
              v-for="item in state.productList"
              :key="item.productId"
              :label="item.productName"
              :value-key="item.productName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
// import { searchProduct } from '@/api/pageDecoration.js'
import {defineComponent, reactive} from "vue";
import {VueDraggableNext} from 'vue-draggable-next';

export default defineComponent({
  name: 'Product',
  components: {
    vuedraggable: VueDraggableNext
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    className:{

    }
  },
  setup(props,{emit}) {
    let state = reactive({
      list: {},
      productList: [],
      loading: false,
      show: false,
      selectItem: null,
      selectProduct: '',
      options: {
        originalPrice: '划线价',
        goodRatio: '好评率',
        volumeStr: '销量数'
      },
      loadingOption: false
    });
    state.list = props.data;
    console.log(props.data);
    if (!state.list.tabType) {
      emit("changetab", 2);
    }

    // 默认开启所有选项
    for (let key in state.options) {
      if (state.options[key] == undefined) {
        state.list.options[key] = true;
      }
    }
    state.loadingOption = true;
    const optionsChange=(key, result)=> {
      state.list.options[key]=result;
    };
    const deleteItem=(index)=> {
      state.list.listdata.splice(index, 1);
    };
    // 搜索商品
    const searchProductList=(productName)=> {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      state.productList = productList;
    };
    const toggleSearchPopup=()=> {
      state.show = true;
    };
    const close=()=> {
      state.show = false;
      state.selectItem = null;
      state.selectProduct = '';
    };
    const confirm=()=>{
      state.list.listdata.push(state.selectItem);
      close();
    };
    const addProduct=(data)=> {
      state.selectItem = data;
    };
    return {
      state,
      optionsChange,
      deleteItem,
      searchProductList,
      confirm,
      toggleSearchPopup,
      close,
      addProduct
    };
  }
});
// 模拟产品列表
let productList = [{
  "productId": 3601,
  "productName": "驼大大新疆正宗骆驼奶粉初乳骆驼乳粉蓝罐礼盒装120g*4罐",
  "productImg": "https://img.quanminyanxuan.com/excel/f6860885547648d9996474bbf21fdca9.jpg",
  "productPrice": 299,
  "originalPrice": 598,
  "volumeStr": "741",
  "goodRatio": 98
}, {
  "productId": 3268,
  "productName": "百合28件套新骨质瓷餐具",
  "productImg": "https://img.quanminyanxuan.com/excel/185e7365f65543f2b4ebc67036d6a78f.jpg",
  "productPrice": 370,
  "originalPrice": 1388,
  "volumeStr": "400",
  "goodRatio": 99
}, {
  "productId": 3343,
  "productName": "和商臻品槐花蜜250克/瓶",
  "productImg": "https://img.quanminyanxuan.com/excel/4626c8c628d04935b0262d04991416b2.jpg",
  "productPrice": 34.5,
  "originalPrice": 72,
  "volumeStr": "258",
  "goodRatio": 98
}, {
  "productId": 3330,
  "productName": "鲍参翅肚浓羹350g袋装",
  "productImg": "https://img.quanminyanxuan.com/excel/58a0c968dc7d42c3ac21e09d1862aa6f.jpg",
  "productPrice": 75,
  "originalPrice": 128,
  "volumeStr": "258",
  "goodRatio": 98
},];
</script>

<style lang="less">
.product-content {
  .tit {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin: 18px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .add-btn {
    width: calc(100% - 30px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 5px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    margin: 0;

    .item {
      width: 70px;
      height: 70px;
      border-radius: 6px;
      margin: 4px;
      position: relative;
      transition: all .3s;
      list-style: none;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }

      i {
        position: absolute;
        top: -6px;
        right: -6px;
        cursor: pointer;
        opacity: 0;
        transition: all .3s;
        color: red;
      }

      &::before {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(0, 0, 0, .4);
        border-radius: 4px;
        opacity: 0;
        transition: all .3s;
      }

      &:hover {
        cursor: grab;

        &::before, i {
          opacity: 1;
        }
      }
    }
  }

  .options {
    padding: 15px;
    border-radius: 6px;

    .el-form {
      background: #f7f8f9;
      overflow: hidden;
      padding: 10px 0;

      .el-form-item {
        margin: 0;

        label {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
