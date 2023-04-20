<template>
  <div class="projectTemplate-contain">
    <el-card>
      <div class="el-card-right">
        <el-button
          size="mini"
          type="primary"
          @click="saveTemplateShow()"
          icon="plus"
        > 新增
        </el-button>
      </div>
    </el-card>
    <div class="">
      <el-table
        stripe
        ref="multipleTable"
        :data="templateList"
        row-key="id"
        border
        :height="tableHeight"
      >
        <el-table-column
          prop="name"
          label="名称"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="content"
          label="描述"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="ruleCategory"
          label="规则分类"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="skillNames"
          label="岗位"
          header-align="center"
          width="200"
          align="center"
        />
        <el-table-column
          prop="ruleType"
          label="规则类型"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.ruleType == 0 ? '奖励' : '处罚' }}
            <!--            {{ getRuleType(scope.row.ruleType) }}-->
          </template>
        </el-table-column>
        <el-table-column
          prop="ruleCode"
          label="标识"
          header-align="center"
          width="150px"
          align="center"
        />
        <el-table-column
          prop="money"
          label="金额"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="points"
          label="积分"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="forbidDay"
          label="禁单天数"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="timesLimit"
          label="次数上限"
          header-align="center"
          align="center"
        />
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              icon="edit"
              type="text"
              @click="templateOperation(scope.row, 'edit')"
            > 编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="delete"
              class="danger"
              @click="templateDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination-new
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-if="addTemplateShow"
      v-model="addTemplateShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置模板"
      width="56rem"
    >
      <div style="height: 68vh; overflow-y: auto;">
        <el-form
          ref="templateFormRef"
          :rules="rules"
          :model="templateForm"
          label-width="12rem"
        >
          <el-form-item label="问题名称" prop="name">
            <el-input v-model="templateForm.name" />
          </el-form-item>
          <el-form-item label="描述" prop="content">
            <el-input v-model="templateForm.content" type="textarea" />
          </el-form-item>
          <el-form-item label="标识" prop="ruleCode">
            <el-input v-model="templateForm.ruleCode" />
          </el-form-item>
          <el-form-item label="规则分类" prop="ruleCategory">
            <el-input v-model="templateForm.ruleCategory" />
          </el-form-item>
          <el-form-item label="规则类型" prop="ruleType">
            <el-select
              v-model="templateForm.ruleType"
              placeholder="请选择"
            >
              <el-option
                v-for="(ev, nums) in regulationTypeList"
                :key="nums"
                :label="ev.label"
                :value="ev.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关联岗位" prop="skillIds">
            <el-select
              v-model="templateForm.skillIds"
              placeholder="请选择"
              multiple
            >
              <el-option
                v-for="(ev, index) in executeJobList"
                :key="index"
                :label="ev.skillName"
                :value="ev.skillId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="金额" prop="money">
            <el-input
              v-model="templateForm.money"
              type="number"
              style="width: 19rem"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="	积分" prop="points">
            <el-input
              v-model="templateForm.points"
              type="number"
              style="width: 19rem"
            >
              <template #append>分</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="templateForm.ruleType === 1"
            label="禁单天数"
            prop="forbidDay"
          >
            <el-input
              v-model="templateForm.forbidDay"
              type="number"
              style="width: 19rem"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
<!--          <el-form-item label="次数上限" prop="timesLimit">-->
<!--            <el-input-->
<!--              v-model="templateForm.timesLimit"-->
<!--              type="number"-->
<!--              style="width: 19rem"-->
<!--            >-->
<!--              <template #append>次</template>-->
<!--            </el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="是否红线规则" prop="forbidFlag">
            <el-switch
              v-model="templateForm.forbidFlag"
              active-color="#409EFF "
              :active-value="1"
              :inactive-value="0"
              inactive-color="#E4E7ED"
            />
          </el-form-item>
          <el-form-item label="是否系统规则" prop="sysFlag">
            <el-switch
              v-model="templateForm.sysFlag"
              active-color="#409EFF "
              :active-value="1"
              :inactive-value="0"
              inactive-color="#E4E7ED"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplateAll">确 定</el-button>
          <el-button @click="addTemplateShow = false">取 消</el-button>
        </span>
      </template>
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
  watch,
  watchEffect
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  dictType,
  bizCustomerForfeitPage,
  bizCustomerForfeitRemoveById,
  bizCustomerForfeitSave,
  bizCustomerForfeitUpdateById,
  sysjobsList
} from '_c/util/api/templateConfig'

export default defineComponent({
  components: {},
  props: {
    proTypeName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const tableHeight = ref<any>(0)
    const templateFormRef = ref()
    const addTemplateShow = ref(false)
    const ruleCodeType = reactive({
      name: props.proTypeName
    })
    const addTemplateShowType = ref('')
    const regulationTypeList = ref([
      {
        label: '奖励',
        value: 0
      },
      {
        label: '处罚',
        value: 1
      }
    ])
    const selectSkillType = ref<any>(null)
    const state = reactive<any>({
      tableData: [],
      templateList: [],
      executeJobList: [],
      form: {
        name: ''
      },
      templateForm: {
        name: '',
        forbidDay: '', // 禁单天数
        content: '',
        forbidFlag: 0, // 是否红线规则 0-是 1-否
        money: '', // 金额
        points: '', // 积分
        ruleCategory: '', // 规则分类
        ruleCode: '', // 规则标识
        ruleType: '', // 规则类型 0-奖励 1-处罚,可用值:0,1
        skillIds: [], // 岗位id
        skillNames: '',
        sysFlag: 0, // 是否系统规则 0-是 1-否
        timesLimit: 0 // 次数上限
      },
      currentPage: 1,
      total: 0,
      pageSize: 20,
      loading: true
    })
    const rules = reactive({
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      ruleCategory: [
        { required: true, message: '请输入规则分类', trigger: 'blur' }
      ],
      ruleType: [
        { required: true, message: '请选择规则类型', trigger: 'change' }
      ],
      skillIds: [
        { required: true, message: '请选择关联岗位', trigger: 'change' }
      ],
      money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
      points: [{ required: true, message: '请输入积分', trigger: 'blur' }],
      forbidDay: [
        { required: true, message: '请输入禁单天数', trigger: 'blur' }
      ],
      timesLimit: [
        { required: true, message: '请输入次数上限', trigger: 'blur' }
      ],
      ruleCode: [{ required: true, message: '请输入标识', trigger: 'blur' }]
    })
    onMounted(() => {
      getTemplateData()
      getSysjobsList()
    })

    watch(
      () => state.templateForm.skillId,
      (newVal, oldVal) => {
        const tempName = state.executeJobList.filter(
          (item: any) => Number(item.skillId) === Number(newVal)
        )
        if (tempName.length === 0) {
          return
        }
        state.templateForm.skillName = tempName[0].skillName
      }
    )

    watch(
      () => props.proTypeName,
      (newVal, oldVal) => {
        console.log('newVal', newVal)
      }
    )

    const getType = (el: any) => {
      if (el) {
        const temp: any = state.punishmentTypeList.filter(
          (item: any) => Number(item.value) === Number(el)
        )
        return temp.length > 0 && temp[0].label
      } else {
        return ''
      }
    }

    const getRuleType = (el: any) => {
      if (el) {
        return regulationTypeList.value.filter(
          (item) => item.value === Number(el)
        )[0].label
      }
    }

    const getSysjobsList = () => {
      sysjobsList({}).then((res) => {
        state.executeJobList = res.data
      })
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 190
    }

    watchEffect(() => {
      getHeight()
      window.addEventListener('resize', getHeight, false)
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getTemplateData()
    }

    const getTemplateData = () => {
      bizCustomerForfeitPage({
        size: state.pageSize,
        current: state.currentPage
      }).then((res: any) => {
        if (res.data) {
          state.templateList = res.data.records
          state.total = Number(res.data.total)
        }
      })
    }

    const saveTemplateShow = () => {
      // 新增模板
      resetTemplatePhaseChildForm()
      addTemplateShow.value = true
      addTemplateShowType.value = 'add'
    }

    const saveTemplateAll = () => {
      // 保存模板
      const forms = unref(templateFormRef)
      state.templateForm.forbidDay =
        state.templateForm.ruleType === 0 ? 0 : state.templateForm.forbidDay
      var skillNames: any = []
      state.templateForm.skillIds.forEach((res: any) => {
        state.executeJobList.forEach((res2: any) => {
          if (res == res2.skillId) {
            skillNames.push(res2.skillName)
          }
        })
      })
      state.templateForm.skillNames = skillNames.toString()
      switch (addTemplateShowType.value) {
        case 'add':
          forms.validate((valid: boolean) => {
            if (valid) {
              bizCustomerForfeitSave(state.templateForm).then((res) => {
                if (res.data) {
                  ElMessage({
                    type: 'success',
                    message: `新增成功!`
                  })
                  addTemplateShow.value = false
                  getTemplateData()
                }
              })
            }
          })
          break
        case 'edit':
          forms.validate((valid: boolean) => {
            if (valid) {
              bizCustomerForfeitUpdateById(state.templateForm).then((res) => {
                if (res.data) {
                  ElMessage({
                    type: 'success',
                    message: `修改成功!`
                  })

                  addTemplateShow.value = false
                  getTemplateData()
                }
              })
            }
          })
          break
      }
    }

    const templateDelete = (item: any) => {
      ElMessageBox.confirm(`此操作将永久删除${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bizCustomerForfeitRemoveById({ ruleId: item.ruleId }).then((res) => {
          if (res.data) {
            ElMessage({
              type: 'success',
              message: `删除成功!`
            })

            getTemplateData()
          }
        })
      })
    }

    const templateOperation = (item: any, type: any, index: any) => {
      state.templateForm = JSON.parse(JSON.stringify(item))
      state.templateForm.sysFlag = Number(item.sysFlag)
      state.templateForm.forbidFlag = Number(item.forbidFlag)
      addTemplateShowType.value = type
      addTemplateShow.value = true
    }

    const resetTemplatePhaseChildForm = () => {
      for (var key in state.templateForm) {
        state.templateForm[key] = ''
        state.templateForm.forbidDay = 0
      }
    }

    return {
      rules,
      tableHeight,
      templateFormRef,
      addTemplateShow,
      selectSkillType,
      regulationTypeList,
      ruleCodeType,
      getSysjobsList,
      resetTemplatePhaseChildForm,
      handleCurrentChange,
      getType,
      templateDelete,
      getTemplateData,
      saveTemplateAll,
      saveTemplateShow,
      templateOperation,
      getRuleType,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
.projectTemplate-contain {
  /*display: flex;*/

  .left-contain {
    /*width: 20%;*/
    min-width: 206px;
    background-color: #ffff;
    padding: 10px 0px;
    border-right: 1px solid #f0f1f2;
    position: relative;
    overflow: hidden;

    .left-header {
      padding: 10px;
      background-color: #ffffff;
    }

    p {
      cursor: pointer;
      margin-bottom: 18px;
      color: @mainColor;
      font-size: 14px;

      i {
        margin-right: 5px;
      }
    }

    .left-data {
      overflow: auto;
      height: 95%;
      margin: 0 10px;
      padding-bottom: 10px;
      padding-right: 5px;

      .name {
        font-size: 14px;
        white-space: nowrap;
      }

      .template-item {
        padding: 17px 20px 17px 20px;
        background-color: #f0f0f0;
        cursor: pointer;
        color: #333333;
        margin-bottom: 15px;
        border-radius: 4px;
        min-width: 153px;
        display: flex;
        justify-content: space-between;

        .el-icon-remove-outline {
          font-size: 14px;
          margin-right: 5px;
          transform: rotate(45deg);
          color: #f56c6c;
        }

        &:last-child {
          margin-bottom: 0px;
        }

        &:hover {
          background-color: #ebf4ff;
          color: @mainColor;

          .operation {
            display: flex;

            i {
              display: block !important;
            }
          }
        }

        .operation {
          i {
            font-size: 12px;
            margin-right: 9px;
            cursor: pointer;
            display: none;

            &:last-child {
              margin-right: 0px;
            }
          }

          .el-icon-delete {
            color: #f56c6c;
          }
        }
      }

      .template-item-active {
        background-color: @mainColor;
        color: #ffffff;

        &:hover {
          background-color: @mainColor;
          color: #ffffff;
        }
      }
    }
  }

  .right-contain {
    /*width: 80%;*/
    padding: 20px 20px 0px 20px;
    background-color: #ffff;

    .right-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }

  .paragraph-contain {
    display: flex;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 10px;

    &:hover {
      background-color: #f0f1f2;
    }

    .item-contain {
      flex: 4;
      margin-right: 10px;
    }
  }

  .form-contain {
    height: 55vh;
    overflow-y: auto;
    position: relative;
    padding-right: 10px;

    .add-questions {
      text-align: center;
    }
  }

  .questionsList-contain {
    display: flex;
    padding-left: 30px;

    .questionsList-contain-item {
      flex: 4;
      margin-right: 10px;
      position: relative;

      &::after {
        width: 100%;
        content: '';
        position: absolute;
        height: 1px;
        left: 40px;
        bottom: 10px;
        border-bottom: 1px dashed #8c939d;
      }
    }

    .add-contain {
    }
  }

  .el-icon-delete {
    color: red;
    font-size: 16px;
    margin-right: 6px;

    &:hover {
      transition: all 0.2s;
      transform: scale(1.2);
    }
  }

  .el-icon-circle-plus {
    font-size: 16px;

    &:hover {
      transition: all 0.2s;
      transform: scale(1.2);
    }
  }
}
</style>
