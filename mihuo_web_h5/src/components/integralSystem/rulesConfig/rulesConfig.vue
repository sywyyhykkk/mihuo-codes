<template>
  <el-container>
    <el-header>
      <div style="margin-top: 2rem">
        <el-tabs @tab-click="clickTab">
          <el-tab-pane label="奖励动作规则" name="0" />
          <el-tab-pane label="违规动作规则" name="1" />
        </el-tabs>
      </div>
    </el-header>

    <el-main>
      <div class="btn-wrap">
        <div class="btn-left">
          <el-input
            clearable
            v-model="keyWord"
            :prefix-icon="Search"
            placeholder="请输入关键字查询"
          />
          <el-button
            type="primary"
            icon="Search"
            @click="search"
            style="margin-left: 2rem"
            >查询</el-button
          >
          <el-button icon="RefreshLeft" @click="reset">重置</el-button>
        </div>
        <el-button type="primary" icon="Plus" @click="addRule">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        style="width: 100%; height: calc(100vh - 33rem) !important"
        height="0"
      >
        <el-table-column label="序号" prop="name" type="index" width="50" />
        <el-table-column label="规则分类" prop="ruleCategory" width="150">
          <template #header>
            <el-select
              v-model="ruleCategory"
              placeholder="规则分类"
              @change="changeCate"
              style="width:15rem"
            >
              <el-option
                v-for="(item,index) in categoryList"
                :label="item"
                :value="item"
                :key="index"
               />
            </el-select>
          </template>
          <template #default="scope">
            <span>{{scope.row.ruleCategory}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行为标题" prop="name"></el-table-column>
        <el-table-column
          label="行为描述"
          prop="content"
          width="200"
        ></el-table-column>
        <el-table-column label="岗位" prop="skillNames">
          <template #default="scope">
            <span style="color: #108ee9">{{ scope.row.skillNames }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="ruleType==0 ? '奖励积分（分）':'违规积分（分）'" prop="points"></el-table-column>
        <el-table-column
          label="频率（次/月）"
          prop="timesLimit"
        ></el-table-column>
        <!-- <el-table-column label="金额" prop="money"></el-table-column> -->
        <el-table-column label="规则判定">
          <template #default="scope">
            <span style="color: #108ee9">{{
              setDetermine(scope.row.clientId, scope.row.clientType)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后操作日期" prop="updateTime">
          <template #default="scope">
            {{ scope.row.updateTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="最后操作者" prop="updateBy" width="100">
          <template #default="scope">
            {{ scope.row.updateBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              icon="edit"
              @click="editRules(scope.row,scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="delete"
              class="danger"
              :disabled="scope.row.clientId == -1"
              @click="deleteRules(scope.row)"
              >删除</el-button
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
      v-model="addVisible"
      :title="dialogTitle + '规则配置'"
      width="35rem"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="11rem"
      >
        <el-form-item label="行为标题" prop="name">
          <el-input
            type="text"
            v-model="addForm.name"
            :min="0"
            oninput="value=value.replace(/^0{1,}/g,'')"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="行为描述" prop="content">
          <el-input :disabled="!isEdit" type="text" v-model="addForm.content" />
        </el-form-item>
        <el-form-item label="规则分类" prop="ruleCategory">
          <el-input
            :disabled="!isEdit"
            type="text"
            v-model="addForm.ruleCategory"
            placeholder="请输入规则分类"
          />
        </el-form-item>
        <el-form-item
          label="关联岗位"
          prop="skillIds"
        >
          <el-select
            filterable
            clearable
            :filter-method="dataFilter"
            v-model="addForm.skillIds"
            :multiple="true"
            placeholder="请选择"
            @change="channgeSkillAllFlag"
          >
            <el-option label="所有岗位" value='0' v-if="postList.length > 0" />
            <el-option
              v-for="item in postList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="addForm.ruleType == 1 ? '处罚积分' : '奖励积分'"
          prop="points"
        >
          <el-input
            type="number"
            v-model="addForm.points"
            oninput="value=value.replace(/^0|(-[1-9][0-9]*)/g, '').replace('.','')"
          >
            <template #append>分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-radio-group :disabled="!isEdit" v-model="addForm.ruleType" @change="changeRuleType">
            <el-radio :label="0" size="large">奖励</el-radio>
            <el-radio :label="1" size="large">处罚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="禁单天数"
          prop="forbidDay"
          v-if="addForm.ruleType == '1'"
        >
          <el-input
            :disabled="!isEdit"
            type="number"
            v-model="addForm.forbidDay"
            oninput="value=value.replace(/^0|(-[1-9][0-9]*)/g, '').replace('.','')"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="频率" prop="timesLimit">
          <el-input
            :min="0"
            type="number"
            v-model="addForm.timesLimit"
            oninput="value=value.replace(/^0|(-[1-9][0-9]*)/g, '').replace('.','')"
          >
            <template #append>次/月</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          :label="addForm.ruleType == 1 ? '处罚金额' : '奖励金额'"
          prop="money"
        >
          <el-input type="number" v-model="addForm.money" @input="inputLimitPrice">
            <template #append>元</template>
          </el-input>
        </el-form-item> -->
        <div v-if="stepAmount == 2">
          <el-form-item
            label="阶梯金额"
            prop="stepAmount"
            v-if="dialogTitle?.substring(0,2) === '修改'"
          >
            <el-input type="number" v-model="addForm.stepAmount">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </div>

        <!-- <el-form-item label="系统规则" prop="sysFlag">
          <el-switch
            :disabled="!isEdit"
            v-model="addForm.sysFlag"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item> -->
        <el-form-item
          label="红线规则"
          prop="forbidFlag"
          v-if="addForm.ruleType == 1"
        >
          <el-switch
            :disabled="!isEdit"
            v-model="addForm.forbidFlag"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm">确 认</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
import { fetch } from '@/components/util/axios-config/axios'
import { async } from '@antv/x6/lib/registry/marker/main'
import { ElMessage,ElMessageBox } from 'element-plus'
import { valid } from 'mockjs'
import {
  defineComponent,
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
  computed
} from 'vue'
import { sysjobsList } from '_@/api/basicConfig'

export default defineComponent({
  props: {
    side: {
      type: String,
      default: ''
    }
  },
  setup() {
    const addVisible = ref<boolean>(false)
    const addFormRef = ref<any>('')
    const stepAmount = ref<number>(0)
    const state = reactive({
      isEdit: 0,//是否可以编辑 1可以 0不可以
      ruleCategory: '',
      categoryList: [] as any,
      ruleType: 0,//默认奖励
      dialogTitle: '',
      keyWord: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      addForm: {
        type: 2,
        ruleType: 0
      } as any,
      postList: [],
      oldSeleValue: [] as any
    })
    const addRules = reactive({
      name: [{ required: true, message: '请输入行为标题', trigger: 'change' }],
      content: [
        { required: true, message: '请输入行为描述', trigger: 'change' }
      ],
      ruleCategory: [
        { required: true, message: '请输入规则分类', trigger: 'change' }
      ],
      skillIds: [
        { required: true, message: '请选择关联岗位', trigger: 'change' }
      ],
      points: [{ required: true, message: '请输入积分', trigger: 'change' }],
      timesLimit: [
        { required: true, message: '请输入次数上限', trigger: 'change' }
      ],
      money: [{ required: true, message: '请输入金额', trigger: 'change' }],
      stepAmount: [
        { required: true, message: '请输入阶梯金额', trigger: 'change' }
      ],
      ruleType: [
        { required: true, message: '请选择规则类型', trigger: 'change' }
      ],
      forbidDay: [
        { required: true, message: '请输入禁单天数', trigger: 'change' }
      ]
    })

    // 表头规则分类筛选
    const changeCate = () => {
      getData()
    }

    // 金额输入限制小数点后两位，只能输入正数
    const inputLimitPrice = (val: any) => {
      let value: any = "" + val;//转成字符串
        value =
          value
            .replace(/[^\d^\.]+/g, "")//把不是数字，不是小数点的过滤掉
            .replace(/^0+(\d)/, "$1")//第一位0开头，0后面为数字，则过滤掉，取后面的数字
            .replace(/^\./, "0.")//如果输入的第一位为小数点，则替换成 0. 实现自动补全
            .match(/^\d*(\.?\d{0,2})/g)[0] || "";//最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
      state.addForm.money = value
    }

    //编辑
    const editRules = (row: any,index:number) => {
      if(row.clientId == 1){
        state.isEdit = 1//人工不限制
      }else{
        state.isEdit = 0//系统只能编辑
      }
      
      state.dialogTitle = state.ruleType == 0 ? '修改奖励动作' : '修改违规动作'
      state.addForm = JSON.parse(JSON.stringify(row))//编辑按钮赋值时，这里对scope.row进行拷贝操作，不然有时候取消的时候会改变表格的数据
      if(row.skillIds?.length == state.postList?.length){
        state.addForm.skillIds.push('0')
      }
      addVisible.value = true
      stepAmount.value = index + 1
    }

    //删除
    const deleteRules = async(row:any) => {
      await ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fetch({
          url: `/basic/basicrewardrule/removeById/${row.ruleId}`,
          method: 'get'
        }).then((res:any) => {
          if (res.code == 0) {
            ElMessage.success('删除成功')
            getData()
            getRuleCategory()
          }
        })
      }).catch(e => {
        getData()
        getRuleCategory()
      })
    }

    //规则判定
    const setDetermine = (clientId: any, clientType: string) => {
      // clientId =1 并且 clientType=platform 人工
      // clientId =-1 并且 clientType=platform 系统
      if (clientId == 1 && clientType == 'platform') {
        return '人工'
      } else if (clientId == -1 && clientType == 'platform') {
        return '系统'
      }
    }

    //是否关联所有岗位
    const channgeSkillAllFlag = (val: any) => {
      // 用来储存上一次的值，可以进行对比
      const oldVal = state.oldSeleValue.length === 1 ? state.oldSeleValue[0] : []
      let list:any = state.postList.map((v: any) => v.skillId)
      // 若是全部选择
      if (val.includes('0')) {
        let list2 = ['0']
        state.addForm.skillIds = [...list,...list2]
        // state.addForm.skillIds = ['0']
      }
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes('0') && !val.includes('0')){
        state.addForm.skillIds = []
      }
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('0') && val.includes('0')) {
        const index = val.indexOf('0')
        val.splice(index, 1) // 排除全选选项
        state.addForm.skillIds = val
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('0') && !val.includes('0')) {
        if (val.length === list.length) {
          state.addForm.skillIds.push('0')
        }
      }
      // 储存当前最后的结果 作为下次的老数据
      state.oldSeleValue[0] = state.addForm.skillIds
    }

    //选择规则类型
    const changeRuleType = (val: any) => {
      if (val == 0) {
        state.addForm.forbidDay = 0
      }
    }

    //确认新增
    const confirm = async () => {
      let temNames = ''
      state.addForm?.skillIds?.map((res: any) => {
        state.postList.map((res2: any) => {
          if (res == res2.skillId) {
            temNames += res2.skillName + ','
          }
        })
      })
      state.addForm.skillNames = temNames.substr(0, temNames.length - 1)
      if(state.addForm?.skillIds?.includes('0')){
        state.addForm.skillAllFlag = true
      }else{
        state.addForm.skillAllFlag = false
      }
      //因为 ruleType == 0的时候不显示，这里要给个默认值
      if(state.addForm.ruleType == 0){
        state.addForm.type = 2,
        state.addForm.forbidDay = 0
        state.addForm.forbidFlag = 1
        state.addForm.sysFlag = 0
        state.addForm.money = 0
      }else{
        state.addForm.type = 2,
        state.addForm.sysFlag = 0,
        state.addForm.money = 0
      }
      await addFormRef.value.validate((valid: any) => {
        if (valid) {
          if(state.addForm?.skillIds?.includes('0')) state.addForm?.skillIds?.pop();
          if (state.dialogTitle.substring(0,2) === '新增') {
            //新增
            fetch({
              url: '/basic/basicrewardrule',
              method: 'post',
              data: state.addForm
            }).then((res: any) => {
              if (res.code == 0) {
                ElMessage.success('新增成功')
                getData()
                addVisible.value = false
              } else {
                ElMessage.error('新增失败')
              }
            })
          } else {
            //编辑
            fetch({
              url: '/basic/basicrewardrule/updateById',
              method: 'post',
              data: state.addForm
            }).then((res: any) => {
              if (res.code == 0) {
                ElMessage.success('修改成功')
                getData()
                addVisible.value = false
              } else {
                ElMessage.error('修改失败')
              }
            })
          }
        }
      })
    }

    const dataFilter = (val: string) => {
      let value = val.replace(/\s*/g, '')
      if (value) {
        //去除筛选条件的空格筛选数组
        let jobsCopy = state.postList
        state.postList = jobsCopy.filter((item: any) => {
          if (
            !!~item.skillName.indexOf(value) ||
            !!~item.skillName.toUpperCase().indexOf(value.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        //val为空时，还原数组
        getSysjobsList()
      }
    }

    // 获取岗位和工种
    const getSysjobsList = () => {
      sysjobsList({}).then((res) => {
        state.postList = res.data
      })
    }

    //新增规则
    const addRule = () => {
      state.dialogTitle = state.ruleType == 0 ? '新增奖励动作' : '新增违规动作'
      state.addForm = {}
      state.addForm.ruleType = state.ruleType
      addVisible.value = true
      state.isEdit = 1
    }

    const getRuleCategory = async() => {
      await fetch({
        url: '/basic/basicrewardrule/getRuleCategoryInfo',
        method: 'get',
        params: {
          type: 2,
          ruleType: state.ruleType
        }
      }).then((res:any) => {
        if(res.code == 0){
          state.categoryList = [...new Set(res.data)]
        }
      })
    }

    const getData = async () => {
      await fetch({
        url: '/basic/basicrewardrule/page',
        method: 'get',
        params: {
          type: 2,
          current: state.currentPage,
          size: state.pageSize,
          ruleType: state.ruleType, //0-奖励 1-处罚
          fuzzyName: state.keyWord,
          keyword: state.keyWord,
          ruleCategory: state.ruleCategory
        }
      }).then((res: any) => {
        if (res.code == 0) {
          state.tableData = res.data.records
          state.total = res.data.total
        }
      })
    }

    const clickTab = (e: any) => {
      state.ruleType = Number(e.index)
      getData()
      getRuleCategory()
    }

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const search = () => {
      getData()
    }

    const reset = () => {
      state.keyWord = ''
      getData()
    }

    watch(
      () => addVisible.value,
      (newv: boolean) => {
        if (newv) {
          if (addFormRef && addFormRef.value) {
            addFormRef.value.resetFields()
          }
        }
      }
    )

    onMounted(() => {
      getSysjobsList()
      getData()
      getRuleCategory()
    })

    return {
      stepAmount,
      deleteRules,
      handleCurrentChange,
      changeCate,
      getRuleCategory,
      inputLimitPrice,
      editRules,
      channgeSkillAllFlag,
      changeRuleType,
      setDetermine,
      confirm,
      getSysjobsList,
      dataFilter,
      addVisible,
      addRules,
      addRule,
      addFormRef,
      getData,
      search,
      reset,
      clickTab,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.btn-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  .btn-left {
    display: flex;
    align-items: center;
  }
}

:deep(.el-dialog__body) {
  padding: 0 4rem;
}
</style>
