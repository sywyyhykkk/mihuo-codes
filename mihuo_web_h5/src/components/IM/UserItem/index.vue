<template>
  <div class="userCard">
    <el-avatar
      shape="square"
      @error="error"
      :src="cover"
      class="avatar"
    ></el-avatar>
    <div class="itemContent">
      <div class="label">
        <span class="targetName">{{ detail.TargetName }}</span>
        <span class="date">{{ getDate(detail.ChangeTime) }}</span>
      </div>
      <div class="content">{{ detail.LastContent }}</div>
    </div>
  </div>
</template>

<script>
import { getShowDate } from '@/utils/chat.js'
import { imageGlobal } from '@/global'
import wsCache from '@/cache'
import { base64Avatar } from '@/global'
const imsdk = require('@/xsoftimsdk.js')
export default {
  name: 'UserItem',
  props: {
    config: {
      type: Object
    },
    detail: {
      type: Object,
      default: {}
    }
  },
  methods: {
    getDate(temp) {
      return getShowDate(temp)
    },
    error() {
      this.cover = base64Avatar
    }
  },
  data() {
    const imUser = wsCache.get('imUserInfo')
    let imavatar
    if (this.detail.Type == imsdk.enums.SessionType.Normal) {
      imavatar =
        imUser.baseUrl + '/api/Common/GetAvatar?userId=' + this.detail.TargetId
    } else {
      imavatar =
        imUser.baseUrl +
        '/api/Common/GetGroupAvatar?groupId=' +
        this.detail.TargetId
    }
    return {
      icon: 'el-icon-star-off',
      cover: imavatar
    }
  },
  watch: {},
  computed: {}
}
</script>
<style  scoped lang="less">
.userCard {
  padding: 15px;
  border-radius: 0.7rem;
  text-align: left;
  display: flex;
  align-items: center;
}
.userCard .item {
  width: 100%;
  padding: 0.1rem 0;
  display: flex;
  flex: 1;
}
.userCard .item > * {
  display: inline-block;
}
.cover {
  width: 150px;
}
.icon {
  width: 1.2rem;
}
.itemContent {
  padding-left: 15px;
}
.label {
  color: #333;
  font-size: 18px;
  margin: 5px 0 10px 0;
  display: flex;
  width: 300px;
  .targetName {
    flex: 1;
    display: block;
  }
  .date {
    display: block;
    font-size: 12px;
    color: #999;
  }
}
.content {
  padding-left: 0.4rem;
  color: #999;
  font-size: 16px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.avatar {
  background: #fff;
}
</style>
