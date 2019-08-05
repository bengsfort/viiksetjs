import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
import { StyledLeftAxis, StyledRightAxis } from './styledComponents';
import { RenderedChildProps, GenericData } from 'typedef';

const YAxis = ({
  height,
  data,
  axisId,
  color,
  position,
  width,
  margin,
  label,
  labelProps,
  tickLabels,
  numTicks,
  tickFormat,
  ...rest
}: Props): React.ReactElement => {
  React.useEffect(() => {
    // eslint-disable-next-line
    if (process.env.NODE_ENV !== 'production') {
      if (dataPoints.includes(undefined)) {
        console.warn(`YAxis: No data found with axisId ${axisId}`);
      }
    }
  }, []);

  const dataPoints = data.map((item: GenericData) => get(item, axisId));
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top]);
  return position === 'left' ? (
    <StyledLeftAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={margin.left}
      numTicks={numTicks}
      hideTicks
      tickFormat={tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25em',
              dx: '-0.75em',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12,
            })
      }
      {...rest}
    />
  ) : (
    <StyledRightAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={width}
      numTicks={numTicks}
      hideTicks
      tickFormat={tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25em',
              dx: '0.5em',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12,
            })
      }
      {...rest}
    />
  );
};

interface Props extends RenderedChildProps {
  position: 'left' | 'right';
  label: string;
  tickFormat(d: any, i: number): string;
  numTicks: number;
  axisId: string;
  tickLabels(
    d: any,
    i: number
  ): {
    fontWeight: number;
    strokeWidth: number | string;
    textAnchor: string;
    fontSize: number | string;
  };
  labelProps: Object;
}

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  data: [],
};

export default React.memo(YAxis);
