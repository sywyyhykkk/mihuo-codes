class Loading {
	/**
	 * 	用法1: uni.showLoading(), uni.hideLoading() 成对使用
	 * 	用法2: uni.showLoading({ duration: 2000 })  2秒后自动关闭
	 *  用法3: uni.showLoading({
				title: '加载中',
				isFullScreen: true,
				duration: 500
			})
	 */
	constructor() {
		this.duration = 500
		this.popContent = [];
		this.screenWidth = plus.screen.resolutionWidth
		this.screenHeight = plus.screen.resolutionHeight
		this.isFullScreen = true
		this.title = ''
		this.isIos = plus.os.name == "iOS";
		this.isShowing = false
		this.mask = true
	}
	setMask(mask){
		// 是否显示背景mask
		this.mask = mask
	}
	setDuration(duration) {
		this.duration = duration
		setTimeout(() => {
			this.hide()
		}, this.duration)
	}
	setFullScreen(isFullScreen){
		// 是否loading时遮住全屏
		this.isFullScreen = isFullScreen
	}
	setTitle(title){
		// loading时的文字提示, 建议不多于6个字
		this.title = title
	}
	show() {
		// 避免显示多层级loading
		if(this.isShowing){
			return
		}
		this.popContent = []
		this.isShowing = true
		let { statusBarHeight } = uni.getSystemInfoSync();
		this.statusBarHeight = statusBarHeight
		this.popWidth = this.screenWidth
		let popupHeight, popupTop
		if(this.isFullScreen){
			popupHeight = this.screenHeight + 'px'
			popupTop = '0px'
		} else {
			// ios有40px的底部安全区，所以多减去38px(少2px避免有缝隙)
			popupHeight = this.screenHeight - this.statusBarHeight - (this.isIos ? 108 : 70) - 44 + 'px'
			popupTop = this.statusBarHeight + 44 + 'px'
		}
		this.popupEle = new plus.nativeObj.View('popupEle', {
			tag: 'rect',
			top: popupTop,
			backgroundColor:  this.mask ? 'rgba(0, 0, 0, .2)' : 'rgba(0, 0, 0, 0)' ,
			height: popupHeight,
			width: '100%'
		})
		this.popContent.push({
			src: '/static/images/loading.gif',
			id: 'logo',
			tag: 'img',
			position: {
				top: '40%',
				left: (this.popWidth - 80) / 2 + 'px',
				width: '80px',
				height: '80px',
			}
		})
		if(this.title){
			this.popContent.push({
				tag: 'font',
				id: 'title',
				text: this.title,
				textStyles: {
					size: '12px',
					color: '#000000',
					whiteSpace: 'normal',
					align: 'center'
				},
				position: {
					top: '49%',
					left: (this.popWidth - 80) / 2 + 'px',
					width: '80px',
					height: '40px'
				}
			})
		}
		this.popupEle.draw(this.popContent)
		this.popupEle.show()
	}
	hide() {
		this.popupEle && this.popupEle.hide()
		this.isShowing = false
	}
}
export default new Loading()
