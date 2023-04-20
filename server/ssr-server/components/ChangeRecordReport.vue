<template>
  <div class="pdf-container" v-if="props.data.data">
    <div class="top-contain">
      <div class="top-line"></div>
      <div class="top-title">
        <span class="main-title">觅活现场变更签证确认单</span>
      </div>
    </div>
    <div v-if="props.data.data.id" class="middle-contain">
      <div class="name">
        由于<span class="item-name">{{ props.data.data.description }}</span>
        的原因，工地地址在<span class="item-name">{{
          props.data.data.stageName
        }}</span
        >发生现场变更，经双方合议,本变更签证起因为:<span class="item-name">{{
          getName(props.data.data.changeType, changeTypeList)
        }}</span
        >， 双方确认变更责任方为:<span class="item-name">{{
          handleUserInputsName
        }}</span
        >，甲乙双方确定签证内容，相关方同意合同条款附加本次签证确认单内容执行。
      </div>
      <div class="text-contain">
        <div v-if="props.data.data.projectInfo" class="item-text">
          <span class="label">项目名称</span>
          <span class="value">{{ props.data.data.projectInfo.projectName }}</span>
        </div>
        <div v-if="props.data.data.projectInfo" class="item-text">
          <span class="label">工地地址</span>
          <span class="value"
            >{{ props.data.data.projectInfo.poiName
            }}{{ props.data.data.projectInfo.address
            }}{{ props.data.data.projectInfo.latAddress }}</span
          >
        </div>
        <div class="item-text">
          <span class="label">服务团队</span>
          <div class="user-list">
            <span
              class="value user-name"
              v-for="(item, index) in team"
              :key="index"
            >
              <span>{{ item.name }}</span>
              <span v-if="item.skillName">({{ item.skillName }})</span>
            </span>
          </div>
        </div>
        <div v-if="props.data.data.projectInfo" class="item-text">
          <span class="label">工期计划</span>
          <span class="time"
            >{{ props.data.data.projectInfo.expectStartTime }} 至
            {{ props.data.data.projectInfo.expectFinishTime }}
          </span>
          <span v-if="getTime()" class="time-total"
            >共{{ getTime() }}个工作日</span
          >
        </div>
        <div class="item-text">
          <span class="label">签证类型</span>
          <span class="value">{{
            getName(props.data.data.type, visaTypeList)
          }}</span>
        </div>
        <div v-if="props.data.data.content" class="item-text">
          <span class="label">签证内容</span>
          <span class="value">{{ props.data.data.content }}</span>
        </div>
        <div class="item-text">
          <span class="label">当前工序</span>
          <span class="value">{{ props.data.data.stageName }}</span>
        </div>
        <div v-if="props.data.data.description" class="item-text">
          <span class="label">变更描述</span>
          <span class="value">{{ props.data.data.description }}</span>
        </div>
        <div class="item-text">
          <span class="label">变动起因</span>
          <span class="value">{{
            getName(props.data.data.changeType, changeTypeList)
          }}</span>
        </div>
        <div class="item-text">
          <span class="label">定责合议</span>
          <span class="value">{{ handleUserInputsName }}</span>
        </div>
        <div class="item-text">
          <span class="label">变更日期</span>
          <span class="value">{{
            props.data.data.created && props.data.data.created.substring(0, 10)
          }}</span>
        </div>
      </div>
    </div>
    <div class="bottom-contain">
      <span class="addres">联系我们：昆明市西山区云纺国际商厦A座15楼 </span>
      <span class="phone">0871-588888888</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isShowLog: {
    type: Boolean,
    default: false
  }
})
const visaTypeList = [
  {
    name: '人工费变更',
    value: 1
  },
  {
    name: '服务费变更',
    value: 2
  },
  {
    name: '订单费变更',
    value: 3
  },
  {
    name: '工期变更',
    value: 4
  },
  {
    name: '材料定额变更',
    value: 5
  },
  {
    name: '验收标准变更',
    value: 6
  }
]

const changeTypeList = [
  {
    name: '项目实施增减',
    value: 1
  },
  {
    name: '项目标准改变',
    value: 2
  },
  {
    name: '主辅材料改变',
    value: 3
  },
  {
    name: '图纸方案改变',
    value: 4
  },
  {
    name: '工况环境变化',
    value: 5
  },
  {
    name: '设备参数变化',
    value: 6
  },
  {
    name: '不可预知情况',
    value: ''
  }
]

const getTime = () => {
  if (
    props.data.data.projectInfo.expectStartTime &&
    props.data.data.projectInfo.expectFinishTime
  ) {
    let time = dayjs(props.data.data.projectInfo.expectFinishTime).diff(
      dayjs(props.data.data.projectInfo.expectStartTime),
      'days'
    )
    return Math.abs(time) 
  }
  return ''
}

const team = computed(() => {
  let list: any = []
  if (props.data.data.projectMemberGroupOutputs) {
    props.data.data.projectMemberGroupOutputs.forEach((item: any) => {
      if (item.members) {
        item.members.forEach((item2: any) => {
          list.push({
            skillName: item.skillName,
            name: item2.name,
            phone: item2.phone
          })
        })
      }
    })
  }

  return list
})

const handleUserInputsName = computed(() => {
  let list: any = []
  if (props.data.data.handleUserInputs) {
    props.data.data.handleUserInputs.forEach((item: any) => {
      list.push(item.handleSkillName)
    })
  }
  return list.length > 0 ? list.join('、') : ''
})

// 根据value获取label
const getName = (value: string, list: any) => {
  return list.find((item: any) => item.value == value)?.name
}

if (props.isShowLog) {
  console.log('-------------变更报告-------------', props.data.data)
}
</script>

<style scoped>
.pdf-container {
  padding: 0px;
}

.top-line {
  width: 100%;
  height: 10px;
  background-color: #002fa5;
}

.top-title {
  background-color: #f5f5fa;
  text-align: center;
  font-weight: bold;
  height: 84px;
  line-height: 84px;
}

.main-title {
  font-size: 26px;
}

.item-name {
  color: #3d3d3d;
  font-size: 14px;
  font-weight: bold;
}

.middle-contain {
  padding-bottom: 88px;
}

.middle-contain > .name {
  padding: 16px 45px 30px 45px;
  font-size: 14px;
  font-weight: normal;
  line-height: 26px;
}

.middle-contain > .text-contain {
  padding: 0px 38px 0px 38px;
  font-size: 14px;
  font-weight: normal;
  line-height: 26px;
}

.item-text {
  margin-bottom: 20px;
  line-height: 1;
  display: flex;
}

.item-text:last-child {
  margin-bottom: 0px;
}

.label {
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
  color: #303133;
  white-space: nowrap;
}

.value {
  font-size: 14px;
  line-height: 22px;
  color: #606166;
  margin-left: 15px;
  display: inline-block;
}

.time,
.time-total {
  font-size: 14px;
  line-height: 22px;
  color: #606166;
  margin-left: 15px;
}

.user-name:first-child {
  margin-left: 15px;
}

.user-name {
  margin-left: 25px;
}

.time-total {
  margin-left: 25px;
}

.flex-center {
  display: flex;
  align-items: center;
}

.bottom-contain {
  width: 100%;
  height: 55px;
  background-color: #f5f5fa;
  text-align: center;
  line-height: 55px;
}

.addres,
.phone {
  font-size: 12px;
  color: #909199;
}

.phone {
  margin-left: 20px;
}
</style>
