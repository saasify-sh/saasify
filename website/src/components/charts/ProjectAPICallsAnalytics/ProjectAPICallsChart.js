import React from 'react'
import { Spin } from 'react-saasify'
import { QueryRenderer } from '@cubejs-client/react'
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import { format } from 'date-fns'
import { cubejsApi } from 'lib/cube'

const measureToLabel = {
  'Calls.count': 'API Calls',
  'Calls.errorCount': 'API Errors',
  'Calls.errorPercentage': 'API Errors Percent'
}

const stackedChartData = (resultSet) => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(
          xValues.map((v) => format(new Date(v), 'yyyy-MM-dd')),
          ', '
        ),
        color: resultSet.axisValuesString(
          yValues.map((v) => measureToLabel[v]),
          ', '
        ),
        measure: m && Number.parseFloat(m)
      }))
    )
    .reduce((a, b) => a.concat(b), [])

  return data
}

const lineRender = ({ resultSet }) => (
  <Chart height={400} data={stackedChartData(resultSet)} forceFit>
    <Legend />
    <Axis name='x' />
    <Axis name='measure' />
    <Tooltip crosshairs={{ type: 'y' }} />
    <Geom
      type='line'
      position='x*measure'
      size={2}
      color='color'
      shape='smooth'
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
    />
  </Chart>
)

const renderChart = (Component) => ({ resultSet, error }) =>
  (resultSet && <Component resultSet={resultSet} />) ||
  (error && error.toString()) || <Spin />

export const ProjectAPICallsChart = ({
  projectId,
  granularity = 'day',
  dateRange = 'This week',
  measures = ['Calls.count'],
  servicePath = null
}) => (
  <QueryRenderer
    query={{
      measures,
      timeDimensions: [
        {
          dimension: 'Calls.date',
          granularity,
          dateRange: dateRange === 'All time' ? undefined : dateRange
        }
      ],
      dimensions: [],
      filters: [
        {
          dimension: 'Calls.project',
          operator: 'equals',
          values: [projectId]
        },
        servicePath && {
          dimension: 'Calls.service',
          operator: 'equals',
          values: [servicePath]
        }
      ].filter(Boolean)
    }}
    cubejsApi={cubejsApi}
    render={renderChart(lineRender)}
  />
)
