<template>
  <div>
    <div class="el-card-form">
      <div class="el-card-formLeft">
        <el-button style="margin-bottom: 2rem" type="primary" @click="syncCategory">同步平台分类</el-button>
        <el-tree
          ref="tree"
          :data="categoryOptions"
          :props="defaultProps"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          default-expand-all
          draggable
          @node-drop="handleDropDone"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="el-card-custom">
                <el-icon
                  v-if="data.hasContent == 1"
                  color="#0969DA"
                  style="width: 1.8rem; height: 1.6rem; margin-right: 5px"
                >
                  <CircleCheckFilled />
                </el-icon>
                <span :style="data.categoryId === state.dataForm.categoryId ? 'color: #0969DA;' : ''">
                  {{ node.label }}
                </span>
              </div>
              <el-dropdown>
                <el-icon
                  size="10"
                  color="#0969DA"
                  class="tree-node-icon"
                >
                  <more-filled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="data.level == 1" @click.stop="handelClick('新增自定义分类',data)">
                      新增分类
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="data.level == 2"
                      @click.stop="handelClick('删除分类',data)"
                    >删除分类
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="el-card-formRight">
        <div class="option-data">
          <el-form
            ref="ruleForms"
            :model="state.dataForm"
            :rules="dataRule"
            label-width="12rem"
            :scroll-to-error="true"
          >
            <el-form-item label="内容页名称" prop="name">
              <el-input
                v-model="state.dataForm.name"
                :disabled="state.dataForm.customFlag!='1'"
                type="text"
                placeholder="内容页名称"
              />
            </el-form-item>
            <el-form-item label="关联分类" prop="categoryId">
              <el-cascader
                v-model="state.dataForm.categoryId"
                disabled
                :options="categoryOptions"
                :props="defaultProps"
              />
            </el-form-item>
            <el-form-item label="分类内容页" prop="content">
              <div>
                <el-button
                  type="primary"
                  style="margin-bottom: 1rem;"
                  @click="isShowCMS = !isShowCMS"
                >从内容库导入
                </el-button>
                <AppTextEdit
                  v-if="textEditShow"
                  v-model="state.dataForm.content"
                  :buttons="['icontitle','word','images','productItem','caseItem', 'imageGrid', 'link','gridImageText']"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="button-footer">
          <el-button type="primary" style="margin-right: 1rem" @click="handelClick('保存')">
            保存
          </el-button>
          <el-button @click="handelClick('取消')">
            取消
          </el-button>
        </div>
      </div>
    </div>
    <chooseCms
      v-model="isShowCMS"
      :city-operator-id="cityOperatorId"
      @getGeneralMaterial="getGeneralMaterial"
    />
  </div>
</template>

<script setup lang="ts">
import { getDataList, addObj, putObj, delObj } from '_c/util/api/categoryContent'
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import wsCache from '@/cache'
import { ref, reactive, onMounted } from 'vue'

const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
const isShowContent = ref(true)
const isShowCMS = ref(false)
const loading = ref(false)
const isEdit = ref(false)
const formVisible = ref(false)
const ruleForms = ref<any>(null)
const categoryOptions = ref<any>([])
const groupOptions = ref<any>([])
const textEditShow = ref<any>(true)
const customShow = ref<any>(false)// 是否自定义
const queryTreeCode = ref('')
const defaultProps = markRaw({
  children: 'subCagetories',
  label: 'name',
  value: 'categoryId',
  checkStrictly: true
})
const groupProps = markRaw({
  children: 'children',
  label: 'name',
  value: 'categoryId',
  checkStrictly: true
})
const state = reactive<any>({
  dataForm: {
    categoryId: '',
    name: '',
    content: '[]',
    customFlag: '0',
    id: ''
  }
})

const checkBannerUrl = (rule: any, value: any, callback: any) => {
  if (value == '[]') {
    callback(new Error('请编辑内容页'))
  } else {
    callback()
  }
}

const dataRule = markRaw({
  name: [
    { required: true, message: '内容页名称不能为空', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择内容页关联分类', trigger: 'blur' }
  ],
  content: [
    { required: true, trigger: 'blur', validator: checkBannerUrl }
  ]
})

onMounted(() => {
  getPlatformCategory()
  getGroups()
})

const getGeneralMaterial = (val: any) => {
  textEditShow.value = false
  state.dataForm.content = val.value[0].content
  setTimeout(() => {
    textEditShow.value = true
  }, 400)
}

const handelClick = (val: string, data: any) => {
  switch (val) {
    case '保存':
      confirmSave()
      break
    case '取消':
      state.dataForm = {
        categoryId: '',
        name: '',
        content: '[]',
        customFlag: '0',
        id: '',
        parentCategoryId: ''
      }
      break
    case '新增自定义分类':
      customShow.value = true
      textEditShow.value = false
      state.dataForm = {
        parentCategoryId: data.categoryId,
        categoryId: data.categoryId,
        name: '',
        content: '[]',
        customFlag: '1',
        id: ''
      }
      setTimeout(() => {
        textEditShow.value = true
      }, 200)
      break
    case '删除分类':
      ElMessageBox.confirm(`此操作将永久删除${data.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        textEditShow.value = false
        deleteTreeData(data.id)
      })
      break
  }
}

const handleNodeClick = (val: any) => {
  if (val.level == 2) {
    customShow.value = false
    state.dataForm.categoryId = val.categoryId
    state.dataForm.name = val.name
    isEdit.value = val.hasContent == 1
    textEditShow.value = false
    getFormById()
  }
}

const deleteTreeData = async (id: any) => {
  await fetch({
    url: `/mall/pmscategorycontent/removeById/${id}`,
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      ElMessage.success('删除成功')
      getPlatformCategory()
      state.dataForm = {
        categoryId: state.dataForm.categoryId,
        name: '',
        content: '[]',
        customFlag: '1',
        id: ''
      }
      setTimeout(() => {
        textEditShow.value = true
      }, 200)
    }
  })
}

// 根据分类id获取详情
const getFormById = async () => {
  if (!state.dataForm.categoryId) return
  await fetch({
    url: `/mall/pmscategorycontent/detail/${state.dataForm.categoryId}`,
    method: 'get'
  }).then((res: any) => {
    state.dataForm = res.data || {
      categoryId: state.dataForm.categoryId,
      name: state.dataForm.name,
      content: '[]',
      customFlag: '0',
      id: ''
    }
    setTimeout(() => {
      textEditShow.value = true
    }, 200)
  })
}

// 保存表单
const confirmSave = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if (state.dataForm.customFlag == '1' && customShow.value) {
        addData()
      } else {
        saveData()
      }
    }
  })
}

// 新增自定义分类内容
const addData = async () => {
  await fetch({
    url: '/mall/pmscategorycontent/create',
    method: 'post',
    data: state.dataForm
  }).then((res: any) => {
    if (res.code == '0') {
      customShow.value = false
      state.dataForm.categoryId = res.data
      ElMessage.success('新增自定义分类内容成功')
      getPlatformCategory()
      getFormById()
    }
  })
}

// 编辑表单保存数据
const saveData = async () => {
  await fetch({
    url: '/mall/pmscategorycontent/save',
    method: 'post',
    data: state.dataForm
  }).then((res: any) => {
    if (res.code == '0') {
      getPlatformCategory()
      getFormById()
      if (state.dataForm.id) { ElMessage.success('编辑内容成功') } else { ElMessage.success('新增内容成功') }
    }
  })
}

// 获取分类树
const getPlatformCategory = async () => {
  await fetch({
    url: `/mall/pmscategorycontent/categoryTree`,
    method: 'get'
  }).then((res: any) => {
    if (res) {
      categoryOptions.value = res.data
    }
  })
}

// 获取栏目
const getGroups = async () => {
  await fetch({
    url: '/mall/productgroup/tree',
    method: 'get'
  }).then((res: any) => {
    groupOptions.value = res.data
  })
}

// 判断分类能否被拖拽
const allowDrag = (draggingNode: any) => {
  // 默认都是可以拖拽的
  if (!draggingNode.data.id) return false
  return true
}

// 判断分类能否被拖到目标位置(不能跨父分类拖动)
const allowDrop = (draggingNode: any, dropNode: any, type: any) => {
  if (type === 'inner') {
    // 不允许插入到别的子分类中
    return false
  }
  // parentCategoryId相同 level都为2时才允许拖动
  if (draggingNode.data.level !== 2 || dropNode.data.level !== 2) {
    return false
  }
  if (draggingNode.data.level !== dropNode.data.level) {
    return false
  }
  if (draggingNode.data.parentCategoryId === dropNode.data.parentCategoryId) {
    return true
  }
  return false
}

// 调整分类顺序
const handleDropDone = async (draggingNode: any, dropNode: any, type: any) => {
  await fetch({
    url: '/mall/pmscategorycontent/modifySort',
    method: 'post',
    params: {
      id: draggingNode.data.id,
      newSort: dropNode.data.sort
    }
  }).then((res: any) => {
    if (res.code == '0') {
      getPlatformCategory()
      getFormById()
      ElMessage.success('编辑顺序成功')
    }
  })
}

// 同步平台分类
const syncCategory = async () => {
  await fetch({
    url: '/mall/pmscategorycontent/syncPlatformCategory',
    method: 'post'
  }).then((res: any) => {
    if (res.code == '0') {
      getPlatformCategory()
      getFormById()
      ElMessage.success('同步成功')
    }
  })
}
</script>

<style lang="less" scoped>
.option-data {
  position: absolute;
  bottom: 9rem;
  right: 0rem;
  left: 34.6rem;
  top: 0;
  overflow-y: auto;
  padding-right: 2rem;
  margin-right: -2rem;
  padding-bottom: 2rem;
  margin-left: -2rem;
}

.button-footer {
  height: 80px;
  background: #F3F4F8;
  position: absolute;
  bottom: -1rem;
  left: 30.6rem;
  right: -2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
