import { Modal } from 'antd';
import { useMemo } from 'react';
import type { ModalProps } from 'antd/lib/modal';
import type { MutableRefObject } from 'react';
import { useImperativeHandle, useState } from 'react';
import './index.less';
import { useSelector } from 'umi';
import { commomModel } from '@/models/commonModel';

interface ModalWrapperInter extends ModalProps {
  children?: any;
  mRef?: MutableRefObject<{ showModal: () => void } | null>;
  style?: React.CSSProperties;
  displayOnly?: boolean;
  buttonCenter?: boolean; // 按钮是否居中
}

const Index = (props: ModalWrapperInter) => {
  const { children, displayOnly, buttonCenter, mRef, ...rest } = props;
  const [modalVis, setModalVis] = useState(false);
  const { themeChangeTag } = useSelector(commomModel.selector);

  useImperativeHandle(mRef, () => ({
    showModal: () => {
      setModalVis(true);
    },
  }));

  const isGary = useMemo(
    () => localStorage.getItem(`${PROJECT_KEY}_isgary`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeChangeTag],
  );

  if (displayOnly) {
    return (
      <Modal
        className={`-p-modal-wrapper ${isGary && 'toBeGary'}`}
        destroyOnClose
        open={modalVis}
        closeIcon={<i className="ppsfont icon-guanbi" />}
        onOk={() => {
          setModalVis(false);
        }}
        onCancel={() => {
          setModalVis(false);
        }}
        {...rest}
      >
        {children}
      </Modal>
    );
  }
  return (
    <Modal
      className={`-p-modal-wrapper ${
        buttonCenter && '-p-modal-wrapper-btn-center'
      } -p-modal-wrapper-cancel-btn ${isGary && 'toBeGary'}`}
      closeIcon={<i className="ppsfont icon-guanbi" />}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default Index;
