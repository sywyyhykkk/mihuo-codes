<template>
  <div>
    <draggable
      v-model="list"
      tag="ul"
      draggable=".buildProcess"
    >
      <div v-for="(item,index) in list" :key="index" class="buildProcess">
        <div :class="maxCount==1||!item.processPic?'center-card':''">
          <div class="center-card-left">
            <el-form-item>
              <upload-image v-if="imageType" :key="index" v-model="item.processPic" :max-count="maxCount"
                            :is-edits="isEdit" />
            </el-form-item>
          </div>
          <div class="center-card" style="margin-top: 0.5rem">
            <div>
              <el-form-item>
                <el-input v-model="item.title" placeholder="标题（必填）" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="item.description" type="textarea"
                          placeholder="描述（可不填）" />
              </el-form-item>
              <el-form-item v-if="standard">
                <el-input v-model="item.score" type="number" placeholder="分数" />
              </el-form-item>
              <el-form-item label="是否硬性指标" v-if="standard">
                <el-radio-group v-model="item.indexStatus">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="center-card-right">
              <el-icon class="minus" v-if="list.length>1" size="2rem" color="red" @click="deleteItem(index)">
                <delete />
              </el-icon>
            </div>

          </div>
        </div>
      </div>
    </draggable>
    <el-button icon="plus" class="addBuildProcess" type="text" @click="addItem()"> {{ title }}</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue'
// import uploadImage from '_c/UploadFile/uploadImage'
import uploadImage from '_c/UploadFile/uploadImage.vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  components: { uploadImage, draggable: VueDraggableNext },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: '添加'
    },
    isEdit: {
      type: Boolean,
      default: false
    }, protType: { //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    }, companyId: { // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    }, buttonType: {
      type: String,
      default: 'primary'
    }, standard: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const ruleForms = ref<any>('')
    const state = reactive({
      score: '',
      indexStatus: 0,
      imageType: true,
      list: props.modelValue ? JSON.parse(props.modelValue) : [{
        title: '',
        description: '',
        processPic: '',
        score: 0,
        indexStatus: 0 as number
      }],
      selectServiceList: ''
    })
    console.log(props.modelValue)
    const addItem = () => {
      console.log(state.list)
      state.list.push(
        {
          title: '',
          description: '',
          processPic: '',
          score: 0,
          indexStatus: 0 as number
        }
      )
    }
    const deleteItem = (i: number) => {
      state.list.splice(i, 1)
      state.imageType = false
      setTimeout(() => {
        state.imageType = true
      }, 100)
    }
    watch(state.list, () => {
      context.emit('update:modelValue', JSON.stringify(state.list))
    })
    return {
      // rules,
      ruleForms,
      addItem,
      deleteItem,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.center-card {
  display: flex;
  align-items: center;
  margin-top: -2.7rem;

  .center-card-left {
    width: 11rem;
    margin-right: 2rem;
  }

  .center-card-right {
    margin-left: 2rem;
  }
}

.buildProcess {
  /*border: 1px dashed #999999;*/
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.addBuildProcess {
  text-align: center;
  color: @mainColor !important;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
}

.minus {
  width: 2.5rem;
  height: 2.5rem;
  margin-top: 2.5rem;
  cursor: pointer;
}

</style>
