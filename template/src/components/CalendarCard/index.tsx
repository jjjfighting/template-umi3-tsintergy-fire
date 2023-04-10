import CustomSelect from '@/components/CustomSelect';
import SpaceVertical from '@/components/SpaceVertical';
import { accCalc } from '@/utils/calc.legacy';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Calendar, Col, DatePicker, Divider, Row, Space } from 'antd';
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { Moment } from 'moment';
import moment from 'moment';
import type { FC, ReactElement } from 'react';
import React, { memo, useMemo, useState } from 'react';
import style from './index.less';

// TODO 这个 “该日期数据已经导入” 这个东西按钮还没有做，要和后端约定一下数据格式

/**
 * 上传文件组件
 * @param value date 日期  Moment 对象
 * @param onChange 日期变化回调
 * @param onPanelChange 日期面板变化回调
 * @param onSelect 点击选择日期回调
 * @param filterType 筛选按钮下来框
 *
 * eg: <CalendarCard
        value={today}
        onChange={(date: Moment) => {

        }}
        onSelect={(date: Moment) => {
          // 这里应该用来保存数据，
          console.log('date', date);
          setToday(date);
        }}
        allUploadList={['2021-03-02', '2021-03-05', '2021-03-07']}
        noUploadList={['2021-03-04', '2021-03-03', '2021-03-06']}
      />
 */

interface CalendarCard {
  value: Moment;
  allUploadList?: string[]; // ['2021-03-02', '2021-03-03', '2021-03-03']
  noUploadList?: string[]; // ['2021-03-02', '2021-03-03', '2021-03-03']
  someUploadList?: string[]; // ['2021-03-02', '2021-03-03', '2021-03-03']
  filterType?: OptionList[];
  dataItemList?: string[];
  dataItemListDetail?: string[];
  dateChangeCb: (calcType: 'add' | 'subtract', num: number, time: 'month' | 'year') => void; // 月、年日期改变回调
  backToday?: () => void;
  customSelectChange?: (list: CheckboxValueType[]) => void;
  onChange?: (date: Moment) => void; // 日期变化回调
  onPanelChange?: (date: Moment, mode: string) => void; // 日期面板变化回调
  onSelect: (date: Moment) => void; // 点击选择日期回调
}

const Index: FC<CalendarCard> = ({
  value,
  noUploadList = [],
  someUploadList = [],
  allUploadList = [],
  filterType,
  dataItemList,
  dataItemListDetail,
  customSelectChange,
  dateChangeCb,
  backToday,
  onChange,
  onPanelChange,
  onSelect,
}): ReactElement => {
  const [type, setType] = useState<boolean>(true);

  const changeType = () => {
    setType(!type);
  };

  const allUploadCircle = <div className={style.circleDiv} />;

  const noUploadCircle = <div className={style.circleSomeDiv} />;

  const someUploadCircle = <div className={style.circleDivRed} />;

  const weekHight = useMemo(() => {
    const newWeek = moment(value).startOf('month').week();
    let week: number;
    // 如果 选中时间 value 所在月的第一天 是 所在的周的第一天 和 value 是同一年
    // 不跨年：week = moment(value).startOf('month').week();
    // 跨年：week = 0
    if (
      moment(value).startOf('month').startOf('week').isSame(moment(value).startOf('year'), 'year')
    ) {
      week = newWeek;
    } else {
      week = 0;
    }

    const hight = accCalc.subtract(moment(value).week(), week);
    switch (hight) {
      case 0:
        return -22;
      case 1:
        return -65;
      case 2:
        return -108;
      case 3:
        return -151;
      case 4:
        return -193;
      default:
        return -20;
    }
  }, [value]);

  return (
    <div className={type ? style.calendarCard : style.calendarCardShow}>
      <Row className={style.calendarRow} wrap={false}>
        <Col flex={'150px'} className={style.headerDate}>
          {type ? (
            <>
              <SpaceVertical
                size={1}
                style={{
                  textAlign: 'left',
                  justifyContent: 'space-around',
                  lineHeight: '12px',
                  zIndex: 999,
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--neutral-color5)' }}>
                  日期选择
                </span>
                <DatePicker
                  format="YYYY年MM月DD日"
                  value={value}
                  style={{ width: '152px' }}
                  suffixIcon={<div />}
                  allowClear={false}
                  bordered={false}
                  onChange={(date: Moment | null, dateString: string) => {
                    if (date) {
                      onSelect(date);
                    }
                  }}
                />
              </SpaceVertical>
            </>
          ) : null}
        </Col>
        <Col
          flex={'auto'}
          //  span={19}
          className={style.calendarCol}
        >
          {type ? (
            <div className={style.canlendarDiv}>
              <Calendar
                style={{ position: 'relative', top: weekHight }}
                className={style.calendarBody}
                fullscreen={false}
                onSelect={onSelect}
                onChange={onChange}
                value={value}
                headerRender={() => <div />}
                onPanelChange={onPanelChange}
                dateCellRender={(date: Moment) => {
                  return (
                    <div style={{ marginTop: '5px' }} className={style.dateCellLayout}>
                      {allUploadList.find((v) => moment(v).isSame(date)) ? allUploadCircle : null}
                      {someUploadList.find((v) => moment(v).isSame(date)) ? someUploadCircle : null}
                      {noUploadList.find((v) => moment(v).isSame(date)) ? noUploadCircle : null}
                    </div>
                  );
                }}
              />
            </div>
          ) : (
            <Col span={24} className={style.headerDateTitle}>
              <Space>
                <DoubleLeftOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dateChangeCb('subtract', 1, 'year');
                  }}
                />
                <LeftOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dateChangeCb('subtract', 1, 'month');
                  }}
                />
                <span style={{ fontSize: '20px', color: 'var(--neutral-color7)' }}>
                  {value.format('YYYY年MM月')}
                </span>
                <RightOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dateChangeCb('add', 1, 'month');
                  }}
                />
                <DoubleRightOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dateChangeCb('add', 1, 'year');
                  }}
                />
              </Space>
            </Col>
          )}
        </Col>
        <Col flex={'120px'} className={style.iconCircleOutlined}>
          {/* <CustomSelect
            colon={false}
            value={dataItemList}
            options={filterType as any}
            type="checkbox"
            defaultValue={dataItemListDetail}
            placeholder=""
            checkAllText="全选"
            onChange={(list: CheckboxValueType[]) => {
              customSelectChange(list);
            }}
          /> */}
          <Divider type="vertical" />
          {type ? (
            <Space size={5} onClick={changeType} style={{ fontSize: '14px' }}>
              <i className="icon ppsfont icon-weixuanzhong8" />
              展开日历
            </Space>
          ) : (
            <Space size={5} onClick={changeType} style={{ fontSize: '14px' }}>
              <div style={{ transform: 'rotateZ(180deg)', display: 'inline-block' }}>
                <i className="icon ppsfont icon-weixuanzhong8" />
              </div>
              收起日历
            </Space>
          )}
        </Col>
      </Row>
      <div>
        <Calendar
          className={style.calendarDiv}
          fullscreen={false}
          onSelect={onSelect}
          onChange={onChange}
          value={value}
          headerRender={() => <div />}
          onPanelChange={onPanelChange}
          dateCellRender={(date: Moment) => {
            return (
              <div style={{ marginTop: '5px' }} className={style.dateCellLayout}>
                {allUploadList.find((v) => moment(v).isSame(date)) ? allUploadCircle : null}
                {someUploadList.find((v) => moment(v).isSame(date)) ? someUploadCircle : null}
                {noUploadList.find((v) => moment(v).isSame(date)) ? noUploadCircle : null}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default memo(Index);
