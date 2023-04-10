import type { SpaceProps } from 'antd';
import { Space } from 'antd';
import React from 'react';

const style = { width: '100%' };

type Props = Omit<SpaceProps, 'direction'>;

const SpaceVertical: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  return (
    <Space direction="vertical" style={style} {...rest}>
      {children}
    </Space>
  );
};

export default SpaceVertical;
