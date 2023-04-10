import { Radio, Tooltip } from 'antd';
import type { FC, ReactElement } from 'react';
import { memo, useMemo } from 'react';
import Styles from './index.less';
import type { EchartTableRadioType } from './types';

interface props {
  value: EchartTableRadioType[];
  style?: React.CSSProperties;
  showAll?: boolean; // 默认为可选中全部，即图/表都需要展示
  onChange?: (value: EchartTableRadioType[]) => void;
}

// 统一图/表 选择按钮
const Index: FC<props> = ({ onChange, value, showAll = false, style }): ReactElement => {
  const options = useMemo(() => {
    // 默认选项
    const result = [
      // 图表
      { label: <i className={`ppsfont icon-tu`} />, value: 'echart', text: '图' },
      // 表格
      { label: <i className={`ppsfont icon-biao`} />, value: 'table', text: '表' },
    ];
    // 展示全部
    if (showAll)
      result.unshift({
        label: <i className={`ppsfont icon-quanbu`} />,
        value: 'all',
        text: '全部',
      });
    return result;
  }, [showAll]);

  // 选中的值
  const checkValue = useMemo(() => {
    if (value?.includes('echart') && value?.includes('table')) {
      return 'all';
    }
    return value?.[0];
  }, [value]);

  return (
    <Radio.Group
      style={style}
      className={Styles.EchartTableRadio}
      optionType="button"
      value={checkValue}
      onChange={(event) => {
        if (!onChange) return;
        const val = event.target.value;
        if (val === 'all') onChange(['echart', 'table']);
        else onChange([val]);
      }}
    >
      {options.map((item) => (
        <Tooltip title={item.text} key={item.value}>
          <Radio.Button value={item.value}>
            <div className="echart-table-radio-content">{item.label}</div>
          </Radio.Button>
        </Tooltip>
      ))}
    </Radio.Group>
  );
};

export default memo(Index);
