/**
 * @author: @hejj  <---  有任何Bug或问题请联系
 *
 * 自定义下拉选择框, 包括单选, 多选。
 */
import { useBoolean, useMount } from 'ahooks';
import { Button, Popover } from 'antd';
import { isEqual } from 'lodash';
import type { FC, ReactElement } from 'react';
import { memo, useRef, useState } from 'react';
import CheckboxRender from './CheckboxRender';
import Styles from './index.less';
import RadioRender from './RadioRender';

export type NumOrStr = number | string;
export type NumOrStrArr = NumOrStr[];

const Index: FC<{
  type: 'radio' | 'checkbox';
  options: OptionList;
  value?: NumOrStrArr; // 统一操作，单选复选value都为数组
  onChange?: (value: NumOrStrArr) => void;
  defaultValue?: NumOrStrArr;
  size?: number;
  checkAllText?: string;
  placeholder?: string;
}> = ({
  type,
  options,
  checkAllText,
  defaultValue = type === 'checkbox' && checkAllText ? options.map((p) => p.id) : [],
  value,
  onChange,
  size,
  placeholder = '筛选文本',
}): ReactElement => {
  // 检查类型
  useMount(() => {});

  // checkbox特用
  const checkboxRef = useRef<{ reset: (val: NumOrStrArr) => void } | null>(null);

  // 弹窗显示开关
  const [visible, { set: setVisible }] = useBoolean(false);

  // 维护内部数据 ($value, $setValue) 仅作为中转
  const [$value, $setValue] = useState<NumOrStrArr>(() => {
    if (value?.length) {
      return [...(value ?? [])];
    }
    if (defaultValue?.length) {
      return defaultValue;
    }
    // 复选且有全选，默认全部选中
    if (type === 'checkbox' && checkAllText) {
      return options.map((p) => p.id);
    }
    return [];
  });

  /* 这个函数负责渲染对应的内容组件，便于替换和拓展 */
  function RenderContent(): ReactElement {
    let res: ReactElement = <></>;
    switch (type) {
      case 'radio':
        res = (
          <RadioRender
            size={size}
            $value={$value}
            $onChildChange={$setValue} // 子组件触发onChange，仅同步内部状态
            options={options}
          />
        );
        break;
      case 'checkbox':
        res = (
          <CheckboxRender
            checkboxRef={checkboxRef}
            size={size}
            $value={$value}
            $onChildChange={$setValue} // 子组件触发onChange，仅同步内部状态
            options={options}
            checkAllText={checkAllText}
          />
        );
        break;
      default:
    }
    return res;
  }

  const content = (
    <div className={Styles.content}>
      <div className={Styles.contentList}>{RenderContent()}</div>
      <div className={Styles.btnsLine}>
        <Button
          type="primary"
          ghost
          size="small"
          onClick={() => {
            const defValue: NumOrStrArr = defaultValue || [];
            // ⚠️ 复选(Checkbox)，调用自身的重置方法(因为需要额外处理'全选'样式)
            if (type === 'checkbox' && checkboxRef.current && checkboxRef.current.reset) {
              checkboxRef.current.reset(defValue);
            } else {
              $setValue(defValue); // 同步数据
            }
          }}
        >
          重置
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            if (onChange) {
              onChange($value); // 点击确定才出发onChange事件，暴露内部数据给上层
            }
            setVisible(false); // 关闭弹窗
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      className={Styles.popoverClass}
      placement="bottom"
      trigger="click"
      content={content}
      visible={visible}
      onVisibleChange={(visibleParam: boolean) => {
        // visibleParam 为 false 表示关闭(点击空白处)
        if (!visibleParam && onChange) {
          onChange($value);
        }
        setVisible(visibleParam);
      }}
    >
      <span className={Styles.selectContent}>
        {placeholder ?? '筛选文本'}
        <i
          className={`ppsfont icon-shaixuan ${
            $value && !isEqual($value, defaultValue) && $value?.length !== 0
              ? Styles.activeIcon
              : Styles.noActiveIcon
          }`}
        />
      </span>
    </Popover>
  );
};

export default memo(Index);
