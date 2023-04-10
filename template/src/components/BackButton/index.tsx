import React, { memo, useCallback } from 'react';
import { history } from 'umi';
import styles from './index.less';

interface Props {
  text?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const BackButton: React.FC<Props> = memo((props) => {
  const { onClick, style, text = '返回' } = props;

  const onClickBack = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      history.goBack();
    }
  }, [onClick]);

  return (
    <div className={styles.BackButton} onClick={onClickBack} style={{ ...style }}>
      {text}
    </div>
  );
});

export default BackButton;
