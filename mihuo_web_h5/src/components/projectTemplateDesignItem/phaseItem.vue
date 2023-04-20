<template>
  <div class="phasecontent">
    <header>
      <div class="phasetitle">
        <span style="flex: 1">{{ nodeData.name }}</span>
        <img class="add icon" src="@/assets/img/add_icon.png" />
        <img class="edit icon" src="@/assets/img/edit_icon.png" />
        <img class="delete icon" src="@/assets/img/delete_icon.png" />
      </div>
    </header>
    <div class="phasebody"></div>
  </div>
</template>

<script>
import Image from '../Edit/MaterialImage.vue'
import projectItem from '@/components/projectTemplateDesignItem/projectItem.vue'
export default {
  components: { Image },
  props: {
    name: {
      type: Number,
      default: 0,
    },
  },
  name: 'phaseItem',
  inject: ['getGraph', 'getNode'],
  data() {
    return {
      nodeData: {},
    }
  },
  mounted() {
    const self = this
    const node = this.getNode()
    this.nodeData = node.data
    // 监听数据改变事件
    node.on('change:data', ({ current }) => {
      self.nodeData = current
    })
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.phasecontent {
  width: 100%;
  height: 100%;
  border: 1px solid #c2c8d5;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
.phasetitle {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 600;
  color: #ffff;
  text-align: center;
  border-bottom: 1px solid #c2c8d5;
  background-color: @mainColor;
}
.icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin: 0 10px;
}
</style>
