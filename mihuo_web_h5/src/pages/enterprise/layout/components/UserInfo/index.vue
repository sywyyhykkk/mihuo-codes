<template>
  <div v-if="payStatus<=6 || !ispPerfect" class="pay" @click="companyStatus('do')">
    <el-icon :size="15">
      <credit-card />
    </el-icon>
    <span>开通支付功能</span>
  </div>
  <el-dropdown class="avatar-container" trigger="hover">
    <div id="user-container">
      <div class="message-wrapper" @click="openIm">
        <img src="@/assets/img/message.png" class="message-avatar">
      </div>
    </div>
  </el-dropdown>
  <el-dropdown class="avatar-container" trigger="hover">
    <div id="user-container">
      <div class="avatar-wrapper">
        <el-avatar :src="avatar" class="user-avatar" @error="error" />
        <span class="name-item" />
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item key="1">
          <span style="display: block" @click="toHome">首页</span>
        </el-dropdown-item>
        <el-dropdown-item key="2">
          <span style="display: block" @click="appLoginOut">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { resetRouter } from '_@/router'
import wsCache from '@/cache'
import { useRouter } from 'vue-router'
import { tagsViewStore } from '_@/store/modules/tagsView'
import { appStore } from '_@/store/modules/app'
import { ImStore } from '_@/store/modules/im'
import { loginOut } from '_c/util/api/app'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import getUrl from '@/getPic'
// import getUrl from '@/getPic.js'
import store from '_@/store'

export default defineComponent({
  name: 'UserInfo',
  setup() {
    const avatar = ref('')
    const { replace, push, currentRoute } = useRouter()
    const appLoginOut = () => {
      // wsCache.clear()
      loginOut().then(async (res) => {
        wsCache.delete(appStore.userInfoDetail)
        wsCache.delete(appStore.userInfo)
        wsCache.delete('imToken')
        wsCache.delete('imUserInfo')
        // im退出登录
        ImStore.Logout()
        await resetRouter() // 重置静态路由表
        await tagsViewStore.delAllViews() // 删除所有的tags标签页
        await replace('/login')
      })
    }

    const toHome = () => {
      push('/')
    }

    const ispPerfect = computed(() => {
      return store.state.ispPerfect
    })

    // 查看企业是否开通账户
    const payStatus = ref<number>(0)
    const userInfo = ref<any>(wsCache.get(appStore.userInfoDetail))
    const getAvatar = () => {
      const userInfo = wsCache.get('userInfoDetail')
      const userId = userInfo.sysUser.userId
      if (userInfo) {
        avatar.value = getUrl.avatarImage(userId, true)
      }
    }

    const openIm = () => {
      const user = wsCache.get('imUserInfo')
      if (!user) {
        ElMessage.info('您还不能使用聊天功能')
        return
      }
      ImStore.SetImShow(true)
    }

    const companyStatus = async (type: any) => {
      await fetch({
        url: '/pay/account/company/status',
        method: 'get',
        showErrorMessage: false
      }).then((res: any) => {
        if (res.code == '0') {
          const key: any = Object.keys(res.data)
          // if (key.join(',') != '0') {
          //   isShow.value = false
          // }
          payStatus.value = Number(key.join(','))
          if (payStatus.value == 0 && type == 'do') {
            openPay()
          }
          if (payStatus.value > 0 && payStatus.value <= 6 && type == 'do') {
            ElMessage.warning('已开通支付功能,请完善资产余额中的各项信息')
            if (currentRoute.value.fullPath != '/capital/assetsBalance') {
              push('/capital/assetsBalance')
            }
          }
          if (payStatus.value > 6) {
            store.commit('ispPerfect', true)
          }
        }
      })
    }

    // 开通账户
    const openPay = () => {
      ElMessageBox.confirm('是否确认开通企业支付账户?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await fetch({
          url: '/pay/account/company/register',
          method: 'post'
        }).then((res: any) => {
          if (res.code == '0') {
            ElMessage.success('企业支付账户开通成功')
            store.commit('registerAccount', true)
            if (currentRoute.value.fullPath != '/capital/assetsBalance') {
              push('/capital/assetsBalance')
            }
            companyStatus(null)
          }
        })
      })
    }

    const error = () => {
      avatar.value = require('@/assets/img/avatar.png')
    }

    onMounted(() => {
      getAvatar()
      companyStatus(null)
    })

    return {
      userInfo,
      getAvatar,
      appLoginOut,
      toHome,
      error,
      companyStatus,
      payStatus,
      avatar,
      openIm,
      openPay,
      ispPerfect
    }
  }
})
</script>

<style lang="less" scoped>
.message-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;

  .message-avatar {
    width: 18px;
    height: 18px;
  }

  .name-item {
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    margin-left: 5px;
  }
}

.avatar-container {
  margin-right: 0.5rem;
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

.pay {
  margin-right: 20px;
  background: #fef0f0;
  color: #f56c6c;
  padding: 0.7rem 1rem;
  border-radius: 1.3rem;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    margin-left: 0.5rem;
  }
}
</style>
