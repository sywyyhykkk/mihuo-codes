import { FormSetting } from "../config/FormSetting";

let formSetting:Array<FormSetting>=[
    {label: "客服昵称", prop: "serverName",type: 'text',formatter: '',enumKey: '',},
    {label: "关联人员", prop: "employeeName", type: 'selectTree',formatter: '',enumKey: '',},
]

let formRules:any={
    serverName: [{ required: true, message: '请输入客服昵称', trigger: 'blur' }],
    employeeName: [{ required: true, message: '请选择关联人员', trigger: 'blur' }],
}

export let formFiled ={
    formSetting,
    formRules,
}


