<template>
  <div class="accept-card">
    <div class="accept-person">
      <img
        :src="$getUrl.getPicUrl(props.data.acceptanceCreateAvatar||props.data.applyPersonAvatar)"
        class="accept-img"
        @error="$getUrl.imageError($event)"
      >
      <span
        style="margin-left: 1rem"
      >{{ props.data.acceptanceCreateName || props.data.applyPersonName
      }}({{ props.data.acceptanceCreateSkillName || props.data.applyPersonSkillName }})</span>
      <span style="margin-left: 1rem;color: #909399">
        {{ props.data.acceptanceCreateTime || props.data.applyTime }}
        {{ props.data.acceptanceCreateTime ? '' : '发起了验收申请' }}
      </span>
    </div>

    <div class="accept-title">{{ props.data.name }}（第{{ props.data.times }}次）</div>
    <div class="accept-value">
      <span> {{ props.data.score }}分</span>
      <el-tag round style="margin-left: 1rem">
        {{ $getNum.numAdd(data.qualifiedCount, data.unqualifiedCount) + props.data.notCount }}项验收
      </el-tag>
      <el-tag type="success" round style="margin-left: 1rem">{{ props.data.qualifiedCount }}项合格</el-tag>
      <el-tag type="danger" round style="margin-left: 1rem">{{ props.data.unqualifiedCount }}项不合格</el-tag>
      <el-tag type="info" round style="margin-left: 1rem">{{ props.data.notCount }}项未做</el-tag>
    </div>
    <el-button
      v-if="props.data.acceptanceCreateName"
      type="primary"
      plain
      class="process-button"
      @click="getData"
    >
      查看
    </el-button>
    <el-button
      class="download-button"
      type="primary"
      :loading="isLoading"
      @click="downloadReport"
    >下载报告</el-button>
    <img v-if="props.data.statusFlag==2" class="accept-card--type" :src="require('@/assets/img/project/no_pass.png')">
    <img v-if="props.data.statusFlag==1" class="accept-card--type" :src="require('@/assets/img/project/is_pass.png')">
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineEmits, defineProps } from 'vue'
import { imageGlobal } from '@/global'
import { fetch } from '_@/axios-config/axios'
import { get_env } from '@/utils/env'
const isLoading = ref<boolean>(false)// 下载报告
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getData'])

const getData = () => {
  emit('getData')
}
// 下载交底报告
const downloadReport = async () => {
  isLoading.value = true
  const env = get_env(process.env.VUE_APP_API_ENV)
  let type = 0
  if (env === 'dev') {
    type = 1
  } else if (env === 'test') {
    type = 2
  } else if (env === 'uat') {
    type = 3
  } else if (env === 'prod') {
    type = 4
  }
  const url = `reports?type=3&id=${props.data.id}&urlEnv=${type}&log=1&fileName=${props.data.name}`
  await fetch({
    url,
    method: 'get'
  }).then((res: any) => {
    if (res.code === 0 && res.data.url) {
      isLoading.value = false
      window.open(imageGlobal + res.data.url)
      ElMessage.success('下载成功')
    }
  }).finally(() => {
    isLoading.value = false
  })
}
</script>

<style scoped lang="less">
.accept-card--type {
  position: absolute;
  right: 0;
  top: 0;
  width: 53px;
  height: 53px;
}

.accept-card {
  background: #FFFFFF;
  border: 1px solid #F3F4F8;
  border-radius: 6px;
  padding: 2rem;
  margin: 2rem 0;
  position: relative;

  .process-button {
    background: #ffffff !important;
    height: 2.4rem;

    &:hover {
      opacity: 0.7 !important;
      color: #0969DA !important;
    }
  }
  .download-button{
    height: 2.4rem;
  }
  .accept-value {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    font-size: 14px;
    color: #0969DA;
  }

  .accept-title {
    font-size: 14px;
    margin-top: 1.5rem;
    color: #303133;
  }

  .accept-img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  .accept-person {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    color: #1A1A1A;
  }
}

</style>
