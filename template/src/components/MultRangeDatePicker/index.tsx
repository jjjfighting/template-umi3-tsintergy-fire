import { DatePicker, message, Select, Tag } from 'antd';
import type { PickerDateProps } from 'antd/lib/date-picker/generatePicker';
import type { SelectProps } from 'antd/lib/select';
import cs from 'classnames';
import { cloneDeep, uniqueId } from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';
import type { CSSProperties, FC } from 'react';
import { useMemo, useState } from 'react';
import { getDimensionArr, getTimestamp } from './config';
import Style from './index.less';

type IDatePickerProps = Omit<
  PickerDateProps<Moment>,
  'onChange' | 'value' | 'showToday' | 'open' | 'dateRender' | 'getPopupContainer'
>;

export interface MultRangeDatePickerProps {
  value?: number[][];
  onChange?: (value: any) => void;
  format?: string;
  /** 日期选择message提示与否 */
  showTips?: boolean;
  /** select样式 */
  selectStyle?: CSSProperties;
  /** 日历选中日期样式  */
  dateRenderStyle?: CSSProperties;
  /** select框中tag样式 */
  tagStyle?: CSSProperties;
  selectProps?: SelectProps<any>;
  datePickerProps?: IDatePickerProps;
}

const Index: FC<MultRangeDatePickerProps> = ({
  value: orgDate = [],
  onChange,
  format = 'YYYY-MM-DD',
  showTips = true,
  selectProps = {},
  selectStyle = {},
  dateRenderStyle = {},
  tagStyle = {},
  datePickerProps,
}) => {
  // 日期面板显隐
  const [open, setOpen] = useState(false);

  /**
   * 二维的timeStamp数组number[][] 转换为 string[].
   * 因为Select组件的tagRender无法接收非基本类型数据
   *
   *  [
   *    [1657123200000, 1657209600000],
   *    [1657123200000, 1657209600000],   =>  ['1657123200000-1657209600000', '1657123200000-1657209600000']
   *    ...
   *  ]
   */
  const selectedDate = useMemo(() => orgDate?.map((item) => item?.join('-')), [orgDate]);

  const onValueChange = (date: Moment) => {
    const t = getTimestamp(date);
    const ds = cloneDeep(selectedDate);
    const doubleArr = ds.map((item) => item.split('-'));
    // 拍平
    const flatDs = doubleArr.flat(1);
    const isStart = flatDs.length % 2 === 0;
    // 判断时间戳是否能推入
    for (let i = 0; i < doubleArr.length - 1; i++) {
      // 击中已有时间范围
      const item = doubleArr[i];
      if (Number(item[0]) <= t && Number(item?.[1]) >= t) {
        if (showTips) {
          message.warning('无法重复选中');
        }
        if (!isStart) {
          flatDs.pop();
          onChange?.(getDimensionArr(2, flatDs));
          return;
        }
        return;
      }
    }

    // 此刻选中的end位比start位小
    if (!isStart && Number(flatDs[flatDs.length - 1]) > t) {
      if (showTips) {
        message.warning('时刻范围选择错误');
      }
      flatDs.pop();
      onChange?.(getDimensionArr(2, flatDs));
      return;
    }
    // 推入, 重组
    flatDs.push(t.toString());
    onChange?.(getDimensionArr(2, flatDs));
  };

  // 日期格子渲染
  const dateRender = (currentDate: Moment) => {
    let isSelected = false;
    const time = getTimestamp(currentDate);
    for (let i = 0; i < selectedDate.length; i++) {
      const [start, end] = selectedDate[i]?.split('-')?.map((v) => Number(v));
      if (time >= start && time <= end) {
        isSelected = true;
        break;
      }
    }
    return (
      <div
        className={'ant-picker-cell-inner'}
        style={
          isSelected
            ? {
                position: 'relative',
                zIndex: 2,
                display: 'inlineBlock',
                width: '24px',
                height: '22px',
                lineHeight: '22px',
                backgroundColor: 'var(--primary-color, #9B59B6)',
                color: '#fff',
                margin: 'auto',
                borderRadius: '2px',
                transition: 'background 0.3s, border 0.3s',
                ...dateRenderStyle,
              }
            : {}
        }
      >
        {currentDate.date()}
      </div>
    );
  };

  const renderTag = (value: string, onClose: any) => {
    const handleClose = () => {
      const filterFlatArr = selectedDate
        .filter((item) => item !== value)
        ?.map((item2) => item2.split('-'))
        ?.flat();

      onClose();
      onChange?.(getDimensionArr(2, filterFlatArr));
    };
    const [start, end] = value?.split('-');
    return (
      <Tag key={uniqueId()} onClose={handleClose} closable style={{ ...tagStyle }}>
        {moment(Number(start)).format(format)}至{end ? moment(Number(end)).format(format) : '-'}
      </Tag>
    );
  };

  return (
    <Select
      allowClear
      placeholder={'请选择日期'}
      mode="tags"
      value={selectedDate}
      onClear={() => onChange && onChange([])}
      tagRender={({ value, onClose }: any) => renderTag(value, onClose)}
      open={open}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      dropdownMatchSelectWidth={false}
      dropdownClassName={cs('multipleDropdownClassName', Style.multipleDropdownClassName)}
      dropdownStyle={{ height: '270px', width: '280px', minWidth: '0' }}
      {...selectProps}
      style={selectStyle}
      dropdownRender={() => {
        return (
          <DatePicker
            onChange={onValueChange as any}
            value={'' as any}
            showToday={false}
            open
            dateRender={dateRender}
            style={{ visibility: 'hidden' }}
            getPopupContainer={(_node: HTMLElement) =>
              document.getElementsByClassName('multipleDropdownClassName')[0]
            }
            {...datePickerProps}
          />
        );
      }}
    />
  );
};

export default Index;
