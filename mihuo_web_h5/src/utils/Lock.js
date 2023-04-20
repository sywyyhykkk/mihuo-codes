import {
  fetch
} from '_@/axios-config/axios'
import wsCache from '@/cache'
import {
  ElMessage,
  ElMessageBox
} from 'element-plus'
//是否有锁判断
//这个锁是比较复杂的
class LockManage {
  constructor() {
    this.lockList = wsCache.get("allLockList") || [];
    wsCache.set("allLockList", this.lockList)
  }
  static async addLock({
    name,
    path,
    interval
  }) {
    const res = fetch({
      method: 'post',
      url: `/admin/resource/${name}/lock                `,
    }).then(res => {

    })
    //这里的path是属于解锁path
    this.lockList = wsCache.get("allLockList") || [];
    const index = this.lockList.find(item => item.path == path)
    if (!index) {
      this.lockList.push({
        name,
        path,
        interval
      })
    }
    wsCache.set("allLockList", this.lockList)
  }
  static async getLock({
    name,
    path,
    interval
  }, callback) {
    const res = await fetch({
      url: `/admin/resource/${name}/lock-status`
    })
    if (res && res.code == 0) {
      if (res.data && !res.data.locked) {
        this.addLock({
          name,
          path,
          interval
        })
        callback()
      } else {
        if (res.data && res.data.locked) {
          const user = res.data.lockedBy;
          const myInfo = wsCache.get("userInfoDetail");
          if (user.userId == myInfo.sysUser.userId) {
            this.addLock({
              name,
              path,
              interval
            })
            callback()
          } else {
            let curentTime = new Date().getTime() / 1000;
            let lockTime = new Date(user.lockTime).getTime() / 1000;
            if ((curentTime - lockTime) > 600) {
              ElMessageBox.confirm(`用户【${user.userName}】正在使用中，是否强行挤占`, {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'info'
              }).then(async () => {
                this.addLock({
                  name,
                  path,
                  interval
                })
                callback()
              })
            }else{
              this.addLock({
                name,
                path,
                interval
              })
              callback()
            }
          }
        }
      }
    }
  }
  static async detory(name) {
    if (!name) return
    const res = await fetch({
      method: 'post',
      url: `/admin/resource/${name}/unlock                `,
    })
    //销毁记录
    //删除记录
    this.lockList = wsCache.get("allLockList") || [];
    const index = this.lockList.findIndex(item => item.name == name);
    if (!(index < 0)) {
      clearInterval(this.lockList[index].interval)
      this.lockList.splice(index, 1)
      wsCache.set("allLockList", this.lockList)
    }
  }
}

export default LockManage
