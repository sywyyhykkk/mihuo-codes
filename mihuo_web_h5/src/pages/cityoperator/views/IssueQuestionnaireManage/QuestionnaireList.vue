<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '发单问卷管理',
  components: {},
  setup() {}
})
</script>
<script setup lang="ts">
import { EditPen, Delete, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { fetch } from '../../axios-config/axios'
import LockManager from '@/utils/Lock'

const router = useRouter()
const metaTitle = ref('')

const dialogVisible = ref(false)
const isEdit = ref(false)
const topicForm = ref<any>({})
const inputRef = ref()
const questionnaireData = reactive<any>({
  loading: false,
  list: [],
  total: 0,
  current: 1
})
const ruleFormRef = ref()
const rules = reactive({
  name: [{ required: true, message: '问卷名称不能为空', trigger: 'change' }]
})

onMounted(() => {
  loadData()
})

const loadData = async (currentPage = 1) => {
  questionnaireData.loading = true
  try {
    const res: any = await fetch({
      method: 'get',
      url: '/basic/standard/survey/project/list',
      params: {
        size: '20',
        current: currentPage
      }
    })
    if (res.code === 0) {
      const { total, current, records } = res.data
      questionnaireData.total = Number(total)
      questionnaireData.current = Number(current)
      questionnaireData.list = records
    }
  } catch (error) {
    console.error(error)
  } finally {
    questionnaireData.loading = false
  }
}

const currentChange = (page: any) => {
  questionnaireData.current = page
  loadData(questionnaireData.current)
}

const handleAddQuestionnaires = () => {
  dialogVisible.value = true
}

const onSubmit = async (formEl?: any) => {
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      saveProject()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const saveProject = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/basic/standard/survey/project/create',
      data: topicForm.value
    })
    if (res.code === 0) {
      dialogVisible.value = false
      loadData(questionnaireData.current)
    }
  } catch (error) {
    console.error(error)
  }
}

const onClosedDialog = (formEl?: any) => {
  if (dialogVisible.value) dialogVisible.value = false
  formEl?.resetFields()
}

const hanldeEditClick = (data: any) => {
  isEdit.value = false
  topicForm.value = data
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const hanldeCheckClick = () => {
  if (!topicForm.value.name) return
  updateSave()
}

const updateSave = async () => {
  try {
    const res: any = await fetch({
      method: 'post',
      url: '/basic/standard/survey/project/update',
      data: topicForm.value
    })
    if (res.code === 0) {
      loadData(questionnaireData.current)
    }
  } catch (error) {
    console.error(error)
  } finally {
    topicForm.value = {}
  }
}

const changeSwitch = async (data: any) => {
  isEdit.value = true
  topicForm.value = data
  updateSave()
}

const hanldeDeleteClick = (topic: any) => {
  ElMessageBox.confirm('确认删除问卷？是否继续？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res: any = await fetch({
        method: 'post',
        url: '/basic/standard/survey/project/delete',
        params: { id: topic.id }
      })
      if (res.code === 0) {
        ElMessage.success('删除成功!')
        loadData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      topicForm.value = {}
    }
  })
}

const toQuestionnaireOverview = (evt: any) => {
  LockManager.getLock(
    {
      name: evt.name + evt.id,
      path: `${
        '/operator/QuestionnaireListItem?title=' +
        encodeURIComponent(evt.name) +
        '&id=' +
        evt.id
      }`,
      interval: setInterval(() => {
        LockManager.addLock({
          interval: null,
          name: evt.name + evt.id,
          path: `${
            '/operator/QuestionnaireListItem?title=' +
            encodeURIComponent(evt.name) +
            '&id=' +
            evt.id
          }`
        })
      }, 300000)
    },
    (data = evt) => {
      metaTitle.value = data.name
      router.push({
        path: `/operator/QuestionnaireListItem`,
        query: { title: data.name, id: data.id }
      })
    }
  )
}

router.afterEach((to, from) => {
  if (to.name === 'QuestionnaireInfo') {
    to.meta.title = metaTitle
  }
})
</script>

<template>
  <div class="questionnaire">
    <el-card v-if="questionnaireData.list.length">
      <el-button type="primary" size="large" @click="handleAddQuestionnaires">
        添加问卷
      </el-button>
    </el-card>

    <div
      v-if="questionnaireData.list.length"
      v-loading="questionnaireData.loading"
      class="grid-wrapper"
    >
      <template v-for="item of questionnaireData.list" :key="item.id">
        <div class="grid-item">
          <div>
            <p class="grid-item-title">
              <el-input
                v-if="!isEdit && topicForm.id === item.id"
                ref="inputRef"
                key="edit-input"
                v-model="topicForm.name"
                placeholder="Please input"
                @focusout="changeTopicName"
                @change="hanldeCheckClick"
              />
              <span v-else key="edit-text">{{ item.name }}</span>
              <el-button
                v-if="!isEdit && topicForm.id === item.id"
                key="button-check"
                type="text"
                :icon="Check"
                @click="hanldeCheckClick"
              />
              <el-button
                v-else
                key="button-edit"
                type="text"
                :icon="EditPen"
                @click="hanldeEditClick(item)"
              />
              <el-button
                type="text"
                :icon="Delete"
                @click="hanldeDeleteClick(item)"
              />
            </p>
          </div>
          <div>
            <el-space>
              <p>是否启用</p>
              <el-switch
                v-model="item.status"
                :active-value="1"
                :inactive-value="0"
                size="large"
                @change="changeSwitch(item)"
              />
            </el-space>
            <el-button type="primary" @click="toQuestionnaireOverview(item)"
              >问卷</el-button
            >
          </div>
        </div>
      </template>
    </div>

    <el-empty v-else>
      <el-button type="primary" size="large" @click="handleAddQuestionnaires">
        添加
      </el-button>
    </el-empty>

    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="添加问卷"
      width="40rem"
      @close="onClosedDialog(ruleFormRef)"
    >
      <el-form
        ref="ruleFormRef"
        :model="topicForm"
        :rules="rules"
        label-width="70px"
      >
        <el-form-item label="问卷名称" prop="name">
          <el-input v-model="topicForm.name" placeholder="问卷名称" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="topicForm.status"
            :active-value="1"
            :inactive-value="0"
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="large"
            type="danger"
            @click="onClosedDialog(ruleFormRef)"
          >
            取消
          </el-button>
          <el-button size="large" type="primary" @click="onSubmit(ruleFormRef)">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-pagination
      :total="questionnaireData.total"
      :current-page="questionnaireData.current"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    />
  </div>
</template>

<style scoped lang="less">
.questionnaire {
  margin: 2rem;

  .el-empty {
    .el-button {
      width: 14rem;
      height: 4rem;
    }
  }

  & > .el-card .el-button {
    width: 14rem;
    height: 4rem;
  }
}

.grid-wrapper {
  max-height: 76vh;

  display: grid;
  grid-template: auto / repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px 40px;

  margin-top: 1rem;

  overflow-y: auto;

  .grid-item {
    height: 160px;
    padding: 0 20px;
    border-radius: 6px;

    background-color: whitesmoke;

    box-sizing: border-box;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;

    .el-button {
      width: 8rem;
      height: 4rem;
      border-radius: 0;
      margin: 0;
    }

    .el-button--text {
      width: 4rem;
      height: 4rem;
      font-size: 2rem;
      padding: 0;
    }

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .grid-item-title {
        display: flex;
        align-items: baseline;

        & > span {
          font-size: 22px;
          font-weight: bold;
          margin-right: 1rem;
        }

        .el-input {
          width: auto;
          margin-right: 1rem;
        }
      }
    }
  }
}
</style>
