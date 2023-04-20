export class Toast {
	constructor(option = {}) {
		this.bodyModel = null;
		this.pageHeight = uni.getSystemInfoSync().screenHeight;
		this.pageWidth = uni.getSystemInfoSync().screenWidth;
		let opacity = option.opacity || 0.9;
		let textContent = option.title || '默认提示';
		this.duration = option.duration || 2000
		let align = option.align || "center";
		//#ifdef APP-PLUS
		this.creatView({
			height: '100%',
			top: 0
		}, opacity, {
			'textContent': textContent,
			align
		})
		setTimeout(() => {
			this.hide();
		}, this.duration)
		//#endif
	}
	// 生成提示框view
	creatView(style, opa, modelInfo) {
		style = {
			left: '0px',
			width: '100%',
			...style
		}
		let view = new plus.nativeObj.View('showModalView', style);
		let textHeight = Math.ceil(modelInfo.textContent.length * 16 / this.pageWidth) * 20 + 20
		let rectWidth = modelInfo.textContent.length * 16 / this.pageWidth > 1 ? '90%' :
			`${modelInfo.textContent.length * 16 + 20}px`
		let rectLeft = modelInfo.textContent.length * 16 / this.pageWidth > 1 ? '5%' :
			`${(this.pageWidth - modelInfo.textContent.length * 16) / 2}px`
		let textWidth = modelInfo.textContent.length * 16 / this.pageWidth > 1 ? '85%' :
			`${modelInfo.textContent.length * 16}px`
		let textLeft = modelInfo.textContent.length * 16 / this.pageWidth > 1 ? '7.5%' :
			`${(this.pageWidth - modelInfo.textContent.length * 16) / 2 + 10}px`
		view.draw([{
				tag: 'rect',
				id: 'concent',
				rectStyles: {
					radius: '8px',
					color: `rgba(125, 190, 235, ${this.opa})`,
				},
				position: {
					top: `${this.pageHeight * 0.4 + 5}px`,
					left: rectLeft,
					width: rectWidth,
					height: `${textHeight}px`
				},
			},
			{
				tag: 'font',
				id: 'title',
				text: modelInfo.textContent,
				textStyles: {
					size: '16px',
					color: '#FFFFFF',
					whiteSpace: 'normal',
					align: modelInfo.align
				},
				position: {
					top: `${this.pageHeight * 0.4 + 5}px`,
					left: textLeft,
					width: textWidth,
					height: `${textHeight}px`
				}
			},
		]);
		this.bodyModel = view;
	}
	show() {
		this.bodyModel.show();
	}
	hide() {
		this.bodyModel.hide();
	}
}

export default Toast
