/** 输变电检修信息 */
import CardWrapper from '@/components/CardWrapper';
import LabelsView from '@/components/LabelsView';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import { marginGap } from '@/utils/constant';
import { renderOptions } from '@/utils/enumHelper';
import { Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import Condition from './Condition';
import { dataTypeEnum, getTransColumns, showTypeEnum } from './config';
import { useRequestAid } from './hooks';

const Index = () => {
  const [dataType, setDataType] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [{ loading, filtedData, showType, timeText }, { setShowType }] = useRequestAid(dataType);

  useEffect(() => {
    form.setFieldsValue({
      showType,
      dataType,
    });
  }, [form, showType, dataType]);

  return (
    <Page loading={loading}>
      <Condition
        timeText={timeText}
        filtedData={filtedData}
        showType={showType}
        dataType={dataType}
      />
      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <Form
          layout="inline"
          form={form}
          onValuesChange={(changedValue) => {
            if (Reflect.has(changedValue, 'showType')) {
              setShowType(changedValue?.showType?.[0]);
              // 如果选择计划则不区分数据类型
              if (changedValue?.showType?.[0] === showTypeEnum[0].id) {
                setDataType(null);
              }
              return;
            }
            if (Reflect.has(changedValue, 'dataType')) {
              setDataType(changedValue?.dataType);
            }
          }}
        >
          <Form.Item name="showType">
            <LabelsView dataSource={showTypeEnum} single style={{ marginBottom: marginGap }} />
          </Form.Item>
          {showType === showTypeEnum[1].id && (
            <Form.Item name="dataType">
              <Select style={{ width: 200 }}>{renderOptions(dataTypeEnum, true)}</Select>
            </Form.Item>
          )}
        </Form>
        <PageTable
          key={showType}
          bordered
          scroll={{ y: 600 }}
          rowKey="key"
          pagination={false}
          columns={getTransColumns(showType as string)}
          dataSource={filtedData}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
