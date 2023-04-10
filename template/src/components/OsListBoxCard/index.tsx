import CardWrapper from '@/components/CardWrapper';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useMount, useUpdateEffect } from 'ahooks';
import { Input, Tooltip, Tree } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { cloneDeep } from 'lodash';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

export interface TreeProps {
  defaultSelectKey?: string; // 选中的key
  selectTheFirst?: boolean; // 是否默认选择第一个节点
  onClick?: (obj: any) => void; // 节点点击事件
  getFirstNodeProp?: (obj: any) => void; // 默认选择第一个节点(默认defaultSelectKey中)后回调
  titleRenderWrap?: (node: any) => ReactNode;
  style?: React.CSSProperties;
  selectKey?: string; // 受控组件Tree
  optionList: FIRE_BASE.Units[]; // 机组list
}

/**
 * 搜索功能
 * @param data
 * @param keyWord
 */
export const dataFilter = (data: FIRE_BASE.Units[], keyWord: string): DataNode[] => {
  return data
    ?.map(({ unitName, id }) => ({ key: id, title: unitName }))
    ?.filter(({ title }) => {
      if (keyWord === '') {
        return true;
      }
      return title?.match(keyWord);
    });
};

const Index = (props: TreeProps) => {
  const {
    defaultSelectKey = null, // 默认选中的key 从外部传进来
    selectTheFirst = true,
    onClick,
    getFirstNodeProp,
    titleRenderWrap,
    selectKey,
    optionList, // 机组list
    ...rest
  } = props;

  const defaultUnitId = ''; // 默认选择的机组id
  const [searchingKeyword, setSearchingKeyword] = useState('');
  const [selectedKeysOnTree, setSelectedKeysOnTree] = useState<any[]>([
    defaultSelectKey || defaultUnitId,
  ]);
  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (!selectKey) {
      return;
    }
    setSelectedKeysOnTree([selectKey]);
  }, [selectKey]);

  const handleSelect = (selectedKeys: (string | number)[], e: any): any | undefined => {
    if (!onClick || !selectedKeys || selectedKeys.length === 0) return undefined;
    const { node } = e;
    setSelectedKeysOnTree(selectedKeys);
    // 返回所点选节点obj
    return onClick(cloneDeep(optionList?.find(({ id }) => id === node?.key)));
  };

  useMount(() => {
    if (selectTheFirst) {
      let defaultIndex = 0;
      // 如果有默认值，就选择默认值
      if (selectedKeysOnTree && selectedKeysOnTree.length > 0) {
        const tempIndex = optionList?.findIndex((p) => p.id === selectedKeysOnTree[0]);
        defaultIndex = tempIndex === -1 ? defaultIndex : tempIndex;
      }
      setSelectedKeysOnTree([optionList?.[defaultIndex]?.id] || []);
      // 回调
      if (getFirstNodeProp) {
        getFirstNodeProp(cloneDeep(optionList?.[defaultIndex]) ?? {});
      }
    }
  });

  useUpdateEffect(() => {
    // 机组更新，已选机组可能已经退役/不存在. 若不在则重选第一个机组
    if (optionList?.every(({ id }) => !selectedKeysOnTree?.includes(id))) {
      if (selectTheFirst && optionList?.length > 0) {
        setSelectedKeysOnTree([optionList?.[0]?.id]);
      } else {
        setSelectedKeysOnTree([]);
      }

      // 回调
      if (getFirstNodeProp && selectTheFirst) {
        getFirstNodeProp(cloneDeep(optionList?.[0]) ?? {});
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [optionList]);

  const collapsedStyle = {
    width: '80px',
    padding: '12 0 0 0',
    clipPath: 'polygon(0 0, 0% 100%, 85% 100%, 85% 40%,100% 38%, 100% 15%,85% 13%, 85% 0%)',
  };

  const style = {
    width: '190px',
    padding: '12 0 0 0',
    clipPath: 'polygon(0 0, 0% 100%, 95% 100%, 95% 40%,100% 38%, 100% 15%,95% 13%, 95% 0%)',
  };

  return (
    <div className={styles.treeBoxWarp}>
      <CardWrapper
        shadow
        noPadding
        style={collapsed ? collapsedStyle : style}
        className={styles.treeBox}
      >
        <div className={`${collapsed ? styles.sxTreeCollapsed : styles.sxTree}`}>
          <div className={styles.treeBody}>
            <CardWrapper
              style={{
                textAlign: 'center',
                padding: 0,
              }}
              bodyStyle={{ paddingTop: 8, paddingLeft: 12, paddingRight: 12 }}
              noTitleTag
              title={
                !collapsed ? (
                  <div
                    style={{
                      fontSize: '16px',
                      textAlign: 'left',
                    }}
                  >
                    场站选择
                  </div>
                ) : undefined
              }
            >
              {!collapsed ? (
                <Input
                  placeholder="请输入场站名称"
                  prefix={<i className="icon-sousuo icon ppsfont" />}
                  style={{ width: '80%', margin: '0 0 10px 0' }}
                  value={searchingKeyword}
                  onChange={({ target }) => {
                    setSearchingKeyword(target.value);
                  }}
                />
              ) : (
                <Tooltip title={<div>点击展开搜索框</div>}>
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      color: 'var(--neutral-color3)',
                      paddingBottom: '8px',
                    }}
                  >
                    <i
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                      className="icon-sousuo icon ppsfont"
                      onClick={() => {
                        setCollapsed(!collapsed);
                      }}
                    />
                  </div>
                </Tooltip>
              )}
              <Tree
                className={styles.CustomizedTree}
                selectedKeys={selectedKeysOnTree}
                defaultExpandAll
                onSelect={(selectedKeys, e) => {
                  handleSelect(selectedKeys, e);
                }}
                titleRender={(node) => {
                  return (
                    <Tooltip title={node.title}>
                      {!collapsed ? (
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '120px',
                            textAlign: 'left',
                          }}
                        >
                          {typeof titleRenderWrap === 'function'
                            ? titleRenderWrap?.(node)
                            : node.title}
                        </div>
                      ) : (
                        <div
                          style={{ textAlign: !collapsed ? 'left' : 'center', lineHeight: '30px' }}
                        >
                          {node?.title?.[0]}
                        </div>
                      )}
                    </Tooltip>
                  );
                }}
                treeData={dataFilter(optionList, searchingKeyword)}
                {...rest}
              />
            </CardWrapper>
          </div>
          <div
            className={collapsed ? styles.icon_div : styles.icon_collapsed_div}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? <CaretRightOutlined /> : <CaretLeftOutlined />}
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default Index;
