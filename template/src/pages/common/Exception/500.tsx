import { goToLogin } from '@/utils/url';
import { Button, Result } from 'antd';

const Exception = () => {
  return (
    <Result
      status="500"
      title="内部服务器错误"
      subTitle="500 Internal Server Error"
      extra={
        <Button type="primary" onClick={goToLogin}>
          去登陆
        </Button>
      }
    />
  );
};

export default Exception;
