import { parse } from 'querystring';
import { history } from 'umi';

export const goToLogin = () => {
  if (process.env.NODE_ENV === 'development') {
    history.push(`/Login`);
  } else {
    history.push(`/`);
  }
};

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
export const IEVersion = () => {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion === 7) {
      return 7;
    }
    if (fIEVersion === 8) {
      return 8;
    }
    if (fIEVersion === 9) {
      return 9;
    }
    if (fIEVersion === 10) {
      return 10;
    }
    return 6; // IE版本<=7
  }
  if (isEdge) {
    return 'edge'; // edge
  }
  if (isIE11) {
    return 11; // IE11
  }
  return -1; // 不是ie浏览器
};

// /**
//  * Tabs组件切换时更新url参数
//  * @param value
//  */
// export const pushTabToUrlQuery = (value: string) => {
//   history.push({
//     query: {
//       tab: value,
//     },
//   });
// };
