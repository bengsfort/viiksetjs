import * as React from 'react';
import { storiesOf } from '@storybook/react';

import categoricalSeries from './data/categoricalSeries.json';
import { GraphContainer } from './styledComponents';
import ChartArea from '../ChartArea';
import BarChart from '../BarChart/Bar';
import { isMobile } from './constants';

storiesOf('BarChart', module).add('Categorical Series', () => (
  <GraphContainer>
    <ChartArea
      data={categoricalSeries.data}
      type="ordinal"
      color="#dc7d5b"
      axes={{
        x: {
          numTicks: isMobile ? 1 : 4,
        },
        y: {
          label: 'Culinary Score',
        },
      }}
      xKey="company"
      stroke="grey"
      nogrid
    >
      <BarChart dataKey="score" color="#dc7d5b" />
    </ChartArea>
  </GraphContainer>
));