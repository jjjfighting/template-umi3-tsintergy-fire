import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import style from './index.less';

interface DrawerWrapperInter extends DrawerProps {
  children?: any;
  mRef?: any;
  style?: React.CSSProperties;
  extra?: React.ReactNode;
  onClose?: () => void;
}

const Index = (props: DrawerWrapperInter) => {
  const { children, mRef, className = '', onClose, extra, ...rest } = props;
  const [visible, setVisible] = useState(false);

  useImperativeHandle(mRef, () => ({
    showModal: () => {
      setVisible(true);
    },
  }));

  const handleClose = () => {
    onClose?.();
    setVisible(false);
  };

  return (
    <Drawer
      className={`${style.drawerWrapper} ${className}`}
      visible={visible}
      closable={false}
      extra={
        <>
          {extra}
          <i className="icon ppsfont icon-guanbi sdFireIconfont" onClick={handleClose} />
        </>
      }
      onClose={handleClose}
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default Index;
