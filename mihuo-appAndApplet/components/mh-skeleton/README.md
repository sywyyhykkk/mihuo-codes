
## 属性说明

|属性名|类型|默认值|说明|
| -- | -- | --|--|
| titleMarginTop | number | 距离顶部的距离|
| imgTitleHeight | number | 轮播图或者图片高度 |
| openFlex | boolean | 是否开启左右布局 |
| loading | Boolean | true | 是否显示占位图 |
| flexType | String | flex-start | 排列方式 center	居中	√		space-between	两端对齐	√		space-around	子元素拉手分布	√		flex-start	居左		flex-end	居右 |
| imgTitle | Boolean | false | 轮播图占位图 |
| showAvatar | Boolean | true | 是否显示头像占位图 |
| nameRow | Number | 1 | 显示头像圆1个 |
| avatarSize | String | 50px | 头像站占位图大小 |
| avatarShape | String | round | 头像形状，可选值：round, square |
| showTitle | Boolean | true | 是否显示标题占位图 |
| titleWidth | String | 40% | 标题占位图宽度 |
| row | Number|  3 | 标题段落占位图行数 |
| animate | Boolean | true | 是否开启动画 |

## 使用示例

```html
<skeleton
  :loading="loading"
  :avatarSize="skeleton1.avatarSize"
  :row="skeleton1.row"
  :showTitle="skeleton1.showTitle"
>
  <view class="section-content">我是段落1</view>
</skeleton>
```

```javascript
import Skeleton from '../components/skeleton/index.vue'
export default {
  components: {
    Skeleton
  },
  data() {
    return {
      loading: true,
      skeleton1 : {
        avatarSize: '52px',
        row: 3,
        showTitle: true,
      }
    }
  },
  created() {
    this.reloadData()
  },
  methods: {
    reloadData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
    },
  },
}
```

