import { useSize } from 'ahooks';
import { Tooltip, Typography } from 'antd';
import type { FC, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import Style from './index.less';
/**
 * 基于react-fast-marquee（https://www.npmjs.com/package/react-fast-marquee）
 * 带滚动效果的文本显示组件
 */
const MessageNotice: FC<{
  type?: 'warning' | 'success' | 'error'; // 类型
  ellipsisScroll?: boolean; // 是否溢出滚动
  style?: React.CSSProperties;
  showToolTip?: boolean; // 是否通过tootip展示文本
}> = ({
  style,
  type = 'warning',
  ellipsisScroll = false,
  children: message,
  showToolTip = false,
}): ReactElement => {
  // 容器
  const messageContainerSize = useSize(document.querySelector('#messageContainer'));
  // 滚动
  const marqueeSize = useSize(document.querySelector('.marquee'));

  // 控制显示
  const [visible, setVisible] = useState(true);

  // 是否滚动
  const isScroll = useMemo(() => {
    if (
      (!marqueeSize || !messageContainerSize || marqueeSize.width <= messageContainerSize.width) &&
      !ellipsisScroll
    )
      return false;
    return true;
  }, [messageContainerSize, marqueeSize, ellipsisScroll]);

  // 会导致滚动bug，需要重新渲染下组件
  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    });
  }, [message]);

  // 预定义样式类
  const classEnum = {
    warning: 'message-notice-warning',
    error: 'message-notice-error',
    success: 'message-notice-success',
  };

  return (
    <Tooltip title={showToolTip ? message : ''}>
      <div
        id="messageContainer"
        style={style}
        className={`${Style['message-notice']} ${Style[classEnum[type]]}`}
      >
        {visible && isScroll && (
          <Marquee play pauseOnClick pauseOnHover gradient={false}>
            {message}
          </Marquee>
        )}
        {!isScroll && <Typography.Text ellipsis>{message}</Typography.Text>}
      </div>
    </Tooltip>
  );
};

export default MessageNotice;
