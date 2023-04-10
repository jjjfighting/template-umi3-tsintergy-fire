/** 犹豫这里引入了 modal 不能在项目启动前（app.ts 文件init）调用里面的方法 */
import { commomModel } from '@/models/commonModel';
import { changeTheme, getLocalStorageTheme, setLocalStorageTheme } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import moment from 'moment';

/**
 * 设置节日主题
 */
export const festivalThemeSet = ({
  startDate,
  endDate,
  targetTheme,
  themeKey,
}: {
  startDate: Moment; // 自动设置主题的开始时间
  endDate: Moment; //  自动设置主题的结束时间
  targetTheme: ThemeType; // 要自动变成的主题色
  themeKey: string; // 主题的key，作为 重要的标志，手动切换过主题后，就不会自动切换主题
}) => {
  if (!SKIN.includes(targetTheme)) {
    // 如果系统不支持该皮肤，不自动换肤
    return;
  }
  const nowMoment = moment();
  const festivalThemeTag = localStorage.getItem('festivalTheme');
  if (nowMoment.isAfter(endDate) && festivalThemeTag) {
    localStorage.removeItem(`${PROJECT_KEY}_isLightBLue`);
    localStorage.removeItem(`${PROJECT_KEY}_isgary`);
    // 结束了节日 恢复正常皮肤
    setLocalStorageTheme('lightBlue');
    changeTheme('lightBlue');

    commomModel.actions.update({ themeChangeTag: moment().toDate().getTime() });
    localStorage.removeItem('festivalTheme');
    return;
  }
  if (nowMoment.isBefore(startDate) || nowMoment.isAfter(endDate)) {
    // 不在目标日期范围内
    localStorage.removeItem(`theme_${targetTheme}_${themeKey}_changeByHand`);
    return;
  }
  const storageTheme = getLocalStorageTheme();
  if (storageTheme && storageTheme === targetTheme) {
    // 已经在目标主题了
    return;
  }
  const useChangeTheme = localStorage.getItem(`theme_${targetTheme}_${themeKey}_changeByHand`);
  if (useChangeTheme) {
    // 已经手动关闭过了
    return;
  }
  localStorage.removeItem(`${PROJECT_KEY}_isLightBLue`);
  setLocalStorageTheme(targetTheme);
  changeTheme(targetTheme);
  commomModel.actions.update({ themeChangeTag: moment().toDate().getTime() });
  localStorage.setItem('festivalTheme', `theme_${targetTheme}_${themeKey}`);
};
