<template>
  <div class="space-main">
    <div class="space" v-for="item in state.spaceData">
      <p class="space-name" >{{ item.label }}</p>
      <div class="space-info" v-for="item2 in item.children">
        <p v-if="item2.label">{{ item2.label }}</p>
        <ul>
          <li v-for="item3 in item2.childrenMaterial">
            <span>{{ item3.attributeName }}</span>
            <span>{{ item3.attributeValue }}{{ item3.attributeUnit }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-empty
      v-if="state.spaceData.length==0"
      :image-size="130"
      description="暂无数据~"
      :image="require('@/assets/img/empty/no_data.png')"
    />
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, onMounted, inject, watchEffect, reactive } from 'vue'
import { fetch } from '_@/axios-config/axios'
import { getScapeGroupData } from '@/components/project/projectUtils'

let projectId = inject('projectId')
const state = reactive({
  spaceData: []
})

const getSpaceData = async () => {
  await fetch({
    url: `/order/bizroomareaattribute/getRoomTypeAndSpaceList`,
    method: 'get',
    params: {
      id: projectId
    }
  }).then((res: any) => {
    state.spaceData = getScapeGroupData(res.data)
    console.log(state.spaceData)
  })
}
onMounted(() => {
  getSpaceData()
})

</script>

<style scoped lang="less">
.space-main {
  margin: 1rem 0;
}

.space {
  .space-name {
    color: #1A1A1A;
    font-size: 1.4rem;
    padding: 1rem 0;
    font-weight: bold;
    font-family: "MicrosoftYaHei-Bold";
  }

  .space-info {
    background: #F5F7FA;
    border-radius: .8rem;
    padding: 2rem 1rem 0;
    margin-bottom: 1rem;
    p {
      padding: 0 0 2rem;
      color: #4C4C4C;
      font-size: 1.6rem;
    }

    ul {
      display: flex;
      flex-flow: row wrap;
      list-style: none;

      li {
        width: 20%;
        padding-bottom: 2rem;

        span {
          color: #909399;
          &:first-child {
            display: block;
            padding-bottom: 1rem;
            
          }
          &:last-child {
            color: #303133;
          }
        }
      }
    }
  }
}
</style>
