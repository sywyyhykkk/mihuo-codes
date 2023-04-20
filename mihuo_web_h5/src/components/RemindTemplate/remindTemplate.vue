<template>
  <div>
    <div class="el-card-form">
      <div class="el-card-formLeft">
        <el-button
          v-if="$getPression('generator_remindtemplategroup_add')"
          icon="plus"
          type="text"
          style="margin-top: 2rem;margin-bottom: 3rem;"
          @click="nodeClick(3)"
        >
          新增
        </el-button>
        <el-tree
          ref="tree"
          :data="state.treeData"
          :props="state.defaultProps"
          @node-click="handleNodeClickC"
        >
          <template #default="{ node, data}">
            <div class="custom-tree-node">
              <div class="el-card-custom">
                <span :style="data.id===state.materialTypeId?'color: #0969DA;':''">{{ node.label }}</span>
              </div>
              <el-dropdown
                v-if="$getPression('generator_remindtemplategroup_add') || $getPression('generator_remindtemplategroup_edit') || $getPression('generator_remindtemplategroup_del')"
              >
                <el-icon
                  v-if="data.id===state.materialTypeId"
                  size="10"
                  color="#0969DA"
                  class="tree-node-icon"
                >
                  <more-filled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-if="$getPression('generator_remindtemplategroup_add')"
                      @click.stop="nodeClick(0)"
                    >
                      添加子类
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$getPression('generator_remindtemplategroup_edit')"
                      @click.stop="nodeClick(1)"
                    >
                      编辑分类
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$getPression('generator_remindtemplategroup_del')"
                      @click.stop="nodeClick(2)"
                    >
                      删除分类
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="el-card-formRight">
        <el-card>
          <el-input
            v-model="state.listQuery.remindLikeName"
            clearable
            prefix-icon="Search"
            placeholder="提醒名称"
            @change="getTemplateData"
          />
          <div class="el-card-right">
            <el-dropdown>
              <el-button v-if="$getPression('generator_remindtemplate_add')" type="primary">

                新增提醒
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handelAddClick(0)">SOP节点提醒</el-dropdown-item>
                  <el-dropdown-item @click="handelAddClick(1)">功能规则提醒</el-dropdown-item>
                  <el-dropdown-item @click="handelAddClick(2)">分析规则提醒</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
        <el-table
          ref="brandTable"
          v-loading="state.loading"
          stripe
          :data="state.tableData"
          highlight-current-row
          :height="'calc(100vh - 24rem)'"
          border
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChangeGet"
        >
          <!--            <el-table-column type="selection" width="60" align="center" />-->
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column
            label="提醒名称"
            align="center"
            prop="remindName"
            width="150"
          />
          <el-table-column
            label="提醒类型"
            width="120"
            align="center"
            prop="type"
          >
            <template #default="scope">
              {{ scope.row.type === 1001 ? 'sop节点提醒' : scope.row.type === 1002 ? '功能规则提醒' : scope.row.type === 1003 ?
                '分析规则提醒' : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="关联"
            width="100"
            prop="businessName"
            align="center"
          />
          <el-table-column
            label="提醒内容"
            width="200"
            prop="remindComment"
            align="center"
          />
          <el-table-column label="提醒跳转" width="120" align="center">
            <template #default="scope">
              <div v-if="scope.row.remindJumpLink">
                {{ scope.row.remindJumpLink.substr(scope.row.remindJumpLink.indexOf('=') + 1,
                                                   scope.row.remindJumpLink.length)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="提醒人"
            width="400"
            align="center"
            prop="sort"
          >
            <template #default="scope">
              <span v-if="JSON.parse(scope.row.employeeInfo).skillData">
                <el-tag
                  v-for="item in JSON.parse(scope.row.employeeInfo).skillData"
                  :type="item.type==1?'':'warning'"
                  :style="item.type==1?'':'color:#ffffff;'"
                  style="margin-right: 1rem;"
                >
                  {{ item.skillName }}
                </el-tag>
              </span>
              <el-tag
                v-if="JSON.parse(scope.row.employeeInfo).isRemindSupplier"
                type="danger"
                style="margin-right: 1rem"
              >供应商
              </el-tag>
              <el-tag
                v-if="JSON.parse(scope.row.employeeInfo).isRemindOwner"
                color="#EAD8F2"
                style="color: #B965E0;margin-right: 1rem"
              >
                业主
              </el-tag>
              <span v-if="JSON.parse(scope.row.employeeInfo).employeeList">
                <el-tag
                  v-for="item in JSON.parse(scope.row.employeeInfo).employeeList"
                  type="success"
                  style="margin-right: 1rem"
                >{{ item.employeeName }}</el-tag>
              </span>

            </template>
          </el-table-column>
          <el-table-column
            label="提醒通道"
            width="150"
            align="center"
            prop="sort"
          >
            <template #default="scope">
              {{ getRemindChannel(scope.row.remindChannel) }}
            </template>
          </el-table-column>
          <el-table-column
            label="分组"
            width="100"
            align="center"
            prop="classification"
          />
          <el-table-column label="启用" width="100" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isFlag"
                :active-value="1"
                :inactive-value="0"
                @change="switchChange('',scope.row)"
              />
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
                v-if="$getPression('generator_remindtemplate_edit')"
                size="mini"
                type="text"
                icon="edit"
                @click="handleTemplateUpdate(scope.row,1)"
              >
                编辑
              </el-button>
              <el-button
                v-if="$getPression('generator_remindtemplate_del')"
                type="text"
                size="mini"
                class="danger"
                icon="delete"
                @click="handleTemplateUpdate(scope.row,2)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination-new
          :current-page="state.currentPage"
          :page-size="state.pagesize"
          :total="state.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />

      </div>
    </div>

    <el-dialog
      v-if="state.dialogVisible"
      v-model="state.dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="state.isEdit?'编辑分类':'添加分类'"
    >
      <el-form
        ref="ruleForms"
        :model="state.nodeForm"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="上级分类">
          <el-cascader
            v-model="state.nodeForm.parentId"
            :options="state.treeData"
            :props="state.defaultProps"
            placeholder="无上级分类视为根节点"
            clearable
            :disabled="state.isEdit"
            @change="handleChangeTree"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="state.nodeForm.name" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="state.nodeForm.sort" type="number" style="width: 19rem" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleNodeConfirm">确 定</el-button>
          <el-button @click="handleNodeChange">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-if="state.dialogShow"
      v-model="state.dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="state.dialogTitle"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="所属分类" prop="groupId">
          <el-cascader
            v-model="state.form.groupId"
            :options="state.treeData"
            :props="state.defaultProps"
            clearable
            @change="handleChangeTree"
          />
        </el-form-item>
        <el-form-item label="提醒名称" prop="remindName">
          <el-input v-model="state.form.remindName" />
        </el-form-item>
        <div style="width: 100%;background: #ECF5FF;margin-left: -2rem;padding:0.1rem 0 0.1rem 2rem;">
          <el-form-item label="关联" prop="businessCode">
            <relevanceSelect
              v-model="state.form.businessCode"
              v-model:businessCode="state.businessCode"
              :page-type="state.form.type"
              :business-name="state.form.businessName"
              @getBusinessName="getBusinessName"
            />
          </el-form-item>
          <el-form-item label="提醒内容" prop="remindText">
            <remindContent
              v-model="state.form.remindText"
              :remind-param="state.form.remindParam"
              :business-code="state.businessCode"
              @getParam="getParam"
            />
          </el-form-item>
          <el-form-item v-if="state.form.type != 1003" label="提醒跳转" prop="remindJumpLink">
            <el-select
              v-model="state.form.remindJumpLink"
              filterable
              clearable
              placeholder="请选择跳转路径"
            >
              <el-option
                v-for="(item, index) in state.remindJumpUrlList"
                :key="index"
                :label="item.label"
                :value="item.url"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="state.addStatus===2" label="提醒时间" prop="remindTime">
            <reminderTime v-model="state.form.remindTime" />
          </el-form-item>
        </div>
        <el-form-item label="提醒人" prop="sort">
          <div>
            <el-select
              v-model="state.form.employeeInfo.skillIds"
              multiple
              placeholder="请选择岗位"
              @change="changeSkillList"
            >
              <el-option
                v-for="(item, index) in state.skillList"
                :key="index"
                :label="item.skillName"
                :value="item.skillId"
              />
            </el-select>
            <!-- <selectPerson v-model="state.form.employeeInfo.employeeList" :multiple="true">
              <template #header>
                <div class="other-person">
                  <div class="add-person">
                    <el-icon class="add-person__icon">
                      <plus />
                    </el-icon>
                  </div>
                  <div class="other-person-text">其他人员</div>
                </div>
              </template>
            </selectPerson> -->
            <div style="margin-top: 1rem">
              <el-checkbox v-model="state.form.employeeInfo.isRemindSupplier" label="提醒供应商" name="type" />
              <el-checkbox v-model="state.form.employeeInfo.isRemindOwner" label="提醒业主" name="type" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="提醒通道" prop="remindChannel">
          <el-checkbox-group v-model="state.form.remindChannel" style="justify-content: space-between;">
            <el-checkbox label="1001" name="type">APP提醒</el-checkbox>
            <el-checkbox label="1002" name="type">公众号提醒</el-checkbox>
            <el-checkbox label="1003" name="type">短信提醒</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分组" prop="classification">
          <el-select v-model="state.form.classification" filterable placeholder="请选择分组">
            <el-option
              v-for="(item, index) in state.groupList"
              :key="index"
              :label="item.groupName"
              :value="item.groupName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用" prop="isFlag">
          <el-switch v-model="state.form.isFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleTemplateConfirm(1)">确 定</el-button>
          <el-button @click="handleTemplateConfirm(0)">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const ruleForms = ref<any>()
const state = reactive({
  businessCode: '',
  remindJumpUrlList: [
    // { label: '施工计划', url: 'pages/construction/constructionPlan?type=施工计划' },
    // { label: '服务团队', url: 'pages/construction/assignmentDetail/common/serviceTeam?type=服务团队' },
    // { label: '服务日志', url: 'pages/construction/constructionLog?type=服务日志' },
    // { label: '查看图纸', url: 'pages/construction/drawings/drawings?type=查看图纸' },
    // { label: '停工复工', url: 'pages/construction/shutdownReturnWork/shutDownDetails?type=停工复工' },
    // { label: '材料管理', url: 'pages/construction/materialManagement/materialManagementPage?type=材料管理' },
    // { label: '材料开单', url: 'pages/construction/bill/billPage?type=材料开单' },
    // { label: '工人工费', url: 'pages/construction/laborCost/laborCostDetails?type=工人工费' },
    // { label: '工费申请', url: 'pages/construction/laborCost/applyForSettlement?type=工费申请' },
    // { label: '申请', url: 'pages/construction/complaint/complaintList?type=申请' },
    // { label: '申诉', url: 'pages/construction/complaint/complaintList?type=申诉' },
    // { label: '变更', url: 'pages/construction/changeRecord/changeIndex?type=变更' },
    // { label: '处罚', url: 'pages/construction/punish/punishIndex?type=处罚' }
    { label: '施工计划', url: '施工计划' },
    { label: '服务团队', url: '服务团队' },
    { label: '服务日志', url: '服务日志' },
    { label: '查看图纸', url: '查看图纸' },
    { label: '停工复工', url: '停工复工' },
    { label: '材料管理', url: '材料管理' },
    { label: '材料开单', url: '材料开单' },
    { label: '工人工费', url: '工人工费' },
    { label: '工费申请', url: '工费申请' },
    { label: '申请', url: '申请' },
    { label: '申诉', url: '申诉' },
    { label: '变更', url: '变更' },
    { label: '处罚', url: '处罚' }
  ],
  listQuery: {
    remindLikeName: ''
  },
  remindContentKey: [] as any,
  remindContentList: {} as any,
  currentPage: 1,
  total: 0,
  pagesize: 20,
  skillList: [],
  addStatus: 0,
  modelList: [],
  dialogTitle: '',
  dialogShow: false,
  isTemplateEdit: false,
  loading: false,
  tableData: [] as any,
  treeData: [] as any,
  dialogVisible: false,
  isEdit: false,
  form: {
    remindName: '', // 提醒名称
    businessCode: '' as any, // 业务id
    businessName: '', // 业务名称
    groupId: '' as any, //	分组id
    groupName: '', // 分组名称
    isFlag: 0, // 是否启用：0->否，1->是,可用值:0,1
    employeeInfo: {
      isRemindOwner: '' as any, // 是否提醒业主：0否，1是,可用值:0,1
      isRemindSupplier: '' as any, // 是否提醒供应商：0否，1是,可用值:0,1
      skillIds: [] as any, // 技能id
      employeeList: []
    } as any, // 提醒人信息
    remindChannel: [] as any, // 提醒通道：1001->APP提醒；1002->公众号提醒；1003->短信提醒
    remindComment: '', // 提醒内容
    remindText: '',
    remindJumpLink: '', // 提醒跳转
    remindParam: '', // 提醒参数
    remindTime: '', // 提醒时间
    classification: '', // 固定分组名称
    sort: 0, //	排序字段
    type: '' as any// 分类：1001->SOP节点提醒；1002->功能规则提醒；1003->分析规则提醒,可用值:1001,1002,1003
  } as any,
  defaultProps: {
    checkStrictly: true,
    children: 'children',
    label: 'name',
    value: 'id',
    multiple: false
  },
  nodeForm: {
    id: 0,
    name: '',
    sort: 0,
    parentId: 0
  },
  nodeData: {} as any,
  materialTypeId: '' as any,
  groupList: [{
    groupName: '主辅材料'
  }, {
    groupName: '定制测量'
  }, {
    groupName: '人员调度'
  }, {
    groupName: '质量品控'
  }, {
    groupName: '施工执行'
  }, {
    groupName: '其他'
  }]
})
const rules = reactive({
  parentId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  name: [{ required: true, message: '子分类名称', trigger: 'change' }],
  remindChannel: [{ required: true, message: '请选择提醒通道', trigger: 'change' }],
  remindText: [{ required: true, message: '请填写提醒内容', trigger: 'change' }],
  remindName: [{ required: true, message: '请填写提醒名称', trigger: 'change' }],
  groupId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  classification: [{ required: true, message: '请选择分组', trigger: 'change' }],
  businessCode: [{ required: true, message: '请选择关联内容', trigger: 'change' }]
})

// 启用关闭
const switchChange = (val: any, row: any) => {
  console.log(val, row)
  state.form = row
  editTemplateData()
}
const getMySkillName = (item: any) => {
  const skillData: any = []
  if (item) {
    item.map((data: any) => {
      state.skillList.forEach((res: any) => {
        if (res.skillId == data) {
          skillData.push(res)
        }
      })
    })

    state.form.employeeInfo.skillData = skillData
  }
}
const changeSkillList = (row: any) => {
  console.log(row)
  getMySkillName(row)
}
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  getTemplateData()
}
const getParam = (val: any, row: any) => {
  // console.log(val, row)
  const replaceRegex = /(\n\r|\r\n|\r|\n)/g
  if (row.replaceAll(replaceRegex, '').replaceAll(/\u200B/g, '') == '') {
    state.form.remindParam = ''
    state.form.remindComment = ''
    state.form.remindText = ''
  } else {
    state.form.remindParam = val
    state.form.remindComment = row
  }
}
const getBusinessName = (val: any) => {
  state.form.businessName = val
}
const getRemindChannel = (val: any) => {
  var obj: any = []
  val.split(',').forEach((res: any) => {
    if (res == 1001) {
      obj.push('APP提醒')
    }
    if (res == 1002) {
      obj.push('公众号提醒')
    }
    if (res == 1003) {
      obj.push('短信提醒')
    }
  })
  return obj.toString()
}
const handleChangeTree = (val: any) => {
  console.log(val)
  state.nodeForm.parentId = val[val.length - 1]
  state.form.groupId = val[val.length - 1]
}
// 编辑和删除
const handleTemplateUpdate = (row: any, index: any) => {
  if (index === 1) {
    state.form = JSON.parse(JSON.stringify(row))
    state.form.remindChannel = state.form.remindChannel.split(',')
    state.form.employeeInfo = JSON.parse(state.form.employeeInfo)
    state.form.employeeInfo.isRemindOwner = state.form.employeeInfo.isRemindOwner == 1
    state.form.employeeInfo.isRemindSupplier = state.form.employeeInfo.isRemindSupplier == 1
    state.isTemplateEdit = true
    state.dialogTitle = state.form.type == 1001 ? '编辑SOP节点提醒' : state.form.type == 1002 ? '编辑功能规则提醒' : state.form.type == 1003 ? '编辑分析规则提醒' : ''
    state.dialogShow = true
  }
  if (index === 2) {
    ElMessageBox.confirm(`此操作将永久删除${row.businessName}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteTemplateData(row.id)
    })
  }
}
const handleTemplateConfirm = (index: any) => {
  console.log(state.form)
  if (index === 1) { // 确定
    ruleForms.value.validate((valid: any) => {
      if (valid) {
        getMySkillName(state.form.employeeInfo.skillIds)
        state.form.employeeInfo.isRemindOwner = state.form.employeeInfo.isRemindOwner ? 1 : 0
        state.form.employeeInfo.isRemindSupplier = state.form.employeeInfo.isRemindSupplier ? 1 : 0
        state.form.remindChannel = state.form.remindChannel.toString()
        state.form.employeeInfo = JSON.stringify(state.form.employeeInfo)
        if (!state.isTemplateEdit) {
          console.log(state.form)
          addTemplateData()
        }
        if (state.isTemplateEdit) {
          // editData()
          editTemplateData()
        }
      }
    })
  }
  if (index === 0) { // 取消
    state.isTemplateEdit = false
    state.dialogShow = false
  }
}

// 新增提醒

const handelAddClick = (index: number) => {
  state.form = {
    remindName: '', // 提醒名称
    businessCode: '' as any, // 关联业务id
    businessName: '', // 关联业务名称
    groupId: state.form.groupId, //	分类id
    isFlag: 0, // 是否启用：0->否，1->是,可用值:0,1
    remindChannel: [] as any, // 提醒通道：1001->APP提醒；1002->公众号提醒；1003->短信提醒
    remindComment: '', // 提醒内容
    remindText: '',
    employeeInfo: {
      isRemindOwner: false as any, // 是否提醒业主：0否，1是,可用值:0,1
      isRemindSupplier: false as any, // 是否提醒供应商：0否，1是,可用值:0,1
      skillIds: [] as any, // 技能id
      employeeList: []
    } as any, // 提醒人信息
    remindJumpLink: '', // 提醒跳转
    remindParam: '', // 提醒参数
    remindTime: '', // 提醒时间
    classification: '', // 固定分组名称
    sort: 0, //	排序字段
    type: state.form.type// 分类：1001->SOP节点提醒；1002->功能规则提醒；1003->分析规则提醒,可用值:1001,1002,1003
  }
  state.addStatus = index
  if (index === 0) {
    state.isTemplateEdit = false
    state.dialogTitle = '新增SOP节点提醒'
    state.dialogShow = true
    state.form.type = 1001
  }
  if (index === 1) {
    state.isTemplateEdit = false
    state.dialogTitle = '新增功能规则提醒'
    state.dialogShow = true
    state.form.type = 1002
  }
  if (index === 2) {
    state.isTemplateEdit = false
    state.dialogTitle = '新增分析规则提醒'
    state.dialogShow = true
    state.form.type = 1003
  }
}

const nodeClick = (index: number) => {
  if (index === 0 || index === 3) {
    state.dialogVisible = true
    state.isEdit = false
    state.nodeForm = {
      id: 0,
      name: '',
      sort: 0,
      parentId: index === 3 ? 0 : state.nodeData.id
    }
  }
  if (index === 0 || index === 3) {
    state.dialogVisible = true
    state.isEdit = false
    state.nodeForm = {
      id: 0,
      name: '',
      sort: 0,
      parentId: index === 3 ? 0 : state.nodeData.id
    }
  }
  if (index === 1) {
    state.isEdit = true
    state.dialogVisible = true
    state.nodeForm = {
      id: state.nodeData.id,
      name: state.nodeData.name,
      sort: state.nodeData.sort,
      parentId: state.nodeData.parentId
    }
  }
  if (index === 2) {
    ElMessageBox.confirm(`此操作将永久删除${state.nodeData.name}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteTreeData()
    })
  }
}
const handleNodeChange = () => {
  state.isEdit = false
  state.dialogVisible = false
}
const handleNodeConfirm = () => {
  // if () {
  //
  // }
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (!state.isEdit) {
        addTreeData()
      }
      if (state.isEdit) {
        // editData()
        editTreeData()
      }
    }
  })
}
const handleNodeClickC = (i: any, x: number) => {
  state.nodeData = i
  state.materialTypeId = i.id
  state.form.groupId = i.id
  state.form.groupName = i.name
  getTemplateData()
}
const addTemplateData = async () => {
  await fetch({
    url: '/order/remindtemplate',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      getTemplateData()
      ElMessage.success('新增提醒模板成功')
      state.dialogShow = false
    }
  })
}
const getTemplateData = async () => {
  await fetch({
    url: ' /order/remindtemplate/page',
    method: 'get',
    params: {
      size: state.pagesize,
      current: state.currentPage,
      groupId: state.materialTypeId,
      ...state.listQuery
    }
  }).then((res: any) => {
    state.tableData = res.data.records
    state.total = res.data.total
    state.loading = false
  })
}
const editTemplateData = async () => {
  await fetch({
    url: ' /order/remindtemplate/updateById',
    method: 'post',
    data: state.form
  }).then((res: any) => {
    if (res.data) {
      getTemplateData()
      state.dialogShow = false
      ElMessage.success('编辑成功')
    }
  })
}
const deleteTemplateData = async (id: any) => {
  await fetch({
    url: '/order/remindtemplate/removeById/' + id,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('删除成功')
      getTemplateData()
    }
  })
}
const getTreeData = async () => {
  await fetch({
    url: '/order/remindtemplategroup/getTree',
    method: 'post'
  }).then((res: any) => {
    state.treeData = res.data
  })
}
const addTreeData = async () => {
  await fetch({
    url: '/order/remindtemplategroup/save',
    method: 'post',
    data: state.nodeForm
  }).then((res: any) => {
    if (res.data) {
      state.dialogVisible = false
      getTreeData()
    }
  })
}
const editTreeData = async () => {
  await fetch({
    url: '/order/remindtemplategroup/updateById',
    method: 'post',
    data: state.nodeForm
  }).then((res: any) => {
    if (res.data) {
      state.dialogVisible = false
      getTreeData()
    }
  })
}
const deleteTreeData = async () => {
  await fetch({
    url: `/order/remindtemplategroup/removeById/${state.nodeData.id}`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      ElMessage.success('删除成功')
      ElMessageBox.close()
      getTreeData()
    }
  })
}
const getSkillList = async () => {
  await fetch({
    url: '/admin/sysjobskill/page',
    method: 'get',
    params: {
      size: 999,
      current: 1
    }
  }).then((res) => {
    if (res) {
      state.skillList = res.data.records
    }
  })
}

onMounted(() => {
  getSkillList()
  getTreeData()
  getTemplateData()
})

</script>

<style scoped lang="less">
.other-person {
  display: flex;
  flex-flow: column;
  justify-items: center;
  align-items: center;
  width: 6rem;
  margin: 2rem 2rem 0 0;

  .add-person {
    height: 4rem;
    width: 4rem;
    border: 1px solid #E4E7ED;
    border-radius: 50%;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;

    &:active {
      border: 1px solid #0969DA;

      .add-person__icon {
        color: #0969DA;
      }
    }

    &:hover {
      border: 1px solid #0969DA;

      .add-person__icon {
        color: #0969DA;
      }
    }

    .add-person__icon {
      width: 1.6rem;
      height: 1.6rem;
      color: #C0C4CC;
    }
  }

  .other-person-text {
    font-size: 1.2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #606266;
    margin-top: 0.5rem;
  }
}
</style>
