<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="修改订单"
      v-model="dialogShow"
      @close="handelClose"
      width="55rem"
    >
      <el-form ref="ruleForms" :model="state.form" :rules="state.rules" label-width="11rem">
        <div class="form-group">需求</div>
        <el-form-item label="需求描述" prop="templateId">
          <el-input type="textarea" v-model="state.form.requirementDesc"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="templateId">
          <uploadImage 
            v-model="state.imgList"
            :max-count="9"
           />
        </el-form-item>
        <div class="form-group">订单详情</div>
        <el-form-item label="上门时间" prop="startDate">
          <el-date-picker
            v-model="state.form.expectDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 19rem"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计工期" prop="startDate">
          <el-input style="width: 19rem" type="tel" v-model="state.form.expectDuration" oninput="value=value.replace(/[^0-9.]/g, '').replace('.','')">
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="预估费用" prop="startDate">
          <el-input style="width: 19rem" v-model="state.form.referencePrice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单类型" prop="templateId">
          <el-select
            v-model="state.form.publishType"
            filterable
            placeholder="请选择模板"
          >
            <el-option
              v-for="item in state.orderTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="议价类型" prop="templateId">
          <el-select
            v-model="state.form.priceWay"
            filterable
            placeholder="请选择模板"
          >
            <el-option
              v-for="item in state.priceWayList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报价" prop="startDate" v-if="state.form.priceWay != 3">
          <el-input style="width: 19rem" v-model="state.form.price">
            <template #append>元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="loading" @click="handleConfirm()"
          >确 定</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { async } from '@antv/x6/lib/registry/marker/main'
import { defineEmits, defineProps, reactive, ref, watchEffect, onMounted } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {//状态
    type: Boolean,
    default: false
  }, data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:modelValue','getSendOrderList'])
const dialogShow = ref<boolean>(false)
const state = reactive({
  orderTypeList: [{
    value: 1,
    name: '个人发布（外部）'
  },{
    value: 2,
    name: '企业发布（内部）'
  },{
    value: 3,
    name: '企业发布（外部）'
  }],
  priceWayList: [{
    value: 1,
    name: '一口价'
  },{
    value: 2,
    name: '竞价'
  },{
    value: 3,
    name: '快速呼叫'
  }],
  form: {} as any,
  imgList: [] as any
})
const handelClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = async () => {
  let arr = [] as any
  state.imgList.split(',').map((item:any) => {
    arr.push({
      type: 'img',
      url: item
    })
    state.form.attachments = arr
  })
  await fetch({
    url: 'order/biz_order',
    method: 'put',
    data: state.form
  }).then((res:any) => {
     if (res.data) {
      ElMessage.success(res.msg)
      handelClose()
      emit('getSendOrderList')
    }
  })
}

onMounted(() => {
  state.form = props.data
  let str = '';
  props.data.attachments&&JSON.parse(JSON.parse(props.data.attachments)[0].attachments).map((item:any) => {
    if(item.type==='img'){
      str += item.url + ','
    }
  })
  state.imgList = str.substr(0, str.length -1)
})

watchEffect(() => {
  dialogShow.value = props.modelValue
})


</script>

<style scoped lang="less">
.form-group {
  font-size: 14px;
  font-weight: bold;
  color: #0969DA;
  margin-top: 30px;
}

</style>
