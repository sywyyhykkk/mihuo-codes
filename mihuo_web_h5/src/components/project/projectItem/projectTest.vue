<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-if="showDialog"
      v-model="showDialog"
      @close="handleCancel"
      width="83rem"
    >
      <div style="min-height: 55vh">
        <div class="detection">
          <div style="width: 11.3rem;height: 11.3rem">
            <img class="detection-img" v-if="testStatus==0||testScore>=80"
                 :src="require('@/assets/img/project/detection1.png')" />
            <img class="detection-img" v-if="testStatus>0&&testScore>=60&&testScore<80"
                 :src="require('@/assets/img/project/detection2.png')" />
            <img class="detection-img" v-if="testStatus>0&&testScore<60"
                 :src="require('@/assets/img/project/detection3.png')" />
            <img class="detection-img rotating-pointer" v-if="testStatus==0"
                 :src="require('@/assets/img/project/rotatingPointer.png')" />
            <div class="test-score" v-if="testStatus>0">{{ testScore }}</div>
          </div>
          <div class="detection-text" :class="testStatus==0?'test-item2':''">{{ testStatus == 0 ? '检测中' : '检测完成' }}
          </div>
        </div>
        <div class="my-progress">
          <div class="my-progress-content" :style="`--progress-time:${progressTimes}s;`"></div>
        </div>
        <div class="checking-item" v-for="item in state.projectGroupList" v-if="testStatus==0">
          <img class="checking-img" :src="require('@/assets/img/project/checking.png')" />
          <span style="margin-left: 1.3rem">{{ item.groupName }}</span>
          <div class="test-item">检测中</div>
        </div>

        <div style="height: 55vh;overflow-y: auto" v-if="testStatus>0">
          <div class="exception-item">
            <div class="exception-text">共发现{{ totalNum }}项异常</div>
            <div style="display: flex">
              <div v-if="totalNum>0" v-for="(item,index) in tabsButton"
                   class="tabs-exception"
                   :class="tabsIndex==index?'active ':''"
                   @click="handelSelect(index)">
                <img style="width: 1.4rem;height: 1.4rem"
                     :src="require(`@/assets/img/project/${tabsIndex==index?item.img2:item.img}`)" />
                <span style="margin-left: 0.6rem">{{ item.title }}</span>
              </div>
            </div>
          </div>
          <el-empty
            v-if="totalNum==0"
            :image-size="180"
            description="项目正常进行中~"
            :image="require('@/assets/img/empty/no_data.png')"
          />

          <div class="stage-group">
            <div v-for="item in state.projectGroupList">
              <div v-if="item.groupType==3" class="exception-stage-item">
                <div class="exception-stage">
                  <div v-if="tabsIndex==0">
                    <div>{{ item.groupName.slice(0, 2) }}</div>
                    <div style="margin-top: 0.2rem">{{ item.groupName.slice(2, 4) }}</div>
                  </div>
                  <img class="group-img" v-if="tabsIndex==1&&getImgUrl(item.groupName)"
                       :src="require(`@/assets/img/project/${getImgUrl(item.groupName)}`)" />
                </div>
                <div class="stage-text">{{ item.groupName }}</div>
                <div class="exception-stage-index">{{ item.groupAbnormal }}项异常</div>
              </div>
            </div>
          </div>

          <div v-for="item in state.projectGroupList">
            <div class="exception-item-info" v-if="item.groupType==3">
              <div class="exception-info-title">
                <div style="display: flex;align-items: center">
                  <div class="title-dot" v-if="tabsIndex==0"></div>
                  <img class="group-img2" v-if="tabsIndex==1&&getImgUrl(item.groupName)"
                       :src="require(`@/assets/img/project/${getImgUrl(item.groupName)}`)" />
                  <span style="font-size: 1.4rem;color: #303133;">{{ item.groupName }}</span>
                  <span style="font-size: 1.2rem;color: #DF5330;">&nbsp;{{ item.groupAbnormal }}项异常</span>
                </div>
                <div @click="checkedChange(item)" style="cursor: pointer">
                  <span
                    style="margin-right: 0.5rem;color: #C0C4CC;font-size: 1.4rem">{{ !item.checked ? '收起' : '展开'
                    }}</span>
                  <el-icon size="1.2rem" color="#C0C4CC">
                    <arrow-down v-if="item.checked" />
                    <arrow-up v-if="!item.checked" />
                  </el-icon>
                </div>
              </div>
              <div class="exception-item-center" v-if="!item.checked">
                <div v-for="item2 in item.nodes">
                  <div v-if="item2.cardType==3"
                       style=" display: flex;justify-content: space-between;margin-bottom: 1rem">
                    <div style="display: flex;align-items: center">
                      <span style="font-size: 1.2rem;color: #303133;">{{ item2.nodeName }}</span>
                      <span style="font-size: 1.2rem;color: #DF5330;">&nbsp;已超期{{
                          item2.delayDays ||
                          !item2.completeTime && getDaysBetween(item2.expectFinishTime, $getDate.Format(new Date(), 'yyyy-MM-dd')) + 1 ||
                          item2.completeTime && getDaysBetween(item2.expectFinishTime, item2.completeTime) + 1
                        }}天</span>
                    </div>
                    <div style="display: flex">
                      <el-button class="overlook" :disabled="item2.businessType!='1002'&&item2.businessType!='1006'">
                        <div style=" font-size:1rem;transform: scale(0.8);">忽略</div>
                      </el-button>
                      <el-button class="conduct" :disabled="item2.businessType!='1002'&&item2.businessType!='1006'"
                                 @click="handelDispose(item,item2)">
                        <div style=" font-size:1rem;transform: scale(0.8);">处理</div>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="height: 3rem"></div>

      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, defineProps, reactive, defineEmits, getCurrentInstance } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getGroupType, getDaysBetween } from '_c/project/projectItem/projectDetailNewData'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }, projectId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getProjectDetial', 'handelDispose'])

const { proxy } = getCurrentInstance()
const showDialog = ref(false)
const testStatus = ref(0)//检测状态
const tabsIndex = ref(0)
const totalNum = ref(0)//总异常数量
const testScore = ref(100)//项目健康分数
const progressTimes = ref(3)//进度条加载时间
const tabsButton = reactive([
  { title: '按阶段查看', img: 'stageModule1.png', img2: 'stageModule2.png' },
  { title: '按分组查看', img: 'groupModule1.png', img2: 'groupModule2.png' }
])
const state = reactive({
  projectGroupList: []
})

//处理按钮的点击事件
const handelDispose = (data: any, data1: any) => {
  console.log(data, data1)
  emit('handelDispose', data, data1)
  handleCancel()
}
const handelSelect = (index: number) => {
  tabsIndex.value = index
  getProjectDetailData()
}
const checkedChange = (row: any) => {
  row.checked = row.checked ? false : true
}
const getImgUrl = (row: any) => {
  switch (row) {
    case '主辅材料':
      return 'groupImg1.png'
      break
    case '人员调度':
      return 'groupImg2.png'
      break
    case '资金款项':
      return 'groupImg3.png'
      break
    case '方案落地':
      return 'groupImg1.png'
      break
    case '测量定制':
      return 'groupImg2.png'
      break
    case '验收品控':
      return 'groupImg2.png'
      break
  }
}

//按分组查询项目详情
const getProjectDetailData = async () => {
  await fetch({
    url: `/order/bizproject/detail/sop/group`,
    method: 'get',
    params: {
      groupType: tabsIndex.value,
      projectId: props.projectId
      // projectId: 293
    }
  }).then((res: any) => {
    if (testStatus.value == 0) {//处于检测状态
      state.projectGroupList = []
      progressTimes.value = (getGroupType({ row: res.data.groups }).length - 1) * 2//进度条加载时间
      let nodeList = 0
      getGroupType({ row: res.data.groups }).forEach((item: any, index: any) => {
        setTimeout(function() {
          nodeList += item.nodes.length
          if (item.groupType == 3) {
            totalNum.value += item.groupAbnormal
          }
          //计算项目健康分数：项目的超期节点数除于项目的总结点数
          testScore.value = proxy.$getNum.numMulti(proxy.$getNum.numSub(1, proxy.$getNum.numDiv(totalNum.value, nodeList).toFixed(2)), 100)
          state.projectGroupList.push(item)
          //判断是否检测完成
          if (index == getGroupType({ row: res.data.groups }).length - 1) {
            testStatus.value = 1//检测完成的状态值
            //保存检测分数
            saveProjectScore({
              'projectId': props.projectId,
              'score': testScore.value
            })
          }
        }, 2000 * index)	// 还是每秒执行一次，不是累加的
      })
    } else {//处于非检测状态
      state.projectGroupList = getGroupType({ row: res.data.groups })
    }

  })
}
//
const saveProjectScore = async (data: any) => {
  await fetch({
    url: '/order/bizproject/score/save',
    method: 'post',
    data: data
  }).then((res: any) => {

  })
}
watchEffect(() => {
  showDialog.value = props.modelValue
  if (showDialog.value) {
    getProjectDetailData()
  }
})

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('getProjectDetial')//关闭时查询节点详情
  testStatus.value = 0//检测状态
  state.projectGroupList = []
  totalNum.value = 0//总异常数量
  testScore.value = 100//项目健康分数
}
</script>

<style scoped lang="less">
.stage-group {
  display: flex;
  margin-top: 3rem;
  //margin-left: 2rem;
  flex-wrap: wrap;
  //height: auto;
  //overflow-y: hidden;
}

@-webkit-keyframes test-item-am {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}

@keyframes test-item-am {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}

.test-item {
  color: #2DA44E;
  margin-left: 2rem;
}

.test-item2::after {
  content: '';
  font-size: 30px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #1A1A1A;
  -webkit-animation: test-item-am 2s linear infinite;
  animation: test-item-am 2s linear infinite;
}

.test-item::after {
  content: '';
  color: #2DA44E;
  font-size: 18px;
  -webkit-animation: test-item-am 2s linear infinite;
  animation: test-item-am 2s linear infinite;
}

.group-img2 {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.group-img {
  width: 26px;
  height: 26px;
}

.exception-item-info {
  margin-bottom: 2.2rem;
  margin-left: 2rem;
  margin-right: 4rem;

  .exception-item-center {
    margin-top: 1.4rem;
    background: #F5F7FA;
    padding: 2rem 4rem 1rem 2rem;


    .overlook {
      color: #909399;
      background: #FFFFFF;
      border: 1px solid #C0C4CC;
      border-radius: 2px;
      line-height: 2rem;
      height: 2rem;
      padding: 0 0.5rem;
      font-size: 1.2rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      //margin-right: 1rem;
    }

    .conduct {
      background: #FFFFFF;
      border: 1px solid #2DA44E;
      border-radius: 2px;
      font-size: 1.2rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #2DA44E;
      padding: 0 0.5rem;
      line-height: 2rem;
      height: 2rem;
    }

    :deep(.is-disabled) {
      color: #c0c4cc !important;
      border-color: #e4e7ed;
    }
  }

  .exception-info-title {
    display: flex;
    justify-content: space-between;

    .title-dot {
      width: 10px;
      height: 10px;
      background: #FFDBAC;
      border: 1px solid #DF5330;
      border-radius: 50%;
      margin-right: 1rem;
    }
  }
}

.exception-stage-item {
  margin-bottom: 3rem;
  width: 13.1rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  .stage-text {
    margin-top: 1.2rem;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #303133;
  }

  .exception-stage-index {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #DF5330;
    margin-top: 1rem;
  }

  .exception-stage {
    width: 50px;
    height: 50px;
    background: #FFDBAC;
    border: 1px solid #DF5330;
    border-radius: 50%;
    font-size: 1.2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #DF5330;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

@-webkit-keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes my-progress-content {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes my-progress-content {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.exception-item {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  height: 36px;
  align-items: center;
  padding-right: 4rem;

  .active {
    border: 1px solid #0969DA !important;
    //border-radius: 4px;
    color: #0969DA;
  }

  .tabs-exception {
    display: flex;
    align-items: center;
    height: 3.2rem;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    //border-radius: 4px;
    padding: 0 1rem;
    cursor: pointer;

    &:first-child {
      border-top-left-radius: .4rem;
      border-bottom-left-radius: .4rem;
    }

    &:last-child {
      border-top-right-radius: .4rem;
      border-bottom-right-radius: .4rem;
    }
  }

  .exception-text {

    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #DF5330;
    margin-left: 2rem;
  }
}

.checking-item {
  margin-top: 3.5rem;
  display: flex;
  height: 1.6rem;
  align-items: center;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin-left: 2rem;

  .checking-img {
    width: 1.6rem;
    height: 1.6rem;
    -webkit-animation: rotate-center 3s linear infinite;
    animation: rotate-center 3s linear infinite;
  }
}

.my-progress {
  margin-top: 1rem;
  margin-left: -2rem;
  height: 8px;
  background: #F5F7FA;

  .my-progress-content {
    --progress-time: 3s;
    height: 8px;
    background: linear-gradient(90deg, #2DA44E, #3BCF64);
    -webkit-animation: my-progress-content var(--progress-time) linear 1;
    animation: my-progress-content var(--progress-time) linear 1;
  }
}

.detection {
  padding: 1.5rem 4rem 0 0;
  display: flex;
  align-items: center;

  .detection-text {
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1A1A1A;
  }

  .rotating-pointer {
    -webkit-animation: rotate-center 3s linear infinite;
    animation: rotate-center 3s linear infinite;
  }

  .detection-img {
    width: 11.3rem;
    height: 11.3rem;
    position: absolute;
  }

  .test-score {
    font-size: 36px;
    font-weight: 400;
    color: #FFFFFF;
    width: 11.3rem;
    height: 11.3rem;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
