import { Button, message, Modal } from 'antd';
import type { ButtonProps } from 'antd/lib/button';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { useCallback } from 'react';

interface Props extends ButtonProps {
  confirmProps?: Partial<ModalFuncProps>;
  mainEffect?: () => Promise<any> | void;
  sideEffect?: (res?: any) => void;
  onClick?: undefined;
  beforePopUp?: (() => boolean) | boolean | undefined; // true 为校验通过然后弹窗， false为 校验不通过然后阻止弹窗 并显示提示语
}

/**
 * 点击按钮 => 弹窗前校验 => 弹出确认窗口 => 点击确认 => 执行mainEffect(可选) => 关闭弹窗 => 执行sideEffect(可选)
 */
const ConfirmButton: React.FC<Props> = (props) => {
  const { children, onClick, confirmProps, mainEffect, sideEffect, beforePopUp, ...restProps } =
    props;

  const showPromiseConfirm = useCallback(() => {
    if (typeof beforePopUp === 'function' || typeof beforePopUp === 'boolean') {
      let passCheck = false;
      if (typeof beforePopUp === 'function') {
        passCheck = beforePopUp();
      } else if (typeof beforePopUp === 'boolean') {
        passCheck = beforePopUp;
      }

      if (!passCheck) {
        console.log('ConfirmButton', '已终止');
        return;
      }
    }

    Modal.confirm({
      title: <span>确认{children}</span>,
      ...confirmProps,
      onOk() {
        try {
          if (mainEffect) {
            return Promise.resolve(mainEffect()).then((res) => {
              console.log('onOk -> res', res);
              if (sideEffect) {
                sideEffect(res);
              }
            });
          }

          if (!mainEffect && sideEffect) {
            sideEffect();
          }
        } catch (e) {
          message.error('错误');
          return false;
        }
        return undefined;
      },
    });
  }, [beforePopUp, children, confirmProps, mainEffect, sideEffect]);

  return (
    <Button {...restProps} onClick={showPromiseConfirm}>
      {props.children}
    </Button>
  );
};

export default ConfirmButton;
