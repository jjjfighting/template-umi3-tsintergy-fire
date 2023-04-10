/**
 * 导入文件，错误弹窗
 */
import ModalWrapper from '@/components/ModalWrapper';
import { Table } from 'antd';
import React, { useImperativeHandle, useState } from 'react';

interface IUploadFailFile {
  mRef: any;
}

const UploadFailFile: React.FC<IUploadFailFile> = (props) => {
  const { mRef } = props;
  const [visible, setvisible] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);

  useImperativeHandle(mRef, () => ({
    showModal: (data: any[]) => {
      setvisible(true);
      setDataSource(data);
    },
  }));
  const columns = [
    {
      title: '数据日期',
      dataIndex: 'date',
      key: 'date',
      width: 200,
      render: (v: string) => <span style={{ color: 'red' }}>{v}</span>,
    },
    {
      title: '细节',
      dataIndex: 'detail',
      key: 'detail',
      width: 200,
      render: (v: string) => <span style={{ color: 'red' }}>{v}</span>,
    },
    {
      title: '导入文件',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 200,
    },
  ];

  return (
    <ModalWrapper
      title="导入信息"
      visible={visible}
      width={1200}
      footer={null}
      onCancel={() => {
        setvisible(false);
      }}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={false}
        scroll={{ y: 500 }}
      />
    </ModalWrapper>
  );
};

export default UploadFailFile;
