<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import wsCache from '@/cache'

interface Props {
  iconClass: string,
  className: string
}

export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: () => ''
    }
  },
  setup(props: Props) {
    const iconName = (computed((): string => `#icon-${props.iconClass}`))
    const companyId = ref<any>(wsCache.get('companys') ? wsCache.get('companys')[0].companyId : null)
    const svgClass = (computed((): string => {
      if (props.className) {
        return 'svg-icon ' + props.className
      } else {
        return 'svg-icon'
      }
    }))

    return {
      companyId,
      iconName,
      svgClass
    }
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  margin-top: 12px;
}
</style>
