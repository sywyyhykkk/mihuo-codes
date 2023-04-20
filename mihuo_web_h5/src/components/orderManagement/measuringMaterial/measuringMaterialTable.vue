<template>
  <div style="padding-top: 2rem">
    <el-table
      v-loading="loading"
      style="width: 100%; height: calc(100vh - 32rem) !important"
      :height="'0'"
      :data="state.tableData"
      border
      row-key="id"
      :fit="false"
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
    >
      <el-table-column label="材料名称" align="left" prop="address" width="300">
        <template #default="scope">
          <span v-if="scope.row.children" class="tree-title">
            {{ scope.row.address }}
          </span>
          <span v-else> {{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="应用区域"
        align="center"
        prop="areaName"
        width="150"
      />
      <el-table-column label="图片" align="center" prop="skillName" width="130">
        <template #default="scope">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 10rem;
            "
          >
            <el-image
              preview-teleported
              lazy
              style="height: 9rem; width: 9rem"
              :src="$getUrl.getPicUrl(scope.row.productPic, true)"
              :preview-src-list="$getUrl.getPicUrl(scope.row.productPic)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="规格"
        align="center"
        prop="productAttr"
        width="200"
      >
        <template #default="scope">
          {{ getSkuData(scope.row.productAttr) }}
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        align="center"
        prop="productQuantity"
        width="100"
      />
      <el-table-column
        label="供应商"
        align="center"
        prop="supplierName"
        width="150"
      />
      <!--      <el-table-column label="备注" align="center" prop="" width="200" />-->
      <el-table-column label="测量情况" align="" prop="skillName" width="300">
        <template #default="scope">
          <div style="margin: 0 -10px">
            <div
              v-for="(item, index) in scope.row.measureStatus"
              style="align-items: start"
            >
              <div
                v-if="
                  scope.row.measureStatus.length == 1 &&
                  item.measureStatus == '1'
                "
                class="success-measure"
                style="height: 10rem; border: none"
              >
                <span
                  style="display: flex; align-items: center"
                  @click="handelClick(item, index, scope.row)"
                >
                  <el-icon size="1.2rem"><Tickets /></el-icon>
                  <span class="survey-name">{{ item.surveyName }}</span>
                </span>
                <el-icon color="#3BCE4A" size="1.3rem">
                  <CircleCheckFilled />
                </el-icon>
              </div>
              <div
                v-else
                :class="
                  item.measureStatus == '1' ? 'success-measure' : 'info-measure'
                "
                :style="
                  index + 1 == scope.row.measureStatus.length
                    ? 'border:none'
                    : ''
                "
              >
                <span
                  style="display: flex; align-items: center"
                  @click="handelClick(item, index, scope.row)"
                >
                  <el-icon size="1.2rem"><Tickets /></el-icon>
                  <span class="survey-name">{{ item.surveyName }}</span>
                </span>
                <el-icon
                  color="#3BCE4A"
                  size="1.3rem"
                  v-if="item.measureStatus == '1'"
                >
                  <CircleCheckFilled />
                </el-icon>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100">
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.measureStatus"
            style="align-items: start; margin: 0 -10px"
          >
            <div
              class="info-measure"
              :style="
                index + 1 == scope.row.measureStatus.length
                  ? 'border:none;justify-content: center;'
                  : 'justify-content: center;'
              "
            >
              <el-button
                type="text"
                icon="edit"
                v-if="!scope.row.children"
                :class="item.measureStatus == '1' ? 'info' : 'confirm'"
                @click="handelClick(item, index, scope.row)"
              >
                测量
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination-new
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />

    <surveyPreview
      v-model="surveyPreviewShow"
      :surveyId="state.surveyId"
      :disabled="surveyDisabled"
      :data="state.surveyanswer"
      :surveyName="state.surveyName"
      @saveSurvey="saveSurvey"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, inject, defineExpose } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const currentPage = ref<number>(1)
const total = ref<number>(0)
const pageSize = ref<number>(20)
const surveyPreviewShow = ref<boolean>(false)
const surveyDisabled = ref<boolean>(false)
const listQuery: any = inject('listQuery')
const state = reactive({
  tableData: [
    {
      label: '非法聚会喝酒'
    }
  ],
  surveyId: 0 as any, //问卷id
  surveyName: '', //问卷名称
  surveyanswer: [], //问卷答案信息
  answerParam: {} as any,
  answerForm: {
    //保存问卷的时所需的参数
    answer: {
      answerContent: '',
      id: 0,
      surveyName: '',
      surveyTemplateId: 0
    },
    id: 0,
    measureIndex: 0,
    personId: 0,
    personName: '',
    projectId: 0,
    skillId: 0,
    skillName: ''
  }
})
const saveSurvey = async (data: any) => {
  console.log(data)
  state.answerForm.answer.answerContent = JSON.stringify(data)
  await fetch({
    url: '/mall/order/setOrderItemMeasureFlag',
    method: 'post',
    data: state.answerForm
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('测量成功')
      getData()
      surveyPreviewShow.value = false
    }
  })
}

//点击测量的事件
const handelClick = (data: any, index: number, row: any) => {
  if (data.measureStatus == '1') {
    //查看问卷答案
    state.surveyId = null
    surveyDisabled.value = true
    state.answerParam = {
      businessId: row.id,
      businessKey: `${row.id}_${index + 1}`,
      type: 'product_measure'
    }
    getSurveyanswer()
  } else {
    //编辑问卷答案
    state.surveyId = data.templateId
    state.surveyName = ''
    state.surveyanswer = []
    state.answerForm.answer.surveyTemplateId = data.templateId
    state.answerForm.answer.surveyName = data.surveyName
    state.answerForm.projectId = row.projectId
    state.answerForm.measureIndex = index + 1
    state.answerForm.id = row.id
    surveyDisabled.value = false
    surveyPreviewShow.value = true
  }
}
//获取问卷答案
const getSurveyanswer = async () => {
  await fetch({
    url: '/basic/surveyanswer/list',
    method: 'get',
    params: state.answerParam
  }).then((res: any) => {
    if (res.data.length > 0) {
      state.surveyanswer = res.data[0].answerContent
        ? JSON.parse(res.data[0].answerContent)
        : []
      state.surveyName = res.data[0].surveyName
      surveyPreviewShow.value = true
    } else {
      state.surveyanswer = []
      state.surveyName = '测量'
      surveyPreviewShow.value = true
    }
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const tableRowClassName = ({ row, rowIndex }: any) => {
  if (row.children) {
    return 'warning-row'
  }
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (row.children) {
    if (columnIndex === 0) {
      return [1, 7]
    } else if (columnIndex >= 1 && columnIndex <= 6) {
      return [0, 0]
    }
  }
}
const getParse = (val: any) => {
  let data: any = []
  if (typeof val == 'string') {
    data = getParse(JSON.parse(val))
  } else {
    data = val
  }
  return data
}
//解析sku
const getSkuData = (val: any) => {
  let data: any = ''
  if (val && val != 'null') {
    getParse(val).forEach((res: any) => {
      data = `${res.key}：${res.value}`
    })
  }
  return data
}

//材料分组
const getGroupData = (data: any, filed: any) => {
  // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
  let map = {}
  // dest主要保存分组后的数据
  let dest: any = []
  data.forEach((item: any, index: any) => {
    if (!map[item[filed]]) {
      dest.push({
        id: index,
        [filed]: item[filed],
        address: `${item['address']}【${item['customerName']}】【${item['customerPhone']}】`,
        children: [item]
      })
      // 进行一次新添对象的记录
      map[item[filed]] = item
      // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
    } else {
      dest.forEach((dItem: any) => {
        if (dItem[filed] == item[filed]) {
          dItem.children.push(item)
        }
      })
    }
  })
  return dest
}
const getData = async () => {
  await fetch({
    url: '/mall/order/materialmeasure/page',
    method: 'get',
    params: {
      current: currentPage.value,
      size: pageSize.value,
      ...listQuery
    }
  }).then((res: any) => {
    total.value = res.data.total
    state.tableData = []
    state.tableData = getGroupData(res.data.records, 'projectId')
  })
}
defineExpose({ getData })
onMounted(() => {
  getData()
})
</script>

<style scoped lang="less">
.survey-name {
  font-size: 12px;
  margin-left: 0.7rem;
  color: #4c4c4c;
  max-width: 22rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.info-measure {
  height: 50px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #4c4c4c;
  padding: 0 1.5rem;
  justify-content: space-between;
}

.success-measure {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #e4e7ed;
  background: #f0f9eb;
  font-size: 12px;
  color: #4c4c4c;
  padding: 0 1.5rem;
  justify-content: space-between;
}

:deep(.el-table__cell) {
  padding: 0 !important;
}
</style>
