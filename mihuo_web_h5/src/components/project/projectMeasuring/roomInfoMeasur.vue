<template>
  <div class="room">
    <div class="room-info" v-if="suTemplate.length">
      <div class="room-info_content" v-for="(item,index) in suTemplate" :key="index">
        <p>{{ item.partDesc }}</p>
        <div class="room-info_remark" v-for="(v,i) in item.surveyTemplateQuesDTOList" :key="i">
          <p>{{i + 1}}{{ props.data.standard }}</p>
          <el-tag round v-if="props.data.passFlag==1">通过</el-tag>
          <el-tag type="danger" round s v-if="props.data.passFlag==0">不通过</el-tag>
        </div>
      </div>
    </div>
    <el-empty
        v-else
        style="padding:0"
        :image-size="130"
        description="暂无数据~"
        :image="require('@/assets/img/empty/no_data.png')"
    />
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, defineEmits, defineProps, onMounted } from 'vue'

const props = defineProps({
  data: {//数据
    type: [Object,Array],
    default: []
  },
})
const suTemplate = ref([])
const emit = defineEmits()

watchEffect(()=>{
  suTemplate.value = props.data
})
</script>

<style scoped lang="less">
.room {
  .room-info {
    .room-row {
      border-bottom: 1px solid #F3F4F8;
      padding: 1rem 0;

      p {
        color: #1A1A1A;
        font-size: 1.4rem;
        font-weight: bold;
        padding-bottom: 1rem;
      }

      span {
        color: #909399;
        font-size: 1.4rem;
      }
    }

    .room-info_content {
      padding: 2rem 0 1rem;
      border-bottom: 1px solid #F3F4F8;

      p {
        color: #1A1A1A;
        font-size: 1.6rem;
        font-weight: bold;
      }

      .room-info_remark {
        margin-left: 2.5rem;
        font-size: 1.4rem;

        p {
          color: #909399;
          margin: 1rem 0;
        }

        .room-info_tgs {
          margin-top: 1rem;
          display: flex;
          flex-flow: row wrap;

          span {
            color: #0969DA;
            background: #ECF5FF;
            padding: .5rem 1rem;
            border-radius: 1.2rem;
            margin-right: 1rem;
          }

          img {
            height: 10rem;
            width: 10rem;
            border-radius: 1rem;
            background: #0969DA;
            margin: 0 1.5rem 1rem 0;
          }
        }
      }
    }
  }
}
</style>
