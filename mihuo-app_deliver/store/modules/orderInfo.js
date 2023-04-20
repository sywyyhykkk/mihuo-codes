import {
	onLogin
} from "../../config/login";

export const state = {
	userPersonId: '',
	projectInfo: {},
	orderInfo: {},
	nodeInfo: {},
	userPersonInfo: {},
	userRole: '',
	remainingDays: '',
	todo: {},
	skillId: '',
	isAddCustomSpace: '', // 是否添加自定义空间
	examineType: '',
	reviewInfo: {},
	preNodeStatus: '', // 判断是否 有前置节点
	businessCode: '', // 待处理项的businessCode
	templatePendingCount: '', // 交底问卷待确认数量
	fileUploadList: [], // 上传文件数量
	authModalIndex: 0,
	screeningIndex: {
		topActiveIndex: -1,
		leftTypeActiveIndex: -1,
		rightTypeActiveIndex: 0,
		rightTypeActiveParentIndex: 0,
		selectActiveObject: ''
	}
};

export const mutations = {
	setProjectInfo(state, data) {
		if (data) {
			// state.projectInfo = Object.assign({}, state.projectInfo, data);
		}
		state.projectInfo = data
	},
	setOrderInfo(state, data) {
		if (data) {
			// state.orderInfo = Object.assign({}, state.orderInfo, data);

		}
		state.orderInfo = data
	},
	setNodeInfo(state, data) {
		if (data) {
			// state.nodeInfo = Object.assign({}, state.nodeInfo, data); // 复制数据
			state.nodeInfo = data;
		}
	},
	setUserPersonInfo(state, data) {
		if (data) {
			// state.userPersonInfo = Object.assign({}, state.userPersonInfo, data);
		}
		state.userPersonInfo = data;
	},
	setUserRole(state, data) {
		if (data) {
			state.userRole = data;
		}
	},
	setRemainingDays(state, data) {
		state.remainingDays = data;
	},
	setTodo(state, data) {
		if (data) {
			state.todo = Object.assign({}, state.todo, data);
		}
	},
	setUserPersonId(state, data) {
		if (data) {
			state.userPersonId = data;
		}
	},
	setIsAddCustomSpace(state, data) {
		state.isAddCustomSpace = data;
	},
	setSkillId(state, data) {
		if (data) {
			state.skillId = data;
		}
	},
	setScreeningIndex(state, data) {
		state.screeningIndex = data;
	},
	setExamineType(state, data) {
		state.examineType = data;
	},
	setPreNodeStatus(state, data) {
		state.preNodeStatus = data;
	},
	setBusinessCode(state, data) {
		state.businessCode = data;
	},
	setTemplatePendingCount(state, data) {
		state.templatePendingCount = data;
	},
	setFileUploadList(state, data) {
		state.fileUploadList = data;
	},
	setAuthModalIndex(state, data) {
		state.authModalIndex = data;
	}
}

export const actions = {

};
