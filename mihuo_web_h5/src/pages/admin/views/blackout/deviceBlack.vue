<template>
  <div class="projectuser-contain">
    <el-card>
      <el-input
        v-model="search.name"
        placeholder="设备名称"
        prefix-icon="Search"
        clearable
        @change="getUserData()"
      />
    </el-card>
    <div class="">
      <el-table
        ref="multipleTable"
        :data="userList"
        row-key="id"
        border
        :height="tableHeight"
      >
        <el-table-column
          prop="clientId"
          label="客户端"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="deviceName"
          label="设备名称"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="deviceId"
          label="设备ID"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="userName"
          label="用户名"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          label="状态"
          header-align="center"
          align="center"
          :filters="[
            { text: '正常', value: '0' },
            { text: '已禁用', value: '1' }
          ]"
          :filter-method="filterHandler"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.enableFlag == 1">正常</el-tag>
            <el-tag v-if="scope.row.enableFlag == 0" type="danger"
              >已禁用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="禁用备注"
          header-align="remark"
          align="center"
          width="400"
        >
          <template #default="scope">
            <span v-if="scope.row.enableFlag == 0">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="firstUsedTime"
          label="创建时间"
          header-align="firstUsedTime"
          align="center"
        />
        <el-table-column
          prop="lastUsedTime"
          label="最近使用"
          header-align="center"
          align="center"
        />
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              icon="lock"
              class="danger"
              v-if="scope.row.enableFlag == 1"
              @click="userDelete(scope.row)"
              >禁用该设备
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="Unlock"
              v-if="scope.row.enableFlag == 0"
              @click="userRecovery(scope.row)"
              >恢复该设备
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
import { fetch } from '_@/axios-config/axios'
import {
  bizCustomeUser,
  bizCustomerForfeitRemoveById
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
    const userFormRef = ref()
    const adduserShow = ref(false)
    const ruleCodeType = reactive({
      name: props.proTypeName
    })
    const adduserShowType = ref('')
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
      search: { name: '' },
      userList: [],
      executeJobList: [],
      form: {
        name: ''
      },
      userForm: {
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
      getUserData()
    })

    watch(
      () => state.userForm.skillId,
      (newVal, oldVal) => {
        const tempName = state.executeJobList.filter(
          (item: any) => Number(item.skillId) === Number(newVal)
        )
        if (tempName.length === 0) {
          return
        }
        state.userForm.skillName = tempName[0].skillName
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

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 190
    }

    watchEffect(() => {
      getHeight()
      window.addEventListener('resize', getHeight, false)
    })
    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getUserData()
    }

    const getUserData = () => {
      fetch({
        url: '/admin/user/device/page',
        method: 'get',
        params: {
          size: state.pageSize,
          current: state.currentPage,
          phone: state.search.name,
          username: state.search.name
        }
      }).then((res: any) => {
        if (res.data) {
          state.userList = res.data.records
          state.total = Number(res.data.total)
        }
      })
    }
    const userRecovery = (item: any) => {
      ElMessageBox.confirm(
        `设备[${item.deviceName}]将恢复使用,能够正常使用觅活客服端。确认恢复么?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        fetch({
          url: '/admin/user/device/black/cancel?deviceId=' + item.deviceId,
          method: 'post',
          data: { deviceId: item.deviceId }
        }).then((res) => {
          ElMessage({
            type: 'success',
            message: `${res.data || '恢复成功!'}`
          })
          getUserData()
        })
      })
    }
    const userDelete = (item: any) => {
      ElMessageBox.prompt(
        `设备[${item.deviceName}]将被禁用, 填写备注:`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(({ value }) => {
        fetch({
          url: '/admin/user/device/black/pull',
          method: 'post',
          data: {
            deviceId: item.deviceId,
            remark: value
          }
        }).then((res) => {
          ElMessage({
            type: 'success',
            message: `${res.data || '操作成功!'}`
          })
          getUserData()
        })
      })
    }

    const userOperation = (item: any, type: any, index: any) => {
      state.userForm = JSON.parse(JSON.stringify(item))
      state.userForm.sysFlag = Number(item.sysFlag)
      state.userForm.forbidFlag = Number(item.forbidFlag)
      adduserShowType.value = type
      adduserShow.value = true
    }

    const resetuserPhaseChildForm = () => {
      for (var key in state.userForm) {
        state.userForm[key] = ''
        state.userForm.forbidDay = 0
      }
    }

    return {
      rules,
      tableHeight,
      userFormRef,
      adduserShow,
      selectSkillType,
      regulationTypeList,
      ruleCodeType,
      resetuserPhaseChildForm,
      handleCurrentChange,
      getType,
      userDelete,
      getUserData,
      userOperation,
      getRuleType,
      userRecovery,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
.projectuser-contain {
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

      .user-item {
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

      .user-item-active {
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
