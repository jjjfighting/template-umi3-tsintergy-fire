import { YMD } from '@/utils/timeUtils';
import { useMount } from 'ahooks';
import { DatePicker } from 'antd';
import type { RangePickerDateProps } from 'antd/lib/date-picker/generatePicker';
import type { Moment } from 'moment';
import moment from 'moment';
import { useEffect, useState } from 'react';

/**
 * 用于选择范围的组件
 * maxType: moment 类型
 * maxCount: 数
 * @param props
 * @returns
 */

interface Props extends Omit<RangePickerDateProps<Moment>, 'picker'> {
  maxType?: moment.unitOfTime.Diff;
  maxCount?: number;
  minCount?: number;
  minType?: moment.unitOfTime.Diff;
  picker?: 'date' | 'month';
  moreDisableDate?: (current: Moment, startDate?: Moment, endDate?: Moment) => boolean;
}
const Index = (props: Props) => {
  const {
    maxType = 'year',
    value,
    minCount,
    minType,
    maxCount = 1,
    onChange,
    allowClear = false,
    moreDisableDate,
    defaultValue,
    ...rest
  } = props;
  const [dates, setDates] = useState<any>([]);
  const [hackValue, setHackValue] = useState<any>();
  const [optionsStep, setOptionsStep] = useState<number>(0);

  const disabledDate = (current: Moment) => {
    if (!dates?.length || !dates?.[0] || !dates?.[1]) {
      return !!moreDisableDate?.(current, dates?.[0], dates?.[1]);
    }
    let tooLateMin = false;
    let tooEarlyMin = false;
    const tooLate = dates[0] && current.diff(dates[0], maxType) >= maxCount;
    const tooEarly = dates[1] && dates[1].diff(current, maxType) >= maxCount;
    if (minCount && minType) {
      tooLateMin =
        dates[0] &&
        current.diff(dates[0], 'days') >= 0 &&
        current.diff(dates[0], minType) < minCount - 1;
      tooEarlyMin =
        dates[1] &&
        dates[1].diff(current, 'days') >= 0 &&
        dates[1].diff(current, minType) < minCount - 1;
    }
    return (
      !!moreDisableDate?.(current, dates[0], dates[1]) ||
      tooEarly ||
      tooLate ||
      tooEarlyMin ||
      tooLateMin
    );
  };

  // 负荷规则
  const passRule = (testDates: Moment[]) =>
    testDates?.[0] && testDates?.[1] && testDates[1].diff(testDates[0], maxType) <= maxCount;

  useMount(() => {
    if (defaultValue) {
      setDates(defaultValue);
    }
  });

  useEffect(() => {
    setDates(value);
  }, [value]);

  const onOpenChange = async (open: boolean) => {
    if (open) {
      setOptionsStep(0);
      setHackValue(value);
      setDates([]);
      return;
    }

    // 不符合规则 回归原值
    // optionsStep 必须要操作两步才能算完成一次日期选择
    let realStep = optionsStep;
    await setOptionsStep((e) => {
      realStep = e;
      return e;
    });
    if (!passRule(dates) || realStep !== 2) {
      setDates(value);
    }
    setHackValue(undefined);
  };

  return (
    <DatePicker.RangePicker
      allowClear={allowClear}
      defaultPickerValue={hackValue || dates || value}
      value={hackValue || dates}
      disabledDate={disabledDate}
      onOpenChange={onOpenChange}
      suffixIcon={<i className="icon-riqi ppsfont" />}
      onCalendarChange={(val: any, _dateStrings: [string, string], info: any) => {
        let realStep = optionsStep;
        setOptionsStep((e) => {
          realStep = e + 1;
          return e + 1;
        });
        if (info.range === 'start' && !dates?.[1]) {
          setHackValue([val[0], val[0]]);
          setDates([val[0], val[0]]);
        }
        if (info.range === 'end' && !dates?.[0]) {
          setHackValue([val[1], val[1]]);
          setDates([val[1], val[1]]);
        }
        if (passRule(val) && realStep === 2) {
          setDates(value);
          setHackValue(value);
          onChange?.(
            val,
            val.map((p: any) => moment(p).format(YMD)),
          );
        }
      }}
      onChange={(changeDates) => {
        // 清空的状态
        if (!changeDates) {
          setDates([undefined, undefined]);
          setHackValue([undefined, undefined]);
          onChange?.(null, ['', '']);
        }
      }}
      {...rest}
    />
  );
};

export default Index;
