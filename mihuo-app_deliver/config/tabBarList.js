import {
	certification
} from "@/plugins/utils.js"
import Util from '@/static/js/util.js'
const tabBarList = [{
		title: '装修',
		icon: "/static/images/order_zx2.png",
		tap: () => {
			uni.redirectTo({
				url: `/pages/publishTask/sendOrder`
			});
		}
	},
	{
		title: '维修',
		icon: "/static/images/order_wx2.png",
		tap: () => {
			Util.toast('您还不能去维修');
		}
	},
	{
		title: '安装',
		icon: "/static/images/order_az2.png",
		tap: () => {
			Util.toast('您还不能去安装');
		}
	},
	{
		title: '设计',
		icon: "/static/images/order_sj2.png",
		tap: () => {
			Util.toast('您还不能去设计');
		}
	},
	{
		title: '其他',
		icon: "/static/images/order_qt2.png",
		tap: () => {
			Util.toast('您还不能去其他');
		}
	}
];

export default {
	tabBarList
}
