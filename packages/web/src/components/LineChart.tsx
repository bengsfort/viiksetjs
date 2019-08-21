import * as React from 'react';
import get from 'lodash/get';

import { determineYScale, InheritedChartProps } from '@viiksetjs/utils';
import {
  getControlPoints,
  Point,
  drawBezierCurve,
  drawLine,
} from '../utils/canvas';
import { GenericData, RenderedChildPassedProps } from '../typedef';
import { ChildContext } from './ChartArea';

//TODO
// Gradients
// Doesn't render immediately
// Bezier curve looks wonky

function LineChart(
  { color, dataKey, axisId, bezier }: Props // areaProps,
) {
  // gradientOpacity,
  // lineProps,
  if (!dataKey) throw new Error('LineChart: no data key given');
  const {
    data,
    inheritedScale,
    type,
    height,
    margin,
    getCanvas,
    xPoints,
    xScale,
  } = React.useContext(ChildContext);
  const yData = data.map((item: GenericData) => get(item, dataKey));
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>();
  React.useEffect(() => {
    const parentCanvas = getCanvas();
    setCanvas(parentCanvas);
  }, []);
  const getAxis = () => {
    if (!axisId) {
      return inheritedScale;
    }
    return determineYScale({
      type: type || 'linear',
      yPoints: yData,
      height,
      margin,
    });
  };
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(margin.left, height);
      ctx.scale(1, -1);
      const axis = getAxis();

      const getX = (i: number) => xScale(xPoints[i]);
      const getY = (i: number) => axis(yData[i]);
      let controlPoints: Point[] = [];
      const len = data.length;
      if (bezier) {
        for (let i = 0; i < len - 4; i += 2) {
          controlPoints = controlPoints.concat(
            getControlPoints(
              { x: getX(i), y: getY(i) },
              { x: getX(i + 1), y: getY(i + 1) },
              { x: getX(i + 2), y: getY(i + 2) },
              1 / 5
            )
          );
        }
        drawBezierCurve(len, controlPoints, ctx, getX, getY);
      } else {
        drawLine(len, ctx, getX, getY);
      }
      ctx.restore();
    }
  }

  return null;
}

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false,
};

interface LineChartProps extends RenderedChildPassedProps {
  areaProps: Object;
  lineProps: Object;
  gradientOpacity: number[];
  nofill: boolean;
  canvas: HTMLCanvasElement;
  nopattern: boolean;
  bezier: boolean;
}

type Props = Readonly<InheritedChartProps> & Partial<LineChartProps>;

export default LineChart;
