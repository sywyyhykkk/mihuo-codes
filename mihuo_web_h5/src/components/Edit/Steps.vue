<template>
  <!-- Banner & Step 通用组件 -->
  <div class="Step-content">
    <p class="desc">添加步骤 (最多{{ len }}个，可拖动排序）</p>
    <vuedraggable
      v-model="list.listdata"
      tag="ul"
      draggable="li"
      v-if="list.listdata && list.listdata.length > 0"
      class="Step-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in list.listdata" :key="index">
        <div class="l-info">
          <p><span class="sort">排序{{ index + 1 }}</span></p>
          <el-form label-width="9rem">
            <el-form-item label="步骤名称">
              <el-input type="text" v-model="item.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="r-image">
          <span @click="removeStep(index)" class="el-icon-close"></span>
        </div>
      </li>
    </vuedraggable>
    <template v-if="list.listdata && list.listdata.length < len">
      <el-button
        type="primary"
        @click="addStep(null)"
        class="add-Step"
        icon="plus"
      >

        添加步骤
      </el-button>
    </template>
  </div>
</template>

<script>
import {defineComponent, reactive, computed, ref, markRaw} from "vue";
import {VueDraggableNext} from 'vue-draggable-next';

export default defineComponent({
  name: 'Steps',
  props: ["data"],
  components: {
    vuedraggable: VueDraggableNext
  },
  setup(props, context) {
    console.log(props);
    let list = reactive(props.data);
    let url = ref("");
    let index = ref(0);
    let show = ref(false);
    let StepIndex = ref(0);
    let uploadBox = ref(null);

    const size = computed(() => {
      return list.type === 'Steps' ? '750*750' : '750*400';
    });
    const len = computed(() => {
      return list.type === 'Steps' ? 8 : 10;
    });
    const close = () => {
      show = false;
      url = '';
    };
    const confirm = () => {
      list['data'][index]['link'] = url;
      close();
    };
    const urlPopup = (indexNum) => {
      show = true;
      index = indexNum;
      // eslint-disable-next-line no-undef
      url = link;
    };
    const removeStep = (index) => {
      list.listdata.splice(index, 1);
    };
    const addStep = (index) => {
      StepIndex = index;
      list.listdata.push({name: ""});
    };
    const upload = (params) => {
      const currenlen = list.listdata ? 0 : list.listdata.length;
      if (currenlen >= len) {
        this.$message.error(`最多添加${this.len}张图片!`);
        return;
      }
      const file = params.file,
        fileType = file.type;
      const verifyList = [
        {
          text: "只能上传图片格式png、jpg、gif!",
          result: fileType.indexOf('Step') != -1
        },
        {
          text: "只能上传大小小于5M",
          result: file.size / 1024 / 1024 < 5
        }
      ];

      for (let item of verifyList) {
        if (!item.result) {
          this.$message.error(item.text);
          return;
        }
      }

      const form = new FormData();
      form.append("file", file);
      form.append("clientType", "multipart/form-data");

      const index = StepIndex;
      const data = {
        name: file.name,
        url: URL.createObjectURL(file),
        form
      };

      if (index !== null) {
        list.listdata[index] = data;
      } else {
        list.listdata.push(data);
      }
    };
    return {
      list,
      url,
      index,
      show,
      StepIndex,
      close,
      confirm,
      urlPopup,
      removeStep,
      addStep,
      uploadBox,
      size,
      len,
      upload
    };
  }

});
</script>

<style lang="less" scoped>
.Step-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
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

  .add-Step {
    width: calc(100% - 20px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }

  .Step-list {
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

      .r-Step {
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

        .Step-box {
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
