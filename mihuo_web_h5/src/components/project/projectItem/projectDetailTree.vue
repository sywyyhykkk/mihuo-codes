<template>
  <div style="min-width: 60rem">
    <div class="root-node-title"
         :style="treeData.stageStatus==0?'color:#999999':treeData.stageStatus==1?'color:#F2AA3D':''">
      {{ treeData.stageName }}
    </div>
    <img
      src="@/assets/img/finish_node.png"
      class="minus"
      v-if="treeData.stageStatus==2"
    >
    <img
      src="@/assets/img/underway_node.png"
      class="minus"
      v-if="treeData.stageStatus==1"
    >
    <img
      src="@/assets/img/not_start_node.png"
      class="minus"
      v-if="treeData.stageStatus==0"
    >
    <div style="margin-left: 4.8rem">
      <div v-for="(item,index) in nodeList" :class="index!==nodeList.length-1?'root-nodee':'root-nodee2'">
        <div
          :class="index!==nodeList.length-1?'parent-node':'parent-node2'"
          :style="item.nodes.length>1?['height:'+(item.nodes.length-1)*2+'rem']:'height:0px;width:10.3rem'"
        >
          <div class="parent-node-title">{{ item.groupName }}</div>
        </div>

        <div style="float: left;margin-top: 5rem">
          <div v-for="(item2,index2) in item.nodes" :class="index2!==item.nodes.length-1?'children-node':''">
            <div class="children-wire" v-if="item.nodes.length>1"></div>
            <div class="children-node-detial">
              <div v-if="index===0" @click="showAddNode">
                <img src="@/assets/img/add_node.png" class="children-flag" />
                <div class="children-node-title" style="color:#0969DA">{{ item2.nodeName }}</div>
                <div style="clear: both"></div>
              </div>
              <div v-else>
                <img src="@/assets/img/flag3.png"
                     v-if="(item2.status<=1&&item2.businessType!='1002')||(item2.status==0&&item2.businessType=='1002')"
                     class="children-flag" />
                <img src="@/assets/img/flag2.png" v-if="item2.delayDays>0" class="children-flag" />
                <img src="@/assets/img/flag4.png" v-if="item2.status==2" class="children-flag" />
                <img src="@/assets/img/flag1.png" v-if="item2.status==3||(item2.status==1&&item2.businessType=='1002')"
                     class="children-flag" />
                <div class="children-node-title" :style="treeData.stageStatus==2?'':'color:#999999'">
                  {{ item2.nodeName }}
                </div>
                <div class="children-project-name" v-if="item2.executeJobNames.length>0"
                     v-for="item3 in item2.executeJobNames">{{ item3 }}
                </div>
                <div class="children-project-name planDay" v-if="item2.planDay>0">{{ item2.planDay }}天</div>
                <div class="children-project-name delayDays" v-if="item2.delayDays>0">{{ item2.delayDays }}天</div>
                <div class="children-project-name ownerConfirmed" v-if="item2.ownerConfirmed">业主确认</div>
                <div class="qualified" v-if="item2.qualified">合格</div>
              </div>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
        <div style="clear: both"></div>
      </div>
      <div style="clear: both"></div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'

export default defineComponent({

  props: {
    treeData: {
      type: Object,
      default: {}
    }, showAdd: {
      type: Function,
      default: null
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      showNodeType: false,
      nodeList: [
        { groupName: '', nodes: [{ nodeName: '添加节点' }] }
      ]
    })
    const showAddNode = () => {
      emit('showAdd', true, props.treeData.projectStageId, props.treeData.groups)
    }

    watch(props, (value) => {
      state.nodeList = [
        { groupName: '', nodes: [{ nodeName: '添加节点' }] }
      ]
      props.treeData.groups.map((res: any) => {
        state.nodeList.push(res)
      })
    })
    onMounted(() => {
      state.nodeList = [
        { groupName: '', nodes: [{ nodeName: '添加节点' }] }
      ]
      props.treeData.groups.map((res: any) => {
        state.nodeList.push(res)
      })
      // console.log(state.nodeList)
    })
    return {
      showAddNode,
      ...toRefs(state)
    }
  }
})

</script>

<style scoped lang="less">
:hover {
  cursor: pointer;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}

.root-nodee {
  //padding-top: 40px;
  border-left: 2px solid #E6E6E6;
}

.root-nodee2 {
  //padding-top: 40px;
}

.parent-node {
  float: left;
  width: 100px;
  border-bottom: 2px solid #E6E6E6;
  position: relative;
  padding-top: 50px;
}

.parent-node2 {
  float: left;
  width: 100px;
  border-bottom: 2px solid #E6E6E6;
  border-left: 2px solid #E6E6E6;
  position: relative;
  padding-top: 50px;
}

.parent-node-title {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
}

.children-wire {
  height: 2px;
  background: #E6E6E6;
  //border-bottom:solid #E6E6E6 1px;
  width: 25px;
  float: left;
}

.children-node-detial {
  margin-top: -0.8rem;
  float: left;

  .children-project-name {
    float: left;
    background: #F0F9EB;
    border: 2px solid #E1F3D8;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #67C23A;
    margin-left: 8px;
    //margin-top: 12px;
    padding: 3px;
  }

  .qualified {
    float: left;
    margin-left: 8px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    background: #67C23A;
    border-radius: 4px;
    line-height: 22px;
    width: 40px;
    text-align: center;
  }

  .planDay {
    color: #409EFF !important;
    background: #ECF5FF !important;
    border: 1px solid #D9ECFF !important;
  }

  .delayDays {
    color: #F56C6C !important;
    background: #FEF0F0 !important;
    border: 1px solid #FDE2E2 !important;
  }

  .ownerConfirmed {
    color: #B965E0 !important;
    background: #F5EBFA !important;
    border: 1px solid #EAD8F2 !important;
  }

  .children-flag {
    float: left;
    width: 16px;
    height: 16px;
    margin-left: 5px;
    margin-top: 2px;
    //margin-top: 12px;
  }

  .children-node-title {
    //line-height: 40px;
    font-size: 14px;
    margin-top: 3px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    float: left;
    margin-left: 5px;
  }
}

.children-node {
  height: 4rem;
  border-left: 2px solid #E6E6E6;

}

.minus {
  width: 4rem;
  height: 4rem;
  margin-left: 3rem;
}

.flag {
  width: 14px;
  height: 16px;
  float: left;
  margin-top: -7px;
  margin-left: 3px;
}

.add_node {
  width: 16px;
  height: 16px;
  float: left;
  margin-top: 10px;
  margin-left: 3px;
}

.root-node {
  //border-left: solid #E6E6E6 2px;
  //padding-top: 40px;
}

.root-node-title {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #0969DA;
  margin-bottom: 10px;
  width: 10rem;
  text-align: center;
}

</style>
