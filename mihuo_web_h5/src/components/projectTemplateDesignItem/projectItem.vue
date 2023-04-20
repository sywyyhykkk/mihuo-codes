<template>
  <div class="node">
    <div class="content">
      <p class="itemname title">{{ nodeData.name }}</p>
      <p class="itemname">
        执行岗位：<span class="post">{{
          nodeData.executeJobNames
            ? nodeData.executeJobNames.join(',')
            : '暂无执行岗位'
        }}</span>
      </p>
      <p class="itemname">
        计划天数：<span>{{ nodeData.planDay }}（天）</span>
      </p>
      <p class="itemname">
        节点分组：<span>{{ nodeData.groupName }}</span>
      </p>
      <!-- <p class="actioncontent">
        <img class="setting" src="@/assets/img/gray_setting.png" />
        <img class="edit" src="@/assets/img/edit-409EF.png" />
        <img class="delete" src="@/assets/img/red_delete.png" />
      </p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'projectItem',
  inject: ['getGraph', 'getNode'],
  data() {
    return {
      nodeData: {}
    }
  },
  mounted() {
    const self = this
    const node = this.getNode()
    this.nodeData = node.data.originalData
    // 监听数据改变事件
    node.on('change:data', ({ current }) => {
      self.nodeData = current.originalData
    })
  }
}
</script>
<style xml:lang="less" scoped>
.node {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
.content {
  margin: 15px 10px 0 10px;
}
.itemname {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.itemname.title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-top: 10px;
}
.actioncontent {
  display: flex;
  justify-content: flex-end;
}
.actioncontent img {
  width: 18px;
  height: 18px;
  margin: 0 5px;
  cursor: pointer;
}
.post {
  color: #67c23a;
  width: 100%;
}
.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}
.x6-node-selected .node.success {
  border-color: #67c23a;
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
</style>
