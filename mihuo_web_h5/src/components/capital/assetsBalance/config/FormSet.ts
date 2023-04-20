import { FormSetting } from '../config/FormSetting'

let formSetting: Array<FormSetting> = [
  { label: '企业名称', prop: 'companyName', type: 'text', formatter: '', enumKey: '' },
  { label: '法人姓名', prop: 'legalPerson', type: 'text', formatter: '', enumKey: '' },
  { label: '企业地址', prop: 'address', type: 'address', formatter: '', enumKey: '' },
  { label: '法人手机号码', prop: 'legalPhone', type: 'text', formatter: '', enumKey: '' },
  { label: '', prop: 'completeAddress', type: 'text', formatter: '', enumKey: '' },
  { label: '法人证件类型', prop: 'identityType', type: 'select', formatter: '', enumKey: 'cardType' },
  { label: '认证类型', prop: 'authType', type: 'select', formatter: '', enumKey: 'authType' },
  { label: '法人证件号码', prop: 'legalIds', type: 'text', formatter: '', enumKey: '' },
  { label: ' 营业执照', prop: 'certificateImge', type: 'upload', formatter: '', enumKey: '' },
  { label: ' 证件正面', prop: 'legalIdcardFront', type: 'upload', formatter: '', enumKey: '' },
  { label: ' 组织机构代码证', prop: 'organizationCode', type: 'upload_show', formatter: '', enumKey: '' },
  { label: ' 证件反面', prop: 'legalIdcardBack', type: 'upload', formatter: '', enumKey: '' },
  { label: ' 税务登记证', prop: 'taxRegister', type: 'upload_show', formatter: '', enumKey: '' },
  { label: '统一社会信用/ 营业执照号到期时间', prop: 'expLicense', type: 'date', formatter: '', enumKey: '' },
  { label: '证件有效日期', prop: 'beginEnd', type: 'daterange', formatter: '', enumKey: '' },
  { label: '企业对公账户', prop: 'accountNo', type: 'text', formatter: '', enumKey: '' },
  { label: '联系人', prop: 'contactName', type: 'text', formatter: '', enumKey: '' },
  { label: '开户银行名称', prop: 'parentBankName', type: 'selectKey', formatter: '', enumKey: 'bankType' },
  { label: '联系电话', prop: 'contactTel', type: 'text', formatter: '', enumKey: '' },
  { label: '开户行支行名称', prop: 'bankName', type: 'text', formatter: '', enumKey: '' },
  { label: '支付行号', prop: 'unionBank', type: 'text', formatter: '', enumKey: '' }
]

let formRules: any = {
  companyName: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
  certificateImge: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
  organizationCode: [{ required: true, message: '请上传组织机构代码证', trigger: 'blur' }],
  taxRegister: [{ required: true, message: '请上传税务登记证', trigger: 'blur' }],
  telephone: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
  legalName: [{ required: true, message: '请填写法人姓名', trigger: 'blur' }],
  legalPhone: [{ required: true, message: '请填写法人手机号码', trigger: 'blur' }],
  identityType: [{ required: true, message: '请选择法人证件类型', trigger: 'blur' }],
  legalIds: [{ required: true, message: '请填写法人证件号码', trigger: 'blur' }],
  legalIdcardFront: [{ required: true, message: '请上传证件照正面照片', trigger: 'blur' }],
  legalIdcardBack: [{ required: true, message: '请上传证件照反面照片', trigger: 'blur' }],
  accountNo: [
    { required: true, message: '请填写企业对公账户', trigger: 'blur' }
  ],
  parentBankName: [{ required: true, message: '请选择开户银行名称', trigger: 'blur' }],
  province: [{ required: true, message: '请填写开户行支行名称', trigger: 'blur' }],
  unionBank: [{ required: true, message: '请填写支行行号', trigger: 'blur' }],
  businessLicense: [{ required: true, message: '请填写营业执照号', trigger: 'blur' }],
  uniCredit: [{ required: true, message: '请填写统一社会信用代码', trigger: 'blur' }],
  bankName: [{ required: true, message: '请填写开户行支行名称', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '请填写法人姓名', trigger: 'blur' }],
  authType: [{ required: true, message: '请选择认证类型', trigger: 'blur' }]
}
export let formFiled = {
  formSetting,
  formRules
}


