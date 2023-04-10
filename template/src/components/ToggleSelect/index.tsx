/* 含有"全部选项"功能的下拉选择框, 包括单选和多选 */
import { Select } from 'antd';
import type { SelectProps } from 'antd/lib/select';
import { filter, isEqual, last, map } from 'lodash';
import type { FC } from 'react';
import { memo, useMemo } from 'react';

interface IState extends SelectProps<any, any> {
  allLabel?: string;
  value?: string | string[]; // 传入的值, 单选为字符串; 多选为字符串数组
}

export const allVal = '__ALL__';

const Index: FC<IState> = ({
  id,
  value,
  onChange,
  options,
  style,
  mode,
  allLabel = '全部',
  ...rest
}) => {
  const allIds = map(options, 'value');

  const mergeValue = useMemo(() => {
    /* 在单选情况下 */
    if (!mode) return value;

    /* 多选下兑换为'全部'的情况: 直接选中全部，或者选择其余所有项 */
    if (mode === 'multiple' && allIds?.length > 1) {
      if (
        last(value) === allVal ||
        (value?.length === allIds?.length && isEqual((value as string[]).sort(), allIds.sort()))
      ) {
        return [allVal];
      }
    }
    // 互斥
    return filter(value, (val) => val !== allVal);
  }, [mode, allIds, value]);

  // 处理选项
  const mergeOptions = useMemo(() => {
    if (!options?.length) return [];
    /** 长度为1时不显示'全部' */
    if (options?.length === 1) return options;
    return [{ label: allLabel, value: allVal }, ...options];
  }, [allLabel, options]);

  return (
    <Select
      id={id}
      value={mergeValue}
      style={{ ...{ minWidth: 150 }, ...(style ?? {}) }}
      options={mergeOptions}
      onChange={(val) => {
        let exchangedVal = val;
        /* 在展示'全部'的情况下，将allVal 兑换为全部id */
        if (mode === 'multiple') {
          if (last(val) === allVal) {
            exchangedVal = allIds;
          } else {
            exchangedVal = filter(val, (p) => p !== allVal);
          }
        }
        /* 触发父级表单的onChange事件 */
        onChange?.(exchangedVal, options!);
      }}
      mode={mode}
      {...rest}
    />
  );
};

export default memo(Index);
