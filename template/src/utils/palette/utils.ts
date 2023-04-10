import { getLocalStorageTheme, setLocalStorageTheme } from '@tsintergy/ppss';

/**
 * 更改主题
 * 修改primary-color使用了插件 antd-theme-generator
 * 修改其他变量 使用less-loader的变量方法
 * @param theme 主题名
 * @returns
 */
const primaryColor = {
  light: '#6B65D8',
  dark: '#816BED',
  nd: '#E83636',
  gary: '#E83636',
};

// 获取主题主色
export const getPrimaryColor = () => {
  const theme = getLocalStorageTheme();
  if (!theme || !SKIN?.includes(theme)) {
    return undefined;
  }
  return primaryColor[theme as 'light' | 'dark' | 'nd'];
};

export const changeTheme = (theme: ThemeType = 'dark') => {
  if (!theme || !SKIN?.includes(theme)) {
    return;
  }
  let finalTheme = theme; // 蓝白和灰色 都是特殊颜色 特殊处理

  // 蓝白主题 只改头部的颜色，所以还是沿用白色
  if (theme === 'lightBlue') {
    finalTheme = 'light';
    localStorage.setItem(`${PROJECT_KEY}_isLightBLue`, 'true');
  }
  // 灰色主题，全局加入灰色
  if (theme === 'gary') {
    finalTheme = 'light';
    localStorage.setItem(`${PROJECT_KEY}_isgary`, 'true');
  }

  setLocalStorageTheme(finalTheme);

  if (typeof window?.less?.modifyVars === 'function') {
    window?.less?.modifyVars({
      '@primary-color': primaryColor[finalTheme],
    });
  }
  let styleLink: any = document.getElementById('theme-style');
  const body = document.getElementsByTagName('body')[0];
  if (!styleLink) {
    styleLink = document.createElement('link');
    styleLink.type = 'text/css';
    styleLink.rel = 'stylesheet';
    styleLink.id = 'theme-style';
    styleLink.href = `/theme/${finalTheme}.css`; // 切换 antd 组件主题
    body.className = `body-theme-${finalTheme}`; // 切换自定义组件的主题
    document.body.append(styleLink);
    return;
  }
  if (body.className === `body-theme-${finalTheme}`) {
    return;
  }
  styleLink.href = `/theme/${finalTheme}.css`;
  body.className = `body-theme-${finalTheme}`;
};
