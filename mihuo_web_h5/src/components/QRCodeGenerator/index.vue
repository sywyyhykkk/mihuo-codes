<template>
  <div>
    <div>
      <el-card shadow="never">
        <el-input v-model="listQuery.source" placeholder="请输入来源" />
        <el-select
          v-model="listQuery.pagePath"
          placeholder="请选择页面路径"
          clearable
        >
          <el-option
            v-for="item in pagePathOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          type="primary"
          icon="Search"
          @click="getData()"
        >
          查询
        </el-button>
        <el-button
          icon="refreshLeft"
          @click="handleResetSearch()"
        >
          重置
        </el-button>
        <div class="el-card-right">
          <el-button
            type="primary"
            icon="plus"
            @click="addQRCode"
          >
            新增小程序码
          </el-button>
        </div>
      </el-card>
    </div>
    <div>
      <el-table
        v-loading="loading"
        stripe
        :height="tableHeight"
        :data="tableData"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
        />
        <el-table-column
          label="来源"
          prop="source"
          align="center"
        />
        <el-table-column
          label="参数"
          prop="param"
          align="center"
        />
        <el-table-column
          label="页面路径"
          prop="pagePath"
          align="center"
        >
          <template #default="scope">
            {{
              pagePathOptions.find((item: {value: string}) => {
                return item.value === scope.row.pagePath
              })?.label
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-prevent-repeat-click="5000"
              size="small"
              type="text"
              icon="download"
              @click="downloadRow(scope.row)"
            >
              下载
            </el-button>
            <el-button
              v-prevent-repeat-click="2000"
              size="small"
              type="text"
              class="danger"
              icon="delete"
              @click="deleteRow(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination-new
        :current-page="listQuery.current"
        :page-size="20"
        :total="+total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="isShowDialog"
      v-model="isShowDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isGenerate ? '生成小程序码' : isEdit ? '编辑小程序码' : '新增小程序码'"
      @close="closeDialog"
    >
      <el-form
        ref="ruleForm"
        :model="codeForm"
        :rules="dataRule"
        label-width="8rem"
      >
        <el-form-item prop="source" label="来源">
          <el-input
            v-model="codeForm.source"
            maxlength="6"
            :disabled="isGenerate"
            placeholder="请输入来源"
          />
        </el-form-item>
        <el-form-item prop="pagePath" label="页面">
          <el-select
            v-model="codeForm.pagePath"
            :disabled="isGenerate"
            placeholder="请选择页面路径"
            clearable
          >
            <el-option
              v-for="item in pagePathOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="codeForm.pagePath === 'pages-mall/productDetail/productDetail'" prop="params" label="商品">
          <el-input v-model="codeParams" placeholder="请选择关联商品" @click="isShowProduct = true" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-prevent-repeat-click
            type="primary"
            @click="getQRCodeBase64"
          >
            生成
          </el-button>
          <el-button @click="closeDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <ChooseProduct
      v-model="isShowProduct"
      :single="true"
      @getGeneralMaterial="onSelectProduct"
    />
  </div>
</template>

<script lang="ts" setup>
import { fetch } from '_@/axios-config/axios'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { getProductDetail } from '_c/CaseManagement/api'
import { Base64 } from 'js-base64'

const listQuery = ref({
  pagePath: '',
  source: '',
  current: 1
})
const tableData = ref([])

onMounted(() => {
  getData()
})

const tabHeight = ref(0)

const getHeight = () => {
  tabHeight.value = document.documentElement.clientHeight - 210
}

watchEffect(() => {
  getHeight()
  // 增加监听事件，窗口变化时得到高度。
  window.addEventListener('resize', getHeight, false)
})

// 页面路径
const pagePathOptions = ref([
  {
    value: 'pages/home/home',
    label: '首页'
  },
  {
    value: 'pages-mall/productDetail/productDetail',
    label: '商品详情页'
  },
  {
    value: 'pages-valuation/valuation',
    label: '装修报价器'
  }
  // {
  //   value: 'pages-common/case/recommend/detail',
  //   label: '案例详情页'
  // }
])

const handleCurrentChange = (val: number) => {
  listQuery.value.current = val
  getData()
}

const loading = ref(false)
const total = ref(0)
// 获取数据
const getData = async () => {
  loading.value = true
  await fetch({
    url: '/order/bizsharecode/pageForConfig',
    method: 'get',
    params: {
      size: 20,
      ...listQuery.value
    }
  }).then((res: any) => {
    if (res && res.data) {
      total.value = res.data.total
      loading.value = false
      tableData.value = res.data.records
    }
  })
}

// 重置搜索
const handleResetSearch = () => {
  listQuery.value = {
    pagePath: '',
    source: '',
    current: 1
  }
  getData()
}

// 是否显示弹窗
const isShowDialog = ref(false)
// 是否编辑弹窗
const isEdit = ref(false)
// 小程序码表单
const codeForm = ref({
  id: '',
  source: '',
  pagePath: '',
  param: ''
})
// 表单规则
const dataRule = ref({
  source: [
    { required: true, message: '请输入来源', trigger: 'blur' }
  ],
  pagePath: [
    { required: true, message: '请选择页面路径', trigger: 'blur' }
  ]
})

// 添加小程序码
const addQRCode = () => {
  isEdit.value = false
  isShowDialog.value = true
}

// 下载小程序码
const downloadRow = async (row: any) => {
  codeParams.value = row.param
  codeForm.value.source = row.source
  codeForm.value.param = row.params
  codeForm.value.pagePath = row.pagePath
  await getQRCodeBase64()
}

// 删除记录
const deleteRow = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除该条记录, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await fetch({
      url: '/order/bizsharecode/delForConfig' + '/' + row.id,
      method: 'post'
    }).then((res: any) => {
      if (res) {
        ElMessage.success('删除成功')
        getData()
      }
    })
  })
}

// 关闭弹窗
const closeDialog = () => {
  isShowDialog.value = false
  isEdit.value = false
  codeParams.value = ''
  codeForm.value = {
    id: '',
    source: '',
    pagePath: '',
    param: ''
  }
}

const ruleForm = ref('')
// 保存新增小程序码弹窗
const saveDialog = () => {
  const forms: any = unref(ruleForm)
  // 如果forms不存在 说明是直接从已有记录中下载
  if (!forms) {
    // 清空表单
    closeDialog()
    return
  }
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      codeForm.value.param = codeParams.value
      // 保存/编辑小程序码
      await fetch({
        url: '/order/bizsharecode/addForConfig',
        method: 'post',
        data: codeForm.value
      }).then(async (res: any) => {
        if (res.code === 0) {
          await getData()
          closeDialog()
        }
      })
    }
  })
}

// 小程序码参数
const codeParams = ref('')

// 获取小程序码base64
const getQRCodeBase64 = async () => {
  const env = process.env.VUE_APP_API_ENV
  let type = 'release'
  if (env?.startsWith('dev')) {
    type = 'develop'
  } else if (env?.startsWith('test')) {
    type = 'trial'
  }
  const scene = codeParams.value
    ? codeParams.value + '&source=' + Base64.encode(codeForm.value.source, true)
    : Base64.encode(codeForm.value.source, true)
  await fetch({
    url: '/admin/weChat/wxMaQrcode',
    method: 'post',
    data: {
      clientId: 'cmini',
      page: codeForm.value.pagePath,
      scene: scene,
      envVersion: type,
      type: 'MINI'
    }
  }).then((res: any) => {
    if (res.code === 0) {
      const a = document.createElement('a')
      a.href = 'data:image/png;base64,' + res.data
      a.download = `【${codeForm.value.source}】分享小程序码.png`
      a.click()
      saveDialog()
    }
  })
}

// 是否显示选择商品弹窗
const isShowProduct = ref(false)

// 选择商品
const onSelectProduct = async (product: any) => {
  if (!product?.value[0]?.id) return
  codeParams.value = 'id=' + product.value[0].id
}
</script>

<style lang="less" scoped>

</style>
