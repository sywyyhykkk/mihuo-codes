<template>
  <div>
    <el-dialog
      v-if="addBannerShow"
      v-model="addBannerShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEdit === true ? '编辑Banner' : '添加Banner'"
      @close="cancel"
    >
      <el-form
        ref="ruleForms"
        :model="dataForm"
        :rules="dataRule"
        label-width="9rem"
      >
        <el-form-item label="名称" prop="activityName">
          <el-input
            v-model="dataForm.activityName"
            placeholder="请输入Banner名称"
          />
        </el-form-item>
        <el-form-item label="平台类型" prop="clientType">
          <el-select v-model="dataForm.clientType" placeholder="请选择平台类型">
            <el-option
              v-for="(item, index) in bannerOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="dataForm.sort"
            type="number"
            placeholder="排序"
            min="0"
            style="width: 19rem"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-select v-model="dataForm.description" placeholder="请选择Banner描述">
            <el-option
              v-for="(item, index) in desOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸类型" prop="sizeType">
          <el-select v-model="dataForm.sizeType" placeholder="请选择尺寸类型">
            <el-option
              v-for="item in sizeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <uploadImage
            v-model="dataForm.imgUrl"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item label="链接页面">
          <el-input
            v-model="dataForm.url"
            placeholder="链接页面"
            @click="showCms = true"
          />
        </el-form-item>
        <el-form-item
          v-if="JSON.parse(content).length > 0"
          disabled
          label="页面内容"
        >
          <span v-if="isLink">
            {{ cmsMessage }}
          </span>
          <richText
            v-else
            v-model="content"
            :is-editable="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-preventRepeatClick
            type="primary"
            @click="confirm"
          >保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <chooseCms
      v-model="showCms"
      :city-operator-id="cityOperatorId"
      @getGeneralMaterial="getGeneralMaterial"
    />
  </div>
</template>

<script lang="ts">
import { putObj, addObj } from '../util/api/banner'
import { ElMessage } from 'element-plus'
import uploadImage from '_c/UploadFile/uploadImage.vue'
import chooseCms from '_c/ChooseCms/index.vue'
import richText from '_c/AppTextEdit/index.vue'
import { fetch } from '_@/axios-config/axios'
import { defineComponent, reactive, toRefs, ref, onMounted, watch } from 'vue'
import wsCache from '@/cache'

export default defineComponent({
  components: { uploadImage, chooseCms, richText },
  props: ['getData', 'hideDialog', 'isEdit', 'row', 'clientType', 'clientId', 'modelValue'],
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const isLink = ref(false)
    const cityOperatorId = ref(wsCache.get('cityOperator')?.id)
    const state = reactive({
      addBannerShow: props.modelValue,
      content: '[]',
      showCms: false,
      cmsMessage: '',
      dataRule: {
        activityName: [
          { required: true, message: 'Banner名称不能为空', trigger: 'blur' }
        ],
        platformType: [
          {
            required: true,
            message: 'Banner平台类型不能为空',
            trigger: 'blur'
          }
        ],
        serviceType: [
          { required: true, message: 'Banner分类不能为空', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        sizeType: [
          { required: true, message: '尺寸类型不能为空', trigger: 'blur' }
        ],
        clientType: [
          { required: true, message: '平台类型不能为空', trigger: 'blur' }
        ]
      },
      dataForm: {
        activityId: props.row?.activityId,
        activityName: props.row?.activityName,
        url: props.row?.url,
        description: props.row?.description,
        sizeType: props.row?.sizeType,
        imgUrl: props.row?.imgUrl,
        clientType: props.row?.clientType,
        serviceType: props.row?.serviceType,
        sort: props.row?.sort,
        clientId: props.row?.clientId ? props.row?.clientId : props.clientId
      },
      bannerOptions: [
        {
          value: '',
          label: '所有平台',
          disabled: props.clientType === '2'
        },
        {
          value: 'capp',
          label: '客户端',
          disabled: props.clientType === '2'
        },
        {
          value: 'app',
          label: '服务端',
          disabled: props.clientType === '2'
        },
        {
          value: 'mini',
          label: '小程序',
          disabled: props.clientType !== '2'
        }
      ],
      sizeOptions: [
        {
          value: 0,
          label: '首页横屏'
        },
        {
          value: 1,
          label: '首页竖屏'
        },
        {
          value: 2,
          label: '首页MINI'
        },
        {
          value: 3,
          label: '大屏'
        }
      ],
      desOptions: [
        {
          value: '找人',
          label: '首页-找人'
        },
        {
          value: '找活',
          label: '首页-找活'
        },
        {
          value: '需求',
          label: '首页-需求'
        },
        {
          value: '更多功能',
          label: '首页-更多功能'
        },
        {
          value: '我的',
          label: '我的'
        },
        {
          value: '其它',
          label: '其它'
        }
      ]
    })

    const confirm = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          if (props.isEdit) {
            putObj(state.dataForm)
              .then((data: any) => {
                if (data.data === true) {
                  ElMessage.success('编辑成功!')
                  emit('getData')
                  emit('hideDialog')
                } else {
                  ElMessage.error('编辑失败!')
                }
              })
              .catch(() => {})
          } else {
            addObj(state.dataForm)
              .then((data: any) => {
                if (data.data === true) {
                  ElMessage.success('添加成功!')
                  emit('getData')
                  emit('hideDialog')
                }
              }).catch(() => {})
          }
        }
      })
    }

    const getGeneralMaterial = (val: any) => {
      state.dataForm.url = val.value ? val.value[0].id : ''
      if (state.dataForm.url) {
        state.content = '[]'
        getCms()
      }
    }

    const getCms = async() => {
      await fetch({
        url: '/mall/cms_content_manager/customer',
        method: 'get',
        params: {
          id: state.dataForm.url
        }
      }).then((res: any) => {
        if (res) {
          state.content = res.data.content
          const content = JSON.parse(state.content)[0]
          if (content.type === 'link') {
            isLink.value = true
            state.cmsMessage = `链接 -> ${content.listdata[0].name}`
          }
        }
      })
    }

    const cancel = () => {
      emit('getData')
      emit('hideDialog')
      emit('update:modelValue', false)
    }

    watch(
      () => props.modelValue,
      (newValue, oldValue) => {
        state.addBannerShow = props.modelValue
      }
    )

    watch(
      () => props.row,
      (newValue, oldValue) => {
        state.dataForm = newValue
        if (newValue.url) {
          getCms()
        } else {
          state.content = '[]'
        }
      }
    )

    onMounted(() => {
      if (state.dataForm.url) {
        getCms()
      }
    })

    return {
      confirm,
      cancel,
      getGeneralMaterial,
      getCms,
      cityOperatorId,
      isLink,
      ruleForms,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
</style>
