import { FormSetting } from "../../config/FormSetting"

export const formSetting:Array<FormSetting>=[
    {label: "企业名称", prop: "companyName",type: 'text',formatter: '',enumKey: '',},
    {label: "法人姓名", prop: "legalPerson", type: 'text',formatter: '',enumKey: '',},
    {label: "企业地址", prop: "address", type: 'address',formatter: '',enumKey: '',},
    {label: "法人手机号码", prop: "legalPhone", type: 'text',formatter: '',enumKey: '',},
    {label: "法人证件类型", prop: "identityType", type: 'select',formatter: '',enumKey: 'cardType',},
    {label: "认证类型", prop: "authType", type: 'select',formatter: '',enumKey: 'authType',},
    {label: "法人证件号码", prop: "legalIds", type: 'text',formatter: '',enumKey: '',},
    {label: " 营业执照", prop: "certificateImge", type: 'image',formatter: '',enumKey: '',},
    {label: " 法人身份证正面", prop: "legalIdcardFront", type: 'image',formatter: '',enumKey: '',},
    {label: " 组织机构代码证", prop: "organizationImg", type: 'image',formatter: '',enumKey: '',},
    {label: " 组织机构代码", prop: "organizationCode", type: 'text',formatter: '',enumKey: '',},
    {label: " 法人身份证反面", prop: "legalIdcardBack", type: 'image',formatter: '',enumKey: '',},
    {label: " 税务登记证", prop: "taxRegisterImg", type: 'image',formatter: '',enumKey: '',},
    {label: " 税务登记证号", prop: "taxRegister", type: 'text',formatter: '',enumKey: '',},
    {label: "统一社会信用/ 营业执照号到期时间", prop: "expLicense", type: 'date',formatter: '',enumKey: '',},
    {label: "证件有效日期", prop: "beginEnd", type: 'daterange',formatter: '',enumKey: '',},
    {label: "企业对公账户", prop: "accountNo", type: 'text',formatter: '',enumKey: '',},
    {label: "开户银行名称", prop: "parentBankName", type: 'selectKey',formatter: '',enumKey: 'bankType',},
    {label: "联系电话", prop: "telephone", type: 'text',formatter: '',enumKey: '',},
    {label: "开户行支行名称", prop: "bankName", type: 'text',formatter: '',enumKey: '',},
]



