/* 权限定义文件 @umijs/plugin-access */

type Access = Record<
  string,
  | {
      description: string;
      id: string;
      menupath: string;
      name: string;
      parentId: string;
      rel: string;
      targetType: string;
      sort: number;
      type: 0 | 1 | 2;
    }
  | undefined
>;

export default (initialState: any): Access => {
  return initialState?.access || {};
};
