// 基准大小
const baseSize = 10
// 设置 rem 函数
function setRem() {
  const width = window.screen.width;
  const height = window.screen.height;
  const bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const bodyHeight = document.body.clientHeight;
  // 标准的比列
  var standard = 1920 / 1080;
  // 实际的比列
  var real = width / height;
  //奇葩国内的浏览器 左侧还有一个竖着的白条
  if (width == bodyWidth) {
    // 如果实际比列大于标准比列，则以宽度为准，否则以高度为准
    if (real > standard) {
      //长屏幕 宽度较小这时候取宽度来适配
      //说明是宽度/长度大于标准的比列 那么就用宽作为比列
      var rem = height / 1080;
    } else {
      //短屏幕 长较小这时候取长度来适配
      var rem = width / 1920
    }
    if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
      document.documentElement.style.fontSize = Math.max(9, baseSize * Math.min(rem, 2)) + 'px'
      return;
    }
    document.documentElement.style.fontSize = baseSize * Math.min(rem, 2) + 'px'
    return
  }

  if (width * 0.9 < bodyWidth && bodyWidth < width) {
    var rem = bodyWidth / 1920
  } else {
    var rem = bodyHeight / 1080
  }
  // 设置页面根节点字体大小
  if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
    document.documentElement.style.fontSize = Math.max(9, baseSize * Math.min(rem, 2)) + 'px'
    return;
  }
  document.documentElement.style.fontSize = baseSize * Math.min(rem, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  //  setRem()
}