import useInitialState from '@/hooks/useInitialState';
import { commomModel } from '@/models/commonModel';
import { BaseLayout } from '@tsintergy/ppss';
import { useSelector } from 'umi';
import Styles from './index.less';
import { festivalThemeSet } from '@/utils/palette/utilsWithModel';
import { useMount } from 'ahooks';
import moment from 'moment';
import Notice from './Notice';

type Props = {
  children?: React.ReactNode;
};

export default (props: Props) => {
  const { themeChangeTag } = useSelector(commomModel.selector);
  const initialState = useInitialState();

  useMount(() => {
    // 设置特殊皮肤
    festivalThemeSet({
      startDate: moment('2022-12-29'),
      endDate: moment('2023-01-03'),
      targetTheme: 'ny',
      themeKey: '2023ny',
    });
    festivalThemeSet({
      startDate: moment('2023-01-16'),
      endDate: moment('2023-02-06'),
      targetTheme: 'sf',
      themeKey: '2023sf',
    });
  });

  return (
    <>
      <BaseLayout
        className={Styles.layout}
        initialState={initialState}
        themeChangeTag={themeChangeTag}
        isHuaNeng={IS_HUANENG}
        onThemeChange={() => {
          commomModel.actions.update({ themeChangeTag: themeChangeTag + 1 });
        }}
        {...props}
      />
      {!IS_HUANENG && <Notice />}
    </>
  );
};
