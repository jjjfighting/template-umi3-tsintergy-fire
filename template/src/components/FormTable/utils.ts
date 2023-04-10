import { toZero } from '@/utils/calc.legacy';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

interface CellColumnsInterface {
  columns: [];
  defaultWidth: string | number;
  onInputPaste: (e: MouseEvent, xDataIndex: string, yIndex: number) => void;
}
/**
 * 整体配置增加
 * @param param0
 */
export const cellColumns = ({ columns, defaultWidth, onInputPaste }: CellColumnsInterface) => {
  return columns.map((col: any) => {
    // 如果有父类标题的情况
    if (col.children) {
      return {
        key: col.dataIndex,
        ...col,
        children: col.children.map((p: any) => {
          return {
            key: p.dataIndex,
            ...p,
            align: p.align || 'left',
            onCell: (record: any) => ({
              record,
              ...p,
              width: p.width || defaultWidth,
              align: p.align || col.align || 'left',
              formType: p.formType || 'text',
              selectEnum: p.selectEnum,
              onInputPaste,
            }),
            onInputPaste,
          };
        }),
        align: col.align || 'left',
        width: col.width || defaultWidth,
        onInputPaste,
      };
    }
    return {
      key: col.dataIndex,
      ...col,
      align: col.align || 'left',
      width: col.width || defaultWidth,
      onInputPaste,
      onCell: (record: any) => ({
        record,
        key: col.dataIndex,
        ...col,
        width: col.width || defaultWidth,
        align: col.align || 'left',
        formType: col.formType || 'text',
        selectEnum: col.selectEnum,
        onInputPaste,
      }),
    };
  });
};

/**
 * 增加元数据的index
 * @param dataSource
 */
export const addIndex2DataSource = (dataSource: any[]) => {
  if (!dataSource || dataSource.length === 0) {
    return [];
  }
  return dataSource?.map((p: any, index: number) => ({ ...p, key: index, index }));
};

/**
 * 一维数组按照长度分割成二维数组
 * @param mainList 正则匹配出来的一维数组
 * @param columnsLength 竖项长度
 */
const arrTrans = (mainList: [], columnsLength: number) => {
  if (!mainList || !mainList.length || mainList.length % columnsLength !== 0) {
    return [];
  }
  const cutLength = mainList.length / columnsLength;
  const iconsArr: any[] = [];
  let index = 0;
  while (index < mainList.length) {
    iconsArr.push(mainList.slice(index, index + cutLength));
    index += cutLength;
  }
  return iconsArr;
};

/**
 * dataSource转化成为竖向的结果
 * @param columns columns
 * @param dataSource
 */
export const dataSource2Obj = ({ columns, dataSource }: { columns: any[]; dataSource: any[] }) => {
  const dataIndexList = columns?.map((p: any) => p.dataIndex || p.key);
  const resultObj = {};
  dataIndexList.forEach((dataIndex: string) => {
    const list = dataSource.map((p) => p?.[dataIndex]);
    resultObj[dataIndex] = list;
  });
  return resultObj;
};

/**
 * 粘贴数据处理
 * @param param0
 */
const pasteData = ({
  xDataIndex,
  yIndex,
  columns,
  dataSource,
  excelData,
}: {
  xDataIndex: string;
  yIndex: number;
  columns: [];
  dataSource: any[];
  excelData: any[];
}) => {
  const lookForChildren = (data: any, dataIndex: string, key: string) => {
    if (!data.children) {
      return [data[dataIndex] ?? data[key]];
    }
    return data.children.reduce(
      (total: any, v: any) => [...total, lookForChildren(v, dataIndex, key)],
      [],
    );
  };
  if (!dataSource || dataSource.length === 0 || !columns || columns.length === 0) {
    message.warn('解析错误，格式不正确');
    return null;
  }
  const resultSource: any[] = cloneDeep(dataSource) || [];
  // const dataIndexList = columns?.map((p: any) => p.dataIndex || p.key);
  // const formTypeList = columns?.map((p: any) => p.formType);
  // const editableList = columns?.map((p: any) => p.editable);

  // 递归找到最下层的 children 并把它做成一维数组 ，递归出口 !p.children
  const dataIndexList = columns
    ?.reduce((total: any, pre: any) => {
      return [...total, ...lookForChildren(pre, 'dataIndex', 'key')];
    }, [])
    .flat();
  const formTypeList = columns
    ?.reduce((total: any, pre: any) => {
      return [...total, ...lookForChildren(pre, 'formType', 'formType')];
    }, [])
    .flat();
  const editableList = columns
    ?.reduce((total: any, pre: any) => {
      return [...total, ...lookForChildren(pre, 'formType', 'formType')];
    }, [])
    .flat();
  const x: number = dataIndexList.findIndex((p) => p === xDataIndex);
  excelData.forEach((rowList: [], index: number) => {
    if (resultSource.length < index + yIndex + 1) {
      // 边界溢出return
      return;
    }
    const resultRow: any = resultSource?.[index + yIndex] || {};
    rowList.forEach((cell: any, rowIndex: number) => {
      if (
        dataIndexList.length < rowIndex + x + 1 ||
        !['number', 'input'].includes(formTypeList?.[x + rowIndex]) ||
        !editableList?.[x + rowIndex]
      ) {
        // 边界溢出return
        // 类型不是number 或者input 不复制进入
        return;
      }
      const key = dataIndexList?.[x + rowIndex];
      if (formTypeList?.[x + rowIndex] === 'number') {
        // 数字情况，需要格式化一下,非数字直接转换成0
        resultRow[key] = Number((toZero(cell) || 0).toFixed(3));
        return;
      }
      resultRow[key] = cell;
    });
    resultSource[index + yIndex] = resultRow;
  });

  return resultSource;
};

export const excelPaste = ({
  e,
  xDataIndex,
  yIndex,
  columns,
  dataSource,
}: {
  e: any;
  xDataIndex: string;
  yIndex: number;
  columns: [];
  dataSource: any[];
}) => {
  // 获取剪贴板数据
  let paste = (e.clipboardData || window?.clipboardData)?.getData('text/html') || '';
  // 做一些粘贴，如删除非utf -8字符
  paste = paste.replace(/style/gi, 'data-style');
  let pasteList = paste.match(/>.*<\/td>/g, '');
  const columnsLength = paste.match(/<\/tr>/g, '')?.length || 0;
  pasteList = pasteList?.map((item: string) => item.replace(/>|<\/td>/g, ''));
  pasteList = pasteList?.map((item2: string) => {
    // 判断一下这个是不是一个数值了，如果不是就在处理一下
    if (Number.isNaN(Number(item2))) {
      // 值 为 NaN
      return item2.replace(/<span.*<\/span/g, '');
    }
    return item2;
  });
  if (!pasteList || pasteList.length === 0 || columnsLength === 0) {
    return null;
  }
  const excelData = arrTrans(pasteList, columnsLength);
  if (!excelData || excelData.length === 0) {
    message.warn('解析错误，格式不正确');
    return null;
  }
  return pasteData({
    xDataIndex,
    yIndex,
    columns,
    dataSource,
    excelData,
  });
};
