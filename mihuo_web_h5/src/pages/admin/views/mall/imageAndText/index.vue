<template>
  <div>
    <imageAndTextMaterial platform-type="3" company-id="1">
      <template #import>
        <el-button
          class="btn-add"
          size="mini"
          style="margin-right: 10px"
          @click="handleAddProductCate()"
        >
          一键导入平台图文素材
        </el-button>
        <el-dropdown size="mini" @command="getCommand">
          <el-button size="mini">
            素材类型<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in typeList" :key="item.name"
                >111</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </imageAndTextMaterial>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import imageAndTextMaterial from '_c/mall/imageAndTextMaterial/index.vue'
import {
  importCommonMaterial,
  getImageAndTextMaterial,
} from '@/pages/cityoperator/api/mall'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: {
    imageAndTextMaterial,
  },
  setup() {
    const form = reactive({
      addCompanyId: '3',
      addType: '3',
      queryCompanyId: 1,
      queryType: 1,
    })
    const state = reactive({
      typeList: [],
    })

    const handleAddProductCate = () => {
      importCommonMaterial(form).then((res) => {
        if (res) {
          ElMessage.success({
            message: '导入成功',
            type: 'success',
          })
          // materialType.value.getData()
        } else {
          ElMessage.error({
            message: '导入失败',
            type: 'error',
          })
        }
      })
    }
    onMounted(() => {
      console.log('dhdhj')
      // getData()
    })

    const getCommand = (e: any) => {
      console.log('e', e)
    }

    const getData = () => {
      getImageAndTextMaterial({}).then((res) => {
        if (res) {
          state.typeList = res.data
        }
      })
    }

    return {
      form,
      getData,
      getCommand,
      handleAddProductCate,
      ...toRefs(state),
    }
  },
})
</script>
<style lang="less" scoped>
.contain-header {
  border-radius: 4px;
  padding: 10px 20px;
  background: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
