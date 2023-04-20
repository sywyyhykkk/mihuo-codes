<template>
  <el-container>
    <el-header>
      <div class="header">
        <el-tabs v-model="pageType" @tab-click="handleClick">
          <el-tab-pane
            :label="item.skillName"
            :name="index"
            v-for="(item, index) in workersTabs"
            :key="item.skillId"
          />
        </el-tabs>
      </div>
    </el-header>

    <el-main>
      <el-table
        v-loading="tableDataLoading"
        :data="tableData"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        style="width: 100%; height: calc(100vh - 27rem) !important"
        height="0"
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column label="工匠等级" prop="levelName"></el-table-column>
        <el-table-column label="升级所需积分" prop="levelIntegral">
          <template #default="scope">
            <span>{{scope.row.levelIntegral}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单上限" prop="orderMaxValue"></el-table-column>
        <el-table-column label="工费费率" prop="rate">
          <template #default="scope">
            <span>{{scope.row.rate + '%'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="月结单量（单）" prop="monthOrderMaxValue">
          <template #default="scope">
            <span>{{scope.row.monthOrderMaxValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工匠权益">
          <template #default="scope">
            <el-image
              preview-teleported
              lazy
              style="height: 50px; width: 50px"
              :src="$imageGlobal + scope.row.personPic?.split(',')[0]"
              :preview-src-list="$getUrl.getPicUrl(scope.row.personPic)"
            />
          </template>
        </el-table-column>
        <el-table-column label="等级介绍" prop="levelPic">
          <template #default="scope">
            <el-image
              preview-teleported
              lazy
              style="height: 50px; width: 50px"
              :src="$imageGlobal + scope.row.levelPic?.split(',')[0]"
              :preview-src-list="$getUrl.getPicUrl(scope.row.levelPic)"
            />
          </template>
        </el-table-column>
        <el-table-column label="最后操作日期">
          <template #default="scope">
            {{ scope.row.updateTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="最后操作者">
          <template #default="scope">
            {{ scope.row.updateBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" prop="grade">
          <template #default="scope">
            <el-button type="text" @click="editEquity(scope.row)"
              >编辑</el-button
            >
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
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="editVisible"
      v-if="editVisible"
      title="编辑"
      width="35rem"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="13rem"
      >
        <el-form-item label="工匠等级" prop="levelName">
          <el-select v-model="editForm.levelName" placeholder="请选择">
            <el-option
              v-for="item in grades"
              :key="item"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="升级所需积分" prop="levelIntegral">
          <el-input
            type="number"
            v-model="editForm.levelIntegral"
            :min="0"
            oninput="value=value.replace(/[^\d||/.]/g,'')"
          >
            <template #append>分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单上限" prop="orderMaxValue">
          <el-input
            type="number"
            v-model="editForm.orderMaxValue"
            :min="0"
            oninput="value=value.replace(/[^\d||/.]/g,'')"
          >
            <template #append>单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="工费费率" prop="rate">
          <el-input type="number" v-model="editForm.rate" @input="(val) => changeVal(val)">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="月接单量" prop="monthOrderMaxValue">
          <el-input
            :min="0"
            type="number"
            v-model="editForm.monthOrderMaxValue"
            oninput="value=value.replace(/[^\d||/.]/g,'')"
          >
            <template #append>单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="工匠权益">
          <uploadImage
            v-model="editForm.personPic"
            :max-count="4"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="等级介绍">
          <uploadImage
            v-model="editForm.levelPic"
            :max-count="4"
            :is-edits="isEdit"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="closeEditVisible">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref, watch, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { async } from '@antv/x6/lib/registry/marker/main'
import { valid } from 'mockjs'
import { inputLimtPrice } from '@/utils/utils'

export default defineComponent({
  setup() {
    const editVisible = ref<boolean>(false)
    const editFormRef = ref<any>('')
    const editRules = reactive({
      levelName: [
        { required: true, message: '请选择工匠等级', trigger: 'change' }
      ],
      levelIntegral: [
        { required: true, message: '请输入升级所需积分', trigger: 'change' }
      ],
      orderMaxValue: [
        { required: true, message: '请输入订单上限', trigger: 'change' }
      ],
      rate: [{ required: true, message: '请输入工费费率', trigger: 'change' }],
      monthOrderMaxValue: [
        { required: true, message: '请输入月接单量', trigger: 'change' }
      ]
    })
    const state = reactive({
      grades: [
        { name: '新手', value: 1 },
        { name: '新秀', value: 2 },
        { name: '精英', value: 3 },
        { name: '明星', value: 4 },
        { name: '大师', value: 5 },
        { name: '王者', value: 6 }
      ],
      workersTabs: [] as any,
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      editForm: {} as any,
      isEdit: false,
      skillId: '',
      tableDataLoading: false
    })

    const changeVal = (val:any) => {
      state.editForm.rate = inputLimtPrice(val)
      // if(parseFloat(state.editForm.rate) > 100){
      //   state.editForm.rate = 100
      // }
    }

    const confirm = async () => {
      state.editForm.rate = parseFloat(state.editForm.rate)/100
      await editFormRef.value.validate((valid: any) => {
        if (valid) {
          fetch({
            url: '/basic/skillconfig/modify',
            method: 'post',
            data: state.editForm
          }).then((res: any) => {
            if (res.code == 0) {
              ElMessage.success('修改成功')
              editVisible.value = false
              editFormRef.value.resetFields()
              getData()
            } else {
              ElMessage.error('操作失败')
            }
          })
        }
      })
    }

    const editEquity = (row: any) => {
      editVisible.value = true
      state.editForm = JSON.parse(JSON.stringify(row))
    }

    const handleClick = (val: any) => {
      state.workersTabs.map((item: any) => {
        if (val.props.label === item.skillName) {
          state.skillId = item.skillId
        }
      })
      getData()
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getData = async () => {
      state.tableDataLoading = true
      await fetch({
        url: '/basic/skillconfig/page',
        method: 'get',
        params: {
          skillId: state.skillId,
          current: state.currentPage,
          size: state.pageSize
        }
      }).then((res: any) => {
        if (res.code == 0) {
          res.data?.records?.map((item:any) => {
            item.rate = parseFloat(item.rate)*100
          })
          state.tableData = res.data.records
          state.total = res.data.total
          state.tableDataLoading = false
        }
      }).finally(() => state.tableDataLoading = false)
    }

    // 获取工种
    const getJobSkill = async () => {
      await fetch({
        url: '/admin/sysjobskill/list/platform',
        method: 'get'
      }).then((res: any) => {
        if (res.code == 0) {
          state.workersTabs = res.data
          state.skillId = state.workersTabs[0].skillId
        }
      })
    }

    const closeEditVisible = () => {
      editVisible.value = false
      editFormRef.value.resetFields()
    }

    onMounted(() => {
      getJobSkill()
      setTimeout(() => {
        getData()
      }, 1000)
    })

    return {
      closeEditVisible,
      changeVal,
      editFormRef,
      getJobSkill,
      confirm,
      editEquity,
      editVisible,
      getData,
      handleClick,
      editRules,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.header {
  margin: 2rem 0;
}
:deep(.el-dialog__body) {
  padding: 0 4rem;
}
</style>
