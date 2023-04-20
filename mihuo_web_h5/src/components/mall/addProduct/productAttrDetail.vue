<template>
  <div style="margin-top: 10px">
    <div style="height: 60vh; overflow-y: scroll">
      <el-form
        ref="ruleForms"
        :model="dataValue"
        :rules="rules"
        label-width="120px"
        style="width: calc(100% - 15rem)"
        size="small"
      >
        <el-form-item label="属性类型" prop="productAttributeCategoryId">
          <el-select
            v-model="dataValue.productAttributeCategoryId"
            placeholder="请选择属性类型"
            filterable
            @change="handleProductAttrChange2"
          >
            <el-option
              v-for="item in productAttributeCategoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dataValue.productAttributeCategoryId"
          label="商品规格"
          prop="skuStockList"
        >
          <div style="padding-top:1rem">
            <div v-for="(productAttr, idx) in selectProductAttr">
              {{ productAttr.name }}：
              <el-checkbox-group
                v-if="productAttr.handAddStatus === 0"
                v-model="selectProductAttr[idx].values"
              >
                <el-checkbox
                  v-for="item in getInputListArr(productAttr.inputList)"
                  :key="item"
                  :label="item"
                  class="littleMarginLeft"
                />
              </el-checkbox-group>
              <div v-else>
                <el-checkbox-group v-model="selectProductAttr[idx].values">
                  <div style="width: 100%">
                    <div
                      v-for="(item, index) in selectProductAttr[idx].options"
                      style="display: inline-block"
                      class="littleMarginLeft"
                    >
                      <el-checkbox :key="item" :label="item" />
                      <el-button
                        type="text"
                        class="danger"
                        style="margin-left: 1rem"
                        @click="handleRemoveProductAttrValue(idx, index)"
                      >删除
                      </el-button>
                    </div>
                  </div>
                </el-checkbox-group>
                <el-input
                  v-model="selectProductAttr[idx].addProductAttrValue"
                  style="width: 19rem; margin-left: 10px"
                  clearable
                />
                <el-button
                  class="littleMarginLeft"
                  @click="handleAddProductAttrValue(idx)"
                >增加
                </el-button>
              </div>
            </div>
          </div>
          <el-table
            stripe
            style="
              width: 100vw;
              margin-top: 20px;
              height: 30rem !important;
              max-height: 40rem !important;"
            :data="dataValue.skuStockList"
            height="auto"
            border
          >
            <el-table-column
              v-for="(item, index) in selectProductAttr"
              :key="item.id"
              :label="item.name"
              align="center"
              width="200"
            >
              <template #default="scope">
                <!--                {{ getProductSkuSp(scope.row, index) }}-->
                <!--                {{ scope.row['key' + (index + 1)] }}-->
                <el-input v-model="scope.row['key' + (index + 1)]" style="width: 18rem;" />
              </template>
            </el-table-column>
            <!--            <el-table-column label="规格属性" align="center">-->
            <!--              <template #default="scope">-->
            <!--                <el-table-column v-for="item in JSON.parse(scope.row.spData)" :label="item.key" align="center">-->
            <!--                  <template >-->
            <!--                    {{ item.value }}-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                &lt;!&ndash;                {{ getProductSkuSp(scope.row, index) }}&ndash;&gt;-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="销售价格" width="115px" align="center">
              <template #default="scope">
                <input v-model="scope.row.price" type="number" class="inputStyle">
              </template>
            </el-table-column>
            <el-table-column label="商品库存" width="110px" align="center">
              <template #default="scope">
                <input v-model="scope.row.stock" type="number" class="inputStyle">
              </template>
            </el-table-column>
            <el-table-column label="库存预警值" width="110px" align="center">
              <template #default="scope">
                <input v-model="scope.row.lowStock" type="number" class="inputStyle">
              </template>
            </el-table-column>
            <el-table-column label="转换系数" align="center" width="110px">
              <template #default="scope">
                <input v-model="scope.row.convertValue" type="number" class="inputStyle">
              </template>
            </el-table-column>
            <el-table-column label="SKU编号" width="140px" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.skuCode" disabled style="width: 12rem" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-if="scope.$index!==dataValue.skuStockList.length -1"
                  icon="sortDown"
                  type="text"
                  @click="bubbleSku(scope.$index, scope.row,1)"
                />
                <el-button
                  v-if="scope.$index!==0"
                  icon="sortUp"
                  type="text"
                  @click="bubbleSku(scope.$index, scope.row,2)"
                />
                <el-button
                  type="text"
                  icon="delete"
                  class="danger"
                  @click="handleRemoveProductSku(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            :type="buttonType"
            style="margin-top: 20px"
            class="btn-add"
            @click="handleRefreshProductSkuList"
          >刷新列表
          </el-button>
          <el-button
            :type="buttonType"
            style="margin-top: 20px"
            class="btn-add"
            @click="handleSyncProductSkuPrice"
          >同步价格
          </el-button>
          <el-button
            :type="buttonType"
            style="margin-top: 20px"
            class="btn-add"
            @click="handleSyncProductSkuStock"
          >同步库存
          </el-button>
        </el-form-item>
        <el-form-item label="是否商城材料">
          <el-switch
            v-model="dataValue.materialFlag"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item v-if="dataValue.materialFlag==0" label="商品参数">
          <div>
            <div
              v-for="(item, index) in selectProductParam"
              :class="{ littleMarginTop: index !== 0 }"
            >
              <div class="paramInputLabel">{{ item.name }}:</div>
              <el-select
                v-if="item.inputType === 1"
                v-model="selectProductParam[index].value"
                class="paramInput"
              >
                <el-option
                  v-for="item in getParamInputList(item.inputList)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-input
                v-else
                v-model="selectProductParam[index].value"
                class="paramInput"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <uploadImage
            v-model="dataValue.coverImg"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item v-if="dataValue.materialFlag==0" label="商品相册" prop="albumPics">
          <uploadImage
            v-model="dataValue.albumPics"
            :max-count="5"
            :is-edits="isEdit"
          />
        </el-form-item>
        <el-form-item v-if="dataValue.materialFlag==0" label="banner图" prop="bannerImg">
          <uploadImage
            v-model="dataValue.bannerImg"
            :max-count="1"
            :is-edits="isEdit"
          />
        </el-form-item>

        <el-form-item label="详细页描述" prop="detailDesc">
          <!--        <title-add v-model="value.detailDesc" title="添加描述项" />-->
          <richText
            :key="1"
            v-model="dataValue.detailDesc"
            platform-type="2"
            :company-id="companyId"
          />
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center; width: 100%; margin-top: 2.2rem;position: absolute;">
      <el-button
        size="medium"
        @click="handlePrev"
      >上一步，填写商品促销
      </el-button>
      <el-button
        v-if="dataValue.customCategory == '1001'"
        :type="buttonType"
        class="btn-add"
        size="medium"
        @click="handleFinishCommit"
      >
        完成，提交信息
      </el-button>
      <!--        服务有施工信息、服务包没有施工信息（老版） v-if="dataValue.customCategory=='1002'"-->
      <!--        服务、服务包都要有施工信息（1.1）-->
      <el-button
        v-if="dataValue.customCategory != '1001'"
        :type="buttonType"
        class="btn-add"
        size="medium"
        @click="handleNext"
      >
        下一步，填写施工信息
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetch } from '_@/axios-config/axios'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import titleAdd from '_c/mall/addProduct/titleAdd.vue'
import richText from '_c/AppTextEdit/index.vue'

// import multiUpload from '@/components/Upload/multiUpload.vue'

interface StateMoudel {
  id: any
  name: string
  handAddStatus: any
  inputList: any
  values: any
  options: any
}

export default defineComponent({
  components: { uploadFile, titleAdd, richText },
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    protType: {
      //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    },
    companyId: {
      // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    },
    buttonType: {
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const rules = reactive({
      productAttributeCategoryId: [
        { required: true, message: '请选择商品属性', trigger: 'blur' }
        // { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
      ],
      skuStockList: [{ required: true, message: '请选择或输入商品sku', trigger: 'blur' }],
      productCategoryId: [{ required: true, message: '请选择商品企业分类', trigger: 'blur' }],
      albumPics: [{ required: true, message: '请添加商品相册', trigger: 'blur' }],
      bannerImg: [{ required: true, message: '请添加banner图', trigger: 'blur' }],
      coverImg: [{ required: true, message: '请添加封面图', trigger: 'blur' }],
      detailDesc: [{ required: true, message: '详细页描述必填', trigger: 'blur' }]
    })
    const state = reactive({
      productAttrStatus: true,
      dataValue: props.modelValue,
      // 选中的商品属性
      selectProductAttr: [
        {
          id: '',
          name: '',
          handAddStatus: '',
          inputList: [],
          values: [],
          options: [] as any,
          addProductAttrValue: ''
        }
      ],
      isEdit: props.isEdit,
      // 编辑模式时是否初始化成功
      hasEditCreated: false,
      // 商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      // 选中的商品参数
      selectProductParam: [],
      // 选中的商品属性图片
      selectProductAttrPics: [],
      // 可手动添加的商品属性
      addProductAttrValue: '',
      // 商品富文本详情激活类型
      activeHtmlName: 'pc',
      // 商品相册
      albumPics: ''
    })

    // 冒泡排序
    const bubbleSku = (index: any, row: any, type: any) => {
      if (type === 1) {
        state.dataValue.skuStockList[index]['sort']++
        state.dataValue.skuStockList[index + 1]['sort']--
      }
      if (type === 2) {
        state.dataValue.skuStockList[index]['sort']--
        state.dataValue.skuStockList[index - 1]['sort']++
      }
      const arr: any = state.dataValue.skuStockList
      let l: any = arr.length
      while (l) {
        for (let j = 0; j < l; j++) {
          var left = arr[j]['sort'] as any
          var right = arr[j + 1]['sort'] as any
          var leftData = arr[j]
          var rightData = arr[j + 1]
          if (left > right) {
            arr[j] = rightData
            arr[j + 1] = leftData
          }
        }
        l--
      }
      state.dataValue.skuStockList = JSON.parse(JSON.stringify(arr))
    }
    const handleFinishCommit = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.dataValue.skuStockList)
          var skuStockList: any = state.dataValue.skuStockList
          skuStockList.map((res: any) => {
            var spData: any = JSON.parse(res.spData).spData ? JSON.parse(res.spData).spData : JSON.parse(res.spData)
            spData.map((res2: any, index: any) => {
              if ((index + 1) <= state.selectProductAttr.length) {
                res2['value'] = res['key' + (index + 1)]
              } else {
                spData.splice(index, spData.length)
              }
            })
            res.spData = JSON.stringify(spData)
          })
          console.log(state.dataValue.skuStockList)
          mergeProductAttrValue()
          emit('finishCommit')
        } else {
          alert('请把信息填写完整')
        }
      })
    }
    const handlePrev = () => {
      emit('prevStep')
    }
    const getInputListArr = (inputList: any) => {
      return inputList.split(',')
    }
    const getParamInputList = (inputList: any) => {
      return inputList.split(',')
    }

    // const calcDescartes = (array: any) => {
    //   if (array.length < 2) return array[0] || []
    //   var data: any = []
    //   return data.reduce.call(array, (col: any, set: any) => {
    //     var res: any = []
    //     col.forEach((c: any) => {
    //       set.forEach((s: any) => {
    //         var t: any = []
    //         t.concat(Array.isArray(c) ? c : [c])
    //         t.push(s)
    //         res.push(t)
    //       })
    //     })
    //     return res
    //   })
    // }

    const refreshProductSkuList = () => {
      state.dataValue.skuStockList = []
      const skuList = state.dataValue.skuStockList
      console.log(state.selectProductAttr)
      // 只有一个属性时
      if (state.selectProductAttr.length === 1) {
        const attr = state.selectProductAttr[0]
        for (let i = 0; i < attr.values.length; i++) {
          skuList.push({
            key1: attr.values[i],
            spData: JSON.stringify([{ key: attr.name, value: attr.values[i] }])
          })
        }
      } else if (state.selectProductAttr.length === 2) {
        const attr0 = state.selectProductAttr[0]
        const attr1 = state.selectProductAttr[1]
        console.log(attr0, attr1)
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              key1: attr0.values[i],
              spData: JSON.stringify([
                { key: attr0.name, value: attr0.values[i] }
              ])
            })
            continue
          }
          for (let j = 0; j < attr1.values.length; j++) {
            const spData = []
            spData.push({ key: attr0.name, value: attr0.values[i] })
            spData.push({ key: attr1.name, value: attr1.values[j] })
            skuList.push({
              key1: attr0.values[i],
              key2: attr1.values[j],
              spData: JSON.stringify(spData)
            })
          }
        }
      } else {
        const attr0 = state.selectProductAttr[0]
        const attr1 = state.selectProductAttr[1]
        const attr2 = state.selectProductAttr[2]
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              key1: attr0.values[i],
              spData: JSON.stringify([
                { key: attr0.name, value: attr0.values[i] }
              ])
            })
            continue
          }
          for (let j = 0; j < attr1.values.length; j++) {
            if (attr2.values.length === 0) {
              const spData = []
              spData.push({ key: attr0.name, value: attr0.values[i] })
              spData.push({ key: attr1.name, value: attr1.values[j] })
              skuList.push({
                key1: attr0.values[i],
                key2: attr1.values[j],
                spData: JSON.stringify(spData)
              })
              continue
            }
            for (let k = 0; k < attr2.values.length; k++) {
              const spData = []
              spData.push({ key: attr0.name, value: attr0.values[i] })
              spData.push({ key: attr1.name, value: attr1.values[j] })
              spData.push({ key: attr2.name, value: attr2.values[k] })
              skuList.push({
                key1: attr0.values[i],
                key2: attr1.values[j],
                key3: attr2.values[k],
                spData: JSON.stringify(spData)
              })
            }
          }
        }
      }
      skuList.map((res: any, index: any) => {
        res.sort = index + 1
        res.convertValue = 1
      })
      console.log(skuList)
    }
    // 获取商品相关属性的图片
    const getProductSkuPic = (name: any) => {
      for (let i = 0; i < state.dataValue.skuStockList.length; i++) {
        const spData = JSON.parse(state.dataValue.skuStockList[i].spData)
        if (name === spData[0].value) {
          return state.dataValue.skuStockList[i].pic
        }
      }
      return null
    }
    const refreshProductAttrPics = () => {
      const selectProductAttrPics = []
      if (state.selectProductAttr.length >= 1) {
        const values = state.selectProductAttr[0].values
        for (let i = 0; i < values.length; i++) {
          var pic = null
          if (state.isEdit) {
            // 编辑状态下获取图片
            pic = getProductSkuPic(values[i])
          }
          selectProductAttrPics.push({ name: values[i], pic: pic })
        }
        state.selectProductAttrPics = selectProductAttrPics as any
      }
    }
    const handleRefreshProductSkuList = () => {
      ElMessageBox.confirm(
        '刷新列表将导致sku信息重新生成，是否要刷新',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        refreshProductAttrPics()
        refreshProductSkuList()
      })
    }
    const handleSyncProductSkuPrice = () => {
      ElMessageBox.confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (
          state.dataValue.skuStockList !== null &&
          state.dataValue.skuStockList.length > 0
        ) {
          const tempSkuList = state.dataValue.skuStockList
          const price = state.dataValue.skuStockList[0].price
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].price = price
          }
          state.dataValue.skuStockList = []
          state.dataValue.skuStockList = state.dataValue.skuStockList.concat(
            state.dataValue.skuStockList,
            tempSkuList
          )
        }
      })
    }
    const handleSyncProductSkuStock = () => {
      ElMessageBox.confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (
          state.dataValue.skuStockList !== null &&
          state.dataValue.skuStockList.length > 0
        ) {
          // let tempSkuList = []
          const tempSkuList = state.dataValue.skuStockList
          const stock = state.dataValue.skuStockList[0].stock
          const lowStock = state.dataValue.skuStockList[0].lowStock
          for (let i = 0; i < tempSkuList.length; i++) {
            tempSkuList[i].stock = stock
            tempSkuList[i].lowStock = lowStock
          }
          state.dataValue.skuStockList = []
          state.dataValue.skuStockList = state.dataValue.skuStockList.concat(
            state.dataValue.skuStockList,
            tempSkuList
          )
        }
      })
    }
    const getProductSkuSp = (row: any, index: number) => {
      const spData = JSON.parse(row.spData)
      if (spData != null && index < spData.length) {
        return spData[index].value
      } else {
        return null
      }
    }
    const hasAttrPic = () => {
      if (state.selectProductAttrPics.length < 1) {
        return false
      }
      return true
    }

    const handleAddProductAttrValue = (idx: any) => {
      state.selectProductAttr.forEach((res: any) => {
        res.values = []
      })
      const options: any = state.selectProductAttr[idx].options
      if (!state.selectProductAttr[idx].addProductAttrValue) {
        ElMessage.warning({
          message: '属性值不能为空',
          type: 'warning'
        })
        return
      }
      if (
        options.indexOf(state.selectProductAttr[idx].addProductAttrValue) !== -1
      ) {
        ElMessage.warning({
          message: '属性值不能重复',
          type: 'warning'
        })
        return
      }
      state.selectProductAttr[idx].options.push(
        state.selectProductAttr[idx].addProductAttrValue
      )

      state.selectProductAttr[idx].addProductAttrValue = ''
    }
    const handleRemoveProductAttrValue = (idx: number, index: number) => {
      state.selectProductAttr[idx].options.splice(index, 1)
    }
    // 获取属性的值
    const getEditParamValue = (id: any) => {
      for (
        let i = 0;
        i < state.dataValue.productAttributeValueList.length;
        i++
      ) {
        if (
          id === state.dataValue.productAttributeValueList[i].productAttributeId
        ) {
          return state.dataValue.productAttributeValueList[i].value
        }
      }
    }
    const handleEditCreated = () => {
      // 根据商品属性分类id获取属性和参数
      if (state.dataValue.productAttributeCategoryId != null) {
        handleProductAttrChange()
      }
      state.hasEditCreated = true
    }
    const handleProductAttrChange = () => {
      state.productAttrStatus = true
      getProductAttrList(0)
      getProductAttrList(1)
    }
    const handleProductAttrChange2 = () => {
      state.productAttrStatus = false
      getProductAttrList(0)
      getProductAttrList(1)
      state.dataValue.skuStockList = []
    }
    const getProductAttrList = async (type: number) => {
      await fetch({
        url:
          ' /mall/productattribute/list/' +
          state.dataValue.productAttributeCategoryId +
          '/' +
          type,
        method: 'get'
      }).then((res: any) => {
        const list = res.data
        if (type === 0) {
          var selectProductAttr = []
          for (let i = 0; i < list.length; i++) {
            var options = []
            var values = []
            if (state.isEdit && state.productAttrStatus) {
              if (list[i].handAddStatus === 1) {
                // console.log(getEditAttrOptions(list[i].id))
                // 编辑状态下获取手动添加编辑属性
                options = getEditAttrOptions(list[i].id) as any
              }
              // 编辑状态下获取选中属性
              values = getEditAttrValues(i) as any
            }

            selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              // values: Array.from(new Set([...options,...values])),
              values: values,
              options: Array.from(new Set([...options, ...values])) as any
            })
          }
          state.selectProductAttr = selectProductAttr as any
          if (state.isEdit) {
            // 编辑模式下刷新商品属性图片
            refreshProductAttrPics()
          }
        } else {
          var selectProductParam = []
          for (let i = 0; i < list.length; i++) {
            let value = []
            if (state.isEdit) {
              // 编辑模式下获取参数属性
              value = getEditParamValue(list[i].id)
            }
            selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList
            })
          }
          state.selectProductParam = selectProductParam as any
        }
      })
    }
    // 获取设置的可手动添加属性值
    const getEditAttrOptions = (id: any) => {
      const options = []
      for (let i = 0; i < state.dataValue.productAttributeValueList.length; i++) {
        const attrValue = state.dataValue.productAttributeValueList[i]
        if (attrValue.productAttributeId === id) {
          const strArr = attrValue.value.split(',')
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j])
          }
          break
        }
      }
      return options
    }
    // 获取选中的属性值
    const getEditAttrValues = (index: any) => {
      var values = new Set()
      if (index === 0) {
        for (let i = 0; i < state.dataValue.skuStockList.length; i++) {
          var sku = state.dataValue.skuStockList[i]
          var spData = JSON.parse(sku.spData)
          if (spData != null && spData.length >= 1) {
            values.add(spData[0].value)
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < state.dataValue.skuStockList.length; i++) {
          var sku = state.dataValue.skuStockList[i]
          var spData = JSON.parse(sku.spData)
          if (spData != null && spData.length >= 2) {
            values.add(spData[1].value)
          }
        }
      } else {
        for (let i = 0; i < state.dataValue.skuStockList.length; i++) {
          var sku = state.dataValue.skuStockList[i]
          var spData = JSON.parse(sku.spData)
          if (spData != null && spData.length >= 3) {
            values.add(spData[2].value)
          }
        }
      }
      return Array.from(values)
    }
    const handleNext = () => {
      ruleForms.value.validate((valid: any) => {
        if (valid) {
          console.log(state.dataValue.skuStockList)
          var skuStockList: any = state.dataValue.skuStockList
          skuStockList.map((res: any) => {
            var spData: any = JSON.parse(res.spData)
            spData.map((res2: any, index: any) => {
              res2['value'] = res['key' + (index + 1)]
            })
            res.spData = JSON.stringify(spData)
          })
          console.log(state.dataValue.skuStockList)
          emit('nextStep')
        }
      })
    }
    const getcommodityType = async () => {
      await fetch({
        url: `/mall/productattributecategory/list/${props.protType}`,
        method: 'get'
      }).then((res: any) => {
        state.productAttributeCategoryOptions = res.data
      })
    }
    const getOptionStr = (arr: any) => {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += arr[i]
        if (i != arr.length - 1) {
          str += ','
        }
      }
      return str
    }
    // 合并商品属性
    const mergeProductAttrValue = () => {
      state.dataValue.productAttributeValueList = []
      for (let i = 0; i < state.selectProductAttr.length; i++) {
        const attr: any = state.selectProductAttr[i]
        if (
          attr.handAddStatus === 1 &&
          attr.options != null &&
          attr.options.length > 0
        ) {
          const list = {
            productAttributeId: attr.id,
            value: getOptionStr(attr.options)
          }
          state.dataValue.productAttributeValueList.push(list)
        }
      }
      for (let i = 0; i < state.selectProductParam.length; i++) {
        const param: any = state.selectProductParam[i]
        const list2 = {
          productAttributeId: param.id,
          value: param.value
        }
        state.dataValue.productAttributeValueList.push(list2)
      }
    }
    // const productId = () => {
    //   return state.value.id
    // }
    const productId = (newValue: any) => {
      if (!state.isEdit) return
      if (state.hasEditCreated) return
      if (newValue === undefined || newValue == null || newValue === 0) return
      handleEditCreated()
    }
    const handleRemoveProductSku = (index: any, row: any) => {
      const list = state.dataValue.skuStockList
      if (list.length === 1) {
        list.pop()
      } else {
        list.splice(index, 1)
      }
    }
    // watchEffect(() => {
    //   handleEditCreated()
    //   // 增加监听事件
    // })
    onMounted(() => {
      if (state.dataValue.skuStockList) {
        var skuStockList: any = state.dataValue.skuStockList
        skuStockList.map((res: any, index: any) => {
          if (typeof JSON.parse(res.spData) === 'string') {
            res.spData = JSON.parse(res.spData)
          }
          if (JSON.parse(res.spData).spData) {
            res.spData = JSON.stringify(JSON.parse(res.spData).spData)
          }
          res.sort = index + 1
          JSON.parse(res.spData).map((res2: any, index2: any) => {
            res['key' + (index2 + 1)] = res2.value
          })
        })
        console.log(state.dataValue.skuStockList)
      }
      handleEditCreated()
      getcommodityType()
    })

    return {
      rules,
      ruleForms,
      bubbleSku,
      getInputListArr,
      getParamInputList,
      handleFinishCommit,
      handlePrev,
      getcommodityType,
      handleProductAttrChange,
      handleProductAttrChange2,
      getEditAttrOptions,
      getEditAttrValues,
      getProductAttrList,
      handleRefreshProductSkuList,
      refreshProductAttrPics,
      refreshProductSkuList,
      handleAddProductAttrValue,
      handleRemoveProductAttrValue,
      handleSyncProductSkuStock,
      handleSyncProductSkuPrice,
      getProductSkuSp,
      hasAttrPic,
      getProductSkuPic,
      getEditParamValue,
      handleRemoveProductSku,
      handleEditCreated,
      mergeProductAttrValue,
      productId,
      getOptionStr,
      handleNext,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.inputStyle {
  width: 9rem;
  height: 3.6rem;
  border: 0.1rem solid #e4e7ed;
  padding-left: 0.5rem;
  background: #ffffff;
  border-radius: 0.4rem
}

input:focus-visible {
  border: solid 0.1rem @mainColor !important;
  border-radius: 0.4rem;
  outline: none;
}

.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
