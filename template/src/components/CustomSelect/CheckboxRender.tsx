import { useBoolean, useMount } from 'ahooks';
import { Checkbox, Space } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { map } from 'lodash';
import type { FC, MutableRefObject, ReactElement } from 'react';
import { memo, useCallback, useImperativeHandle } from 'react';
import type { NumOrStrArr } from './index';

const Index: FC<{
  $value: NumOrStrArr;
  $onChildChange: (value: NumOrStrArr) => void;
  options: OptionList;
  size?: number;
  checkAllText?: string;
  checkboxRef: MutableRefObject<{ reset: (val: NumOrStrArr) => void } | null>;
}> = ({
  $value,
  $onChildChange,
  options,
  size,
  checkboxRef,
  checkAllText = '全选',
}): ReactElement => {
  /* indeterminate 只负责样式控制: checkAll 负责数据。 配合一起使用 */
  const [indeterminate, { set: setIndeterminate }] = useBoolean(false);
  const [checkAll, { set: setCheckAll }] = useBoolean(false);

  // 单个勾选
  const $$onChildChange = useCallback(
    (list: CheckboxValueType[]) => {
      setIndeterminate(!!list.length && list.length < options.length);
      setCheckAll(list.length === options.length);

      if ($onChildChange) {
        $onChildChange(list as string[]);
      }
    },
    [$onChildChange, options.length, setCheckAll, setIndeterminate],
  );

  // 勾选或取消全部
  const $onChangeAll = useCallback(
    (e: CheckboxChangeEvent) => {
      setIndeterminate(false);
      setCheckAll(e?.target?.checked);

      if ($onChildChange) {
        // 获取全部id值
        $onChildChange(e?.target?.checked ? map(options, 'id') : []);
      }
    },
    [$onChildChange, options, setCheckAll, setIndeterminate],
  );

  // 挂载时和重置时，需要额外判断是否全选
  useMount(() => {
    $$onChildChange($value);
  });

  useImperativeHandle(
    checkboxRef,
    () => ({
      reset: (val: NumOrStrArr) => {
        $$onChildChange(val);
      },
    }),
    [$$onChildChange],
  );

  return (
    <Space direction="vertical">
      <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={$onChangeAll}>
        {checkAllText ?? '全选'}
      </Checkbox>
      <Checkbox.Group value={$value} onChange={$$onChildChange}>
        <Space direction="vertical" size={size}>
          {options?.map((item) => (
            <Checkbox key={item.id} value={item.id}>
              {item.name}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </Space>
  );
};

export default memo(Index);
