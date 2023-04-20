import { TableSetting } from '@/components/CapitalManagement/type'

export const tSeting:Array<TableSetting>=[
    {label: "商品", prop: "product", header_align: 'center',show_overflow: true,},
    {label: "规格", prop: "productSku", header_align: 'center', align: 'center', width: 100,show_overflow: true,},
    {label: "单价", prop: "price", header_align: 'center', align: 'center', width: 100,show_overflow: true,},
    {label: "数量", prop: "quantity", header_align:'center', align: 'left', width: 100, show_overflow: true,},
    {label: "小计", prop: "totalPrice", align: 'center', width: 100,show_overflow: true,}
]