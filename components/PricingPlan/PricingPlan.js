import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

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
        {project => (
          <Paper
            className={cs(styles.plan, className)}
            {...rest}
          >
            <h3 className={styles.name}>
              {plan.name}
            </h3>

            <Divider />

            <div className={styles.features}>
              <div />

              <div>
                Price
              </div>

              <div>
                Rate Limit
              </div>

              <div className={styles.emphasis}>
                API Calls
              </div>

              <div>
                {plan.requests.price}
              </div>

              <div>
                {plan.compute.rateLimit || (
                  <img
                    alt='unlimited'
                    src={infinity}
                    className={styles.infinity}
                  />
                )}
              </div>

              <div className={styles.emphasis}>
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
                    className={styles.infinity}
                  />
                )}
              </div>

              <div className={styles.emphasis}>
                Bandwidth
              </div>

              <div>
                {plan.bandwidth.price}
              </div>

              <div>
                {plan.compute.rateLimit || (
                  <img
                    alt='unlimited'
                    src={infinity}
                    className={styles.infinity}
                  />
                )}
              </div>
            </div>

            <Divider />

            <div style={{ color: project.saas.theme['@primary-color'] }}>
              {plan.desc}
            </div>

            <div className={styles.price}>
              <span className={styles.dollas}>$0.00</span> / mo
            </div>

            {!inline && (
              <Link to={`/signup?plan=${plan.key}`}>
                <CTAButton
                  type={plan.type}
                  className={cs(plan.type === 'secondary' && styles.secondaryCTAButton)}
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
