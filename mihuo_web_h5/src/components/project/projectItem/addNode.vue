<template>
  <div>
    <el-dialog
      v-if="showType"
      v-model="showType"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配置子节点12"
      width="56rem"
    >
      <!--      <div style="height: 70vh; overflow-y: scroll">-->
      <!--        <el-form-->
      <!--          ref="templateFormPhaseChildRef"-->
      <!--          :rules="rulesChildNode"-->
      <!--          :model="templatePhaseChildForm"-->
      <!--          label-width="9rem"-->
      <!--        >-->
      <!--          <el-form-item label="节点名称" prop="name">-->
      <!--            <el-input v-model="templatePhaseChildForm.nodeName" type="text" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="关联功能" prop="businessType">-->
      <!--            <el-radio-group-->
      <!--              v-model="templatePhaseChildForm.businessType"-->
      <!--              @change="businessTypeChange"-->
      <!--            >-->
      <!--              <el-radio-->
      <!--                v-for="(item, index) in businessTypeList"-->
      <!--                :key="index"-->
      <!--                class="el-radio-item"-->
      <!--                :label="item.value"-->
      <!--              >-->
      <!--                {{ item.label }}-->
      <!--              </el-radio>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item-->
      <!--            v-if="templatePhaseChildForm.businessType === 1001"-->
      <!--            label="材料分类"-->
      <!--            prop="materialType"-->
      <!--          >-->
      <!--            <el-select-->
      <!--              v-model="templatePhaseChildForm.materialType"-->
      <!--              placeholder="请选择"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="(item, index) in materialTypeList"-->
      <!--                :key="index"-->
      <!--                :label="item.label"-->
      <!--                :value="item.value"-->
      <!--              />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <div v-show="templatePhaseChildForm.businessType === 1002">-->
      <!--            <el-form-item label="自动派单" prop="orderType">-->
      <!--              <el-switch-->
      <!--                v-model="templatePhaseChildForm.orderType"-->
      <!--                active-color="#409EFF "-->
      <!--                :active-value="1"-->
      <!--                :inactive-value="0"-->
      <!--                inactive-color="#E4E7ED"-->
      <!--              />-->
      <!--            </el-form-item>-->
      <!--            <el-form-item-->
      <!--              v-if="templatePhaseChildForm.orderType === 1"-->
      <!--              label="提前派单天数"-->
      <!--              prop="materialType"-->
      <!--            >-->
      <!--              <el-input-->
      <!--                v-model="templatePhaseChildForm.orderSendDay"-->
      <!--                type="number"-->
      <!--                style="width: 19rem"-->
      <!--              >-->
      <!--                <template #append>天</template>-->
      <!--              </el-input>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="服务包" prop="orderServicePack">-->
      <!--              <el-select-->
      <!--                v-model="templatePhaseChildForm.orderServicePack"-->
      <!--                placeholder="请选择"-->
      <!--              >-->
      <!--                <el-option-->
      <!--                  v-for="(item, index) in orderServicePackList"-->
      <!--                  :key="index"-->
      <!--                  :label="item.name"-->
      <!--                  :value="item.id"-->
      <!--                />-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item-->
      <!--              v-if="templatePhaseChildForm.orderType === 0"-->
      <!--              label="服务内容"-->
      <!--              prop="materialType"-->
      <!--            >-->
      <!--              <el-input v-model="templatePhaseChildForm.executeJob" />-->
      <!--            </el-form-item>-->
      <!--          </div>-->

      <!--          <div v-if="templatePhaseChildForm.businessType === 1006">-->
      <!--            <el-form-item label="上传文件类型" prop="offsetDay">-->
      <!--              <el-radio-group v-model="templatePhaseChildForm.uploadType">-->
      <!--                <el-radio-->
      <!--                  v-for="(item, index) in uploadTypeList"-->
      <!--                  :key="index"-->
      <!--                  :label="item.value"-->
      <!--                >-->
      <!--                  {{ item.label }}-->
      <!--                </el-radio>-->
      <!--              </el-radio-group>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="文件分组" prop="uploadGroup">-->
      <!--              <el-select-->
      <!--                v-model="templatePhaseChildForm.uploadGroup"-->
      <!--                placeholder="请选择"-->
      <!--              >-->
      <!--                <el-option-->
      <!--                  v-for="item in dictTypeList"-->
      <!--                  :key="item.id"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"-->
      <!--                />-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--            <el-form-item label="文件名" prop="uploadFile">-->
      <!--              <div-->
      <!--                v-for="(item, index) in uploadFileList"-->
      <!--                :key="index"-->
      <!--                class="uploadFile-item"-->
      <!--              >-->
      <!--                <el-input v-model="item.name" style="width: 200px" />-->
      <!--                <span class="uploadFile-operation">-->
      <!--                  <i-->
      <!--                    v-show="index + 1 < uploadFileList.length"-->
      <!--                    class="el-icon-delete"-->
      <!--                    @click="editorUploadFileList(index, 'delete')"-->
      <!--                  />-->
      <!--                  <i-->
      <!--                    v-show="index + 1 === uploadFileList.length"-->
      <!--                    class="el-icon-circle-plus"-->
      <!--                    @click="editorUploadFileList(index, 'add')"-->
      <!--                  />-->
      <!--                </span>-->
      <!--              </div>-->
      <!--            </el-form-item>-->
      <!--          </div>-->

      <!--          <el-form-item-->
      <!--            v-if="templatePhaseChildForm.businessType === 1005"-->
      <!--            label="验收内容"-->
      <!--            prop="checkName"-->
      <!--          >-->
      <!--            <el-input v-model="templatePhaseChildForm.checkName" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item-->
      <!--            v-if="-->
      <!--              !(-->
      <!--                templatePhaseChildForm.businessType === 1002 &&-->
      <!--                templatePhaseChildForm.orderType !== 0-->
      <!--              )-->
      <!--            "-->
      <!--            label="执行岗位"-->
      <!--            prop="executeJobIdList"-->
      <!--          >-->
      <!--            <el-select-->
      <!--              v-model="templatePhaseChildForm.executeJob"-->
      <!--              :disabled="-->
      <!--                templatePhaseChildForm.businessType === 1002 &&-->
      <!--                templatePhaseChildForm.orderType !== 0-->
      <!--              "-->
      <!--              multiple-->
      <!--              placeholder="请选择"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="item in executeJobList"-->
      <!--                :key="item.id"-->
      <!--                :label="item.name"-->
      <!--                :value="item.id"-->
      <!--              />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="计划天数" prop="planDay">-->
      <!--            <el-input-->
      <!--              v-model="templatePhaseChildForm.planDay"-->
      <!--              type="number"-->
      <!--              style="width: 19rem"-->
      <!--            >-->
      <!--              <template #append>天</template>-->
      <!--            </el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item-->
      <!--            v-show="templatePhaseChildForm.orderType !== 0"-->
      <!--            label="前置节点"-->
      <!--          >-->
      <!--           <el-table stripe  v-if="nodeData.length > 0"-->
      <!--              ref="multipleTable"-->
      <!--              :data="listByCodeList"-->
      <!--              tooltip-effect="dark"-->
      <!--              style="width: 100%; height: auto; margin-bottom: 10px;margin-right: 2rem"-->
      <!--              size="mini"-->
      <!--              :border="true"-->
      <!--              row-key="id"-->
      <!--              @selection-change="handleSelectionChange"-->
      <!--            >-->
      <!--              <el-table-column label="节点名称" prop="nodeName" />-->
      <!--              <el-table-column width="80" prop="offsetDay" label="偏移天数" />-->
      <!--            </el-table>-->
      <!--            <div v-if="nodeData.length === 0" class="node-name">-->
      <!--              还没创建过节点-->
      <!--            </div>-->
      <!--            <el-popover-->
      <!--              v-if="nodeData.length > 0"-->
      <!--              placement="bottom-start"-->
      <!--              :width="300"-->
      <!--              trigger="click"-->
      <!--            >-->
      <!--              <template #reference>-->
      <!--                <el-button class="node-name">配置前置节点</el-button>-->
      <!--              </template>-->
      <!--              <el-checkbox-group-->
      <!--                v-model="checkNodeList"-->
      <!--                @change="changeCheckNodeList"-->
      <!--              >-->
      <!--                <p-->
      <!--                  v-for="(item, index) in nodeData"-->
      <!--                  :key="index"-->
      <!--                  class="node-item"-->
      <!--                >-->
      <!--                  <el-checkbox :label="item.nodeId"-->
      <!--                    >{{ item.groupName }}-{{ item.nodeName }}</el-checkbox-->
      <!--                  >-->
      <!--                </p>-->
      <!--              </el-checkbox-group>-->
      <!--            </el-popover>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="偏移天数" prop="offsetDay">-->
      <!--            <el-input-->
      <!--              v-model="templatePhaseChildForm.offsetDay"-->
      <!--              type="number"-->
      <!--              style="width: 150px"-->
      <!--            >-->
      <!--              <template #append>天</template>-->
      <!--            </el-input>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="节点分组" prop="groupNo">-->
      <!--            <el-select-->
      <!--              v-model="templatePhaseChildForm.groupNo"-->
      <!--              placeholder="请选择"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="(item, index) in groupCodeList"-->
      <!--                :key="index"-->
      <!--                :label="item.label"-->
      <!--                :value="item.value"-->
      <!--              />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="备注" prop="remark">-->
      <!--            <el-input-->
      <!--              v-model="templatePhaseChildForm.remark"-->
      <!--              type="textarea"-->
      <!--              :rows="2"-->
      <!--              placeholder="请输入内容"-->
      <!--            />-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--      </div>-->
      <el-form
        ref="templateFormPhaseChildRef"
        :rules="rulesChildNode"
        :model="templatePhaseChildForm"
        label-width="12rem"
      >
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="templatePhaseChildForm.nodeName" />
        </el-form-item>
        <el-form-item label="关联功能" prop="businessType">
          <div class="business-type-contain">
            <el-radio-group
              v-model="templatePhaseChildForm.businessType"
              @change="businessTypeChange"
            >
              <el-radio
                v-for="(item, index) in businessTypeList"
                :key="index"
                class="el-radio-item"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          v-if="templatePhaseChildForm.businessType === 1001"
          label="材料分类"
          prop="materialType"
        >
          <el-select
            v-model="templatePhaseChildForm.materialType"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in materialTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-if="templatePhaseChildForm.businessType === 1002">
          <el-form-item label="自动派单" prop="orderType">
            <el-switch
              v-model="templatePhaseChildForm.orderType"
              active-color="#409EFF "
              :active-value="1"
              :inactive-value="0"
              inactive-color="#E4E7ED"
            />
          </el-form-item>
          <el-form-item
            v-if="templatePhaseChildForm.orderType === 1"
            label="提前派单天数"
            prop="materialType"
          >
            <el-input
              v-model="templatePhaseChildForm.orderSendDay"
              type="number"
              style="width: 19rem"
            >
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </div>
        <!--          派单、评价-->
        <el-form-item
          v-if="[1002, 1009].includes(templatePhaseChildForm.businessType)"
          :label="jobLabel"
          prop="skillId"
        >
          <el-select
            v-model="templatePhaseChildForm.skillId"
            placeholder="请选择"
            @change="getOrderSendJob"
          >
            <el-option
              v-for="item in executeJobList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!--          派单、施工 显示服务包-->
        <div v-if="[1002].includes(templatePhaseChildForm.businessType)">
          <el-form-item label="服务包" :prop="selectJobCode=='JOB_WORKER'?'orderServicePack':''">
            <el-select
              v-model="templatePhaseChildForm.orderServicePack"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in orderServicePackList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="templatePhaseChildForm.orderType === 0"
            label="服务内容"
            prop="materialType"
          >
            <el-input v-model="templatePhaseChildForm.executeJob" />
          </el-form-item>
        </div>

        <!--          派单 显示工费、预计人数-->
        <div v-if="templatePhaseChildForm.businessType === 1002">
          <el-form-item label="工费" prop="costs">
            <el-input v-model="templatePhaseChildForm.costs" />
          </el-form-item>
          <el-form-item label="预计人数" prop="personNumber">
            <el-input
              v-model="templatePhaseChildForm.personNumber"
              type="number"
              style="width: 19rem"
            >
              <template #append>人</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="templatePhaseChildForm.businessType === 1006">
          <el-form-item label="上传文件类型" prop="offsetDay">
            <el-radio-group v-model="templatePhaseChildForm.uploadType">
              <el-radio
                v-for="(item, index) in uploadTypeList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件分组" prop="uploadGroup">
            <el-select
              v-model="templatePhaseChildForm.uploadGroup"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dictTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件名" prop="uploadFile">
            <div
              v-for="(item, index) in uploadFileList"
              :key="index"
              class="uploadFile-item"
            >
              <el-input v-model="item.name" style="width: 19rem" />
              <span class="uploadFile-operation">
                <el-icon
                  v-show="index > 0 && index < uploadFileList.length"
                  size="16"
                  color="#f56c6c"
                  @click="editorUploadFileList(index, 'delete')"
                ><delete /></el-icon>
                <el-icon
                  v-show="index + 1 === uploadFileList.length"
                  size="16"
                  style="margin-left: 8px"
                  @click="editorUploadFileList(index, 'add')"
                ><plus /></el-icon>
              </span>
            </div>
          </el-form-item>
        </div>

        <div v-if="templatePhaseChildForm.businessType === 1005">
          <el-form-item label="验收内容" prop="checkName">
            <el-input v-model="templatePhaseChildForm.checkName" />
          </el-form-item>
          <el-form-item label="验收类型" prop="checkType">
            <el-select
              v-model="templatePhaseChildForm.checkType"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in acceptanceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="templatePhaseChildForm.checkType === 1"
            label="工种"
            prop="skillId"
          >
            <el-select
              v-model="templatePhaseChildForm.skillId"
              placeholder="请选择"
              @change=""
            >
              <el-option
                v-for="item in executeJobList"
                :key="item.skillId"
                :label="item.skillName"
                :value="item.skillId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="templatePhaseChildForm.checkType === 2"
            label="验收模板"
            prop="checkTemplateId"
          >
            <el-select
              v-model="templatePhaseChildForm.checkTemplateId"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in acceptanceTypePageList"
                :key="index"
                :label="item.acceptanceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <!--          用于在自动派单情况下显示执行岗位,去除校验-->
        <el-form-item
          v-if="
            templatePhaseChildForm.businessType === 1002 &&
              templatePhaseChildForm.orderType !== 0
          "
          label="执行岗位"
          prop=""
        >
          <el-select
            :disabled="
              templatePhaseChildForm.businessType === 1002 &&
                templatePhaseChildForm.orderType !== 0
            "
            placeholder="请选择"
          />
        </el-form-item>
        <!-- 不是自动派单、验收的情况下都显示-->
        <el-form-item
          v-if="
            !(
              (templatePhaseChildForm.businessType === 1002 &&
                templatePhaseChildForm.orderType === 1) ||
              templatePhaseChildForm.businessType === 1005
            )
          "
          label="执行岗位"
          prop="executeJobIdList"
        >
          <el-select
            v-model="templatePhaseChildForm.executeJobIdList"
            :multiple="selectSkillTypeStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in executeJobList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!-- 只在验收节点下显示-->
        <el-form-item
          v-if="templatePhaseChildForm.businessType === 1005"
          label="执行岗位"
          prop="executeJobIdList"
        >
          <el-select
            v-model="templatePhaseChildForm.executeJobIdList"
            placeholder="请选择"
          >
            <el-option
              v-for="item in performJobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!-- 只在验收节点下显示-->

        <!-- 测量、交底-->
        <el-form-item
          v-if="
            [1010, 1011].includes(templatePhaseChildForm.businessType) &&
              questionnaireList.length > 0
          "
          label="关联问卷"
          prop="quesId"
        >
          <el-select
            v-model="templatePhaseChildForm.quesId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in questionnaireList"
              :key="item.id"
              :label="item.surveyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划天数" prop="planDay">
          <el-input
            v-model="templatePhaseChildForm.planDay"
            type="number"
            style="width: 19rem"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="前置节点">
          <el-table
            v-if="listByCodeSelectList.length > 0"
            ref="multipleTable"
            stripe
            :data="listByCodeList"
            tooltip-effect="dark"
            style="height: auto; margin-bottom: 10px;width: 38rem;height: auto !important;"
            size="mini"
            :border="true"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="节点名称" prop="name" />
          </el-table>
          <div v-if="listByCodeSelectList.length === 0" class="node-name">
            还没创建过节点
          </div>
          <el-popover
            v-if="listByCodeSelectList.length > 0"
            placement="bottom-start"
            :width="300"
            trigger="click"
          >
            <template #reference>
              <el-button class="node-name">配置前置节点</el-button>
            </template>
            <el-checkbox-group
              v-model="checkNodeList"
              @change="changeCheckNodeList"
            >
              <p
                v-for="(item, index) in listByCodeSelectList"
                :key="index"
                class="node-item"
              >
                <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
              </p>
            </el-checkbox-group>
          </el-popover>
        </el-form-item>
        <el-form-item label="偏移天数" prop="offsetDay">
          <el-input
            v-model="templatePhaseChildForm.offsetDay"
            type="number"
            style="width:19rem"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="节点分组" prop="groupNo">
          <el-select
            v-model="templatePhaseChildForm.groupNo"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in groupCodeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="templatePhaseChildForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveTemplatePhaseChild">{{
            nodeIsEdit === true ? '编辑节点' : '创建节点'
          }}</el-button>
          <!-- <el-button @click="addTemplatePhaseChildShow = false">取 消</el-button> -->
          <el-button @click="showType = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, unref, watch } from 'vue'
import { getListByCode, nodeCreate, nodeUpdate, sysjobsList } from '_@/api/basicConfig'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    companyProjectId: {
      type: String || Number,
      default: ''
    },
    projectStageId: {
      type: String || Number,
      default: ''
    },
    getTree: {
      type: Function,
      default: null
    },
    nodeData: [] as any
  },
  setup(props, { emit }) {
    const jobLabel = ref<any>('被派单岗位')
    const uploadFileList = ref<any>([{ name: '文件' }])
    const selectSkillTypeStatus = ref<any>(true)
    const performJobsList = ref<any>([]) // 执行岗位
    const workList = ref<any>([]) // 工种
    const nodeIsEdit = ref<boolean>(false)
    const state = reactive({
      templateFormPhaseChildRef: '' as any,
      questionnaireList: [],
      showType: props.modelValue,
      executeJobList: [],
      listByCodeSelectList: [] as any,
      orderServicePackList: [],
      checkNodeList: [],
      listByCodeList: [],
      templatePhaseChildForm: {
        checkTemplateId: 0,
        companyProjectId: props.companyProjectId,
        companyProjectStageId: props.projectStageId,
        nodeName: '', // name
        executeJob: '' as any, // 00
        planDay: '', // 00
        offsetDay: '', // 00
        groupName: '', // 00
        groupNo: 1001, // 00
        remark: '', // 00
        treeCode: '', // 00
        materialType: 1001, // 00
        orderServicePack: '' as any, // 00
        checkName: '', // 00
        uploadGroup: 0, // 00
        uploadFile: [], // 00
        preNode: '', // 00
        orderType: 1, // 00
        uploadType: 1, // 00
        orderSendDay: '', // 00
        businessType: 1001 as any, // 默认节点00
        executeJobIdList: '', // 执行岗位
        jobCode: '',
        skillName: '',
        skillId: '', // 被派岗位id
        quesId: 0,
        quesName: '',
        checkType: 1,
        personNumber: '',
        costs: ''
      },
      acceptanceTypeList: [
        { label: '内部验收', value: 1 },
        { label: '外部验收', value: 2 }
      ],
      uploadTypeList: [
        { label: '文件', value: 1 },
        { label: '定位', value: 2 },
        { label: '文本', value: 3 }
      ],
      businessTypeList: [
        { label: '选材', value: 1001 },
        { label: '交底', value: 1010 },
        { label: '量房', value: 1011 },
        { label: '派单', value: 1002 },
        { label: '预算', value: 1003 },
        { label: '施工', value: 1004 },
        { label: '上传', value: 1006 },
        { label: '验收', value: 1005 },
        { label: '评价', value: 1009 }
      ],
      groupCodeList: [
        { label: '主辅材料', value: 1001 },
        { label: '人员调度', value: 1002 },
        { label: '资金款项', value: 1003 },
        { label: '方案落地', value: 1004 },
        { label: '测量定制', value: 1005 },
        { label: '验收品控', value: 1006 }
      ],
      materialTypeList: [
        { label: '主材', value: 1001 },
        { label: '辅材', value: 1002 },
        { label: '人工', value: 1003 },
        { label: '服务', value: 1004 },
        { label: '服务包', value: 1005 }
      ]

    })
    const getSysjobsList = () => {
      sysjobsList({}).then((res) => {
        performJobsList.value = res.data
        state.executeJobList = res.data
      })

      sysjobsList({ type: 2 }).then((res) => {
        workList.value = res.data
      })
    }

    const changeCheckNodeList = (e: any) => {
      const tempList: any = []
      props.nodeData.length > 0 &&
      props.nodeData.map((item: any) => {
        e.map((el: any) => {
          if (Number(el) === Number(item.nodeId)) {
            tempList.push(item)
          }
        })
      })
      state.listByCodeList = tempList
      state.templatePhaseChildForm.preNode = e.join(',')
    }
    const saveTemplatePhaseChild = () => {
      state.templatePhaseChildForm.groupName = state.groupCodeList.filter(
        (item: any) => item.value === state.templatePhaseChildForm.groupNo
      )[0].label
      state.templatePhaseChildForm.executeJob = state.templatePhaseChildForm.executeJob.toString()
      console.log(state.templatePhaseChildForm)
      // return
      const forms = unref(state.templateFormPhaseChildRef)
      forms.validate((valid: boolean) => {
        if (!valid) {
          return
        }
        const tempState: any = state.templatePhaseChildForm
        tempState.uploadFile = JSON.stringify(uploadFileList.value)
        tempState.executeJob =
          Array.isArray(tempState.executeJobIdList) === true
            ? tempState.executeJobIdList.join(',')
            : tempState.executeJobIdList
        if (tempState.businessType === 1002 && tempState.orderType === 1) {
          tempState.executeJob = 0
        } else if (![1002, 1009, 1004, 1005].includes(tempState.businessType)) {
          // 不是派单、评价、施工、验收
          tempState.skillId = 0
          tempState.skillName = ''
          tempState.skillId = ''
        }
        saveNode()
      })
    }
    const saveNode = async () => {
      await fetch({
        url: '/order/soptemplate/node/sopnode',
        method: 'post',
        data: state.templatePhaseChildForm
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('添加成功')
          state.showType = false
          emit('getTree')
        }
      })
    }
    onMounted(() => {
      // getListByCodeAll()
      getSysjobsList()
    })
    watch(
      () => state.templatePhaseChildForm.businessType, // 监听节点选择更换name
      (newStr: any, oldStr: any) => {
        switch (newStr) {
          case 1002:
            jobLabel.value = '被派单岗位'
            break
          case 1009:
            jobLabel.value = '被评价岗位'
            break
        }

        if ([1004, 1005].includes(newStr)) {
          selectSkillTypeStatus.value = false
          state.executeJobList = workList.value
        } else {
          selectSkillTypeStatus.value = true
          state.executeJobList = performJobsList.value
        }

        if (!nodeIsEdit.value) {
          // 添加节点时
          state.templatePhaseChildForm.executeJobIdList = ''
        }
      }
    )

    watch(
      () => state.templatePhaseChildForm.checkType,
      (newVal: any, oldVal: any) => {
        if (newVal === 1) {
          state.executeJobList = workList.value
        }
      }
    )

    watch(
      () => state.templatePhaseChildForm.skillId,
      (newVal: any, oldVal: any) => {
        const tempName: any = state.executeJobList.filter(
          (item: any) => Number(item.skillId) === Number(newVal)
        )
        if (tempName.length === 0) {
          return
        }
        state.templatePhaseChildForm.skillName = tempName[0].skillName
        state.templatePhaseChildForm.jobCode = tempName[0].jobCode
      }
    )

    watch(
      () => state.templatePhaseChildForm.quesId,
      (val: any, perValue: any) => {
        const tempName: any = state.questionnaireList.filter(
          (item: any) => item.id === val
        )
        if (tempName.length > 0) {
          state.templatePhaseChildForm.quesName = tempName[0].surveyName
        }
      }
    )

    watch(
      () => state.templatePhaseChildForm.checkType,
      (val: any, perValue: any) => {
        if (val === 1) {
          state.templatePhaseChildForm.checkTemplateId = 0
        }
      }
    )

    const rulesChildNode = reactive({
      nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
      executeJobIdList: [
        { required: true, message: '请选择执行岗位', trigger: 'change' }
      ],
      planDay: [{ required: true, message: '请输入计划天数', trigger: 'blur' }],
      groupNo: [
        { required: true, message: '请选择节点分组', trigger: 'change' }
      ],
      sendSkillId: [
        { required: true, message: '请选择被派单岗位', trigger: 'change' }
      ],
      skillId: [
        {
          required: true,
          message: `必选`,
          trigger: 'change'
        }
      ],
      quesId: [{ required: true, message: '请关联问卷', trigger: 'change' }],
      checkTemplateId: [{ required: true, message: '请选择验收模板', trigger: 'change' }],
      checkType: [{ required: true, message: '请选择验收类型', trigger: 'change' }],
      orderServicePack: [{ required: true, message: '请选择服务包', trigger: 'change' }]
    })
    watch(
      () => props.modelValue,
      (newValue: any, oldValue: any) => {
        state.showType = props.modelValue
        state.listByCodeList = []
        state.templatePhaseChildForm = {
          checkTemplateId: 0,
          companyProjectId: props.companyProjectId,
          companyProjectStageId: props.projectStageId,
          nodeName: '',
          executeJob: '' as any, // 00
          planDay: '', // 00
          offsetDay: '', // 00
          groupName: '', // 00
          groupNo: 1001, // 00
          remark: '', // 00
          treeCode: '', // 00
          materialType: 1001, // 00
          orderServicePack: '' as any, // 00
          checkName: '', // 00
          uploadGroup: 0, // 00
          uploadFile: [], // 00
          preNode: '', // 00
          orderType: 1, // 00
          uploadType: 1, // 00
          orderSendDay: '', // 00
          businessType: 1001, // 默认节点00
          executeJobIdList: '', // 执行岗位
          jobCode: '',
          skillName: '',
          skillId: '', // 被派岗位id
          quesId: 0,
          quesName: '',
          checkType: 1,
          personNumber: '',
          costs: ''
        }
      }
    )
    watch(state, () => {
      if (!state.showType) {
        emit('update:modelValue', false)
      }
    })
    return {
      nodeIsEdit,
      jobLabel,
      selectSkillTypeStatus,
      performJobsList,
      workList,
      rulesChildNode,
      uploadFileList,
      changeCheckNodeList,
      saveNode,
      saveTemplatePhaseChild,
      getSysjobsList,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">

.uploadFile-item {
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0px;
  }

  .el-icon-delete {
    color: #f56c6c;
    margin-right: 4px;
  }
}

.uploadFile-operation {
  margin-left: 10px;

  i {
    cursor: pointer;
  }
}

.el-radio-item {
  margin-bottom: 0.5rem;
}

.node-name {
  font-size: 12px;
  color: #f2aa3d;
  cursor: pointer;
}

.order-send-job {
  display: flex;
  align-items: center;
  justify-content: center;
}

.business-type-contain {
  padding-top: 0.3rem;
  width: 100%;
  margin-bottom: -2rem;

  .el-radio {
    margin-right: 4rem;
    /*margin-bottom: 10px;*/
  }
}
</style>
