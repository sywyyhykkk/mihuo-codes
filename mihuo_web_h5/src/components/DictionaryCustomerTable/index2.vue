<template>
  <block>
    <el-container>
      <el-main>
        <el-table
          stripe
          :data="tableData"
          :height="'0'"
          style="height: calc(70vh - 19rem)!important;"
          @selection-change="handleSelectionChange"
          :highlight-current-row="checkType == 'radio'"
          border
        >
          <el-table-column
            v-if="checkType == 'checkbox'"
            type="selection"
            width="55"
          />
          <el-table-column
            type="index"
            label="序号"
            width="55"
            :align="alginItem"
          />

          <template v-for="(item, index) of tableTitle" :key="index">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || alginItem"
            >
              <template #default="scope" style="height: 100%">
                <span v-if="item.filter == 'date'">
                  {{ scope.row[item.prop] }}
                </span>
                <span v-else-if="item.filter == 'time'">
                  {{ scope.row[item.prop] }}
                </span>
                <span
                  v-else-if="item.filter == 'image' && scope.row[item.prop]"
                >
                  <img
                    :src="scope.row[item.prop]"
                    alt=""
                    style="height: 45px"
                  />
                </span>
                <span
                  v-else-if="
                    item.filter == 'dictionary' &&
                    scope.row[item.prop] &&
                    item.dictionary
                  "
                >
                  {{ item.dictionary[scope.row[item.prop]] }}
                </span>
                <!-- <span v-else-if="item.filter == 'switch'">
              <el-switch
                v-model="scope.row[item.prop]"
                @change="change(scope.row, index)"
              />
            </span> -->
                <span v-else>
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </el-table-column>
          </template>
          <!--      插槽: 操作-->
          <el-table-column
            label="操作" fixed="right"
            v-if="isHandle"
            :width="handleWidth"
            :align="alginItem"
          >
            <template #default="scope">
              <slot name="handle" :row="scope.row" :index="scope.row"></slot>
            </template>
          </el-table-column>
        </el-table
        >
      </el-main>
      <el-pagination-new
        :total="total"
        :page-size="pagesize"
        :current-page="current"
        style="position: absolute !important;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-container>
  </block>
</template>

<script>
import { valid } from 'mockjs'
import { defineComponent, ref, onMounted, reactive, unref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import Slot from '../Table/components/Slot.vue'

export default defineComponent({
  components: { Slot },
  name: 'DictionaryCustomerTable2',
  props: {
    //搜索的配置
    searchSetting: {
      type: Object,
      default: () => ({})
    },
    pagesize: {
      type: Object,
      default: 10
    },
    alginItem: {
      type: String,
      default: 'center'
    },
    total: {
      type: Number,
      default: 0
    },
    handleWidth: {
      // 操作宽度
      default: 200
    },
    isHandle: {
      // 是否有操作按钮
      type: Boolean,
      default: true
    },
    // 这里有三个值 'none' 'radio' 'checkbox'
    checkType: {
      type: String,
      default: ''
    },
    tableTitle: {
      type: Array,
      default: () => []
    }, // 表头（要展示的数据）
    dialogTitle: {
      type: String,
      default: '操作'
    },
    tableData: {
      type: Array,
      default: () => []
    }, // 数据
    height: {
      type: Number || String,
      default: 100
    }
  },
  setup(props, { emit }) {
    const form = ref({})
    const current = ref(1)
    const tableHeight = ref(0)
    const search = reactive(props.searchSetting)
    const show = ref(false)
    const loginForm = ref(null)
    const handleSizeChange = (size, currentPage) => {
      // 改变每页数量
      //emit('handleChange', pageSize, current)
    }
    const handleChecked = (row) => {
      // 单选
      if (row.isChecked) {
        tableData.map((item) => {
          if (item.id != row.id) {
            item['isChecked'] = false
          }
        })
        emit('handleChecked', row)
      } else {
        emit('handleChecked', '', row)
      }
    }
    const handleSelectionChange = (row) => {
      // 多选
      emit('handleChecked', row)
    }
    const handleCurrentChange = (currentPage) => {
      //换页
      emit('handleChange', currentPage)
    }
    const change = (row, index) => {
      // 切换开关
      emit('handleSwitch', row, index)
    }
    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      tableHeight.value = document.documentElement.clientHeight - 190
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    return {
      tableHeight,
      current,
      search,
      show,
      form,
      handleSizeChange,
      handleChecked,
      handleSelectionChange,
      handleCurrentChange,
      change
    }
  }
})
</script>

<style scoped lang="less">
.container {
  //height: calc(100vh - 22rem);
}
</style>
