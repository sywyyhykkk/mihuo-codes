<template>
  <div>
    <el-drawer
      v-model="state.showDrawer"
      title="工序清单"
      direction="rtl"
      @close="closeHandelDrawer"
    >
      <div class="my-drawer__body">
        <div class="body-top">
          <div class="body-data">
            <div>
              <div class="body-center-top">
                <el-tag type="info" effect="dark" v-if="props.data.status==0">未开始</el-tag>
                <el-tag type="success" effect="dark" v-if="props.data.status==2">已完成</el-tag>
                <el-tag type="warning" effect="dark" v-if="props.data.status==1">进行中</el-tag>
                <span class="body-title">{{ props.data.name }}</span>
              </div>
              <div class="body-desc"> {{ props.data.description }}</div>
            </div>
            <div>
              <img v-if="props.data.coverImg" :src="$getUrl.getPicUrl(props.data.coverImg,false)"
                   class="body-data-img" />
            </div>
          </div>
          <div class="body-card">
            <div class="process-fint">施工标准</div>
            <parsing-index :data="state.buildStandard" />
            <!--            <div v-for="(item,index) in state.buildProcess">-->
            <!--              <div class="fint-card-data" v-if="item.title">{{ index + 1 }}、{{ item.title }}</div>-->
            <!--              <div class="edit-cause" style="margin-top: 1.2rem" v-if="item.processPic">-->
            <!--                <el-image-->
            <!--                  v-for="item2 in item.processPic.split(',')"-->
            <!--                  style="width: 80px;height: 80px"-->
            <!--                  class="popover-data-img"-->
            <!--                  preview-teleported-->
            <!--                  :src="$getUrl.getPicUrl(item2, true, true)"-->
            <!--                  :preview-src-list="$getUrl.getPicUrl(item2)"-->
            <!--                />-->
            <!--              </div>-->
            <!--            </div>-->
          </div>

        </div>
        <div style="padding: 4rem;">
          <dotStep v-if="state.processList.length>0" v-for="(item,index) in state.processList" :key="item.id"
                   :wireType="index+1==state.processList.length?false:true">
            <template #stepTitle>
              <div class="person-info">
                <img class="person-img"
                     :src="item.personAvatar?$getUrl.getPicUrl(item.personAvatar):require('@/assets/img/avatar.png')">
                <div class="person-name">{{ item.personName }}（{{ item.personSkillName }}）</div>
                <span style="margin-left: 1rem;color: #909399;">{{ item.created }} </span>
                <span v-if="item.status==2" style="margin-left: 1rem;color: #2DA44E;">完成</span>
                <!--                <span v-if="item.status==1" style="margin-left: 1rem;color: #2DA44E;">未完成</span>-->
              </div>
            </template>
            <template #stepDetial>
              <div>
                <div class="edit-cause">
                  {{ item.desc }}
                </div>
                <div class="edit-cause" v-if="item.pic">
                  <div v-for="(item2,i) in JSON.parse(item.pic)" :key="i">
                    <el-image
                      class="popover-data-img"
                      v-if="item2.type=='img'"
                      :src="$getUrl.getPicUrl(item2.url)" />
                  </div>
                </div>
                <div class="edit-cause" v-if="item.audio">
                  <audioPlay :src="$getUrl.getPicUrl(JSON.parse(item.audio).url)" />
                </div>
              </div>
            </template>
          </dotStep>
          <el-empty
            v-if="state.processList.length==0"
            :image-size="130"
            description="暂无操作记录~"
            :image="require('@/assets/img/empty/no_data.png')"
          />
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, onMounted, watchEffect, inject } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getCurrentInstance } from '@vue/runtime-core'

const { proxy } = getCurrentInstance()
const props = defineProps({
  modelValue: { //控制抽屉是否显示
    type: Boolean,
    default: false
  }, data: { //row信息
    type: Object,
    default: {}
  }
})
const emit = defineEmits()

const projectId = inject('projectId')//项目id
const state = reactive({
  buildProcess: [] as any,//施工流程
  buildStandard: [] as any,//施工标准
  showDrawer: false,
  processList: [] as any,
  processPersonIdList: [] as any//详情人员idList
})

const closeHandelDrawer = () => {
  emit('update:modelValue', false)
}

//根据商品id查询施工流程
const getProductById = async () => {
  fetch({
    url: '/mall/product/customer/info',
    method: 'get',
    params: {
      clientType: 'APP',
      id: props.data.productId
    }
  }).then((res: any) => {
    state.buildProcess = res.data.productProcess.buildProcess ? JSON.parse(res.data.productProcess.buildProcess) : []
    state.buildStandard = res.data.productProcess.buildStandard
  })
}
//查询工序清单列表
const getProcessList = () => {
  // await fetch({
  //   url: '/order/construction_journal/page',
  //   method: 'get',
  //   params: {
  //     projectId: projectId,
  //     size: 999,
  //     current: 1,
  //     productId: props.data.productId,
  //     orderId: 3278
  //   }
  // }).then((res: any) => {
  //   state.processList = res.data.records
  //   state.processList.map((item: any) => {
  //     state.processPersonIdList.push(item.personId)
  //   })
  //   getUserById()
  // })
  state.processList = props.data.constructionJournals
    state.processList.map((item: any) => {
      state.processPersonIdList.push(item.personId)
    })
  getUserById()
}
const getUserById = () => {
  let ids = [...new Set(state.processPersonIdList)]//去重
  if (ids.length === 0) {
    return
  }
  proxy.$getUserById(ids, (res: any) => {
    res.data.map((j: any) => {
      state.processList.map((item: any) => {
        if (Number(item.personId) === Number(j.personId)) {//验收人信息
          item['personName'] = j.name
          item['personAvatar'] = j.avatar
          item['personSkillName'] = j.skillName
          item['personSkillId'] = j.skillId
        }
      })
    })
  })
}

watchEffect(() => {
  state.showDrawer = props.modelValue
  if (state.showDrawer) {
    getProductById()
    getProcessList()
  }
})

</script>

<style scoped lang="less">
.body-top {
  background: #FFFFFF;
  box-shadow: -5px 0px 10px 0px rgba(0, 0, 0, 0.06);
  padding: 2rem 4rem;

  .body-card {
    border: 1px solid #F3F4F8;
    border-radius: 6px;
    padding: 1.2rem 2rem;
    margin-top: 2rem;

    .process-fint {
      font-size: 12px;
      color: #909399;
    }

    .fint-card-data {
      font-size: 12px;
      color: #303133;
      margin-top: 12px;
    }
  }

  .body-data-img {
    width: 100px;
    height: 100px;
    background: #0969DA;
    border-radius: 6px;
  }

  .body-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .body-desc {
    font-size: 14px;
    color: #909399;
    line-height: 18px;
    margin-top: 1.5rem;
  }

  .body-center-top {
    .body-title {
      font-size: 14px;
      color: #303133;
      line-height: 18px;
      margin-left: 1rem;
    }
  }
}

.popover-data-img {
  width: 60px;
  height: 60px;
  background: #0969DA;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.check-look {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #0969DA;
  margin-top: 2rem;
  cursor: pointer;
}

.check-info {
  padding: 1.2rem !important;
  margin-top: 1rem;
}

.step-time {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #909399;
}

.edit-text {
  color: #1A1A1A;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-top: 1.2rem;
}

.edit-cause {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  display: flex;
  margin-top: 1.5rem;
  align-items: center;
  flex-wrap: wrap;

  .edit-cause-title {
    color: #909399;
  }

  .edit-cause-text {
    margin-left: 1.5rem;
    color: #303133;
    display: flex;
    align-items: center;

    .arrow-img {
      width: 2.6rem;
      height: 2.6rem;
    }

  }

  .edit-cause-info {
    height: 2rem;
    background: #F3F4F8;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #909399;
    line-height: 2rem;
    padding: 0 0.6rem;
    margin-left: 1rem;
  }

  .edit-cause-price {
    color: #67C23A;
    margin-left: 1.5rem;

  }

  .edit-cause-paid {
    background: #FDF6EC;
    border: 1px solid #FAECD8;
    border-radius: 4px;
    margin-left: 1.5rem;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F2AA3D;
    line-height: 2.4rem;
    padding: 0 0.7rem;
  }

  .edit-cause-img {
    width: 60px;
    height: 60px;
    background: #0969DA;
    border-radius: 4px;
    margin-left: 1.5rem;
  }

}

.person-info {
  display: flex;
  align-items: center;

  .person-img {
    width: 2rem;
    height: 2rem;
    //background: #0969DA;
    border-radius: 50%;
  }

  .person-name {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 500;
    color: #303133;
    margin-left: 0.8rem;
  }
}


</style>
