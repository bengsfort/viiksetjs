import React, { Fragment } from 'react'

import categoricalSeries from '../../data/categoricalSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, BarChart } from 'viiksetjs'

const CategoricalSeries = () => {
  return (
    <Fragment>
      <GraphContainer>
        <ChartArea
          data={categoricalSeries.data}
          type="ordinal"
          color="#dc7d5b"
          xKey="company"
          stroke="grey"
          nogrid
          labelY="Culinary Score"
        >
          <BarChart dataKey="score" color="#dc7d5b" />
        </ChartArea>
      </GraphContainer>
      <Snippet>
        {`
        <ChartArea
          data={categoricalSeries.data}
          type="ordinal"
          color="#dc7d5b"
          xKey="company"
          stroke="grey"
          nogrid
          labelY="Culinary Score"
        >
          <BarChart dataKey="score" color="#dc7d5b" />
        </ChartArea>
        `}
      </Snippet>
    </Fragment>
  )
}

export default CategoricalSeries
