import {
  scaleLinear,
  scaleTime,
  scaleBand,
  ScaleBand,
  ScaleLinear,
  ScaleTime,
} from 'd3-scale';
import { ScaleProps, ScaleFunction } from './typedef';
import get from 'lodash/get';

export const determineXScale = ({
  type,
  xPoints,
  width,
  orientation,
  margin,
}: Partial<ScaleProps>): ScaleFunction<any, any> => {
  if (!xPoints) throw new Error('xPoints not found');
  const range = [get(margin, 'left', 0), width || 0];
  switch (type) {
    case 'ordinal':
      return orientation === 'horizontal'
        ? (scaleLinear()
            .domain([0, Math.max(...(xPoints as number[]))])
            .range(range) as ScaleLinear<number, number>)
        : (scaleBand()
            .domain(xPoints as string[])
            .range([get(margin, 'left', 0), width || 0])
            .padding(0.1) as ScaleBand<React.ReactText>);
    case 'linear':
      return scaleLinear()
        .domain([0, Math.max(...(xPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
    case 'time':
    default:
      return scaleTime()
        .domain([xPoints[0] as Date, xPoints[xPoints.length - 1] as Date])
        .range(range) as ScaleTime<number, number>;
  }
};

export const determineYScale = ({
  type,
  orientation,
  yPoints,
  height,
  invertedRange,
  margin,
}: Partial<ScaleProps>): ScaleFunction<any, any> => {
  const marginTop = get(margin, 'top', 0) as number;
  const range = [height as number, marginTop];
  const reverseRange = [marginTop, height || 0];
  switch (type) {
    case 'linear':
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
    case 'ordinal':
      return orientation === 'horizontal'
        ? (scaleBand()
            .domain(yPoints as string[])
            .range([height as number, marginTop])
            .padding(0.1) as ScaleBand<React.ReactText>)
        : (scaleLinear()
            .domain([0, Math.max(...(yPoints as number[]))])
            .range(invertedRange ? reverseRange : range) as ScaleLinear<
            number,
            number
          >);
    default:
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
  }
};

/**
 * Finds the xCoordinates within the tooltipCalcuation
 * TODO Support more chart types
 */
export const findTooltipX = ({
  calculatedX,
  xScale,
}: {
  calculatedX: any;
  xScale(num: number): number;
}): number => {
  return xScale(calculatedX);
};
