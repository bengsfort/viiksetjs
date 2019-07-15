import * as React from 'react'
import { Point } from '@vx/point'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'
import { Margin, ScaleFunction } from '../types/index'
import head from 'lodash/head'
import last from 'lodash/last'
import sortedUniq from 'lodash/sortedUniq'

/**
 * Recursively clones children, passing props down nested DOM structures
 */
export const recursiveCloneChildren = (children: React.ReactNode, props: Object): React.ReactNode =>
  React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child

    if (child.props) {
      props['children'] = recursiveCloneChildren(child.props['children'], props)

      return React.cloneElement(child, props)
    }

    return child
  })

type ScaleProps = {
  type: string
  xPoints: number[] | string[]
  yPoints: number[] | string[]
  width: number
  invertedRange: boolean
  height: number
  orientation: string
  margin: Margin
}

export const determineXScale = ({
  type,
  xPoints,
  width,
  margin
}: Partial<ScaleProps>): ScaleFunction => {
  const range = [margin.left, width]
  const sortedX = sortedUniq(xPoints as number[])

  switch (type) {
    case 'ordinal':
      return scaleBand()
        .domain(xPoints as string[])
        .range(range as [number, number])
        .padding(0.1)
    case 'linear':
      return scaleLinear()
        .domain([head(sortedX), last(sortedX)])
        .range(range)
    default:
      return scaleTime()
        .domain([head(sortedX), last(sortedX)])
        .range(range)
  }
}

export const determineYScale = ({
  type,
  orientation,
  yPoints,
  height,
  invertedRange,
  margin
}: Partial<ScaleProps>): ScaleFunction => {
  const range = [height, margin.top]
  const reverseRange = [margin.top, height]
  switch (type) {
    case 'ordinal':
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range)
    case 'linear':
      return orientation === 'horizontal'
        ? scaleBand()
            .domain(yPoints as string[])
            .range([height, margin.top])
            .padding(0.1)
        : scaleLinear()
            .domain([0, Math.max(...(yPoints as number[]))])
            .range(invertedRange ? reverseRange : range)
    default:
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range)
  }
}

/**
 * Finds the xCoordinates within the tooltipCalcuation
 * TODO Support more chart types
 */
export const findTooltipX = ({
  type,
  calculatedX,
  xScale
}: {
  type: string
  calculatedX: number
  xScale(num: number): number
}): number => {
  switch (type) {
    case 'ordinal':
    case 'linear':
      return xScale(calculatedX)
    default:
      return xScale(calculatedX)
  }
}

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 */
export const biaxial = (children: React.ReactNode): boolean =>
  React.Children.map(
    children,
    child => React.isValidElement(child) && child.props.hasOwnProperty('axisId')
  ).includes(true)
