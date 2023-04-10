import CardWrapper from '@/components/CardWrapper';
import ModalWrapper from '@/components/ModalWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import useEnumHook from '@/hooks/useEnumHook';
import useInitialState from '@/hooks/useInitialState';
import { publicModel } from '@/pages/PublicDataManage/model';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { YMD } from '@tsintergy/ppss';
import { useMount, useBoolean } from 'ahooks';
import { Button, Form, Row, Select } from 'antd';
import { map } from 'lodash';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { memo, useEffect } from 'react';
import { useSelector } from 'umi';
import { showTypeEnum } from '../../config';
import { useTimeTextAid } from '../../hooks';
import type { IShowType } from '../types';

const PayloadCondition: FC<{
  selfShowTypeEnum?: { label: string; value: string }[] | null;
  tipsText?: string;
}> = ({ selfShowTypeEnum, tipsText }) => {
  const { dataLen } = useEnumHook();
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();
  const { runDates, runDate, showType, showMode } = useSelector(publicModel.selector);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [visible, { set: setVisible }] = useBoolean(false); // 模态窗控制(内部控制)

  useMount(() => {
    publicModel.actions.update({
      showType: (selfShowTypeEnum ?? showTypeEnum)?.[0]?.value as IShowType | undefined,
    });
  });

  useEffect(() => {
    form.setFieldsValue({
      runDates,
      showType,
      showMode,
    });
  }, [form, runDates, showMode, showType]);

  return (
    <CardWrapper shadow>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          onValuesChange={(changedValue, allValue) => {
            if (Reflect.has(changedValue, 'runDates')) {
              publicModel.actions.update({
                runDates: changedValue?.runDates as [Moment, Moment],
                runDate: runDate.isBetween(
                  changedValue?.runDates?.[0],
                  changedValue?.runDates?.[1],
                  'day',
                  '[]',
                )
                  ? runDate
                  : (changedValue?.runDates?.[0] as Moment),
              });
              return;
            }
            publicModel.actions.update(allValue);
          }}
        >
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker maxCount={1} maxType="year" allowClear={false} />
          </Form.Item>
          <Form.Item name="showType" label="数据展示">
            <Select style={{ width: 90 }} options={selfShowTypeEnum ?? showTypeEnum} />
          </Form.Item>

          <Form.Item name="showMode" label="数据维度">
            <Select
              style={{ width: 90 }}
              options={map(dataLen, ({ name, id }) => ({ label: name.slice(0, 3), value: id }))}
            />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ color: 'var(--neutral-color3)', marginRight: 5 }} />
            {useTimeTextAid(tipsText)}
          </Form.Item>
        </Form>
        <Button
          icon={<i className="icon ppsfont icon-daochu" />}
          type="link"
          onClick={() => {
            modalForm.setFieldsValue({
              date: runDates,
            });
            setVisible(true);
          }}
        >
          下载数据
        </Button>
      </Row>

      {/* 下载数据模态框 */}
      <ModalWrapper
        title="下载数据"
        okText="下载"
        open={visible}
        width={400}
        onOk={() => {
          if (!modalForm.getFieldValue('date')) return;
          window.open(
            `${API_PREFIX}/api/data/public/all/export?provinceAreaId=${systemProvinceAreaId}&startDate=${modalForm
              .getFieldValue('date')[0]
              .format(YMD)}&endDate=${modalForm
              .getFieldValue('date')[1]
              .format(YMD)}&dataPoint=${showMode}`,
          );
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={modalForm}>
          <Form.Item name="date" label="日期选择：">
            <RangeDatePicker maxCount={99} maxType="year" allowClear={false} />
          </Form.Item>
        </Form>
      </ModalWrapper>
    </CardWrapper>
  );
};

export default memo(PayloadCondition);
