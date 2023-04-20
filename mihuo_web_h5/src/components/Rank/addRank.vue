<template>
  <div>
    <el-form
      :model="dataForm"
      ref="ruleForms"
      :rules="rules"
      label-width="9rem"
    >
      <el-form-item label="榜单类型" prop="type">
        <el-select
          v-model="dataForm.type"
          placeholder="请选择榜单类型"
          :disabled="isEditable"
        >
          <el-option
            v-for="item in rankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="企业" prop="companyId">-->
      <!--        <el-select-->
      <!--          v-model="dataForm.companyId"-->
      <!--          placeholder="请选择企业"-->
      <!--          :disabled="isEditable"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in companyOptions"-->
      <!--            :key="item.value"-->
      <!--            :label="item.label"-->
      <!--            :value="item"-->
      <!--          >-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="昵称" prop="name">
        <el-input v-model="dataForm.name" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="工种类型" prop="skillName">
        <el-input
          v-model="dataForm.skillName"
          placeholder="工种类型"
        ></el-input>
      </el-form-item>
      <el-form-item label="工种等级" prop="level">
        <el-input
          type="number"
          v-model="dataForm.level"
          placeholder="工种等级"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <uploadImage
          v-model="dataForm.avatar"
          :max-count="1"
          :is-edits="isEdit"
        />
      </el-form-item>
      <el-form-item label="排名" prop="rank">
        <el-input
          type="number"
          v-model="dataForm.rank"
          placeholder="排名"
          min="1"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="type === '1' ? '信任指数' : '财富值'"
        prop="trustScore"
      >
        <el-input
          type="number"
          v-model="dataForm.trustScore"
          :placeholder="type === '1' ? '信任指数' : '财富值'"
        ></el-input>
      </el-form-item>
      <el-form-item label="操作" fixed="right">
        <el-button @click="confirm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { putObj, addObj, getAllCompanies } from '../util/api/rank'
import { putObj2, addObj2 } from '../util/api/incomeRank'
import { ElMessage } from 'element-plus'
import uploadImage from '@/components/UploadFile/uploadImage.vue'

export default defineComponent({
  components: { uploadImage },
  props: ['getData', 'hideDialog', 'isEdit', 'row', 'type'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      dataRule: {},
      formData: {},
      type: props.type,
      skillOptions: [
        {
          label: '水电',
          value: 1,
        },
        {
          label: '泥瓦',
          value: 2,
        },
      ],
      dataForm: {
        id: props.row?.id,
        personId: props.row?.personId,
        rank: props.row?.rank,
        trustScore: props.row?.trustScore
          ? props.row?.trustScore
          : props.row?.money,
        type: props.row?.type,
        userId: props.row?.userId,
        name: props.row?.name,
        avatar: props.row?.avatar,
        skillName: props.row?.skillName,
        level: props.row?.level,
        companyId: props.row?.companyId,
      },
      rankOptions: [
        {
          value: 1,
          label: '设计榜',
        },
        {
          value: 2,
          label: '管家榜',
        },
        {
          value: 3,
          label: '监理榜',
        },
        {
          value: 4,
          label: '工人榜',
        },
      ],
      company: {
        value: '',
        label: '',
      },
      companyOptions: [] as any,
      canSubmit: false,
      disableButton: true,
      isEditable: props.isEdit,
    })

    const rules = reactive({
      name: [{ required: true, message: '请输入人员昵称', trigger: 'blur' }],
      trustScore: [
        {
          required: true,
          message: state.type === '1' ? '请输入信任指数' : '请输入财富指数',
          trigger: 'blur',
        },
      ],
      type: [{ required: true, message: '请输入榜单类型', trigger: 'blur' }],
      avatar: [{ required: true, message: '请上传用户头像', trigger: 'blur' }],
      rank: [
        { required: true, message: '请输入排名', trigger: 'blur' },
        { pattern: /^([1-9]|10)$/, message: '排名范围在1-10', trigger: 'blur' },
      ],
      skillName: [
        { required: true, message: '请输入工种类型', trigger: 'blur' },
      ],
      level: [
        { required: true, message: '请输入工种等级', trigger: 'blur' },
        {
          pattern: /^([1-5])$/,
          message: '工种等级范围在1-5',
          trigger: 'blur',
        },
      ],
      // companyId: [{ required: true, message: '请选择企业', trigger: 'blur' }]
    })

    onMounted(() => {
      getCompanies()
    })

    const getCompanies = async () => {
      await getAllCompanies().then((res) => {
        res.data.records.forEach((item: any, index: any) => {
          let obj = {
            value: item.companyId,
            label: item.companyName,
          }
          state.companyOptions.push(obj)
        })
      })
    }

    const editRank = async (data: any) => {
      await putObj(data)
        .then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('操作成功!')
            emit('getData')
            emit('hideDialog')
          } else {
            ElMessage.success(`${res.msg}`)
          }
        })
        .catch(() => {})
    }

    const editIncomeRank = async (data: any) => {
      await putObj2(data)
        .then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('操作成功!')
            emit('getData')
            emit('hideDialog')
          } else {
            ElMessage.success(`${res.msg}`)
          }
        })
        .catch(() => {})
    }

    const addToRank = async (data: any) => {
      await addObj(data)
        .then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('操作成功!')
            emit('getData')
            emit('hideDialog')
          } else {
            ElMessage.success(`${res.msg}`)
          }
        })
        .catch(() => {})
    }

    const addToIncomeRank = async (data: any) => {
      await addObj2(data)
        .then((res: any) => {
          if (res.code === 0) {
            ElMessage.success('操作成功!')
            emit('getData')
            emit('hideDialog')
          } else {
            ElMessage.success(`${res.msg}`)
          }
        })
        .catch(() => {})
    }

    const confirm = () => {
      const data =
        state.type === '1'
          ? {
              id: state.dataForm.id,
              rank: state.dataForm.rank,
              trustScore: state.dataForm.trustScore,
              skillName: state.dataForm.skillName,
              level: state.dataForm.level,
              name: state.dataForm.name,
              avatar: state.dataForm.avatar,
              type: state.dataForm.type,
              // companyId: state.dataForm.companyId.id
            }
          : {
              id: state.dataForm.id,
              rank: state.dataForm.rank,
              money: state.dataForm.trustScore,
              name: state.dataForm.name,
              skillName: state.dataForm.skillName,
              level: state.dataForm.level,
              avatar: state.dataForm.avatar,
              type: state.dataForm.type,
              // companyId: state.dataForm.companyId.id
            }
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          if (state.isEditable) {
            if (state.type === '1') {
              editRank(data)
            } else {
              editIncomeRank(data)
            }
          } else {
            if (state.type === '1') {
              addToRank(data)
            } else {
              addToIncomeRank(data)
            }
          }
        } else {
          ElMessage.warning('请正确输入所有信息!')
        }
      })
    }

    const cancel = () => {
      emit('getData')
      emit('hideDialog')
    }

    return {
      rules,
      ruleForms,
      confirm,
      cancel,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="less">
</style>
