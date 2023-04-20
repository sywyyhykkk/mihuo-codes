<template>
  <div>
    <el-drawer
      v-model="state.showDrawer"
      title="验收信息"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="accept-drawer">
        <div style="display: flex">
          <div class="accept-person">
            <img :src="$getUrl.getPicUrl(state.acceptData.acceptanceCreateAvatar)" class="accept-img">
            <span
              style="margin-left: 1rem">{{ state.acceptData.acceptanceCreateName
              }}({{ state.acceptData.acceptanceCreateSkillName }})</span>
            <span style="margin-left: 1rem;color: #909399">{{ state.acceptData.acceptanceCreateTime }}</span>
            <span v-if="state.acceptData.statusFlag==1" style="margin-left: 1rem;color: #2DA44E">验收通过</span>
            <span v-if="state.acceptData.statusFlag==2" style="margin-left: 1rem;color:#F56C6C">验收未通过</span>
          </div>
        </div>
        <div class="accept-value">
          <span> {{ state.acceptData.score }}分</span>
          <el-tag round style="margin-left: 1rem">
            {{ $getNum.numAdd(Number(state.acceptData.qualifiedCount), Number(state.acceptData.unqualifiedCount)) + Number(state.acceptData.notCount)
            }}项验收
          </el-tag>
          <el-tag type="success" round style="margin-left: 1rem">{{ state.acceptData.qualifiedCount }}项合格</el-tag>
          <el-tag type="danger" round style="margin-left: 1rem">{{ state.acceptData.unqualifiedCount }}项不合格</el-tag>
          <el-tag type="info" round style="margin-left: 1rem">{{ state.acceptData.notCount }}项不合格</el-tag>
        </div>
        <div style="padding: 0 2rem">
          <div class="accept-name">
            <p>{{ state.acceptData.name }}</p>
          </div>
          <div v-for="(item,index) in state.acceptData.items">
            <acceptQuest :dataIndex="index+1" :data="item"  />
          </div>
        </div>
      </div>

    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getCurrentInstance } from '@vue/runtime-core'

const { proxy } = getCurrentInstance()
const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  }, acceptId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits()


const state = reactive({
  showDrawer: false,
  acceptData: {} as any
})

//查询验收详情
const getAcceptDetailData = async () => {
  await fetch({
    url: `/order/bizorderacceptance/getAcceptance/${props.acceptId}`,
    method: 'get'
  }).then((res: any) => {
    state.acceptData = res.data
    console.log(state.acceptData,"state.acceptData")
    state.acceptData.acceptanceCreatePersonId ? proxy.$getUserById(state.acceptData.acceptanceCreatePersonId.split(','), (res: any) => {
      res.data.map((el: any) => {

        state.acceptData['acceptanceCreateName'] = el.name
        state.acceptData['acceptanceCreateAvatar'] = el.avatar
        state.acceptData['acceptanceCreateSkillName'] = el.skillName
        state.acceptData['acceptanceCreateSkillId'] = el.skillId
      })
    }) : ''
  })
}
watchEffect(() => {
  state.showDrawer = props.modelValue
  if (state.showDrawer) {
    getAcceptDetailData()
  }
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}


</script>>

<style scoped lang="less">
.accept-name {
  font-size: 12px;
  font-weight: bold;
  color: #1A1A1A;
  line-height: 18px;
  border-bottom: solid 1px #F3F4F8;
  padding-bottom: 12px;
}

.accept-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.accept-person {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #1A1A1A;
  height: 34px;
  background: #F5F7FA;
  border-radius: 17px;
  padding: 0 12px 0 5px;
}

.accept-value {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  padding-left: 3.4rem;
  margin-bottom: 2rem;
  font-size: 14px;
  color: #0969DA;
}
</style>
