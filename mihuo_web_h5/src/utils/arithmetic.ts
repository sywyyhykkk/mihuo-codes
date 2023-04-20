const getNum = {

  /**
   * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
   *
   * @param num1加数1 | num2加数2
   */
  numAdd(num1: any, num2: any) {
    // console.log(num1, num2)
    var baseNum, baseNum1, baseNum2
    try {
      baseNum1 = num1 ? num1.toString().split('.')[1].length : 0
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2 ? num2.toString().split('.')[1].length : 0
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    return (this.numMulti(num1, baseNum) + this.numMulti(num2, baseNum)) / baseNum
  },


  /**
   * 减法运算。
   *
   * @param num1减数1 | num2减数2
   */
  numSub(num1: any, num2: any) {

    return this.numAdd(num1, -num2)

  },


  /**
   * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
   *
   * @param num1被乘数 | num2乘数
   */
  numMulti(num1: any, num2: any) {
    var baseNum = 0
    var n1, n2
    try {
      baseNum += num1 ? num1.toString().split('.')[1].length : 0
    } catch (e) {
    }
    try {
      baseNum += num2 ? num2.toString().split('.')[1].length : 0
    } catch (e) {
    }
    n1 = Number(num1 ? num1.toString().replace('.', '') : 0)
    n2 = Number(num2 ? num2.toString().replace('.', '') : 0)
    return n1 * n2 / Math.pow(10, baseNum)
  },

  /**
   * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
   *
   * @param num1被除数 | num2除数
   */
  numDiv(num1: any, num2: any) {
    var baseNum1 = 0, baseNum2 = 0
    var baseNum3, baseNum4
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    // with (Math) {
    baseNum3 = Number(num1.toString().replace('.', ''))
    baseNum4 = Number(num2.toString().replace('.', ''))
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)
    // }
  }
}
export default getNum
