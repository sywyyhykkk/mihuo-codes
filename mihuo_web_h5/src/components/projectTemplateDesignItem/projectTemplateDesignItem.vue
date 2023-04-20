<template>
  <div>
    测试
  </div>
</template>

<script>
export default {
  name: "projectTemplateDesignItem",
  inject: ["getGraph", "getNode"],
  data() {
    return {
      num: 0,
    };
  },
  mounted() {
    const self = this;
    const node = this.getNode();
    // 监听数据改变事件
    node.on("change:data", ({ current }) => {
      self.num = current.num;
    });
  },
  methods: {
    add() {
      const node = this.getNode();
      console.log(this);
      const { num } = node.getData();
      
      node.setData({
        num: num + 1,
      });
    },
  },
};
</script>