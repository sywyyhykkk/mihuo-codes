<template>
  <div class="container">
    <div id="layoutContent" style="width: 1000px; height: 900px"></div>
    <div id="minimap"></div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { ProgressConfig } from '@/utils/entries'
import ProgressFlow from '@/utils/ProgressFlow'
import { fetch } from '_@/axios-config/axios'
onMounted(() => {
  console.log('v123')
  const dom: HTMLElement = document.getElementById(
    'layoutContent'
  ) as HTMLElement
  const config: ProgressConfig = {
    width: 300,
    height: 200,
    minimap: document.getElementById('minimap') as HTMLElement,
    offsetTop: 400,
    horizontalOffset: 50,
    verticalOffset: 200,
    tunnelBackground: '#fff'
  } as ProgressConfig
  const layout = new ProgressFlow(dom, config)
  fetch({
    url: `/order/soptemplate/default`,
    method: 'get'
  }).then((res) => {
    console.log(res)
    const prelist = res.data.stages || []
    const renderList = []
    //名字和节点的对应
    const nameMap = {}
    for (let stage of prelist) {
      for (let pre of stage.nodes) {
        nameMap[pre.name] = pre
        renderList.push({
          id: pre.id,
          name: pre.name,
          preNodes: pre.preNodeNames
            ? pre.preNodeNames.map((name: String) => {
                return {
                  ...nameMap[name + ''],
                  nodeId: nameMap[name + ''].id,
                  connectLabel: nameMap[name + ''].name
                }
              })
            : [],
          stage: stage.name,
          connectLabel: 'ceshi',
          ...pre
        })
      }
    }
    console.log(renderList)
    layout.render(renderList)
  })
})
</script>
<style scoped lang="less">
#layoutContent {
  width: 100% !important;
  height: 70rem !important;
}
.business-type-contain {
  padding-top: 0.3rem;
  width: 100%;
  margin-bottom: -2rem;

  .el-radio {
    margin-right: 4rem;
    /*margin-bottom: 10px;*/
  }
}

.el-radio-item {
  margin-bottom: 0.5rem;
}

.node-name {
  font-size: 12px;
  color: #f2aa3d;
  cursor: pointer;
}

#layoutContent :deep(body) {
  box-sizing: border-box;
  margin: 0;
  min-width: 0 !important;
}

header {
  display: flex;
  width: 100%;
  height: 50px;
}

header i {
  margin: 8px;
  font-size: 30px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.my-selecting {
  border: 1px solid red;
  display: block;
  z-index: 0;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.x6-node foreignObject > body) {
  min-width: none !important;
}

:deep(.x6-cell-tool-button) {
  visibility: hidden;
}

.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}

.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

.section-cot {
  display: flex;
}

.section-cot #container {
  position: relative;
  flex: 1;
}

.section-cot #container #draw-cot {
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0;
}
</style>
