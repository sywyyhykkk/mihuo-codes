<template>
  <el-form
    ref="formDom"
    :rules="rules"
    :model="formData.val"
    class="flex_form-item"
    :label-position="labelPosition"
    label-width="16rem"
  >
    <el-form-item label="企业名称" prop="companyName">
      <el-input v-model="formData.val.companyName" />
    </el-form-item>
    <el-form-item label="法人姓名" prop="legalPerson">
      <el-input v-model="formData.val.legalPerson" />
    </el-form-item>
    <el-form-item label="企业地址">
      <el-row :gutter="5" style="width:calc(100%)">
        <el-col :span="12">
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
        </el-col>
        -
        <el-col :span="11">
          <el-cascader
            v-model="formData.val.areaCode"
            style="width:calc(100% + 1rem)"
            :options="cityList"
            :props="props"
            placeholder="州/市(区/县)"
            @change="handelChangeCity"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="法人手机号码" prop="legalPhone">
      <el-input
        v-model.number="formData.val.legalPhone"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </el-form-item>
    <el-form-item label="" prop="completeAddress">
      <el-input v-model="formData.val.completeAddress" />
    </el-form-item>
    <el-form-item label="法人证件类型" prop="identityType">
      <el-select
        v-model="formData.val.identityType"
        :popper-append-to-body="false"
        placeholder="请选择"
      >
        <el-option
          v-for="(opt,index) in (enumObj.cardType)"
          :key="index"
          :label="opt.text"
          :value="opt.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="认证类型" prop="authType">
      <el-select
        v-model="formData.val.authType"
        :popper-append-to-body="false"
        placeholder="请选择"
      >
        <el-option
          v-for="(opt,index) in (enumObj.authType)"
          :key="index"
          :label="opt.text"
          :value="opt.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="法人证件号码" prop="legalIds">
      <el-input v-model="formData.val.legalIds" />
    </el-form-item>
    <el-form-item v-if="formData.val.authType == '2'" label="统一社会信用代码" prop="uniCredit">
      <el-input v-model="formData.val.uniCredit" />
    </el-form-item>
    <el-form-item v-if="formData.val.authType == '1'" label="营业执照号" prop="businessLicense">
      <el-input v-model="formData.val.businessLicense" />
    </el-form-item>
    <el-form-item label="证件有效日期" prop="beginEnd">
      <el-date-picker
        v-model="formData.val.beginEnd"
        type="daterange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
      />
    </el-form-item>

    <el-form-item v-if="formData.val.authType == '1'" label="组织机构代码证号" prop="organizationCode">
      <el-input v-model="formData.val.organizationCode" />
    </el-form-item>
    <el-form-item label="企业对公账户" prop="accountNo">
      <el-input v-model="formData.val.accountNo" type="tel" oninput="value=value.replace(/[^0-9.]/g, '')" />
    </el-form-item>
    <el-form-item v-if="formData.val.authType == '1'" label="税务登记证号" prop="taxRegister">
      <el-input v-model="formData.val.taxRegister" />
    </el-form-item>
    <el-form-item label="开户银行名称" prop="parentBankName">
      <el-select
        v-model="formData.val.parentBankName"
        :popper-append-to-body="false"
        placeholder="请选择"
        filterable
      >
        <el-option
          v-for="(opt,index) in (enumObj.bankType)"
          :key="index"
          :label="opt.text"
          :value="opt.text"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="formData.val.authType == '1'?'营业执照号到期时间':'统一社会信用代码到期时间'" prop="expLicense">
      <el-date-picker
        v-model="formData.val.expLicense"
        type="date"
        :placeholder="'请选择'"
        value-format="YYYY-MM-DD HH:mm:ss"
        clearable
        style="width:100%"
      />
    </el-form-item>

    <el-form-item label="开户行支行名称" prop="bankName" class="bankName-only">
      <!-- <el-tree-select v-model="formData.val.bankName" :data="bankNameTree" lazy :load="load" :props="propsDefaut" /> -->
      <!-- <el-input v-model="formData.val.bankName"></el-input> -->
      <sub-branch v-model="formData.val.bankName" @nodeClick="selectChange" @visible="visibleStatus">
        <template #header>
          <div class="bankName-only_div">
            <el-input
              v-model="formData.val.bankName"
              placeholder="请选择"
              readonly
              :suffix-icon="suffixIcon"
            />
          </div>
        </template>
      </sub-branch>
    </el-form-item>
    <!-- <el-form-item label="联系人" prop="contactName">
        <el-input v-model="formData.val.contactName"></el-input>
    </el-form-item> -->
    <el-form-item label="联系电话" prop="telephone">
      <el-input
        v-model.number="formData.val.telephone"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </el-form-item>
    <el-form-item label="支付行号" prop="unionBank">
      <el-input v-model="formData.val.unionBank" readonly />
    </el-form-item>
    <el-divider class="divider" direction="vertical" />
  </el-form>
</template>

<script lang="ts">
import { FormSetting } from './config/FormSetting'
import { defineComponent, ref, inject, provide, nextTick, watch, reactive, onMounted, toRefs } from 'vue'
import Upload from './Upload.vue'
import uploadFile from '_c/UploadFile/uploadImage.vue'
import { getProvince, getCity } from '_@/api/order'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { fetch } from '_@/axios-config/axios'

export default defineComponent({
  components: {
    Upload,
    uploadFile
  },
  setup() {
    const dialogVisible = inject('dialogVisible') as any
    const enumObj: any = inject('enumObj')
    const formData: any = inject('formData')
    const formSetting: Array<FormSetting> | any = inject('formSetting')
    const rules = ref(inject('formRules'))
    const options = reactive({})
    const suffixIcon = ref(ArrowDown)
    const props: any = ref({
      label: 'name',
      value: 'agencyId'
    })
    const status: any = inject('status')
    const dateChange = (row: any) => {
      console.log(row)
      formData.val.identityBeginDate = row[0]
      formData.val.identityEndDate = row[1]
    }
    const propsDefaut = {
      label: 'label',
      children: 'children',
      isLeaf: 'isLeaf'
    }
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
    const formDom: any = ref(null)

    async function valid() {
      const res = await formDom.value.validate().then((valid: any) => {
        return valid
      }).catch(() => {
        throw new Error('表单验证失败！')
      })
      return res
    }

    // 判断是否为数字
    const changeNum = (data: any) => {
      if (typeof (data) !== 'number') {
        return Number(data)
      }
      return data
    }
    const province: any = ref([])
    const cityList: any = ref([])
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
      formData.val.cityCode = row[0]
      formData.val.areaCode = row[1]
    }
    const visibleStatus = (flag: boolean) => {
      if (flag) {
        suffixIcon.value = ArrowUp
      } else {
        suffixIcon.value = ArrowDown
      }
    }
    // 获取银行支行好
    const selectChange = (data: any) => {
      formData.val.unionBank = data.unionBank
    }

    watch(() => formData.val.provinceCode, (newv, oldv) => {
      nextTick(() => {
        if (newv != oldv) {
          getCityList(newv)
        }
      })
    }, { deep: true, immediate: true })
    watch(() => formData.val, (newv) => {
      nextTick(() => {
        if (newv.parentBankName) {
          if (formDom.value && formDom.value) {
            formDom.value.clearValidate(['parentBankName'])
          }
        }
        if (newv.bankName) {
          if (formDom.value && formDom.value) {
            formDom.value.clearValidate(['bankName'])
          }
        }
      })
    }, { deep: true, immediate: true })
    onMounted(async () => {
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
      handelChangeCity,
      dateChange,
      status,
      selectChange
    }
  }
})
</script>

<style lang="less" scoped>
.flex_form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row wrap;
  width: 100%;
  padding-right: 3.5rem;
  box-sizing: border-box;
  padding-bottom: 2.2rem;
  position: relative;

  ::v-deep .el-divider--vertical {
    position: absolute;
    top: 2.5rem;
    left: calc(50% - 2rem);
    height: calc(100% - 5rem) !important;
    margin: 0 2rem
  }

  .el-form-item {
    width: calc(50% - 3rem);
    margin-bottom: 0 !important;
  }
}

.bankName-only {
  .bankName-only_div {
    .el-input {
      width: calc(100%) !important;
    }
  }
}
</style>
