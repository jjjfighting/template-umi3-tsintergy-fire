import { request } from 'umi';

// 获取返回应用选择页地址[基础请求]
export function getLoginUrls() {
  return request<AjaxRes<FIRE_BASE.systemUrlsType>>(
    `${API_PREFIX}/api/pf/tenant/user/getLoginUrls`,
  );
}

// 修改密码
export function passwordChange(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return request(`${API_PREFIX}/api/pf/tenant/user/password/change`, {
    data,
    method: 'post',
  });
}

// 获取机组列表
export function getUnitInfo() {
  return request<AjaxRes<FIRE_BASE.Units[]>>(`${API_PREFIX}/api/unit/list`);
}

/**
 * 查询系统参数
 * @param data
 */
export function querySysParameter() {
  return request(`${API_PREFIX}/api/pps/sys/parameter/list`, {});
}

// 约定好的变动枚举
export function getEnumTypeRequestSxFire() {
  return request(`/api/pps/sys/getEnumType`, {
    prefix: API_PREFIX,
  });
}

// 获取用户信息- 平台
export function getAccessRequest() {
  return request(`${API_PREFIX}/api/pf/tenant/user/application/resource`);
}
// 获取用户信息- 平台
export function getPFUserInfoRequest() {
  return request<AjaxRes<FIRE_BASE.PFUserInfoType>>(`${API_PREFIX}/api/pf/tenant/user/info`);
}

// 上传多文件接口
export const postUploadData = (data: FormData) => {
  return request(`${API_PREFIX}/api/data/import/create/multi`, {
    data,
    method: 'post',
  });
};

interface ValidResult {
  errorMessageDTOList: {
    date: string;
    detail: string;
    fileName: string;
  }[];
  validDTOList: {
    fileUdx: string; // 文件唯一标识
    templateName: string; // 文件模板名称
  }[];
}
// 多文件校验
export const postValidData = (data: FormData) => {
  return request<AjaxRes<ValidResult>>(`${API_PREFIX}/api/data/import/valid/multi`, {
    data,
    method: 'post',
  });
};

// 获取到当前用户在哪些企业下拥有当前应用的权限
export function grantApplication() {
  return request<AjaxRes<FIRE_BASE.IApplication>>(
    `${API_PREFIX}/api/pf/tenant/user/tenant/grantApplication`,
  );
}
