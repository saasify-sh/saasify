import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import theme from 'lib/theme'

import { Link } from 'react-router-dom'
import { Divider } from 'antd'

import { FinContext } from '../FinContext'
import { CTAButton } from '../CTAButton'
import { Paper } from '../Paper'

import infinity from '../../assets/infinity.svg'

import styles from './styles.module.css'

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
      <FinContext.Consumer>
        {({ project }) => (
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

              <div>
                Price
              </div>

              <div>
                Rate Limit
              </div>

              <div className={theme(styles, 'emphasis')}>
                API Calls
              </div>

              <div>
                {plan.requests.price}
              </div>

              <div>
                {plan.requests.rateLimit || (
                  <img
                    alt='unlimited'
                    src={infinity}
                    className={theme(styles, 'infinity')}
                  />
                )}
              </div>

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
        )}
      </FinContext.Consumer>
    )
  }
}
