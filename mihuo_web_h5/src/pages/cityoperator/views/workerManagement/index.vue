<template>
  <el-container>
    <el-header class="btn-left">
      <el-input
        v-model="searchParams.realName"
        clearable
        :prefix-icon="Search"
        placeholder="请输入姓名查询"
      />
      <el-input
        v-model="searchParams.phone"
        clearable
        :prefix-icon="Search"
        placeholder="请输入电话号码查询"
        oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
        maxlength="11"
      />
      <el-select v-model="searchParams.userauthFlag" placeholder="是否实名">
        <el-option label="是" :value="1" />
        <el-option label="否" :value="0" />
      </el-select>
      <!-- 标记、拉黑功能搬运到平台端 -->
      <!--      <el-checkbox-->
      <!--        v-model="searchParams.innerFlag"-->
      <!--        label="标记为内部用户"-->
      <!--        :true-label="1"-->
      <!--        :false-label="0"-->
      <!--        size="large"-->
      <!--      />-->
      <!--      <el-checkbox-->
      <!--        v-model="searchParams.blacklistFlag"-->
      <!--        label="已拉黑"-->
      <!--        :true-label="1"-->
      <!--        :false-label="0"-->
      <!--        size="large"-->
      <!--      />-->
      <el-button
        type="primary"
        icon="Search"
        style="margin-left: 2rem"
        @click="search"
      >查询</el-button>
      <el-button icon="RefreshLeft" @click="reset">重置</el-button>
    </el-header>

    <el-main>
      <el-table
        :loading="tableDataLoading"
        :data="tableData"
        border
        style="width: 100%; height: calc(100vh - 25rem) !important"
        height="0"
        :header-cell-style="{ 'text-align': 'center', height: '5rem' }"
        row-key="id"
        :span-method="arraySpanMethod"
        :cell-style="cellStyle"
        :tree-props="{ children: 'personList', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column
          label="工种"
          width="200"
          header-align="center"
          style="height: 2rem"
        >
          <template #default="scope">
            <span
              v-if="!scope.row.personId"
              class="person-info"
              :style="!scope.row.personList?.length ? 'margin-left: 15px' : ''"
            >
              <span>姓名：{{ scope.row.realName }}</span>
              <span>电话：{{ scope.row.phone }}</span>
              <span>是否实名：{{
                scope.row.userauthFlag ? '已实名' : '未实名'
              }}</span>
              <!--              <span style="color: #eba555" @click="handleUser(scope.row, 1)">-->
              <!--                <el-icon color="#606266"><EditPen /></el-icon>-->
              <!--                {{ scope.row.innerFlag ? '取消内部用户' : '标记为内部用户' }}-->
              <!--              </span>-->
              <!--              <span-->
              <!--                style="color: #da290f"-->
              <!--                @click="handleUser(scope.row, 2)"-->
              <!--              >{{ scope.row.blacklistFlag ? '取消' : '' }}拉黑</span>-->
            </span>
            <span v-else>{{ scope.row.skillName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="从业年限" prop="skillYearNum" align="center">
          <template #default="scope">
            <span>{{ scope.row.skillYearNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作类型" prop="workType" align="center">
          <template #default="scope">
            <span>{{
              scope.row.workType == '0'
                ? '兼职'
                : scope.row.workType == '1'
                  ? '全职'
                  : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="资格证书"
          prop="certificateImage"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 100%; height: 6rem"
              fit="cover"
              preview-teleported
              lazy
              :src="
                $getUrl.getPicUrl(
                  getImg(scope.row.certificateImage).url,
                  true
                )[0]
              "
              :preview-src-list="getImg(scope.row.certificateImage).images"
            />
          </template>
        </el-table-column>
        <el-table-column label="自我介绍" prop="selfIntroduce" align="center" />
        <el-table-column label="审核状态" prop="auditStatus" align="center">
          <template #default="scope">
            <el-tag
              v-if="scope.row.auditStatus == 0"
              type="warning"
            >待审核</el-tag>
            <el-tag
              v-if="scope.row.auditStatus == 1"
              type="danger"
            >未通过</el-tag>
            <el-tag
              v-if="scope.row.auditStatus == 2"
              type="success"
            >已通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="可接单" prop="orderStatus" align="center">
          <template #default="scope">
            <span>{{
              scope.row.orderStatus == 1
                ? '可接单'
                : scope.row.orderStatus == 2
                  ? '不可接单'
                  : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上季度等级"
          prop="settlementLevelName"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.settlementLevelName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上季度积分"
          prop="settlementIntegral"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.settlementIntegral }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前等级" prop="levelName" align="center" />
        <el-table-column label="当前积分" prop="integral" align="center">
          <template #default="scope">
            <span
              v-if="scope.row.integral"
              class="integral"
              @click="integralDetails(scope.row.personId)"
            >{{ scope.row.integral }}分</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后修改时间"
          prop="updateTime"
          width="160"
          align="center"
        />
        <el-table-column
          label="最后操作时间"
          prop="createTime"
          width="160"
          align="center"
        />
        <el-table-column label="最后操作者" prop="createBy" align="center" />
        <el-table-column
          label="操作"
          width="230"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="edits(scope.row, '等级变更')"
            >等级变更</el-button>
            <el-button
              type="text"
              @click="edits(scope.row, '积分变更')"
            >积分变更</el-button>
            <el-button type="text" @click="edits(scope.row, '修改审核')">{{
              scope.row.auditStatus == 2 ? '修改审核' : '审核'
            }}</el-button>
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
    </el-main>
    <el-dialog
      v-model="gradeVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="formType"
      width="35rem"
    >
      <el-form
        v-if="formType === '等级变更'"
        ref="gradeFormRef"
        :model="gradeForm"
        :rules="gradeRules"
        label-width="11rem"
      >
        <el-form-item label="工匠等级">
          <el-select v-model="gradeForm.levelName" placeholder="请选择">
            <el-option
              v-for="item in grades"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form
        v-if="formType === '修改审核'"
        ref="gradeFormRef"
        :model="auditForm"
        :rules="auditRules"
        label-width="1rem"
      >
        <el-form-item label="">
          <div>审核意见</div>
          <el-input
            v-model="auditForm.auditRemark"
            placeholder="请输入审核意见"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio :label="1">审核未通过</el-radio>
            <el-radio :label="2">审核通过</el-radio>
          </el-radio-group>
          <el-switch
            v-model="auditForm.orderStatus"
            style="margin-left: 2rem"
            :active-value="1"
            :inactive-value="2"
          />
          <span style="margin-left: 1rem">可接单</span>
        </el-form-item>
      </el-form>

      <el-form
        v-if="formType === '积分变更'"
        ref="integralFormRef"
        :model="integralForm"
        :rules="integralRules"
        label-width="11rem"
      >
        <el-form-item label="积分" prop="ruleType">
          <el-radio-group
            v-model="integralForm.ruleType"
            @change="changeRuleType"
          >
            <el-radio :label="1" size="large">加分</el-radio>
            <el-radio :label="0" size="large">扣分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="integralForm.ruleType == 0 ? '处罚积分' : '奖励积分'"
          prop="integral"
        >
          <el-input
            v-model="integralForm.integral"
            type="number"
            oninput="value=value.replace(/^0|(-[1-9][0-9]*)/g, '').replace('.','')"
          >
            <template #append>分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="规则分类" prop="ruleCategory">
          <el-select
            v-model="integralForm.ruleCategory"
            filterable
            :filter-method="dataFilter"
            placeholder="请选择"
            @change="changeRule"
          >
            <el-option
              v-for="item in ruleTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="行为标题" prop="name">
          <el-select
            v-model="integralForm.name"
            filterable
            :filter-method="dataFilter"
            placeholder="请选择或输入"
            allow-create
            @change="changeRuleTitle"
          >
            <el-option
              v-for="item in ruleTitleList"
              :key="item.ruleId"
              :label="item.name"
              :value="item.ruleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="行为描述" prop="content">
          <el-input v-model="integralForm.content" type="text" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm()">确 认</el-button>
          <el-button @click="gradeVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 积分记录 -->
    <el-dialog
      v-model="integralVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="积分记录"
      width="110rem"
    >
      <div style="height: 70vh; margin-top: 2rem">
        <el-table
          :loading="tableDataLoading"
          :data="integralData"
          border
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%; height: calc(60rem) !important"
          height="0"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column
            label="行为标题"
            prop="name"
            header-align="center"
          />
          <el-table-column label="行为描述" prop="content" />
          <el-table-column label="积分（分）" prop="integral" />
          <el-table-column label="创建时间" prop="created" />
        </el-table>
      </div>

      <!-- <el-pagination-new
        small
        style="position: absolute !important; bottom: 2rem"
        :hide-on-single-page="false"
        :current-page="currentPage2"
        :page-size="pagesize2"
        :total="total2"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange2"
      /> -->
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, toRefs, watch } from 'vue'
import { fetch } from '@/components/util/axios-config/axios'
import { async } from '@antv/x6/lib/registry/marker/main'
import { ElMessage, ElMessageBox } from 'element-plus'
import { imageGlobal } from '@/global'
import { valid } from 'mockjs'

export default defineComponent({
  name: '工人管理',
  setup() {
    const integralFormRef = ref<any>('')
    const gradeVisible = ref<boolean>(false)
    const integralVisible = ref<boolean>(false)
    const tableDataLoading = ref<boolean>(false)
    const formType = ref<string>('')
    const state = reactive({
      ruleTypeList: [],
      ruleTitleList: [],
      tableData: [],
      integralData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      currentPage2: 1,
      total2: 0,
      pageSize2: 10,
      gradeForm: {} as any,
      auditForm: { orderStatus: 1 } as any,
      integralForm: { ruleType: 0 } as any,
      grades: [
        { name: '新手', value: 1 },
        { name: '新秀', value: 2 },
        { name: '精英', value: 3 },
        { name: '明星', value: 4 },
        { name: '大师', value: 5 },
        { name: '王者', value: 6 }
      ],
      searchParams: {} as any
    })

    const integralRules = reactive({
      name: [{ required: true, message: '请输入行为标题', trigger: 'change' }],
      integral: [{ required: true, message: '请输入积分', trigger: 'change' }],
      ruleType: [
        { required: true, message: '请选择积分类型', trigger: 'change' }
      ]
    })

    const setUser = async (userId: any, type: number) => {
      await fetch({
        url: '/admin/user/editUser',
        method: 'post',
        data: {
          type: type,
          userId: userId
        }
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('操作成功')
          getData()
        }
      })
    }
    const handleUser = async (row: any, type: number) => {
      if (!row.userId) {
        return ElMessage.warning('用户信息异常')
      }
      // type 1->标记内部用户；2->拉黑
      if (type == 1) {
        if (row.innerFlag == 0) {
          setUser(row.userId, type)
        } else {
          // 取消标记为内部用户
          ElMessageBox.confirm(`是否确定要取消标记为内部用户?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((res) => {
            setUser(row.userId, type)
          })
        }
      } else {
        if (row.blacklistFlag == 0) {
          setUser(row.userId, type)
        } else {
          ElMessageBox.confirm(`是否确定要取消拉黑用户?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((res) => {
            setUser(row.userId, type)
          })
        }
      }
    }

    const getDntegralRecord = async (personId: any) => {
      tableDataLoading.value = true
      await fetch({
        url: '/basic/basicrewardruledetail/getRuleDetailList',
        method: 'get',
        params: {
          personId: personId
          // ruleType: state.integralForm.ruleType
        }
      })
        .then((res: any) => {
          if (res.code == 0) {
            state.integralData = res.data
            tableDataLoading.value = false
          }
        })
        .finally(() => {
          tableDataLoading.value = false
        })
    }

    const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
      if (columnIndex === 0) {
        return { height: '5rem' }
      }
    }

    const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
      if (row.personList || !row.personId) {
        if (columnIndex === 0) {
          return [1, 15]
        } else if (columnIndex > 0) {
          return [0, 0]
        }
      }
    }

    const dataFilter = (val: string) => {
      const value = val.replace(/\s*/g, '')
      if (value) {
        // 去除筛选条件的空格筛选数组
        const list = state.ruleTypeList
        state.ruleTypeList = list.filter((item: any) => {
          if (
            !!~item.skillName.indexOf(value) ||
            !!~item.skillName.toUpperCase().indexOf(value.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        // val为空时，还原数组
        getRuleTypeList()
      }
    }

    // 选择分类规则
    const changeRule = (val: any) => {
      getRuleTitle()
    }
    // 选择行为标题
    const changeRuleTitle = (val: any) => {
      state.ruleTitleList.map((item: any) => {
        if (item.ruleId == val) {
          state.integralForm.content = item.content
          state.integralForm.ruleCode = item.ruleCode
        }
      })
    }

    // 获取分类下的行为标题
    const getRuleTitle = async () => {
      await fetch({
        url: '/basic/basicrewardrule/page',
        method: 'get',
        params: {
          type: 2,
          size: 99999,
          ruleCategory: state.integralForm.ruleCategory,
          ruleType: state.integralForm.ruleType
        }
      }).then((res: any) => {
        if (res.code == 0) {
          state.ruleTitleList = res.data.records
        }
      })
    }

    // 获取规则分类
    const getRuleTypeList = async () => {
      await fetch({
        url: '/basic/basicrewardrule/getRuleCategoryInfo',
        method: 'get',
        params: {
          type: 2,
          clientId: -1,
          ruleCategory: state.integralForm.ruleCategory,
          ruleType: state.integralForm.ruleType
        }
      }).then((res: any) => {
        if (res.code == 0) {
          state.ruleTypeList = res.data
          getRuleTitle()
        }
      })
    }

    const changeRuleType = () => {
      getRuleTypeList()
    }

    const getImg = (imgList: any) => {
      if (!imgList) return ''
      let images = []
      let url
      try {
        const arr = JSON.parse(imgList)
        images = arr.map((item: { url: any }) => imageGlobal + item.url)
        url = arr[0].url
      } catch (e) {
        imgList.split(',').forEach((item: string) => {
          images.push(imageGlobal + item)
        })
        url = images[0]
      }
      return { url, images }
    }

    // 积分记录
    const integralDetails = (personId: any) => {
      getDntegralRecord(personId)
      integralVisible.value = true
    }

    // 等级变更
    const edits = (row: any, type: string) => {
      formType.value = type
      gradeVisible.value = true
      switch (formType.value) {
        case '等级变更':
          state.gradeForm = row
          break
        case '积分变更':
          state.integralForm.integral = row.integral
          state.integralForm.personId = row.personId
          if (row.integral < 0) {
            state.integralForm.ruleType = 0
          } else {
            state.integralForm.ruleType = 1
          }
          getRuleTypeList()
          break
        case '修改审核':
          state.auditForm = row
          break
      }
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    const handleCurrentChange2 = (val: number) => {
      state.currentPage2 = val
      // getData()
    }

    const reset = () => {
      state.searchParams.realName = ''
      state.searchParams.phone = ''
      state.searchParams.userauthFlag = null
      state.searchParams.innerFlag = 0
      state.searchParams.blacklistFlag = 0
      getData()
    }

    const search = () => {
      getData()
    }

    const getData = async () => {
      tableDataLoading.value = true
      await fetch({
        url: '/basic/skillconfig/getSimplePersonInfo',
        method: 'post',
        data: {
          page: {
            current: state.currentPage,
            size: state.pageSize
          },
          ...state.searchParams
        }
      })
        .then((res: any) => {
          if (res.code == 0) {
            res.data.records.map((item: any, index: number) => {
              item['id'] = item.userId
              item.personList?.map((item2: any, i: number) => {
                item2['id'] = item2.userId + '-' + i
              })
            })
            state.tableData = res.data.records || []
            state.total = res.data.total
            tableDataLoading.value = false
          }
        })
        .finally(() => {
          tableDataLoading.value = false
        })
    }

    const confirm = () => {
      switch (formType.value) {
        case '等级变更':
        case '积分变更':
          confirmEdit()
          break
        case '修改审核':
          audit()
          break
      }
    }

    // 修改
    const confirmEdit = async () => {
      if (formType.value === '积分变更') {
        await integralFormRef.value.validate((valid: any) => {
          if (valid) {
            editSave()
          }
        })
      } else {
        editSave()
      }
    }

    const editSave = async () => {
      let params = {}
      if (formType.value === '等级变更') {
        params = {
          level: state.gradeForm.levelName,
          personId: state.gradeForm.personId
        }
      } else {
        params = {
          content: state.integralForm.content,
          integral:
            state.integralForm.ruleType == 0
              ? ~parseFloat(state.integralForm.integral)
              : parseFloat(state.integralForm.integral),
          personId: state.integralForm.personId,
          ruleCode: state.integralForm.ruleCode,
          title: state.integralForm.name
        }
      }
      await fetch({
        url: '/basic/skillconfig/modifyPersonInfo',
        method: 'post',
        data: params
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('操作成功')
          gradeVisible.value = false
          getData()
        }
      })
    }

    // 审核
    const audit = async () => {
      await fetch({
        url: '/admin/person/skillaudit',
        method: 'post',
        data: {
          auditRemark: state.auditForm.auditRemark,
          auditStatus: state.auditForm.auditStatus,
          orderStatus: state.auditForm.orderStatus,
          personId: state.auditForm.personId
        }
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success(res.data)
          gradeVisible.value = false
          getData()
        }
      })
    }

    watch(
      () => gradeVisible.value,
      (newv: boolean) => {
        if (newv) {
          if (integralFormRef.value && integralFormRef.value) {
            integralFormRef.value.resetFields()
          }
        }
      }
    )

    onMounted(() => {
      getData()
    })

    return {
      setUser,
      handleUser,
      tableDataLoading,
      getDntegralRecord,
      changeRuleType,
      changeRuleTitle,
      changeRule,
      getRuleTypeList,
      cellStyle,
      integralFormRef,
      confirmEdit,
      audit,
      arraySpanMethod,
      getImg,
      integralRules,
      formType,
      gradeVisible,
      integralVisible,
      handleCurrentChange,
      handleCurrentChange2,
      integralDetails,
      confirm,
      edits,
      reset,
      search,
      getData,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.btn-left {
  display: flex;
  align-items: flex-end;
  .el-input,
  .el-select {
    width: 20rem;
    margin-right: 2rem;
  }
}
.rowClassName {
  height: 1rem;
}
.rowClassName2 {
  height: 3rem;
}
.person-info {
  span {
    display: inline-block;
    width: 200px;
  }
}
.integral {
  color: #2500d9;
  text-decoration: underline #2500d9;
}

:deep(.el-dialog__body) {
  padding: 0 4rem;
}
</style>
