<template>
  <div>
    <div
      class="iconContent"
      :style="[fontStyle]"
    >
      <div
        v-if="isCenter" class="divider"
        style="margin-right: 10px"
      />
      <el-image
        v-if="[fontStyle][0].iconUrl !== 'no_title'&&[fontStyle][0].iconUrl !== 'under_line'"
        :src="[fontStyle][0].iconUrl"
        class="icon"
      />
      <div class="input-cotent">
        <div
          contenteditable
          class="wordInput"
          :style="[fontStyle]"
          @input="getText"
          @click="clearText"
        >{{ list.data.content || tempTitle }}
        </div>
        <div class="edit-sorted-bottom" v-if="[fontStyle][0].iconUrl=='under_line'"></div>
      </div>
      <div v-if="isCenter" class="divider" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import iconTitle from '@/assets/img/icon_title.png'
import iconTitle2 from '@/assets/img/icon_title2.png'
import iconTitle3 from '@/assets/img/icon_title3.png'
import { imageGlobal } from '@/global'

export default defineComponent({
  name: 'IconTitle',
  props: ['data'],
  setup(props) {
    const list = reactive(props.data)
    const tempTitle = ref('请输入标题')
    const isCenter = computed(() => {
      return fontStyle.value.justifyContent === 'center'
    })

    onMounted(() => {
      if (list.content) {
        tempTitle.value = list.content
      }
    })

    const getText = (value) => {
      console.log(value.target.innerText)
      // list.content = value.target.innerText
      props.data.content = value.target.innerText
      console.log(props.data.content)
    }

    const clearText = () => {
      tempTitle.value = ''
    }

    const fontStyle = computed(() => {
      const sizeStyle = {}
      let iconUrl = ref(iconTitle)
      if (list.style['iconUrl']) {
        if (list.style['iconUrl'] === 'under_line') {
          iconUrl = 'under_line'
        } else if (list.style['iconUrl'] === 'icon_title1') {
          iconUrl = iconTitle
        } else if (list.style['iconUrl'] === 'icon_title2') {
          iconUrl = iconTitle2
        } else if (list.style['iconUrl'] === 'icon_title3') {
          iconUrl = iconTitle3
        } else if (list.style['iconUrl'] === 'no_title') {
          iconUrl = 'no_title'
        } else {
          // 自定义上传的图标
          iconUrl = imageGlobal + list.style['iconUrl']
        }
      } else {
        iconUrl = iconTitle
      }
      for (const key in list.style.size) {
        if (key === 'textAlign') {
          // 处理内容对齐
          let justifyContent
          let textAlign
          if (list.style.size[key] === 'left') {
            justifyContent = 'flex-start'
            textAlign = 'left'
          } else if (list.style.size[key] === 'center') {
            justifyContent = 'center'
            textAlign = 'center'
          } else if (list.style.size[key] === 'right') {
            justifyContent = 'flex-end'
            textAlign = 'right'
          }
          sizeStyle['justifyContent'] = justifyContent
          sizeStyle['textAlign'] = textAlign
        } else {
          if (key === 'fontWeight') {
            // 处理文字加粗
            sizeStyle[key] = list.style.size[key]
          } else {
            // 处理文字大小
            sizeStyle[key] = list.style.size[key] + 'px'
          }
        }
      }
      return { ...sizeStyle, ...list.style.color, iconUrl }
    })

    return {
      list,
      tempTitle,
      fontStyle,
      isCenter,
      clearText,
      getText
    }
  }
})
</script>

<style scoped lang="less">

.iconContent {
  display: flex;
  align-items: center;
  min-height: 20px;

  .divider {
    width: 40px;
    height: 1px;
    background-color: #CCCCCC;
  }

  .icon {
    width: 21px;
    height: 16px;
    object-fit: cover;
  }

  .input-cotent {
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
  }

  .edit-sorted-bottom {
    position: relative;
    height: 5px;
    width: 100%;
    background: linear-gradient(90deg, #FFFFFF, #FE6E32, #FFDED1);
    border-radius: 5px;
  }

  .wordInput {
    width: 100%;
    padding: 10px 10px 10px 0;
    outline: none;
    white-space: normal;
    height: auto;
    //font-style: normal;
    color: #606166;
    margin-left: 6.5px;
    line-height: 18px;
  }
}
</style>
