<template>
  <div>
    <el-card shadow="never">
      <el-form
        ref="ruleForms"
        :model="form"
        label-width="120px"
        style="width: 600px"
        size="small"
      >
        <el-form-item label="订单编号:">{{ form.orderId }}</el-form-item>
        <el-form-item label="评价时间:">{{ form.createTime }} </el-form-item>
        <el-form-item label="用户账号:">{{ form.memberId }} </el-form-item>
        <el-form-item label="评价方式:"
          >{{ getCommentWay(form.replyType) }}
        </el-form-item>
        <el-form-item label="评价等级:">
          {{ getCommentLevel(form.productScore) }}</el-form-item
        >
        <el-form-item label="评价内容:">{{ form.comment }} </el-form-item>
        <el-form-item label="评价图片:">
          <div v-for="item in form.pics&&form.pics.split(',')" :key="item">
            <img v-if="form.pics" :src="item" alt="评价图片" />
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  components: {},
  props: {
    comment: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      form: props.comment,
    })

    const getCommentWay = (way: any) => {
      switch (way as number) {
        case 0:
          return '普通评价'
        case 1:
          return '带图评价'
        default:
          return ''
      }
    }

    const getCommentLevel = (score: any) => {
      switch (score as number) {
        case 1:
          return '一星'
        case 2:
          return '二星'
        case 3:
          return '三星'
        case 4:
          return '四星'
        case 5:
          return '五星'
        default:
          return ''
      }
    }

    return {
      getCommentWay,
      getCommentLevel,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>
