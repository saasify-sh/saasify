import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Typography } from 'antd'
import cs from 'classnames'

import { FinContext } from '../FinContext'
import { CTAButton } from '../CTAButton'
import { Paper } from '../Paper'

import infinity from '../../assets/infinity.svg'

import styles from './styles.module.css'

const { Text } = Typography

export class PricingSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Pricing
              </h1>

              <div className={styles.subtitle}>
                Free. Unlimited. <b>Pay as you Grow.</b>
              </div>

              <div className={styles.plans}>
                <Paper className={styles.plan}>
                  <h3 className={styles.name}>
                    Free
                  </h3>

                  <Divider />

                  <div className={cs(styles.feature, styles.split)}>
                    <span>
                      $0 / call
                    </span>

                    <span>
                      N / day
                    </span>
                  </div>

                  <Divider />

                  <div className={cs(styles.feature, styles.split)}>
                    <span>
                      $0
                    </span>

                    <span>
                      <img src={infinity} style={{ height: '1.5em' }} />
                    </span>
                  </div>

                  <Divider />

                  <div className={cs(styles.feature, styles.split)}>
                    <span>
                      $0 / GB
                    </span>

                    <span>
                      100 GB / mo
                    </span>
                  </div>

                  <Divider />

                  <Text type='primary'>
                    FREE FOREVER
                  </Text>

                  <div className={styles.price}>
                    $0.00 / mo
                  </div>

                  <CTAButton type='secondary' inline>
                    Get Started
                  </CTAButton>
                </Paper>
              </div>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
