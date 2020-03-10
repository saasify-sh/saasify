export const getQuery = ({
  projectId,
  granularity,
  dateRange,
  measures = [],
  dimensions = [],
  ...rest
}) => ({
  ...rest,
  measures,
  timeDimensions: [
    {
      dimension: 'Consumers.createdAt',
      granularity,
      dateRange: dateRange === 'All time' ? undefined : dateRange
    }
  ],
  dimensions,
  filters: [
    {
      dimension: 'Consumers.project',
      operator: 'equals',
      values: [projectId]
    },
    {
      dimension: 'Consumers.env',
      operator: 'equals',
      values: ['prod']
    }
  ].filter(Boolean)
})
