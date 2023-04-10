// 树形穿梭框
import ModalWrapper from '@/components/ModalWrapper';
import { marginGap } from '@/utils/constant';
import { Button, Empty, Form, Input, message, Modal, Row, Space, Transfer, Tree } from 'antd';
import { difference } from 'lodash';
import type { FC, ReactElement } from 'react';
import { useImperativeHandle, useMemo, useState } from 'react';
import Styles from './index.less';
import type { IDataNode, IUnitGroupData, TransferTreeFace } from './types';

const TransferTree: FC<TransferTreeFace> = ({
  mRef,
  type, // 区分机组或场站(区分组件内组件、场站字眼)
  targetKeys, // 选中的key（在右边树的key）
  dataSource, // 数据源
  onSearch, // 点击查询按钮的回调
  onSave, // 点击保存按钮的回调
  onDelete, // 点击删除按钮的回调
  loading, // 是否加载
  ...restProps // 其他属性
}): ReactElement => {
  const [form] = Form.useForm();

  // 控制穿梭弹窗显示
  const [visible, setVisible] = useState<boolean>(false);
  // 控制机组名称弹窗显示
  const [editNameVisible, setEditNameVisible] = useState<boolean>(false);

  // 待编辑的组合数据
  const [unitGroupData, setUnitGroupData] = useState<IUnitGroupData>();

  // add : 新增  type ： 编辑
  const editType = useMemo(() => {
    return unitGroupData?.id ? 'edit' : 'add';
  }, [unitGroupData?.id]);

  /**
   * 关闭
   */
  const onClose = () => {
    setVisible(false);
  };

  /**
   * 暴露方法
   */
  useImperativeHandle(mRef, () => ({
    showModal: (groupData) => {
      setUnitGroupData(groupData);
      form.setFieldsValue({ groupName: groupData?.combinationName });
      setVisible(true);
    },
    onClose,
  }));

  /**
   * 生成树数据
   */
  const generateTree = (
    treeNodes: IDataNode[] = [],
    checkedKeys: (string | number)[] = [],
    direction: 'left' | 'right', // 左边树 ｜ 右边树
  ): IDataNode[] => {
    // 1.根据已有数据从数据源生成应该返回的树类型
    const treeKeys = treeNodes.map((t) => t.key);
    const nodes = dataSource.reduce((acc: IDataNode[], item) => {
      // 1.1包含父节点 返回该节点以及子节点
      if (item.key && treeKeys.includes(item.key)) {
        return [...acc, { ...item }];
      }

      // 1.2 未包含父节点但包含其中的子节点，则返回该节点以及对应的子节点
      const searchChildren = item?.children?.filter((sitem) => treeKeys.includes(sitem.key)) ?? [];

      if (searchChildren.length > 0) {
        return [...acc, { ...item, children: searchChildren }];
      }

      // 1.3 原样返回
      return acc;
    }, []);

    // 2. 返回对应的左/右树形数据
    const result = nodes.reduce((acc: IDataNode[], item: IDataNode) => {
      // 二级目录是否包含
      // 返回包含的目录（子目录包含也返回）
      if (direction === 'left') {
        const searchChildren =
          item?.children?.filter((sitem) => !checkedKeys.includes(sitem.key)) ?? [];
        if (searchChildren.length > 0) {
          return [...acc, { ...item, children: searchChildren }];
        }
      }
      if (direction === 'right') {
        const searchChildren =
          item?.children?.filter((sitem) => checkedKeys.includes(sitem.key)) ?? [];
        if (searchChildren.length > 0) {
          return [...acc, { ...item, children: searchChildren }];
        }
      }

      return acc;
    }, []);

    return result;
  };

  /**
   * 穿梭框数据源
   */
  const transferDataSource = useMemo(() => {
    return dataSource?.reduce((acc: IDataNode[], item) => {
      if (item?.children && item?.children.length) {
        return [
          ...acc,
          ...item.children.map((sitem) => {
            return {
              title: sitem.title,
              key: sitem.key ?? (undefined as string | undefined),
            };
          }),
        ];
      }
      return [...acc];
    }, []);
  }, [dataSource]);

  /**
   * 保存前
   */
  const beforeSave = () => {
    // 新增弹窗填写名称
    if (!targetKeys.length) {
      message.warning(`请先选择${typeName}`);
      return;
    }
    if (editType === 'add') {
      setEditNameVisible(true);
      return;
    }
    handleSave();
  };

  /**
   * 保存方法
   */
  const handleSave = async () => {
    const values = await form.validateFields();
    await onSave?.({
      id: unitGroupData?.id ?? '',
      combinationName: values.groupName,
      orgIds: targetKeys,
    });
    setEditNameVisible(false);
    onClose();
  };

  /**
   * 删除方法
   */
  const handleDel = () => {
    if (!unitGroupData?.id) return;
    Modal.confirm({
      content: `是否删除该${typeName}组合？`,
      onOk: async () => {
        await onDelete?.(unitGroupData.id);
        onClose();
      },
    });
  };

  const typeName = useMemo(() => {
    if (type === 'unit') return '机组';
    if (type === 'station') return '场站';
    return '';
  }, [type]);

  return (
    <ModalWrapper
      footer={null}
      title={`自定义${typeName}`}
      maskClosable={false}
      visible={visible}
      destroyOnClose
      onCancel={onClose}
      width={650}
    >
      {editType === 'edit' && (
        <Form
          style={{ marginBottom: marginGap }}
          form={form}
          layout="inline"
          initialValues={{ groupName: unitGroupData?.combinationName }}
        >
          <Form.Item
            name="groupName"
            label={`${typeName}组合`}
            rules={[
              {
                required: true,
                message: `${typeName}组合名称不能为空`,
              },
            ]}
          >
            <Input style={{ width: 216 }} placeholder="请输入" maxLength={20} />
          </Form.Item>
        </Form>
      )}
      <Transfer
        {...restProps}
        className={Styles.transferBox}
        titles={[`未选中${typeName}`, `已选中${typeName}`]}
        targetKeys={targetKeys}
        locale={{ searchPlaceholder: `请输入${typeName}名称搜索` }}
        showSearch
        dataSource={transferDataSource}
        showSelectAll
        filterOption={(inputValue, item) => {
          return item?.title?.indexOf(inputValue) !== -1;
        }}
      >
        {({ direction, onItemSelectAll, filteredItems, selectedKeys: checkedKeys }) => {
          const treeData = generateTree(filteredItems as IDataNode[], targetKeys, direction);
          // 无数据
          if (!treeData?.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
          return (
            <div>
              <Tree
                blockNode
                checkable
                selectedKeys={[]}
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={treeData}
                className={Styles.treeBox}
                switcherIcon={<i className="ppsfont icon-xia" />}
                onCheck={(keys) => {
                  const resultKey = difference(
                    keys as string[],
                    dataSource?.map((item) => item.key as string),
                  );

                  onItemSelectAll(difference(resultKey, checkedKeys), true);
                  onItemSelectAll(difference(checkedKeys, resultKey), false);
                }}
              />
            </div>
          );
        }}
      </Transfer>

      <Row justify="end" gutter={marginGap} style={{ marginTop: marginGap }}>
        <Space>
          <Button type="text" onClick={onClose}>
            取消
          </Button>
          {editType === 'edit' && (
            <>
              <Button type="primary" danger onClick={handleDel} loading={loading}>
                删除
              </Button>
              <Button type="primary" onClick={beforeSave} loading={loading}>
                保存
              </Button>
            </>
          )}

          {editType === 'add' && (
            <>
              <Button type="primary" ghost onClick={beforeSave} loading={loading}>
                设为常用组合
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  if (!targetKeys.length) {
                    message.warning(`请先选择${typeName}`);
                    return;
                  }
                  onSearch?.();
                  onClose();
                }}
              >
                查询
              </Button>
            </>
          )}
        </Space>
      </Row>

      {/* 新增组合填写名称 */}
      {editType === 'add' && (
        <ModalWrapper
          title={`编辑${typeName}组合名称`}
          centered
          maskClosable={false}
          visible={editNameVisible}
          bodyStyle={{ paddingTop: 0, paddingBottom: 14 }}
          confirmLoading={loading}
          onOk={handleSave}
          onCancel={() => setEditNameVisible(false)}
          width={360}
        >
          <Form form={form} layout="inline" initialValues={{ groupName: '' }}>
            <Form.Item
              name="groupName"
              style={{ width: '100%' }}
              label=""
              rules={[
                {
                  required: true,
                  message: `${typeName}组合名称不能为空`,
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={20} />
            </Form.Item>
          </Form>
        </ModalWrapper>
      )}
    </ModalWrapper>
  );
};

export default TransferTree;
