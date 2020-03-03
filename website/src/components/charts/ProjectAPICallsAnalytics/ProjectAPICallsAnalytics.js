import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Select } from 'react-saasify'
import cs from 'classnames'

import { ProjectAPICallsChart } from './ProjectAPICallsChart'

import styles from './styles.module.css'

const dateRanges = [
  'All time',
  'Today',
  'Yesterday',
  'This week',
  'This month',
  'This quarter',
  'This year',
  'Last 7 days',
  'Last 30 days',
  'Last week',
  'Last month',
  'Last quarter',
  'Last year'
]
const granularities = ['hour', 'day', 'week']

function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const metrics = [
  {
    label: 'API Calls',
    measures: ['Calls.count'],
    numberRenderProps: {
      precision: 0
    }
  },
  {
    label: 'Error Rate',
    measures: ['Calls.errorPercentage'],
    numberRenderProps: {
      precision: 0,
      suffix: '%'
    },
    lineRenderProps: {
      yAxis: {
        label: {
          formatter: (val) => `${val}%`
        }
      },
      geom: {
        tooltip: [
          'x*measure',
          (x, val) => ({
            name: 'Error Rate',
            value: `${round(val)}%`
          })
        ]
      }
    }
  },
  {
    label: 'Average Latency',
    measures: ['Calls.averageLatency'],
    numberRenderProps: {
      precision: 0,
      suffix: 'ms'
    },
    lineRenderProps: {
      yAxis: {
        label: {
          formatter: (val) => `${val} ms`
        }
      },
      geom: {
        tooltip: [
          'x*measure',
          (x, val) => ({
            name: 'Avg Latency',
            value: `${val | 0} ms`
          })
        ]
      }
    }
  }
]

@observer
export class ProjectAPICallsAnalytics extends React.Component {
  @observable
  _dateRange = 'This month'

  @observable
  _granularity = 'day'

  @observable
  _serviceId = null

  @observable
  _metric = 'API Calls'

  render() {
    const { project, ...rest } = this.props
    const services = project?.lastPublishedDeployment?.services

    const selectedMetric = metrics.find(
      (metric) => metric.label === this._metric
    )

    return (
      <div {...rest}>
        <div className={styles.header}>
          <div className={styles.service}>
            <div className={styles.label}>Endpoints</div>

            <Select
              value={this._serviceId}
              onChange={this._onChangeServiceId}
              disabled={!services}
            >
              <Select.Option value={null}>All endpoints</Select.Option>

              {services &&
                services.map((service) => {
                  const id = `${service.httpMethod} ${service.path}`
                  return (
                    <Select.Option key={id} value={id}>
                      {id}
                    </Select.Option>
                  )
                })}
            </Select>
          </div>

          <div className={styles.dateRange}>
            <div className={styles.label}>Time Range</div>

            <Select value={this._dateRange} onChange={this._onChangeDateRange}>
              {dateRanges.map((dateRange) => (
                <Select.Option key={dateRange} value={dateRange}>
                  {dateRange}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className={styles.granularity}>
            <div className={styles.label}>Granularity</div>

            <Select
              value={this._granularity}
              onChange={this._onChangeGranularity}
            >
              {granularities.map((granularity) => (
                <Select.Option key={granularity} value={granularity}>
                  {granularity}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.metrics}>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cs(
                styles.metric,
                metric.label === this._metric && styles.activeMetric
              )}
              onClick={() => {
                this._metric = metric.label
              }}
            >
              <h4 className={styles.label}>{metric.label}</h4>

              <ProjectAPICallsChart
                projectId={project.id}
                dateRange={this._dateRange}
                granularity={this._granularity}
                servicePath={
                  this._serviceId ? this._serviceId.split(' ')[1] : null
                }
                measures={metric.measures}
                renderProps={metric.numberRenderProps}
                type='number'
              />
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <ProjectAPICallsChart
            projectId={project.id}
            dateRange={this._dateRange}
            granularity={this._granularity}
            servicePath={this._serviceId ? this._serviceId.split(' ')[1] : null}
            measures={selectedMetric.measures}
            renderProps={selectedMetric.lineRenderProps}
            type='line'
          />
        </div>
      </div>
    )
  }

  _onChangeDateRange = (dateRange) => {
    this._dateRange = dateRange
  }

  _onChangeGranularity = (granularity) => {
    this._granularity = granularity
  }

  _onChangeServiceId = (id) => {
    this._serviceId = id
  }
}
