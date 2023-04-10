/**
 * 带样式的标签页
 * 支持单选多选
 */

import { Tag } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import './index.less';

interface Props<T> {
  style?: React.CSSProperties;
  defaultValue?: string[];
  single?: boolean; // 是否单选
  value?: T[];
  onChange?: (value: T[]) => void;
  dataSource: { name: string | ReactNode; id: string | number; disabled?: boolean }[];
  className?: string;
}

const Index: React.FC<Props<string | number>> = (props) => {
  const {
    style,
    single = false,
    dataSource = [],
    defaultValue = single ? [dataSource?.[0]?.id] : dataSource?.map((p) => p.id), // 默认数值，有单选和多选分别
    value,
    onChange,
    className,
  } = props;

  const [mergedValue, setInnerValue] = useMergedState(null, {
    value: value ?? [],
    defaultValue,
  });

  const toggleInner = useCallback(
    (item: any) => () => {
      if (item.disabled) {
        return;
      }
      const copy = mergedValue ? [...mergedValue] : [];
      if (single) {
        // 单选，比较简单
        setInnerValue([item.id]);
        onChange?.([item.id]);
        return;
      }
      const newValue =
        !!mergedValue && mergedValue.indexOf(item.id) >= 0
          ? copy.filter((p) => p !== item.id)
          : [...copy, item.id];
      setInnerValue(newValue);
      onChange?.(newValue);
    },
    [mergedValue, single, setInnerValue, onChange],
  );

  return (
    <div className={`tsie-tags-view ${className ?? ''}`} style={style}>
      {dataSource?.map((item) => (
        <Tag
          className={`tags-item ${
            mergedValue?.length && mergedValue?.indexOf(item.id) >= 0
              ? 'tag-selected'
              : 'tag-default'
          } ${item?.disabled ? 'tags-item--disabled' : ''}`}
          key={item.id}
          onClick={toggleInner(item)}
        >
          <div className="tag-item-content">{item.name}</div>
        </Tag>
      )) || []}
    </div>
  );
};

export default memo(Index);
