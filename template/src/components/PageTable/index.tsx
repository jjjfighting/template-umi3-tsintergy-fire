import { Table } from 'antd';
import type { TableProps } from 'antd/lib/table';
import { useMemo } from 'react';

interface PageTableInterFace extends TableProps<any> {
  onPageChange?: Function;
  pagesData?: {
    numPerPage: number;
    pageNum: number;
    total: number;
  };
  scrollY?: boolean; // 是否开启y轴滚动 默认开启
}

const Index = (props: PageTableInterFace) => {
  const { pagesData, onPageChange, columns, scrollY = true, ...rest } = props;

  // Y滚动轴通用配置 (数据大于10条 开启滚动)
  const yScrollConfig = useMemo(() => {
    if (scrollY && rest?.dataSource && rest?.dataSource?.length > 10) {
      return { y: 380 };
    }
    return {};
  }, [rest?.dataSource, scrollY]);

  if (pagesData && !rest.pagination) {
    const { numPerPage, pageNum, total } = pagesData;
    rest.pagination = {
      pageSize: numPerPage,
      current: pageNum,
      total,
      showSizeChanger: true,
      showTotal: (totalNum: number, range: number[]) =>
        `第${range[0]}-${range[1]}条/共${totalNum}条`,
      onShowSizeChange: (currentPage: number, currentPageSize: number) => {
        if (onPageChange) {
          onPageChange(1, currentPageSize);
        }
      },
      onChange: (page: number, currentPageSize: number | undefined) => {
        if (onPageChange) {
          onPageChange(page, currentPageSize);
        }
      },
    };
  }

  const columnsOptions: any = () => {
    return columns?.map((p: any) => {
      return {
        ...p,
        align: p.align || 'left',
        key: p.dataIndex,
        width: !p?.children?.length && !p?.width ? 120 : p?.width || 120,
      };
    });
  };
  return (
    <Table
      bordered
      scroll={{ x: 'max-content', ...yScrollConfig }}
      columns={columnsOptions()}
      {...rest}
    />
  );
};

export default Index;
