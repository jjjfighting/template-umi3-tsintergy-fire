import { Affix, Col, Row } from 'antd';
import type { LegacyRef } from 'react';
import { useEffect, useRef } from 'react';
import useRefTopToBottm from '../../hooks/useRefTopToBottm';
import type { TreeProps } from '../OsListBoxCard';
import OsListBoxCard from '../OsListBoxCard';

type PropsTypes = {
  osListBoxProps: TreeProps;
  children: any;
  marginTopGap?: number;
  boxShadow?: boolean;
};

const Index = (props: PropsTypes) => {
  const { osListBoxProps, children, marginTopGap = 0, boxShadow = false } = props;
  const ref = useRef<HTMLDivElement>(null);
  const affixRef = useRef<LegacyRef<any>>(null);
  // 手动监听 ref
  useEffect(() => {
    window.addEventListener(
      'scroll',
      () => {
        if (!affixRef?.current || typeof affixRef?.current === 'string') {
          return;
        }
        affixRef?.current?.updatePosition();
      },
      true,
    );
    return () => {
      window.removeEventListener('scroll', () => {}, true);
    };
  }, []);

  const [height] = useRefTopToBottm(500, ref);

  return (
    <div style={{ marginTop: marginTopGap }}>
      <Row wrap={false} ref={ref}>
        <Col flex="none">
          <Affix ref={affixRef as any} offsetTop={96}>
            <OsListBoxCard
              {...osListBoxProps}
              style={{
                height,
                ...(osListBoxProps.style || {}),
              }}
            />
          </Affix>
        </Col>
        <Col flex="auto">
          <div
            style={{
              flex: 1,
              boxShadow: boxShadow ? 'var(--default-shadow)' : '',
              height: '100%',
            }}
          >
            {children}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
