<template>
  <div>
    <div class="project-card" :style="getStyle(props.data.cardType,props.data.status)">
      <div class="project-title">
        <div style="display: flex;align-items: center">
          <img v-if="props.data.cardType==0" class="project-status"
               :src="require(`@/assets/img/project/status_notStart_0.png`)" />
          <img v-if="props.data.cardType==1" class="project-status"
               :src="require(`@/assets/img/project/status_process_1.png`)" />
          <img v-if="props.data.cardType==2" class="project-status"
               :src="require(`@/assets/img/project/status_finish_2.png`)" />
          <img v-if="props.data.cardType==3" class="project-status"
               :src="require(`@/assets/img/project/status_exceed_3.png`)" />
          <img v-if="props.data.cardType==4" class="project-status"
               :src="require(`@/assets/img/project/statusLockout.png`)" />
          <div class="project-name" :class="props.active?'project-name-active':''">{{ props.data.nodeName }}</div>
        </div>
        <div class="project-title_icon" v-if="props.data.checkStatus !=null">
          <!-- 施工类1004 -->
          <!-- 验收1005 -->
          <el-tooltip
            effect="dark"
            placement="bottom"
            :content="'验收不通过'"
            v-if="props.data.checkStatus == '2' && props.data.businessType=='1005'">
            <el-icon :size="13" color="#F56C6C">
              <close />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            v-if="props.data.checkStatus == '3'"
            :content="'验收通过'"
            placement="bottom">
            <el-icon :size="13" color="#67C23A">
              <check />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            placement="bottom"
            v-if="props.data.checkStatus == '0' || props.data.checkStatus == '1' || props.data.checkStatus == '2'"
            :content="getTooltip(props.data.checkStatus,props.data.businessType)"
          >
            <span class="el-icon rounded"></span>
          </el-tooltip>
        </div>
      </div>

      <div class="date-scale">
        <div class="project-date">
          <span v-if="props.data.planDay!=0"> 计划{{ props.data.planDay }}天</span>
            <!-- 已完成 -->
            <span v-if="props.data.cardType==2&&(props.data.delayDays||
              !props.data.realEndTime&&getDaysBetween(props.data.expectFinishTime, new Date()) >=1||
              props.data.realEndTime&&getDaysBetween(props.data.expectFinishTime,props.data.realEndTime) >=1)"
                    style="color:#F56C6C">
              （超期{{ props.data.delayDays ||
              !props.data.realEndTime && getDaysBetween(props.data.expectFinishTime, new Date()) ||
              props.data.realEndTime && getDaysBetween(props.data.expectFinishTime, props.data.realEndTime) }}天）
            </span>
        </div>

        <div
          v-if="props.data.cardType!=2&&(props.data.delayDays||
          !props.data.realEndTime&&getDaysBetween(props.data.expectFinishTime, new Date()) >=1||
          props.data.realEndTime&&getDaysBetween(props.data.expectFinishTime,props.data.realEndTime) >=1)"
        >
          <div class="project-skill postpone">
            超期{{ props.data.delayDays ||
            !props.data.realEndTime && getDaysBetween(props.data.expectFinishTime, new Date()) ||
            props.data.realEndTime && getDaysBetween(props.data.expectFinishTime, props.data.realEndTime) }}天
            ({{ getDateDiff(props.data.expectFinishTime).result }}应完成)
          </div>
        </div>

        <div
          class="project-skill postpone2"
          :style="getDateDiff(props.data.expectFinishTime).style"
          v-if="props.data.cardType==1&&props.data.delayDays"
        >
          {{ getDateDiff(props.data.expectFinishTime).result }}应完成
          <span v-if="getDaysBetween(new Date(),props.data.expectFinishTime) > 0">
            剩余{{getDaysBetween(new Date(),props.data.expectFinishTime) }}天
          </span>
        </div>

        <div
          class="project-skill"
          v-if="props.data.cardType==0&&props.data.expectStartTime"
          :style="getDateDiff(props.data.expectStartTime).style"
        >
          {{ getDateDiff(props.data.expectStartTime).result }}开始
          <span v-if="getDaysBetween(new Date(),props.data.expectStartTime) > 0">
            剩余{{getDaysBetween(new Date(),props.data.expectStartTime) }}天
          </span>
        </div>
      </div>

      <div class="skill-scale">
        <div class="project-skill" v-for="(item,ind) in props.data.executeJobNames" :key="ind">{{ item }}</div>
        <div class="project-skill owner" v-if="props.data.ownerConfirmed">业主确认</div>
      </div>
      <div style="display: flex;flex-wrap: wrap">
        <div class="project-person" v-for="(item,id) in props.data.persons" :key="id">
          <img class="person-info-img" :src="$getUrl.avatarImage(item.userId)" @error="$getUrl.imageError($event)" />
          <span class="person-name">{{ item.personName }}</span>
        </div>
      </div>
      <div v-if="props.data.cardType==2" class="bottom-scale" style="margin-bottom: 1.2rem">
        <div class="peroject-buttom-date">
          {{ getDateDiff(props.data.realEndTime || props.data.expectFinishTime).result }}完成
        </div>
        <div></div>
      </div>
      <div class="bottom-scale">
        <div>
          <el-tooltip placement="bottom" v-if="props.data.preNodeStatus?.length>0">
            <template #content>
              <div class="front-nodes" v-for="(item,i) in props.data.preNodeStatus" :key="i">
                <div>{{ item.nodeName }}</div>
                <div class="nodes-type" v-if="item.status!=3">未完成</div>
                <div class="nodes-type2" v-if="item.status==3">已完成</div>
              </div>
            </template>
            <el-icon size="1.4rem" :color="[getNodeType(props.data.preNodeStatus)?'#909399':'#67C23A']">
              <Operation />
            </el-icon>
          </el-tooltip>
        </div>
        <div class="peroject-buttom-text">
          {{ getBusinessType(props.data.businessType) }}
          <span style="color:  #E4E7ED;margin: 0 0.5rem;">|</span>
          {{ props.data.templateStageName }}
          <span style="color:  #E4E7ED;margin: 0 0.5rem;">|</span>
          {{ props.data.groupName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import getDate from '@/getDate'
import { defineEmits, defineProps, ref, watchEffect,onMounted } from 'vue'
import {
  getCardType,
  getGroupType,
  getStatusImg,
  getDateDiff,
  getDaysBetween,
  getBusinessType,
  getTooltip
} from '@/components/project/projectItem/projectDetailNewData'

const props = defineProps({
  modelValue: {//状态
    type: Number || String,
    default: 0
  }, data: {
    type: Object,
    default: {}
  },
  active: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits()

// 计算两个日期之间得天数
// dateString1减数
// dateString2被减数
// const getDaysBetween = (dateString1: any, dateString2: any) => {
//   var startDate = Date.parse(dateString1)
//   var endDate = Date.parse(dateString2)
//   var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
//   return days
// }
const getStyle = (index: any,status:any) => {
  switch (index) {
    case 0 ://未开始
     // 加一个审核中的状态
      if(status == 5){
        return 'border-left: 6px solid #F2AA3D;'
      }
      return 'border-left: 6px solid #C0C4CC;'
      break
    case 1://进行中
      return 'border-left: 6px solid #409EFF;'
      break
    case 2://已完成
      return 'border-left: 6px solid #2DA44E;'
      break
    case 3://已超期
      return 'border-left: 6px solid #F56C6C;'
      break
    case 4://已停工
      return 'border-left: 6px solid #409EFF;'
      break
    default :
      return 'border-left: 6px solid #C0C4CC;'
      break
  }
}

const getNodeType = (data: object[]) => {
  let a = 0
  data.forEach((res: any) => {
    if (res.status == 3) {
      a++
    }
  })

  if (a == data.length) {
    return false
  } else {
    return true
  }
}

</script>

<style scoped lang="less">
.front-nodes {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;

  &:first-child {
    width: 18rem;
  }

  .nodes-type {
    color: #909399;
  }

  .nodes-type2 {
    color: #67C23A;
  }
}

.project-card {
  cursor: pointer;
  margin: 2rem 2rem 0 2rem;
  background: #FFFFFF;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  border-left: 6px solid #2DA44E;
  padding: 1.5rem 1rem;

  .project-name-active {
    color: @mainColor !important;
    font-weight: 600 !important;
  }


  .bottom-scale {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .peroject-buttom-text {
    margin-right: -1rem;
    font-size: 1rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #909399;
    text-align: right;
    transform: translateY(-10%) scale(0.8);
  }

  .peroject-buttom-date {
    font-size: 1rem;
    font-weight: 400;
    color: #909399;
    text-align: left;
    margin-left: -5px;
    transform: translateY(-10%) scale(0.8);
  }

  .project-person {
    display: flex;
    align-items: center;
    margin-top: 0.4rem;
    margin-right: 1rem;
    margin-bottom: 0.8rem;

    .person-info-img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .person-name {
      font-size: 1.2rem;
      transform: scale(0.9);
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #4D4D4D;
      margin-left: 0.5rem;
    }
  }

  .owner {
    color: #B965E0 !important;
    background: #F5EBFA !important;
    border: 1px solid #EAD8F2 !important;
  }

  .postpone {
    color: #FFFFFF !important;
    background: #F56C6C !important;
    border: none !important;
  }

  .postpone2 {
    color: #FFFFFF !important;
    background: #F2AA3D !important;
    border: none !important;
  }

  .skill-scale {
    display: flex;
    transform: translate(-15%, -15%) scale(0.7);
    margin-top: 0.5rem;
  }

  .project-skill {
    font-size: 12px;
    font-weight: 400;
    color: #67C23A;
    background: #F0F9EB;
    border: 1px solid #E1F3D8;
    border-radius: 4px;
    line-height: 2.4rem;
    padding: 0 0.8rem 0.1rem 0.8rem;
    margin-right: 1rem;
    margin-left: 5px;
  }

  .date-scale {
    display: flex;
    align-items: center;
    transform: translate(-15%, -15%) scale(0.7);
    margin-top: 1.2rem;
  }

  .project-date {
    //width: 100%;
    font-size: 1.8rem;
    font-weight: 400;
    color: #909399;
    flex-wrap: nowrap;
    align-items: center;
  }

  .project-title {
    display: flex;
    justify-content: space-between;

    .project-title_icon {
      .el-icon {
        margin-left: .5rem;

        &.rounded {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border: 1px solid #E6A23C;
        }
      }
    }

    .project-name {
      font-size: 1.4rem;
      font-weight: 400;
      color: #262626;
      margin-left: 5px;
      white-space: normal;
    }

    .project-status {
      width: 1.2rem;
      height: 1.2rem;background: #ECF5FF;
    }
  }
}

</style>
