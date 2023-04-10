import { goToLogin } from '@/utils/url';
import { Button, Result } from 'antd';

const Exception = () => (
  <Result
    status="500"
    title="基础数据初始化失败"
    subTitle="500 Internal Server Error"
    extra={
      <Button type="primary" onClick={goToLogin}>
        回首页
      </Button>
    }
  />
);

export default Exception;
