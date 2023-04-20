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
      <el-form-item label="发货地区" prop="address">
        <el-cascader
          v-model="getAreaCodeList"
          placeholder="请选择发货地区"
          :props="getAreaOption()"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="运费设置" prop="freightMode">
        <el-radio-group
          v-model="dataForm.freightMode"
          :disabled="isView"
          @change="onFreightModeChange"
        >
          <el-radio
            :label="1"
            border
            size="large"
          >阶梯计价</el-radio>
          <el-radio
            :label="2"
            border
            size="large"
          >固定运费
          </el-radio>
          <el-radio
            :label="3"
            border
            size="large"
          >卖家包邮
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
        v-show="dataForm.freightMode !== 3 && dataForm.freightMode !== 4"
        label="默认运费规则"
        prop="firstFreight"
      >
        <div v-if="dataForm.freightMode === 1">
          <el-input
            v-model="dataForm.firstFreight.firstCases"
            type="number"
            style="width: 12rem;"
            placeholder="起送件数"
          />
          <span style="margin: 0 1rem;">件以内，</span>
          <el-input
            v-model="dataForm.firstFreight.firstAmount"
            type="number"
            style="width: 12rem;"
            placeholder="起送金额"
          />
          <span style="margin: 0 1rem;">元，每增加</span>
          <el-input
            v-model="dataForm.firstFreight.secondCases"
            type="number"
            style="width: 12rem;"
            placeholder="增加件数"
          />
          <span style="margin: 0 1rem;">件，增加</span>
          <el-input
            v-model="dataForm.firstFreight.secondAmount"
            type="number"
            style="width: 12rem;"
            placeholder="增加金额"
          />
          <span style="margin: 0 1rem;">元</span>
        </div>
        <el-input
          v-if="dataForm.freightMode === 2"
          v-model="dataForm.firstFreight.fixedAmount"
          type="number"
          placeholder="固定运费"
        >
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item v-show="dataForm.freightMode !== 3 && dataForm.freightMode !== 4" label="指定地区运费">
        <el-button
          type="primary"
          plain
          :disabled="!isEdit && !isAdd"
          @click="addArea(2)"
        >添加地区</el-button>
        <el-table
          stripe
          style="height: 30rem !important; margin-top: 2rem;"
          :data="dataForm.secondFreight"
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
              {{ getRules(scope.row) }}
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
      <el-form-item v-show="dataForm.freightMode !== 3 && dataForm.freightMode !== 4" label="指定条件免运费">
        <el-button
          type="primary"
          plain
          :disabled="!isEdit && !isAdd"
          @click="addArea(3)"
        >添加地区</el-button>
        <el-table
          stripe
          style="height: 30rem !important; margin-top: 2rem;"
          :data="dataForm.thirdFreight"
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
              {{ '金额满' + scope.row.minimumAmount + '元， 免除运费' }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                plain
                :disabled="!isEdit && !isAdd"
                @click="editAddAreaForm(scope.row, 3, scope.$index)"
              >编辑</el-button>
              <el-button
                plain
                size="small"
                :disabled="!isEdit && !isAdd"
                @click="deleteAddAreaForm(scope.row, 3, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="dataForm.freightMode !== 4" label="限制下单地区">
        <el-button
          type="primary"
          plain
          :disabled="!isEdit && !isAdd"
          @click="addArea(4)"
        >添加地区</el-button>
        <el-table
          stripe
          style="height: 30rem !important; margin-top: 2rem;"
          :data="dataForm.fourthFreight"
          height="100%"
          border
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="限制下单地区" prop="addresses">
            <template #default="scope">
              {{ getAllAddressName(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                plain
                size="small"
                :disabled="!isEdit && !isAdd"
                @click="deleteAddAreaForm(scope.row, 4, scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item
        v-show="dataForm.freightMode === 4"
        label="自定义协商"
        prop="firstFreight"
      >
        <el-input
          v-model="dataForm.firstFreight.protocol"
          type="textarea"
          autosize
          maxlength="300"
          placeholder="请输入自定义协商内容"
        />
      </el-form-item>
      <el-form-item v-if="isEdit || isAdd">
        <el-button type="primary" @click="saveForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="isShowAddArea"
      width="45vw"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="isEditAddAreaForm ? '编辑地区' : '添加地区'"
      @close="closeAddArea"
    >
      <div v-if="currentFormLevel === 2" style="padding: 2rem">
        <el-form
          ref="ruleAddAreaForms"
          :model="addSecondAreaForm"
          :rules="addAreaRule"
          label-width="12rem"
          inline
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
            label="运费规则"
            prop="caseRule"
          >
            <div v-show="dataForm.freightMode === 1">
              <el-input
                v-model="addSecondAreaForm.caseRule.firstCases"
                type="number"
                style="width: 10rem; margin-right: .5rem;"
                placeholder="起送件数"
              />
              <span>件以内，</span>
              <el-input
                v-model="addSecondAreaForm.caseRule.firstAmount"
                type="number"
                style="width: 10rem; margin-right: .5rem;"
                placeholder="起送金额"
              />
              <span>元，每增加</span>
              <el-input
                v-model="addSecondAreaForm.caseRule.secondCases"
                type="number"
                style="width: 10rem; margin-right: .5rem;"
                placeholder="增加件数"
              />
              <span>件，增加</span>
              <el-input
                v-model="addSecondAreaForm.caseRule.secondAmount"
                type="number"
                style="width: 10rem; margin-right: .5rem;"
                placeholder="增加金额"
              />
              <span>元</span>
            </div>
            <div v-show="dataForm.freightMode === 2">
              <el-input
                v-model="addSecondAreaForm.caseRule.fixedAmount"
                type="number"
                placeholder="固定金额"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="currentFormLevel === 3" style="padding: 2rem">
        <el-form
          ref="ruleAddAreaForms"
          :model="addThirdAreaForm"
          :rules="addAreaRule"
          label-width="12rem"
          inline
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
          <el-form-item label="满减金额" prop="minimumAmount">
            <el-input
              v-model="addThirdAreaForm.minimumAmount"
              type="number"
              placeholder="请输入满减金额"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="currentFormLevel === 4" style="padding: 2rem">
        <el-form
          ref="ruleAddAreaForms"
          :model="addFourthAreaForm"
          :rules="addAreaRule"
          label-width="12rem"
          inline
        >
          <el-form-item label="指定限制地区" prop="addresses">
            <el-cascader
              v-model="getAddAreaCodeList"
              collapse-tags
              placeholder="请选择地区"
              :props="getAreaOption(true)"
              @change="handleAddAreaChange"
            />
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
import { Address, FreightTemplate, SecondFreight, ThirdFreight } from '_c/FreightTemplate/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  emptyFourthFreight,
  emptySecondFreight,
  emptyTemplate,
  emptyThirdFreight,
  getAllAddressName
} from '_c/FreightTemplate/data'
import { addFreightTemplate, editFreightTemplate } from '_c/FreightTemplate/api'
import { addAreaRule, dataRule } from '_c/FreightTemplate/rules'
import { PropType } from 'vue'
import { fetch } from '_@/axios-config/axios'

const emit = defineEmits(['getData', 'hideDialog'])
const props = defineProps({
  row: {
    type: Object as PropType<FreightTemplate>,
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

const dataForm = ref<FreightTemplate>({
  templateId: props.row?.templateId,
  templateName: props.row?.templateName,
  freightMode: props.row?.freightMode,
  address: props.row?.address,
  firstFreight: props.row?.firstFreight,
  secondFreight: props.row?.secondFreight,
  thirdFreight: props.row?.thirdFreight,
  fourthFreight: props.row?.fourthFreight
})

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

// 保存发货地区
const handleChange = (e: any) => {
  let address = ''
  provinceList.value.forEach((item: any) => {
    if (item.value === e['0']) {
      address += item.label
    }
  })
  cityList.value.forEach((item: any) => {
    if (item.value === e['1']) {
      address += ' ' + item.label
    }
  })
  regionList.value.forEach((item: any) => {
    if (item.value === e['2']) {
      address += ' ' + item.label
    }
  })
  dataForm.value.address = {
    name: address,
    code: e['2']
  }
}

// 显示所选发货地区
const getAreaCodeList = computed(() => {
  const areaCode = dataForm.value.address.code + ''
  const province = parseInt(areaCode.substring(0, 2))
  const city = parseInt(areaCode.substring(0, 4))
  const full = parseInt(areaCode)
  return [province, city, full]
})

// 关闭弹窗
const cancel = () => {
  emit('getData')
  emit('hideDialog')
  dataForm.value = JSON.parse(JSON.stringify(emptyTemplate))
}

// 保存模版表单
const saveForm = () => {
  const forms: any = unref(ruleForms)
  forms.validate(async (valid: Boolean) => {
    if (valid) {
      // 验证通过
      if (props.isEdit) {
        // 修改模版
        const res: any = await editFreightTemplate(dataForm.value)
        if (res && res.code === 0) {
          dataForm.value = JSON.parse(JSON.stringify(emptyTemplate))
          ElMessage.success('编辑模版成功！')
          emit('getData')
          emit('hideDialog')
        }
      } else if (props.isAdd) {
        // 新增模版
        const res: any = await addFreightTemplate(dataForm.value)
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

const isShowAddArea = ref<Boolean>(false)
// 二级规则表单
const addSecondAreaForm = ref<SecondFreight>()
// 三级规则表单
const addThirdAreaForm = ref<ThirdFreight>()
// 四级规则表单
const addFourthAreaForm = ref<any>([])
const ruleAddAreaForms = ref<any>('')
const isEditAddAreaForm = ref<Boolean>(false)
const currentFormLevel = ref<Number>(0)
const currentEditFormIndex = ref<Number>(-1)

// 显示添加指定地区运费弹窗
const addArea = (type: number) => {
  currentFormLevel.value = type
  switch (type) {
    case 2:
    // 指定地区运费 二级规则
      addSecondAreaForm.value = JSON.parse(JSON.stringify(emptySecondFreight))
      break
    case 3:
    // 指定条件免运费 三级规则
      addThirdAreaForm.value = JSON.parse(JSON.stringify(emptyThirdFreight))
      break
    case 4:
    // 限制下单地区 四级规则
      addFourthAreaForm.value = JSON.parse(JSON.stringify(emptyFourthFreight))
      break
    default:
      break
  }
  isShowAddArea.value = true
  isEditAddAreaForm.value = false
}

// 点击切换运费设置
const onFreightModeChange = (e: number) => {
  dataForm.value.secondFreight = []
  dataForm.value.thirdFreight = []
  dataForm.value.fourthFreight = []
}

// 编辑列表规则项
const editAddAreaForm = (row: any, type: number, index: number) => {
  currentFormLevel.value = type
  switch (type) {
    case 2:
    // 指定地区运费 二级规则
      addSecondAreaForm.value = JSON.parse(JSON.stringify(dataForm.value?.secondFreight ? dataForm.value?.secondFreight[index] : {}))
      currentEditFormIndex.value = index
      break
    case 3:
    // 指定条件免运费 三级规则
      addThirdAreaForm.value = JSON.parse(JSON.stringify(dataForm.value?.thirdFreight ? dataForm.value?.thirdFreight[index] : {}))
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
    let newData; let oldData = []
    switch (type) {
      case 2:
        oldData = JSON.parse(JSON.stringify(dataForm.value.secondFreight as any))
        oldData.splice(index, 1)
        dataForm.value.secondFreight = oldData
        break
      case 3:
        oldData = JSON.parse(JSON.stringify(dataForm.value.thirdFreight as any))
        oldData.splice(index, 1)
        dataForm.value.thirdFreight = oldData
        break
      case 4:
        oldData = JSON.parse(JSON.stringify(dataForm.value.fourthFreight as any))
        newData = oldData?.filter((ele: any) => Number(ele.code) !== Number(row.code))
        dataForm.value.fourthFreight = newData
        break
      default:
        break
    }
  }).catch(e => {})
}

// 关闭添加地区运费弹窗
const closeAddArea = () => {
  isShowAddArea.value = false
  currentFormLevel.value = 0
  currentEditFormIndex.value = -1
  // 将所有表单重置
  addSecondAreaForm.value = JSON.parse(JSON.stringify(emptySecondFreight))
  addThirdAreaForm.value = JSON.parse(JSON.stringify(emptyThirdFreight))
  addFourthAreaForm.value = JSON.parse(JSON.stringify(emptyFourthFreight))
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
        // 编辑
        if (currentEditFormIndex.value < 0) {
          ElMessage.error('无法找到对应数据')
          return
        }
        switch (currentFormLevel.value) {
          case 2:
            newData = JSON.parse(JSON.stringify(dataForm.value?.secondFreight))
            newData[index] = JSON.parse(JSON.stringify(addSecondAreaForm.value))
            // 判断是否做了修改
            if (JSON.stringify(newData[index]) !== JSON.stringify(dataForm.value.secondFreight![index])) {
              // 再判断地址是否一样
              if (JSON.stringify(newData[index].addresses!) === JSON.stringify(dataForm.value.secondFreight![index].addresses)) {
                for (const ele of dataForm.value.secondFreight![index].addresses!) {
                  for (const e of newData[index].addresses) {
                    if (Number(ele.code) === Number(e.code)) {
                      // 如果名称相同，再判断规则是否相同
                      if (JSON.stringify(dataForm.value.secondFreight![index].caseRule) === JSON.stringify(newData[index].caseRule)) {
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
              dataForm.value.secondFreight = newData
            }
            break
          case 3:
            newData = JSON.parse(JSON.stringify(dataForm.value?.thirdFreight))
            newData[index] = JSON.parse(JSON.stringify(addThirdAreaForm.value))
            if (JSON.stringify(newData) !== JSON.stringify(dataForm.value.thirdFreight)) {
              if (JSON.stringify(newData[index].addresses!) === JSON.stringify(dataForm.value.thirdFreight![index].addresses)) {
                for (const ele of dataForm.value.thirdFreight![index].addresses!) {
                  for (const e of newData[index].addresses) {
                    if (Number(ele.code) === Number(e.code)) {
                      // 如果名称相同，再判断规则是否相同
                      if (JSON.stringify(dataForm.value.thirdFreight![index].minimumAmount) === JSON.stringify(newData[index].minimumAmount)) {
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
              dataForm.value.thirdFreight = newData
            }
            break
          default:
            break
        }
      } else {
        // 新增地区
        switch (currentFormLevel.value) {
          case 2:
            newAddresses = addSecondAreaForm.value?.addresses as Address[]
            newAddresses.forEach((item: any) => {
              dataForm.value.secondFreight?.forEach((ele: any) => {
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
              dataForm.value.secondFreight?.push(addSecondAreaForm.value as SecondFreight)
            }
            break
          case 3:
            // 指定条件免运费
            newAddresses = addThirdAreaForm.value?.addresses as Address[]
            newAddresses.forEach((item: any) => {
              dataForm.value.thirdFreight?.forEach((ele: any) => {
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
              dataForm.value.thirdFreight?.push(addThirdAreaForm.value as ThirdFreight)
            }
            break
          case 4:
            // 限制下单地区
            newAddresses = addFourthAreaForm.value
            newAddresses.forEach((item: any) => {
              const findItem = dataForm.value.fourthFreight?.find((ele: any) => Number(ele.code) === item.code)
              if (findItem) {
                findAddresses.push(findItem)
                ElMessage.warning(`该类型规则已有${findItem.name}`)
                return
              }
            })
            if (findAddresses.length === 0 && newAddresses.length !== 0) {
              dataForm.value.fourthFreight?.push(...addFourthAreaForm.value)
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
    case 2:
      addSecondAreaForm.value?.addresses?.splice(0, addSecondAreaForm.value?.addresses?.length)
      addSecondAreaForm.value?.addresses?.push(...result)
      break
    case 3:
      addThirdAreaForm.value?.addresses?.splice(0, addThirdAreaForm.value?.addresses?.length)
      addThirdAreaForm.value?.addresses?.push(...result)
      break
    case 4:
      addFourthAreaForm.value?.splice(0, addFourthAreaForm.value?.length)
      addFourthAreaForm.value?.push(...result)
      break
    default:
      break
  }
}

// 显示所选指定地区(多选)
const getAddAreaCodeList = computed(() => {
  let all
  switch (currentFormLevel.value) {
    case 2:
      all = addSecondAreaForm.value?.addresses
      break
    case 3:
      all = addThirdAreaForm.value?.addresses
      break
    case 4:
      all = addFourthAreaForm.value
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

// 获取规则描述
const getRules = (row: any) => {
  switch (dataForm.value.freightMode) {
    case 1:
      return row.caseRule.firstCases + '件以内，' + row.caseRule.firstAmount + '元，每增加' + row.caseRule.secondCases + '件，增加' + row.caseRule.secondAmount + '元'
    case 2:
      return '固定运费' + row.caseRule.fixedAmount + '元'
    default:
      return ''
  }
}
</script>

<style lang="less" scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
