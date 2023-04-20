<template>
  <div class="construction-index">
    <div class="construction-completion">
      <div
        class="info-card"
        v-for="item in state.workDataInfo"
        :key="item.skillName"
      >
        <div style="display: flex; align-items: center">
          <div class="card-switch">
            <div class="switch-left"></div>
            <span class="switch-text">{{
              item.itemType == 2 ? '开工' : item.itemType == 3 ? '完工' : ''
            }}</span>
          </div>
          <div class="card-date">
            {{ $getDate.Format(item.created, 'yyyy-MM-dd') }}
          </div>
        </div>
        <el-popover
          v-model:visible="item.popoverShow"
          placement="bottom-end"
          width="33rem"
        >
          <div>
            <div class="popover-title">
              <div class="title-text">
                {{
                  item.itemType == 2
                    ? '开工'
                    : item.itemType == 3
                    ? '完工'
                    : ''
                }}信息
              </div>
              <el-icon
                style="cursor: pointer"
                size="1.6rem"
                color="#999999;"
                @click="item.popoverShow = false"
              >
                <close />
              </el-icon>
            </div>

            <div class="accept-detail-list">
              <div class="accept-person">
                <img
                  :src="$getUrl.getPicUrl(item.avatar)"
                  @error="$getUrl.imageError($event)"
                  class="accept-img"
                />
                <span style="margin-left: 1rem"
                  >{{ item.personName }}[{{ item.skillName }}]</span
                >
                <span style="margin-left: 1rem; color: #909399">{{
                  item.created
                }}</span>
              </div>
              <div class="popover-date">
                <span style="color: #909399"
                  >{{
                    item.itemType == 2
                      ? '开工'
                      : item.itemType == 3
                      ? '完工'
                      : ''
                  }}日期</span
                >
                <span style="margin-left: 2rem">{{ item.created }}</span>
              </div>
              <div class="popover-date">
                {{ item.coment }}
              </div>

              <div class="popover-date" v-if="item.imgFile">
                <div v-for="item2 in JSON.parse(item.imgFile)">
                  <el-image
                    v-if="item2.type == 'img'"
                    class="popover-data-img"
                    :preview-teleported="true"
                    :preview-src-list="
                      $getUrl.getPicUrl(JSON.parse(item.imgFile))
                    "
                    :src="$getUrl.getPicUrl(item2.url)"
                  />
                  <videoNew
                    v-if="item2.type == 'video'"
                    :src="$getUrl.getPicUrl(item2.url)"
                    class="popover-data-img"
                  />
                </div>
              </div>
              <div class="popover-date" v-if="item.voiceFile">
                <audioPlay
                  :src="$getUrl.getPicUrl(JSON.parse(item.voiceFile).url)"
                />
              </div>
            </div>
          </div>
          <template #reference>
            <div class="card-button" @click="item.popoverShow = true">查看</div>
          </template>
        </el-popover>
      </div>
      <div class="card-period" v-if="state.workDataInfo.length >= 2">
        {{
          getDaysBetween(
            $getDate.Format(state.workDataInfo[0].created, 'yyyy-MM-dd'),
            $getDate.Format(state.workDataInfo[1].created, 'yyyy-MM-dd')
          ) + 1
        }}天完工
      </div>
    </div>

    <div class="accept-info" v-for="item in state.acceptanceList">
      <div>
        <div class="accept-person">
          <img
            :src="
              $getUrl.getPicUrl(
                item.acceptanceCreateAvatar || item.applyPersonAvatar
              )
            "
            @error="$getUrl.imageError($event)"
            class="accept-img"
          />
          <span style="margin-left: 1rem">
            {{ item.acceptanceCreateName || item.applyPersonName }}({{
              item.acceptanceCreateSkillName || item.applySkillName
            }})
          </span>
          <span style="margin-left: 1rem; color: #909399">{{
            item.acceptanceCreateTime || item.applyTime
          }}</span>
          <span
            v-if="item.statusFlag == 0"
            style="margin-left: 1rem; color: #f2aa3d"
            >发起了验收</span
          >
          <span
            v-if="item.statusFlag == 1"
            style="margin-left: 1rem; color: #2da44e"
            >验收通过</span
          >
          <span
            v-if="item.statusFlag == 2"
            style="margin-left: 1rem; color: #f56c6c"
            >验收未通过</span
          >
        </div>
        <div class="accept-value">
          <el-tag round
            >{{
              $getNum.numAdd(item.qualifiedCount, item.unqualifiedCount) +
              item.notCount
            }}项验收</el-tag
          >
          <el-tag type="success" round style="margin-left: 1rem"
            >{{ item.qualifiedCount }}项合格</el-tag
          >
          <el-tag type="danger" round style="margin-left: 1rem"
            >{{ item.unqualifiedCount }}项不合格</el-tag
          >
          <el-tag type="info" round style="margin-left: 1rem"
            >{{ item.notCount }}项未做</el-tag
          >
        </div>
      </div>
      <div
        class="card-button"
        v-if="item.acceptanceCreateTime"
        @click=";(acceptDetailShow = true), (state.acceptId = item.id)"
      >
        查看
      </div>
    </div>

    <div class="process-title">工序清单</div>
    <div v-for="item in state.processList">
      <div v-for="item2 in item.details">
        <processListCard :data="item2" @getData="getProcessDetail(item2)" />
      </div>
    </div>
    <el-empty
      v-if="state.processList.length == 0"
      :image-size="180"
      description="暂无数据~"
      :image="require('@/assets/img/empty/no_data.png')"
    />

    <!--验收详情-->
    <acceptDetailDrawer :acceptId="state.acceptId" v-model="acceptDetailShow" />
    <!--工序清单详情-->
    <processDetailDrawer
      v-model="processDetailShow"
      :data="state.processItem"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  ref,
  onMounted,
  reactive,
  watchEffect
} from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getCurrentInstance } from '@vue/runtime-core'
import { getDaysBetween } from '@/components/project/projectItem/projectDetailNewData'

const { proxy } = getCurrentInstance()
const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  projectId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getByData'])

const dialogStatus = ref<boolean>(true)
const constructionPopoverShow = ref<boolean>(false) //开工信息查看
const acceptDetailShow = ref<boolean>(false) //验收信息查看
const processDetailShow = ref<boolean>(false) //工序清单信息查看
const state = reactive({
  acceptId: 0, //验收id
  userPersonIdList: [] as any, //验收人员id集合数组
  acceptanceList: [], //验收信息记录
  workDataInfo: [], //开工完工信息
  processList: [], //工序清单list
  processItem: {} //工序清单单条数据
})

const getProcessDetail = (row: any) => {
  state.processItem = row
  processDetailShow.value = true
}

// 获取用户信息,并把用户信息数据组合到相应地方
const getUserInformation = () => {
  let tempPersonIdListNew = [...new Set(state.userPersonIdList)] //去重
  if (tempPersonIdListNew.length === 0) {
    return
  }
  proxy.$getUserById(tempPersonIdListNew, (res: any) => {
    // 验收信息人员信息
    if (state.acceptanceList.length > 0) {
      let tempAcceptList = JSON.parse(JSON.stringify(state.acceptanceList))
      tempAcceptList.map((item: any) => {
        res.data.map((el: any) => {
          if (Number(el.personId) === Number(item.acceptanceCreatePersonId)) {
            //验收人信息
            item['acceptanceCreateName'] = el.name
            item['acceptanceCreateAvatar'] = el.avatar
            item['acceptanceCreateSkillName'] = el.skillName
            item['acceptanceCreateSkillId'] = el.skillId
          }
          if (Number(el.personId) === Number(item.applyPersonId)) {
            //发起人信息
            item['applyPersonName'] = el.name
            item['applyPersonAvatar'] = el.avatar
          }
        })
      })
      state.acceptanceList = tempAcceptList
      console.log(state.acceptanceList)
    }
  })
}

//查询施工信息,开工完工
const getWorkInfo = async () => {
  await fetch({
    url: `/order/sopConstruction/completeWorkAndAcceptList`,
    method: 'get',
    params: {
      nodeId: props.data.nodeId
    }
  }).then((res: any) => {
    state.workDataInfo = res.data.completeWorkList //开工完工信息
    state.acceptanceList = res.data.acceptanceList //验收信息，记录

    state.acceptanceList.map((item: any) => {
      if (item.acceptanceCreatePersonId) {
        state.userPersonIdList.push(item.acceptanceCreatePersonId)
      }
      if (item.applyPersonId) {
        state.userPersonIdList.push(item.applyPersonId)
      }
    })
    getUserInformation()
  })
}
//查询工序清单
const getProcessData = async () => {
  await fetch({
    url: `/order/project/processList`,
    method: 'get',
    params: {
      projectId: props.projectId,
      skillId: props.data.executeJob
    }
  }).then((res: any) => {
    state.processList = res.data
  })
}

watchEffect(() => {
  if (props.data.nodeId) {
    getWorkInfo()
    getProcessData()
  }
})
</script>

<style scoped lang="less">
.popover-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .title-text {
    font-size: 16px;
    color: #4c4c4c;
  }
}

.popover-data-img {
  //position: relative;
  width: 80px;
  height: 80px;
  //background: #0969DA;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  object-fit: cover;
}

.popover-date {
  margin-top: 1rem;
  font-size: 14px;
  color: #1a1a1a;
  padding-left: 3.2rem;
  display: flex;
  flex-wrap: wrap;
}

.accept-detail-list {
  position: relative;
  max-height: 350px;
  overflow-y: auto;
  padding-bottom: 2rem;
}

.accept-person {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #1a1a1a;
}

.accept-img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.accept-info {
  background: #f0f9eb;
  border-radius: 6px;
  padding: 2rem 1.5rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .accept-value {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding-left: 3.2rem;
  }
}

.card-button {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #0969da;
  cursor: pointer;
}

.construction-completion {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-period {
    width: 33%;
    height: 62px;
    background: #ecf5ff;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #409eff;
    text-align: center;
    line-height: 62px;
  }

  .info-card {
    padding: 2rem 1.5rem;
    background: #ffffff;
    border: 1px solid #f3f4f8;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //min-width: 23rem;
    width: calc(33% - 4rem);
    margin-right: 2rem;
    height: 2.2rem;

    .card-date {
      font-size: 12px;
      font-weight: 400;
      color: #303133;
      margin-left: 1rem;
    }

    .card-switch {
      height: 22px;
      line-height: 22px;
      background: #ecf5ff;
      border-radius: 11px;
      display: flex;

      .switch-text {
        font-size: 12px;
        font-weight: 400;
        color: #409eff;
        margin: 0 1rem;
      }

      .switch-left {
        width: 22px;
        height: 22px;
        background: #0969da;
        border-radius: 50%;
      }
    }
  }
}

.construction-index {
  padding: 2rem 4rem;

  .process-title {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #1a1a1a;
    line-height: 18px;
    margin-top: 2rem;
  }
}
</style>
