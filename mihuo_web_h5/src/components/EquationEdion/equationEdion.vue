<template>
  <div class="edion-text">
    <div class="et-handel--title">
      <div class="el-handel--button" @click="handelSelectButton(item.lable,0)" :style="item.buttonStyle"
           v-for="(item,index) in state.buttonList">{{ item.lable }}
      </div>
      <br />
      <el-dropdown split-button type="primary">
        空间参数
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item,index) in state.areaAttrList" :key="index"
                              @click="handelSelectButton(item.name,1)">{{ item.name }}
            </el-dropdown-item>
            <div v-if="state.areaAttrList.length==0" style="padding:1rem 2rem;color: #909399">暂无空间参数</div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="et-handel--input">
      <el-input v-model="state.equationValue" id="textarea" :rows="13" type="textarea"
                style="width: 100%;font-size: 2rem;"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, defineProps, defineEmits, watch, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  handelAreaChange: {
    type: Function,
    default: null
  },
  areaAttributeId: {
    type: String || Number,
    default: ''
  }
})
const emit = defineEmits()

const state = reactive({
  equationValue: '',
  areaAttrList: [],
  buttonList: [
    { lable: '{', buttonStyle: '' },
    { lable: '}', buttonStyle: '' },
    { lable: '[', buttonStyle: '' },
    { lable: ']', buttonStyle: '' },
    { lable: '(', buttonStyle: '' },
    { lable: ')', buttonStyle: '' },
    { lable: '<', buttonStyle: 'margin-left:2rem' },
    { lable: '>', buttonStyle: '' },
    { lable: '=', buttonStyle: '' },
    { lable: '²', buttonStyle: '' },
    { lable: '?', buttonStyle: '' },
    { lable: ':', buttonStyle: '' },
    { lable: '.', buttonStyle: '' },
    { lable: '+', buttonStyle: 'margin-left:2rem' },
    { lable: '-', buttonStyle: '' },
    { lable: '×', buttonStyle: '' },
    { lable: '÷', buttonStyle: '' },
    { lable: '@', buttonStyle: 'margin-left:2rem' },
    { lable: '%', buttonStyle: '' },
    { lable: '&', buttonStyle: '' },
    { lable: '||', buttonStyle: '' },
    { lable: '!', buttonStyle: '' }]
})
const handelSelectButton = (name: string, type: number) => {
  var elInput: any = document.getElementById('textarea')
  var startPos = elInput.selectionStart
  var endPos = elInput.selectionEnd
  if (startPos === undefined || endPos === undefined) return
  var txt = elInput.value
  var result = txt.substring(0, startPos) + name + txt.substring(endPos)
  elInput.value = result
  elInput.focus()
  elInput.selectionStart = startPos + name.length
  elInput.selectionEnd = startPos + name.length
  state.equationValue = elInput.value
  emit('update:modelValue', elInput.value)
  if (type === 1) {
    emit('handelAreaChange', name)
  }
}

watch(() => state.equationValue, () => {
  emit('update:modelValue', state.equationValue)
})
watchEffect(() => {
  state.equationValue = props.modelValue
  // if (props.areaAttributeId) {
  //   getAreaAttrData
  // }
})
const getAreaAttrData = async () => {
  await fetch({
    url: '/order/bizareaattributevalue/getByAttributeId/' + props.areaAttributeId,
    method: 'get'
  }).then((res: any) => {
    state.areaAttrList = res.data || []
    console.log(state.areaAttrList)
  })
}

onMounted(() => {
  // getAreaAttrData()
  if (props.areaAttributeId != 0) {
    getAreaAttrData()
  }
  state.equationValue = props.modelValue
})

</script>

<style scoped lang="less">
.edion-text {
  width: 102rem;
  height: 50rem;
  border: 0.1rem solid #eeeeee;
  border-radius: 0.4rem;
  margin: 2.2rem 0 2.2rem 2rem;

  .et-handel--title {
    background: #f4f4f4;
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    line-height: 5rem;

    .el-handel--button {
      line-height: 3.2rem;
      height: 3.2rem;
      border-radius: 0.4rem;
      text-align: center;
      width: 4rem;
      font-weight: bold;
      border: 0.1rem solid #e6e6e6;
      font-size: 1.8rem;
      background: #ffffff;

      &:hover {
        border: 0.1rem solid @mainColor;
        color: @mainColor;
      }
    }
  }

  .et-handel--input {
    width: 100%;
    height: 38rem;
  }
}

</style>
