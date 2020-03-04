import React from 'react'
import { Spin, Statistic } from 'react-saasify'
import { QueryRenderer } from '@cubejs-client/react'
import { cubejsApi } from 'lib/cube'

const numberRender = ({ resultSet, ...rest }) => {
  const seriesNames = resultSet.seriesNames()

  if (seriesNames.length) {
    return (
      <>
        {seriesNames.map((s) => (
          <Statistic
            key={s.key}
            value={resultSet.totalRow()[s.key] || 0}
            {...rest}
          />
        ))}
      </>
    )
  } else {
    return <Statistic value={0} {...rest} />
  }
}

const renderChart = (Component, props) => ({ resultSet, error, ...rest }) => {
  if (error) {
    // TODO
    return error.toString()
  } else if (resultSet) {
    return <Component resultSet={resultSet} {...props} />
  }

  return <Spin />
}

export const DataStatistic = ({ query, ...rest }) => (
  <QueryRenderer
    query={query}
    cubejsApi={cubejsApi}
    render={renderChart(numberRender, rest)}
  />
)
