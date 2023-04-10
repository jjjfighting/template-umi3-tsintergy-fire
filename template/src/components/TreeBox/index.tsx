import CardWrapper from '@/components/CardWrapper';
import { Tree } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import type { FC, ReactElement } from 'react';
import React, { memo, useEffect, useState } from 'react';
import styles from './index.less';

interface TreeBoxEnum {
  treeData: DataNode[];
  loading?: boolean;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  defaultSelectedKeys?: React.Key[];
  defaultCheckedKeys?: React.Key[];
  defaultExpandKeys?: React.Key[];
  onChange?: (checkedKeys: (string | number)[], e: any) => void;
  onExpand?: (expamdKeys: (string | number)[], e: any) => void;
  onExpandBox?: (isExpand: boolean) => void;

  onSelect?: (checkedKeys: (string | number)[], e: any) => void;
}

const TreeBox: FC<TreeBoxEnum> = ({
  treeData,
  loading,
  title,
  style,
  className,
  defaultSelectedKeys,
  defaultCheckedKeys,
  defaultExpandKeys,
  onChange,
  onExpand,
  onSelect,
  onExpandBox,
}): ReactElement => {
  const [isExpandBox, setExpandBox] = useState<boolean>(true);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    if (!defaultSelectedKeys) return;
    setSelectedKeys(defaultSelectedKeys);
  }, [defaultSelectedKeys]);

  useEffect(() => {
    if (!defaultCheckedKeys) return;
    setCheckedKeys(defaultCheckedKeys);
  }, [defaultCheckedKeys]);

  useEffect(() => {
    if (!defaultSelectedKeys && !defaultSelectedKeys) return;
    setAutoExpandParent(true);
    setExpandedKeys(defaultExpandKeys ?? defaultSelectedKeys);
  }, [defaultExpandKeys, defaultSelectedKeys]);

  // 处理选中复选框
  const handleCheck = (checkedKeysValue: any, e: any) => {
    setCheckedKeys(checkedKeysValue);
    if (onChange) onChange(checkedKeysValue, e);
  };

  // 处理展开容器
  const handleExpandBox = () => {
    setExpandBox(!isExpandBox);
    if (onExpandBox) onExpandBox(!isExpandBox);
  };

  // 处理选中树节点
  const handleSelect = (selectedKeysValue: React.Key[], e: any) => {
    setSelectedKeys(selectedKeysValue);
    if (onSelect) onSelect(selectedKeysValue, e);
  };

  // 处理展开选项
  const handleExpandData = (expandedKeysValue: React.Key[], e: any) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
    if (onExpand) onExpand(expandedKeysValue, e);
  };

  return (
    <div className={styles.Index}>
      <CardWrapper
        title={title}
        style={style}
        loading={loading}
        className={`${styles.cardBox} ${!isExpandBox ? styles.shrink : ''} ${className ?? ''}`}
      >
        <Tree
          checkable
          className="tree"
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={handleCheck}
          onSelect={handleSelect}
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
          onExpand={handleExpandData}
          treeData={treeData}
        />
      </CardWrapper>
      <div className={styles.toolBtn} onClick={handleExpandBox}>
        <i
          className="ppsfont icon-zengjia"
          style={{ transform: `rotate(${isExpandBox ? 270 : 90}deg)` }}
        />
      </div>
    </div>
  );
};

export default memo(TreeBox);
