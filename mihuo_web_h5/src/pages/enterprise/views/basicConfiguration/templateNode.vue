<template>
  <div class="template-node">
    <el-form
      ref="templateFormPhaseChildRef"
      :rules="rulesChildNode"
      :model="formNode"
      label-width="120px"
      size="small"
    >
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="formNode.name" />
      </el-form-item>
      <el-form-item label="关联功能" prop="businessType">
        <div class="business-type-contain">
          <el-radio-group
            v-model="formNode.businessType"
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
      <slot name="foot" />
      <slot name="fo" />
      <slot name="footer" />
      <el-form-item label="偏移天数" prop="offsetDay">
        <el-input
          v-model="formNode.offsetDay"
          type="number"
          style="width: 150px"
        >
          <template #append>天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="节点分组" prop="groupNo">
        <el-select
          v-model="formNode.groupNo"
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
          v-model="formNode.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const businessTypeList = ref<any>([
      { label: '选材', value: 1001 },
      { label: '交底', value: 1010 },
      { label: '量房', value: 1011 },
      { label: '派单', value: 1002 },
      { label: '预算', value: 1003 },
      { label: '施工', value: 1004 },
      { label: '上传', value: 1006 },
      { label: '验收', value: 1005 },
      { label: '评价', value: 1009 }
    ])
    const templateFormPhaseChildRef = ref()
    const groupCodeList = ref([])
    const state = reactive<any>({
      formNode: {
        name: '',
        businessType: 1001, // 默认节点
        executeJob: 0,
        executeJobIdList: 0, // 执行岗位
        jobCode: '',
        skillName: '',
        skillId: '', // 被派岗位id
        planDay: '',
        offsetDay: '',
        groupName: '',
        groupNo: 1001,
        remark: '',
        treeCode: '',
        materialType: 1001,
        orderServicePack: 0,
        checkName: '',
        uploadGroup: 0,
        uploadFile: [],
        preNode: '',
        orderType: 1,
        uploadType: 1,
        orderSendDay: '',
        quesId: 0,
        quesName: '',
        checkTemplateId: '',
        checkType: 1,
        personNumber: '',
        costs: ''
      }
    })

    // const rulesChildNode = reactive({
    //   name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
    //   executeJobIdList: [
    //     { required: true, message: '请选择执行岗位', trigger: 'change' }
    //   ],
    //   planDay: [{ required: true, message: '请输入计划天数', trigger: 'blur' }],
    //   groupNo: [
    //     { required: true, message: '请选择节点分组', trigger: 'change' }
    //   ],
    //   sendSkillId: [
    //     { required: true, message: '请选择被派单岗位', trigger: 'change' }
    //   ],
    //   quesId: [{ required: true, message: '请关联问卷', trigger: 'change' }]
    //   // orderServicePack: [{ required: true, message: '请选择服务包', trigger: 'change' }]
    // })

    return {
      // rulesChildNode,
      groupCodeList,
      businessTypeList,
      templateFormPhaseChildRef,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>
