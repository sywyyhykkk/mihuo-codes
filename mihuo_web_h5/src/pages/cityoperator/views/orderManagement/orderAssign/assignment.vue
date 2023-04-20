<template>
  <div>
    <el-card shadow="never">
      <el-form
        ref="ruleForms"
        :model="form"
        label-width="120px"
        style="width: 600px"
        size="small"
      >
        <el-form-item label="订单编号:">
          {{ form.orderSn }}
        </el-form-item>
        <el-form-item label="用户账号:">
          {{ form.memberId }}
        </el-form-item>
        <el-form-item label="创建时间:">
          {{ form.createTime }}
        </el-form-item>
        <el-form-item label="订单金额:">
          {{ form.totalAmount }}
        </el-form-item>
        <el-form-item label="订单状态:">
          {{ getOrderStatus(form.status) }}
        </el-form-item>
        <el-form-item label="订单类型:">
          {{ form.serviceType === '0' ? '商品' : '服务' }}
        </el-form-item>
        <el-form-item label="订单分类:">
          {{ form.orderType === 1 ? '秒杀订单' : '正常订单' }}
        </el-form-item>
        <el-form-item label="支付方式:">
          {{
            form.payType === 1
              ? '支付宝支付'
              : form.payType === 2
              ? '微信支付'
              : '未支付'
          }}
        </el-form-item>
        <el-form-item label="指派服务:">
          <el-select
            v-model="service"
            placeholder="请选择要指派的服务"
            :clearable="true"
          >
            <el-option
              v-for="item in skillsOptions"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派人员:">
          <el-select
            v-model="person"
            placeholder="请选择要指派的人员"
            :clearable="true"
          >
            <el-option
              v-for="item in peopleOptions"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button
            style="margin-left: 15px"
            size="mini"
            :disabled="person === '' || service === ''"
            @click="handleConfirmAssignment"
            >确定
          </el-button>
        </el-form-item>
        <el-form-item label="已指派:">
          <div v-for="item in assignments" :key="item">
            服务: {{ item.service.label }} 人员:
            {{ item.person.label }}
          </div>
        </el-form-item>
        <el-form-item label="操作:">
          <el-button size="mini" @click="handleClearAssignment"
            >重新指派
          </el-button>
          <el-button size="mini" @click="handleSaveAssignment">保存 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { getOrderStatus, getSkillName } from '@/utils/utils'
import { assignOrder } from '_@/api/order'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: {},
  props: {
    orderForm: {
      type: Object,
      default: null,
    },
    people: {
      type: Array,
      default: [],
    },
  },
  emits: ['getData'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      form: props.orderForm,
      service: '',
      person: '',
      skillsOptions: [] as any,
      peopleOptions: props.people,
      assignments: [] as any,
    })

    onMounted(() => {
      getRequiredSkill()
    })

    const getRequiredSkill = () => {
      const obj = {
        value: state.form.skillId,
        label: getSkillName(Number(state.form.skillId)),
      }
      state.skillsOptions.push(obj)
    }

    const handleConfirmAssignment = () => {
      const assignmentObj = {
        service: state.service,
        person: state.person,
      }
      state.assignments.push(assignmentObj)
      state.service = ''
      state.person = ''
    }

    const handleClearAssignment = () => {
      state.service = ''
      state.person = ''
      state.assignments = []
    }

    const handleSaveAssignment = async () => {
      if (state.assignments.length === 0) {
        ElMessage.warning('请选择要指派的服务!')
        return
      }
      await assignOrder([
        {
          orderItemSn: state.form.orderItemSn,
          person: state.assignments[0].person.value,
        },
      ]).then((res) => {
        ElMessage.success('指派成功!')
        emit('getData')
      })
    }

    return {
      ruleForms,
      getOrderStatus,
      handleConfirmAssignment,
      handleClearAssignment,
      handleSaveAssignment,
      getRequiredSkill,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>
