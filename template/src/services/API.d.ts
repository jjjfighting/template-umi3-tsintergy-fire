declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }
}
declare namespace FIRE_BASE {
  export interface PFUserInfoType {
    applicationId?: string; // 应用id
    nickname?: string; // 昵称
    tenantId?: string; // 租客Id
    tenantName?: string; // 租户名
    userId?: string; // 用户id
    username?: string; // 用户名
  }
  export interface Units {
    id: string;
    orgId: string; // 所属企业
    unitName: string; // 机组名称
    subType: string; // 机组子类型
    businessType: string; // 机组类型（业态）
    capacity: string; // 额定容量
    upClimbRate: string; // 上爬坡速率
    downClimbRate: string; // 下爬坡速率
    minPower: string; // 最小技术出力
    // maxPower: string; // 最大技术出力
    enable: '0' | '1'; // 枚举定义为：[{"id":"0","text":"无效/否"},{"id":"1","text":"有效/是"}];
    createTime: string; // 创建时间
    updateTime: string; // 最后一次修改时间
    acNodeIds?: string[]; // 节点id列表
    unitShortName: string; // 账单别名
    retirementTime: string | null; // 退役时间
    cityId: string | null;
    gridDispatchAgreement?: number | null; // 并网协议
  }
  export interface systemUrlsType {
    loginUrl?: string; // 登录地址
    logoutUrl?: string; // 登出
    switchAppSuccessUrl?: string; // 应用切换成功跳转地址
    switchAppFailUrl?: string; // 应用切换失败跳转地址
    selectAppUrl?: string; // 选择应用跳转地址
    tenantSwitchUrl?: string; // 切换租户接口
  }

  export interface resourceType {
    applicationId?: string; // 应用id
    parentResourceId?: string; // 上层id
    path?: string; // 路径
    resourceId?: string; // 路由id
    sort?: string; // 排序
    status?: string; // 状态
    title?: string; // 标题
    icon?: string; // icon
    children?: resourceType[];
    routes?: resourceType[];
    type?: number; // 类型 3菜单 4令牌 5API
  }

  export type IApplication = {
    tenantId: string;
    name: string;
  }[];
}

declare namespace SXDASS_BASE {
  type orgDetailTree = {
    companyTree: {
      companyOrgId: string;
      companyOrgName: string;
      esDetailList: any[]; // 售电公司列表
      osDetailList: any[]; // 场站列表
    }[];
    groupOrgId: string;
    groupOrgName: string;
  };
  export interface UserInfoType {
    account?: string;
    email?: string;
    orgDetailTree?: orgDetailTree;
    phoneno?: string;
    userId?: string;
    userName?: string;
    userOrgId?: string;
    userOrgName?: string;
    userOrgType?: string;
  }
}
