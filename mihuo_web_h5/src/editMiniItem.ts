import Info from "@/components/Edit/Info.vue";
import MaterialImage from "@/components/Edit/MaterialImage.vue";
import Product from "@/components/Edit/Product.vue";
import Word from "@/components/Edit/Word.vue";
import Steps from "@/components/Edit/Steps.vue";
import MaterialRate from '@/components/Edit/MaterialRate.vue';
import Tags from '@/components/Edit/Tags.vue';
export const editItem = {
  info: {
    tit: '页面信息',
    component: Info
  },
  images: {
    tit: '图片',
    component: MaterialImage
  },
  banner: {
    tit: '轮播图',
    component: MaterialImage
  },
  product: {
    tit: '商品',
    component: Product
  },
  word: {
    tit: "段落文字",
    component: Word,
  },
  rate: {
    tit: "评分",
    component: MaterialRate
  },
  steps: {
    tit: '步骤条',
    component: Steps
  },
  tags: {
    tit: '标签',
    component: Tags
  }
};
