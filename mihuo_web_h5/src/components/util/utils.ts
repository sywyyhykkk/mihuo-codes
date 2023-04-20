const domain = process.env.FILE_PATH;
const parameterInfo = '?x-image-process=image/resize,m_fixed,'
/**
 * 设置每个页面的title信息
 * @param {String} url: 图片地址
 * @param {Boolean} thumbnail: 是否添加缩略图后缀
 * @param {width} width: 缩略图默认宽度
 * */
export const thumbnailImage = (url: string,  thumbnail: boolean, width=120) => {
  let parameters = thumbnail ? parameterInfo  +  `w_${width}` : ''
  if (!url) {
    return '';
  }
  return domain + '/' + url.replace('/admin/sys-file/mihuo-test/', '') + parameters
}

//生成guid 简易版本
export const getGuid=()=>{
  let s = [];
  let hexDigits = "0123456789abcdefghijklmnopqrstwxyz";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr(((s[19] as any) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid;
}


