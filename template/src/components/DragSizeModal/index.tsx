import { useMount } from 'ahooks';
import type { ModalProps } from 'antd';
import { Button, Modal, Row, Space } from 'antd';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import style from './index.less';

// 这个组件 基于 modal
// 位置的调整 用了 react-draggable(https://www.npmjs.com/package/react-draggable),  width height 用了 resizable
// 使用 多了 defaultWidth defaultHeight 两个参数
interface Props extends ModalProps {
  extra?: ReactElement;
  noPointEvent?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  onResize?: (size: { width: number; height: number }) => void;
}

const DragSizeModal: React.FC<Props> = ({
  title,
  visible,
  noPointEvent,
  children,
  defaultWidth = 650,
  defaultHeight = 300,
  extra,
  onOk,
  onCancel,
  onResize,
  ...rest
}) => {
  // 控制modal内容可拖动，目前仅允许通过拖拽标题拖动，内容不給拖动
  const [disabled, setDisabled] = useState<boolean>(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef: any = useRef();

  const [width, setWidth] = useState<number>(defaultWidth);
  const [height, setHeight] = useState<number>(defaultHeight);

  // 拖动回调函数
  const updateBounds = (event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  useMount(() => {
    if (onResize) onResize({ width: defaultWidth, height: defaultHeight });
  });

  const onWResize = (_: any, { size }: { size: { width: number; height: number } }) => {
    setWidth(size.width);
    if (onResize) onResize(size);
  };

  const onYResize = (_: any, { size }: { size: { width: number; height: number } }) => {
    setHeight(size.height);
    if (onResize) onResize(size);
  };

  return (
    <Resizable
      className={`${style.resizable_div}`}
      width={width}
      height={height}
      onResize={onWResize}
    >
      <Modal
        width={width}
        bodyStyle={{ paddingTop: 0 }}
        wrapClassName={`${style.dragModal} ${noPointEvent ? style.no_point_event : ''}`}
        footer={
          <div className={style.footer_div}>
            <Button type="primary" onClick={onOk}>
              确定
            </Button>
            <Button type="default" onClick={onCancel}>
              取消
            </Button>
            {/* 这个 Resizable 提供 一个 handle 用来实现 高度的调整 */}
            <Resizable
              className={style.resizable_div_y}
              width={width}
              height={height}
              onResize={onYResize}
              handle={<div className={style.ant_modal_footer_handle} />}
            >
              <div style={{ height: '0px' }} />
            </Resizable>
          </div>
        }
        title={
          <div
            className={style.title}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
          >
            <Row justify="space-between">
              <Space>
                {title}
                {/* 标题栏公能扩展部分（如下拉选择，复选框等）禁止拖拽、避免出现不必要的问题 */}
                {extra && (
                  <div
                    onMouseOver={(e) => {
                      setDisabled(true);
                      e.stopPropagation();
                    }}
                    onMouseOut={(e) => {
                      setDisabled(false);
                      e.stopPropagation();
                    }}
                  >
                    {extra}
                  </div>
                )}
              </Space>
            </Row>
          </div>
        }
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => updateBounds(event, uiData)}
          >
            <div
              ref={draggleRef}
              style={{
                width,
                height,
              }}
            >
              {modal}
            </div>
          </Draggable>
        )}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        {...rest}
      >
        {children}
      </Modal>
    </Resizable>
  );
};

export default DragSizeModal;
