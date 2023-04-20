<template>
  <div>
    <el-tabs v-model="pageType" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"> </el-tab-pane>
      <el-tab-pane label="待付款" name="1"> </el-tab-pane>
      <el-tab-pane label="已付款" name="3"> </el-tab-pane>
      <el-tab-pane label="付款中" name="2"> </el-tab-pane>
      <el-tab-pane label="付款失败" name="4"> </el-tab-pane>
    </el-tabs>
    <div style="position: relative">
      <el-card class="card">
        <el-form class="container-search" ref="formRef" :model="formSearch">
          <el-form-item prop="receiverPersonName">
            <el-input clearable v-model="formSearch.receiverPersonName" placeholder="结算人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="receiverPhone">
            <el-input clearable type="number" v-model="formSearch.receiverPhone" placeholder="结算人电话"></el-input>
          </el-form-item>
          <el-form-item label="结算状态：" prop="status">
              <el-select v-model="formSearch.status" clearable placeholder="结算状态">
                  <el-option
                      v-for="item in statusType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="projectName" label="项目地址：">
            <el-input readonly v-model="formSearch.projectName" placeholder="项目地址" >
              <template #append>
                <el-button icon="LocationFilled" @click="()=>isShowProjectPicker = true"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="payDate" label="付款日期：">
            <el-date-picker
              v-model="formSearch.payDate"
              type="daterange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="(e)=>{
                formSearch.payStart= e?e[0]:'';
                formSearch.payEnd=e?e[1]:''
              }"
          />
          </el-form-item>
          <el-form-item prop="delayDate" label="应付款日期：">
            <el-date-picker
              v-model="formSearch.delayDate"
              type="daterange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="(e)=>{
                formSearch.createDelayStart= e?e[0]:'';
                formSearch.createDelayEnd= e?e[1]:''
              }"
          />
          </el-form-item>
      </el-form>
      <div class="el-card-right">
          <el-button type="primary" icon="search" @click="getData">查询</el-button>
          <el-button icon="refresh" @click="reset">重置</el-button>
      </div>
      </el-card>
      <el-table
        stripe
        ref="productAttrCateTable"
        v-loading="loading"
        :data="tableData"
        :height="'0'"
        style="height: calc(100vh - 31rem) !important"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="50" align="center" /> -->
        <el-table-column type="index" width="50" align="center" label="序号" />
        <el-table-column label="付款单编号" align="center" width="200">
          <template #default="scope">{{ scope.row.bizOrderNo }}</template>
        </el-table-column>
        <el-table-column label="结算人姓名" prop="personName" />
        <el-table-column label="结算人岗位" prop="skillName" />
        <el-table-column label="结算人联系电话" prop="personPhone" width="120" />
        <el-table-column label="订单类型" align="center">
          <template #default="scope">{{
            setType(scope.row.orderType)
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="付款岗位" align="center">
          <template #default="scope">{{ scope.row.remark }}</template>
        </el-table-column> -->
        <el-table-column label="摘要" align="center" width="200">
          <template #default="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" width="150">
          <template #default="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="应付款日期" align="center" width="150">
          <template #default="scope">{{ scope.row.presetPayTime }}</template>
        </el-table-column>
        <el-table-column label="付款金额" align="center" width="150">
          <template #default="scope">{{ scope.row.amount/100 + '元' }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">{{
            setPayStatus(scope.row.payStatus)
          }}</template>
        </el-table-column>
        <el-table-column label="付款日期" align="center" width="150">
          <template #default="scope">{{ scope.row.payTime }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button
              :disabled="scope.row.payStatus !== 'waiting'"
              type="text"
              size="mini"
              @click="handlePay(scope.row)"
            >
              付款
            </el-button>
            <!-- <el-button
              type="text"
              size="mini"
              class="danger"
              icon="delete"
              @click="handleDelete(scope.row)"
              >删除
            </el-button> -->
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

      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-if="showDialog"
        v-model="showDialog"
        :title="dialogTitle"
        @close="handleCancel"
      >
        <el-form
          ref="ruleForms"
          :model="form"
          :rules="rules"
          label-width="9rem"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="是否启用" prop="title">
            <el-radio-group v-model="form.usingFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="primary"
              :loading="loading"
              @click="handleConfirm()"
              >确 定</el-button
            >
            <el-button @click="handleCancel()">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!--选择关联项目-->
    <project-picker
      v-model="isShowProjectPicker"
      @projectPicked="projectPicked"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs,onMounted, ref } from 'vue'
import DoorModel from '_c/project/measurement/doorModel.vue'
import HouseParam from '_c/project/measurement/houseParam.vue'
import HouseInfo from '_c/project/measurement/houseInfo.vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { async } from '@antv/x6/lib/registry/marker/main'

export default defineComponent({
  components: {
    DoorModel,
    HouseInfo,
    HouseParam
  },
  setup(props) {
    const state = reactive({
      status: '',
      currentPage: 1,
      total: 0,
      pagesize: 10,
      tableData: [],
      isShowProjectPicker:false,
    })
    const statusType = ref([
      {
        name:"全部",
        value:''
      },
      {
        name:"待付款",
        value:'waiting'
      },
      {
        name:"付款中",
        value:'pending'
      },
      {
        name:"已支付",
        value:'success'
      },
      {
        name:"支付失败",
        value:'fail'
      },
    ])
    const formSearch = ref({
        receiverPersonName:'',
        receiverPhone:'',
        status : "",
        projectId : null,
        projectName : '',
        payStart:'',
        payEnd:'',
        createDelayStart:'',
        createDelayEnd:'',
    }as any)
    const formRef = ref<any>(null)
    const buttonClick = () => {
      console.log('批量支付')
    }

    const handleClick = (pane: any, ev: any) => {
      switch (pane.index) {
        case '0':
          state.status = ''
          break
        case '1':
          state.status = 'waiting'
          break
        case '2':
          state.status = 'success'
          break
        case '3':
          state.status = 'pending'
          break
        case '4':
          state.status = 'failed'
          break
      }
      getData()
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const handleSelectionChange = (val: any) => {
      // console.log('22222222222222222222222222', val)
      //   multipleSelection.value = val
    }

    const getData = async () => {
      await fetch({
        url: `/pay/tradeorder/waitingPayOrder`,
        method: 'post',
        data: {
          status: state.status,
          ...formSearch.value
        },
        params:{
          current: state.currentPage,
          size: state.pagesize,
        }
      }).then((res:any) => {
        if(res.code==0){
          state.tableData = res.data.records
          state.total = res.data.total
        }
      })
    }

    const handlePay = (data: any) => {
      ElMessageBox.confirm(
      '是否确认支付？',
      '提示',
      {
          confirmButtonText: '继续支付',
          cancelButtonText: '取消',
          type: 'warning',
          }
      )
      .then(async() => {
        await fetch({
          url: `/pay/tradeorder/appTransferExecute?bizOrderNo=${data.bizOrderNo}`,
          method: 'post'
        }).then((res: any) => {
          if (res.code == 0) {
            if(res.data.payStatus === 'FAIL'){
              ElMessage.error('付款失败')
            }else{
              ElMessage.success('付款成功')
            }
            getData()
          }
        })
      })
    }

    const setType = (type: any) => {
      //   订单类型：0-商品订单；1-服务订单 2-协作订单 3-用户订单
      switch (type) {
        case 0:
          return '商品订单'
        case 1:
          return '服务订单'
        case 2:
          return '协作订单'
        case 3:
          return '用户订单'
        default:
          return '未知订单'
      }
    }

    const setPayStatus = (type: any) => {
      switch (type) {
        case 'waiting':
          return '待付款'
        case 'success':
          return '已支付'
        case 'pending':
          return '支付中'
        case 'failed':
          return '支付失败'
        default:
          return '未知状态'
      }
    }
    const reset = () => {
      formSearch.value.projectId = null;
      formRef.value.resetFields()
      getData()
    }
    const projectPicked = (data:any) => {
      formSearch.value.projectName = data?.poiName
      formSearch.value.projectId = data?.id
    }
    onMounted(() => {
      getData()
    })

    return {
      handleSelectionChange,
      setPayStatus,
      setType,
      handlePay,
      handleCurrentChange,
      getData,
      handleClick,
      buttonClick,
      reset,
      projectPicked,
      ...toRefs(state),
      formSearch,
      formRef,
      statusType
    }
  }
})
</script>

<style scoped lang="less">
.container-search{
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    .el-form-item{
      margin: 0 !important;
      margin-bottom: 2rem !important;
    }
}
.card{
  :deep(.el-card__body){
    padding: 0 !important;
    .el-card-right{
      flex-shrink: 0 !important;
      display: flex;
    }
    .el-button{
      margin-right: 0 !important;
      line-height: 0 !important;
    }
  }
}
</style>
