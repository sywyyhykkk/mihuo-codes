class operation {
	//加法运算    

	floatAdd(arg1 = 0, arg2 = 0) {
		var r1, r2, m;

		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}

		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}

		m = Math.pow(10, Math.max(r1, r2));

		return (arg1 * m + arg2 * m) / m;

	}
	//减法运算    
	floatSub(arg1 = 0, arg2 = 0) {

		var r1, r2, m, n;

		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}

		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}

		m = Math.pow(10, Math.max(r1, r2));

		//动态控制精度长度    

		n = (r1 >= r2) ? r1 : r2;

		return ((arg1 * m - arg2 * m) / m).toFixed(n);
	}

	//乘法运算    

	floatMul(arg1 = 0, arg2 = 0) {

		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();

		try {
			m += s1.split(".")[1].length
		} catch (e) {}

		try {
			m += s2.split(".")[1].length
		} catch (e) {}

		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

	}
	//除法运算  
	floatp(arg1 = 0, arg2 = 0) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length
		} catch (e) {}
		try {
			t2 = arg2.toString().split(".")[1].length
		} catch (e) {}
		r1 = Number(arg1.toString().replace(".", ""));


		r2 = Number(arg2.toString().replace(".", ""));

		return (r1 / r2) * Math.pow(10, t2 - t1);

	}
	// 精度计算
	accuracy(num){
		var arg1,r1,e1
		e1 = num
		arg1 = num.toString();
		r1 = arg1.split('.')[1];
		if(r1 && r1.length>2){
			e1 = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
		}
		return e1
	}
	
		/**
		 * @param {*} arrList 参数数组
		 * @param {*} operator 操作符：1加法 2乘法
		 * @param {*} precision 精度 默认2位
		 */
		
		funCalc(arrList, operator = 1, precision = 2) {
			if (arrList.length === 0) return 0;
			// 计算最大数度值,避免精度丢失，先扩大位数，再缩小
			let mPow = Math.pow(10, precision); // 默认2位小数
			let total = 0;
			if (operator == 2) {
				total = 1;
				mPow = 1;
			}
			for (const item of arrList) {
				let tem = 0;
				if (item) {
					tem = parseFloat(item) ?? 0; // parseFloat处理，转化失败时给0
					tem = !isNaN(tem) ? tem : 0; // 处理 NaN 情况
				}
				switch (operator) {
					case 1:
						total += tem * mPow;
						break;
					case 2:
						total *= tem * mPow;
						break;
					default:
						total += tem * mPow;
				}
			}
			// toFixed部分浏览器会用问题，
			const res = (total / mPow).toFixed(precision);
			// // 修复toFixed
			// const res = parseInt(total + 0.5, 10) / times;
			return res;
		}
}
export default new operation()
