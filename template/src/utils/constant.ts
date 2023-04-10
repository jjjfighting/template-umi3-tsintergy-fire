import type { CSSProperties } from 'react';

/** 千 */
export const thousand = 1000;
/** 百万 */
export const million = thousand * thousand;
/** 万 */
export const wan = 10000;
/** 亿 */
export const yi = wan * wan;

export const capacityUnit = 'MW';
export const feeUnit = '万元';

export const layout0 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
export const layout1 = {
  labelCol: { span: 1 },
  wrapperCol: { span: 23 },
};
export const layout2 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
export const layout3 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
export const layout4 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export const layout5 = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
export const layout6 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export const layout7 = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
export const layout8 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export const layout9 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};
export const layout10 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
export const layout11 = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};
export const layout12 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

export const marginGap = 16;
export const marginWrapperGap = 24;
export const marginBottomNum = marginGap;
export const marginRightNum = marginGap;
export const successCode = 'T200';

export const styleTopGap: React.CSSProperties = { marginTop: marginGap };

export const deleteEmptyChildren = (originList: any) => {
  return originList.map((p: any) => {
    const { children, ...rest } = p;
    if (p.children && p.children.length > 0) {
      return {
        ...rest,
        children: deleteEmptyChildren(p.children),
      };
    }
    return { ...rest };
  });
};

export const MODAL_TYPE = {
  edit: '编辑',
  add: '新增',
  check: '查看',
};

export const MODAL_OKTEXT = {
  edit: '保存',
  add: '确定',
  check: '确定',
};

export function getSession(key: string) {
  if (window.sessionStorage) {
    const str = sessionStorage.getItem(key);
    const o = str ? JSON.parse(str) : str;
    if (!o) {
      return null;
    }
    return o.value;
  }
  return window[Number(key)];
}

export const dividerHeight = 32;

export const marginGapTop: CSSProperties = { marginTop: marginGap };
