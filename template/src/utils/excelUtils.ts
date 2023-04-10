import { findEnum, getNetWorkEnum } from '@/utils/enum';
import type { ColumnsType } from 'antd/lib/table';
import { isString, last } from 'lodash';
import XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style-correct';

const { companyOsTree, provinceAreaList, businessType, osList } = getNetWorkEnum();
// 基础导出Excel表格的函数
/**
 * @param header Excel表头部分 把table的column 传进来就可以生成
 * @param data Excel表格体数据
 * @param title Excel文件名字
 */

const idChangeNameArr = [
  'companyOrgId',
  'provinceAreaId',
  'provinceArea',
  'osOrgId',
  'businessType',
];

const findEnumList: any = {
  companyOrgId: companyOsTree,
  provinceAreaId: provinceAreaList,
  provinceArea: provinceAreaList,
  osOrgId: osList,
  businessType,
};

export interface ExportExcelInterFace {
  columnConfig: ColumnsType;
  data: any[];
  filename: string;
  tableHeaderNumber?: number; // 描述一个固定列部分，
  merges?: any; // 自定义 merges，
  tableDom?: [any, Node]; // 一个table 的 真实dom节点
  cellStyle?: React.CSSProperties; // css 样式当然是自己手写啦
  headers?: any[]; // 表头部分，直接放在最顶部
  nullPlaceholder?: string | number; // 数据为空时的占位(e.g. 部分需求不需要让null转为0)
}

interface MakeSheetInterFace {
  columnConfig: ColumnsType;
  data: any[];
}

// 执行merge单元格的函数
export const mergeCeil = ({ tableContent, tableHeaderNumber }: any) => {
  const merges: any = [];
  const verticalArr: number[][] = [];
  tableContent?.reduce((total: any, currentValue: any, currentIndex: number) => {
    if (currentIndex > 0) {
      let broadArr: number[] = [];
      currentValue?.reduce((totalC: any, currentValueC: any, currentIndexC: number) => {
        if (!verticalArr[currentIndexC]?.length) {
          verticalArr[currentIndexC] = [];
        }
        if (currentIndexC > 0 && currentIndexC < tableHeaderNumber) {
          // 横向合并
          if (totalC === currentValueC) {
            broadArr.push(currentValueC);
          } else if (broadArr?.length > 0) {
            merges.push({
              s: { r: currentIndex, c: currentIndexC - 1 },
              e: { r: currentIndex, c: currentIndexC - broadArr.length - 1 },
            });
            broadArr = [];
          }
          if (tableHeaderNumber - 1 === currentIndexC && broadArr?.length) {
            merges.push({
              s: { r: currentIndex, c: currentIndexC },
              e: { r: currentIndex, c: currentIndexC - broadArr?.length },
            });
          }
          // 纵向合并
          if (currentValueC === total[currentIndexC]) {
            verticalArr[currentIndexC].push(currentValueC);
          } else if (verticalArr[currentIndexC]?.length) {
            merges.push({
              s: { r: currentIndex - verticalArr[currentIndexC].length - 1, c: currentIndexC },
              e: { r: currentIndex - 1, c: currentIndexC, s: { color: 'red' } },
            });
            verticalArr[currentIndexC] = [];
          }
          if (currentIndex === tableContent?.length - 1 && verticalArr[currentIndexC]?.length) {
            merges.push({
              s: { r: currentIndex - verticalArr[currentIndexC].length, c: currentIndexC },
              e: { r: currentIndex, c: currentIndexC },
            });
          }
        }
        return currentValueC;
      });
    }
    return currentValue;
  });
  return merges;
};

function exportExcelCore(config: ExportExcelInterFace) {
  const { tableHeaderNumber = 0, columnConfig, data, nullPlaceholder = 0 } = config;
  // ws['!merges'] = mergeTable
  // 获取到 Table 头部 用来生成 Excel 表格的第一行
  const createHeader: any[] = [];
  // dataIndex 数组是 记录每个数组 每个 属性 对于的 index
  const dataIndex: any[] = [];
  columnConfig.forEach((v: any) => {
    createHeader.push(v.title);
    dataIndex.push(v.dataIndex);
  });
  // -----------------------------------------------
  // 递归 children.length = 0 为出口
  const compressChildren = (value: any) => {
    return value.map((v: any) => {
      if (!v?.children?.length) {
        // 出口
        const arr = dataIndex.map((headerC: any) => {
          if (idChangeNameArr.includes(headerC)) {
            return findEnum(findEnumList[headerC], v?.[headerC]);
          }
          return v?.[headerC] ?? nullPlaceholder;
        });
        return arr;
      }
      // [[19],[19],[19]]
      const secondLevel = dataIndex.map((headerC: any) => {
        if (idChangeNameArr.includes(headerC)) {
          return findEnum(findEnumList[headerC], v?.[headerC]);
        }
        return v?.[headerC] ?? nullPlaceholder;
      });
      return [secondLevel, ...compressChildren(v?.children)];
    });
  };
  const tableContent: any = [];
  compressChildren(data).forEach((childrenElement: any) => {
    if (Array.isArray(childrenElement?.[0])) {
      childrenElement.forEach((value: any) => {
        tableContent.push(value);
      });
    } else {
      tableContent.push(childrenElement);
    }
  });
  const sheetContent = [createHeader, ...tableContent];
  const ws = XLSX.utils.aoa_to_sheet(sheetContent);
  //  根据 Excel 表头来确定列数
  const cols = createHeader.map((v, index) => {
    // 获取每个column中的最大长度
    const maxLen = Math.max(...sheetContent?.map((item: any[]) => item[index]?.length || 0));

    if (/日期/.test(v)) {
      return { wch: 14 };
    }
    return { wch: 4 + (maxLen > 30 ? 30 : maxLen) * 2 };
  });
  ws['!cols'] = cols;
  const merges = mergeCeil({
    tableContent: [createHeader, ...tableContent],
    tableHeaderNumber,
  });
  ws['!merges'] = merges;
  return { ws };
}

/**
 * 导出单个 sheet 的 excel 文件
 */
export const exportExcel = (config: ExportExcelInterFace) => {
  const wb = XLSX.utils.book_new();
  const { ws } = exportExcelCore(config);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${config.filename}.xlsx`);
};

interface SheetConfig extends Omit<ExportExcelInterFace, 'filename'> {
  sheetName?: string;
}
/**
 * 导出多个 sheet 的 excel 文件
 */
export const exportExcelSheets = (filename: string, sheetsConfig: SheetConfig[]) => {
  const wb = XLSX.utils.book_new();
  for (let i = 0, len = sheetsConfig.length; i < len; i++) {
    const config = sheetsConfig[i];
    // sheet 表名不能 含有 [ ] \ / ? *  这里把他们去掉
    const sheetName = config.sheetName?.replace(/[\\*\\?\\[\]\\/]/g, '') || `Sheet${i + 1}`;
    const { ws } = exportExcelCore({ ...config, filename: sheetName });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const s2ab = (s: string) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  // eslint-disable-next-line no-bitwise
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export const makeTableContent = (data: any[], dataIndex: string[]) => {
  const tableContent: any[] = [];
  // 递归 children.length = 0 为出口
  const compressChildren = (value: any) => {
    return value?.map((v: any) => {
      if (!v?.children?.length) {
        // 出口
        const arr = dataIndex.map((headerC: any) => {
          if (idChangeNameArr.includes(headerC)) {
            return findEnum(findEnumList[headerC], v?.[headerC]);
          }
          return v?.[headerC] || 0;
        });
        return arr;
      }
      // [[19],[19],[19]]
      const secondLevel = dataIndex.map((headerC: any) => {
        if (idChangeNameArr.includes(headerC)) {
          return findEnum(findEnumList[headerC], v?.[headerC]);
        }
        return v?.[headerC] || 0;
      });
      return [secondLevel, ...compressChildren(v?.children)];
    });
  };
  compressChildren(data)?.forEach((childrenElement: any) => {
    if (Array.isArray(childrenElement?.[0])) {
      childrenElement.forEach((value: any) => {
        tableContent.push(value);
      });
    } else {
      tableContent.push(childrenElement);
    }
  });
  return tableContent;
};

export const makeSheet = ({ columnConfig, data }: MakeSheetInterFace) => {
  // ws['!merges'] = mergeTable
  // 获取到 Table 头部 用来生成 Excel 表格的第一行
  const createHeader: any[] = [];
  // dataIndex 数组是 记录每个数组 每个 属性 对于的 index
  const dataIndex: any[] = [];
  let index = 0; // 表示层数
  const compressHeaderChildren = (column: any) => {
    column.map((v: any) => {
      // 递归出口，条件是没有 children 或者 children 的长度为0\
      if (!createHeader[index]) {
        createHeader[index] = [];
      }
      if (!v?.children || v?.children?.length === 0) {
        createHeader[index].push(v.title);
        dataIndex.push(v.dataIndex);
        // return
        return {
          title: v.title,
          dataIndex: v.dataIndex,
        };
      }
      // 去到下一层加上这一层的 占位符
      if (!createHeader[index + 1]) {
        createHeader[index + 1] = createHeader[index]?.length
          ? new Array(createHeader[index].length).fill(null)
          : [];
      }
      createHeader[index].push(...[v.title, ...new Array(v.children.length - 1).fill(null)]);
      index++;
      return {
        childrenNum: v?.children,
        data: compressHeaderChildren(v?.children),
      };
    });
    index = 0;
    return [createHeader, dataIndex];
  };
  compressHeaderChildren(columnConfig);
  const compressChildren = (value: any) => {
    return value.map((v: any) => {
      if (!v?.children?.length) {
        // 出口
        const arr = dataIndex.map((headerC: any) => {
          if (idChangeNameArr.includes(headerC)) {
            return findEnum(findEnumList[headerC], v?.[headerC]);
          }
          return v?.[headerC] || 0;
        });
        return arr;
      }
      // [[19],[19],[19]]
      const secondLevel = dataIndex.map((headerC: any) => {
        if (idChangeNameArr.includes(headerC)) {
          return findEnum(findEnumList[headerC], v?.[headerC]);
        }
        return v?.[headerC] || 0;
      });
      return [secondLevel, ...compressChildren(v?.children)];
    });
  };
  const tableContent: any = [];
  compressChildren(data).forEach((childrenElement: any) => {
    if (Array.isArray(childrenElement?.[0])) {
      childrenElement.forEach((value: any) => {
        tableContent.push(value);
      });
    } else {
      tableContent.push(childrenElement);
    }
  });
  // return [...createHeader, ...tableContent];
  return { createHeader, tableContent };
};

// 可以兼容导出columns多层的方法
export const ExportExcel = (config: ExportExcelInterFace) => {
  const { createHeader, tableContent } = makeSheet({
    columnConfig: config.columnConfig,
    data: config.data,
  });
  const ws = XLSX.utils.aoa_to_sheet([...(config.headers || []), ...createHeader, ...tableContent]);
  Object.keys(ws).forEach((val) => {
    if (/^[0-9a-zA-Z]{1,}$/.test(val)) {
      ws[val].s = {
        alignment: { vertical: 'center', horizontal: 'center' },
      };
    }
    if (isString(ws?.[val]?.v) && !ws?.[val]?.v?.indexOf('编制日期') && config?.headers) {
      ws[val].s = {
        alignment: { vertical: 'center', horizontal: 'left' },
      };
    }
  });
  //  根据 Excel 表头来确定每一列的大小
  const cols = last(createHeader).map((v: any) => {
    if (/日期/.test(v)) {
      return { wch: 14 };
    }
    return { wch: 20 };
  });
  ws['!cols'] = cols;
  let merges;
  if (!config.merges) {
    merges = mergeCeil({
      tableContent: [...createHeader, ...tableContent],
      tableHeaderNumber: config.tableHeaderNumber,
    });
  }
  merges = config.merges;
  ws['!merges'] = merges;
  return { ws };
};

/**
 * 导出多个 sheet 的 excel 文件
 * 兼容 columns 有 children 的版本
 */
export const exportColumnsExcelSheets = (filename: string, sheetsConfig: SheetConfig[]) => {
  const wb = XLSX.utils.book_new();
  for (let i = 0, len = sheetsConfig.length; i < len; i++) {
    const config = sheetsConfig[i];
    // sheet 表名不能 含有 [ ] \ / ? *  这里把他们去掉
    const sheetName = config.sheetName?.replace(/[\\*\\?\\[\]\\/]/g, '') || `Sheet${i + 1}`;
    const { ws } = ExportExcel({ ...config, filename: sheetName });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  const ws = XLSXStyle.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  const sheet = new Blob([s2ab(ws)], { type: 'xlsx' });
  const objectURL = window.URL.createObjectURL(sheet);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = `${filename}.xlsx`;
  a.href = objectURL;
  a?.click();
  setTimeout(() => {
    URL.revokeObjectURL(objectURL);
  }, 100);
};

interface ExportExcelMoreInterFace {
  filename: string;
  dataConfig: {
    columnConfig: ColumnsType;
    data: any[];
    tableHeaderNumber?: number; // 描述一个固定列部分，
    tableDom?: Node; // 一个table 的 真实dom节点
    sheetName?: string; // 工作表名称
  }[];
}

/**
 * 多工作表导出
 * @param config
 */
export const exportExcelMoreSheet = (config: ExportExcelMoreInterFace) => {
  const { filename = '工作表', dataConfig } = config;
  const wb = XLSX.utils.book_new();
  dataConfig.forEach((item, index) => {
    const { columnConfig, data, tableHeaderNumber, sheetName = `Sheet${index + 1}` } = item;

    const createHeader: any[] = [];
    const dataIndex: any[] = [];
    columnConfig.forEach((v: any) => {
      createHeader.push(v.title);
      dataIndex.push(v.dataIndex);
    });

    const compressChildren = (value: any) => {
      return value.map((v: any) => {
        if (!v?.children?.length) {
          // 出口
          const arr = dataIndex.map((headerC: any) => {
            if (idChangeNameArr.includes(headerC)) {
              return findEnum(findEnumList[headerC], v?.[headerC]) || v?.[headerC];
            }
            return v?.[headerC] || 0;
          });
          return arr;
        }
        // [[19],[19],[19]]
        const secondLevel = dataIndex.map((headerC: any) => {
          if (idChangeNameArr.includes(headerC)) {
            return findEnum(findEnumList[headerC], v?.[headerC]) || v?.[headerC];
          }
          return v?.[headerC] || 0;
        });
        return [secondLevel, ...compressChildren(v?.children)];
      });
    };
    const tableContent: any = [];
    compressChildren(data).forEach((childrenElement: any) => {
      if (Array.isArray(childrenElement?.[0])) {
        childrenElement.forEach((value: any) => {
          tableContent.push(value);
        });
      } else {
        tableContent.push(childrenElement);
      }
    });
    const ws = XLSX.utils.aoa_to_sheet([createHeader, ...tableContent]);
    //  根据 Excel 表头来确定每一列的大小
    const cols = createHeader.map((v, index) => {
      if (/日期/.test(v)) {
        return { wch: 14 };
      }
      return { wch: 4 + v.length * 2 };
    });
    ws['!cols'] = cols;
    const merges = mergeCeil({ tableContent: [createHeader, ...tableContent], tableHeaderNumber });
    ws['!merges'] = merges;

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
