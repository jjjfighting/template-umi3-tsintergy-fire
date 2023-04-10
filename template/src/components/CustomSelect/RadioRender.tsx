import { Radio, Space } from 'antd';
import type { FC, ReactElement } from 'react';
import { memo } from 'react';
import type { NumOrStrArr } from './index';

const Index: FC<{
  $value: NumOrStrArr;
  $onChildChange: (value: NumOrStrArr) => void;
  options: OptionList;
  size?: number;
}> = ({ $value, $onChildChange, options, size }): ReactElement => {
  return (
    <Radio.Group
      value={$value?.[0]} // Radio 接受单个数据
      onChange={({ target: { value: val } }) => {
        $onChildChange([val]);
      }}
    >
      <Space direction="vertical" size={size ?? 6}>
        {options?.map((item) => (
          <Radio key={item.id} value={item.id}>
            {item.name}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

export default memo(Index);
