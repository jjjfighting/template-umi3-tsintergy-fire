import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEventListener } from 'ahooks';
import type { RadioChangeEvent } from 'antd';
import { Button, Dropdown, Menu, Radio, Space, Tooltip } from 'antd';
import classNames from 'classnames';
import { cloneDeep, find } from 'lodash';
import type { FC } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import type { ITabRadioItemType } from './types';
import useRefs from './useRefs';

const Index: FC<{
  value: string;
  dataSource: ITabRadioItemType;
  overlayStyle?: React.CSSProperties;
  onChange: (value: string) => void;
}> = ({ value, dataSource, overlayStyle, onChange }) => {
  const [getBtnRef] = useRefs<HTMLDivElement>();
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [btnWidth] = useState(95);
  const [offetX, setOffetX] = useState(0);
  // 控制子项是否展示
  const [menuItemVisible, setMenuItemVisible] = useState<boolean>(false);
  // 目前做中间层保存数据用
  const [menuList, setMenuList] = useState<ITabRadioItemType>([]);
  const [options, setOptions] = useState<ITabRadioItemType>([]);

  const initData = () => {
    const newWrapperWidth = getBtnRef('radioListWrapper')?.current?.offsetWidth ?? 0;
    const newListWidth = getBtnRef('radioListContainer')?.current?.offsetWidth ?? 0;
    setWrapperWidth(newWrapperWidth);
    setContainerWidth(newListWidth);
  };

  // 允许展示的最大按钮数量
  const limtNum = useMemo(() => {
    return Math.ceil(wrapperWidth / btnWidth || 0);
  }, [btnWidth, wrapperWidth]);

  const handleMenuList = useCallback(
    (orignData: ITabRadioItemType) => {
      const index = orignData.findIndex((sitem) => {
        return sitem.children?.filter((citem) => citem?.value === value).length;
      });

      if (index > -1) {
        const currList = cloneDeep(orignData[index]);
        const newList = {
          ...find(currList?.children, (aitem) => aitem?.value === value)!,
          children: currList?.children,
        };

        const result = [...orignData];
        result.splice(index, 1, newList);
        setMenuList(result);
        return result;
      }
      setMenuList(orignData);
      return orignData;
    },
    [value],
  );

  useEffect(() => {
    setOptions(handleMenuList(menuList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleMenuList]);

  // 超出宽度后隐藏的列表
  const extraMenuList = useMemo(() => {
    const offsetNum = Math.floor(Math.abs(offetX / btnWidth));
    const preList = menuList?.slice(0, offsetNum);
    const suffList = menuList?.slice(limtNum + offsetNum);
    return [...preList, ...suffList]?.map((item) => ({ value: item.value, label: item.label }));
  }, [btnWidth, limtNum, menuList, offetX]);

  // 处理超出宽度后隐藏列表的点击事件
  const handleExtraMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const index = menuList.findIndex((sitem) => {
        return sitem.value === key;
      });

      // 剩余宽度（除去完整按钮宽度 剩下的宽度）
      const remainWidth = limtNum * btnWidth - wrapperWidth;
      // 偏移量
      const newOffetX = btnWidth * (index + 1 - limtNum) + remainWidth;

      setOffetX((newOffetX > 0 ? newOffetX : 0) * -1);
      onChange?.(key);
    },
    [btnWidth, limtNum, menuList, onChange, wrapperWidth],
  );

  useEffect(() => {
    if (wrapperWidth >= containerWidth) {
      setOffetX(0);
    } else {
      handleExtraMenuClick({ key: value });
    }
  }, [containerWidth, handleExtraMenuClick, value, wrapperWidth]);

  useEffect(() => {
    setOptions(handleMenuList(dataSource));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  useEffect(initData, [getBtnRef, menuList]);
  useEventListener('resize', initData);

  return (
    <div className="radio-tabs" id="radioTabs" ref={getBtnRef('radioTabsWrapper')}>
      <div
        className={classNames('radio-list-wrapper', {
          'menu-pre-shadow': extraMenuList?.length && offetX !== 0,
          'menu-suff-shadow':
            extraMenuList?.length && offetX + (containerWidth - wrapperWidth) !== 0,
        })}
        ref={getBtnRef('radioListWrapper')}
      >
        <div
          style={{
            transform: `translate(${offetX}px, 0px)`,
          }}
          ref={getBtnRef('radioListContainer')}
          className="radio-list-container"
          onClick={(e) => {
            // e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Radio.Group
            value={value}
            className="radio-tabs-group"
            onChange={({ target: { value: selectedValue } }: RadioChangeEvent) => {
              onChange?.(selectedValue);
            }}
          >
            {options?.map((item) => {
              if (item.children && item.children.length) {
                return (
                  <Dropdown
                    key={item.value}
                    open={menuItemVisible}
                    overlayStyle={overlayStyle}
                    onOpenChange={(visible) => {
                      setMenuItemVisible(visible && value === item.value);
                    }}
                    overlay={
                      <Menu
                        onClick={({ key }) => {
                          setMenuItemVisible(false);
                          onChange?.(key);
                        }}
                        selectedKeys={[item.value]}
                        items={item?.children?.map((citem) => ({
                          key: citem?.value,
                          label: citem?.label,
                        }))}
                      />
                    }
                    trigger={['click']}
                    getPopupContainer={() => {
                      return document.getElementById('radioTabs') || document.body;
                    }}
                  >
                    <Tooltip title={item.label}>
                      <Radio.Button value={item.value} onClick={(e) => e.preventDefault()}>
                        <div
                          style={{
                            overflow: 'hidden',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Space size={0}>
                            <div
                              className="list-item-ellipsis"
                              style={{
                                width: 50,
                              }}
                            >
                              {item.label}
                            </div>
                            <DownOutlined />
                          </Space>
                        </div>
                      </Radio.Button>
                    </Tooltip>
                  </Dropdown>
                );
              }
              return (
                <Tooltip title={item?.label} key={item?.value}>
                  <Radio.Button value={item?.value}>
                    <div className="list-item-ellipsis">{item?.label}</div>
                  </Radio.Button>
                </Tooltip>
              );
            })}
          </Radio.Group>
        </div>
      </div>
      {!!extraMenuList?.length && (
        <Dropdown
          overlay={
            <Menu
              items={extraMenuList?.map(({ label, value: val }) => ({ label, key: val }))}
              onClick={handleExtraMenuClick}
            />
          }
          trigger={['click']}
        >
          <Button className="extra-operate-btn" icon={<EllipsisOutlined />} />
        </Dropdown>
      )}
    </div>
  );
};
export default memo(Index);
