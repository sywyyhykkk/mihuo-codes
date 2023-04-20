<template>
  <el-drawer
    v-model="drawerShow"
    :title="state.surveyName"
    direction="rtl"
    @close="closeHandelDrawer"
  >
    <div class="darwer-data">
      <div class="paragraph" v-for="item in state.partList">
        <div class="paragraph-name">{{ item.partName }}</div>
        <div class="paragraph-desc">{{ item.partDesc }}</div>
        <div class="questions" v-for="(item2,index2) in item.surveyTemplateQuesDTOList">
          <div class="questions-name">{{ index2 + 1 }}、</div>
          <div style="width: 100%">
            <div class="questions-title">
              <div class="questions-name">{{ item2.quesName }}</div>
              <div class="questions-type" v-if="props.disabled">{{ getQuesType(item2.quesType) }}</div>
            </div>
            <div class="questions-desc">{{ item2.quesDesc }}</div>
            <div class="questions-center" v-if="item2.quesType=='1'">
              <el-radio class="option-check"
                        :disabled="props.disabled"
                        v-for="item3 in item2.surveyTemplateOptionDTOList"
                        :label="item3.optionName"
                        v-model="item2.answer"></el-radio>
            </div>
            <div class="questions-center" v-if="item2.quesType=='2'">
              <div v-for="item3 in item2.surveyTemplateOptionDTOList" class="option-check">
                <el-checkbox :disabled="props.disabled"
                             v-model="item3.checked"
                             :label="item3.optionName"></el-checkbox>
              </div>
            </div>
            <div class="questions-center" style="margin-top: 1.8rem" v-if="item2.quesType=='3'">
              <el-input :disabled="props.disabled" style="width: 100%;" v-model="item2.answer" type="textarea" />
            </div>
            <div class="questions-center" style="margin-top: 1.8rem" v-if="item2.quesType=='4'">
              <uploadFile :isJson="true" :disabled="props.disabled" v-model="item2.answer" />
            </div>
          </div>
        </div>
      </div>

      <el-empty
        v-if="state.partList.length==0"
        :image-size="218"
        description="暂未配置问卷~"
        :image="require('@/assets/img/empty/no_data.png')"
      />

      <div class="drawer-footer" v-if="!props.disabled">
        <el-button class="footer-button" type="primary" @click="saveSurvey">保存</el-button>
        <el-button class="footer-button" @click="closeHandelDrawer">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watchEffect } from 'vue'
import { getTemplateDetailsById } from '_@/api/basicConfig'

const props = defineProps({
  modelValue: {//控制抽屉的显示
    type: Boolean,
    default: false
  }, surveyId: {//问卷id
    type: String || Number,
    default: '0'
  }, surveyName: {//问卷名称
    type: String,
    default: ''
  }, data: {//问卷内容
    type: Object,
    default: []
  }, disabled: {//是否禁用
    type: Boolean,
    default: true
  }, type: {//类型product_measure->材料测量,order_disclose->开工交底,room_measure->量房
    type: String,
    default: ''
  }
})
const emit = defineEmits(['saveSurvey'])
const drawerShow = ref<boolean>(false)
const state = reactive({
  surveyName: '',
  partList: [] as any
})

const getQuesType = (val: any) => {
  if (val == '1') {
    return '单选'
  }
  if (val == '2') {
    return '多选'
  }
  if (val == '3') {
    return '文本'
  }
  if (val == '4') {
    return '文件'
  }
}

//保存问卷
const saveSurvey = async () => {
  // console.log(state.partList)
  emit('saveSurvey', state.partList)
}

const closeHandelDrawer = () => {
  drawerShow.value = false
  emit('update:modelValue', false)
}

//获取问卷信息
const getSurveyData = () => {
  getTemplateDetailsById({ id: props.surveyId }).then((res) => {
    if (res.data) {
      state.surveyName = res.data.surveyName
      state.partList = JSON.parse(JSON.stringify(res.data.surveyTemplatePartDTOList))
    }
  })
}


watchEffect(() => {
  drawerShow.value = props.modelValue
  state.partList = []
  setTimeout(() => {
    if (drawerShow.value) {
      console.log(props.data)
      if (props.data.length == 0 && props.surveyId) {
        getSurveyData()
      } else {
        state.surveyName = props.surveyName
        state.partList = JSON.parse(JSON.stringify(props.data))
      }
    }
  }, 200)
})
</script>

<style scoped lang="less">
.darwer-data {
  padding: 0 4rem;

  .drawer-footer {
    height: 68px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: solid 1px #F3F4F8;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    z-index: 2000;

    .footer-button {
      height: 30px;
      border-radius: 15px;
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  .paragraph {
    border-bottom: solid 1px #F3F4F8;
    margin-bottom: 8rem;

    .questions {
      border-top: 1px dashed #F3F4F8;
      padding: 2rem 0;
      display: flex;

      .questions-title {
        display: flex;
        justify-content: space-between;
        height: 24px;
      }

      .questions-type {
        height: 24px;
        background: #ECF5FF;
        border-radius: 12px;
        line-height: 24px;
        padding: 0 9px;
        font-size: 12px;
        font-weight: 400;
        color: #0969DA;
        margin-left: 20px;
        min-width: 30px;
      }

      .questions-name {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
        line-height: 20px;
      }

      .questions-desc {
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        margin-top: 0.7rem;
        line-height: 20px;
      }

      .questions-center {
        display: flex;
        flex-wrap: wrap;

        .option-check {
          min-width: 40%;
          margin-top: 1.8rem;
        }
      }
    }

    .paragraph-name {
      font-size: 12px;
      font-weight: bold;
      color: #1A1A1A;
      margin-top: 30px;
      margin-bottom: 12px;
    }

    .paragraph-desc {
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      margin-bottom: 12px;
      line-height: 20px;
    }

  }

}

</style>
