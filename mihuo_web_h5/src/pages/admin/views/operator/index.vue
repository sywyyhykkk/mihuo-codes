<template>
  <div>
    <div v-if="!accountStatus">
      <el-card>
        <el-button
          size="mini"
          type="primary"
          @click="saveForm"
        >新增</el-button>
        <el-input
          v-model="search.name"
          size="mini"
          placeholder="名称、编码、联系人、电话"
          class="input-with-select"
        />
        <el-button
          type="primary"
          icon="search"
          @click="getScreening"
        >查询
        </el-button>
      </el-card>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%"
      >
        <el-table-column
          prop="url"
          label="logo"
          align="center"
        >
          <template #default="scope">
            <el-image
              v-if="scope.row.operatorLogo"
              preview-teleported
              lazy
              :src="getThumbnailImage(scope.row.operatorLogo.replace('https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/', ''), true)"
              :preview-src-list="[
                getThumbnailImage(scope.row.operatorLogo, false),
              ]"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="运营商名称"
          align="center"
        />
        <el-table-column
          prop="shortName"
          label="简称"
          align="center"
        />
        <el-table-column
          prop="status"
          width="100"
          label="是否启用"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status === 1" type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
        />
        <el-table-column
          prop="areaCode"
          label="城市编码"
          align="center"
        />
        <el-table-column
          prop="contactName"
          width="200"
          label="联系人"
          align="center"
        />
        <el-table-column
          width="120"
          prop="letter"
          label="城市名称首字母"
          align="center"
        />
        <el-table-column
          prop="pinyin"
          label="城市名称拼音"
          align="center"
        />
        <el-table-column
          prop="contactTel"
          label="联系人电话"
          align="center"
        />
        <el-table-column
          prop="materialName"
          width="100"
          label="登录账号数"
          align="center"
        >
          <template #default="scope">
            <span
              class="binding-account"
              @click="bindingAccount(scope.row)"
            >绑定账号</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="200"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="edit"
              @click="updateMaterialType(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              class="danger"
              icon="delete"
              @click="deleteMaterialType(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager,next, jumper"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        width="40%"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="formType === 'add' ? '新增运营商' : `编辑运营商--${form.name}`"
        :before-close="handleClose"
      >
        <div class="c" style="height: 55vh; overflow-y: auto">
          <el-form
            ref="rulesForm"
            label-width="14rem"
            :rules="rules"
            :model="form"
          >
            <el-form-item label="运营商名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="简称" prop="shortName">
              <el-input v-model="form.shortName" />
            </el-form-item>
            <el-form-item label="地址" prop="areaCode">
              <el-cascader
                v-model="getAreaCodeList"
                :props="optionProps"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="form.contactName" />
            </el-form-item>
            <el-form-item label="城市名称首字母" prop="letter">
              <el-input v-model="form.letter" maxlength="1" />
            </el-form-item>
            <el-form-item label="城市名称拼音" prop="pinyin">
              <el-input v-model="form.pinyin" />
            </el-form-item>
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input
                v-model="form.contactTel"
                maxlength="11"
                type="number"
              />
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
              <el-switch
                v-model="form.status"
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
            <el-form-item label="公司logo" prop="operatorLogo">
              <fileUpload
                :file-type="fileType"
                :is-editor="isEditor"
                :form-batch="false"
                :prop-url-list="propUrlList"
                @changeUpload="changeUpload"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              :loading="loading"
              type="primary"
              @click="onsubmit"
            >确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <accountManagement
      v-if="accountStatus"
      :account-prop="accountProp"
      @backPage="accountStatus = false"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watchEffect
} from 'vue'
import { useRoute } from 'vue-router'
import accountManagement from './accountManagement.vue'

import {
  addCityOperator,
  selectCityOperatorPage,
  deleteCityOperator,
  updateCityOperatorPage
} from '_@/api/cityOperator'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import { thumbnailImage } from '@/utils/utils'

export default defineComponent({
  components: {
    accountManagement
  },
  props: {
    platformType: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const dialogVisible = ref<boolean>(false)
    const route = useRoute()
    const rulesForm = ref()
    const videoPlayStatus = ref(false)
    const fileType = ref('img')
    const fileList = ref([])
    const isEditor = ref(false)
    const propUrlList = ref<any>([])
    const fileUrlList = ref<any>([])
    const defaultProps = reactive({
      children: 'children',
      label: 'name',
      value: 'id'
      // lazy: true,
      // lazyLoad(node:any, resolve:any) {
      //   setTimeout(() => {
      //     const nodes = fetch({ url: `/basic/region/regionTree/${node.data.agencyId || 50}`, method: 'get' }).then((res: any) => {
      //       state.provinceList
      //       return res.data
      //     })
      //     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      //     resolve(nodes)
      //   }, 100)
      // }
      // checkStrictly: true
    })
    const accountObject = reactive({
      accountStatus: false,
      accountProp: {}
    })
    const fileTypeList = ref([
      { value: 1, label: '图片', fileType: 'img' },
      { value: 2, label: '视频', fileType: 'video' },
      { value: 3, label: '音频', fileType: 'audio' }
    ])
    const tableHeight = ref<any>(0)
    const state = reactive({
      tableData: [],
      loading: true,
      total: 0,
      formType: '',
      pageSize: 20,
      currentPage: 1,
      materialTypeList: [],
      provinceList: [
        {
          children: [] as any
        }
      ],
      cityList: [],
      search: {
        contactTel: null,
        name: ''
      },
      form: {
        name: '',
        shortName: '',
        areaCode: 0,
        contactName: '',
        contactTel: '',
        status: 1,
        operatorLogo: '',
        address: '',
        letter: '',
        pinyin: ''
      },
      optionProps: {
        lazy: true,
        lazyLoad: async (node: any, resolve: any) => {
          const { level } = node
          const nodes = [] as any
          if (level === 0) {
            await fetch({
              url: `/basic/region/province`,
              method: 'get'
            }).then((res: any) => {
              res.data.forEach((item: any) => {
                nodes.push({
                  value: item.agencyId,
                  label: item.name,
                  areaCode: item.agencyId,
                  leaf: false,
                  children: [] as any
                })
              })
            })
            state.provinceList = nodes
            resolve(nodes)
          } else if (level === 1) {
            await fetch({ url: `/basic/region/regionTree/${node.data.areaCode}`, method: 'get' }).then(
              (res: any) => {
                res.data.forEach((item: any) => {
                  nodes.push({
                    value: item.agencyId,
                    label: item.name,
                    areaCode: item.agencyId,
                    leaf: true
                  })
                })
                state.cityList = nodes
                resolve(nodes)
              }
            )
          }
        }
      }
    })

    const getAreaCodeList = computed(() => {
      const areaCode = state.form.areaCode + ''
      const province = parseInt(areaCode.substring(0, 2))
      const full = parseInt(areaCode)
      return [province, full]
    })

    const rules = reactive({
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      areaCode: [{ required: true, message: '请选择地址', trigger: 'blur' }],
      contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
      contactTel: [{ required: true, message: '请输入联系人电话', trigger: 'blur', max: 11, min: 11 }],
      letter: [{ required: true, message: '请输入城市名称首字母', trigger: 'blur' }],
      pinyin: [{ required: true, message: '请输入城市名称拼音', trigger: 'blur' }]
    })

    const handleCurrentChange = (val: number) => {
      state.currentPage = val
      getData()
    }

    const getHeight = () => {
      tableHeight.value = document.documentElement.clientHeight - 230
    }

    watchEffect(() => {
      getHeight()
      // 增加监听事件，窗口变化时得到高度。
      window.addEventListener('resize', getHeight, false)
    })

    const getThumbnailImage = (url: any, thumbnail: any) => {
      return thumbnailImage(url, thumbnail)
    }

    const getData = async () => {
      selectCityOperatorPage({
        ...state.search,
        size: state.pageSize,
        current: state.currentPage
      }).then((res: any) => {
        state.tableData = res.data.records
        state.total = res.data.total
        state.loading = false
      })
    }

    onMounted(() => {
      getData()
    })

    const handleClose = () => {
      dialogVisible.value = false
    }

    const saveForm = () => {
      state.formType = 'add'
      dialogVisible.value = true
      getReset()
    }

    const onsubmit = () => {
      state.loading = true
      const forms: any = unref(rulesForm)
      forms.validate((valid: boolean) => {
        if (valid && state.form.areaCode) {
          if (state.formType === 'add') {
            if (fileList.value.length > 0) {
              getFileUpload(() => {
                getAddPmsCommonMaterial()
              })
            } else {
              getAddPmsCommonMaterial()
            }
          } else {
            if (fileList.value.length > 0) {
              getFileUpload(() => {
                getUpdatePmsCommonMaterial()
              })
            } else {
              getUpdatePmsCommonMaterial()
            }
          }
        } else {
          ElMessage.warning('请检查表单是否填写完整!')
        }
      })
    }

    const getAddPmsCommonMaterial = () => {
      addCityOperator(state.form).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '新增成功',
            type: 'success'
          })
          getReset()
          dialogVisible.value = false
          getData()
        }
      })
    }

    const getUpdatePmsCommonMaterial = () => {
      updateCityOperatorPage(state.form).then((res: any) => {
        if (res) {
          ElMessage.success({
            message: '修改成功',
            type: 'success'
          })
          getReset()
          dialogVisible.value = false
          getData()
        }
      })
    }

    const getFileUpload = (callback: any) => {
      fileList.value.map(async (item: any) => {
        const formData = new FormData()
        formData.append('file', item)
        await fetch({
          url: '/admin/sys-file/upload',
          method: 'post',
          data: formData
        }).then((res: any) => {
          if (res.data.url) {
            fileUrlList.value.push(res.data.url)
            state.form.operatorLogo = res.data.url
            callback()
          } else {
            const errorMessage = JSON.parse(res.data.check).data[0].msg
            console.log(errorMessage)
            ElMessage.error({
              message: `图片上传失败, ${errorMessage}`,
              type: 'error'
            })
          }
        })
      })
    }

    const updateMaterialType = (e: any) => {
      state.form = JSON.parse(JSON.stringify(e))
      state.formType = ''
      isEditor.value = true
      fileType.value = 'img'
      state.form.areaCode = Number(JSON.parse(JSON.stringify(e)).areaCode)
      propUrlList.value = [getThumbnailImage(e.operatorLogo?.replace('https://mihuo-test.obs.cn-east-3.myhuaweicloud.com/', ''), false)]
      dialogVisible.value = true
    }

    const changeUpload = (e: any) => {
      state.form.operatorLogo = ''
      fileList.value = e.value
    }

    const deleteMaterialType = (e: any) => {
      ElMessageBox.confirm(`是否确定要删除此条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCityOperator({ id: e.id }).then((res: any) => {
          if (res) {
            ElMessage.success({
              message: '删除成功',
              type: 'success'
            })
            getData()
          }
        })
      })
    }

    const getScreening = () => {
      getData()
    }

    const getReset = () => {
      state.form.address = ''
      state.form.name = ''
      state.form.shortName = ''
      state.form.contactName = ''
      state.form.contactTel = ''
      state.form.status = 1
      state.form.operatorLogo = ''
      state.form.areaCode = 0
      state.form.letter = ''
      state.form.pinyin = ''
      fileType.value = 'img'
      propUrlList.value = []
      // 重置表单
      // const form: any = unref(rulesForm)
      // form.resetFields()
    }

    const bindingAccount = (e: any) => {
      accountObject.accountProp = e
      accountObject.accountStatus = true
    }

    const handleChange = (e: any) => {
      let address = ''
      state.provinceList.forEach((item: any) => {
        if (item.value === e['0']) {
          address += item.label
        }
      })
      state.cityList.forEach((item: any) => {
        if (item.value === e['1']) {
          address += ' ' + item.label
        }
      })
      state.form.address = address
      state.form.areaCode = e['1']
    }

    return {
      dialogVisible,
      route,
      rules,
      tableHeight,
      fileType,
      fileTypeList,
      rulesForm,
      fileList,
      isEditor,
      propUrlList,
      videoPlayStatus,
      accountObject,
      defaultProps,
      getAreaCodeList,
      getThumbnailImage,
      getScreening,
      getAddPmsCommonMaterial,
      getReset,
      getFileUpload,
      updateMaterialType,
      deleteMaterialType,
      saveForm,
      getData,
      open,
      onsubmit,
      handleCurrentChange,
      handleClose,
      changeUpload,
      bindingAccount,
      handleChange,
      ...toRefs(state),
      ...toRefs(accountObject)
    }
  }
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

  .screening {
    display: flex;
    align-items: center;
  }

  .screening-contain {
    display: flex;

    .screening-item {
      /*white-space:nowrap;*/
      align-items: center;
      margin-right: 10px;
    }
  }

  .label {
    color: #606266;
    font-size: 16px;
    margin: 0 10px 0 10px;
  }
}

.item-video {
  cursor: pointer;
  display: inline-block;
}

.binding-account {
  cursor: pointer;
  color: #2d8cf0;
}
</style>
