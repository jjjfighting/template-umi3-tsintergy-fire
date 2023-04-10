import { accCalc, autoFixed, toZero } from '@/utils/calc.legacy';
import { format } from '@tsintergy/calc';
import { tooltipLinkFormatter, getLocalStorageTheme, themeColors } from '@tsintergy/ppss';
import moment from 'moment';
import { eChartSpecialColors } from './palette';

/**
 * y轴 0 点 对齐
 * @param configParams
 */
export const yAxis0Align = (configParams: any) => {
  const config = configParams;
  if (typeof config === 'object' && !Array.isArray(config) && config?.yAxis.length >= 2) {
    // 找到yAxisIndex为 1 的数据 以及 找到yAxisIndex 为 0 的数据
    let yAxisLeftData: any[] = [];
    let yAxisRightData: any[] = [];

    // 找到所有 参照 左边的 数组 并 把他们合在同一个数组里
    config.series
      .filter((v: { yAxisIndex: undefined }) => v.yAxisIndex === undefined)
      ?.map((val: { data: any }) => {
        yAxisLeftData = val.data ? [...val.data, ...yAxisLeftData] : yAxisLeftData;
        return 0;
      });
    // 找到所有 参照 右边的 数组 并 把他们合在同一个数组里
    config.series
      .filter((v: { yAxisIndex: number }) => v.yAxisIndex === 1)
      ?.map((val: { data: any }) => {
        yAxisRightData = val.data ? [...val.data, ...yAxisRightData] : yAxisRightData;
        return 0;
      });

    // 分别找到他们的最值
    const leftMax = Math.max.apply(
      null,
      yAxisLeftData.filter((v) => typeof v === 'number'),
    );
    const leftMin = Math.min.apply(
      null,
      yAxisLeftData.filter((v) => typeof v === 'number'),
    );
    const rightMax = Math.max.apply(
      null,
      yAxisRightData.filter((v) => typeof v === 'number'),
    );
    const rightMin = Math.min.apply(
      null,
      yAxisRightData.filter((v) => typeof v === 'number'),
    );

    // 如果两边的最小值大于 0 就返回 原来的 config
    if (rightMin > 0 && leftMin > 0) {
      return config;
    }

    let yAxisLeftMin = 0;
    let yAxisRigthMin = 0;
    // 判断一下那条y轴的比例更小（负数更小）
    const as = accCalc.divideFixed(rightMin, rightMax) < accCalc.divideFixed(leftMin, leftMax);

    if (as) {
      yAxisRigthMin = rightMin;
      // yAxisLeftMin = (rightMin / rightMax) * leftMax
      yAxisLeftMin = accCalc.multiplyFixed(accCalc.divideFixed(rightMin, rightMax), leftMax);
    } else {
      yAxisLeftMin = leftMin;
      // yAxisRigthMin = (leftMin / leftMax) * rightMax
      yAxisRigthMin = accCalc.multiplyFixed(accCalc.divideFixed(leftMin, leftMax), rightMax);
    }

    // 增加0.5，让他不顶到顶部
    config.yAxis[0].min = accCalc.add(yAxisLeftMin, accCalc.multiplyFixed(yAxisLeftMin, 0.05));
    config.yAxis[1].min = accCalc.add(yAxisRigthMin, accCalc.multiplyFixed(yAxisRigthMin, 0.05));

    // 设置max, 不然会有误差
    config.yAxis[0].max = accCalc.add(leftMax, accCalc.multiplyFixed(leftMax, 0.05));
    config.yAxis[1].max = accCalc.add(rightMax, accCalc.multiplyFixed(rightMax, 0.05));
  }
  return config;
};

// 自定义formatter时的统一返回样式容器
export const comFormatterContainer = (item: {
  marker: string; // 标记
  name: string; // 名称
  value: number | undefined; // 数据
}) => {
  return `<div style="display: flex"><span style="flex: 1">${item.marker}${item.name}${
    item.name ? '：' : ''
  }</span><span>${item.value ?? '-'}</span></div>`;
};

/**
 * axis线段去除
 * 光滑echart配置
 */
export const smoothConfig = {
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    show: false,
  },
};

export const tooltipStyle = {
  tooltip: {
    trigger: 'axis',
    axisPointer: 'line',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderColor: '#CCC',
    borderWidth: 1,
    textStyle: {
      color: '#333',
    },
  },
};

/**
 * 日/周/月分割线
 * @param config
 * @returns
 */
export const getXAxisMarkLineSeries = (config: {
  size: number;
  num: number; // 多表联动的表数量
  rageTimeData: string[]; // 范围内所有日期
}) => {
  const theme = getLocalStorageTheme() || 'light';
  const { size = 96, num = 1, rageTimeData } = config;
  if (!rageTimeData || !rageTimeData.length) {
    return [];
  }

  const dateLen = rageTimeData.length; // 计算多少天
  let markLineData: any[] = [];
  let isDayLine = dateLen >= 2 && dateLen < 15;
  const isWeekLine = dateLen >= 15 && dateLen < 180;
  const isMonthLine = dateLen >= 180;
  if (size === 1) {
    // 表示只有日期,只判断周、月分割线
    isDayLine = false;
  }

  if (isDayLine) {
    markLineData = Array(dateLen - 1)
      .fill(null)
      .map((v, i) => {
        return { xAxis: (i + 1) * size - 1 };
      });
  } else if (isWeekLine) {
    markLineData = Array(dateLen - 1)
      .fill(null)
      .map((v, i) => {
        const theDate = moment(rageTimeData?.[i + 1]);
        const theDateOfEndWeek = moment(theDate).endOf('isoWeek');
        if (theDate.isSame(theDateOfEndWeek, 'date')) {
          return { xAxis: (i + 2) * size - 1 };
        }
        return false;
      })
      .filter((v) => !!v);
  } else if (isMonthLine) {
    markLineData = Array(dateLen - 1)
      .fill(null)
      .map((v, i) => {
        const theDate = moment(rageTimeData?.[i + 1]);
        const theDateOfEndMonth = moment(theDate).endOf('month');
        if (theDate.isSame(theDateOfEndMonth, 'date')) {
          return { xAxis: (i + 2) * size - 1 };
        }
        return false;
      })
      .filter((v) => !!v);
  }
  return Array(num)
    .fill(null)
    .map((v, i) => {
      return {
        name: '',
        type: 'line',
        data: [],
        xAxisIndex: i,
        yAxisIndex: i,
        itemStyle: {
          opacity: 0,
        },
        tooltip: {
          show: false,
        },
        markLine: {
          label: {
            show: false,
          },

          lineStyle: {
            type: 'dashed',
            color: theme === 'dark' ? '#585a70' : '#C9C9CD',
          },
          symbol: ['none', 'none'],
          data: markLineData,
        },
      };
    });
};

/**
 * 将集合按照正负偏差分类
 * @param data
 */
export const getChartDiffSeries = (data: any[]) => {
  const a = (data ?? [])?.filter((p) => toZero(p) >= 0);
  const b = (data ?? [])?.filter((p) => toZero(p) < 0);
  const extendSeries = [];
  if (a.length) {
    extendSeries.push({
      name: '正偏差',
      type: 'bar',
      itemStyle: { color: eChartSpecialColors[0] },
      stack: 'diff',
      data: (data ?? []).map((item: number) => ({
        value: toZero(item) >= 0 ? autoFixed(item ?? '-', 2) : null,
      })),
      xAxisIndex: 1, // 默认第二个表
      yAxisIndex: 1,
    });
  }

  if (b.length) {
    extendSeries.push({
      name: '负偏差',
      type: 'bar',
      stack: 'diff',
      itemStyle: { color: eChartSpecialColors[1] },
      data: (data ?? []).map((item: number) => ({
        value: toZero(item) < 0 ? autoFixed(item ?? '-', 2) : null,
      })),
      xAxisIndex: 1,
      yAxisIndex: 1,
    });
  }
  return extendSeries;
};

// 获取分类的series（复合轴 均分）
export const getGroupSeries = (dataSource: string[] | undefined) => {
  const theme = getLocalStorageTheme() || 'dark';
  return (
    dataSource?.map((item: any, index: any) => {
      return {
        data: [
          {
            name: `${item}`,
            value: 1,
          },
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          offset: [0, 0],
          textStyle: {
            color: (themeColors as any)[theme]['--neutral-color4'],
          },
        },
        tooltip: {
          show: false,
        },
        type: 'bar',
        barGap: 0,
        barWidth: `${accCalc.divide(100, dataSource.length)}%`,
        itemStyle: {
          normal: {
            color: `${
              index % 2 === 0 ? (themeColors as any)[theme]['--more-xAxis'] : 'transparent'
            }`,
          },
        },
      };
    }) ?? []
  );
};

export const scrollYOption = (length: number, showBarLength: number = 8) => ({
  grid: {
    top: 30,
    left: 0,
    right: 60,
    containLabel: true,
  },
  dataZoom: [
    {
      type: 'slider',
      yAxisIndex: [0],
      startValue: toZero(length),
      endValue: toZero(length) - showBarLength > 0 ? toZero(length) - showBarLength : 0,
      show: false, // 开启
      maxValueSpan: showBarLength, // 窗口的大小，显示数据的条数的
      realtime: true, // 是否实时更新
      width: '6',
      fillerColor: 'transparent',
      borderColor: 'transparent',
      backgroundColor: 'transparent', // 两边未选中的滑动条区域的颜色
      showDataShadow: false, // 是否显示数据阴影 默认auto
      showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
    },
    {
      type: 'inside',
      yAxisIndex: 0,
      zoomOnMouseWheel: false, // 滚轮是否触发缩放
      moveOnMouseMove: true, // 鼠标滚轮触发滚动
      moveOnMouseWheel: true,
    },
  ],
});

/* TODO 后续考虑搬到ppss */
/* xAxis的label太长，用于换行 */
/* segment分割字数: 默认为5, 为1时是竖直显示 */
export const labelSplit = (xAxisList: string[] = [], segment: number = 5) => {
  if (segment < 1) throw new Error('wrong segment!');
  return xAxisList.map((label) => {
    const str = (label ?? '')?.toString();
    const arr: string[] = [];
    let index = 0;
    while (index < str.length) {
      arr.push(str.slice(index, (index += segment)));
    }
    return arr.join('\n');
  });
};

/** 保留四位小数的tooltipLinkFormatter */
export const tooltipLinkFormatter_4 = (params: any) => tooltipLinkFormatter(params, null, null, 4);

/** head处拥有合计数值的tooltipLinkFormatter */
export const tooltipLinkFormatter_total: any = (
  params: any[],
  _ticket: string,
  _callback: any,
  fixed: number = 2,
  gatherData_seriesName: string[] | null = null, // 需要做合计的seriesName
) => {
  const group: any[][] = params.reduce((acc, item) => {
    const { axisIndex } = item;
    if (!acc[axisIndex]) {
      acc[axisIndex] = [];
    }
    acc[axisIndex].push(item);
    return acc;
  }, []);

  const ret = group.reduce((acc, item, i) => {
    const totalGroup: any = [];
    const body = item.reduce((acc2, item2) => {
      // 默认全部数据用于计算“合计”数值
      if (!gatherData_seriesName) {
        totalGroup.push(item2.value);
      }
      if (gatherData_seriesName && gatherData_seriesName.includes(item2?.seriesName)) {
        totalGroup.push(item2.value);
      }
      return `${acc2}<div style="display:flex;justify-content:space-between;align-items:center;">
      <div style="margin:3px 20px 0 0;">
      ${item2.marker}
      ${item2.seriesName}
      </div>
      <div style="font-weight:900;">
      ${format(item2.value, {
        fixed,
        thousands: true,
        fallback: '-',
      })}</div>
      </div>`;
    }, '');
    const head =
      i === 0
        ? `<div style="display:flex;justify-content:space-between;align-items:center;">
      <div>${item[0].name}</div><div style="font-weight:900;margin:0 0 0 20px">${format(
            accCalc.add(totalGroup),
            { fixed, thousands: true, fallback: '-' },
          )}</div>
      </div>`
        : `<div style="border-bottom:1px solid var(--split-line-color);margin:8px 0" />`;

    return `${acc}
    <div>${head}</div>
    <div>${body}</div>
    `;
  }, '');

  return ret;
};
