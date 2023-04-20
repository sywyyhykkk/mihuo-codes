 <template>
  <el-table-column :label="label" :width="width">
    <template #default="scope">
      <el-image
        preview-teleported
        v-if="scope.row[prop]"
        :style="imageStyle"
        :src="$getUrl.getPicUrl(scope.row[prop])"
        :fit="fit"
        :preview-src-list="$getUrl.getPicUrl(scope.row[prop])"
      />
      <el-tag v-else>暂无图片</el-tag>
    </template>
  </el-table-column>
</template>
<script>
import { defaults } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'el-table-column-image',
  props: {
    fit: {
      type: String,
      default: 'contain',
    },
    type: {
      type: String,
      default: '',
    },
    imageStyle: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    width: {
      type: String || Number,
      default: 100,
    },
    imageStyle: {
      type: Object,
      default: () => ({}),
    },
    fit: {
      type: String,
      default: '',
    },
    hideOnClickModal: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
})
</script>
