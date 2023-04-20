<template>
  <div>
    <div v-if="props.data.checkType==2&&state.recipient.length>0" class="notice-accept">
      <div class="notice-person">
        <div v-for="item in state.originator">
          <el-image class="notice-person-img" :src="$getUrl.getPicUrl(item.avatar)" />
        </div>
        <span style="margin: 0 0.7rem">通知验收</span>
      </div>
      <div v-for="item in state.recipient">
        <el-image
          class="other-person-img"
          :src="$getUrl.getPicUrl(item.avatar)"
          :preview-src-list="$getUrl.getPicUrl(item.avatar)"
        />
      </div>
      <div class="notice-accept-center">
        {{ state.acceptNotifyList.notifyTitle }}
      </div>
      <div style="flex: 1;text-align: right">
        <el-popover v-model:visible="popoverShow" placement="bottom" width="36rem">
          <div>
            <div style="padding: 0 2rem">
              <div class="popover-title">
                <div class="title-text">验收通知</div>
                <el-icon
                  style="cursor: pointer"
                  size="1.6rem"
                  color="#999999;"
                  @click="popoverShow=false"
                >
                  <close />
                </el-icon>
              </div>
              <div class="accept-person">
                <el-image
                  class="accept-img"
                  :preview-teleported="true"
                  :src="$getUrl.getPicUrl(state.acceptNotifyList.notifyExecPersonAvatar)"
                  :preview-src-list="$getUrl.getPicUrl(state.acceptNotifyList.notifyExecPersonAvatar)"
                />
                <span style="margin-left: 1rem">{{ state.acceptNotifyList.notifyExecPersonName
                }}[{{ state.acceptNotifyList.notifyExecPersonSkillName }}]</span>
                <span
                  style="margin-left: 1rem;color: #909399"
                >{{ $getDate.Format(state.acceptNotifyList.notifyDate, 'yyyy-MM-dd')
                }}</span>
              </div>
              <div class="popover-date">
                <span style="color: #909399;">验收日期</span>
                <span style="margin-left: 2rem">{{ $getDate.Format(state.acceptNotifyList.notifyDate, 'yyyy-MM-dd')
                }}</span>
              </div>
              <div class="popover-date">
                {{ state.acceptNotifyList.notifyContent }}
              </div>
              <!--            <div v-if="item.imgFile">-->
              <!--              <div class="popover-date">-->
              <!--                <div v-for="item2 in JSON.parse(item.imgFile)">-->
              <!--                  <el-image-->
              <!--                    v-if="item2.type=='img'"-->
              <!--                    class="popover-data-img"-->
              <!--                    :src="$getUrl.getPicUrl(item2.url,false)" />-->
              <!--                </div>-->

              <!--              </div>-->
              <!--              <div class="popover-date">-->
              <!--                <audioPlay src="https://static.xfanread.com/annualReview/annualReview2019.mp3" />-->
              <!--              </div>-->
              <!--            </div>-->
            </div>
            <div class="dropdown-menu_footer">
              <div v-for="item in state.acceptNotifyList.notifyUserList" class="dropdown-menu_main-user">
                <div>
                  <el-image
                    class="other-person-img"
                    :preview-teleported="true"
                    style="margin: 0 1rem 0 0"
                    :src="$getUrl.getPicUrl(item.personAvatar)"
                    :preview-src-list="$getUrl.getPicUrl(item.personAvatar)"
                  />
                  <!--                  <img :src="$getUrl.getPicUrl(item.personAvatar)" />-->
                  <span>{{ item.personName }}</span>
                </div>
                <span v-if="item.readFlag==0" :class="'dropdown-do dropdown-do'+1"><i />未读</span>
                <span v-if="item.readFlag==1" :class="'dropdown-do dropdown-do'+2"><i />已读</span>
              </div>
            </div>
          </div>
          <template #reference>
            <el-button
              type="primary"
              plain
              class="card-button"
              @click="popoverShow=true"
            >
              查看
            </el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="node-accept">

      <div class="node-name">验收（{{ state.acceptList.length }}）</div>
      <el-empty
        v-if="state.acceptList.length==0"
        :image-size="218"
        :description="props.data.cardType == 0 ? '该节点尚未开始~' : '暂无数据~'"
        :image="require('@/assets/img/empty/no_data.png')"
      />
      <acceptCard
        v-for="item in state.acceptList"
        :data="item"
        @getData="getAcceptDetail(item.id)"
      />

      <!--验收详情-->
      <acceptDetailDrawer v-model="acceptDetailShow" :accept-id="state.acceptId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getCurrentInstance } from '@vue/runtime-core'

const { proxy } = getCurrentInstance() as any
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }, projectId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getByData'])

const acceptDetailShow = ref<boolean>(false)// 验收信息查看
const popoverShow = ref<boolean>(false)// 验收通知信息

const state = reactive({
  recipient: [] as any, // 接收人
  originator: [] as any, // 通知发起人
  acceptNotifyList: {} as any, // 验收通知list
  userPersonIdList: [] as any, // 人员id
  acceptId: 0,
  acceptList: [] // 验收列表

})

const getAcceptDetail = (val: any) => {
  state.acceptId = val
  acceptDetailShow.value = true
}

// 查询验收列表//根据nodeId
const getAcceptList = async () => {
  await fetch({
    url: `/order/bizorderacceptance/getAcceptancesByTaskId/${props.data.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    state.acceptList = res.data
    res.data.map((item: any) => {
      if (item.acceptanceCreatePersonId) {
        state.userPersonIdList.push(item.acceptanceCreatePersonId)
      }
      if (item.applyPersonId) {
        state.userPersonIdList.push(item.applyPersonId)
      }
    })
    if (props.data.checkType == 2) { // checkType 1 内部验收  2 外部验收
      getNotifyList()
    } else {
      getUserInformation()
    }
  })
}
// 外部验收// 获取验收通知
const getNotifyList = async () => {
  await fetch({
    url: `/order/bizorderacceptance/getAcceptanceNotify/${props.data.nodeId}`,
    method: 'get'
  }).then((res: any) => {
    if (res.data) {
      state.acceptNotifyList = res.data
      if (res.data.notifyExecPersonId) { // 获取发起验收通知人员信息
        state.userPersonIdList.push(res.notifyExecPersonId)
      }
      if (res.data.notifyUserList.length > 0) { // 获取验收通知抄送人员信息
        res.data.notifyUserList.map((el: any) => {
          state.userPersonIdList.push(el.personId)
        })
      }
    }
    getUserInformation()
  })
}
// 获取用户信息,并把用户信息数据组合到相应地方
const getUserInformation = () => {
  const tempPersonIdListNew = [...new Set(state.userPersonIdList)]// 去重
  if (tempPersonIdListNew.length === 0) {
    return
  }

  proxy.$getUserById(tempPersonIdListNew, (res: any) => {
    // 外部验收，获取验收通知人信息
    if (props.data.checkType == 2) {
      // 通知发起人
      state.originator = []
      // 发送至，接收人
      state.recipient = []
      res.data.map((item: any) => {
        if (Number(item.personId) === Number(state.acceptNotifyList.notifyExecPersonId)) {
          state.originator.push(item)
          state.acceptNotifyList.notifyExecPersonName = item.name
          state.acceptNotifyList.notifyExecPersonAvatar = item.avatar
          state.acceptNotifyList.notifyExecPersonSkillName = item.skillName
        }
      })
      if (state.acceptNotifyList.notifyUserList && state.acceptNotifyList.notifyUserList.length > 0) {
        state.acceptNotifyList.notifyUserList.map((item: any) => {
          res.data.map((el: any) => {
            if (Number(el.personId) === Number(item.personId)) {
              state.recipient.push(el)
              item.personName = el.name
              item.personSkillName = el.skillName
              item.personSkillId = el.skillId
              item.personAvatar = el.avatar
            }
          })
        })
      }
    }
    console.log(state.originator, state.recipient)

    // 验收信息人员信息
    if (state.acceptList.length > 0) {
      const tempAcceptList = JSON.parse(JSON.stringify(state.acceptList))
      tempAcceptList.map((item: any) => {
        res.data.map((el: any) => {
          if (Number(el.personId) === Number(item.acceptanceCreatePersonId)) { // 验收人信息
            item['acceptanceCreateName'] = el.name
            item['acceptanceCreateAvatar'] = el.avatar
            item['acceptanceCreateSkillName'] = el.skillName
            item['acceptanceCreateSkillId'] = el.skillId
          }
          // 发起人信息
          if (Number(el.personId) === Number(item.applyPersonId) && Number(item.checkType) === 1) { // 内部验收
            item['applyPersonName'] = el.name
            item['applyPersonAvatar'] = el.avatar
            item['skillId'] = el.skillId
            item['applyPersonSkillName'] = el.skillName
          }
        })
      })
      state.acceptList = tempAcceptList
    }
  })
}

watchEffect(() => {
  if (props.data.nodeId) {
    getAcceptList()
  }
})

</script>

<style scoped lang="less">
.dropdown-menu_footer {
  margin-top: 2rem;
  padding: 1.5rem 2rem 0 2rem;
  border-top: solid 1px #E4E7ED;

  .dropdown-menu_main-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;

    div {
      display: flex;
      align-items: center;

      img {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 2.2rem;
        padding-right: 1rem;
      }

      span {
        color: #4D4D4D;
      }
    }

    .dropdown-do {
      font-style: normal;
      color: #909399;

      i {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #909399;
        margin: 0 .5rem;
        top: 50%;
        transform: translateY(-50%);
      }

      &.dropdown-do1 {
        color: #F56C6C;

        i {
          background: #F56C6C;
        }
      }
    }
  }
}

.popover-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .title-text {
    font-size: 16px;
    color: #4C4C4C;
  }
}

.popover-data-img {
  width: 80px;
  height: 80px;
  background: #0969DA;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.popover-date {
  margin-top: 1rem;
  font-size: 14px;
  color: #1A1A1A;
  padding-left: 3.2rem;
  display: flex;
  flex-wrap: wrap;
}

.accept-person {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #1A1A1A;
}

.accept-img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.accept-info {
  background: #F0F9EB;
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

.notice-accept {
  display: flex;
  height: 76px;
  align-items: center;
  border-bottom: solid 1px #F3F4F8;
  padding: 0 4rem;

  .notice-accept-center {
    font-size: 12px;
    display: block;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #4C4C4C;
    margin: 0 20px;
    max-width: 500px;
  }

  .process-button {
    background: #ffffff !important;
    height: 2.4rem;

    &:hover {
      opacity: 0.7 !important;
      color: #0969DA !important;
    }
  }

  .notice-person {
    height: 22px;
    background: #ECF5FF;
    border-radius: 11px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #0969DA;
    display: flex;
    align-items: center;

    .notice-person-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }
}

.node-accept {
  padding: 2rem 4rem;
}

.node-name {
  font-size: 16px;
  color: #1A1A1A;
}

.other-person-img {
  height: 2.2rem;
  width: 2.2rem;
  border-radius: 50%;
  margin-left: 1rem;
}
</style>
