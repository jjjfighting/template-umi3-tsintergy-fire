import { commomModel } from '@/models/commonModel';
import { getLocalStorageTheme } from '@tsintergy/ppss';
import { Typography } from 'antd';
import type { FC, ReactElement } from 'react';
import React, { memo, useMemo } from 'react';
import { useSelector } from 'umi';
import type { StatusType } from './config';
import { imgEnum } from './config';
import Styles from './index.less';

const { Text } = Typography;

// 表格内状态统一样式组件
const TableStatus: FC<{
  type: StatusType;
  children?: React.ReactElement | string;
  style?: React.CSSProperties;
}> = ({ type, style, children }): ReactElement => {
  const { themeChangeTag } = useSelector(commomModel.selector);

  const iconSrc = useMemo(() => {
    const theme: ThemeType = getLocalStorageTheme() ?? 'dark';
    return imgEnum?.[theme]?.[type] ?? imgEnum['default'][type];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeChangeTag, type]);

  return (
    <Text className={`${Styles.statusBox} ${Styles[`${type}Color`]}`} style={style}>
      <img src={iconSrc} />
      {children}
    </Text>
  );
};

export default memo(TableStatus);
