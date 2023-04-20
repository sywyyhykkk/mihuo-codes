<template>
  <div>
    <el-dialog
      v-model="showProductTable"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      title="选择商品"
      width="110rem"
    >
      <el-card>
        <el-select
          v-model="searchKey.companyId"
          class="searchStyle"
          filterable
          placeholder="所属企业"
        >
          <el-option
            v-for="(item, index) in companyList"
            :key="index"
            :label="item.companyName"
            :value="item.companyId"
          />
        </el-select>
        <el-input
          v-model="searchKey.keyword"
          class="searchStyle"
          placeholder="关键字、商品名称"
        />
        <el-input
          v-model="searchKey.productSn"
          class="searchStyle"
          placeholder="商品货号"
        />

        <el-select
          v-model="searchKey.publishStatus"
          class="searchStyle"
          placeholder="全部"
          clearable
        >
          <el-option
            v-for="item in publishStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchKey.verifyStatus"
          class="searchStyle"
          placeholder="全部"
          clearable
        >
          <el-option
            v-for="item in verifyStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-button
          :type="buttonType"
          size="mini"
          class="btn-add"
          icon="Search"
          @click="getData()"
        >
          查询
        </el-button>
        <el-button size="mini" icon="refreshLeft" @click="handleResetSearch()">
          重置
        </el-button>
      </el-card>
      <div style="padding-right: 2rem; height: 60vh">
        <el-table
          ref="productCateTable"
          v-loading="loading"
          stripe
          style="height: 50vh !important"
          :data="tableData"
          height="50vh"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" sortable />
          <el-table-column label="商品图片" width="120" align="center">
            <template #default="scope">
              <el-image
                preview-teleported
                lazy
                :src="$imageGlobal + scope.row.coverImg"
                :preview-src-list="$getUrl.getPicUrl(scope.row.coverImg)"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center" sortable>
            <template #default="scope">
              <p>{{ scope.row.name }}</p>
              <p>品牌：{{ scope.row.brandName }}</p>
              <p>关键字：{{ scope.row.keywords }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="价格/货号"
            align="center"
            width="200"
            sortable
          >
            <template #default="scope">
              <p>价格：￥{{ scope.row.price }}</p>
              <p>货号：{{ scope.row.productSn }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            prop="sort"
            width="60"
            align="center"
            sortable
          />
          <el-table-column
            label="销量"
            prop="sale"
            align="center"
            sortable
          />
          <el-table-column label="审核状态" width="100" align="center">
            <template #default="scope">
              <el-tag
                style="
                  margin-left: 5px;
                  margin-top: 5px;
                  background: linear-gradient(to right, #fd8e4b, #fd6d34);
                  color: white;
                "
                type="primary"
                size="mini"
                disable-transitions
              >{{
                scope.row.verifyStatus == 0
                  ? '未审核'
                  : scope.row.verifyStatus == 1
                    ? '通过'
                    : '驳回'
              }}
              </el-tag>
              <p>
                <el-button
                  type="text"
                  @click="handleShowVerifyDetail(scope.$index, scope.row)"
                >审核详情
                </el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination-new
          :current-page="currentPage"
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          style="bottom: 8rem;position: absolute"
          @current-change="handleCurrentChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm()">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, onMounted } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'
import ProductQRCode from '_c/mall/columnGroup/productQRCode.vue'

export default defineComponent({
  components: { ProductQRCode },
  props: {
    modelValue: Boolean,
    getIds: {
      type: Function,
      default: null
    }
  },
  setup(props, { emit }) {
    const state = reactive<any>({
      ids: [],
      showProductTable: props.modelValue,
      tableData: [],
      loading: false,
      currentPage: 1,
      pagesize: 10,
      total: 0,
      companyList: [],
      searchKey: {
        companyId: '',
        keyword: '',
        productSn: '',
        brandId: '',
        publishStatus: '',
        verifyStatus: '',
        productCategoryId: ''
      },
      productCateOptions: [],
      brandOptions: [],
      batchList: [],
      publishStatusOptions: [
        {
          value: 1,
          label: '上架'
        },
        {
          value: 0,
          label: '下架'
        }
      ],
      verifyStatusOptions: [
        {
          value: 2,
          label: '驳回'
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 0,
          label: '未审核'
        }
      ]
    })
    const handleResetSearch = () => {
      state.searchKey = {
        companyId: '',
        keyword: '',
        productSn: '',
        brandId: '',
        publishStatus: '',
        verifyStatus: '',
        productCategoryId: ''
      }
      getData()
    }
    const handleCancel = () => {
      state.showProductTable = false
      emit('update:modelValue', false)
    }
    const handleConfirm = () => {
      if (state.ids.length <= 0) {
        ElMessage.warning('请选择商品')
      } else {
        emit('getIds', state.ids)
        state.showProductTable = false
        emit('update:modelValue', false)
      }
    }
    const getBrandTypeList = async () => {
      await fetch({
        url: `/mall/brand/list`,
        method: 'get'
      }).then((res: any) => {
        state.brandOptions = res.data
      })
    }
    const getCompanyList = async () => {
      await fetch({
        url: '/admin/company/page',
        method: 'get',
        params: {
          size: 999,
          current: 1
        }
      }).then((res: any) => {
        state.companyList = res.data.records
      })
    }
    const getData = async () => {
      state.loading = true
      await fetch({
        url: '/mall/product/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          ...state.searchKey
        }
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const handleSelectionChange = (val: any) => {
      state.ids = []
      val.map((item: any) => {
        state.ids.push(item.id)
      })
    }
    onMounted(() => {
      getData()
      getCompanyList()
      // getBrandTypeList()
    })
    watch(
      () => props.modelValue,
      () => {
        state.ids = []
        state.showProductTable = props.modelValue
      }
    )
    watch(state, () => {
      if (!state.showProductTable) {
        emit('update:modelValue', false)
      }
    })
    return {
      getBrandTypeList,
      getCompanyList,
      getData,
      handleCancel,
      handleConfirm,
      handleCurrentChange,
      handleResetSearch,
      handleSelectionChange,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.searchStyle {
  width: 150px;
  margin-right: 10px;
}
</style>
