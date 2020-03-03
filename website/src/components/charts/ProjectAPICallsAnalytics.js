import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Select } from 'react-saasify'
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

@observer
export class ProjectAPICallsAnalytics extends React.Component {
  @observable
  _dateRange = 'This month'

  @observable
  _granularity = 'day'

  @observable
  _serviceId = null

  render() {
    const { project } = this.props
    const services = project?.lastPublishedDeployment?.services

    return (
      <div>
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

        <ProjectAPICallsChart
          projectId={project.id}
          dateRange={this._dateRange}
          granularity={this._granularity}
          servicePath={this._serviceId ? this._serviceId.split(' ')[1] : null}
        />
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
