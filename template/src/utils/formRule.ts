/**
 * Form.Item rules for antd v4
 */

import type { Rule } from 'antd/lib/form';
import { isEmpty } from 'lodash';

// -----------------------------------------------------------------------------
// 单一规则
// -----------------------------------------------------------------------------

export const requiredRule: Rule[] = [
  {
    required: true,
    message: '不能为空',
  },
];

/**
 * 非空规则
 */
const emptyReg = /[^\s]/;
export const noEmptyRule: Rule[] = [
  {
    required: true,
    validator(rule, value) {
      if (!emptyReg.test(value)) {
        return Promise.reject(new Error('不能为空'));
      }
      return Promise.resolve();
    },
  },
];

/**
 * 最高 两位小数
 * 测试：https://regex101.com/r/0JMX6M/5/
 */
const pointTwoReg = /^(([-|1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
export const pointTwoRule: Rule[] = [
  {
    validator(rule, value) {
      if (isEmpty(value) || pointTwoReg.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('最高两位小数'));
    },
  },
];

/**
 * 最高N位小数
 * 测试：https://regex101.com/r/0JMX6M/5/
 */
export const pointNRule = (N: number): Rule[] => {
  return [
    {
      validator(rule, value) {
        const pointNReg = new RegExp(`^(([-|1-9]{1}\\d*)|(0{1}))(\\.\\d{1,${N}})?$`);
        if (isEmpty(value) || pointNReg.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(`最高位${N}小数`));
      },
    },
  ];
};

/**
 * 整数
 * 测试：https://regex101.com/r/0JMX6M/5/
 */
const notPointReg = /^(([-|1-9]{1}\d*)|(0{1}))$/;
export const notPointRule: Rule[] = [
  {
    validator(rule, value) {
      if (isEmpty(value) || notPointReg.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('请输入整数'));
    },
  },
];

/**
 * 十进制数字类型
 * 测试：https://regex101.com/r/0JMX6M/5/
 */
const decimalRegexp = /^(0|-?[1-9]\d*|-?\d+\.\d+)$/;
export const numberTypeRule: Rule[] = [
  {
    validator(rule, value) {
      if (isEmpty(value) || decimalRegexp.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('需要为数字'));
    },
  },
];

const phoneNumberRegexp = /^1[3456789]\d{9}$/;
export const phoneNumberRule: Rule[] = [
  {
    validator(rule, value) {
      if (isEmpty(value) || phoneNumberRegexp.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('请输入正确的手机号'));
    },
  },
];

export const overZeroRule: Rule[] = [
  {
    min: 0,
    transform: (value) => Number(value),
    type: 'number',
    message: `请输入大于等于0的值`,
  },
];

export const underZeroRule: Rule[] = [
  {
    max: 0,
    type: 'number',
    transform: (value) => Number(value),
    message: `请输入小于等于0的值`,
  },
];

export const maxLengthRule = (len: number = 16): Rule[] => [
  {
    validator(_rule, value) {
      if (isEmpty(value) || value?.length <= len) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(`最高输入不超过${len}`));
    },
  },
];

// -----------------------------------------------------------------------------
// 复合规则
// -----------------------------------------------------------------------------

export const max2000: Rule[] = [
  ...overZeroRule,
  {
    max: 2000,
    type: 'number',
    transform: (value) => Number(value),
    message: `需小于等于2000`,
  },
];

export const maxRequire2000: Rule[] = [
  ...requiredRule,
  ...overZeroRule,
  {
    max: 2000,
    type: 'number',
    transform: (value) => Number(value),
    message: `需小于等于2000`,
  },
];

export const overZeroRequireRule: Rule[] = [
  ...requiredRule,
  {
    min: 0,
    transform: (value) => Number(value),
    type: 'number',
    message: `请输入大于等于0的值`,
  },
];

export const underRequireZeroRule: Rule[] = [...requiredRule, ...underZeroRule];

export const numberTypeRequireRule = [...requiredRule, ...numberTypeRule];

export const phoneNumberRequiredRule: Rule[] = [...requiredRule, ...phoneNumberRule];

export const maxRequireNum = (number: number): Rule[] => [
  ...requiredRule,
  ...overZeroRule,
  {
    max: number,
    type: 'number',
    transform: (value) => Number(value),
    message: `需小于等于${number}`,
  },
];
