<template>
  <div class="room">
    <div class="room-info">
      <div class="room-info_content">
        <div class="content-title">
          <div style="color:#F56C6C;width: 1rem">{{ props.data.checkFlag == '1' ? '*' : '' }}</div>
          <div>{{ props.dataIndex }}、{{ props.data.itemName || props.data.title }}&nbsp; ({{ props.data.score }}分)</div>
        </div>
        <div class="room-info_remark">
          <p style="font-size: 1.2rem;line-height: 1.8rem">{{ props.data.standard || props.data.description }}</p>
          <div v-if="!props.isEdit">
            <el-tag round v-if="props.data.passFlag==1">通过</el-tag>
            <el-tag type="danger" round s v-if="props.data.passFlag==0">不通过</el-tag>
          </div>
          <div v-if="props.isEdit">
            <el-radio class="option-check" :label="0">通过
            </el-radio>
            <el-radio class="option-check" :label="1">不通过
            </el-radio>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, defineEmits, defineProps, onMounted } from 'vue'

const props = defineProps({
  data: {//数据
    type: Object,
    default: {}
  }, dataIndex: {//序号
    type: String || Number,
    default: 0
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits()

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

      .content-title {
        color: #303133;
        font-size: 1.6rem;
        display: flex;
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
