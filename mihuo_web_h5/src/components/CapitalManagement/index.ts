// 订单来源
import { Enum, TableSetting } from './type'
export const orderTypeBiz:Array<Enum> = [
    {
        name:'全部',
        value: 0,
    },
    {
        name:'充值',
        value: 10,
    },
    {
        name:'质保金充值',
        value: 11,
    },
    {
        name:'提现',
        value: 20,
    },
    {
        name:'装修订单',
        value: 30,
    },
    {
        name:'装修订单变更单',
        value: 31,
    },
    {
        name:'商城订单',
        value: 40,
    },
    {
        name:'工费申请',
        value: 50,
    },
    {
        name:'退款订单',
        value: 60,
    },
    {
        name:'平台转账',
        value: 70,
    },
    {
        name:'sop节点',
        value: 80,
    },
    {
        name:'报价下单',
        value: 90,
    },
    {
        name:'保险下单',
        value: 100,
    }
]

export const timeFilter:Array<Enum> = [
    {
        name:'创建时间',
        value:0,
    },
    {
        name:'支付时间',
        value:1,
    },
]
export const flowType:Array<Enum> = [
    {
        name:'全部',
        value:0,
    },
    {
        name:'收入',
        value:1,
    },
    {
        name:'支出',
        value:2,
    },
]
/**
 * 
 * @param value 枚举值
 * @param list  枚举列表
 * @returns 
 */
export const getTypeName=(value:string|number)=> {
    let name='';
    value =''+value;
    if(value){
          if(orderTypeBiz && orderTypeBiz.length>0){
            orderTypeBiz.some((val:Enum)=>{
                if(val.value==value){
                    name=val.name;
                    return true;
                }
            })
        }
    }
    return name;
}

export const moneyTransform = (money:any)=> {
    if (money && money != null) {
        money = String(money);
        let left = money.split('.')[0],
        right = money.split('.')[1];
        right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
        let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
    } else if (money === 0) {
        return '0.00';
    } else {
        return '';
    }
}
// 资金流水
export const tSeting:Array<TableSetting>=[
    {label: "资金流水号", prop: "bizOrderNo", header_align: 'center', align: 'center', width: 200,show_overflow: true,},
    {label: "支付时间", prop: "payTime", header_align: 'center', align: 'center', width: 150,show_overflow: true,},
    {label: "金额（元）", prop: "amount", header_align:'center', align: 'right', width: 120, show_overflow: true,},
    {label: "类型", prop: "capitalTye", align: 'center', width: 120,show_overflow: true,},
    {label: "来源", prop: "bizType", header_align: 'center', align: 'center',width: 160, show_overflow: true,},
    {label: "订单号", prop: "bizOrderList", header_align: 'center', align: 'center',width: 200,},
    {label: "创建时间", prop: "createTime", header_align: 'center', align: 'center', width: 150,show_overflow: true,},
    {label: "摘要", prop: "summary", header_align: 'center', align: 'left', show_overflow: true,}
]
/**    项目结算管理      */
export const projectStatusList:Array<Enum> = [
    {
        name:'开工',
        value:0,
    },
    {
        name:'停工',
        value:1,
    },
    {
        name:'复工',
        value:2,
    },
    {
        name:'完工',
        value:3,
    },
]
export const customerList:Array<Enum> = [
    {
        name:'客户姓名',
        value:'customerName',
    },
    {
        name:'客户电话',
        value:'customerPhone',
    },
]
export const checkList:Array<Enum> = [
    {
        name:'未验收',
        value:0,
    },
    {
        name:'待验收',
        value:1,
    },
    {
        name:'待整改/不通过',
        value:2,
    },
    {
        name:'验收通过',
        value:3,
    },
]

export const getName=(value:string|number,list:Enum)=> {
    let name='';
    value =''+value;
    if(value){
          if(list && list.length>0){
            list.some((val:Enum)=>{
                if(val.value==value){
                    name=val.name;
                    return true;
                }
            })
        }
    }
    return name;
}
export const settlementManage:Array<TableSetting>=[
    {label: "项目名称", prop: "projectName", header_align: 'center', width: 120,show_overflow: true,},
    {label: "客户名称", prop: "customerName", header_align: 'center', align: 'center', width: 120,show_overflow: true,},
    {label: "客户电话", prop: "customerPhone", header_align: 'center', align: 'center', width: 120,show_overflow: true,},
    {label: "小区/商圈", prop: "poiName", header_align:'center', align: 'left', width: 200, show_overflow: true,},
    {label: "详细地址", prop: "address", align: 'center', width: 120,show_overflow: true,},
    {label: "户型", prop: "model", header_align: 'center', align: 'center',width: 160, show_overflow: true,},
    {label: "面积(m²)", prop: "usableArea", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "管家", prop: "manager", header_align: 'center', align: 'center', width: 120,show_overflow: true,},
    {label: "设计师", prop: "designer", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "其他服务人员", prop: "servers", header_align: 'center', align: 'center', width:160, show_overflow: true,},
    {label: "服务模板", prop: "templateName", header_align: 'center', align: 'center', show_overflow: true,},
    {label: "预算金额", prop: "budgetAmount", header_align: 'center',width: 150, align: 'right', show_overflow: true,},
    {label: "项目状态", prop: "projectStatus", header_align: 'center', align: 'center', show_overflow: true,},
    {label: "已收人工费", prop: "expensesCost", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "已收材料费", prop: "materialCost", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "已支付人工费", prop: "payExpensesCost", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "已支付材料费", prop: "payMaterialCost", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "人工费利润", prop: "expensesProfit", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "材料费利润", prop: "materialProfit", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
    {label: "总利润", prop: "totalProfit", header_align: 'center', width: 150, align: 'right', show_overflow: true,},
]

/**    服务订单管理    */
export const serviceManage:Array<TableSetting>=[
    {label: "订单编号", prop: "orderCode", header_align: 'center', align: 'center', width: 150,show_overflow: true,},
    {label: "发单人", prop: "contactName", header_align: 'center', align: 'center', width: 120,show_overflow: true,},
    {label: "联系人", prop: "contactPhone", header_align:'center', align: 'center', width: 120, show_overflow: true,},
    {label: "地址", prop: "address", header_align: 'center',align: 'left', width: 250},
    {label: "订单状态", prop: "orderStatus", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "支付状态", prop: "payStatus", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "订单来源", prop: "source", header_align: 'center', align: 'center',show_overflow: true,},
    {label: "工种", prop: "skillName", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "订单金额", prop: "orderPrice", header_align: 'center', align: 'right', width:120, show_overflow: true,},
    {label: "抽成比例", prop: "feePercent", header_align: 'center', align: 'right', show_overflow: true,},
    {label: "抽成金额", prop: "fee", header_align: 'center',width: 120, align: 'right', show_overflow: true,},
    {label: "创建日期", prop: "created", header_align: 'center', align: 'center',width: 150, show_overflow: true,},
]

// 订单来源
export const sourceOrder:Array<Enum> =[
    {name:'C端',value:1},
    {name:'服务端',value:2},
    {name:'企业端',value:3},
    {name:'平台',value:4},
]
// 支付状态
export const payStatus:Array<Enum> =[
    {name:'成功',value:'success'},
    {name:'进行中',value:'pending'},
    {name:'失败',value:'fail'},
    {name:'待付',value:'waiting'},
]
export const orderStatus:Array<Enum> =[
    {
		value: 5,
		name: '待审核'
	},
	{
		value: 10,
		name: '待抢单'
	},
	{
		value: 15,
		name: '待确认'
	},
	{
		value: 20,
		name: '待付款'
	},
	{
		value: 20,
		name: '已付款'
	},
	{
		value: 30,
		name: '服务中'
	},
	{
		value: 35,
		name: '待验收'
	},
	{
		value: 40,
		name: '待评价'
	},
	{
		value: 50,
		name: '待评价'
	},
	{
		value: 51,
		name: '已完成'
	},
	// {
	//     status:55,
	//     name:'待售后'
	// },
	// {
	//     status:60,
	//     name:'售后中'
	// },
	{
		value: -1,
		name: '已关闭'
	},
	{
		value: -2,
		name: '已拒绝'
	},
]

/**    供应商结算管理    */
export const supplierMange:Array<TableSetting>=[
    {label: "单据编号", prop: "orderSn", header_align: 'center', align: 'center', width: 160,show_overflow: true,},
    {label: "供应商名称", prop: "supplierName", header_align: 'center', align: 'center', width: 120,show_overflow: true,},
    {label: "单据明细", prop: "items", header_align:'center', align: 'left', width: 80, show_overflow: true,},
    {label: "单据金额", prop: "amount", header_align: 'center',align: 'right', width: 120,show_overflow: true,},
    {label: "优惠金额", prop: "promotionAmount", header_align: 'center', align: 'right',width: 120, show_overflow: true,},
    {label: "收款金额", prop: "payAmount", header_align: 'center', align: 'right',width: 120, show_overflow: true,},
    {label: "应结金额", prop: "settlementAmount", header_align: 'center', align: 'right',width: 120, show_overflow: true,},
    {label: "利润", prop: "profitAmount", header_align: 'center', align: 'right',width: 100, show_overflow: true,},
    // {label: "单据来源", prop: "", header_align: 'center', align: 'center',width: 120, show_overflow: true,},
    {label: "收件人名称", prop: "receiverName", header_align: 'center', align: 'center', width:120, show_overflow: true,},
    {label: "收件人电话", prop: "receiverPhone", header_align: 'center', align: 'center', width:120, show_overflow: true,},
    {label: "收货地址", prop: "address", header_align: 'center'},
    {label: "创建日期", prop: "createTime", header_align: 'center', align: 'center', width: 150,show_overflow: true,},
    // {label: "物流状态", prop: "", header_align: 'center',width: 150, align: 'right', show_overflow: true,},
    // {label: "结算状态", prop: "", header_align: 'center', align: 'right', show_overflow: true,},
]
// 结算状态
export const statusFoot:Array<Enum> =[
    {name:"其他订单",value:-1},
    {name:"待付款",value:0},
    {name:"待发货",value:1},
    {name:"已发货/服务中",value:2},
    {name:"待验收",value:3},
    {name:"已完成",value:4},
    {name:"待售后",value:5},
    {name:"售后完成",value:6},
    {name:"已关闭",value:7},
    {name:"退款",value:8},
    {name:"退货",value:9},
    {name:"无效订单",value:10},
]
// 订单来源
export const sourceType:Array<Enum> =[
    {name:"PC订单",value:0},
    {name:"app订单",value:1},
    {name:"供应商订单",value:2},
    {name:"B端组合报价订单",value:4},
    {name:"快速预算订单",value:5},
]