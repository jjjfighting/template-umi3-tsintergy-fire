import { Result } from 'antd';

const Exception = () => (
  <Result status="warning" title="浏览器不兼容">
    <div style={{ fontSize: 16, textAlign: 'center' }}>
      <p>由于IE浏览器与现代浏览器技术标准不兼容，</p>
      <p>请在360安全浏览器、360极速浏览器等现代浏览器上使用本系统。</p>
    </div>
  </Result>
);

export default Exception;
