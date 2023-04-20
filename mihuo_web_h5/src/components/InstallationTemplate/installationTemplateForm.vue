<template>
  <div style="padding-right: 2rem;">
    <el-form
      ref="ruleForms"
      :model="dataForm"
      :rules="dataRule"
      label-width="15rem"
      :disabled="!isEdit && !isAdd"
    >
      <el-form-item label="模版名称" prop="templateName">
        <el-input
          v-model="dataForm.templateName"
          placeholder="请输入模版名称"
        />
      </el-form-item>
      <!-- ========== 入户/安装费 ========== -->
      <el-form-item label="入户/安装费设置" prop="installationMode">
        <el-radio-group
          v-model="dataForm.installationMode"
          :disabled="isView"
          @change="onChangeInstallationMode"
        >
          <el-radio
            :label="1"
            border
            size="large"
          >记件收费</el-radio>
          <el-radio
            :label="2"
            border
            size="large"
          >固定费用
          </el-radio>
          <el-radio
            :label="3"
            border
            size="large"
          >免入户/安装费
          </el-radio>
          <el-radio
            :label="4"
            border
            size="large"
          >自定义协商
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.installationMode === 1 || dataForm.installationMode === 2"
        label="默认入户/安装费"
        prop="installationFirst"
      >
        <el-input
          v-if="dataForm.installationMode === 1"
          v-model="dataForm.installationFirst.firstAmount"
          type="number"
          placeholder="请输入默认入户/安装费"
        >
          <template #prepend>每件</template>
          <template #append>元</template>
        </el-input>
        <el-input
          v-if="dataForm.installationMode === 2"
          v-model="dataForm.installationFirst.fixedAmount"
          type="number"
          placeholder="请输入默认固定入户/安装费"
        >
          <template #prepend>固定费用</template>
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.installationMode === 4"
        label="自定义协商内容"
        prop="installationFirst"
      >
        <el-input
          v-model="dataForm.installationFirst.protocol"
          type="textarea"
          autosize
          maxlength="300"
          placeholder="请输入自定义协商内容"
        />
      </el-form-item>
      <el-form-item v-if="dataForm.installationMode === 1 || dataForm.installationMode === 2" label="指定地区入户/安装费">
        <el-button
          type="primary"
          plain
          :disabled="!isEdit && !isAdd"
          @click="addArea(1)"
        >添加地区</el-button>
        <el-table
          stripe
          style="height: 30rem !important; margin-top: 2rem;"
          :data="dataForm.installationSecond"
          height="100%"
          border
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="指定地区" prop="addresses">
            <template #default="scope">
              {{ getAllAddressName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="计费规则" prop="caseRule">
            <template #default="scope">
              {{ getRules(scope.row, 1) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                plain
                :disabled="!isEdit && !isAdd"
                @click="editAddAreaForm(scope.row, 1, scope.$index)"
              >编辑</el-button>
              <el-button
                plain
                size="small"
                :disabled="!isEdit && !isAdd"
                @click="deleteAddAreaForm(scope.row, 1, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- ========== 上楼费设置 ========== -->
      <el-form-item label="上楼费设置" prop="stairwayMode">
        <el-radio-group
          v-model="dataForm.stairwayMode"
          :disabled="isView"
          @change="onChangeStairwayMode"
        >
          <el-radio
            :label="1"
            border
            size="large"
          >记件收费</el-radio>
          <el-radio
            :label="2"
            border
            size="large"
          >固定费用
          </el-radio>
          <el-radio
            :label="3"
            border
            size="large"
          >免上楼费
          </el-radio>
          <el-radio
            :label="4"
            border
            size="large"
          >自定义协商
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.stairwayMode === 1 || dataForm.stairwayMode === 2"
        label="默认上楼费"
        prop="stairwayFirst"
      >
        <el-input
          v-if="dataForm.stairwayMode === 1"
          v-model="dataForm.stairwayFirst.firstAmount"
          type="number"
          placeholder="请输入默认上楼费"
        >
          <template #prepend>每件每层</template>
          <template #append>元</template>
        </el-input>
        <el-input
          v-if="dataForm.stairwayMode === 2"
          v-model="dataForm.stairwayFirst.fixedAmount"
          type="number"
          placeholder="请输入默认固定上楼费"
        >
          <template #prepend>固定费用</template>
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.stairwayMode === 4"
        label="自定义协商内容"
        prop="stairwayFirst"
      >
        <el-input
          v-model="dataForm.stairwayFirst.protocol"
          type="text"
          placeholder="请输入自定义协商内容"
        />
      </el-form-item>
      <el-form-item v-if="dataForm.stairwayMode === 1 || dataForm.stairwayMode === 2" label="指定地区上楼费">
        <el-button
          type="primary"
          plain
          :disabled="!isEdit && !isAdd"
          @click="addArea(2)"
        >添加地区</el-button>
        <el-table
          stripe
          style="height: 30rem !important; margin-top: 2rem;"
          :data="dataForm.stairwaySecond"
          height="100%"
          border
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="指定地区" prop="addresses">
            <template #default="scope">
              {{ getAllAddressName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="计费规则" prop="caseRule">
            <template #default="scope">
              {{ getRules(scope.row, 2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                plain
                :disabled="!isEdit && !isAdd"
                @click="editAddAreaForm(scope.row, 2, scope.$index)"
              >编辑</el-button>
              <el-button
                plain
                size="small"
                :disabled="!isEdit && !isAdd"
                @click="deleteAddAreaForm(scope.row, 2, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="isEdit || isAdd">
        <el-button type="primary" @click="saveForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- ========== 添加地区弹窗 ========== -->
    <el-dialog
      v-model="isShowAddArea"
      width="45vw"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditAddAreaForm ? '编辑地区' : '添加地区'"
      @close="closeAddArea"
    >
      <div v-if="currentFormLevel === 1" style="padding: 2rem">
        <el-form
          ref="ruleAddAreaForms"
          :model="installationSecond"
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
          <el-form-item
            v-if="dataForm.installationMode === 1"
            label="入户/安装费"
            prop="caseRule"
          >
            <el-input
              v-model="installationSecond.caseRule.firstAmount"
              type="number"
              placeholder="请输入入户/安装费"
            >
              <template #prepend>每件</template>
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if=" dataForm.installationMode === 2"
            label="入户/安装费"
            prop="caseRule"
          >
            <el-input
              v-model="installationSecond.caseRule.fixedAmount"
              type="number"
              placeholder="请输入固定入户/安装费"
            >
              <template #prepend>固定费用</template>
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="currentFormLevel === 2" style="padding: 2rem">
        <el-form
          ref="ruleAddAreaForms"
          :model="stairwaySecond"
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
          <el-form-item
            v-if="dataForm.stairwayMode === 1"
            label="上楼费"
            prop="caseRule"
          >
            <el-input
              v-model="stairwaySecond.caseRule.firstAmount"
              type="number"
              placeholder="请输入上楼费"
            >
              <template #prepend>每件每层</template>
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="dataForm.stairwayMode === 2"
            label="上楼费"
            prop="caseRule"
          >
            <el-input
              v-model="stairwaySecond.caseRule.fixedAmount"
              type="number"
              placeholder="请输入固定上楼费"
            >
              <template #prepend>固定费用</template>
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
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
import { PropType } from 'vue'
import { getAllAddressName } from '_c/FreightTemplate/data'
import { emptySecondRule, emptyTemplate } from '_c/InstallationTemplate/data'
import { dataRule, addAreaRule } from '_c/InstallationTemplate/rules'
import { InstallationTemplate, SecondRule, Address } from '_c/InstallationTemplate/types'
import { addInstallationTemplate, editInstallationTemplate } from '_c/InstallationTemplate/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'

const emit = defineEmits(['getData', 'hideDialog'])
const props = defineProps({
  row: {
    type: Object as PropType<InstallationTemplate>,
    default: () => emptyTemplate
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isView: {
    type: Boolean,
    default: false
  },
  isAdd: {
    type: Boolean,
    default: false
  }
})

const ruleForms = ref<any>('')
const dataForm = ref<InstallationTemplate>({
  templateId: props.row?.templateId,
  templateName: props.row?.templateName,
  installationMode: props.row?.installationMode,
  stairwayMode: props.row?.stairwayMode,
  installationFirst: props.row?.installationFirst,
  installationSecond: props.row?.installationSecond,
  stairwayFirst: props.row?.stairwayFirst,
  stairwaySecond: props.row?.stairwaySecond
})

// 保存模版表单
const saveForm = () => {
  const forms: any = unref(ruleForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      if (props.isEdit) {
        // 编辑表单
        const res: any = await editInstallationTemplate(dataForm.value)
        if (res && res.code === 0) {
          dataForm.value = JSON.parse(JSON.stringify(emptyTemplate))
          ElMessage.success('新增模版成功！')
          emit('getData')
          emit('hideDialog')
        }
      } else {
        // 新增表单
        const res: any = await addInstallationTemplate(dataForm.value)
        if (res && res.code === 0) {
          dataForm.value = JSON.parse(JSON.stringify(emptyTemplate))
          ElMessage.success('新增模版成功！')
          emit('getData')
          emit('hideDialog')
        }
      }
    }
  })
}

const cancel = () => {
  emit('getData')
  emit('hideDialog')
  dataForm.value = JSON.parse(JSON.stringify(emptyTemplate))
}

const isShowAddArea = ref<Boolean>(false)
// 是否是编辑添加地区表单
const isEditAddAreaForm = ref<Boolean>(false)
// 指定地区入户/安装费表单
const installationSecond = ref<SecondRule>(emptySecondRule)
// 指定地区上楼费表单
const stairwaySecond = ref<SecondRule>(emptySecondRule)
// 当前添加的表单类型
const currentFormLevel = ref<Number>(0)
const currentEditFormIndex = ref<Number>(-1)
const ruleAddAreaForms = ref<any>('')

// 添加地区
const addArea = (type: any) => {
  if (type === 1) {
    installationSecond.value = JSON.parse(JSON.stringify(emptySecondRule))
  } else {
    stairwaySecond.value = JSON.parse(JSON.stringify(emptySecondRule))
  }
  isShowAddArea.value = true
  isEditAddAreaForm.value = false
  currentFormLevel.value = type
}

// 关闭添加地区运费弹窗
const closeAddArea = () => {
  isShowAddArea.value = false
  currentFormLevel.value = 0
  // 将所有表单重置
  installationSecond.value = JSON.parse(JSON.stringify(emptySecondRule))
  stairwaySecond.value = JSON.parse(JSON.stringify(emptySecondRule))
}

// 保存添加地区表单
const saveAreaForm = () => {
  const forms: any = unref(ruleAddAreaForms)
  let newData: any[] = []
  const findAddresses: Address[] = []
  let newAddresses: Address[] = []
  const index = currentEditFormIndex.value as number
  forms.validate((valid: Boolean) => {
    if (valid) {
      if (isEditAddAreaForm.value) {
        if (currentEditFormIndex.value < 0) {
          ElMessage.error('无法找到对应数据')
          return
        }
        switch (currentFormLevel.value) {
          case 1:
            newData = JSON.parse(JSON.stringify(dataForm.value?.installationSecond))
            newData[index] = JSON.parse(JSON.stringify(installationSecond.value))
            if (JSON.stringify(newData[index]) !== JSON.stringify(dataForm.value.installationSecond![index])) {
              if (JSON.stringify(newData[index]) === JSON.stringify(dataForm.value.installationSecond![index].addresses!)) {
                for (const ele of dataForm.value.installationSecond![index].addresses!) {
                  for (const e of newData[index].addresses) {
                    if (Number(ele.code) === Number(e.code)) {
                      if (JSON.stringify(dataForm.value.installationSecond![index].caseRule!) === JSON.stringify(newData[index].caseRule)) {
                        findAddresses.push(ele)
                        ElMessage.warning(`该类型规则已有${ele.name}`)
                        return
                      }
                    }
                  }
                }
              }
            }
            if (findAddresses.length === 0) {
              dataForm.value.installationSecond = newData
            }
            break
          case 2:
            newData = JSON.parse(JSON.stringify(dataForm.value?.stairwaySecond))
            newData[index] = JSON.parse(JSON.stringify(stairwaySecond.value))
            if (JSON.stringify(newData[index]) !== JSON.stringify(dataForm.value.stairwaySecond![index])) {
              if (JSON.stringify(newData[index]) === JSON.stringify(dataForm.value.stairwaySecond![index].addresses!)) {
                for (const item of dataForm.value.stairwaySecond!) {
                  for (const ele of item.addresses!) {
                    for (const e of newData[index].addresses!) {
                      if (Number(ele.code) === Number(e.code)) {
                        // 如果名称相同，再判断规则是否相同
                        if (JSON.stringify(item.caseRule) === JSON.stringify(newData[index].caseRule)) {
                          findAddresses.push(ele)
                          ElMessage.warning(`该类型规则已有${ele.name}`)
                          return
                        }
                      }
                    }
                  }
                }
              }
            }
            if (findAddresses.length === 0) {
              dataForm.value.stairwaySecond = newData
            }
            break
          default:
            break
        }
      } else {
        // 新增地区
        switch (currentFormLevel.value) {
          case 1:
            newAddresses = installationSecond.value?.addresses as Address[]
            newAddresses.forEach((item: any) => {
              dataForm.value.installationSecond?.forEach((ele: any) => {
                ele.addresses.forEach((e: any) => {
                  if (Number(e.code) === item.code) {
                    findAddresses.push(e)
                    ElMessage.warning(`该类型规则已有${item.name}`)
                    return
                  }
                })
              })
            })
            if (findAddresses.length === 0) {
              dataForm.value.installationSecond?.push(installationSecond.value as SecondRule)
            }
            break
          case 2:
            newAddresses = stairwaySecond.value?.addresses as Address[]
            newAddresses.forEach((item: any) => {
              dataForm.value.stairwaySecond?.forEach((ele: any) => {
                ele.addresses.forEach((e: any) => {
                  if (Number(e.code) === item.code) {
                    findAddresses.push(e)
                    ElMessage.warning(`该类型规则已有${item.name}`)
                    return
                  }
                })
              })
            })
            if (findAddresses.length === 0) {
              dataForm.value.stairwaySecond?.push(stairwaySecond.value as SecondRule)
            }
            break
          default:
            break
        }
      }
      isShowAddArea.value = false
    }
  })
}

// 编辑列表规则项
const editAddAreaForm = (row: any, type: number, index: number) => {
  currentFormLevel.value = type
  switch (type) {
    case 1:
    // 指定地区运费 二级规则
      installationSecond.value = JSON.parse(JSON.stringify(dataForm.value?.installationSecond ? dataForm.value?.installationSecond[index] : {}))
      currentEditFormIndex.value = index
      break
    case 2:
    // 指定条件免运费 三级规则
      stairwaySecond.value = JSON.parse(JSON.stringify(dataForm.value?.stairwaySecond ? dataForm.value?.stairwaySecond[index] : {}))
      currentEditFormIndex.value = index
      break
    default:
      break
  }
  isShowAddArea.value = true
  isEditAddAreaForm.value = true
}

// 删除列表规则项
const deleteAddAreaForm = (row: any, type: number, index: number) => {
  ElMessageBox.confirm(`此操作将永久删除该条规则, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let oldData = []
    switch (type) {
      case 1:
        oldData = JSON.parse(JSON.stringify(dataForm.value.installationSecond as any))
        oldData.splice(index, 1)
        dataForm.value.installationSecond = oldData
        break
      case 2:
        oldData = JSON.parse(JSON.stringify(dataForm.value.stairwaySecond as any))
        oldData.splice(index, 1)
        dataForm.value.stairwaySecond = oldData
        break
      default:
        break
    }
  }).catch(e => {})
}

// 显示所选指定地区(多选)
const getAddAreaCodeList = computed(() => {
  let all
  switch (currentFormLevel.value) {
    case 1:
      all = installationSecond.value?.addresses
      break
    case 2:
      all = stairwaySecond.value?.addresses
      break
    default:
      break
  }
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
  const result: Address[] = []
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
    const addressObj: Address = {
      name: address,
      code: item['2'] ? item['2'] : item['1'] ? item['1'] : item['0']
    }
    result.push(addressObj)
  })
  switch (currentFormLevel.value) {
    case 1:
    installationSecond.value?.addresses?.splice(0, installationSecond.value?.addresses?.length)
    installationSecond.value?.addresses?.push(...result)
      break
    case 2:
    stairwaySecond.value?.addresses?.splice(0, stairwaySecond.value?.addresses?.length)
    stairwaySecond.value?.addresses?.push(...result)
      break
    default:
      break
  }
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

// 1=记件收费 2=固定费用 3=免入户/安装费 4=自定义协商
const modeToStr = {
  1: '记件收费',
  2: '固定费用'
}

const getRuleStr = (mode: any, type: number) => {
  return modeToStr[String(mode)]
}

const getAmount = (caseRule: any, type: number) => {
  let source
  if (type === 1) {
    source = dataForm.value.installationMode
  } else {
    source = dataForm.value.stairwayMode
  }
  switch (source) {
    case 1:
      // 计件费用
      return caseRule?.firstAmount
    case 2:
      // 固定费用
      return caseRule?.fixedAmount
    default:
      return 0
  }
}

// 获取规则描述
const getRules = (row: any, type: number) => {
  let result = ''
  if (type === 1) {
    // 入户/安装费
    if (dataForm.value.installationMode === 3 || dataForm.value.installationMode === 4) return modeToStr['installationMode'][String(dataForm.value.installationMode)]
    result = getRuleStr(dataForm.value.installationMode, 1) + '；默认收费：每件' + getAmount(row.caseRule, 1) + '元'
  } else {
    // 上楼费
    if (dataForm.value.stairwayMode === 3 || dataForm.value.stairwayMode === 4) return modeToStr['stairwayMode'][String(dataForm.value.stairwayMode)]
    result = getRuleStr(dataForm.value.stairwayMode, 2) + '；默认收费：每件每层' + getAmount(row.caseRule, 2) + '元'
  }
  return result
}

// 点击入户/安装费设置
const onChangeInstallationMode = (e: any) => {
  // 切换时清除地区列表
  if (dataForm.value.installationSecond?.length !== 0) {
    dataForm.value.installationSecond = []
  }
}

// 点击切换上楼费设置
const onChangeStairwayMode = (e: any) => {
  // 切换时清除地区列表
  if (dataForm.value.stairwaySecond?.length !== 0) {
    dataForm.value.stairwaySecond = []
  }
}

</script>

<style lang="less" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
