<template>
  <div class="select-person">
    <div class="other-person" v-for="(item,index) in state.checkList" v-if="props.multiple">
      <img class="add-person" :src="$getUrl.getPicUrl(item.avatar, true)" />
      <div class="other-person-text" style="margin:-0.3rem">{{ item.employeeName }}</div>
      <el-icon color="#F56C6C" class="close-person" @click="closePerson(index)"><circle-close-filled /></el-icon>
    </div>

    <el-dropdown trigger="click" @visible-change="visibleChange">
      <slot name="header"></slot>
      <template #dropdown>
        <div class="dropdown-item">
          <div class="department-tree">
            <el-tree
              ref="tree"
              :data="state.treeData"
              :props="state.defaultProps"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <div class="el-card-custom">
                    <img
                      src="@/assets/img/24gf-folder.png"
                      style="width: 1.8rem; height: 1.6rem; margin-right: 5px"
                    />
                    <span :style="data.id === nodeId ? 'color: #0969DA;' : ''">{{
                        node.label
                      }}</span>
                  </div>
                  <el-dropdown>
                    <el-icon
                      size="10"
                      color="#0969DA"
                      class="tree-node-icon"
                      v-if="data.id === nodeId"
                    >
                      <more-filled />
                    </el-icon>
                  </el-dropdown>
                </div>
              </template>
            </el-tree>
          </div>
          <div class="checkbox-group">
            <div v-for="(item,index) in state.tableData" v-if="state.tableData" :key="index" class="person-item"
                 :style="item.checked?'background: #ECF5FF;':''">
              <div class="person-info">
                <img class="person-img"
                     :src="item.avatar?$getUrl.getPicUrl(item.avatar, true):require('@/assets/img/avatar.png')">
                <div class="person-name">{{ item.employeeName }}</div>
              </div>
              <el-radio @change="checkChange(item)" v-model="item.checked" :label="true">{{ null }}
              </el-radio>
            </div>
          </div>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { treePage, userPage } from '_@/api/department'
import { onMounted, reactive, ref, defineProps, watchEffect } from 'vue'

const props = defineProps({
  multiple: {//是否多选
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object || String || Number,
    default: {}
  }
})
const emit = defineEmits(['visible'])

const state = reactive({
  defaultProps: {
    checkStrictly: true,
    children: 'children',
    label: 'name',
    value: 'id'
  },
  treeData: [] as any,
  tableData: [] as any,
  checkList: [] as any,
  checkData: {} as any //单选值
})
const closePerson=(index:number)=>{
  state.checkList.splice(index,1)
}

const getTreePage = () => {
  treePage().then((res) => {
    if (res) {
      state.treeData = res.data
    }
  })
}
const handleNodeClick = async (v: any) => {
  getData(v.id)
}
const checkChange = (row: any) => {
    state.checkData = row
    state.tableData.map((res: any) => {
      if (row.userId !== res.userId) {
        res.checked = false
      }
    })
    emit('update:modelValue', state.checkData)
  }
const getData = async (e: any) => {
  state.tableData = []
  userPage({
    size: 999,
    current: 1,
    deptId: e
  }).then((res) => {
    if (res) {
      !props.multiple ? res.data.records.map((res3: any) => {
        if (res3.employeePhone == state.checkData.employeePhone) {
          res3.checked = true
          return
        }
      }) : ''
      state.tableData = res.data.records
    }
  })
}

function visibleChange(visible: any) {
  emit('visible', visible)
}

onMounted(() => {
  getTreePage()
})
watchEffect(() => {
  if (props.modelValue) {
    state.checkData = props.modelValue
    state.checkList = props.modelValue
  }
})

</script>

<style scoped lang="less">
.select-person {
  display: flex;
  width: 38rem;
  flex-flow: wrap;
}

.checkbox-group {
  display: flex;
  flex-flow: column;
  height: 28rem;
  overflow-y: auto;


}


.person-item {
  width: 18rem;
  margin-top: 0.1rem;
  padding: 1rem 2rem 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .person-info {
    display: flex;
    align-items: center;

    .person-img {
      width: 4rem;
      height: 4rem;
      border-radius: 4rem;
    }

    .person-name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #606266;
      margin-left: 1.3rem;
    }
  }
}


.dropdown-item {
  display: flex;

  .department-tree {
    padding-top: 2rem;
    width: 22rem;
    height: 26.2rem;
    border-right: 1px solid #E4E7ED;
    padding-left: 2rem;

    .el-card-custom {
      margin-top: 2rem;
    }
  }
}


.other-person {
  display: flex;
  flex-flow: column;
  justify-items: center;
  align-items: center;
  width: auto;
  margin: 2rem 2rem 0 0;
  .close-person{
    position: absolute;
    margin-left: 2.8rem;
    width: 1.6rem;
    height: 1.6rem;
  }

  .add-person {
    height: 4rem;
    width: 4rem;
    border: 1px solid #E4E7ED;
    border-radius: 50%;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;

    &:active {
      border: 1px solid #0969DA;

      .add-person__icon {
        color: #0969DA;
      }
    }

    &:hover {
      border: 1px solid #0969DA;

      .add-person__icon {
        color: #0969DA;
      }
    }

    .add-person__icon {
      width: 1.6rem;
      height: 1.6rem;
      color: #C0C4CC;
    }
  }

  .other-person-text {
    font-size: 1.2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #606266;
    margin-top: 0.5rem;
  }
}


</style>
