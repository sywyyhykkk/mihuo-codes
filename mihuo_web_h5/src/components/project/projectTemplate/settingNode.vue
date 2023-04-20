<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="props.isEdit ? '编辑子节点' : '配置子节点'"
      width="80rem"
      @close="handelClose"
    >
      <el-form
        ref="ruleForms"
        :rules="rules"
        :model="state.form"
        label-width="13rem"
      >
        <el-form-item v-if="props.projectId" label="所属阶段" prop="projectStageId">
          <el-select v-model="state.form.projectStageId" placeholder="请选择">
            <el-option
              v-for="(item, index) in state.projectStageList"
              :key="index"
              :label="item.stageName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="props.type === 'SOP'" label="所属阶段" prop="stageId">
          <el-select v-model="state.form.stageId" placeholder="请选择">
            <el-option
              v-for="(item, index) in state.stages"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="props.projectId == '0'" label="节点名称" prop="name">
          <el-input v-model="state.form.name" />
        </el-form-item>
        <el-form-item v-if="props.projectId != '0'" label="节点名称" prop="nodeName">
          <el-input v-model="state.form.nodeName" />
        </el-form-item>
        <el-form-item label="关联功能" prop="businessType">
          <div class="business-type-contain"><el-radio-group
            v-model="state.form.businessType"
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
        <!-- 交底-->
        <el-form-item v-if="['1010'].includes(state.form.businessType)" label="关联问卷" prop="quesId">
          <ques-select v-model="state.form.quesId" @change="nodeClick" />
        </el-form-item>
        <el-form-item v-if="['1010'].includes(state.form.businessType)" label="是否通知交底">
          <el-switch v-model="state.form.notifyFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <!-- 派外协单、施工验收 -->
        <!-- <el-form-item v-if="['1002', '1004'].includes(state.form.businessType) && state.external" label="关联问卷"
          prop="quesId">
          <ques-select v-model="state.form.quesId" @change="nodeClick" />
        </el-form-item> -->

        <el-form-item
          v-if="
            state.form.businessType === '1010' && state.form.notifyFlag === 1
          "
          label="通知岗位"
          prop="notifyJob"
        >
          <el-select
            v-model="state.form.notifyJob"
            filterable
            :filter-method="dataFilter"
            :multiple="true"
            placeholder="请选择"
          >
            <!-- <el-option label="业主" value="-1" />-->
            <el-option
              v-for="item in state.jobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="['1013', '1014'].includes(state.form.businessType)" label="条件类型" prop="materialConditionType">
          <div class="business-type-contain" style="margin-top: -1.5rem">
            <el-radio-group v-model="state.form.materialConditionType">
              <el-radio
                v-for="(item, index) in materialConditionTypeList"
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
          v-if="['1013', '1014'].includes(state.form.businessType)"
          label="关键词"
          prop="materialConditionKeywords"
        >
          <el-select
            v-model="state.form.materialConditionKeywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入可选材料条件关键字"
          >
            <el-option
              v-for="item in inputOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="state.form.businessType === '1001'" label="材料分类" prop="materialType">
          <el-select v-model="state.form.materialType" placeholder="请选择">
            <el-option
              v-for="(item, index) in materialTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <div v-if="state.form.businessType === '1002'">
          <el-form-item label="自动派单" prop="orderType">
            <el-switch v-model="state.form.orderType" active-color="#409EFF " :active-value="1" :inactive-value="0"
              inactive-color="#E4E7ED" />
          </el-form-item>
          <el-form-item v-if="state.form.orderType === 1" label="提前派单天数" prop="materialType">
            <el-input v-model="state.form.orderSendDay" type="number" style="width: 19rem">
              <template #append>天</template>
            </el-input>
          </el-form-item>
        </div> -->
        <!--          派单、评价-->
        <el-form-item
          v-if="['1002', '1009'].includes(state.form.businessType)"
          :label="
            state.form.businessType == '1002' ? '被派单岗位' : '被评价岗位'
          "
          prop="skillId"
        >
          <el-select v-model="state.form.skillId" placeholder="请选择" @change="getOrderSendJob">
            <el-option
              v-for="item in state.jobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <!--          派单 显示工费、预计人数-->
        <div v-if="state.form.businessType === '1002'">
          <el-form-item label="工费" prop="costs">
            <el-input v-model="state.form.costs" />
          </el-form-item>
          <el-form-item label="预计人数" prop="personNumber">
            <el-input v-model="state.form.personNumber" type="number" style="width: 19rem">
              <template #append>人</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="state.form.businessType === '1006'">
          <el-form-item label="分组类型" prop="uploadGroup">
            <el-select v-model="state.form.uploadGroup" placeholder="请选择">
              <el-option
                v-for="item in state.uploadGroupTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件分组" prop="uploadFileList">
            <div v-for="(item, index) in state.form.uploadFileList" :key="index" class="uploadFile-item">
              <el-form-item
                :prop="`uploadFileList.${index}.name`"
                :style="index == 0 ? 'margin-top: 0;' : ''"
                :rules="[
                  {
                    required: true,
                    message: '请输入文件分组名称',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input v-model="item.name" style="width: 19rem" />
                <span class="uploadFile-operation">
                  <el-icon
                    v-show="
                      index > 0 && index < state.form.uploadFileList.length
                    "
                    size="16"
                    color="#f56c6c"
                    @click="editorUploadFileList(index, 'delete')"
                  >
                    <delete />
                  </el-icon>
                  <el-icon
                    v-show="index + 1 === state.form.uploadFileList.length"
                    size="16"
                    style="margin-left: 8px"
                    @click="editorUploadFileList(index, 'add')"
                  >
                    <plus />
                  </el-icon>
                </span>
              </el-form-item>
            </div>
          </el-form-item>
        </div>

        <div v-if="state.form.businessType === '1005'">
          <el-form-item label="验收内容" prop="checkName">
            <el-input v-model="state.form.checkName" />
          </el-form-item>
          <el-form-item label="验收类型" prop="checkType">
            <el-select v-model="state.form.checkType" placeholder="请选择">
              <el-option
                v-for="(item, index) in acceptanceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="state.form.checkType === 1" label="关联节点" prop="joinNodeId">
            <el-select
              v-if="props.addType != 'customAdd'"
              v-model="state.form.joinNodeId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in constructionNodeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <!-- 项目中添加节点 value取templateNodeId -->
            <el-select v-else v-model="state.form.joinNodeId" placeholder="请选择">
              <el-option
                v-for="item in constructionNodeData"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.templateNodeId"
              />
            </el-select>
          </el-form-item>
          <!-- v-if="state.form.checkType === 2" -->
          <el-form-item label="验收模板" prop="checkTemplateId">
            <el-select v-model="state.form.checkTemplateId" placeholder="请选择">
              <div v-for="(item, index) in state.acceptanceTypeList" :key="index">
                <el-option v-if="Number(item.enableFlag) !== 0" :label="item.acceptanceName" :value="item.id" />
              </div>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="state.collectionParamShow">
          <el-form-item label="是否在线收款">
            <el-switch v-model="state.form.collectFlag" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="state.form.collectFlag == 1" label="收款计算式" prop="onlineCollectExpress">
            <el-input v-model="state.form.onlineCollectExpress" @click="handelClickCollection" />
          </el-form-item>
        </div>

        <!--新增配置 -->
        <div v-if="state.form.businessType != '1015'">
          <el-form-item label="完成后结算" prop="settlement">
            <el-switch
              v-model="state.form.settlementStatus"
              active-color="#409EFF "
              :active-value="1"
              :inactive-value="0"
              inactive-color="#E4E7ED"
              @change="changeSettlementFlag"
            />
            <el-button
              v-if="state.form.settlementStatus == 1"
              type="text"
              size="mini"
              icon="plus"
              style="font-size: 12px; margin-left: 10px"
              @click="addSettl"
            >新增结算岗位</el-button>
          </el-form-item>
          <div v-if="state.form.settlementStatus == 1" class="sett-table">
            <el-table border :data="state.form.doubtSettlList">
              <el-table-column
                label="是否是尾款"
                prop="finalPaymentStatus"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <el-form-item prop="finalPaymentStatus" label-width="2.5rem">
                    <el-switch
                      v-model="scope.row.finalPaymentStatus"
                      active-color="#409EFF "
                      :active-value="1"
                      :inactive-value="0"
                      inactive-color="#E4E7ED"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="岗位"
                prop="skillId"
                align="center"
                width="150"
              >
                <template #default="scope">
                  <el-form-item
                    label-width="0"
                    :prop="`doubtSettlList.${scope.$index}.skillId`"
                    :rules="{
                      required: true,
                      message: '请选择岗位',
                      trigger: 'blur'
                    }"
                  >
                    <el-select v-model="scope.row.skillId" placeholder="岗位">
                      <el-option
                        v-for="item in state.jobsList"
                        :key="item.skillId"
                        :label="item.skillName"
                        :value="item.skillId"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="比例"
                prop="skillAcceptanceRatio"
                align="center"
                width="150"
              >
                <template #default="scope">
                  <el-form-item
                    label-width="0"
                    :prop="`doubtSettlList.${scope.$index}.skillAcceptanceRatio`"
                    :rules="{
                      required: true,
                      message: '请输入比例',
                      trigger: 'blur'
                    }"
                  >
                    <el-input
                      v-model="scope.row.skillAcceptanceRatio"
                      type="number"
                      @input="
                        (val) =>
                          changeProportion(
                            val,
                            scope.$index,
                            'skillAcceptanceRatio'
                          )
                      "
                    >
                      <template #append>%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="存疑天数"
                prop="skillAcceptanceLimit"
                align="center"
                width="150"
              >
                <template #default="scope">
                  <el-form-item
                    label-width="0"
                    :prop="`doubtSettlList.${scope.$index}.skillAcceptanceLimit`"
                    :rules="{
                      required: true,
                      message: '请输入存疑天数',
                      trigger: 'blur'
                    }"
                  >
                    <el-input
                      v-model.number="scope.row.skillAcceptanceLimit"
                      type="number"
                      :min="0"
                      oninput="value=value.replace(/[^\d]/g,'')"
                    >
                      <template #append>天</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                prop=""
                align="center"
                fixed="right"
              >
                <template #default="scope">
                  <el-button
                    type="text"
                    size="mini"
                    class="danger"
                    icon="delete"
                    @click="deleteSettl(scope.$index, scope.row.id)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--          用于在自动派单情况下显示执行岗位,去除校验-->
        <el-form-item
          v-if="
            state.form.businessType === '1002' && state.form.orderType !== 0
          "
          label="执行岗位"
          prop=""
        >
          <el-select
            :disabled="
              state.form.businessType === '1002' && state.form.orderType !== 0
            "
            placeholder="请选择执行岗位"
          />
        </el-form-item>
        <!-- 不是自动派单、验收的情况下都显示-->
        <el-form-item
          v-if="
            !(
              (state.form.businessType === '1002' &&
                state.form.orderType === 1) ||
              state.form.businessType === '1005'
            )
          "
          label="执行岗位"
          prop="executeJob"
        >
          <el-select
            v-model="state.form.executeJob"
            filterable
            :filter-method="dataFilter"
            :multiple="selectSkillTypeStatus"
            placeholder="请选择执行岗位"
            @change="getOrderSendJob"
          >
            <el-option
              v-for="item in state.form.businessType == '1004'
                ? state.workList
                : state.jobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="state.form.businessType === '1015'" label="开单模板" prop="materialTemplateIds">
          <el-select
            v-model="state.form.materialTemplateIds"
            filterable
            :multiple="true"
            placeholder="请选择"
          >
            <el-option
              v-for="item in state.billingTemplates"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <!-- 只在验收节点下显示-->
        <el-form-item v-if="state.form.businessType === '1005'" label="执行岗位" prop="executeJob">
          <el-select
            v-model="state.form.executeJob"
            filterable
            :filter-method="dataFilter"
            placeholder="请选择"
          >
            <el-option
              v-for="item in state.jobsList"
              :key="item.skillId"
              :label="item.skillName"
              :value="item.skillId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业主是否可见">
          <el-switch v-model="state.form.clientShowFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <!-- 只在验收节点下显示-->
        <el-form-item label="节点类型" prop="nodeType">
          <div class="business-type-contain" style="margin-top: -1.5rem">
            <el-radio-group v-model="state.form.nodeType" @change="handelChangeNodeType">
              <el-radio
                v-for="(item, index) in nodeTypeList"
                :key="index"
                class="el-radio-item"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="计划天数" :prop="state.form.nodeType == 1 ? '' : 'planDay'">
          <el-input
            v-model.number="state.form.planDay"
            :disabled="state.form.nodeType == 1"
            type="number"
            :min="0"
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width: 19rem"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="前置节点">
          <el-table
            ref="multipleTable"
            stripe
            :data="state.form.preNodes"
            tooltip-effect="dark"
            style="
                                    height: auto;
                                    margin-bottom: 10px;
                                    width: 38rem;
                                    height: auto !important;
                                  "
            size="mini"
            :border="true"
            row-key="id"
          >
            <el-table-column label="节点名称">
              <template #default="scope">
                {{ scope.row.name || scope.row.nodeName }}
              </template>
            </el-table-column>
          </el-table>
          <el-popover placement="bottom-start" :width="300" trigger="click">
            <template #reference>
              <el-button class="node-name" style="margin-left: 1rem;">配置前置节点</el-button>
            </template>
            <!--            前置节点改为级联选择，组件-->
            <frontNodes
              v-model="state.form.preNodes"
              :check-node-list="
                state.form.preNode ? state.form.preNode.split(',') : []
              "
              :edit-node-id="state.form.id"
              :template-id="props.nodeData?.templateId"
              :project-id="'' + props.projectId"
              :add-type="props.addType"
              @getNodeIds="getNodeIds"
            />
          </el-popover>
        </el-form-item>
        <el-form-item v-if="state.form.businessType != '1015'" label="是否跳过前置节点" prop="skipStatus">
          <el-radio-group v-model="state.form.skipStatus">
            <el-radio class="el-radio-item" :label="0">跳过</el-radio>
            <el-radio class="el-radio-item" :label="1">不跳过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="偏移天数" prop="offsetDay">
          <el-input
            v-model.number="state.form.offsetDay"
            type="number"
            style="width: 19rem"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="节点分组" prop="groupNo">
          <el-select v-model="state.form.groupNo" placeholder="请选择" @change="handelGroupChange">
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
            v-model="state.form.remark"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="施工开始节点">
          <el-switch v-model="state.form.startNodeFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="施工结束节点">
          <el-switch v-model="state.form.finishNodeFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="启用条件">
          <!--          <el-button @click="handelClickConditions('enable')">启用条件</el-button>-->
          <el-input v-model="state.form.enableExpressTranslate" readonly @click="handelClickConditions('enable')" />
        </el-form-item>
        <el-form-item label="开始方式" prop="startWay">
          <div class="business-type-contain" style="margin-top: -1.5rem">
            <el-radio-group v-model="state.form.startWay">
              <!-- <el-radio
                v-for="(item, index) in startWayList"
                :key="index"
                class="el-radio-item"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio> -->
              <el-radio class="el-radio-item" :label="0">自动开始</el-radio>
              <el-radio
                v-if="
                  [
                    '1001',
                    '1003',
                    '1004',
                    '1006',
                    '1012',
                    '1000',
                    '1015'
                  ].includes(state.form.businessType)
                "
                class="el-radio-item"
                :label="1"
              >手动开始</el-radio>
              <el-radio class="el-radio-item" :label="2">按规则开始</el-radio>
            </el-radio-group>
            <el-button v-if="state.form.startWay == 1" class="node-name" @click="toConfigWords('start')">
              开始常用语配置
            </el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="state.form.startWay == 2" label="开始条件" prop="startExpressTranslate">
          <!-- <el-button @click="handelClickConditions('start')">开始条件</el-button> -->
          <el-input v-model="state.form.startExpressTranslate" readonly @click="handelClickConditions('start')" />
        </el-form-item>
        <el-form-item label="结束方式" prop="finishWay" style="margin-top: 3rem">
          <div class="business-type-contain" style="margin-top: -1.5rem">
            <el-radio-group v-model="state.form.finishWay">
              <!-- <el-radio
                v-for="(item, index) in finishWayList"
                :key="index"
                class="el-radio-item"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio> -->
              <el-radio class="el-radio-item" :label="0">
                自动结束
              </el-radio>
              <el-radio
                v-if="
                  ['1001', '1003', '1006', '1012', '1000', '1015'].includes(
                    state.form.businessType
                  )
                "
                class="el-radio-item"
                :label="1"
              >手动结束</el-radio>
              <el-radio v-if="state.form.businessType !== '1004'" class="el-radio-item" :label="2">按规则结束</el-radio>
            </el-radio-group>
            <el-button v-if="state.form.finishWay == 1" class="node-name" @click="toConfigWords('finish')">
              结束常用语配置
            </el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="state.form.finishWay == 2" label="结束条件" prop="endExpressTranslate">
          <!--          <el-button @click="handelClickConditions('end')">结束条件</el-button>-->
          <el-input v-model="state.form.endExpressTranslate" readonly @click="handelClickConditions('end')" />
        </el-form-item>
        <el-form-item label="是否需要校验">
          <el-switch v-model="state.form.verifyFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="state.form.verifyFlag == 1" label="校验条件">
          <div style="margin-top: -2.2rem; display: flex; align-items: center">
            <el-form-item prop="verifyRelative">
              <el-select v-model="state.form.verifyRelative" placeholder="请选择校验相对时间类型" style="width: 16rem">
                <el-option
                  v-for="item in verifyRelativeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div
              style="
                                      line-height: 3.6rem;
                                      margin-top: 2.2rem;
                                      width: 6rem;
                                      text-align: center;
                                    "
            >
              {{ [0, 1].includes(state.form.verifyRelative) ? '后' : '节点' }}
            </div>
            <el-form-item v-if="[0, 1].includes(state.form.verifyRelative)" prop="verifyOffsetDay">
              <el-input
                v-model="state.form.verifyOffsetDay"
                type="number"
                style="width: 16rem"
                oninput="value=state.form.nodeType==0?value.replace(/^0|(-[1-9][0-9]*)/g, '').replace('.',''):value"
              >
                <template #append>天</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="[2, 3].includes(state.form.verifyRelative)" prop="verifyRelativeNodeId">
              <el-cascader
                v-model="state.form.verifyRelativeNodeId"
                style="width: 16rem"
                :options="state.stages"
                :props="{ children: 'nodes', label: 'name', value: 'id' }"
                @change="handleChangeCase"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <!-- tfs 29491 开单节点不需要配置是否需要审核 -->
        <el-form-item v-if="state.form.businessType != '1015'" label="是否需要审核">
          <el-switch v-model="state.form.reviewFlag" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <div v-if="state.form.reviewFlag == 1">
          <el-form-item label="审核人" prop="reviewerIds">
            <el-select v-model="state.form.reviewerIds" placeholder="请选择岗位" multiple>
              <el-option label="业主" value="-2" />
              <el-option
                v-for="item in state.jobsList"
                :key="item.skillId"
                :label="item.skillName"
                :value="item.skillId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否签字" prop="signFlag">
            <el-radio-group v-model="state.form.signFlag">
              <el-radio :label="1" size="large">是</el-radio>
              <el-radio :label="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核说明" prop="reviewDesc">
            <el-input
              v-model="state.form.reviewDesc"
              :rows="3"
              type="textarea"
              placeholder="请输入审核说明"
              maxlength="100"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-preventRepeatClick type="primary" @click="saveTemplateNode">
            {{ props.isEdit ? '保存节点' : '创建节点' }}
          </el-button>
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    启用条件,开始条件，结束条件-->
    <launchConditional
      v-if="launchShow"
      v-model="launchShow"
      :template-id="state.form.templateId"
      :type="conditionsType"
      :node-id="state.form.id"
      :data="state.nodeExpressItem"
      @getExpressTranslate="getExpressTranslate"
    />
    <collectionCalculation
      v-if="collectionShow"
      v-model="collectionShow"
      :template-id="state.form.templateId"
      type="payment"
      :node-id="state.form.id"
      @getCollectionShowTranslate="getCollectionShowTranslate"
    />

    <!-- 开始结束方式常用于维护 -->
    <startFinishCommonWords
      v-if="commonWordsShow"
      v-model="commonWordsShow"
      :data="state.commonStatements"
      :node-id="state.form.id"
      :type="configWordsType"
      @updateCommonWords="updateCommonWords"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineEmits,
  defineProps,
  watchEffect,
  watch
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  dictType,
  getAllTemplates,
  nodeCreate,
  surveyTemplates,
  sysjobsList
} from '_@/api/basicConfig'
import { ArrowDown, ArrowUp, Flag } from '@element-plus/icons-vue'
import { async } from '@antv/x6/lib/registry/marker/main'
import { colProps } from 'element-plus/lib/components'
import { start } from 'nprogress'

const props = defineProps({
  nodeData: {
    // 当前节点的数据
    type: Object,
    default: {}
  },
  modelValue: {
    // 控制弹出层的显示
    type: Boolean,
    default: false
  },
  isEdit: {
    // 是否编辑
    type: Boolean,
    default: false
  },
  tableData: {
    // 阶段和节点的树形数据
    type: Object,
    default: []
  },
  nodeId: {
    // 节点id
    type: String || Number,
    default: 0
  },
  projectId: {
    // 项目id
    type: String || Number,
    default: 0
  },
  type: {
    // 使用类型SOP、项目
    type: String,
    default: ''
  },
  addType: {
    // 模板导入后的添加类型 用于区分什么时候添加的节点
    type: String,
    default: ''
  }
})
const emit = defineEmits(['getData', 'update:modelValue'])
const ruleForms = ref<any>('')
const dialogShow = ref(false)
const selectSkillTypeStatus = ref<any>(true) // 执行岗位是否多选
const launchShow = ref<boolean>(false) // 是否打开条件编辑器
const collectionShow = ref<boolean>(false) // 是否打开条件编辑器
const commonWordsShow = ref<boolean>(false) // 开始结束方式常用语配置
const configWordsType = ref<string>('') // 开始结束方式
const jobLabel = ref('被派单岗位')
const constructionNodeData = ref<any>([]) // 施工节点列表
const conditionsType = ref<string>('enable') // 表达式类型：开始条件：type=start 结束条件：type=end 启用条件：type=enable
const acceptanceTypeList = ref<any>([
  { label: '施工验收', value: 1 },
  { label: '工地验收', value: 2 }
])
const materialConditionTypeList = ref<any>([
  { label: '区域', value: 0 },
  { label: '类型', value: 1 }
])
const reviewerList = ref<any>([
  { label: '岗位', value: 0 },
  { label: '业主', value: 1 }
])
const nodeTypeList = ref<any>([
  { label: '区间', value: 0 },
  { label: '动作', value: 1 }
])
const uploadTypeList = ref<any>([
  { label: '文件', value: 1 },
  { label: '定位', value: 2 },
  { label: '文本', value: 3 }
])
const finishWayList = ref<any>([
  { label: '自动结束', value: 0 },
  { label: '手动结束', value: 1 },
  { label: '按规则结束', value: 2 }
])
const startWayList = ref<any>([
  { label: '自动开始', value: 0 },
  { label: '手动开始', value: 1 },
  { label: '按规则开始', value: 2 }
])

const businessTypeList = ref<any>([
  { label: '选材', value: '1001' },
  { label: '交底', value: '1010' },
  { label: '量房', value: '1011' },
  { label: '派单', value: '1002' },
  { label: '预算', value: '1003' },
  { label: '施工', value: '1004' },
  { label: '上传', value: '1006' },
  { label: '验收', value: '1005' },
  { label: '评价', value: '1009' },
  { label: '收款', value: '1012' },
  { label: '材料申请', value: '1013' },
  { label: '材料管理', value: '1014' },
  { label: '开单', value: '1015' },
  { label: '无', value: '1000' }
])

const groupCodeList = ref<any>([
  { label: '主辅材料', value: '1001' },
  { label: '人员调度', value: '1002' },
  { label: '资金款项', value: '1003' },
  { label: '方案落地', value: '1004' },
  { label: '测量定制', value: '1005' },
  { label: '验收品控', value: '1006' }
])
const materialTypeList = ref<any>([
  { label: '主材', value: '1001' },
  { label: '辅材', value: '1002' },
  { label: '人工', value: '1003' },
  { label: '服务', value: '1004' },
  { label: '服务包', value: '1005' }
])
const verifyRelativeList = ref<any>([
  { label: '服务开始时间', value: 0 },
  { label: '施工开始时间', value: 1 },
  { label: '节点开始时间', value: 2 },
  { label: '节点完成时间', value: 3 }
])
const state = reactive({
  nodeExpressItem: {} as any, // 启用条件单项
  commonStatements: [] as any, // 常用语
  doubtSettlList: [] as any, // 申请结算数据
  collectionParamShow: false,
  projectStageList: [], // 项目阶段列表
  workList: [], // 工种列表
  jobsList: [], // 岗位列表
  billingTemplates: [], // 开单模板
  questionnaireList: [], // 测量和交底的问卷列表
  acceptanceTypeList: [], // 验收模板列表
  uploadGroupTypeList: [], // 文件上传分组列表
  selectJobCode: '', // 岗位标识
  stages: [], // 项目阶段，节点
  external: false, // 派外协单
  form: {
    skipStatus: 0, // 0跳过（默认），1不能跳过
    settlementStatus: 0, // 完成后是否结算
    onlineCollectExpress: '', // 收款计算式
    collectFlag: 0, // 是否在线收款
    clientShowFlag: 0, // 业主是否可见
    stageId: 0 as any, // 初始化阶段id,//阶段id
    templateId: 0, // 模版Id
    id: 0, // 节点id
    signFlag: 0, // 不需要业主签字
    name: '',
    businessType: '1001', // 默认节点
    executeJob: '' as any, // 执行岗位
    jobCode: '',
    skillName: '',
    skillId: '', // 被派岗位id
    planDay: '',
    offsetDay: '',
    groupName: '',
    groupNo: '',
    remark: '',
    reviewDesc: '', // 审核说明
    treeCode: '',
    materialType: '1001',
    checkName: '',
    uploadGroup: '' as any, // 文件上传分组
    uploadFile: [{ name: '文件' }] as any,
    uploadFileList: [{ name: '文件' }] as any,
    preNode: '', // 前置节点ids
    preNodeList: [], // 前置节点list
    orderType: 0,
    uploadType: 1 as any,
    orderSendDay: '',
    quesId: '', // 关联问卷
    quesName: '', // 关联问卷名
    checkTemplateId: '',
    checkType: '' as any, // 验收类型
    personNumber: '',
    costs: '',
    notifyFlag: 0, // 是否通知交底,0否,1是
    finishNodeFlag: 0, // 是否施工结束节点,0否,1是
    startNodeFlag: 0, // 是否施工开始节点,0否,1是
    startWay: 0, // 开始方式：0-自动开始 1-手动开始 2-按规则开始
    finishWay: 0, // 结束方式：0-自动结束 1-手动结束 2-按规则结束
    nodeType: 0, // 节点类型，	节点类型 0-区间 1-动作
    materialConditionKeywords: '', // 材料条件关键词
    materialConditionType: 0, // 材料条件类型
    verifyRelative: 0, // 校验相对的时间类型：0-服务开始时间 1-施工开始时间 2-节点开始时间 3-节点完成时间
    verifyFlag: 0, // 是否需要校验 0-不校验 1-校验
    verifyOffsetDay: '', // 校验偏移天数
    verifyRelativeNodeId: 0, // 校验相对节点ID
    reviewFlag: 0, // 是否需要审查
    reviewerIds: [], // 审查人
    caonima: '',
    reviewer: [{ type: 0, skillIds: '' }], // 审查人
    doubtSettlList: [], // 结算比例
    notifyJob: [] // 通知岗位
  } as any // form表单
})
const validateDays = (rule: any, value: any, callback: any) => {
  if (value === '' || value < 1) {
    callback(new Error('要输入计划天数，且天数>0'))
  } else {
    callback()
  }
}
const rules = reactive({
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  executeJob: [
    { required: true, message: '请选择执行岗位', trigger: 'change' }
  ],
  planDay: [{ required: true, validator: validateDays, trigger: 'blur' }],
  groupNo: [{ required: true, message: '请选择节点分组', trigger: 'change' }],
  sendSkillId: [
    { required: true, message: '请选择被派单岗位', trigger: 'change' }
  ],
  skillId: [{ required: true, message: `必选`, trigger: 'change' }],
  quesId: [{ required: true, message: '请关联问卷', trigger: 'change' }],
  checkTemplateId: [
    { required: true, message: '请选择验收模板', trigger: 'change' }
  ],
  checkType: [{ required: true, message: '请选择验收类型', trigger: 'change' }],
  uploadGroup: [
    { required: true, message: '请选择分组类型', trigger: 'change' }
  ],
  uploadFileList: [
    { required: true, message: '请输入文件分组名', trigger: 'blur' }
  ],
  projectStageId: [
    { required: true, message: '请选择所属阶段', trigger: 'blur' }
  ],
  stageId: [{ required: true, message: '请选择所属阶段', trigger: 'blur' }],
  joinNodeId: [
    { required: true, message: '请选择关联的施工节点', trigger: 'blur' }
  ],
  materialConditionKeywords: [
    { required: true, message: '请输入关键词', trigger: 'change' }
  ],
  startExpressTranslate: [
    { required: true, message: '开始条件不能为空', trigger: 'change' }
  ],
  endExpressTranslate: [
    { required: true, message: '结束条件不能为空', trigger: 'change' }
  ],
  verifyRelative: [
    { required: true, message: '请选择相对时间类型', trigger: 'change' }
  ],
  reviewerIds: [{ required: true, message: '请选择审查人', trigger: 'change' }]
})

// 常用语的更新
const updateCommonWords = (data: any) => {
  if (configWordsType.value === 'start') {
    state.form.startCommonStatements = data
    state.form.finishCommonStatements = state.form.finishCommonStatements
  } else {
    state.form.finishCommonStatements = data
    state.form.startCommonStatements = state.form.startCommonStatements
  }
}

// 常用语配置
const toConfigWords = (type: string) => {
  commonWordsShow.value = true
  configWordsType.value = type
  state.commonStatements =
    type === 'start'
      ? state.form.startCommonStatements
      : state.form.finishCommonStatements
}

// 结算比例输入限制
const changeProportion = (val: any, i: number, name: string) => {
  let value: any = '' + val
  value =
    value
      .replace(/[^\d^\.]+/g, '') // 把不是数字，不是小数点的过滤掉
      .replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, '0.') // 如果输入的第一位为小数点，则替换成 0. 实现自动补全
      .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
  state.form.doubtSettlList[i][name] = value
}

// 新增结算比例
const addSettl = () => {
  state.form.doubtSettlList.push({
    finalPaymentStatus: 0, // 是否是尾款 1-是
    enabled: 1, // 是否启用 0-不启用 1-启用
    skillAcceptanceLimit: '', // 存疑天数
    skillAcceptanceRatio: '', // 支付比例
    skillId: '', // 岗位Id
    templateId: props.nodeData.templateId, // sop_project_template工程模板id
    templateNodeId: props.nodeId // 模板节点id
  })
}

// 为保存删除结算比列
const deleteSettl = (index: number, id: any) => {
  if (id) {
    ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await fetch({
        url: `/order/bizorderdoubtperiodconfig/remove/${id}`,
        method: 'delete'
      }).then((res: any) => {
        if (res.code == '0') {
          ElMessage.success('删除成功')
          getNodeDataById()
        }
      })
    })
  } else {
    let newList = state.form.doubtSettlList
    newList = [
      ...newList.slice(0, index),
      ...newList.slice(index + 1, newList.length)
    ]
    state.form.doubtSettlList = newList
    if (!state.form.doubtSettlList?.length) {
      state.form.settlementStatus = 0
    }
  }
}

const changeSettlementFlag = (val: any) => {
  if (val) {
    state.form.doubtSettlList.push({
      finalPaymentStatus: 0,
      enabled: 1,
      skillAcceptanceLimit: '',
      skillAcceptanceRatio: '',
      skillId: '',
      templateId: props.nodeData.templateId,
      templateNodeId: props.nodeId
    })
  } else {
    state.form.doubtSettlList = []
  }
}

// 编辑条件后的回调函数
const getExpressTranslate = (val: string, data: any) => {
  state.form[`${val}ExpressTranslate`] = data.expressTranslate
  const containerList: any = []
  containerList.push(data)
  const list: any =
    state.form.nodeExpressConfigs?.filter((item: any) => item.type != val) || []
  state.form.nodeExpressConfigs = [...new Set([...list, ...containerList])]
}
// 编辑后的回调
const getCollectionShowTranslate = (val: string, data: string) => {
  state.form[`onlineCollectExpress`] = data
}
// 点击条件编辑
const handelClickConditions = (val: string) => {
  state.form.nodeExpressConfigs?.forEach((item: any) => {
    if (item.type === val) {
      state.nodeExpressItem = item
    }
  })
  conditionsType.value = val
  launchShow.value = true
}

watch(
  () => launchShow.value,
  (newV) => {
    if (!newV) {
      state.nodeExpressItem = {}
    }
  }
)
// 点击收款计算试编辑
// 点击条件编辑
const handelClickCollection = () => {
  // conditionsType.value = val
  collectionShow.value = true
}
// 节点类型
const handelChangeNodeType = () => {
  if (state.form.nodeType == 1) state.form.planDay = 0
  else state.form.planDay = ''
}
// 创建和编辑节点的事件
const saveTemplateNode = () => {
  ruleForms.value.validate((valid: boolean) => {
    if (valid) {
      const obj: any = JSON.parse(JSON.stringify(state.form))
      obj.executeJob =
        Array.isArray(obj.executeJob) === true
          ? obj.executeJob.join(',')
          : obj.executeJob
      if (obj.businessType === '1002' && obj.orderType === 1) {
        obj.executeJob = 0
      } else if (!['1002', '1009', '1004', '1005'].includes(obj.businessType)) {
        // 不是派单、评价、施工、验收
        obj.skillName = ''
        obj.skillId = ''
      }
      obj.uploadFile = JSON.stringify(obj.uploadFileList)
      obj.materialConditionKeywords = obj.materialConditionKeywords?.toString()
      obj.verifyRelativeNodeId = Array.isArray(obj.verifyRelativeNodeId)
        ? obj.verifyRelativeNodeId[1]
        : obj.verifyRelativeNodeId

      const reviewer: any = []
      const reviewerData: any = []

      obj.reviewerIds &&
        obj.reviewerIds.forEach((res: any) => {
          if (res === '-2') {
            reviewer.push({
              type: 1,
              skillIds: [res]
            })
          } else {
            reviewerData.push(res)
          }
        })

      if (reviewerData.length > 0) {
        reviewer.push({
          type: 0,
          skillIds: reviewerData
        })
      } else if (reviewer.lenth === 0) {
        reviewer.push({
          type: 1,
          skillIds: ['-2']
        })
      }
      if (obj.reviewerIds && obj.reviewerIds.length > 0) {
        obj.reviewer = JSON.stringify(reviewer)
      } else {
        obj.reviewer = ''
      }

      if (obj.businessType === '1010') {
        obj.notifyJob = obj.notifyJob.join()
      } else {
        obj.notifyJob = ''
      }

      if (state.form.businessType === '1015') {
        obj.materialTemplateIds = obj.materialTemplateIds.join()
      } else {
        obj.materialTemplateIds = ''
      }

      const copyData = JSON.parse(JSON.stringify(state.form.doubtSettlList))
      // 保存存疑期比例
      state.jobsList.map((m: any) => {
        copyData.map((item: any) => {
          if (item.skillId === m.skillId) {
            item['skillName'] = m.skillName
            item.skillAcceptanceRatio = item.skillAcceptanceRatio / 100
          }
        })
      })

      obj.bizOrderDoubtPeriodConfigs = copyData
      // return
      if (props.isEdit) {
        // 编辑节点
        if (props.projectId == '0') {
          // 是否是模板

          // 不需要审核那么清空审核人的信息
          if (obj.reviewFlag == 0) {
            obj.reviewer = ''
            obj.reviewerIds = []
          }
          editTemplateNodeData(obj)
        }
      } else {
        // 创建节点
        if (props.projectId == '0') {
          // 是否是模板
          addTemplateNodeData(obj)
        } else {
          // 在项目上新增节点
          if (obj.businessType == '1005') {
            // templateNodeId暂时验收节点才加
            obj.templateNodeId = obj.joinNodeId
          }
          addProjectNodeData(obj)
        }
      }
    } else {
      ElMessage.warning('请填写所有信息')
    }
  })
}
// 在项目上添加节点
const addProjectNodeData = async (obj: any) => {
  await fetch({
    url: '/order/bizproject/projectnode/add',
    method: 'post',
    data: obj
  }).then((res: any) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `新增节点成功!`
      })
      handelClose()
      emit('getData')
    }
  })
}

// 在模板上添加节点
const addTemplateNodeData = async (obj: any) => {
  await fetch({
    url: `/order/soptemplate/node/create`,
    method: 'post',
    data: obj
  }).then((res: any) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `新增子节点成功!`
      })
      handelClose()
      emit('getData')
    }
  })
}
// 编辑节点
const editTemplateNodeData = async (obj: any) => {
  await fetch({
    url: `/order/soptemplate/node/update`,
    method: 'post',
    data: obj
  }).then((res) => {
    if (res.data) {
      ElMessage({
        type: 'success',
        message: `修改子节点成功!`
      })
      handelClose()
      emit('getData')
    }
  })
}

// 获取开单模板
const getBillingTemplate = async () => {
  await fetch({
    url: '/order/bizordermaterialtemplate/getCityOperatorMaterialTemplate',
    method: 'get'
  }).then((res: any) => {
    if (res.code == 0) {
      state.billingTemplates = res.data
    } else {
      ElMessage.error('开单模板获取失败')
    }
  })
}

// 关联功能的切换事件
const businessTypeChange = (e: any) => {
  if (e === '1012') {
    state.collectionParamShow = true
  } else {
    state.collectionParamShow = false
  }
  if (state.form.businessType === '1005') {
    state.form.checkType = ''
  }
  // 控制执行岗位是否多选
  if (['1004', '1005'].includes(state.form.businessType)) {
    selectSkillTypeStatus.value = false
    state.form.executeJob = ''
  } else {
    state.form.executeJob = ''
    setTimeout(() => {
      state.form.executeJob = []
      selectSkillTypeStatus.value = true
    }, 100)
  }

  // 开始方式和结束方式的默认
  if (
    !['1001', '1003', '1006', '1012', '1000'].includes(
      state.form.businessType
    )
  ) {
    state.form.startWay = 0
    state.form.finishWay = 0
  } else {
    state.form.startWay = 1
    state.form.finishWay = 1
  }
}

// 文件分组名添加和删除事件
const editorUploadFileList = (index: any, typeName: any) => {
  if (typeName === 'add') {
    state.form.uploadFileList.push({ name: '' })
  } else {
    state.form.uploadFileList.splice(index, 1)
  }
}

// 选择岗位时触发的事件
const getOrderSendJob = (e: any) => {
  // 1.派单节点，如果选择了外协工种JOB_ EXTERNAL,则需要配置关联问卷
  setExternal(e, state.form.businessType)
  state.jobsList.map((res: any) => {
    if (e === res.skillId) {
      state.selectJobCode = res.jobCode
      return
    }
  })
}
// 节点分组选择的事件
const handelGroupChange = (val: any) => {
  state.form.groupName = groupCodeList.value.filter(
    (item: any) => item.value === val
  )[0].label
}
// 选择关联问卷的事件，量房和交底
const handelQuesChange = (val: any) => {
  const tempName: any = state.questionnaireList.filter(
    (item: any) => item.id == val
  )
  if (tempName.length > 0) {
    state.form.quesName = tempName[0].surveyName
  }
}

// 监听岗位id获取岗位名称和code
watch(
  () => state.form.skillId,
  (newVal, oldVal) => {
    const tempName: any = state.jobsList.filter(
      (item: any) => Number(item.skillId) === Number(newVal)
    )
    if (tempName.length === 0) {
      return
    }
    state.form.skillName = tempName[0].skillName
    state.form.jobCode = tempName[0].jobCode
  }
)
// 查询上传的分组类型,数据字典
const getUploadGroupTypeList = async () => {
  await fetch({
    url: `/admin/dict/type`,
    method: 'get',
    params: {
      type: 'sop_upload_file_type'
    }
  }).then((res) => {
    if (res.data) {
      state.uploadGroupTypeList = res.data
    }
  })
}

// 查询验收模板
const getAcceptanceList = async () => {
  await fetch({
    url: `/basic/acceptance_template/getAllTemplates`,
    method: 'get'
  }).then((res) => {
    if (res.data) {
      state.acceptanceTypeList = res.data
    }
  })
}

// 获取测量和交底所用问卷
const getSurveyTemplatesList = async () => {
  state.questionnaireList = []
  await fetch({
    url: `/basic/surveytemplate/getAllTemplates`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      state.questionnaireList = res.data
    }
  })
}

// 前置节点组件事件返回数据ids和List
const getNodeIds = (e: any, row: any) => {
  state.form.preNode = e
}
// 获取岗位和工种
const getSysjobsList = () => {
  sysjobsList({}).then((res) => {
    state.jobsList = res.data
    setExternal(state.form.executeJob, state.form.businessType)
  })
  sysjobsList({ type: 2 }).then((res) => {
    state.workList = res.data
  })
}

// 根据节点id获取节点内容
const getNodeDataById = async () => {
  await fetch({
    url: `/order/soptemplate/node/${props.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    // 业务类型是否是收款
    if (res.data.businessType == '1012') {
      state.collectionParamShow = true
    }
    // 是否编辑
    state.form = res.data

    state.form.uploadFileList =
      typeof state.form.uploadFile === 'string'
        ? JSON.parse(state.form.uploadFile)
        : [{ name: '文件' }]
    if (['1004', '1005'].includes(state.form.businessType)) {
      selectSkillTypeStatus.value = false
      // 验收、施工单选
      state.form.executeJob = state.form.executeJob
    } else {
      selectSkillTypeStatus.value = true
      state.form.executeJob = state.form.executeJob.split(',')
    }
    // 开单模板
    if (state.form.businessType === '1015') {
      state.form.materialTemplateIds =
        state.form.materialTemplateIds?.split(',')
    }
    // 交底通知岗位
    if (state.form.businessType === '1010') {
      state.form.notifyJob = state.form.notifyJob
        ? state.form.notifyJob.split(',')
        : []
    }
    state.form.materialConditionKeywords =
      state.form.materialConditionKeywords?.split(',')
    state.form.reviewer = state.form.reviewer
      ? JSON.parse(state.form.reviewer).forEach((item: any) => {
        state.form.reviewerIds = state.form.reviewerIds
          ? state.form.reviewerIds.concat(item.skillIds)
          : [].concat(item.skillIds)
      })
      : []

    // 申请结算你内容
    if (res.data.periodConfigs && res.data.periodConfigs.length) {
      res.data.periodConfigs.map((item: any) => {
        item.skillAcceptanceRatio = item.skillAcceptanceRatio * 100
      })
    }
    state.form.doubtSettlList = res.data.periodConfigs

    // if (['1005'].includes(state.form.businessType) && state.form.joinNodeId) {
    //   getOrderJoinNodeId(state.form.joinNodeId)
    // }
  })
}
const nodeClick = (node: any) => {
  state.form.quesId = node.quesId
  state.form.quesName = node.quesName
  ruleForms.value.validateField('quesId', (valid: boolean) => { })
}

// 获取项目阶段
const getProjectStage = async () => {
  await fetch({
    url: '/order/bizproject/projectstage/list',
    method: 'get',
    params: {
      projectId: props.projectId
    }
  }).then((res: any) => {
    state.projectStageList = res.data
  })
}

// 获取项目模板列表信息
const getProjectTemplateList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/default`,
    method: 'get'
  }).then((res) => {
    if (res.data) {
      // 当有模板时
      state.stages = JSON.parse(JSON.stringify(res.data.stages))
      // 获取项目模板下对应的阶段和节点
      if (props.nodeData?.templateId) return
      constructionNodeData.value = []
      res.data.stages.forEach((item: any) => {
        constructionNodeData.value = constructionNodeData.value.concat(
          item.nodes.filter((item2: any) => {
            return item2.businessType == '1004'
          })
        )
      })
    }
  })
}

const getConstructionNodeDataList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/soptemplate/view/${state.form.templateId}`,
    method: 'get'
    // params: {
    //   businessType: '1004'
    // }
  }).then((res) => {
    if (res.data) {
      state.stages = JSON.parse(JSON.stringify(res.data.stages))
      // 获取项目模板下对应的阶段和节点
      if (props.addType === 'customAdd') {
        // 如果是在项目里添加节点
        getProjectNodeList()
      } else {
        constructionNodeData.value = []
        res.data.stages.forEach((item: any) => {
          constructionNodeData.value = constructionNodeData.value.concat(
            item.nodes.filter((item2: any) => {
              return item2.businessType == '1004'
            })
          )
        })
      }
    }
  })
}

// 项目中验收节点关联施工节点时 获取施工节点列表
const getProjectNodeList = async () => {
  // 页面初始化时调用
  await fetch({
    url: `/order/project/projectNode/list/${props.projectId}`,
    method: 'get'
  }).then((res) => {
    if (res.data) {
      constructionNodeData.value = []
      constructionNodeData.value = res.data.filter(
        (item: any) => item.businessType == '1004'
      )
    }
  })
}

const dataFilter = (val: string) => {
  const value = val.replace(/\s*/g, '')
  if (value) {
    // 去除筛选条件的空格筛选数组
    if (state.form.businessType == '1004') {
      const worksCopy = state.workList
      state.workList = worksCopy.filter((item: any) => {
        if (
          !!~item.skillName.indexOf(value) ||
          !!~item.skillName.toUpperCase().indexOf(value.toUpperCase())
        ) {
          return true
        }
      })
    } else {
      const jobsCopy = state.jobsList
      state.jobsList = jobsCopy.filter((item: any) => {
        if (
          !!~item.skillName.indexOf(value) ||
          !!~item.skillName.toUpperCase().indexOf(value.toUpperCase())
        ) {
          return true
        }
      })
    }
  } else {
    // val为空时，还原数组
    getSysjobsList()
  }
}

onMounted(() => {
  state.form.templateId = props.nodeData?.templateId
  if (props.isEdit) {
    // 根据节点id获取节点内容
    getNodeDataById()
  } else {
    if (props.projectId != '0') {
      state.form.projectId = props.projectId
      // 获取项目阶段
      getProjectStage()
      state.form.templateNodeId = '0'
      state.form.preNodes = []
    } else {
      state.form.stageId = props.nodeData.stageId
    }
  }
  // 获取岗位和工种
  getSysjobsList()
  // 获取测量和交底的问卷列表
  getSurveyTemplatesList()
  // 查询验收模板
  getAcceptanceList()
  // 获取文件上传分组列表
  getUploadGroupTypeList()
  // 获取项目阶段列表
  if (props.nodeData?.templateId) {
    getConstructionNodeDataList()
  } else {
    getProjectTemplateList()
  }
  // 获取开单模板
  getBillingTemplate()
})

const getOrderJoinNodeId = (item: any) => {
  // 如果是编辑，则直接获取state.form中的节点ID
  fetch({
    url: `/order/soptemplate/node/${item}`,
    method: 'get'
  }).then((res: any) => {
    if (res) {
      setExternal(res.data.executeJob, res.data.businessType)
    }
  })
}

const handelClose = () => {
  dialogShow.value = false
  emit('update:modelValue', false)
}
watchEffect(() => {
  dialogShow.value = props.modelValue
})

// 如果是判断节点，则需要判断被派单人员是否是外协工种，是则回显关联问卷
const setExternal = (e: any, businessType: any) => {
  return
  if (['1002', '1004'].includes(businessType)) {
    const skillId = e || state.form.skillId
    const skillObject = state.jobsList.find(item => Number(item.skillId) === Number(skillId))

    // console.log('skillObject',skillObject);

    if (skillObject && skillObject.jobCode === 'JOB_OUTSOURCING') {
      state.external = true
    } else {
      state.external = false
      state.form.quesId = ''
    }
  }
}
</script>

<style scoped lang="less">
.uploadFile-item {
  margin-bottom: 5px;
  min-width: 86%;

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

.business-type-contain {
  padding-top: 0.3rem;
  width: 100%;
  margin-bottom: -2rem;

  .el-radio {
    margin-right: 4rem;
    /*margin-bottom: 10px;*/
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

.sett-table {
  margin-bottom: 3rem;

  .el-table {
    height: auto !important;
  }
}
</style>
