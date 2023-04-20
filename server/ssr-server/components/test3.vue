<template>
  <div class="pdf-container">
    <div class="top-contain">
      <div class="top-line"></div>
      <div class="top-title">
        <span class="main-title">觅活现场变更签证确认单</span>
      </div>
    </div>
    <div v-if="props.data.id" class="middle-contain">
      <div class="name">
        由于<span class="item-name">{{ props.data.description }}</span>
        的原因，工地地址在<span class="item-name">{{
          props.data.stageName
        }}</span
        >发生现场变更，经双方合议,本变更签证起因为:<span class="item-name">{{
          getName(props.data.changeType, changeTypeList)
        }}</span
        >， 双方确认变更责任方为:<span class="item-name">{{
          handleUserInputsName
        }}</span
        >，甲乙双方确定签证内容，相关方同意合同条款附加本次签证确认单内容执行。
      </div>
      <div class="text-contain">
        <div v-if="props.data.projectInfo" class="item-text">
          <span class="label">项目名称</span>
          <span class="value">{{ props.data.projectInfo.projectName }}</span>
        </div>
        <div v-if="props.data.projectInfo" class="item-text">
          <span class="label">工地地址</span>
          <span class="value"
            >{{ props.data.projectInfo.poiName
            }}{{ props.data.projectInfo.address
            }}{{ props.data.projectInfo.latAddress }}</span
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
        <div v-if="props.data.projectInfo" class="item-text">
          <span class="label">工期计划</span>
          <span class="time"
            >{{ props.data.projectInfo.expectStartTime }} 至
            {{ props.data.projectInfo.expectFinishTime }}
          </span>
          <span v-if="getTime()" class="time-total"
            >共{{ getTime() }}个工作日</span
          >
        </div>
        <div class="item-text">
          <span class="label">签证类型</span>
          <span class="value">{{
            getName(props.data.type, visaTypeList)
          }}</span>
        </div>
        <div v-if="props.data.content" class="item-text">
          <span class="label">签证内容</span>
          <span class="value">{{ props.data.content }}</span>
        </div>
        <div class="item-text">
          <span class="label">当前工序</span>
          <span class="value">{{ props.data.stageName }}</span>
        </div>
        <div v-if="props.data.description" class="item-text">
          <span class="label">变更描述</span>
          <span class="value">{{ props.data.description }}</span>
        </div>
        <div class="item-text">
          <span class="label">变动起因</span>
          <span class="value">{{
            getName(props.data.changeType, changeTypeList)
          }}</span>
        </div>
        <div class="item-text">
          <span class="label">定责合议</span>
          <span class="value">{{ handleUserInputsName }}</span>
        </div>
        <div class="item-text">
          <span class="label">变更日期</span>
          <span class="value">{{
            props.data.created && props.data.created.substring(0, 10)
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
      return {
        id: '14',
        alterationSn: 'A2023030300000009',
        name: null,
        type: 2,
        changeType: 2,
        projectId: '1142',
        projectStageId: '199',
        stageName: '第二个阶段',
        content: '水电费水电费水电费',
        description: '水电费水电费水电费',
        remark: '士大夫撒的发送到发送到分',
        userId: '194',
        userName: '付刚',
        skillId: '1',
        skillName: '项目管家',
        status: 0,
        refusalReason: null,
        created: '2023-03-03 11:44:20',
        updated: '2023-03-03 11:44:20',
        isSelf: false,
        handleUserInputs: [
          {
            id: '19',
            alterationId: '14',
            handleUserId: '92',
            handleUserName: '付刚',
            handleSkillId: '-10',
            handleSkillName: '客户',
            handlePersonId: null,
            status: 0,
            refusalReason: null,
            handleTime: null
          },
          {
            id: '20',
            alterationId: '14',
            handleUserId: '194',
            handleUserName: '付刚',
            handleSkillId: '1',
            handleSkillName: '项目管家',
            handlePersonId: '440',
            status: 0,
            refusalReason: null,
            handleTime: null
          }
        ],
        projectInfo: {
          id: '1142',
          cityOperatorId: '38',
          homeId: '-1',
          projectName: '设计服务',
          provinceName: '云南省',
          cityName: '昆明市',
          districtName: '西山区',
          latAddress: '金碧路157号',
          poiName: '云南省第一人民医院总院',
          address: '2333',
          longitude: 102.70747,
          latitude: 25.031723,
          roomType: '-',
          usableArea: '-',
          model: '-',
          customerId: '92',
          customerName: '付刚',
          customerPhone: '18550898420',
          backupPhone: '',
          customerGender: '-',
          customerCode: '2023030200000002',
          contractCode: '',
          contractAmount: 0,
          paidAmount: 0,
          contractDuration: 1,
          contractStartDate: '2023-03-03',
          contractFinishDate: '2023-03-03',
          delayCount: 0,
          designerName: '',
          source: 2,
          sourceOrderId: '4107',
          integral: 0,
          referrerId: null,
          referrer: '',
          currentStage: '',
          expectStartTime: '2023-03-03',
          expectFinishTime: '2023-03-13',
          templateId: '101',
          templateName: '测试我的家',
          jobCode: 'JOB_DESIGNER',
          pioneer: '0',
          pioneerName: '',
          pioneerUserId: '0',
          pioneerJobId: '0',
          pioneerJobName: '',
          ignoreGovHoliday: 1,
          ignoreWeekend: 1,
          created: '2023-03-02 10:50:55',
          updated: '2023-03-02 10:50:55',
          roomImg: null,
          roomRemark: null,
          way: '云南省第一人民医院总院需要装修类的项目管家',
          projectStatus: 0,
          score: 0,
          lastScoreTime: null,
          alterationPrice: 0,
          constructionStartTime: null,
          constructionFinishTime: null,
          addressId: '752',
          requirementType: null,
          obsoleteFlag: 0
        },
        projectMemberGroupOutputs: [
          {
            skillId: '1',
            skillName: '项目管家',
            jobCode: 'JOB_MANAGER',
            members: [
              {
                personId: '440',
                userId: '194',
                name: '付刚',
                auditTime: '2022-07-12 09:50:26',
                auditStatus: 2,
                auditRemark: null,
                orderStatus: 1,
                skillId: '1',
                skillName: '项目管家',
                skillYearNum: '五年以上',
                projectManagerId: 0,
                cityOperatorId: '38',
                selfIntroduce: null,
                workType: '0',
                certificateFlag: '0',
                certificateImage: '[]',
                projectImage: '[]',
                platformImage: null,
                mainServiceArea: null,
                selectServiceArea: null,
                acceptServiceArea: null,
                remark: null,
                createBy: 0,
                updateBy: 228,
                createTime: '2022-07-12 09:50:04',
                updateTime: '2023-03-03 09:29:42',
                delFlag: '0',
                source: 'app',
                level: 1,
                status: null,
                servicePromise: null,
                serviceNum: 1,
                likeNum: 0,
                evaluationRate: null,
                priceType: null,
                servicePrice: null,
                priceUnit: null,
                address: null,
                longitude: null,
                latitude: null,
                phone: '18550898423',
                jobCode: 'JOB_MANAGER',
                avatar: 'avatar/194.png',
                integral: 176,
                webIntegral: 60,
                levelName: '新秀',
                webLevelName: '新秀',
                realName: null
              }
            ]
          },
          {
            skillId: '-1',
            skillName: '工人',
            jobCode: 'JOB_WORKER',
            members: [
              {
                personId: '409',
                userId: '207',
                name: '付刚',
                auditTime: '2022-07-01 11:26:24',
                auditStatus: 2,
                auditRemark: null,
                orderStatus: 1,
                skillId: '11',
                skillName: '木工',
                skillYearNum: '一到三年',
                projectManagerId: 0,
                cityOperatorId: '38',
                selfIntroduce: null,
                workType: '0',
                certificateFlag: '0',
                certificateImage: '[]',
                projectImage: '[]',
                platformImage: null,
                mainServiceArea: null,
                selectServiceArea: null,
                acceptServiceArea: null,
                remark: null,
                createBy: 0,
                updateBy: 92,
                createTime: '2022-07-01 11:26:12',
                updateTime: '2023-03-02 10:51:33',
                delFlag: '0',
                source: 'app',
                level: 1,
                status: null,
                servicePromise: null,
                serviceNum: 3,
                likeNum: 0,
                evaluationRate: null,
                priceType: null,
                servicePrice: null,
                priceUnit: null,
                address: null,
                longitude: null,
                latitude: null,
                phone: '18550898425',
                jobCode: 'JOB_WORKER',
                avatar: '6da25ad096664e26af17b8be7bed4a46.png',
                integral: 254,
                webIntegral: 60,
                levelName: '新秀',
                webLevelName: '新秀',
                realName: null
              }
            ]
          }
        ]
      }
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
    props.data.projectInfo.expectStartTime &&
    props.data.projectInfo.expectFinishTime
  ) {
    let time = dayjs(props.data.projectInfo.expectStartTime).diff(
      dayjs(props.data.projectInfo.expectFinishTime),
      'days'
    )
    return time
  }
  return ''
}

const team = computed(() => {
  let list: any = []
  if (props.data.projectMemberGroupOutputs) {
    props.data.projectMemberGroupOutputs.forEach((item: any) => {
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
  if (props.data.handleUserInputs) {
    props.data.handleUserInputs.forEach((item: any) => {
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
