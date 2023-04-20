import Product from '@/components/EditView/Product.vue'
import Images from '@/components/EditView/Images.vue'
import Banner from '@/components/EditView/Banner.vue'
import Divider from '@/components/EditView/Divider.vue'
import Word from '@/components/EditView/Word.vue'
import MaterialLink from '@/components/EditView/MaterialLink.vue'
import Sorted from '_c/EditView/Sorted.vue'
import UnSorted from '@/components/EditView/UnSorted.vue'
import Video from '@/components/EditView/Video.vue'
import Audio from '@/components/EditView/Audio.vue'
import IconTitle from '@/components/EditView/IconTitle.vue'
import ListItem from '@/components/EditView/ListItem.vue'
import ProductItem from '_c/EditView/ProductItem.vue'
import CaseItem from '_c/EditView/CaseItem.vue'
import ImageGrid from '_c/EditView/ImageGrid.vue'
import NotInclude from '_c/EditView/NotInclude.vue'
import GridImageText from '_c/EditView/GridImageText.vue'

export const allMiniItem = {
  banner: {
    name: '轮播图',
    icon: 'el-icon-picture-outline',
    component: Banner
  },
  product: {
    name: '商品',
    icon: 'el-icon-s-goods',
    component: Product
  },
  images: {
    name: '图片',
    icon: 'el-icon-picture',
    component: Images
  },
  divider: {
    name: '分割线',
    icon: 'el-icon-minus',
    component: Divider
  },
  word: {
    name: '段落文字',
    icon: 'el-icon-reading',
    component: Word
  },
  video: {
    name: '视频',
    icon: 'el-icon-star-off',
    component: Video
  },
  audio: {
    name: '音频',
    icon: 'el-icon-star-off',
    component: Audio
  },
  unsorted: {
    name: '有序列表',
    icon: 'el-icon-magic-stick',
    component: UnSorted
  },
  sorted: {
    name: '有序列表',
    icon: 'el-icon-magic-stick',
    component: Sorted
  },
  icontitle: {
    name: '图标标题',
    icon: 'el-icon-magic-stick',
    component: IconTitle
  },
  link: {
    name: '步骤条',
    icon: 'el-icon-success',
    component: MaterialLink
  },
  listItem: {
    name: '自定义列表项',
    icon: 'el-icon-list',
    component: ListItem
  },
  productItem: {
    name: '商品列表项',
    icon: 'el-icon-list',
    component: ProductItem
  },
  caseItem: {
    name: '案例列表项',
    icon: 'el-icon-list',
    component: CaseItem
  },
  imageGrid: {
    name: '九宫格',
    icon: 'el-icon-list',
    component: ImageGrid
  },
  notInclude: {
    name: '不包含',
    icon: 'el-icon-list',
    component: NotInclude
  },
  gridImageText: {
    name: '网格图文',
    icon: 'el-icon-list',
    component: GridImageText
  }
}
