<template>
  <div>
      <div class="top-btn" v-if="state.list.length!==2 && finishShow">
        <el-button type="primary" class="start" @click="startEnd('start')" v-if="startShow">开始</el-button>
        <el-button type="success" class="end" @click="startEnd('complete')" v-if="finishShow">完成</el-button>
      </div>

      <div class="to-examine" :class="state.allStatus==2?'pass-bg':state.allStatus==1?'refuse-bg':''" v-if="state.examineList&&state.examineList.length">
        <div class="title-view">
          <span class="left">审核情况</span>
          <span class="right" :class="state.allStatus==2?'pass':state.allStatus==1?'refuse':''">
            【{{state.allStatus==2?'审核通过':state.allStatus==1?'审核拒绝':'审核中'}}】
          </span>
        </div>
        <div class="person-con">
          <div class="person">
            <div class="person-item" v-for="item in state.examineList" :key="item.id">
              <div class="avatar">
                <el-image class="avatar-img"
                  :src="item.userId?avatarImage(item.userId):require('@/assets/img/avatar.png')">
                  <template #error>
                    <img class="avatar-img" :src="require('@/assets/img/avatar.png')">
                  </template>
                </el-image>
                <div class="state" :class="item.status==2?'pass':item.status==1?'refuse':''">
                  {{item.status==2?'同意':item.status==1?'拒绝':'审核中'}}
                </div>
              </div>
              <div class="person-name">{{item.skillName || '业主'}}</div>
              <div class="person-name" style="margin-top:5px">{{item.personName}}</div>
            </div>
          </div>
          <div class="see-btn" @click="seeExamine">查看</div>
        </div>
      </div>

      <div class="content">
        <div class="item" v-for="(itm,ind) in state.list" :key="ind">
          <div class="state-time">
            <span class="state" :class="itm.type==='完成'?'complete':''">{{itm.type}}</span>
            <span class="time">{{itm.time&&itm.time.slice(0,16)}}</span>
          </div>
          <div class="person-info" v-if="itm.userId">
            <div class="replace-view">
              <el-image class="person-img"
                :src="itm.userId?avatarImage(itm.userId):require('@/assets/img/avatar.png')">
                <template #error>
                  <div class="image-slot">
                    <img class="person-img" :src="require('@/assets/img/avatar.png')">
                  </div>
                </template>
              </el-image>
              <div class="person-name">{{ itm.personName }}【{{ itm.skillName }}】</div>
            </div>
          </div>

          <div class="describe">{{ itm.remark }}</div>
          <div class="voice" v-if="itm.voiceData">
            <audioPlay :src="$getUrl.getPicUrl(itm.voiceData.url)" />
          </div>
          <div class="images-con" v-if="itm.images&&itm.images.length">
            <div class="images" v-for="(item2,i) in itm.images" :key="i">
              <el-image
                class="img-item"
                v-if="item2.type=='img'&&item2.url"
                :preview-src-list="imgSrcList(itm.images)"
                :initial-index="i"
                fit="cover"
                :src="$getUrl.getPicUrl(item2.url)" />
            </div>
          </div>
         
        </div>
      </div>

      <el-empty
        v-if="state.list.length==0"
        :image-size="218"
        :description="props.data.cardType == 0 ? '该节点尚未开始~' : '暂无数据~'"
        :image="require('@/assets/img/empty/no_data.png')"
      />

      <!-- 开始 结束 -->
      <noTypeOrderStartEnd
        v-model="startEndDialogShow"
        :type="state.operationType"
        :data="props.data"
        @getData="getStartEndData"
      />

      <!-- 审核查看  -->
      <el-drawer
        v-model="drawerShow"
        title="审核情况"
        direction="rtl"
        :append-to-body="true"
        @close="closeHandelDrawer"
        size="50rem"
      >
        <div class="drawer-con">
          <div class="top-state" :class="state.allStatus==2?'pass-bg':state.allStatus==1?'refuse-bg':''"
          :style="{'color':(state.allStatus==0?'#1a1a1a':'')}"
          >
            {{state.allStatus==2?'审核通过':state.allStatus==1?'审核拒绝':'审核中'}}
          </div>
          <div class="examine-item" v-for="(m,ind) in state.examineList" :key="m.id">
            <div class="person-view">
              <div class="dot"></div>
              <el-image class="examine-avatar"
                :src="m.userId?avatarImage(m.userId):require('@/assets/img/avatar.png')">
                <template #error>
                  <img class="examine-avatar" :src="require('@/assets/img/avatar.png')">
                </template>
              </el-image>
              <div class="name font">{{ m.personName || '业主' }}（{{ m.skillName || '业主' }}）</div>
              <div class="time font">{{m.reviewTime&&m.reviewTime.slice(0,16)}}</div>
              <div class="sub-state font" :class="m.status==2?'pass':m.status==1?'refuse':''">
                 {{m.status==2?'同意':m.status==1?'拒绝':'审核中'}}
              </div>
            </div>

            <div class="examine-info" :style="{'border':(ind==state.examineList.length-1?'none':'')}">
              <div class="reason" v-if="m.remark">{{m.remark}}</div>
              <div class="examine-images-con" v-if="m.imgList&&m.imgList.length">
                <div class="images" v-for="(item3,i) in m.imgList" :key="i">
                  <el-image
                    class="examine-img-item"
                    v-if="item3.type=='img'"
                    :preview-src-list="imgSrcList(m.imgList)"
                    :initial-index="i"
                    fit="cover"
                    :src="$getUrl.getPicUrl(item3.url)" />
                </div>
              </div>
              <div class="examine-voice" v-if="m.audio">
                <audioPlay :src="$getUrl.getPicUrl(m.audio.url)" />
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { avatarImage,thumbnailImage } from '@/utils/utils'
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getCurrentInstance } from '@vue/runtime-core'
import { async } from '@antv/x6/lib/registry/marker/main'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }, projectId: {
    type: String || Number,
    default: 0
  }
})
const emit = defineEmits(['getByData'])

const startEndDialogShow = ref<boolean>(false)//开始 完成
const drawerShow = ref<boolean>(false)
const startShow = ref<boolean>(true)//操作按钮 开始
const finishShow = ref<boolean>(true)//操作按钮 完成

const state = reactive({
  allStatus: 0,//审查状态 0-待审查 1-审核不通过 2-审查通过
  examineList: [],//审核内容
  list: [] as any,//开始 完成细心你
  operationType: ''//开始 完成操作类型
})

const closeHandelDrawer = () => {
  drawerShow.value = false
}

const seeExamine = () => {
  drawerShow.value = true
}

const imgSrcList = (imgs:any) => {
  let arr = [] as any
  imgs.forEach((item:any) => {
    arr.push(thumbnailImage(item.url,false))
  });
  return arr
}

const startEnd = (type:string) => {
  startEndDialogShow.value = true
  state.operationType = type
}

//开始完成的数据
const getStartEndData = async () => {
  await fetch({
    url: `/order/project/node?nodeId=${props.data.nodeId}`,
    method: 'get'
  }).then((res:any) => {
    if(res){
      let obj = res.data
			state.list = []
			if (obj.startRemark) {
        startShow.value = false
				let tempStartAttachments = obj.startAttachments && JSON.parse(obj.startAttachments)
				let tempImages = tempStartAttachments.filter((item:any) => item.type == 'img')
				let tempVoice = tempStartAttachments.find((item:any) => item.type == 'audio')
				state.list.push({
          personName: obj.startPersonName,
          userId: obj.startUserId,
          skillName: obj.startSkillName,
					remark: obj.startRemark,
					images: tempImages,
					voiceData: tempVoice || '',
					time: obj.realStartTime,
					type: '开始'
				})
			}
			if (obj.finishRemark) {
        finishShow.value = false
				let tempStartAttachments = obj.finishAttachments && JSON.parse(obj.finishAttachments)
				let tempImages = tempStartAttachments.filter((item:any) => item.type == 'img')
				let tempVoice = tempStartAttachments.find((item:any) => item.type == 'audio')
				state.list.push({
          personName: obj.executePersonName,
          userId: obj.executeUserId,
          skillName: obj.executeSkillName,
					remark: obj.finishRemark,
					images: tempImages,
					voiceData: tempVoice,
					time: obj.realEndTime,
					type: '完成'
				})
			}
    }
  })
}

const getNodeExamineList = async () => {
  await fetch({
    url: `/order/project/projectNode/review/get/${props.data.nodeId}`,
    method: 'get'
  }).then((res:any) => {
    if(res){
      let arr = [] as any,
          notArr = [] as any,
          passArr = [] as  any,
          refuseArr = [] as any;
      res&&res.data.map((item:any) => {
        arr.push(item.status)
        if(item.attachments){
          item['imgList'] = JSON.parse(item.attachments).filter((m:any) => m.type=='img')
          item['audio'] = JSON.parse(item.attachments).find((m:any) => m.type=='audio')
        }
      })
      notArr = arr.filter((i:any)=>i===0)
      passArr = arr.filter((i:any)=>i===2)
      refuseArr = arr.filter((i:any)=>i===1)
      if(notArr.length===arr.length){
        state.allStatus = 0
      }
      if(passArr.length===arr.length){
        state.allStatus = 2
      }else if(passArr.length<arr.length && passArr.length>notArr.length){
        state.allStatus = 1
      }
      if(refuseArr.length){
        state.allStatus = 1
      }
      state.examineList = res.data
    }
  })
}

watchEffect(() => {
  if (props.data.nodeId) {
    getStartEndData()
    getNodeExamineList()
  }
})

</script>

<style scoped lang="less">
.top-btn{
    padding: 20px 53px 0;
    text-align: right;
    span{
        display: inline-block;
        width: 67px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        color: #FFFFFF;
        cursor: pointer;
    }
    .start{
        background: #0969DA;
    }
    .end{
        background: #2DA44E;
    }
}

.to-examine{
  margin: 20px 40px;
  background: #F5F7FA;
  border-radius: 6px;
  .title-view{
    padding: 16px 0 0 20px;
    .left{
      font-size: 12px;
      color: #1A1A1A;
    }
    .right{
      font-size: 10px;
      color: #999999;
    }
    .pass{
      color: #67C23A;
    }
    .refuse{
      color: #F56C6C;
    }
  }
  .person-con{
    display: flex;
    justify-content: space-between;
    .see-btn{
      flex: 0.5;
      font-size: 12px;
      color: #0969DA;
      cursor: pointer;
    }
  }
  .person{
    flex: 9;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .person-item{
      width: 10%;
      height: 90px;
      padding: 16px 20px 16px 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      .avatar{
        margin-bottom: 10px;
        position: relative;
        .avatar-img{
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .state{
          padding: 2px 5px;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 10px;
          text-align: center;
          font-weight: 400;
          color: #999999;
          position: absolute;
          top: 0;
          right: -45px;
        }
        .pass{
          color: #67C23A;
        }
        .refuse{
          color: #F56C6C;
        }
        .person-name{
          font-size: 12px;
          color: #1A1A1A;
        }
      }
    }
  }
}
.pass-bg{
  background: #F0F9EB;
}
.refuse-bg{
  background: #FEF0F0;
}
.content{
  .item{
    margin: 20px 40px 0;
    padding: 16px 20px;
    background: #F5F7FA;
    border-radius: 6px;
    &:last-child{
      margin-bottom: 0;
    }
  }
}
.state-time{
  .state{
    display: inline-block;
    width: 36px;
    height: 20px;
    margin-right: 10px;
    padding: 4px 6px;
    background: #0969DA;
    border-radius: 4px;
    color: #FFFFFF;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
  }
  .complete{
    background: #2DA44E;
  }
  .time{
    font-size: 14px;
    color: #303133;
    line-height: 18px;
  }
}
.person-info {
  display: inline-block;
  margin-top: 11px;
  padding: 5px 11px 5px 5px;
  background: #ECF5FF;
  border-radius: 10px;
  .replace-view{
    display: flex;
    align-items: center;
  }
  .person-img {
    width: 2.5rem;
    height: 2.5rem;
    //background: #0969DA;
    border-radius: 50%;
  }

  .person-name {
    height: 12px;
    font-size: 12px;
    color: #4D4D4D;
    margin-left: 5px;
  }
}
.describe{
  font-size: 14px;
  margin-top: 14px;
  color: #909399;
}
.voice{
  width: 30px;
  margin-top: 18px;
}
.images-con{
  margin-top: 18px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .images{
    .img-item {
      width: 100px;
      height: 100px;
      border-radius: 4px;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }
  }
}
.drawer-con{
  margin-left: 40px;
  .top-state{
    width: 60px;
    height: 20px;
    padding: 4px 6px;
    background: #F5F7FA;
    border-radius: 4px;
    font-size: 12px;
    color: #FFFFFF;
    text-align: center;
    line-height: 20px;
    margin: 20px 0;
  }
  .pass-bg{
    background: #67C23A;
  }
  .refuse-bg{
    background: #F56C6C;
  }
  .examine-item{
    .person-view{
      display: flex;
      align-items: center;
      .dot{
        width: 7px;
        height: 7px;
        margin-right: 10px;
        background: #0969DA;
        border-radius: 50%;
      }
      .examine-avatar{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .font{
        font-size: 12px;
      }
      .name{
        color: #303133;
      }
      .time{
        color: #909399;
        margin-right: 10px;
      }
      .sub-state{
        color: #999999;
      }
      .pass{
        color: #67C23A;
      }
      .refuse{
        color: #F56C6C;
      }
    }
    .examine-info{
      padding: 0 0 40px 17px;
      margin-left: 3px;
      border-left: 1px solid #E4E7ED;
      .reason{
        font-size: 14px;
        color: #303133;
        margin-top: 14px;
      }
      .examine-images-con{
        margin-top: 18px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .images{
          .examine-img-item {
            width: 100px;
            height: 100px;
            border-radius: 4px;
            margin-right: 1rem;
            margin-bottom: 1rem;
          }
        }
      }
      .examine-voice{
        width: 30px;
        margin-top: 4px;
      }
    }
  }
}

</style>
