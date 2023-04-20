<template>
  <el-dropdown class="avatar-container" trigger="hover">
    <div id="user-container">
      <div class="avatar-wrapper">
        <el-avatar :src="avatar" class="user-avatar" @error="error" />
        <span class="name-item">平台端管理员</span>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item key="1">
          <span style="display: block;" @click="toHome">首页</span>
        </el-dropdown-item>
        <el-dropdown-item key="2">
          <span style="display: block;" @click="loginOut">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent , onMounted, ref } from 'vue'
import { resetRouter } from '_@/router'
import wsCache from '@/cache'
import { useRouter } from 'vue-router'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { appStore } from '_@/store/modules/app'
import getUrl from '@/getPic'
export default defineComponent({
  name: 'UserInfo',
  setup() {
    const { replace, push } = useRouter()
    const avatar = ref('')
    async function loginOut(): Promise<void> {
      // wsCache.clear()
      wsCache.delete(appStore.userInfo)
      await resetRouter() // 重置静态路由表
      await tagsViewStore.delAllViews() // 删除所有的tags标签页
      await replace('/login')
    }

    function toHome() {
      push('/')
    }

    const getAvatar = () => {
      const userInfo = wsCache.get('userInfoDetail')
      const userId = userInfo.sysUser.userId
      if (userId) {
        avatar.value = getUrl.avatarImage(userId, true)
      }
    }

    const error = () => {
      avatar.value = require('@/assets/img/avatar.png')
    }

    onMounted(() => {
      getAvatar()
    })

    return {
      avatar,
      error,
      loginOut,
      toHome
    }
  }
})
</script>

<style lang="less" scoped>
.avatar-container {
  margin-right: 30px;
  padding: 0 10px;
  .avatar-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 2px;
    }
    .name-item {
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin-left: 5px;
    }
  }
}
</style>
