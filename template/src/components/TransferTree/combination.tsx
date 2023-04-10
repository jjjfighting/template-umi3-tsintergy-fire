import type { ButtonProps } from 'antd';
import { Button, message } from 'antd';
import type { FC } from 'react';
import type { ICombinationData } from './types';

interface EditCombinationProps extends Omit<ButtonProps, 'onClick'> {
  stationGroupList: ICombinationData[] | undefined;
  allOrgIds: string[];
  groupId: string;
  // 当前编辑组合keys，组合数据
  onClick: (stationGroupKeys: string[], stationGroupData: ICombinationData | undefined) => void;
  children?: React.ReactNode;
}

// 编辑组合按钮
const EditCombination: FC<EditCombinationProps> = ({
  stationGroupList,
  groupId,
  allOrgIds,
  onClick,
  children = '编辑组合',
  ...restProps
}) => {
  return (
    <Button
      size="small"
      type="link"
      {...restProps}
      onClick={() => {
        if (!groupId) {
          message.warning('请先选择机组组合');
          return;
        }
        const result = stationGroupList?.find((item) => item.id === groupId);
        const finalKeys = result?.orgIds?.filter((item) => allOrgIds?.includes(item)) ?? [];
        // 过滤已经不存在的机组id（脏数据）
        onClick?.(finalKeys, result);
      }}
    >
      {children}
    </Button>
  );
};

// 自定义组合按钮
const CustomCombination: FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ children = '自定义组合', onClick }) => {
  return (
    <Button size="small" type="link" onClick={onClick}>
      {children}
    </Button>
  );
};

export { EditCombination, CustomCombination };
