export const islLogin = function() {
	const userInfo = uni.getStorageSync('userInfo');
	if (!userInfo) {
		 //接口请求会拦截的
		// uni.navigateTo({
		// 	url: '/pages/login/login',
		// })
		return false;
	}
	if (!userInfo.isRealName) {
		//实名认证
	}
	if (!userInfo.is) {
		//技能认证
	}
}
