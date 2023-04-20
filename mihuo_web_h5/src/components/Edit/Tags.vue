<template>
  <!-- Banner & Tag 通用组件 -->
  <div class="Tag-content">
    <p class="desc">添加标签 (最多{{ len }}个，可拖动排序）</p>
    <vuedraggable
      v-if="list.listdata && list.listdata.length > 0"
      v-model="list.listdata"
      tag="ul"
      draggable="li"
      class="Tag-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in list.listdata" :key="index">
        <div class="l-info">
          <p><span class="sort">排序{{ index + 1 }}</span></p>
          <el-form label-width="9rem">
            <el-form-item label="标签名称">
              <el-input v-model="item.name" type="text" />
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="item.color" show-alpha />
            </el-form-item>
            <el-form-item label="文字颜色">
              <el-color-picker v-model="item.fontColor" show-alpha />
            </el-form-item>
          </el-form>
        </div>
        <div class="r-image">
          <span class="el-icon-close" @click="removeTag(index)" />
        </div>
      </li>
    </vuedraggable>
    <template v-if="list.listdata && list.listdata.length < len">
      <el-button
        type="primary"
        class="add-Tag"
        icon="plus"
        @click="addTag(null)"
      >

        添加标签
      </el-button>
    </template>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, ref, markRaw } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'Tags',
  components: {
    vuedraggable: VueDraggableNext
  },
  props: ['data'],
  setup(props, context) {
    const list = reactive(props.data)
    let url = ref('')
    let index = ref(0)
    let show = ref(false)
    let TagIndex = ref(0)
    const size = computed(() => {
      return list.type === 'Tags' ? '750*750' : '750*400'
    })
    const len = computed(() => {
      return list.type === 'Tags' ? 8 : 10
    })
    const close = () => {
      show = false
      url = ''
    }
    const confirm = () => {
      list['data'][index]['link'] = url
      close()
    }
    const urlPopup = (indexNum) => {
      show = true
      index = indexNum
      // eslint-disable-next-line no-undef
      url = link
    }
    const removeTag = (index) => {
      list.listdata.splice(index, 1)
    }
    const addTag = (index) => {
      TagIndex = index
      list.listdata.push({ name: '', color: '#fff' })
    }
    return {
      list,
      url,
      index,
      show,
      TagIndex,
      close,
      confirm,
      urlPopup,
      removeTag,
      addTag,
      size,
      len
    }
  }

})
</script>

<style lang="less">
.Tag-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  .el-form-item__label{
    text-align: left;
  }
  .desc {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin: 18px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
  }

  .add-Tag {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }

  .Tag-list {
    margin: 0;
    padding: 0 10px;
    overflow: auto;

    &::-webkit-scrollbar-thumb {
      background: #dbdbdb;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: #f6f6f6;
      border-radius: 10px;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    li {
      list-style: none;
      background: #f7f8f9;
      border-radius: 4px;
      padding: 6px 14px 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      &.disable div {
        pointer-events: none;
        user-select: none;
      }

      .l-info {
        font-size: 12px;
        padding-top: 8px;
        width: calc(100% - 70px);

        p {
          margin: 12px 0 0;
          white-space: nowrap;
          overflow: hidden;
          display: flex;

          .link {
            color: #1b8bff;
            cursor: pointer;
          }

          .text {
            white-space: nowrap;
            text-align: -webkit-auto;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .r-Tag {
        text-align: right;

        .el-icon-close {
          color: #999;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          cursor: pointer;

          &:hover {
            color: red;
          }
        }

        .Tag-box {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            opacity: 0;
            transition: all .3s;
          }

          span {
            position: absolute;
            top: 50%;
            left: 50%;
            color: #fff;
            transform: translate(-50%, -50%);
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: all .3s;
          }

          img {
            max-width: 100%;
          }

          &:hover {
            &::before, span {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
