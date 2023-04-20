<template>
  <el-form
    ref="formDom"
    :rules="rules"
    :model="formData.val"
    class="flex_form"
    :label-position="labelPosition"
    label-width="10rem"
  >
    <el-form-item
      v-for="(item,index) in formSetting"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :style="{
        width: item.width,
      }"
    >
      <el-input
        v-if="item.type =='text'"
        v-model="formData.val[item.prop]"
        :disabled="item.disabled"
        :placeholder="item.disabled?'':''"
        :maxlength="item.maxlength"
        :show-word-limit="item.maxlength?true:false"
      />
      <el-input
        v-if="item.type=='textarea'"
        v-model="formData.val[item.prop]"
        type="textarea"
        :autosize="{ minRows: 2}"
      />
      <!-- 日期：年 -->
      <el-date-picker
        v-if="item.type=='year'"
        v-model="formData.val[item.prop]"
        type="year"
        :placeholder="'请选择'"
        format="yyyy年"
        style="width:100%"
        :clearable="item.clearable"
      />
      <!-- 日期：月 -->
      <el-date-picker
        v-if="item.type=='month'"
        v-model="formData.val[item.prop]"
        type="month"
        :placeholder="'请选择'"
        format="yyyy年MM月"
        :clearable="item.clearable"
        style="width:100%"
      />
      <!-- 日期：日 -->
      <el-date-picker
        v-if="item.type=='date'"
        v-model="formData.val[item.prop]"
        format="yyyy 年 MM 月 dd 日"
        type="date"
        :placeholder="'请选择'"
        :clearable="item.clearable"
        style="width:100%"
      />
      <!-- 日期：开始日期 -->
      <el-date-picker
        v-if="item.type=='startDate'"
        v-model="formData.val[item.prop]"
        :picker-options="startOption(item.dateProp)"
        format="yyyy 年 MM 月 dd 日"
        type="date"
        :placeholder="'请选择'"
        :clearable="item.clearable"
      />
      <!-- 日期：结束日期 -->
      <el-date-picker
        v-if="item.type=='endDate'"
        v-model="formData.val[item.prop]"
        :picker-options="endOption(item.dateProp)"
        format="yyyy 年 MM 月 dd 日"
        type="date"
        :placeholder="'请选择'"
        :clearable="item.clearable"
      />
      <!-- 下拉树 -->
      <!-- <el-cascader
            v-if="item.type=='selectTree'"
            :clearable="item.clearable"
            placeholder="请选择"
            v-model="formData.val[item.prop]"
            :options="item.data"
            :props="{
                expandTrigger: 'hover',
                value: 'code',
                label: 'name',
            }"
            >
            </el-cascader> -->
      <!-- 下拉选择 -->
      <el-select
        v-if="item.type=='select'"
        v-model="formData.val[item.prop]"
        :popper-append-to-body="false"
        placeholder="请选择"
        :clearable="item.clearable"
      >
        <el-option
          v-for="(opt,index) in (enumObj[item.enumKey] || [])"
          :key="index"
          :label="opt.text"
          :value="opt.id"
        />
      </el-select>
      <!-- 单选 -->
      <el-radio-group
        v-if="item.type=='radio'"
        v-model="formData.val[item.prop]"
      >
        <el-radio
          v-for="(opt,index) in (enumObj[item.enumKey] || [])"
          :key="index"
          :label="opt.code"
        >{{ opt.name }}</el-radio>
      </el-radio-group>
      <!-- 多选 -->
      <el-checkbox-group
        v-if="item.type=='checkbox'"
        v-model="formData.val[item.prop]"
      >
        <el-checkbox label="复选框 A" />
        <el-checkbox label="复选框 B" />
        <!-- <el-checkbox-button
                v-for="(opt) in (enumObj[item.enumKey] || [])"
                :key="opt"
                :label="opt.name"
                ></el-checkbox-button> -->
      </el-checkbox-group>
      <el-switch
        v-if="item.type=='switch'"
        v-model="formData.val[item.prop]"
        active-value="1"
        inactive-value="0"
      />
      <!-- 附件上传 -->
      <uploadImage
        v-if="item.type=='upload'"
        v-model="formData.val[item.prop]"
        :max-count="1"
      />
      <!-- 选人树 -->
      <selectPerson v-if="item.type=='selectTree'" v-model="formData.val.employee" @visible="visibleStatus">
        <template #header>
          <div class="other-person">
            <div class="add-person">
              <el-input
                v-model="formData.val.employee.employeeName"
                placeholder="请选择"
                readonly
                :suffix-icon="suffixIcon"
              />
            </div>
          </div>
        </template>
      </selectPerson>
      <!-- 详细地址 -->
      <template v-if="item.type=='address'">
        <el-row :gutter="5" style="width:calc(100%)">
          <el-col :span="11">
            <el-select
              v-model="formData.val.provinceCode"
              style="width:calc(100%)"
              clearable
              placeholder="省份"
            >
              <el-option
                v-for="item in province"
                :key="item.agencyId"
                :label="item.name"
                :value="item.agencyId"
              />
            </el-select>
          </el-col>-
          <el-col :span="11">
            <!-- <el-select style="width:calc(100% - 5px)" clearable v-model="formData.val.cityCode" placeholder="州/市">
                            <el-option
                                v-for="item in cityList"
                                :key="item.agencyId"
                                :label="item.name"
                                :value="item.agencyId">
                            </el-option>
                        </el-select> -->
            <el-cascader
              v-model="formData.val.areaCode"
              style="width:calc(100% - 5px)"
              :options="cityList"
              :props="props"
              placeholder="州/市(区/县)"
              @change="handelChangeCity"
            />
          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="24"><el-input v-model="formData.val[item.prop]" placeholder="" /></el-col>
        </el-row>
      </template>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { FormSetting } from '../config/FormSetting'
import { defineComponent, ref, inject, provide, nextTick, watch, reactive, onMounted, toRefs } from 'vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import { getProvince, getCity } from '_@/api/order'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
export default defineComponent({
  components: {
    uploadFile
  },
  setup() {
    const dialogVisible = inject('dialogVisible') as any
    const enumObj:any = inject('enumObj')
    const formData:any = inject('formData')
    const formSetting:Array<FormSetting>|any = inject('formSetting')
    const rules = ref(inject('formRules'))
    const options = reactive({})
    const suffixIcon = ref(ArrowDown)
    const props:any = ref({
      label: 'name',
      value: 'agencyId'
    })
    // let cityArr:any = inject('cityArr')
    watch(() => dialogVisible, (newVal) => {
      // dialog显示,清除form验证
      if (newVal && newVal.value) {
        if (formDom.value && formDom.value) {
          // console.log('clear');
          formDom.value.clearValidate()
        }
      }
    }, { immediate: true, deep: true })

    // 验证数据
    const formDom:any = ref(null)
    async function valid() {
      const res = await formDom.value.validate().then((valid:any) => {
        return valid
      }).catch(() => {
        throw new Error('表单验证失败！')
      })
      return res
    }
    // 判断是否为数字
    const changeNum = (data:any) => {
      if (typeof (data) !== 'number') {
        return Number(data)
      }
      return data
    }
    const province:any = ref([])
    const cityList:any = ref([])
    // 获取市
    const getCityList = async (agencyId: any) => {
      if (formData.val.provinceCode != formData.val.provinceCode_) {
        formData.val.cityCode = ''
      } else {
        formData.val.cityCode = formData.val.cityCode_
        formData.val.areaCode = formData.val.areaCode_
      }
      const res = await getCity(agencyId)
      cityList.value = res.data || []
    }
    const handelChangeCity = (row: object) => {
      formData.val.cityArr = row
      formData.val.cityCode = row[0]
      formData.val.areaCode = row[1]
    }
    const visibleStatus = (flag:boolean) => {
      if (flag) {
        suffixIcon.value = ArrowUp
      } else {
        suffixIcon.value = ArrowDown
      }
    }
    watch(() => formData.val.provinceCode, (newv, oldv) => {
      nextTick(() => {
        if (newv != oldv) {
          getCityList(newv)
        }
      })
    }, { deep: true, immediate: true })
    onMounted(async() => {
      const res = await getProvince()
      province.value = res.data || []
    })
    return {
      enumObj,
      formSetting,
      formData,
      rules,
      formDom,
      valid,
      changeNum,
      province,
      cityList,
      getCityList,
      visibleStatus,
      suffixIcon,
      props,
      handelChangeCity
    }
  }
})
</script>

<style lang="less" scoped>
.flex_form{
    .el-form-item{
        &:first-child{
            margin-top: 5rem !important;
        }
    }
}
</style>
