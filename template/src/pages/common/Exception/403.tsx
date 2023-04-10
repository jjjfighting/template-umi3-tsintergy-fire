import { goToLogin } from '@/utils/url';
import { Button, Result } from 'antd';

const Exception = () => {
  return (
    <Result
      status="403"
      title="没有访问权限"
      subTitle="403 Forbidden"
      extra={
        <Button type="primary" onClick={goToLogin}>
          去登录
        </Button>
      }
    />
  );
};

export default Exception;
