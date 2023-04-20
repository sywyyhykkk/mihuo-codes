<template>
  <div class="group-component">
    <div class="component-left-data">
      <slot name="left" />
    </div>
    <div class="component-right-data">
      <slot name="right" />
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="less">
.group-component {
  display: flex;
  align-items: center;

  .component-left-data {
    margin-right: -2.1rem;
    :deep(.el-select) {
      width: 12rem !important;
    }

    :deep(.el-input__inner) {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }

  .component-right-data {
    :deep(.el-input__inner) {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
}
</style>
