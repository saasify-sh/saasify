import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import theme from 'lib/theme'

import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Divider } from 'lib/antd'

import { CTAButton } from '../CTAButton'
import { Paper } from '../Paper'

import infinity from '../../assets/infinity.svg'

import styles from './styles.module.css'

@observer
export class PricingPlan extends Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    inline: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    inline: false
  }

  render() {
    const {
      plan,
      inline,
      className,
      ...rest
    } = this.props

    return (
      <Paper
        className={theme(styles, 'plan', className)}
        {...rest}
      >
        <h3 className={theme(styles, 'name')}>
          {plan.name} {inline ? 'Plan' : ''}
        </h3>

        <Divider />

        <div className={theme(styles, 'features')}>
          <div />

          <div className={theme(styles, 'column')}>
            Price
          </div>

          <div className={theme(styles, 'column')}>
            Rate Limit
          </div>

          {plan.requests && (
            <Fragment>
              <div className={theme(styles, 'emphasis')}>
                API Calls
              </div>

              <div>
                {plan.requests.price}
              </div>

              {plan.requests.rateLimit || (
                <img
                  alt='unlimited'
                  src={infinity}
                  className={theme(styles, 'infinity')}
                />
              )}
            </Fragment>
          )}

          {plan.compute && (
            <Fragment>
              <div className={theme(styles, 'emphasis')}>
                Compute Time
              </div>

              <div>
                {plan.compute.price}
              </div>

              <div>
                {plan.compute.rateLimit || (
                  <img
                    alt='unlimited'
                    src={infinity}
                    className={theme(styles, 'infinity')}
                  />
                )}
              </div>
            </Fragment>
          )}

          {plan.bandwidth && (
            <Fragment>
              <div className={theme(styles, 'emphasis')}>
                Bandwidth
              </div>

              <div>
                {plan.bandwidth.price}
              </div>

              <div>
                {plan.bandwidth.rateLimit || (
                  <img
                    alt='unlimited'
                    src={infinity}
                    className={theme(styles, 'infinity')}
                  />
                )}
              </div>
            </Fragment>
          )}
        </div>

        <Divider />

        <div style={{ color: theme['@primary-color'] }}>
          {plan.desc}
        </div>

        <div className={theme(styles, 'price')}>
          <span className={theme(styles, 'dollas')}>{plan.price}</span> / {plan.interval}
        </div>

        {!inline && (
          <Link to={`/signup?plan=${plan.key}`}>
            <CTAButton
              type={plan.type}
              className={cs(plan.type === 'secondary' && theme(styles, 'secondaryCTAButton'))}
            >
              Get Started
            </CTAButton>
          </Link>
        )}
      </Paper>
    )
  }
}
