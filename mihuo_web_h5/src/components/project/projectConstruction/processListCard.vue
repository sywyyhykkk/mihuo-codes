<template>
  <div class="process-item">
    <div>
      <div class="process-title">
        <el-tag type="info" effect="dark" v-if="props.data.status==0">未开始</el-tag>
        <el-tag type="success" effect="dark" v-if="props.data.status==2">已完成</el-tag>
        <el-tag type="warning" effect="dark" v-if="props.data.status==1">进行中</el-tag>
        <div class="item-title">{{ props.data.name }}</div>
      </div>
      <div class="process-text">
        {{ props.data.description }}
      </div>
      <el-button type="primary" plain class="process-button" style="height: 24px" @click="getData">
        查看
      </el-button>
    </div>
    <img v-if="props.data.coverImg" :src="$getUrl.getPicUrl(props.data.coverImg,false)" class="process-img" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, reactive } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getData'])
const state = reactive({
  colorList: [{
    status: 0,
    name: '未开始',
    color: '#FFFFFF',
    bgColor: '#C0C0C0'
  },
    {
      status: 1,
      name: '进行中',
      color: '#FF5D35',
      bgColor: '#FEF1E3'
    },
    {
      status: 2,
      name: '已完成',
      color: '#10C57D',
      bgColor: '#D5FFEE'
    }
  ]
})

const getData = () => {
  emit('getData')
}
</script>

<style scoped lang="less">
.process-item {
  background: #F5F7FA;
  border-radius: 6px;
  margin: 1rem 0 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;

  .process-button {
    margin-top: 1.4rem;
    background: #ffffff !important;

    &:hover {
      opacity: 0.7 !important;
      color: #0969DA !important;
    }
  }

  .process-text {
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    margin-top: 1.4rem;
    min-height: 4rem;
  }

  .process-title {
    display: flex;
    align-items: center;

    .item-title {
      font-size: 14px;
      color: #303133;
      margin-left: 1rem;
    }
  }

  .process-img {
    width: 100px;
    height: 100px;
    background: #0969DA;
    border-radius: 6px;

  }
}

</style>
