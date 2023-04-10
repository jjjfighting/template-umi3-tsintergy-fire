// 按钮集（重置按钮，下载按钮，方便后续UI样式迭代优化）
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import type { FC } from 'react';
import './index.less';

type Props = Omit<ButtonProps, 'type' | 'icon'>;

// 重置按钮
const ResetButton: FC<Props> = ({ children = '重置', ...rest }) => {
  return (
    <Button type="primary" ghost {...rest}>
      {children}
    </Button>
  );
};

// 下载数据按钮
const DownloadButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <Button
      type="link"
      ghost
      className="downloadBtn"
      icon={<i className={`icon ppsfont icon-daochu`} />}
      {...rest}
    >
      {children}
    </Button>
  );
};

export { ResetButton, DownloadButton };
