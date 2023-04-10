import { Spin } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

export interface PageProps {
  className?: string;
  pageContentClassName?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  /**
   * 固定高度且overflow:hidden
   */
  fixedHeight?: boolean;
  /**
   * 阴影
   */
  shadow?: boolean;
}

/**
 * 页面容器
 */
const Page: React.FC<PageProps> = (props) => (
  <main
    style={{
      padding: undefined,
      flex: 1,
      overflowY: props.fixedHeight ? 'hidden' : 'auto',
      ...props.style,
    }}
    className={classnames([styles.SpinFullHeight, props.className])}
  >
    <Spin spinning={!!props.loading}>
      <div className={classnames([styles.pageContent, props.pageContentClassName])}>
        {props.shadow ? <div className={styles.shadowPage}> {props.children}</div> : props.children}
      </div>
    </Spin>
  </main>
);

export default Page;
