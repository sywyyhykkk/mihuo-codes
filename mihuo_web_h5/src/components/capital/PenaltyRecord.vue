<template>
  <div>
    <el-drawer
      v-model="state.payTypeShow"
      title="罚款记录"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="my-drawer__body">
        <div class="body-info">
          <div class="body-item">
            <div class="body-title">订单号</div>
            <div class="body-text">{{state.stepList&&state.stepList.orderId?state.stepList.orderId:''}}</div>
          </div>
          <div class="body-item">
            <div class="body-title">岗位</div>
            <div class="body-text">{{state.stepList&&state.stepList.skillName?state.stepList.skillName:''}}</div>
          </div>
          <div class="body-item">
            <div class="body-title">人员姓名</div>
            <div class="body-text">{{state.stepList&&state.stepList.personName? state.stepList.personName:''}}</div>
          </div>
          <div class="body-item">
            <div class="body-title">联系电话</div>
            <div class="body-text">{{state.stepList&&state.stepList.personMobile?state.stepList.personMobile:''}}</div>
          </div>
          <div class="body-item">
            <div class="body-title">项目信息</div>
            <div class="body-text">{{state.stepList&&state.stepList.projectInfo?state.stepList.projectInfo:''}}</div>
          </div>
        </div>
        <div style="padding: 4rem;">
          <template v-if="state.stepList&&state.stepList.feitSettlementDTOList&&state.stepList.feitSettlementDTOList.length">
            <dotStep v-for="(item,index) in state.stepList.feitSettlementDTOList" :key="index">
              <template #stepTitle>
                <div class="time-info">
                  <span>{{ item.forfeitTime }}</span>
                </div>
              </template>
              <template #stepDetial>
                <div>
                  <div class="person-info">
                    <img class="person-img"
                         :src="item.avatar?$getUrl.getPicUrl(item.avatar, true):require('@/assets/img/avatar.png')">
                    <div class="person-name">{{ item.dealPersonName }}（{{ item.dealSkillName }}）</div>
                  </div>
                  <div class="describe">
                    <div class="describe-left">
                      <span>罚款金额:<i>9{{ item.forfeitPrice || 0 }}元</i></span>
                      <span>积分:<i>{{ item.forfeitIntegral || 0 }}分</i></span>
                      <span>禁单天数:<i>{{ item.forbiddenDays || 0 }}天</i></span>
                    </div>
                    <div class="describe-right">
                        <span :class="'status status_1'">
                          工人申述中
                        </span>
                    </div>
                  </div>
                  <div class="describe-reason row">
                    <div>处罚原因</div>
                    <span>{{ item.forfeitReson }}</span>
                  </div>
                  <div class="problem row">
                    <div>存在问题</div>
                    <span>{{ item.content }}</span>
                  </div>
                </div>
              </template>
            </dotStep>
          </template>
          <el-empty v-else description="暂无罚款记录" />
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  }
})
const emit = defineEmits()

const curData = inject('curData') as any

const state = reactive({
  payTypeShow: false,
  stepList: {
    orderId:null,
    skillName:null,
    personName:null,
    personMobile:null,
    projectInfo:null,
    feitSettlementDTOList:[]
  } as any
})
watchEffect(() => {
  state.payTypeShow = props.modelValue
  if (state.payTypeShow) {
    getOfferInfo()
  }
  console.log('props.payTypeShow', props.modelValue)
})

const closeHandelDrawer = () => {
  state.payTypeShow = false
  emit('update:modelValue', false)
}
const getOfferInfo = async () => {
  let query = {
    orderId: Number(curData.value.orderId),
    personId: Number(curData.value.personId),
    projectId: Number(curData.value.projectId),
  }
  await fetch({
    url: `/order/bizorderforfeit/getForfeitSettlement`,
    method: 'post',
    data: query
  }).then((res: any) => {
    state.stepList = res.data || {}
  })
}
onMounted(() => {
  state.payTypeShow = props.modelValue
})

</script>

<style scoped lang="less">
.check-look {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #0969DA;
  margin-top: 2rem;
  cursor: pointer;
}

.check-info {
  padding: 1.2rem !important;
  margin-top: 1rem;
}

.step-time {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #909399;
}

.edit-text {
  color: #1A1A1A;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-top: 1.2rem;
}


.time-info {
  color: #909399;
  font-size: 1.2rem;
}

.describe {
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .describe-left {
    span {
      color: #303133;
      font-size: 1.4rem;
      padding-right: 2rem;

      &:last-child {
        padding-right: 0;
      }

      i {
        color: #F56C6C;
        font-style: normal;
        padding-left: .5rem;
      }
    }
  }

  .describe-right {
    .status {
      font-size: 1.2rem;
      padding: .7rem 1rem;
      border-radius: 1.3rem;

      &.status_1 {
        background: #FDF6EC;
        color: #F2AA3D;
      }

      &.status_2 {
        background: #F0F9EB;
        color: #67C23A;
      }

      &.status_3 {
        background: #FEF0F0;
        color: #F56C6C;
      }
    }
  }
}

.row {
  padding-top: 1.5rem;
  display: flex;
  flex-flow: row wrap;
  font-size: 1.2rem;

  & > div {
    width: 7rem;
    color: #909399;
  }

  span {
    flex: 1;
    color: #303133;
    padding-left: 1rem;
  }
}

.person-info {
  display: flex;
  align-items: center;

  .person-img {
    width: 2rem;
    height: 2rem;
    //background: #0969DA;
    border-radius: 50%;
  }

  .person-name {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 500;
    color: #303133;
    margin-left: 0.8rem;
  }
}

.body-info {
  background: #ffffff;
  //margin: 0 -2rem;
  padding: 4rem 4rem 2rem 4rem;

  .body-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    .body-title {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #909399;
    }

    .body-text {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #1A1A1A;
    }
  }
}


</style>
