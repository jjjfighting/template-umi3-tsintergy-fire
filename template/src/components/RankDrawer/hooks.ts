import { calc } from '@tsintergy/calc';
import { getValueScale } from '@tsintergy/ppss';
import { flatten, isNaN, map, maxBy, minBy, orderBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChildType, MenuType } from './types';

/* 菜单处理 */
export const useMenuAid = (menuList: MenuType[]) => {
  // 展开的目录
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 默认选中第一个子目录
  const [selectedNode, setSelectedNode] = useState<ChildType | undefined>(undefined);
  // 取出所有的子级菜单，便于遍历
  const childrenList: ChildType[] = useMemo(() => {
    return flatten(map(menuList, ({ children }) => children ?? []));
  }, [menuList]);

  useEffect(() => {
    setOpenKeys(map(menuList, 'key'));
  }, [menuList]);

  useEffect(() => {
    // 更新'异步数据'
    // 注意此处: 有两种情况, 切换更新，外部更新数据

    /* 初始化选中第一个 */
    if (!selectedNode) {
      setSelectedNode(childrenList[0]);
      return;
    }
    const { childKey } = selectedNode;
    const newChild = childrenList?.find((item) => item.childKey === childKey);
    /* 判断当前选中节点的数据更新了 */
    if (newChild && newChild !== selectedNode) {
      /* 更新数据，但不更新位置 */
      setSelectedNode(newChild);
    }
  }, [selectedNode, childrenList]);

  return [
    { openKeys, selectedNode, childrenList },
    { setOpenKeys, setSelectedNode },
  ] as const;
};

/* 数据格式化处理 */
export const useFormatAid = (
  selectedNode: ChildType | undefined,
  childrenList: ChildType[],
  setSelectedNode: Function,
) => {
  /* 上方汇总数据做单位转换 */
  const bannerInfo = useMemo(() => {
    const scaledObj = getValueScale(Number(selectedNode?.accValue) ?? 0);
    return {
      ...scaledObj,
      mergeUnit: `${scaledObj.unit}${selectedNode?.unit ?? ''}`,
    };
  }, [selectedNode]);

  const handleClick = useCallback(
    (e: { key: string }) => {
      const node = childrenList.find(({ childKey }) => childKey === e.key);
      if (!node) return;
      setSelectedNode(node);
    },
    [childrenList, setSelectedNode],
  );

  /* !! 核心计算: 求正负比例与, 以及单项所占比例 */
  const ratedDataSource = useMemo(() => {
    const ds = selectedNode?.dataSource;
    if (!ds?.length) return [];
    // 取出所有的值
    const valueList = map(ds, ({ value }) =>
      typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value,
    );
    const maxVal = (maxBy(valueList, (num) => num ?? 0) ?? 0) as number; // 最大值(可能为负)
    const minVal = (minBy(valueList, (num) => num ?? 0) ?? 0) as number; // 最小值(可能为负)
    let distance = 0;

    // 如果都是正数， 则distance为最大值
    if (minVal > 0) {
      distance = maxVal;
    } else if (maxVal < 0) {
      // 如果都是负数，则distance为最小值
      distance = Math.abs(minVal);
    } else {
      // 如果一正一负，则distance为大减小
      distance = maxVal - minVal;
    }

    const positiveRate = maxVal > 0 ? calc(maxVal).divide(distance).valueOfFirst() : 0; // 正负各占比例
    const negativeRate = minVal < 0 ? calc(Math.abs(minVal)).divide(distance).valueOfFirst() : 0; // 正负各占比例

    const rateedList = ds.map((item) => {
      // 因为value可能为null，不能通过解构默认值消除
      const value = item.value ?? 0;
      // 如果是正数，求占最大值的比例；负数就求占最小值的比例
      let rate = 0;
      if (value > 0) {
        rate = value && maxVal ? calc(value).divide(maxVal).valueOfFirst() : 0;
      } else {
        rate = value && minVal ? calc(value).divide(minVal).valueOfFirst() : 0;
      }
      return {
        ...item,
        value, // 因为参与计算，排除了null, undefined
        orgValue: item.value, // 原始数据
        rate,
        positiveRate,
        negativeRate,
      } as const;
    });

    // 根据数值由大到小排序, 如果是null则置为负无穷
    return orderBy(
      rateedList,
      ({ orgValue }) => {
        if (typeof orgValue === 'number') {
          return orgValue;
        }
        if (typeof orgValue === 'string' && !isNaN(Number(orgValue))) {
          return Number(orgValue);
        }
        return Number.NEGATIVE_INFINITY;
      },
      'desc',
    );
  }, [selectedNode]);

  return [{ bannerInfo }, { handleClick, ratedDataSource }] as const;
};
