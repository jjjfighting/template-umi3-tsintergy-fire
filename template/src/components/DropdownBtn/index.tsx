/**
 * 按钮带下拉选项
 */

import { Divider, Dropdown, Menu } from 'antd';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface.js';
import type { FC } from 'react';
import Style from './index.less';

const Index: FC<{
  options: {
    id: string;
    name: string;
  }[];
  onClick?: MenuClickEventHandler;
}> = ({ options, children, onClick }) => {
  return (
    <Dropdown
      overlay={
        <Menu onClick={onClick}>
          {options.map((item) => (
            <Menu.Item key={item.id}>{item.name}</Menu.Item>
          ))}
        </Menu>
      }
    >
      <div className={Style.DropdownBtnBox}>
        <div className={Style.Left}>{children}</div>
        <Divider type="vertical" className={Style.Divider} />
        <div className={Style.Right}>
          <i className="ppsfont icon-xia" />
        </div>
      </div>
    </Dropdown>
  );
};

export default Index;
