import { Select, Tag } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { memo, useCallback, useMemo } from 'react';
import './index.less';

interface Props<T> {
  style?: React.CSSProperties;
  defaultValue?: string[];
  value?: T[];
  onChange?: (value: T[]) => void;
  dataSource: { name: string; id: string | number; disabled?: boolean }[];
  className?: string;
  wholeName?: string;
}

const Index: React.FC<Props<string | number>> = (props) => {
  const {
    style,
    dataSource = [],
    defaultValue = dataSource?.map((p) => p.id),
    value,
    onChange,
    className,
    wholeName = '全厂',
  } = props;

  const [mergedValue, setInnerValue] = useMergedState(null, {
    value: value ?? [],
    defaultValue,
  });

  // 全部id
  const _allValue = useMemo(() => dataSource.map(({ id }) => id), [dataSource]);

  const toggleInner = useCallback(
    (options: any) => () => {
      const ids = options?.filter((item: any) => !item.disabled)?.map((item2: any) => item2?.id);
      if (!ids?.length) return;

      setInnerValue(ids);
      onChange?.(ids);
    },
    [setInnerValue, onChange],
  );

  return (
    <div className={`tags-sp-view ${className ?? ''}`} style={style}>
      <Tag
        className={`tags-sp-item ${
          mergedValue?.length && mergedValue?.toString() === _allValue?.toString()
            ? 'tag-selected'
            : 'tag-default'
        }`}
        key="wholeId"
        onClick={toggleInner(dataSource)}
      >
        <div className="tag-item-content">{wholeName}</div>
      </Tag>
      <Tag
        className={`tags-sp-item ${
          mergedValue?.length && mergedValue?.toString() !== _allValue?.toString()
            ? 'tag-selected'
            : 'tag-default'
        }`}
        key="singleId"
      >
        <Select
          className={'tags-sp-selector'}
          defaultValue={dataSource[0]?.id}
          bordered={false}
          onSelect={(val: any) => {
            setInnerValue([val]);
            onChange?.([val]);
          }}
        >
          {dataSource.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id} disabled={item.disabled}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Tag>
    </div>
  );
};

export default memo(Index);
