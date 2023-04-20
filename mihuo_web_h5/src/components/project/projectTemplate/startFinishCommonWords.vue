<template>
  <div>
    <el-dialog
      v-if="dialogShow"
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="type === 'start' ? '开始常用语' : '结束常用语'"
      @close="handelClose"
      width="40%"
    >
      <div style="margin-right: 2rem">
        <el-button
          style="margin: 1rem 0"
          type="primary"
          :loading="state.loading"
          @click="handelClick('', '添加')"
          >新 增</el-button
        >
        <el-table
          v-loading="loadTable"
          stripe
          :data="tableData"
          style="height: 30vh !important"
          :height="'0'"
          border
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column prop="content" align="center" label="内容" />
          <el-table-column
            prop="categoryFlag"
            align="center"
            label="分类标识"
          />
          <el-table-column prop="sort" align="center" label="排序" sortable />
          <el-table-column
            label="操作"
            fixed="right"
            width="200"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                icon="edit"
                type="text"
                @click="handelClick(scope.row, '编辑',scope.$index)"
              >
                编辑
              </el-button>

              <el-button
                size="mini"
                type="text"
                icon="delete"
                class="danger"
                @click="handelClick(scope.row, '删除',scope.$index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- <div>
          <el-pagination-new
            small
            style="position: absolute !important; bottom: 9rem"
            :hide-on-single-page="false"
            :current-page="currentPage"
            :page-size="pagesize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm"
            >确 定</el-button
          >
          <el-button @click="handelClose">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-if="dialogShow2"
      v-model="dialogShow2"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="type === 'start' ? '配置开始常用语' : '配置结束常用语'"
      @close="handelClose2"
      width="55rem"
    >
      <el-form
        ref="ruleForms"
        :model="state.form"
        :rules="rules"
        label-width="11rem"
        :scrollToError="true"
      >
        <el-form-item label="分类标识" prop="categoryFlag">
          <el-input v-model="state.form.categoryFlag" disabled />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="state.form.content"
            type="textarea"
            maxlength="128"
            :autosize="{ minRows: 2, maxRows: 5 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="state.form.sort"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            type="number"
            min="0"
            style="width: 19rem"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :loading="state.loading"
            @click="handleConfirm2()"
            >确 定</el-button
          >
          <el-button @click="handelClose2">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { onMounted, ref, reactive, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    //表达式类型：开始条件：type=start 结束条件：type=finish
    type: String,
    default: ''
  },
  nodeId: {
    type: String || Number,
    default: 0
  },
  data: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue','updateCommonWords'])
const dialogShow = ref(false)
const dialogShow2 = ref(false)
const loadTable = ref(false)
const tableData = ref<any[]>([])
const total = ref<number>(0)
const currentPage = ref<number>(1)
const pagesize = ref<number>(20)
const ruleForms = ref<any>('')

const state = reactive({
  index: -1,
  isEdit: false,
  form: {} as any,
  inData: [] as any//初始数据
})

const rules = reactive({
  content: [{ required: true, message: '请输入内容', trigger: 'change' }]
})

const searchData = reactive<any>({
  categoryFlag: ''
})

const handleConfirm = () => {
  emit('updateCommonWords',tableData.value)
  handelClose()
}

const handleConfirm2 = () => {
  ruleForms.value.validate((valid: any) => {
    if (valid) {
      if(!state.isEdit){
        tableData.value.push({...state.form})
      }else{
        tableData.value[state.index] = state.form
      }
      handelClose2()
    }
  })
}

const handelClose2 = () => {
  dialogShow2.value = false
}

const handelClick = (data: any, val: string,index:number) => {
  switch (val) {
    case '添加':
      dialogShow2.value = true
      state.isEdit = false
      state.form = {
        categoryFlag: props.type === 'start' ? 'NODESTART' : 'NODEFINISH',
        content: '',
        sort: 0,
        id: -1
      }
      break
    case '编辑':
      dialogShow2.value = true
      state.isEdit = true
      state.index = index
      state.form = {...data}
      break
    case '删除':
      ElMessageBox.confirm('此操作保存节点后才会删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tableData.value.splice(index,1)
      })
      break
  }
}

onMounted(() => {
})

const handelClose = () => {
  emit('update:modelValue', false)
}
watchEffect(() => {
  if (props.modelValue) {
    dialogShow.value = props.modelValue
    tableData.value = props.data
  } else {
    dialogShow.value = false
  }
  if (props.type === 'start') {
    searchData.categoryFlag = 'NODESTART'
  } else {
    searchData.categoryFlag = 'NODEFINISH'
  }
})
</script>
