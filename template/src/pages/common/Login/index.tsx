import BgImage from '@/assets/img/bg_login.jpg';
import { Login } from '@tsintergy/role';
import { useCallback } from 'react';
import { history, useModel } from 'umi';
import style from './index.less';

const SystemLogin = () => {
  const { refresh } = useModel('@@initialState');

  const handle = useCallback(async () => {
    refresh();
    history.push(`/`);
    // history.replace(`/index`);
    window.location.reload();
  }, [refresh]);

  return (
    <div className={style.loginIndex}>
      <Login
        bgImage={BgImage}
        title="开发模式登录"
        apiUrl={`${API_PREFIX}/api/login`}
        onSuccess={handle}
        host={`${API_PREFIX}/api/`}
        extraParams={{
          loginMode: '2', // loginMode=2常规登录；loginMode=1证书登陆
        }}
      />
    </div>
  );
};

export default SystemLogin;
