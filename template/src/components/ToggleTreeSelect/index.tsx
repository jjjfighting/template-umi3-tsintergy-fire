/**
 * 含有全部选项功能的树形下拉选择框
 */

import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd/lib/tree-select';
import { filter, isEqual, last } from 'lodash';
import type { TreeDataNode } from 'rc-tree-select/lib/interface.js';
import type { FC } from 'react';
import { memo, useMemo } from 'react';

interface IState extends Omit<TreeSelectProps, 'onChange' | 'treeData' | 'showCheckedStrategy'> {
  options: TreeDataNode[];
  showAll?: boolean;
  allLabel?: string;
  onChange?: (value: string[]) => void;
}

export const allVal = '__ALL__';

const Index: FC<IState> = ({
  id,
  value,
  onChange,
  options,
  style,
  showAll = true, // 默认为true
  allLabel = '全部',
  ...rest
}) => {
  // 获取所有id（有子节点则返回所有子节点的id）
  const getIds = (data: TreeDataNode[]): string[] => {
    return data?.reduce((acc: string[], item) => {
      if (item?.children?.length) {
        return [...acc, ...getIds(item?.children)];
      }
      return [...acc, item.value] as string[];
    }, []);
  };

  const allIds = getIds(options);

  const mergeValue = useMemo(() => {
    if (showAll && allIds?.length > 1) {
      if (
        last(value) === allVal ||
        (value?.length === allIds?.length && isEqual(value.sort(), allIds.sort()))
      ) {
        return [allVal];
      }
    }

    return filter(value, (val) => val !== allVal);
  }, [allIds, showAll, value]);

  const mergeDatas = useMemo(() => {
    if (!allIds?.length) return [];
    // 当长度为1时，选中这项与选全部是一样的
    if (showAll && allIds.length > 1) {
      return [{ label: allLabel, value: allVal }, ...options];
    }
    return options;
  }, [allIds.length, showAll, options, allLabel]);

  return (
    <>
      <TreeSelect
        style={{ minWidth: 216 }}
        treeData={mergeDatas}
        treeCheckable={true}
        value={mergeValue}
        maxTagCount={2}
        onChange={(val) => {
          let exchangedVal = val;
          /* 在展示'全部'的情况下，将allVal 兑换为全部id */
          if (showAll) {
            if (last(val) === allVal) {
              exchangedVal = allIds;
            } else {
              exchangedVal = filter(val, (p) => p !== allVal);
            }
          }
          onChange?.(exchangedVal);
        }}
        {...rest}
      />
    </>
  );
};

export default memo(Index);
