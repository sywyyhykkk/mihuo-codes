<template>
  <div
    v-if="showDrawer"
    ref="drawerModel"
    :style="{ width: size }"
    class="drawer"
    @close="handleCancel"
  >
    <div class="header" :style="getStyleBorder(state.list.content.cardType)">
      <div class="header-info">
        <div class="header-title">
          <i class="header-title_span" :style="getStyle(state.list.content.cardType)" />
          <span>{{ state.list.content.templateStageName }}</span>
          <el-divider direction="vertical" />
          <span>{{ state.list.content.groupName }}</span>
          <el-divider direction="vertical" />
          <span>{{
            state.list.content.businessType == '1001' ? '选材' :
            state.list.content.businessType == '1010' ? '交底' :
            state.list.content.businessType == '1011' ? '量房' :
            state.list.content.businessType == '1002' ? '派单' :
            state.list.content.businessType == '1003' ? '预算' :
            state.list.content.businessType == '1004' ? '施工' :
            state.list.content.businessType == '1006' ? '上传' :
            state.list.content.businessType == '1005' ? '验收' :
            state.list.content.businessType == '1009' ? '评价' :
            state.list.content.businessType == '1012' ? '收款' : ''
          }}</span>
        </div>
        <div class="header-icon">
          <span
            v-if="$getPression('order_bizproject_edit')"
            @click="handleEdit"
          ><el-icon><edit-pen /></el-icon></span>
          <span
            @click="handleArrow('Up')"
          ><el-icon :class="isNotUp ? 'no-cursor' : ''"><top /></el-icon></span>
          <span
            @click="handleArrow('Down')"
          ><el-icon :class="isNotDown ? 'no-cursor' : ''"><bottom /></el-icon></span>
          <el-dropdown ref="dropdown" trigger="click">
            <span class="el-dropdown-link">
              <el-icon><finished /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu @click.stop>
                <el-tree
                  id="treeDome-dropdown"
                  ref="treeDome"
                  class="tree"
                  :data="data.groupList"
                  :expand-on-click-node="false"
                  :default-expanded-keys="defaultExpandedKeys"
                  :props="{
                    children: 'nodes',
                    label: 'nodeName'
                  }"
                  @node-click="nodeClick"
                >
                  <template #default="{ node, data }">
                    <span v-if="node.disabled" class="custom-tree-node">
                      <span>{{ data.nodeName }}</span>
                    </span>
                    <span v-else>
                      <span>{{ data.nodeName }}</span>
                    </span>
                  </template>
                </el-tree>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip
            v-if="$getPression('order_bizproject_del')"
            placement="bottom"
            width="50px"
            effect="light"
            style="min-width: 50px"
          >
            <span class="el-dropdown-link header-icon_only">
              <el-icon><more-filled /></el-icon>
            </span>
            <template
              #content
            ><span
              style="cursor: pointer"
              @click="deleteProjectNode"
            >删除</span></template>
          </el-tooltip>
          <span
            @click="handleCancel"
          ><el-icon><close /></el-icon></span>
        </div>
      </div>
      <div class="header-content">
        <div class="header-content_title">
          <img
            v-if="state.list.content.cardType == 0"
            class="header-content_img"
            :src="require(`@/assets/img/project/status_notStart_0.png`)"
          >
          <img
            v-if="state.list.content.cardType == 1"
            class="header-content_img"
            :src="require(`@/assets/img/project/status_process_1.png`)"
          >
          <img
            v-if="state.list.content.cardType == 2"
            class="header-content_img"
            :src="require(`@/assets/img/project/status_finish_2.png`)"
          >
          <img
            v-if="state.list.content.cardType == 3"
            class="header-content_img"
            :src="require(`@/assets/img/project/status_exceed_3.png`)"
          >
          <img
            v-if="state.list.content.cardType == 4"
            class="header-content_img"
            :src="require(`@/assets/img/project/statusLockout.png`)"
          >
          <span>{{ state.list.content.nodeName }}</span>
        </div>

        <div v-if="!state.list.content.cardType" class="project-time">
          <span v-if="state.list.content.expectStartTime&&!state.list.content.expectFinishTime">
            {{ getDateDiff(state.list.content.expectStartTime).result }}开始
          </span>
          <span v-if="state.list.content.expectFinishTime">
            {{ getDateDiff(state.list.content.expectFinishTime).result }}应完成
            <span v-if="getDaysBetween(new Date(),state.list.content.expectFinishTime) > 0">
              剩余{{ getDaysBetween(new Date(),state.list.content.expectFinishTime) }}天
            </span>
          </span>
        </div>

        <div
          v-if="state.list.content.cardType==1&&state.list.content.expectFinishTime"
          class="project-time"
        >
          <span
            v-if="state.list.content.delayDays ||
              (!state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, new Date()) >=1 ||
                state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, state.list.content.realEndTime) >=1)"
          >
            超期{{ state.list.content.delayDays ||
              !state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, new Date()) ||
              state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, state.list.content.realEndTime) }}天
          </span>
          （{{ getDate.Format(state.list.content.expectFinishTime,'MM月dd日') }}）应完成
          <span v-if="getDateDiff(state.list.content.expectFinishTime).days>=1">
            剩余{{ getDateDiff(state.list.content.expectFinishTime).days }}天
          </span>
        </div>

        <div
          v-if="state.list.content.cardType==2&&(state.list.content.delayDays ||
            !state.list.content.realEndTime&&getDaysBetween(state.list.content.expectFinishTime, new Date()) >=1 ||
            state.list.content.realEndTime&&getDaysBetween(state.list.content.expectFinishTime,state.list.content.realEndTime) >=1)"
          class="project-time"
        >
          超期{{ state.list.content.delayDays ||
            !state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, new Date()) ||
            state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, state.list.content.realEndTime) }}天完成
        </div>

        <div
          v-if="state.list.content.cardType==3&&(state.list.content.delayDays ||
            !state.list.content.realEndTime&&getDaysBetween(state.list.content.expectFinishTime, new Date()) >=1 ||
            state.list.content.realEndTime&&getDaysBetween(state.list.content.expectFinishTime,state.list.content.realEndTime) >=1)"
          class="project-time"
        >
          <span>
            超期{{ state.list.content.delayDays ||
              !state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, new Date()) ||
              state.list.content.realEndTime && getDaysBetween(state.list.content.expectFinishTime, state.list.content.realEndTime) }}天
            （{{ getDate.Format(state.list.content.expectFinishTime,'MM月dd日') }}）应完成
            <span v-if="getDateDiff(state.list.content.expectFinishTime).days>=1">
              已落后{{ getDateDiff(state.list.content.expectFinishTime).days }}天
            </span>
          </span>
        </div>

        <div class="header-content_palace">
          <!-- <img
            v-if="state.list.content.businessType == '1001'"
            :src="require(`@/assets/img/project/business_type_1001.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1002'"
            :src="require(`@/assets/img/project/business_type_1002.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1004'"
            :src="require(`@/assets/img/project/business_type_1004.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1005'"
            :src="require(`@/assets/img/project/business_type_1005.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1006'"
            :src="require(`@/assets/img/project/business_type_1006.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1009'"
            :src="require(`@/assets/img/project/business_type_1009.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1010'"
            :src="require(`@/assets/img/project/business_type_1010.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1011'"
            :src="require(`@/assets/img/project/business_type_1011.png`)"
          />
          <img
            v-if="state.list.content.businessType == '1012'"
            :src="require(`@/assets/img/project/business_type_1012.png`)"
          /> -->
          <el-tag
            v-if="
              state.list.content.personNumber && state.list.content.skillName
            "
            style="border-radius: 1.5rem"
          >{{
            '需' +
              state.list.content.skillName +
              state.list.content.personNumber +
              '人'
          }}
          </el-tag>
          <el-tag
            v-if="state.list.content.costs"
            style="border-radius: 1.5rem"
            type="danger"
          >总工费{{ state.list.content.costs }}元
          </el-tag>
        </div>
      </div>
    </div>
    <el-container class="main">
      <el-header id="header_id">
        <div class="main-info">
          <div class="main-info_content">
            <ul style="height: 50px">
              <li style="display: flex; align-items: center">
                <span>执行人</span>
                <el-tag
                  v-for="(item, index) in state.list.content.executeJobNames"
                  :key="index"
                  type="success"
                >{{ item }}
                </el-tag>
                <div
                  v-if="
                    state.list.content.persons &&
                      state.list.content.persons.length
                  "
                  class="main-info_zxr"
                >
                  <template v-if="state.list.content.executePersonId">
                    <img
                      style="width: 22px; height: 22px"
                      :src="
                        state.list.content.avatar
                          ? $getUrl.getPicUrl(state.list.content.avatar, true)
                          : require('@/assets/img/avatar.png')
                      "
                    >
                    <div>{{ state.list.content.executePersonName }}</div>
                  </template>
                </div>
              </li>
              <li>
                <span>计划时间</span>
                <span>{{ state.list.content.planDay }}天({{
                  (state.list.content.expectStartTime || '--') +
                    ' 至 ' +
                    (state.list.content.expectFinishTime || '--')
                }})</span>
              </li>
            </ul>
            <ul
              v-show="isOpen"
              class="main-info_content-show"
            >
              <li v-if="state.list.content.businessType == '1002'">
                <span>被派岗位</span>
                <el-tag>{{ state.list.content.skillName }}</el-tag>
              </li>
              <li>
                <span>分组</span>
                <span>{{ state.list.content.groupName }}</span>
              </li>
              <li>
                <span>间隔天数</span>
                <span>{{ state.list.content.planDay }}天</span>
              </li>
              <li>
                <span>响应时长</span>
                <span>{{ getWorkTime(state.list.content.expectStartTime,state.list.content.realEndTime) || '--' }}</span>
              </li>
              <li>
                <span>开始时间</span>
                <span>{{ state.list.content.realStartTime || '--' }}</span>
              </li>
              <li>
                <span>结束时间</span>
                <span>{{ state.list.content.realEndTime || '--' }}</span>
              </li>
              <li>
                <span>任务耗时</span>
                <span>{{ getWorkTime(state.list.content.realStartTime,state.list.content.realEndTime) || '--' }}</span>
              </li>
              <li style="width: 100%">
                <span>前置节点</span>
                <span
                  v-for="(item,index) in state.list.content.preNodeStatus"
                  :key="index"
                  style="cursor: pointer"
                  @click="toFrontNodeDetail(item,index)"
                >
                  <el-icon><Operation /></el-icon>
                  <span style="margin-right: 1em">{{ item.nodeName }}</span>
                  <span v-if="item.isShowState">
                    <span v-if="item.status==3" style="margin-right: 2em;color:#67c23a">
                      <el-icon><Check /></el-icon>已完成
                    </span>
                    <span v-if="item.status<3" style="margin-right: 2em;color:#f56c6c">
                      <el-icon><Close /></el-icon>未完成
                    </span>
                  </span>
                </span>
              </li>
              <li v-if="state.reviewsInfo && state.reviewsInfo.reviews && state.reviewsInfo.reviews.length">
                <span>审核人</span>
                <span>{{ state.reviewsInfo.reviews[0].personName + '（' + (state.reviewsInfo.reviews[0].skillName || '业主')+ '）' }}</span>
                <el-tag v-if="state.reviewsInfo.status == 5" type="warning">审核中</el-tag>
                <el-tag v-if="state.reviewsInfo.status == 6" type="success">审核通过</el-tag>
              </li>
            </ul>
          </div>
          <div class="main-info_icon" style="height:50px;line-height" @click="arrow">
            <span class="only">详细信息</span>
            <el-icon v-if="isOpen" :size="14">
              <arrow-up />
            </el-icon>
            <el-icon v-else :size="14">
              <arrow-down />
            </el-icon>
          </div>
        </div>
      </el-header>
      <el-main class="main-content" :style="mainHeight">
        <slot name="content" />
      </el-main>
    </el-container>
  </div>
</template>

<script lang='ts' setup>
import moment from 'moment'
import getDate from '@/getDate'
import {
  defineEmits,
  defineProps,
  ref,
  onMounted,
  watchEffect,
  reactive,
  watch,
  onUnmounted
} from 'vue'
import {
  getWorkTime,
  getCardType,
  getGroupType,
  getStatusImg,
  getDateDiff,
  getDaysBetween,
  getBusinessType,
  getTooltip,
  getStyleBorder
} from '@/components/project/projectItem/projectDetailNewData'
import store from '_@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { delObj } from '_c/util/api/banner'
import { fetch } from '_@/axios-config/axios'
import { async } from '@antv/x6/lib/registry/marker/main'

const { proxy } = getCurrentInstance() as any

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false
  },
  // 弹出方向
  // direction: {
  //     type: String,
  //     default:()=> 'rtl'
  // },
  // 标题
  title: {
    type: String,
    default: () => ''
  },
  // 尺寸
  size: {
    type: Number,
    default: () => 500
  },
  data: {
    type: Object,
    default: () => {
    }
  }
})
const state = reactive({
  reviewsInfo: {} as any,
  list: {} as any
} as any)
const isOpen = ref<any>(false)
provide("isOpen",isOpen)
const emit = defineEmits([
  'handleCancel',
  'handleEdit',
  'handleArrow',
  'nodeClick',
  'update:modelValue',
  'handleDel'
])
const showDrawer = ref<boolean>(false)
const dropdown: any = ref(null)
const treeDome: any = ref(null)
const headerRef: any = ref(null)
const defaultExpandedKeys: any = ref([])
const drawerModel: any = ref(null)
const currentParent = ref([])
const arrow = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    mainHeight.value.height = 'calc(100% - 120px)'
  } else {
    mainHeight.value.height = 'calc(100%)'
  }
}
const isNotUp = ref<boolean>(false)
const isNotDown = ref<boolean>(false)
const mainHeight = ref({
  height: ''
})

// 获取审查人
const getReviews = async() => {
  const nodeId = props.data && props.data.content && props.data.content.nodeId
  if (nodeId) {
    await fetch({
      url: `/order/project/node?nodeId=${nodeId}`,
      method: 'get'
    }).then((res:any) => {
      if (res.code == 0) {
        state.reviewsInfo = res.data
      }
    })
  }
}

// 关闭按钮触发事件
const handleCancel = () => {
  showDrawer.value = false
  emit('update:modelValue', showDrawer.value)
  emit('handleCancel', false)
}
// 编辑按钮触发事件
const handleEdit = () => {
  emit('handleEdit')
}
// 点击查看前置节点的执行情况
const toFrontNodeDetail = (data:any, i:number) => {
  data.isShowState = !data.isShowState
}
// 箭头触发事件
const handleArrow = (type: string) => {
  if (type == 'Up') {
    currentParent.value.some((v: any, i: number) => {
      if (v.nodeId == state.list.content.nodeId) {
        if (i == 0) {
          isNotUp.value = true
          state.list.content = currentParent.value[i]
        } else {
          isNotDown.value = false
          state.list.content = currentParent.value[i - 1]
        }
        return true
      }
    })
  }
  if (type == 'Down') {
    currentParent.value.some((v: any, i: number) => {
      if (v.nodeId == state.list.content.nodeId) {
        if (i == currentParent.value.length - 1) {
          isNotDown.value = true
          state.list.content = currentParent.value[i]
        } else {
          isNotUp.value = false
          state.list.content = currentParent.value[i + 1]
        }
        return true
      }
    })
  }
}
// 下拉树触发事件触发事件
const nodeClick = (node: any) => {
  if (node.nodeId) {
    state.list.content = node
    emit('nodeClick', node)
    // 关闭dropdown
    dropdown.value.handleClose()
  }
  // showDrawer.value = true
}
const getStyle = (index: any) => {
  switch (index) {
    case 0:
      return 'background: #C0C4CC;'
    case 1:
      return 'background: #409EFF;'
    case 2:
      return 'background: #2DA44E;'
    case 3:
      return 'background: #F56C6C;'
    case 4:
      return 'background: #409EFF;'
    default:
      return 'background: #C0C4CC;'
  }
}

onMounted(() => {
  // 监听点击事件，点击卡片,自身之外关闭抽屉
  document.addEventListener('click', (e: any) => {
    try {
      if (
        e.target.className.indexOf('tags-view') != -1 ||
        e.target.className.indexOf('navbar') != -1
      ) {
        showDrawer.value = false
        emit('update:modelValue', showDrawer.value)
      }
    } catch (error) {
    }
    // if(drawer){
    //     console.log(drawer.parentNode)
    //     console.log()
    //     if(e.target.className && drawer.className.indexOf('drawer')==-1){
    //         showDrawer.value = false;
    //         emit('update:modelValue', showDrawer.value)
    //     }
    // }
    // if(drawer){
    //     if( e.target.className &&
    //         !drawer.contains(e.target) &&
    //         typeof(e.target.className) !='object' &&
    //         e.target.className.indexOf('el-dropdown-menu') == -1){
    //         showDrawer.value = false;
    //         emit('update:modelValue', showDrawer.value)
    //     }
    // }
  })
})

// 删除节点事件
const deleteProjectNode = async () => {
  if (state.list.content.status > 0) {
    ElMessage.warning('该节点已被操作，不能删除')
    return false
  }
  emit('handleDel')
}

watch(
  () => store.state.menuClick,
  (newv) => {
    if (newv) {
      showDrawer.value = !newv
      emit('update:modelValue', showDrawer.value)
    }
  },
  { deep: true, immediate: true }
)
watchEffect(() => {
  showDrawer.value = props.modelValue
  if (!showDrawer.value) {
    // store.commit('menuClick', false)
  }

  state.list = props.data
  if (state.list && state.list.groupList) {
    state.list.groupList.some((v: any, index: number) => {
      v.nodeName = v.groupName
      v.disabled = true
    })
  }

  if (state.list &&
   state.list.content &&
    state.list.content.preNodeStatus &&
     state.list.content.preNodeStatus.length) {
    state.list.content.preNodeStatus.map((item:any) => {
      item['isShowState'] = false
    })
  }

  // 获取当前节点的兄弟节点
  if (state.list.groupList && state.list.groupList.length) {
    state.list.groupList.some((v: any, i: number) => {
      if (state.list.content.templateStageName == v.groupName) {
        currentParent.value = v.nodes
      }
    })
    if (currentParent.value.length) {
      isNotUp.value = false
      isNotDown.value = false
      currentParent.value.some((item: any, index: number) => {
        if (item.nodeId == state.list.content.nodeId) {
          if (index === 0) {
            isNotUp.value = true
          }
          if (index === currentParent.value.length - 1) {
            isNotDown.value = true
          }
        }
      })
    }
  }

  //  获取执行人信息
  if (state.list.content && state.list.content.executePersonId) {
    proxy?.$getUserById([state.list.content.executePersonId], (res: any) => {
      state.list.content.avatar = res.data[0].avatar || ''
    })
  }

  // 获取审核人信息
  getReviews()
})
</script>

<style scoped lang="less">
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  background: #ffffff;
  z-index: 999;
  box-shadow: -5px 0px 10px 0px rgba(0, 0, 0, 0.06);
}
.header {
  padding: 0 calc(4rem - 0.6rem);
  padding-right: 1rem;

  .header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #303133;
    font-size: 1.2rem;
    padding: 2rem 0;

    .header-icon {
      .header-icon_only {
        .icon {
          transform: rotate(90deg);
        }
      }

      .el-icon {
        margin-right: 0.6rem;
        font-size: 1.6rem;
        cursor: pointer;
        padding: 0.3rem;

        &:hover {
          background: #f3f4f8;
          border-radius: 2px;
        }

        &.no-cursor {
          cursor: not-allowed;
        }
      }
    }

    .header-label_content {
      // height: calc(100% - 1.8rem);
      width: 100%;
      background: #303133;
    }

    .header-title {
      display: flex;
      justify-content: center;
      align-items: center;

      .header-title_span {
        width: 0.6rem;
        height: 0.6rem;
        background: #c0c4cc;
        border-radius: 50%;
        margin-right: 0.5rem;
      }
    }
  }

  .header-content {
    height: calc(100% - 1.8rem);
    background: #ffffff;

    .header-content_title {
      color: #1a1a1a;
      font-size: 2rem;
      font-weight: 400;
      display: flex;
      align-items: center;
      // padding: 1rem 0;
      .header-content_img {
        margin-right: 1rem;
        width: 2rem;
        height: 2rem;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }

    .project-time{
      font-size: 12px;
      color: #F56C6C;
      margin-top: 1rem;
    }

    .header-content_palace {
      display: flex;
      align-items: center;
      height: 6.2rem;
      line-height: 6.2rem;

      img {
        margin-right: 1rem;
      }
    }
  }
}

.main {
  height: calc(100% - 14rem);
  :deep(.el-header){
    height: auto !important;
    padding: 0;
  }
  display: flex;
  flex-direction: column;

  .main-content {
    margin-top: 2rem;
    display: block !important;
    overflow-y: auto;
    position: relative;
  }

  .main-info {
    position: relative;
    height: max-content;
    background: #f5f7fa;
    padding: 0 4rem;
    display: flex;
    justify-content: space-between;
    box-shadow: none;

    .main-info_content {
      flex: 1;

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-flow: row wrap;

        li {
          width: 50%;

          .main-info_zxr {
            display: flex;
            align-items: center;

            img {
              border-radius: 50%;
              margin-right: 0.5rem;
            }

            & > div {
              color: #1a1a1a;
              font-size: 1.4rem;
              margin-right: 1rem;
            }
          }

          span {
            font-size: 1.2rem;

            &:first-child {
              display: inline-block;
              color: #909399;
              font-size: 1.2rem;
              width: 8rem;
            }

            &:last-child {
              font-size: 1.2rem;
            }
          }
        }
      }
    }

    .main-info_icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      position: absolute;
      right: 4rem;

      .only {
        color: #0969da;
        font-size: 1.2rem;
        padding-right: 1rem;
      }

      .el-icon {
        font-size: 1.6rem;
        color: #c0c4cc;
      }
    }
  }
}

.tree {
  margin-left: 1.5rem;

  .custom-tree-node {
    flex: 1;
    cursor: not-allowed;
  }
}

.el-tag {
  margin-right: 1rem;
}

.main-info_content-show {

  li {
    padding-bottom: 2.5rem;
  }
}
</style>
