<template>
  <div class="room">
    <div class="room-info" v-for="item in surveyTemplate">
      <div class="part">
        <div class="part-name">{{ item.partName }}</div>
        <div class="part-desc">{{ item.partDesc }}</div>
      </div>
      <div class="room-info_content" v-for="(item2,index) in item.surveyTemplateQuesDTOList">
        <div>{{ 1 + index }}、</div>
        <div>
          <p>{{ item2.quesName }}</p>
          <div class="room-info_remark">
            <p>{{ item2.quesDesc }}</p>
            <el-tag v-if="item2.quesType!=4" round v-for="item3 in item2.answer.split(',')">
              {{ item3 }}
            </el-tag>
            <div v-if="item2.quesType==4&&item2.answer" class="room-info_tgs">
              <div v-for="item3 in JSON.parse(item2.answer)">
                <img v-if="item3.type=='img'" :src="$getUrl.getPicUrl(item3.url)" />
                <audioPlay v-if="item3.type=='audio'" :src="$getUrl.getPicUrl(item3.url)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty
      v-if="surveyTemplate.length==0"
      :image-size="130"
      description="暂无数据~"
      :image="require('@/assets/img/empty/no_data.png')"
    />
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, defineEmits, defineProps, onMounted, inject, ref } from 'vue'
import { fetch } from '_@/axios-config/axios'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits()
const surveyTemplate = ref<any>([])
let projectId = inject('projectId')//项目模板id

// quesType: '', // 1 单选 2多选 3填空 4文件

// 获取房屋信息，//量房模板
const getTemplate = async () => {

  await fetch({
    url: `order/measure/room/get`,
    method: 'get',
    params:{
      nodeId:props.data.nodeId
    }
  }).then((res: any) => {
    if (res.data.answer) {
      surveyTemplate.value = JSON.parse(res.data.answer.answerContent)
    }
  })
}
onMounted(() => {
  getTemplate()
})

</script>

<style scoped lang="less">
.room {
  margin-bottom: 2rem;
  .room-info {
    .part {
      border-bottom: solid 1px #F3F4F8;
      padding: 20px 0 12px 0;
      .part-name {
        font-size: 12px;
        font-weight: bold;
        color: #1A1A1A;
      }

      .part-desc {
        font-size: 12px;
        color: #909399;
        margin-top: 12px;
      }
    }


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
      padding: 2rem 0;
      border-bottom: 1px solid #F3F4F8;
      display: flex;

      p {
        color: #303133;
        font-size: 14px;
        font-weight: 400;
      }

      .room-info_remark {
        //margin-left: 2.5rem;
        margin-top: 1rem;
        font-size: 12px;

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
            margin: 0 1.5rem 0rem 0;
          }
        }
      }
    }
  }
}
</style>
