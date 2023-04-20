<template>
  <div>
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header flex-center">
          <span class="title">配送时长设置</span>
        </div>
      </template>
      <div style="margin-top: 2rem;">
        <div class="card-content">
          <span class="content">
            根据不同区域设置预计的配送时长，用户在购买下单时，可查看其所在区域的预计到货时长
          </span>
        </div>
        <div class="rules-radio">
          <el-button type="primary" @click="setFreightDuration">去设置</el-button>
        </div>
      </div>
    </el-card>
    <el-drawer
      v-model="isShowSettingPanel"
      size="50%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="配送时长设置"
      @close="hideDialog"
    >
      <div style="padding: 2rem">
        <el-card class="el-card--body2">
          <div class="el-card-left">
            用户在下单时，可以看到其所在地区的预计送达时长
          </div>
          <div class="el-card-right">
            <el-button
              type="primary"
              plain
              icon="plus"
              @click="addArea"
            >
              添加地区
            </el-button>
          </div>
        </el-card>
        <el-table
          v-loading="isTableLoading"
          stripe
          style="height: calc(100vh - 51rem) !important"
          :data="tableData"
          :height="0"
          border
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="指定地区" prop="deliveryArea">
            <template #default="scope">
              {{ getAllAddressName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="运送时长(天)" prop="days" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                icon="edit"
                @click="editRow(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                class="danger"
                icon="delete"
                @click="deleteRow(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination-new
          style="position: absolute; bottom: 2rem;"
          :current-page="currentPage"
          :page-size="10"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-drawer>
    <el-dialog
      v-model="isShowAddArea"
      width="30vw"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditForm ? '编辑地区' : '添加地区'"
      @close="closeAddArea"
    >
      <el-form
        ref="ruleAddAreaForms"
        :model="addAreaForm"
        :rules="addAreaRule"
      >
        <el-form-item label="指定地区" prop="addresses">
          <el-cascader
            v-model="getAddAreaCodeList"
            collapse-tags
            placeholder="请选择地区"
            :props="getAreaOption(true)"
            @change="handleAddAreaChange"
          />
        </el-form-item>
        <el-form-item label="运送时长" prop="days">
          <el-input
            v-model="addAreaForm.days"
            type="number"
            min="0"
            placeholder="运送时长"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="padding: 2rem">
          <el-button type="primary" @click="saveAreaForm">保存</el-button>
          <el-button @click="closeAddArea">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getAllAddressName } from '_c/FreightTemplate/data'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addAreaRule } from '_c/FreightTemplate/rules'
import { DeliveryDuration } from '_c/FreightTemplate/types'
import { fetch } from '_@/axios-config/axios'
import { emptyDeliveryDuration } from '_c/FreightTemplate/data'
import {
  addDeliveryDuration,
  deleteDeliveryDuration,
  editDeliveryDuration,
  getDeliveryDuration
} from '_c/FreightTemplate/api'
const isTableLoading = ref<Boolean>(false)
const tableData = ref([])
const total = ref<Number>(0)
const currentPage = ref<Number>(1)

onMounted(() => {
  getData()
})

// 是否显示设置配送时长的弹窗
const isShowSettingPanel = ref<Boolean>(false)

// 设置配送时长
const setFreightDuration = () => {
  isShowSettingPanel.value = !isShowSettingPanel.value
}

// 分页查询
const getData = async () => {
  isTableLoading.value = true
  const res: any = await getDeliveryDuration({
    size: 20,
    current: currentPage.value
  })
  if (res && res.code === 0) {
    tableData.value = res.data.records
    total.value = res.data.total
    isTableLoading.value = false
  }
}

// 分页查询下一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getData()
}

const ruleAddAreaForms = ref('')
const addAreaForm = ref<DeliveryDuration>()
// 编辑或新增表单
const isEditForm = ref<Boolean>(false)
// 是否显示添加地区的弹窗
const isShowAddArea = ref<Boolean>(false)

// 添加地区
const addArea = () => {
  isShowAddArea.value = !isShowAddArea.value
  addAreaForm.value = JSON.parse(JSON.stringify(emptyDeliveryDuration))
  isEditForm.value = false
}

// 编辑地区
const editRow = (row: any) => {
  isShowAddArea.value = !isShowAddArea.value
  addAreaForm.value = JSON.parse(JSON.stringify(row))
  isEditForm.value = true
}

// 删除地区
const deleteRow = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除该条规则, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleteDeliveryDuration(row.id)
    if (res && res.code === 0) {
      ElMessage.success('删除成功！')
      closeAddArea()
      await getData()
    }
  }).catch(e => {})
}

// 保存添加地区的表单
const saveAreaForm = () => {
  const forms: any = unref(ruleAddAreaForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (isEditForm.value) {
        // 编辑表单
        const res: any = await editDeliveryDuration(addAreaForm.value as DeliveryDuration)
        if (res && res.code === 0) {
          ElMessage.success('编辑成功！')
          closeAddArea()
          await getData()
        }
      } else {
        // 新增表单
        const res: any = await addDeliveryDuration(addAreaForm.value as DeliveryDuration)
        if (res && res.code === 0) {
          ElMessage.success('新增成功！')
          closeAddArea()
          await getData()
        }
      }
    }
  })
}

// 关闭添加地区的弹窗
const closeAddArea = () => {
  isShowAddArea.value = false
  isEditForm.value = false
  addAreaForm.value = JSON.parse(JSON.stringify(emptyDeliveryDuration))
}

// 显示所选指定地区(多选)
const getAddAreaCodeList = computed(() => {
  const all = addAreaForm.value?.addresses
  const result: number[][] = []
  all?.forEach((item: any) => {
    const areaCode = item.code + ''
    const province = parseInt(areaCode.substring(0, 2))
    const city = parseInt(areaCode.substring(0, 4))
    const full = parseInt(areaCode)
    const temp = []
    if (areaCode.length >= 2) temp.push(province)
    if (areaCode.length >= 4) temp.push(city)
    if (areaCode.length >= 6) temp.push(full)
    result.push(temp)
  })
  return result
})

// 选择指定地区(多选)
const handleAddAreaChange = (e: any) => {
  const result: { name: string; code: any; }[] = []
  e.forEach((item: any) => {
    let address = ''
    provinceList.value.forEach((item2: any) => {
      if (item2.value === item['0'] && item2.label) {
        address += item2.label
      }
    })
    cityList.value.forEach((item2: any) => {
      if (item2.value === item['1'] && item2.label) {
        address += ' ' + item2.label
      }
    })
    regionList.value.forEach((item2: any) => {
      if (item2.value === item['2'] && item2.label) {
        address += ' ' + item2.label
      }
    })
    const addressObj = {
      name: address,
      code: item['2'] ? item['2'] : item['1'] ? item['1'] : item['0']
    }
    result.push(addressObj)
  })
  addAreaForm.value?.addresses?.splice(0, addAreaForm.value?.addresses.length)
  addAreaForm.value?.addresses?.push(...result)
}

// 省
const provinceList = ref([
  {
    children: [] as any
  }
])

// 市
const cityList = ref([
  {
    children: [] as any
  }
])

// 区
const regionList = ref([
  {
    children: [] as any
  }
])

// 选择发货地区
const getAreaOption = (multiple = false) => {
  return {
    lazy: true,
    multiple: multiple,
    checkStrictly: multiple, // 单选时必须选到省-市-区
    lazyLoad: async (node: any, resolve: any) => {
      const { level } = node
      const nodes = [] as any
      if (level === 0) {
        await fetch({
          url: `/basic/region/province`,
          method: 'get'
        }).then((res: any) => {
          res.data?.forEach((item: any) => {
            nodes.push({
              value: item.agencyId,
              label: item.name,
              areaCode: item.agencyId,
              leaf: false,
              children: [] as any
            })
          })
        })
        provinceList.value = nodes
        resolve(nodes)
      } else if (level === 1) {
        await fetch({ url: `/basic/region/regionTree/${node.data.areaCode}`, method: 'get' }).then(
          (res: any) => {
            res.data.forEach((item: any) => {
              nodes.push({
                value: item.agencyId,
                label: item.name,
                areaCode: item.agencyId,
                leaf: false
              })
            })
            cityList.value = nodes
            resolve(nodes)
          }
        )
      } else if (level === 2) {
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
            regionList.value = nodes
            resolve(nodes)
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 40rem;
  height: 20rem;
  padding: 2rem;
  margin-right: 5rem;
  box-shadow: var(--el-box-shadow-light) !important;

  .card-header{
    justify-content: space-between;

    .title {
      font-size: 2rem;
      font-weight: bold;
    }
  }

  .card-content {
    width: 100%;
    height: 5rem;

    .content {
      line-height: 3rem;
      color: #666;
    }
  }

  .rules-radio {
    padding-top: .5rem;
    margin-top: 2rem;
  }
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
