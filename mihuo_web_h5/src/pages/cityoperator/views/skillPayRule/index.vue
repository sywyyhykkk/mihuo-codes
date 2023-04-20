<template>
  <div class="m-">
    <div class="table-header">
      <div class="text">存疑期设置</div>
      <div class="el-card-right">
        <el-button
          v-if="$getPression('order_bizorderdoubtperiodconfig_add')"
          type="primary"
          icon="plus"
          @click="buttonClick"
          >新增
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      stripe
      :data="tableData"
      border
      height="0"
      style="width: 100%;height: calc(100vh - 22rem) "
    >
      <el-table-column type="index" width="50" align="center" label="序号" />
      <!-- <el-table-column prop="requirementpType" label="装修类型">
        <template #default="scope">
          <span v-if="scope.row.requirementpType">{{
            { 1: '装修', 2: '维修', 3: '安装', 4: '设计', 5: '其他' }[
              scope.row.requirementpType
            ]
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="skillName" label="岗位">
        <template #default="scope">
          <span v-if="scope.row.skillName">{{ scope.row.skillName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="skillAcceptanceLimit" label="工种验收存疑天数">
        <template #default="scope">
          <span v-if="scope.row.skillAcceptanceLimit">{{
            scope.row.skillAcceptanceLimit
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="materialTemplateName" label="项目验收存疑天数">
        <template #default="scope">
          <span v-if="scope.row.projectAcceptanceLimit">{{
            scope.row.projectAcceptanceLimit
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template #default="scope">
          <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="scope">
          <span
            v-if="
              $getPression('order_bizorderdoubtperiodconfig_enable') ||
              $getPression('order_bizorderdoubtperiodconfig_disable')
            "
          >
            <span v-if="+scope.row.enabled === 0">停用</span>
            <span v-else>启用</span>
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
              @click="changeSwitch(scope.row)"
            />
          </span>
          <el-button
            v-if="$getPression('order_bizorderdoubtperiodconfig_edit')"
            type="text"
            size="small"
            @click="open(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="$getPression('order_bizorderdoubtperiodconfig_del')"
            size="mini"
            type="text"
            icon="delete"
            class="danger"
            @click="deletesForm(scope.row)"
          >
            删除
          </el-button>
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
    <skillPayRuleAdd
      v-if="skillPayRuleAdd"
      ref="enterpriseExamineRef"
      :form="forms"
      :title="title"
      :biztemplate-list="biztemplateList"
      :get-data="getData"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  onMounted
} from 'vue'
import {
  reqSkillPayRuleList,
  reqSkillPayRuleDelete,
  reqSkillPayRuleEnable,
  reqSkillPayRuleDisable,
  reqSkillPayRuleCompanyIdList,
  reqSopTempLateList
} from '../../api/enterprise'
import skillPayRuleAdd from '@/components/skillPayRuleAdd/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import wsCache from '@/cache'

export default defineComponent({
  name: '工种支付规则',
  components: {
    skillPayRuleAdd
  },
  setup() {
    const enterpriseExamineRef = ref<HTMLElement | null>(null)
    const skillPayRuleAdd = ref<boolean>(false)
    const { proxy } = getCurrentInstance() as any
    const initForm = () => {
      return {
        companyName: '',
        contactTel: '',
        socialCreditNo: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      }
    }
    const formTop = reactive(initForm())
    const reset = () => {
      Object.assign(formTop, initForm())
      getData()
    }
    // //启用模板,关闭模板
    const changeSwitch = (row: any) => {
      const apiURL = {
        '1': reqSkillPayRuleEnable,
        '0': reqSkillPayRuleDisable
      }[String(row.enabled) || '0']
      apiURL &&
        apiURL({ id: row.id }).then((res: any) => {
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: `${+row.enabled === 1 ? '启用' : '关闭'}模板成功!`
            })
          }
          getData()
        })
    }
    // 删除模板
    const deletesForm = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqSkillPayRuleDelete({ id: e.id }).then((res: any) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `删除成功!`
            })
            getData()
          } else {
            ElMessage.error(`删除失败!`)
          }
          getData()
        })
      })
    }

    const getData = async () => {
      const res = await reqSkillPayRuleList({
        size: 10,
        page: 1
      })
      if (res) {
        state.tableData = res.data.records;
        state.total = res.data.total;
        state.forms = {
          companyName: '',
          projectAcceptanceRatio: '',
          skillAcceptanceRatio: ''
        }
        state.loading = false;
      }
    }
    const getSeselteList = async () => {
      const res1 = await reqSkillPayRuleCompanyIdList({
        size:999
      })
      if (res1) {
        state.biztemplateList = res1.data?.records
        state.loading = false
      }
    }
    onMounted(() => {
      getData()
      getSeselteList()
    })
    const getDialogVisible = () => {
      setTimeout(() => {
        skillPayRuleAdd.value = false
      }, 300)
    }
    const state = reactive({
      tableData: [],
      title: '新增',
      biztemplateList: [],
      SoptemplateList: [],
      loading: true,
      forms: {
        companyName: '',
        projectAcceptanceRatio: '',
        skillAcceptanceRatio: ''
      },
      currentPage:1,
      total: 0,
      pageSize: 10,
    })
    const open = (e: any) => {
      skillPayRuleAdd.value = true
      state.title = '编辑'
      state.forms = {
        companyName: '',
        projectAcceptanceRatio: '',
        skillAcceptanceRatio: ''
      }
      state.biztemplateList.filter((item:any)=>{
        if(item.skillId == e.skillId){
          item.disabled = false
        }
      })
      setTimeout(() => {
        state.forms = {
          ...e,
          projectAcceptanceRatio: proxy.$getNum.numMulti(
            e.projectAcceptanceRatio,
            100
          ),
          skillAcceptanceRatio: proxy.$getNum.numMulti(
            e.skillAcceptanceRatio,
            100
          )
        }
        ;(enterpriseExamineRef.value as any).open()
      }, 30)
    }
    const buttonClick = () => {
      skillPayRuleAdd.value = true;
      state.title = '新增';
      // 添加过的工种不允许在重复添加
      if(state.biztemplateList && state.biztemplateList.length){
        state.biztemplateList.some((item:any)=>{
          state.tableData.map((v:any)=>{
            if(item.skillId == v.skillId){
              item.disabled = true;
            }
          })
        })
      }
      setTimeout(() => {
        state.forms = {
          companyName: '',
          projectAcceptanceRatio: '',
          skillAcceptanceRatio: ''
        }
        ;(enterpriseExamineRef.value as any).open()
      }, 30)
    }
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }
    return {
      reset,
      formTop,
      getData,
      enterpriseExamineRef,
      skillPayRuleAdd,
      getDialogVisible,
      changeSwitch,
      deletesForm,
      buttonClick,
      open,
      getSeselteList,
      handleCurrentChange,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.table-header {
  background: #f2f2f2;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;
  .text {
    font-size: 18px;
    padding: 10px;
    font-weight: bold;
  }
}
</style>
