import operation from '@/plugins/mathoperation.js'

class product {
	constructor(data) {
		this.data = data;
		this.choose = data.choose;
	}

	getTotalPrice() {
		return operation.floatMul(this.data.price, this.choose)
	}

	increase() {
		this.choose++;
	}
	decrease() {
		if (this.choose === 0) {
			return
		}
		this.choose--;
	}
	setChoose(data) {
		this.choose = data
	}

}

export default product
