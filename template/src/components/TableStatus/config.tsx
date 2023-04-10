import darkAbnormal from '@/assets/img/icon_dark_status1.png';
import darkNormal from '@/assets/img/icon_dark_status2.png';
import darkDefault from '@/assets/img/icon_dark_status3.png';
import darkDanger from '@/assets/img/icon_dark_status4.png';
import lightAbnormal from '@/assets/img/icon_light_status1.png';
import lightNormal from '@/assets/img/icon_light_status2.png';
import lightDefault from '@/assets/img/icon_light_status3.png';
import lightDanger from '@/assets/img/icon_light_status4.png';

// 主题对应图片
export const imgEnum = {
  light: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  lightBlue: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  nd: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  dark: {
    normal: darkNormal,
    abnormal: darkAbnormal,
    default: darkDefault,
    danger: darkDanger,
  },
  gary: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  ny: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  sf: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
  default: {
    normal: lightNormal,
    abnormal: lightAbnormal,
    default: lightDefault,
    danger: lightDanger,
  },
};

// 状态类型(normal：正常，abnormal：异常，default：默认  danger: 危险)
export type StatusType = 'normal' | 'abnormal' | 'default' | 'danger';
