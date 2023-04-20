<template>
  <div>
    <el-card shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          size="small"
          type="primary"
          icon="Search"
          @click="handleSearchList()"
        >
          查询
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          size="small"
          icon="refreshLeft"
          @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          ref="listQueryForm"
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="榜单分类">
            <el-select
              v-model="listQuery.type"
              placeholder="请选择分类"
              clearable
            >
              <el-option
                v-for="item in rankOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets" />
        <span>数据列表</span>
      </div>
      <el-button
        class="btn-add"
        type="primary"
        size="mini"
        style="float: right"
        @click="addBanner"
      >
        <!-- v-if="$getPression('mall_smsworkertiptop_add')" -->
        添加榜单
      </el-button>
    </el-card>
    <div>
      <el-table
        v-loading="loading"
        stripe
        style="width: 100%"
        :data="tableData"
        border
        :height="tableHeight"
      >
        <el-table-column
          label="排名" prop="rank"
          align="center"
        />
        <el-table-column label="榜单类型" align="center">
          <template #default="scope">
            {{
              scope.row.type === 1
                ? '设计榜'
                : scope.row.type === 2
                  ? '管家榜'
                  : scope.row.type === 3
                    ? '监理榜'
                    : '工人榜'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名" prop="name"
          align="center"
        />
        <el-table-column
          label="工种类型" prop="skillName"
          align="center"
        />
        <el-table-column
          label="工种等级" prop="level"
          align="center"
        />
        <el-table-column
          v-if="type === '2'"
          label="财富值"
          prop="money"
          align="center"
        />
        <el-table-column label="头像" align="center">
          <template #default="scope">
            <el-image
              preview-teleported
              :src="$getUrl.getPicUrl(scope.row.avatar, true, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.avatar)"
              style="height: 80px; width: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === '1'"
          label="信任指数"
          prop="trustScore"
          align="center"
        />
        <el-table-column
          label="操作" fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              size="mini" @click="handleUpdateBanner(scope.row)"
            >编辑
              <!-- v-if="$getPression('mall_smsworkertiptop_edit')" -->
            </el-button>
            <el-button size="mini" @click="handleDeleteBanner(scope.row)" >
              <!-- v-if="$getPression('mall_smsworkertiptop_del')" -->
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="addBannerShow"
      v-model="addBannerShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit === true ? '编辑榜单' : '添加榜单'"
    >
      <div style="height: 70vh; overflow-y: scroll">
        <AddRank
          :is-edit="isEdit"
          :row="selectedRow"
          :type="type"
          @hideDialog="hideDialog"
          @getData="getData"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect
} from 'vue'

import { getDataList, delObj } from '../util/api/rank'
import { getDataList2, delObj2 } from '../util/api/incomeRank'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddRank from './addRank.vue'

export default defineComponent({
  components: { AddRank },
  props: ['type'],
  setup(props) {
    const addBannerShow = ref<boolean>(false)
    const isEdit = ref<boolean>(false)
    const tableHeight = ref<any>(0)
    const listQueryForm = ref()
    const state = reactive<any>({
      type: props.type,
      tableData: [],
      form: {},
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: true,
      rankOptions: [
        {
          value: 1,
          label: '设计榜'
        },
        {
          value: 2,
          label: '管家榜'
        },
        {
          value: 3,
          label: '监理榜'
        },
        {
          value: 4,
          label: '工人榜'
        }
      ],
      selectedRow: {},
      listQuery: {
        type: 1
      }
    })

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 330
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      addBannerShow.value = false
      if (state.type === '1') {
        await getDataList({
          size: state.pageSize,
          current: state.currentPage,
          ...state.listQuery
        }).then((res) => {
          state.tableData = res.data.records
          state.total = res.data.total
          state.loading = false
        })
      } else {
        await getDataList2({
          size: state.pageSize,
          current: state.currentPage,
          ...state.listQuery
        }).then((res: any) => {
          state.tableData = res.data.records
          state.total = res.data.total
          state.loading = false
        })
      }
    }

    const addBanner = () => {
      state.selectedRow = {}
      isEdit.value = false
      addBannerShow.value = true
    }

    const hideDialog = () => {
      addBannerShow.value = false
    }

    const handleUpdateBanner = (row: any) => {
      isEdit.value = true
      addBannerShow.value = true
      state.selectedRow = row
    }

    const handleDeleteBanner = async (row: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (state.type === '1') {
          await delObj(row.id).then((res) => {
            ElMessage.success('删除成功')
            getData()
          })
        } else {
          await delObj2(row.id).then((res: any) => {
            ElMessage.success('删除成功')
            getData()
          })
        }
      })
    }

    const handleCurrentChange = (val: number) => {
      if (val) {
        state.currentPage = val
        getData()
      }
    }

    const handleSearchList = () => {
      getData()
    }

    const handleResetSearch = () => {
      unref(listQueryForm).resetFields()
      state.listQuery.type = 1
      getData()
    }

    return {
      tableHeight,
      listQueryForm,
      addBannerShow,
      isEdit,
      getData,
      hideDialog,
      handleDeleteBanner,
      handleSearchList,
      handleResetSearch,
      handleCurrentChange,
      handleUpdateBanner,
      addBanner,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.operate-container {
  justify-content: space-between;

  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }
}

.m-container-footer {
  text-align: right;
  margin-top: 25px;
}
</style>
