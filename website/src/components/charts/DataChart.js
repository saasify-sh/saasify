import React from 'react'
import { Spin } from 'react-saasify'
import { QueryRenderer } from '@cubejs-client/react'
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import { format } from 'date-fns'
import { cubejsApi } from 'lib/cube'

const stackedChartData = (resultSet, measureToLabel) => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(
          xValues.map((v) => format(new Date(v), 'yyyy-MM-dd')),
          ', '
        ),
        color: resultSet.axisValuesString(
          yValues.map((v) => (measureToLabel ? measureToLabel[v] : v)),
          ', '
        ),
        measure: m && Number.parseFloat(m)
      }))
    )
    .reduce((a, b) => a.concat(b), [])

  return data
}

const lineRender = ({
  resultSet,
  xAxis,
  yAxis,
  geom,
  measureToLabel,
  ...rest
}) => (
  <Chart
    height={400}
    data={stackedChartData(resultSet, measureToLabel)}
    forceFit
    {...rest}
  >
    <Legend
      textStyle={{
        fontFamily: 'Quicksand',
        fontSize: 18,
        fill: '#333',
        fontWeight: 'bold'
      }}
    />
    <Axis name='x' {...xAxis} />
    <Axis name='measure' {...yAxis} />
    <Tooltip crosshairs={{ type: 'y' }} />
    <Geom
      type='line'
      position='x*measure'
      size={2}
      color='color'
      shape='smooth'
      {...geom}
    />
    <Geom
      type='point'
      position='x*measure'
      size={4}
      shape='circle'
      color='color'
      style={{
        stroke: '#fff',
        lineWidth: 1
      }}
      {...geom}
    />
  </Chart>
)

const renderChart = (Component, props) => ({ resultSet, error, ...rest }) => {
  console.log({ resultSet, error, ...rest })

  if (error) {
    // TODO
    return error.toString()
  } else if (resultSet) {
    return <Component resultSet={resultSet} {...props} />
  }

  return <Spin />
}

export const DataChart = ({ query, ...rest }) => (
  <QueryRenderer
    query={query}
    cubejsApi={cubejsApi}
    render={renderChart(lineRender, rest)}
  />
)
