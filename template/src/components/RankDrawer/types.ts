/* 排名菜单类型: 只能为2层深度 */
export type MenuType = {
  title: string;
  key: string;
  children: ChildType[];
};

export type ChildType = {
  childTitle: string;
  childKey: string;
  accValue: number | string; // 累计值: 求和 或 加权平均
  unit: string; // 单位
  /* table的数据源 */
  dataSource: {
    orgId: string; // 电厂id(唯一key)
    orgName: string; // 电厂名
    value?: number | string; // 数值
  }[];
};
