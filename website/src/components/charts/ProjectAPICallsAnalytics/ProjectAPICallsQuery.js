export const getQuery = ({
  projectId,
  granularity,
  dateRange,
  measures = [],
  dimensions = [],
  servicePath = null,
  ...rest
}) => ({
  ...rest,
  measures,
  timeDimensions: [
    {
      dimension: 'Calls.date',
      granularity,
      dateRange: dateRange === 'All time' ? undefined : dateRange
    }
  ],
  dimensions,
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
})
