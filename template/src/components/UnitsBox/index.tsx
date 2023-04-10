import React from 'react';
import { memo } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ButtonProps } from 'antd/lib/button';
import { useMount } from 'ahooks';
import LabelsView from '@/components/LabelsView';
import useInitialState from '@/hooks/useInitialState';

interface Props {
  btnProps?: ButtonProps;
  defaultValue?: string[];
  single?: boolean; // 是否单选
  value?: (string | number)[];
  style?: React.CSSProperties;
  onChange?: (value: (string | number)[]) => void;
}

const Index: React.FC<Props> = (props) => {
  const { unitList } = useInitialState();
  const {
    single = false,
    defaultValue = single ? [unitList?.[0]?.id] : unitList?.map((p) => p.id), // 默认数值，有单选和多选分别
    value,
    onChange,
  } = props;

  const [mergedValue] = useMergedState(null, {
    value,
    defaultValue,
  });

  useMount(() => {
    // 进来默认调用一次
    if (mergedValue) {
      onChange?.(mergedValue);
    }
  });

  return (
    <LabelsView {...props} dataSource={unitList.map((p) => ({ id: p.id, name: p.unitName }))} />
  );
};

export default memo(Index);
