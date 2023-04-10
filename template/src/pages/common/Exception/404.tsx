import { goToLogin } from '@/utils/url';
import { Button, Result } from 'antd';

const Exception = () => {
  return (
    <Result
      status="404"
      title="未找到页面"
      subTitle="404 Not Found"
      extra={
        <Button type="primary" onClick={goToLogin}>
          去登陆
        </Button>
      }
    />
  );
};

export default Exception;
