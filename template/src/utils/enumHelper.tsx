import { getNetWorkEnum } from '@/utils/enum';
import { Select, Tooltip } from 'antd';
import { merge } from 'lodash';

const NullOption = { id: null, name: '全部' };

/**
 * 返回选项列表
 * @param optionList
 * @param showAll
 */
export const renderOptions = (optionList: OptionList = [], showAll?: boolean) => {
  const theList = showAll
    ? ([NullOption, ...(optionList || [])] as OptionList)
    : [...(optionList || [])];
  return theList?.map((item) => (
    <Select.Option key={item.id} value={item.id} disabled={item.disabled ?? false}>
      <Tooltip title={item.name}>{item.name}</Tooltip>
    </Select.Option>
  ));
};

/**
 * 返回分组的选项列表
 * @param optionList
 * @param showAll
 */
export const renderGroupOptions = (
  optionList: OptionList = [],
  showAll?: boolean,
  agent?: string,
) => {
  const theList = showAll
    ? ([{ id: '全部', name: '全部', children: [NullOption] }, ...(optionList || [])] as OptionList)
    : optionList;
  if (agent?.indexOf('代理商') !== -1) {
    return theList?.map((item) => {
      if (item.id !== 'powerConsumers') {
        return (
          <Select.OptGroup key={item.id} label={item.name}>
            {item?.children?.map((subItem) => (
              <Select.Option key={subItem.id} value={subItem.id}>
                <Tooltip title={item.name}>{subItem.name}</Tooltip>
              </Select.Option>
            ))}
          </Select.OptGroup>
        );
      }
      return null;
    });
  }
  if (agent === 'other') {
    return theList?.map((item) => {
      if (item.id !== 'powerAgents') {
        return (
          <Select.OptGroup key={item.id} label={item.name}>
            {item?.children?.map((subItem) => (
              <Select.Option key={subItem.id} value={subItem.id}>
                <Tooltip title={item.name}>{subItem.name}</Tooltip>
              </Select.Option>
            ))}
          </Select.OptGroup>
        );
      }
      return null;
    });
  }
  if (agent === 'powerConsumers') {
    return theList?.map((item) => {
      if (item.id === 'powerConsumers') {
        return (
          <Select.OptGroup key={item.id} label={item.name}>
            {item?.children?.map((subItem) => (
              <Select.Option key={subItem.id} value={subItem.id}>
                <Tooltip title={item.name}>{subItem.name}</Tooltip>
              </Select.Option>
            ))}
          </Select.OptGroup>
        );
      }
      return null;
    });
  }

  return theList?.map((item) => (
    <Select.OptGroup key={item.id} label={item.name}>
      {item?.children?.map((subItem) => (
        <Select.Option key={subItem.id} value={subItem.id}>
          <Tooltip title={item.name}>{subItem.name}</Tooltip>
        </Select.Option>
      ))}
    </Select.OptGroup>
  ));
};

/**
 * 返回 id 对应的名称
 * @param optionList
 * @param id
 */
export const translateOption = (optionList?: OptionList, id?: string) => {
  return optionList?.find((item) => item.id === id)?.name;
};

/**
 * 得到 optionList 直接子集
 * @param optionList
 */
export const getEnumChildren = (optionList?: OptionList): OptionList => {
  return optionList
    ? optionList?.reduce((acc: OptionList, item) => {
        return item.children ? acc.concat(item.children) : acc;
      }, [])
    : [];
};

/**
 * 获取对应公司的省市 省区
 */
export const GetCompanyProvinceList = (companyOrgId?: string) => {
  const { companyOsTree, companyEsTree, provinceTree, provinceAreaTree } = getNetWorkEnum();
  let osTree: OptionList = merge([], companyOsTree);
  let esTree: OptionList = merge([], companyEsTree);

  if (companyOrgId) {
    osTree = osTree?.filter((p) => p.id === companyOrgId) || [];
    esTree = esTree?.filter((p) => p.id === companyOrgId) || [];
  }

  // osList 一维数组
  const osList = osTree?.reduce((total: any, companyItem: any) => {
    return [...total, ...companyItem.children];
  }, []);

  // esList 一维数组
  const esList = esTree?.reduce((total: any, companyItem: any) => {
    return [...total, ...companyItem.children];
  }, []);

  const provinceIds = [
    ...esList.map((p) => p.provinceId),
    ...osList.map((p) => p.provinceId),
  ].filter((p) => p);
  const provinceAreaIds = [
    ...esList.map((p) => p.provinceAreaId),
    ...osList.map((p) => p.provinceAreaId),
  ].filter((p) => p);
  const companyProvinceList: OptionObject[] =
    provinceTree?.filter((p) => provinceIds?.includes(`${p.id}`)) || [];
  const companyProvinceAreaList: OptionObject[] =
    provinceAreaTree?.filter((p) => provinceAreaIds?.includes(`${p.id}`)) || [];
  return { companyProvinceList, companyProvinceAreaList };
};

/**
 * 返回 名称 对应的id（跟上个方法相反）
 * @param optionList
 * @param id
 */
export const translateOptionToId = (optionList?: OptionList, name?: string) => {
  return optionList?.find((item) => item.name === name)?.id;
};

type mapOptionListType = (optionList?: OptionList, value?: any) => Record<string, any>;
/**
 * 将optionList按id映射为一个对象
 * mapOptionList([{id:'a',name:'a'},{id:'b',name:'b'}], true) => {a:true,b:true}
 * @param optionList
 * @param value
 * @returns
 */
export const mapOptionList: mapOptionListType = (optionList, value) => {
  if (!optionList) {
    return {};
  }
  return optionList
    .map((item) => item.id)
    .reduce((acc, id) => {
      acc[id] = value;
      return acc;
    }, {} as any);
};
