import Util from 'static/js/util.js'

// 有权限的路由表
const routeList = [{
		name: '巡检',
		path: 'pages/construction/patrolInspection/patrolIndex',
		children: []
	},
	{
		name: '新增巡检',
		path: 'pages/construction/patrolInspection/patrolInspection',
		children: []
	}
]
// 启用标识
const startUsing = false

class permissionRouting {
	constructor(option) {
		this.routeList = routeList || []
		this.startUsing = startUsing
	}
	static getInstance() {
		// 判断是否已经new过1个实例
		if (!permissionRouting.instance) {
			// 若这个唯一的实例不存在，那么先创建它
			permissionRouting.instance = new permissionRouting()
		}
		// 如果这个唯一的实例已经存在，则直接返回
		return permissionRouting.instance
	}
	setStartUsing(startUsing) {
		return this.startUsing = startUsing
	}
	isHave() {
		let parameter = {
			path: Util.getRoute(),
			startUsing: this.startUsing
		}
		if (this.startUsing) {
			let route = this.routeList.find(item => item.path == parameter.path)
			if (route ) {
				let childrenPath = route.children.find(item => item.path == parameter.path)
				parameter.path = route?.path
			} else {
				parameter.path = route?.path
			}
		}
		return parameter
	}
	isShow() {
		let per = permissionRouting.getInstance().isHave()
		if (per.startUsing) {
			if (per.path) {
				return true
			} else {
				return false
			}
		} else {
			return true
		}
	}
}

export default permissionRouting
