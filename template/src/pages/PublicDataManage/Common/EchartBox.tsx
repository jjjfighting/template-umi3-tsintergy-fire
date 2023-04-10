/** Echart组件, 由于配置多不一样，将配置交给父级自由处理 */
import CardWrapper from '@/components/CardWrapper';
import { marginGap } from '@/utils/constant';
import { Echarts5, useEchartsOption } from '@tsintergy/ppss';
import type { CSSProperties, FC } from 'react';

const Index: FC<{ option: echarts.EChartsOption; style?: CSSProperties; padding?: boolean }> = ({
  option,
  style,
  padding = false,
}) => {
  return (
    <CardWrapper noPadding={!padding} style={{ marginTop: marginGap }}>
      <Echarts5 style={style} optionOpts={{ notMerge: true }} option={useEchartsOption(option)} />
    </CardWrapper>
  );
};

export default Index;
