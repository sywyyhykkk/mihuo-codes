<template>
  <div class="sessionBar">
    <div class="sessionBarBox">
      <div class="searchContent">
        <el-input
          v-model="search" placeholder="请输入内容"
          size="18"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="sessions">
        <div
          v-for="item in sessionList"
          :key="item.TargetId"
          :ref="`session${item.TargetId}`"
          :style="sessionItemStyle"
          :class="{
            sessionItem: true,
            selectActive: activeItem == item.TargetId
          }"
          @click.stop="bindClick(item)"
        >
          <UserItem :detail="item" />
          <div class="itemOperation">
            <el-dropdown>
              <el-icon class="more-color"><more-filled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="bindOperation(item)"
                  >删除会话</el-dropdown-item>
                  <el-dropdown-item
                    v-if="item.Type == $imsdk.enums.SessionType.Group"
                    @click="editGrouName(item)"
                  >修改群名称</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <template v-if="!sessionList.length">
            <ChatEmpty />
          </template>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="群名称修改">
      <el-form :model="group">
        <el-form-item label="群名称">
          <el-input v-model="group.TargetName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">暂不修改</el-button>
          <el-button type="primary" @click="submitGroupName">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Scroll from '@/utils/scroll'
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance
} from 'vue'
import imrequest from '@/utils/imrequest.ts'
import { ImStore } from '_@/store/modules/im'
import wsCache from '@/cache'
import { appStore } from '_@/store/modules/app'
import { Calendar, Search } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'SessionBar',
  props: {
    config: {
      typeof: Object,
      default: () => ({
        list: [],
        active: null
      })
    }
  },
  setup(props) {
    const search = ref('')
    const moveObj = reactive({})
    const dialogFormVisible = ref(false) //
    const group = ref({})
    let scroll = ref('')
    const complete = ref('')
    const operationTime = ref('')
    const proxy = getCurrentInstance().proxy
    const activeItem = computed(() => {
      const { toUser } = ImStore
      // console.log(toUser)
      return toUser.TargetId || 0
    })
    const sessionList = computed(() => {
      const { sessionList } = ImStore
      const searchData = sessionList.filter(
        (item) => item.TargetName?.indexOf(search.value) > -1
      )
      return searchData
    })
    const sessionItemStyle = computed(() => {
      const { listHeight: height = 'auto' } = props.config
      return {
        height
      }
    })

    const winBarStyle = computed(() => {
      const { width = 'auto' } = config
      return {
        width
      }
    })
    watch(
      () => props.config.active,
      () => {},
      {},
      { deep: true, immediate: true }
    )
    watch(
      () => props.config.list,
      () => {},
      {},
      { deep: true, immediate: true }
    )
    watch(
      () => ImStore.toUser,
      (newvalue, oldvalue) => {
        const { toUser, num, size } = ImStore
        // console.log(toUser)
      },
      {},
      { deep: true, immediate: true }
    )
    onMounted(() => {
      scroll = new Scroll('.sessionBar', {
        click: true,
        scrollbars: true,
        mouseWheel: true,
        preventDefault: false,
        interactiveScrollbars: true,
        hijackInternalLinks: true,
        mouseWheelSpeed: 1
      })
    })
    const bindClick = (play) => {
      // 选中聊天的人
      ImStore.SetToUser(play)
      // im消息设置为已读
      const index = ImStore.sessionList.findIndex(
        (item) => item.TargetId == play.TargetId
      )
      ImStore.sessionList[index].UnreadCount = 0
    }
    const editGrouName = (item) => {
      dialogFormVisible.value = true
      group.value = { ...item }
    }
    const submitGroupName = () => {
      imrequest
        .post('/api/Group/SetName', {
          groupId: group.value.TargetId,
          name: group.value.TargetName
        })
        .then((res) => {
          console.log(res)
          if (res.Data) {
            dialogFormVisible.value = false
            group.value = {}
          }
        })
    }
    const bindOperation = (play) => {
      const index = ImStore.sessionList.findIndex(
        (item) => item.TargetId == play.TargetId
      )
      // 接口删除
      imrequest
        .post(`/api/Session/DeleteSession`, {
          targetId: play.TargetId,
          type: play.Type
        })
        .then((res) => {
          ImStore.sessionList.splice(index, 1)
        })
    }
    const scrollRefresh = () => {
      if (scroll.value) return
      complete = setInterval(function () {
        // 判断文档和所有子资源(图片、音视频等)已完成加载
        if (document.readyState === 'complete') {
          window.clearInterval(that.complete)
          scroll.value.refresh()
        }
      }, 50)
    }
    return {
      search,
      moveObj,
      scroll,
      dialogFormVisible,
      complete,
      operationTime,
      activeItem,
      sessionList,
      sessionItemStyle,
      winBarStyle,
      group,
      bindClick,
      editGrouName,
      bindOperation,
      submitGroupName,
      scrollRefresh
    }
  }
})
</script>
<style lang='less' scoped>
.searchContent {
  padding: 20px 20px 10px 20px;
  background: #f5f7fa;
}
.sessionBar {
  background: #fff;
  height: 100%;
  overflow: auto;
  touch-action: none; /*一定要有*/
  display: flex;
  border-right: 1px solid #dcdfe6;
  :deep(.el-dialog__body) {
    min-height: auto;
  }
  .sessionItem {
    align-items: center;
    padding: 10px;
    position: relative;
    transition: transform 0.6s;
    background: #fff;
    user-select: none;
    border-bottom: 1px solid #f9f9f9;
    &:hover {
      background: #f9f9f9;
      .itemOperation {
        opacity: 1;
      }
    }
    &.selectActive {
      background: #ecf5ff;
    }
    .itemOperation {
      .more-color {
        color: @mainColor;
        font-size: 18px;
      }
      position: absolute;
      right: 10px;
      top: 50%;
      opacity: 0;
      font-size: 18px;
      width: 20px;
      color: @mainColor;
    }
  }
  :deep(.el-divider__text) {
    padding: 0 5px;
  }
}
</style>
