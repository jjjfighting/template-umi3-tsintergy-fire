import { goToLogin } from '@/utils/url';
import { Button, Result, Typography } from 'antd';

interface Error {
  componentStack?: string;
  error?: string;
  [key: string]: any;
}

export interface IProps {
  /** 发生错误后的回调（可做一些错误日志上报，打点等） */
  onError?: (error: Error, info: any) => void;
}

const Index = ({ componentStack, error }: Error) => (
  <Result status="error" title="发生了一个错误">
    <Typography.Text strong>{error!.toString()}</Typography.Text>
    <Typography.Paragraph>
      <pre>{componentStack}</pre>
    </Typography.Paragraph>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button type="primary" onClick={goToLogin}>
        回首页
      </Button>
    </div>
  </Result>
);

export default Index;
