import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/store'
import * as Tools from '@/plugins/utils'
import Util from 'static/js/util.js'
import Validate from 'static/js/validate.js'
import api from '@/config/api'
import {
	debounce,
	checkUploadProcess,
	getPersonIdUser
} from '@/plugins/utils'
// 工具
//全局图片路径
import common from 'config/common.js'
//权限配置中心
import base from '@/config/baseUrl'
//挂载全局http请求
import $http from '@/config/requestConfig'
import {
	CommonUpload
} from '@/plugins/uploadPic.js';
import uView from 'uview-ui';
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import operation from '@/plugins/mathoperation.js'
import {
	styleColor
} from '@/style/mixin.js'

Vue.config.productionTip = false;

Vue.prototype.$styleColor = styleColor;
Vue.prototype.$getPersonIdUser = getPersonIdUser;
Vue.prototype.$tools = Tools
Vue.prototype.$math = operation;
Vue.prototype.$CommonUpload = CommonUpload;
Vue.prototype.$util = Util;
Vue.prototype.$validate = Validate;
Vue.prototype.goBack = () => {
	let routes = getCurrentPages();
	let curRoute = routes[(routes.length - 2)].route
	if (
		curRoute === '/pages-user/appLogin/appLogin' ||
		curRoute === '/pages-appInfo/univerifyLogin/univerifyLogin' ||
		curRoute === '/pages-user/login/login') {
		// 如果上一页是登录页，则返回至登录页的上一页
		uni.navigateBack({
			delta: 2
		});
	} else {
		uni.navigateBack();
	}
}
Vue.prototype.toPage = (url) => {
	uni.navigateTo({
		url
	})
}
Vue.prototype.toTab = (url) => {
	uni.switchTab({
		url
	})
}
// 用于需要登录才能执行的操作或需要登录才能跳转的页面
Vue.prototype.checkIsLogin = (fn) => {
		// 已登录时直接执行操作，跳转页面或其他操作
		
}
const devMode = uni.getStorageSync('devModeApi')
if(devMode){
	Vue.prototype.$image = devMode;
} else {
	Vue.prototype.$image = common;
}
Vue.prototype.$store = store;
Vue.prototype.$base = base;
Vue.prototype.$http = $http;
Vue.prototype.$httpApi = new api();
Vue.prototype.$checkUploadProcess = checkUploadProcess;
Vue.prototype.debounce = debounce;

Vue.use(uView);

Vue.config.productionTip = false;
//全局组件
Vue.component("mescroll-body", MescrollBody);
// #ifdef APP-PLUS
Vue.directive('pin', {
	bind: function(el, binding, vnode,button) {
		const clickHandler = (e) => {
			// 这里判断点击的元素是否是本身，是本身，则返回
			//console.log(el.contains)
			if (!el.disabled) {
				// el.disabled = true
				// binding.disabled = true
				// vnode.disabled =true
				// button.isOnce = true
				setTimeout(() => {
					//el.disabled = false
				}, binding.value || 10000)
			}else{
				return false;
			}
			// 判断指令中是否绑定了函数    // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
			if (binding.expression) {
				binding.value(e);
			}
		}
		// 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
		el.__vueClickOutside__ = clickHandler;
		el.addEventListener('click', clickHandler);
	},
	unbind(el, binding) { // 解除事件监听
		el.removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	},
})
// #endif
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount();
