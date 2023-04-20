import { FormSetting } from "../config/FormSetting";

let formSetting:Array<FormSetting>=[
    {label: "企业logo", prop: "companyLogo",type: 'upload',formatter: '',enumKey: '',width:'100%'},
    {label: "企业名称", prop: "companyName", type: 'text',formatter: '',enumKey: '',},
    {label: "企业简称", prop: "companyShortName", type: 'text',formatter: '',enumKey: ''},
    {label: "企业规模", prop: "companyScale", type: 'select',formatter: '',enumKey: 'companyScale'},
    {label: "联系邮箱", prop: "contactEmail", type: 'text',formatter: ''},
    {label: "联系人", prop: "contactName", type: 'text',formatter: ''},
    {label: "联系电话", prop: "contactTel", type: 'number',formatter: '',enumKey:'',maxlength:11},
    {label: "公司所在地", prop: "completeAddress", type: 'address',formatter: ''},
    {label: "", prop: "provinceCode", type: 'province',formatter: ''},
    {label: "", prop: "cityCode", type: 'city',formatter: ''},
]

let formRules:any={
    companyLogo: [{ required: true, message: '请上传企业logo', trigger: 'blur' }],
    companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
    companyShortName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
    companyScale: [{ required: true, message: '请输入企业规模', trigger: 'blur' }],
    contactEmail: [{ pattern:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: 'blur' }],
    completeAddress: [{ required: true, message: '请输入公司所在地', trigger: 'blur' }],
    provinceCode: [{ required: true, message: '请选择省份', trigger: 'blur' }],
    cityCode: [{ required: true, message: '请选择州/市', trigger: 'blur' }],
}

export let formFiled ={
    formSetting,
    formRules,
}


