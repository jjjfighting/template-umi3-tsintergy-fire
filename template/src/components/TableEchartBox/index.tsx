import React from 'react';
import { memo, useMemo, useEffect, useState } from 'react';
import { Checkbox, Space } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

export type CheckableButtonsOnChange = (value: string[], checkMap: Record<string, boolean>) => void;

interface Props {
  size?: 'small' | 'middle' | 'large';
  spaceSize?: 'small' | 'middle' | 'large' | number;
  options: { id: string; name: string; disabled?: boolean }[];
  defaultValue?: string[];
  value?: string[];
  onChange?: CheckableButtonsOnChange;
}

const Index: React.FC<Props> = (props) => {
  const { options, defaultValue, value, onChange, size, spaceSize = 'small' } = props;
  const [mergedValue, setInnerValue] = useMergedState(null, {
    value,
    defaultValue,
  });

  const handleChange = (newValue: any) => {
    const checkMap = options.reduce((acc, item2) => {
      acc[item2.id] = newValue.indexOf(item2.id) >= 0;
      return acc;
    }, {});

    setInnerValue(newValue);
    onChange?.(newValue, checkMap);
  };

  const dataOption = useMemo(() => {
    return options.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [options]);

  return (
    <Space size={spaceSize} className="CheckableButtons">
      <Checkbox.Group
        options={dataOption}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </Space>
  );
};

export default memo(Index);
