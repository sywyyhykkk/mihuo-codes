<template>
  <div style="margin-top: 10px">
    <div style="height: 60vh;overflow-y: scroll">
      <el-form ref="productSaleForm" :model="dataValue" label-width="120px" style="width:calc( 100% - 150px)"
               size="small">
        <el-form-item label="赠送积分">
          <el-input v-model="dataValue.giftPoint" />
        </el-form-item>
        <el-form-item label="赠送成长值">
          <el-input v-model="dataValue.giftGrowth" />
        </el-form-item>
        <el-form-item label="积分购买限制">
          <el-input v-model="dataValue.usePointLimit" />
        </el-form-item>

        <el-form-item label="预告商品">
          <el-switch
            v-model="dataValue.previewStatus"
            :active-value="1"
            :inactive-value="0"
            :active-color="buttonType==='warning'?'#fd6d34':''"
          />
        </el-form-item>
        <!--      <el-form-item label="商品上架">-->
        <!--        <el-switch-->
        <!--          v-model="dataValue.publishStatus"-->
        <!--          :active-value="1"-->
        <!--          :inactive-value="0"-->
        <!--          :active-color="buttonType==='warning'?'#fd6d34':''"-->
        <!--        />-->
        <!--      </el-form-item>-->
        <el-form-item label="商品推荐">
          <span style="margin-right: 10px">新品</span>
          <el-switch
            v-model="dataValue.newStatus"
            :active-value="1"
            :inactive-value="0"
            :active-color="buttonType==='warning'?'#fd6d34':''"
          />
          <span style="margin-left: 10px;margin-right: 10px">推荐</span>
          <el-switch
            v-model="dataValue.recommandStatus"
            :active-value="1"
            :inactive-value="0"
            :active-color="buttonType==='warning'?'#fd6d34':''"
          />
        </el-form-item>
        <el-form-item label="热卖">
          <el-switch
            v-model="dataValue.hotsaleStatus"
            :active-value="1"
            :inactive-value="0"
            :active-color="buttonType==='warning'?'#fd6d34':''"
          />
        </el-form-item>
        <!--      <el-form-item label="服务保证">-->
        <!--        <el-checkbox-group v-model="selectServiceList">-->
        <!--          <el-checkbox :label="1">无忧退货</el-checkbox>-->
        <!--          <el-checkbox :label="2">快速退款</el-checkbox>-->
        <!--          <el-checkbox :label="3">免费包邮</el-checkbox>-->
        <!--        </el-checkbox-group>-->
        <!--      </el-form-item>-->
        <el-form-item label="详细页标题">
          <el-input v-model="dataValue.detailTitle" />
        </el-form-item>

        <el-form-item label="商品关键字">
          <!--        <el-input v-model="value.keywords" />-->
          <el-select
            v-model="keywordsFormat"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入可选关键字"
          >
            <el-option
              v-for="item in inputOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品备注">
          <el-input v-model="dataValue.note" type="textarea" :auto-size="true" />
        </el-form-item>
        <!--      <el-form-item label="选择优惠方式">-->
        <!--        <el-radio-group v-model="dataValue.promotionType" size="small">-->
        <!--          <el-radio-button :label="0">无优惠</el-radio-button>-->
        <!--          <el-radio-button :label="1">特惠促销</el-radio-button>-->
        <!--          <el-radio-button :label="2">会员价格</el-radio-button>-->
        <!--          <el-radio-button :label="3">阶梯价格</el-radio-button>-->
        <!--          <el-radio-button :label="4">满减价格</el-radio-button>-->
        <!--        </el-radio-group>-->
        <!--      </el-form-item>-->
        <el-form-item v-show="dataValue.promotionType===1">
          <div>
            开始时间：
            <el-date-picker
              v-model="dataValue.promotionStartTime"
              type="datetime"
              :picker-options="pickerOptions1"
              placeholder="选择开始时间"
            />
          </div>
          <div class="littleMargin">
            结束时间：
            <el-date-picker
              v-model="dataValue.promotionEndTime"
              type="datetime"
              :picker-options="pickerOptions1"
              placeholder="选择结束时间"
            />
          </div>
          <div class="littleMargin">
            促销价格：
            <el-input v-model="dataValue.promotionPrice" style="width: 220px" placeholder="输入促销价格" />
          </div>

        </el-form-item>
        <el-form-item v-show="dataValue.promotionType===2">
          <div v-for="(item, index) in dataValue.memberPriceList" :class="{littleMargin:index!==0}">
            {{ item.memberLevelName }}：
            <el-input v-model="item.memberPrice" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item v-show="dataValue.promotionType===3">
          <el-table stripe :data="dataValue.productLadderList"
                    style="width: 80%"
                    border
          >
            <el-table-column
              label="数量"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-input v-model="scope.row.count" />
              </template>
            </el-table-column>
            <el-table-column
              label="折扣"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-input v-model="scope.row.discount" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作" fixed="right"
            >
              <template #default="scope">
                <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-show="dataValue.promotionType===4">
          <el-table stripe :data="dataValue.productFullReductionList"
                    style="width: 80%"
                    border
          >
            <el-table-column
              label="满"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-input v-model="scope.row.fullPrice" />
              </template>
            </el-table-column>
            <el-table-column
              label="立减"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-input v-model="scope.row.reducePrice" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作" fixed="right"
            >
              <template #default="scope">
                <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>
    </div>
    <div style="text-align: center;width: 100%;margin-top: 2.2rem;position: absolute;">
      <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
      <el-button :type="buttonType" class="btn-add" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref, watchEffect } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }, protType: { //	type=1平台分类，type=2企业分类,type=3运营
      type: Number,
      default: 2
    }, companyId: { // 企业编号(type=2必传)
      type: Number || String,
      default: 0
    }, buttonType: {
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {
    const ruleForms = ref<any>('')
    const state = reactive({
      keywordsFormat: props.modelValue.keywords ? props.modelValue.keywords.split(',') : [],
      inputOptions: [],
      dataValue: props.modelValue,
      selectServiceList: ''
    })
    // const rules = reactive({
    //   name: [
    //     { required: true, message: '请输入商品名称', trigger: 'blur' },
    //     { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    //   ],
    //   subTitle: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
    //   productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
    //   brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
    //   description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
    //   requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
    //
    // })
    const handleNext = () => {
      // state.value.detailDesc = JSON.stringify(state.detailDesc)
      state.dataValue.keywords = state.keywordsFormat.toString()
      // console.log(state.dataValue)
      emit('nextStep')
    }
    const handlePrev = () => {
      state.dataValue.keywords = state.keywordsFormat.toString()
      emit('prevStep')
    }

    return {
      // rules,
      ruleForms,
      handleNext,
      handlePrev,
      ...toRefs(state)
    }
  }
})

</script>

<style scoped>
.littleMargin {
  margin-top: 10px;
}

</style>
