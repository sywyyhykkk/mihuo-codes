<template>
  <div class="projectuser-contain">
    <el-card>
      <el-input
        v-model="search.name"
        placeholder="用户姓名、电话"
        prefix-icon="Search"
        clearable
      />
      <el-button type="primary" icon="Search" @click="getUserData()">
        查询
      </el-button>
      <el-button
        icon="refreshLeft"
        @click="handleResetSearch()"
      >
        重置
      </el-button>
    </el-card>
    <div class="">
      <el-table
        ref="multipleTable"
        stripe
        :data="userList"
        row-key="id"
        border
        :height="tableHeight"
      >
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="mark"
          label="标记"
          align="center"
          header-align="center"
          width="200"
        />
        <el-table-column
          prop="phone"
          label="电话"
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
            { text: '已禁用', value: '9' }
          ]"
          :filter-method="filterHandler"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.lockFlag == 0">正常</el-tag>
            <el-tag v-if="scope.row.lockFlag == 9" type="danger">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="修改时间"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="$getPression('sys_user_edit')"
              size="mini"
              type="text"
              icon="pointer"
              @click="editUserTag(scope.row)"
            >标记用户
            </el-button>
            <el-button
              v-if="scope.row.lockFlag == 0"
              size="mini"
              type="text"
              icon="lock"
              class="danger"
              @click="userDelete(scope.row)"
            >禁用该用户
            </el-button>
            <el-button
              v-if="scope.row.lockFlag == 9"
              size="mini"
              type="text"
              icon="Unlock"
              @click="userRecovery(scope.row)"
            >恢复该用户
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
      v-if="isShowDialog"
      v-model="isShowDialog"
      destroy-on-close
      :close-on-press-escape="false"
      width="50%"
      title="标记用户"
      @close="closeDialog"
    >
      <div style="padding: 2rem">
        <el-form label-width="8rem">
          <el-form-item label="用户标记">
            <el-select
              v-model="tagsForm"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请添加用户标记"
            >
              <el-option
                v-for="item in tagOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveDialog">保存</el-button>
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
import { fetch } from '_@/axios-config/axios'
import {
  bizCustomeUser,
  bizCustomerForfeitRemoveById
} from '_c/util/api/templateConfig'
import tags from '_c/Edit/Tags.vue'

export default defineComponent({
  components: {},
  props: {
    proTypeName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const currentRow = ref({} as any)
    const tagsForm = ref([] as any)
    const tagOptions = ref(['内部员工'] as any)
    // 是否显示标记用户弹窗
    const isShowDialog = ref(false)
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

    const handleResetSearch = () => {
      state.search.name = ''
      getUserData()
    }

    const getUserData = () => {
      bizCustomeUser({
        size: state.pageSize,
        current: state.currentPage,
        phone: state.search.name,
        username: state.search.name
      }).then((res: any) => {
        if (res.data) {
          state.userList = res.data.records
          state.total = Number(res.data.total)
        }
      })
    }

    const userRecovery = (item: any) => {
      ElMessageBox.confirm(
        `用户[${item.username}]将恢复使用,能够正常使用觅活客服端。确认恢复么?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        fetch({
          url: '/admin/user/black/cancel?userId=' + item.userId,
          method: 'post',
          data: { userId: item.userId }
        }).then((res) => {
          ElMessage({
            type: 'success',
            message: `${res.data || '恢复成功!'}`
          })
          getUserData()
        })
      })
    }

    // 设置用户标记
    const editUserTag = (row: any) => {
      const data = JSON.parse(JSON.stringify(row))
      currentRow.value = data
      tagsForm.value.push(...(data.mark ? data.mark.split(',') : []))
      isShowDialog.value = true
    }

    // 关闭弹窗
    const closeDialog = () => {
      isShowDialog.value = false
      currentRow.value = {}
      tagsForm.value = []
    }

    // 保存弹窗
    const saveDialog = async () => {
      await fetch({
        url: 'admin/user/updateMark',
        method: 'post',
        data: {
          mark: tagsForm.value.join(','),
          userId: currentRow.value.userId
        }
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功')
          closeDialog()
          getUserData()
        }
      })
    }

    // 拉黑/解除拉黑用户
    const userDelete = (item: any) => {
      ElMessageBox.prompt(`用户[${item.username}]将被禁用, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        fetch({
          url: '/admin/user/black/pull',
          method: 'post',
          data: { userId: item.userId, remark: value }
        }).then((res) => {
          ElMessage({
            type: 'success',
            message: `${res.data || '禁用成功!'}`
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

    const filterHandler = (value: string, row: any, column: any) => {
      return row['lockFlag'] === value
    }

    return {
      isShowDialog,
      rules,
      tableHeight,
      userFormRef,
      adduserShow,
      selectSkillType,
      regulationTypeList,
      tagOptions,
      ruleCodeType,
      tagsForm,
      handleResetSearch,
      closeDialog,
      saveDialog,
      editUserTag,
      handleCurrentChange,
      getType,
      userDelete,
      getUserData,
      userOperation,
      getRuleType,
      userRecovery,
      filterHandler,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
/deep/ .el-checkbox-group .el-checkbox-group {
  display: block !important;
  width: 10rem;
  justify-items: center;
}
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
