<template>
  <div>
    <el-tabs v-model="pageType" @tab-click="handleClick">
      <el-tab-pane label="图文素材" name="0">
        <div class="el-card-form" style="background: #ffffff">
          <div class="el-card-formLeft" style="height: calc(100vh - 19rem)">
            <el-button
              icon="plus"
              type="text"
              style="margin-top: 2rem; margin-bottom: 3rem"
              @click="nodeAdd(1)"
              v-if="$getPression('generator_pmsmaterialtype_add')"
            >
              新增分类
            </el-button>
            <div style="overflow-y: auto;height: calc(100vh - 28rem)">
              <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
              >
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <div class="el-card-custom">
                      <!--                    <img src="@/assets/img/24gf-folder.png" style="width: 1.5rem;height: 1.5rem;margin-right: 5px" />-->
                      <span
                        :style="
                        data.id === materialTypeId ? 'color: #0969DA;' : ''
                      "
                      >{{ node.label }}</span
                      >
                    </div>
                    <el-dropdown>
                      <el-icon
                        size="10"
                        color="#0969DA"
                        class="tree-node-icon"
                        v-if="data.id === materialTypeId"
                      >
                        <more-filled />
                      </el-icon>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            @click.stop="nodeAdd(2)"
                            v-if="$getPression('generator_pmsmaterialtype_add')"
                          >添加子类
                          </el-dropdown-item
                          >
                          <el-dropdown-item
                            @click.stop="nodeEdit"
                            v-if="$getPression('generator_pmsmaterialtype_edit')"
                          >编辑分类
                          </el-dropdown-item
                          >
                          <el-dropdown-item
                            @click.stop="handleDelete"
                            v-if="$getPression('generator_pmsmaterialtype_del')"
                          >删除分类
                          </el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="el-card-formRight">
            <imageAndText
              :platformType="platformType"
              :materialTypeId="materialTypeId"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通用素材" name="1">
        <div class="el-card-form" style="background: #ffffff">
          <div class="el-card-formLeft" style="height: calc(100vh - 19rem)">
            <el-button
              icon="plus"
              type="text"
              style="margin-top: 2rem; margin-bottom: 3rem"
              @click="nodeAdd(1)"
              v-if="$getPression('generator_pmsmaterialtype_add')"
            >
              新增分类
            </el-button>
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <div class="el-card-custom">
                    <!--                    <img src="@/assets/img/24gf-folder.png" style="width: 1.5rem;height: 1.5rem;margin-right: 5px" />-->
                    <span
                      :style="
                        data.id === materialTypeId ? 'color: #0969DA;' : ''
                      "
                    >{{ node.label }}</span
                    >
                  </div>
                  <el-dropdown>
                    <el-icon
                      size="10"
                      color="#0969DA"
                      class="tree-node-icon"
                      v-if="data.id === materialTypeId"
                    >
                      <more-filled />
                    </el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          @click.stop="nodeAdd(2)"
                          v-if="$getPression('generator_pmsmaterialtype_add')"
                        >添加子类
                        </el-dropdown-item
                        >
                        <el-dropdown-item
                          @click.stop="nodeEdit"
                          v-if="$getPression('generator_pmsmaterialtype_edit')"
                        >编辑分类
                        </el-dropdown-item
                        >
                        <el-dropdown-item
                          @click.stop="handleDelete"
                          v-if="$getPression('generator_pmsmaterialtype_del')"
                        >删除分类
                        </el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
            </el-tree>
          </div>
          <div class="el-card-formRight">
            <generalMaterial
              :platformType="platformType"
              :materialTypeId="materialTypeId"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      v-if="dialogVisible"
      :title="dialogTitle"
    >
      <el-form
        :model="nodeForm"
        ref="ruleForms"
        :rules="rules"
        label-width="9rem"
      >
        <el-form-item label="上级分类" prop="parentId">
          <el-cascader
            v-model="nodeForm.parentId"
            :options="treeData"
            :props="defaultProps"
            placeholder="无上级分类视为根节点"
            clearable
            :disabled="isEdit"
            @change="handelChange"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="nodeForm.name" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="nodeForm.remarks" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="nodeForm.sort"
            type="number"
            style="width: 19rem"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleNodeConfirm">确 定</el-button>
          <el-button @click="handleNodeChange">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import imageAndText from '_c/mall/imageAndTextMaterial/index.vue'
import generalMaterial from '_c/mall/generalMaterial/index.vue'
import { getSourceTree, selectPmsMaterialTypeList } from '_c/util/api/mall'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: { imageAndText, generalMaterial },
  props: {
    platformType: {
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const state = reactive({
      ruleForms: '' as any,
      nodeData: {} as any,
      isEdit: false,
      dialogVisible: false,
      dialogTitle: '新增素材分类',
      filterText: '' as any,
      defaultProps: {
        checkStrictly: true,
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: false
      },
      treeData: [] as any,
      pageType: '0',
      materialTypeId: 0,
      nodeForm: {
        id: 0,
        name: '',
        remarks: '',
        sort: 0,
        parentId: 0
      }
    })
    const rules = reactive({
      parentId: [
        { required: true, message: '请选择所属分类', trigger: 'change' }
      ],
      name: [{ required: true, message: '子分类名称', trigger: 'change' }]
    })

    const handelChange = (row: any) => {
      console.log(row)
      state.nodeForm.parentId = row[row.length - 1]
    }
    const nodeAdd = (row: any) => {
      state.isEdit = false
      state.dialogVisible = true
      state.dialogTitle = '新增素材分类'
      console.log(state.nodeData)
      state.nodeForm = {
        id: 0,
        name: '',
        remarks: '',
        sort: 0,
        parentId: row === 1 ? 0 : state.nodeData.id
      }
    }
    const nodeEdit = () => {
      state.isEdit = true
      state.dialogVisible = true
      state.dialogTitle = '编辑素材分类'
      console.log(state.nodeData)
      state.nodeForm = state.nodeData
    }
    const handleNodeConfirm = () => {
      state.ruleForms.validate((valid: any) => {
        if (valid) {
          if (!state.isEdit) {
            nodeAddData()
          }
          if (state.isEdit) {
            // editData()
            nodeEditData()
          }
        } else {
          alert('请完善信息')
          return false
        }
      })
    }
    const handleNodeChange = () => {
      state.isEdit = false
      state.dialogVisible = false
      state.dialogTitle = '新增部门'
    }
    const handleDelete = () => {
      ElMessageBox.confirm(
        `此操作将永久删除${state.nodeData.name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteNodeData()
      })
    }
    const deleteNodeData = async () => {
      await fetch({
        url: `/mall/pmsmaterialtype/removeById/${state.nodeData.id}`,
        method: 'get'
      }).then((res: any) => {
        if (res.data) {
          ElMessage.success('删除成功')
          ElMessageBox.close()
          getTreeData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const nodeAddData = async () => {
      await fetch({
        url: '/mall/pmsmaterialtype/save',
        method: 'post',
        data: state.nodeForm
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('添加成功')
          getTreeData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const nodeEditData = async () => {
      await fetch({
        url: '/mall/pmsmaterialtype/updateById',
        method: 'post',
        data: state.nodeForm
      }).then((res: any) => {
        if (res.data) {
          state.dialogVisible = false
          ElMessage.success('编辑成功')
          getTreeData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const handleNodeClick = (i: any, x: number) => {
      state.nodeData = i
      state.materialTypeId = i.id
    }
    const getTreeData = async () => {
      getSourceTree().then((res: any) => {
        state.treeData = res.data
      })
    }
    onMounted(() => {
      getTreeData()
    })
    return {
      rules,
      handelChange,
      handleDelete,
      handleNodeConfirm,
      handleNodeChange,
      nodeAdd,
      nodeEdit,
      handleNodeClick,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
</style>
