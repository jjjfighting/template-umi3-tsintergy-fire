/* 排名抽屉组件 */
import { format } from '@tsintergy/calc';
import { useBoolean } from 'ahooks';
import { Col, Drawer, Menu, Row, Spin, Table } from 'antd';
import { isNaN } from 'lodash';
import type { FC, MutableRefObject, ReactNode } from 'react';
import { memo, useImperativeHandle } from 'react';
import { useFormatAid, useMenuAid } from './hooks';
import Styles from './index.less';
import type { ChildType, MenuType } from './types';

const Index: FC<{
  /* 控制开关的引用 */
  mRef: MutableRefObject<{ showDrawer: () => void } | null>;
  /* 二级菜单列表 */
  menuList: MenuType[];
  /* 额外的右上方Condition */
  extraConditionTopSlot?: ReactNode;
  /* 额外的表格上方Condition */
  extraCondition?: ReactNode;
  loading?: boolean;
}> = ({ mRef, menuList = [], extraConditionTopSlot, extraCondition, loading }) => {
  const [visible, { set: setVisible }] = useBoolean(false);

  useImperativeHandle(mRef, () => ({
    showDrawer: () => {
      setVisible(true);
    },
  }));

  /* 菜单处理 */
  const [{ openKeys, selectedNode, childrenList }, { setOpenKeys, setSelectedNode }] = useMenuAid(
    menuList,
  );

  /* 数据格式化 */
  const [{ bannerInfo }, { handleClick, ratedDataSource }] = useFormatAid(
    selectedNode,
    childrenList,
    setSelectedNode,
  );

  return (
    <Drawer
      mask
      contentWrapperStyle={{ width: 1000 }}
      className={Styles.RankDrawer}
      destroyOnClose
      size="large"
      title="排名看板"
      closable={false}
      extra={
        <i
          className="ppsfont icon-weixuanzhong9"
          style={{
            fontSize: 24,
            marginTop: 4,
            color: 'var(--neutral-color4)',
            cursor: 'pointer',
          }}
          onClick={() => setVisible(false)}
        />
      }
      visible={visible}
      maskClosable={true}
      footer={null}
      onClose={() => {
        setVisible(false);
      }}
      getContainer={document.body}
    >
      <Spin spinning={!!loading}>
        <Row style={{ height: '100%' }}>
          <Col span={5} className={Styles.sider}>
            <Menu
              theme="light"
              mode="inline"
              onClick={handleClick}
              onOpenChange={(keys: string[]) => setOpenKeys(keys)}
              openKeys={openKeys} // 打开
              selectedKeys={selectedNode?.childKey ? [selectedNode?.childKey] : []} // 选中
            >
              {/* 生成菜单树 */}
              {menuList.map(({ key, title, children }) => {
                return (
                  <Menu.ItemGroup key={`${key}_group`}>
                    <Menu.SubMenu title={title} key={key}>
                      {children?.map(({ childKey, childTitle }) => {
                        return <Menu.Item key={childKey}>{childTitle}</Menu.Item>;
                      })}
                    </Menu.SubMenu>
                  </Menu.ItemGroup>
                );
              })}
            </Menu>
          </Col>
          <Col span={19} style={{ paddingLeft: 20 }}>
            {extraConditionTopSlot}
            <div className={Styles.BannerText}>
              {/* 求和或加权平均值 */}
              <span>各厂汇总/加权平均:</span>
              <span>
                <span style={{ fontWeight: 'bold' }}>
                  {format(bannerInfo.value, { fallback: '-' })}
                </span>
                &nbsp;{bannerInfo.mergeUnit}
              </span>
            </div>
            {/* 额外的筛选条件 */}
            {extraCondition}
            <Table
              pagination={false}
              rowKey="orgId"
              scroll={{ x: 'max-content' }}
              dataSource={ratedDataSource}
              columns={[
                {
                  title: '排名序号',
                  render: (_text: string, _record: any, index: number) => index + 1,
                  width: 40,
                },
                {
                  title: '电厂',
                  dataIndex: 'orgName',
                  width: 70,
                },
                {
                  title: `数值`,
                  // title: `数值(${bannerInfo.mergeUnit})`,
                  dataIndex: 'proportion',
                  width: 220,
                  render: (
                    _proportion: number,
                    {
                      rate,
                      value,
                      orgValue,
                      negativeRate,
                      positiveRate,
                    }: typeof ratedDataSource[number],
                  ) => {
                    return (
                      <div className={Styles.rateTdWrapper}>
                        <div className={Styles.rectangle}>
                          {/* 负数部分 */}
                          <div
                            style={{
                              height: '100%',
                              flex: `0 0 ${negativeRate * 100}%`, // 比例 映射到 宽度
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            {value < 0 && (
                              <div
                                style={{
                                  backgroundColor: 'var(--assist3-color)',
                                  height: '100%',
                                  width: `${100 * rate}%`, // 比例映射到宽度
                                }}
                              />
                            )}
                          </div>
                          {/* 正数部分 */}
                          <div
                            style={{
                              height: '100%',
                              flex: `0 0 ${positiveRate * 100}%`,
                              display: 'flex',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {value > 0 && (
                              <div
                                style={{
                                  backgroundColor: 'var(--primary-color)',
                                  height: '100%',
                                  width: `${100 * rate}%`,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className={Styles.valueDiv}>{`${orgValue ?? ''}${
                          typeof orgValue === 'number' ||
                          (typeof orgValue === 'string' &&
                            orgValue !== '' &&
                            !isNaN(Number(orgValue)))
                            ? selectedNode?.unit
                            : ''
                        }`}</div>
                        {/* <div className={Styles.valueDiv}>
                        { typeof orgValue === 'number' || (typeof orgValue === 'string' && orgValue !== '' && !isNaN(Number(orgValue)))
                          ? getValueScale(orgValue).value : ''}
                      </div> */}
                      </div>
                    );
                  },
                },
              ]}
            />
          </Col>
        </Row>
      </Spin>
    </Drawer>
  );
};

export default memo(Index);
export type { MenuType, ChildType };
