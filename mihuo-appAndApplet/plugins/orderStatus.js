/**
 * 施工订单状态
 * 10：已发布/待确认
 * 20：已确认/待付款
 * 30：已付款/服务中
 * 35：已申请/待验收
 * 40：待结算
 * 50：已完成/待评价
 * 51：已完成/已评价
 * -1：已取消
 */
export const orderStatus = [
	{
		status: 5,
		name: '待审核'
	},
	{
		status: 10,
		name: '待抢单'
	},
	{
		status: 15,
		name: '待确认'
	},
	{
		status: 20,
		name: '待付款'
	},
	{
		status: 20,
		name: '已付款'
	},
	{
		status: 30,
		name: '服务中'
	},
	{
		status: 35,
		name: '待验收'
	},
	{
		status: 40,
		name: '待评价'
	},
	{
		status: 50,
		name: '待评价'
	},
	{
		status: 51,
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
		status: -1,
		name: '已关闭'
	},
	{
		status: -2,
		name: '已拒绝'
	},
]

/**
 * @description 获取服务订单状态
 * @param {状态} status 
 */
export function getStatusName(status) {
	let name = null
	orderStatus.some((v, i) => {
		if (v.status == status) {
			name = v;
			return name
		}
	})
	return name
}

/**
 * @description 获取商城订单状态
 * @param {状态} status 
 * @param {是否是服务类型订单} isService
 * @param {订单评价状态} replyStatus
 */
export function getMallStatusName(status, isService, replyStatus = 0){
	// 0=待付款, 1=待发货, 2=已发货, 3=待验收, 4=交易成功/待评价, 5=待售后, 6=售后完成, 7=已关闭, 8=退款, 9=无效订单
	switch (status) {
		case 0:
			return '待付款'
		case 1:
			if (isService)
				return '待服务'
			else
				return '待发货'
		case 2:
			if (isService)
				return '服务中'
			else
				return '已发货'
		case 3:
			return '服务中'
		case 4:
			if (replyStatus == 2) {
				return '已完成'
			}
			return '交易成功'
		case 5:
			return '待售后'
		case 6:
			return '售后完成'
		case 7:
			return '已关闭'
		case 8:
			return '已退款'
		case 9:
			return '无效订单'
		case 12:
			return '待拼团'
		default:
			return '处理中'
	}
}


export const masterAvatar = [{
		name: "油漆",
		img: "https://www.51mihuo.com/static/icon/work_type/yqi.png",
	},
	{
		name: "油",
		img: "https://www.51mihuo.com/static/icon/work_type/yqi.png",
	},
	{
		name: "水电",
		img: "https://www.51mihuo.com/static/icon/work_type/sdian.png",
	},
	{
		name: "电",
		img: "https://www.51mihuo.com/static/icon/work_type/sdian.png",
	},
	{
		name: "木工",
		img: "https://www.51mihuo.com/static/icon/work_type/mgong.png",
	},
	{
		name: "木",
		img: "https://www.51mihuo.com/static/icon/work_type/mgong.png",
	},
	{
		name: "泥瓦",
		img: "https://www.51mihuo.com/static/icon/work_type/nwa.png",
	},
	{
		name: "泥",
		img: "https://www.51mihuo.com/static/icon/work_type/nwa.png",
	},
	{
		name: "拆除",
		img: "https://www.51mihuo.com/static/icon/work_type/cchu.png",
	},
	{
		name: "美缝",
		img: "https://www.51mihuo.com/static/icon/work_type/mfen.png",
	},
	{
		name: "管家",
		img: "https://www.51mihuo.com/static/icon/work_type/guanjia.png",
	},
	{
		name: "管家",
		img: "https://www.51mihuo.com/static/icon/work_type/guanjia.png",
	},
	{
		name: "项目监理",
		img: "https://www.51mihuo.com/static/icon/work_type/jianli.png",
	},
	{
		name: "监理",
		img: "https://www.51mihuo.com/static/icon/work_type/jianli.png",
	},
	{
		name: "设计师",
		img: "https://www.51mihuo.com/static/icon/work_type/shejishi.png",
	},
	{
		name: "设计",
		img: "https://www.51mihuo.com/static/icon/work_type/shejishi.png",
	},
	{
		name: "其他",
		img: "https://www.51mihuo.com/static/icon/work_type/cchu.png",
	},
]

/**
 * 支付项列表
 */
export const payTypeList = [{
		value: 4,
		name: '支付宝支付',
		tips: '使用支付宝支付',
		icon: '/static/images/order_details/small_ali.png'
	}, {
		value: 3,
		name: '微信小程序支付',
		tips: '使用微信小程序支付',
		icon: '/static/images/order_details/small_wx.png'
	}
]
