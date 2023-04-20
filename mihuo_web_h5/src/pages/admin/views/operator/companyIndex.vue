<template>
  <div>
    <div class="app-container">
      <el-card shadow="never">
        <el-input
          v-model="listQuery.companyName"
          style="width: 203px"
          placeholder="企业名称"
        />
        <el-button
          style="margin-left: 20px"
          class="btn-add"
          size="mini"
          icon="Search"
          :type="buttonType"
          @click="getData()"
        >
          查询
        </el-button>
      </el-card>

      <div class="department_content">
        <div class="left" style="width: 20%">
          <ul :class="[current === -1 ? 'workerClass' : 'woker-ul']" :span="24">
            <li @click="addClass({ treeCode: '' }, -1)">全部</li>
          </ul>
          <ul
            v-for="(item, index) in treeData"
            :key="index"
            :class="[current === index ? 'workerClass' : 'woker-ul']"
            :span="24"
          >
            <li @click="addClass(item, index)">{{ item.name }}</li>
          </ul>
        </div>

        <div style="width: 80%">
          <el-table
            ref="brandTable"
            v-loading="loading"
            stripe
            :data="tableData"
            style="width: 100%; margin-top: 10px"
            :height="tableHeight"
            border
            @selection-change="handleSelectionChange"
          >
            <!--            <el-table-column type="selection" width="60" align="center" />-->
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <el-table-column
              label="企业名称"
              align="center"
              prop="companyName"
            />
            <el-table-column
              label="法人"
              align="center"
              prop="legalPerson"
            />
            <el-table-column
              label="法人电话"
              align="center"
              prop="legalPhone"
            />
            <el-table-column label="企业logo" width="120" align="center">
              <template #default="scope">
                <el-image
                  preview-teleported
                  lazy
                  style="width: 100px; height: 100px"
                  :src="$getUrl.getPicUrl(scope.row.companyLogo, true)"
                  :preview-src-list="$getUrl.getPicUrl(scope.row.companyLogo)"
                />
              </template>
            </el-table-column>
            <el-table-column label="审核状态" width="120" align="center">
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
                  scope.row.auditStatus == '0'
                    ? '待审核'
                    : scope.row.auditStatus == '1'
                      ? '未通过'
                      : '已通过'
                }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              fixed="right"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="text"
                  size="mini"
                  class="danger"
                  icon="delete"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination-new
            :current-page="currentPage"
            :page-size="pagesize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="dialogTitle"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="10rem"
        >
          <el-form-item label="选择分类" prop="treeCode">
            <el-select
              v-model="form.treeCode"
              filterable
              placeholder="请选择分类"
            >
              <el-option
                v-for="(item, index) in treeData"
                :key="index"
                :label="item.name"
                :value="item.treeCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="品牌首字母">
            <el-input v-model="form.firstLetter" />
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logo">
            <uploadImage v-model="form.logo" :max-count="1" :is-edits="isEdit" />
          </el-form-item>
          <el-form-item label="品牌专区大图">
            <uploadImage
              v-model="form.bigPic"
              :max-count="1"
              :is-edits="isEdit"
            />
          </el-form-item>
          <el-form-item label="品牌故事">
            <el-input
              v-model="form.brandStory"
              placeholder="请输入内容"
              type="textarea"
              :autosize="true"
            />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="form.sort" />
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="form.showStatus">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否推荐" prop="dsType">
            <el-radio-group v-model="form.recommandStatus">
              <el-radio :label="0">不推荐</el-radio>
              <el-radio :label="1">推荐</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="品牌制造商">
            <el-radio-group v-model="form.factoryStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 设置费率 -->
      <el-dialog
        v-if="dialogVisiblePlay"
        v-model="dialogVisiblePlay"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="'设置企业支付订单费率'"
        width="55rem"
      >
        <el-form
          ref="canPlayForm"
          :model="formData.val"
          :rules="rules"
          label-width="11rem"
        >
          <el-form-item label="内部订单费率" prop="insideOrderRate">
            <el-input
              v-model="formData.val.insideOrderRate"
              type="number"
              min="0"
              max="100"
              oninput="!/^(\d+\.?)?\d{0,2}$/.test(this.value)?(this.value=this.value.substring(0, this.value.length-1)): ''"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="外部订单费率" prop="outsideOrderRate">
            <el-input
              v-model="formData.val.outsideOrderRate"
              type="number"
              min="0"
              max="100"
              oninput="!/^(\d+\.?)?\d{0,2}$/.test(this.value)?(this.value=this.value.substring(0, this.value.length-1)): ''"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="save()">确 定</el-button>
            <el-button @click="dialogVisiblePlay = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  watchEffect,
  getCurrentInstance
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'
import { fetch } from '_@/axios-config/axios'
// import uploadImage from '@/components/UploadFile/uploadImage.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'

export default defineComponent({
  components: { uploadFile },
  props: {
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    cityOperatorId: {
      type: Number || String,
      default: ''
    }
  },
  setup(props) {
    const ruleForms = ref<any>('')
    const state = reactive({
      current: -1,
      treeCode: '',
      tableType: 0,
      pageType: 0,
      treeData: [],
      tableData: [],
      loading: false,
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      pagesize: 10,
      dialogVisible: false,
      dialogVisiblePlay: false,
      dialogTitle: '',
      isEdit: false,
      cityOperatorId: '',
      listQuery: {
        companyName: ''
      }
    })
    const { proxy } = getCurrentInstance() as any
    const listcanPay:any = ref([])
    const rules = reactive({
      treeCode: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const formData = reactive({
      val: {}
    } as any)

    // 删除企业
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        deleteData(row.companyId)
      })
    }

    const getData = async () => {
      const ids:any[] = []
      const datas:any[] = []
      await fetch({
        url: '/admin/company/page',
        method: 'get',
        params: {
          size: state.pagesize,
          current: state.currentPage,
          // companyId: props.companyId,
          cityOperatorId: state.cityOperatorId,
          type: props.protType,
          companyName: state.listQuery.companyName
          // cityOperatorId:props.cityOperatorId
        }
      }).then(async(res: any) => {
        listcanPay.value = res.data.records
        state.total = res.data.total
        state.loading = false
        if (listcanPay.value.length) {
          listcanPay.value.map(async(item:any) => {
            ids.push(item.companyId)
            // await fetch({url:'/pay/platform/company/canPay',method:'get',params:{
            //   companyIds:item.companyId
            // }}).then((res:any)=>{
            //   if(res.code == 0)
            //     item.canPay = res.data[0].canPay || false
            // })
          })
        }
        if (ids.length) {
          await fetch({ url: '/pay/platform/company/canPay', method: 'get', params: {
            companyIds: ids.join(',')
          }}).then((res:any) => {
            if (res.code == 0) {
              listcanPay.value.some((item:any) => {
                res.data.forEach((v:any) => {
                  if (item.companyId == v.companyId) {
                    item.canPay = v.canPay
                  }
                })
              })
            }
          })
        }
        state.tableData = listcanPay.value
      })
    }
    // 获取是否开通企业支付
    const canPay = async(data:any) => {
      const datas = data.join(',')
      await fetch({ url: '/pay/platform/company/canPay', method: 'get', params: {
        companyIds: datas
      }}).then((res:any) => {
        if (res.code == 0) { listcanPay.value = res.data }
      })
    }
    const deleteData = async (id: any) => {
      await fetch({
        url: '/admin/company/' + id,
        method: 'delete'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const addClass = (i: any, x: number) => {
      state.loading = true
      state.current = x
      state.cityOperatorId = i.id
      getData()
    }
    const handleecommendType = async (row: any) => {
      await fetch({
        url: `/mall/brand/setRecommandStatus/${row.id}?recommandStatus=${row.recommandStatus}`,
        method: 'post'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('设置成功')
          getData()
        } else {
          ElMessage.error(res.msg)
          getData()
        }
      })
    }
    const getCityTree = async () => {
      await fetch({
        url: '/admin/cityoperator/list',
        method: 'get'
      }).then((res: any) => {
        state.treeData = res.data
      })
    }

    const getHeight = () => {
      // 获取浏览器高度并计算得到表格所用高度。
      state.tableHeight = document.documentElement.clientHeight - 220
    }
    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })
    onMounted(() => {
      getCityTree()
      getData()
    })
    return {
      rules,
      ruleForms,
      addClass,
      getData,
      deleteData,
      handleDelete,
      handleCurrentChange,
      handleecommendType,
      getCityTree,
      ...toRefs(state),
      formData
    }
  }
})
</script>

<style scoped lang="less">
.department_content {
  display: flex;
  margin-top: 10px;

  .left {
    margin-right: 20px;
    height: auto;
    background-color: white;
    border-radius: 5px;
    text-align: center;
    padding-top: 20px;

    .add {
      margin-top: 20px;
      margin-bottom: 20px;
      width: calc(100% - 40px);
      margin-left: 20px;
    }

    .custom {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-right: 10px;
    }

    .workerClass {
      color: #fd6d34;
      //background-color: yellow;
      list-style: none;
      line-height: 25px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 12px;

      li {
        cursor: pointer;
      }
    }

    .woker-ul {
      list-style: none;
      background-color: #fff;
      line-height: 25px;
      padding: 10px;
      box-sizing: border-box;
      color: #666;
      font-size: 12px;

      li {
        cursor: pointer;
      }
    }
  }
}

// :deep(.el-dialog) {
//   height: 78vh;
//   overflow: auto;
// }
</style>
