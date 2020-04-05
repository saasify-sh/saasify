import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { Divider } from 'lib/antd'
import theme from 'lib/theme'

import { CTAButton } from '../CTAButton'
import { Paper } from '../Paper'

import infinity from '../../assets/infinity.svg'

import styles from './styles.module.css'

const allowedTypes = [
  'strong',
  'text',
  'emphasis',
  'link',
  'linkReference',
  'delete',
  'inlineCode'
]

const CustomLink = ({ to, children, ...rest }) =>
  to && to.indexOf(':') >= 0 ? (
    <a href={to} {...rest}>
      {children}
    </a>
  ) : (
    <Link to={to} {...rest}>
      {children}
    </Link>
  )

@inject('auth')
@observer
export class PricingPlan extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
    inline: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    inline: false
  }

  render() {
    const { auth, plan, inline, className, ...rest } = this.props

    const isCurrentPlan = auth.consumer
      ? auth.consumer.plan === plan.slug
      : auth.isAuthenticated && plan.isFree
    const isDowngrade =
      !isCurrentPlan &&
      auth.consumer &&
      auth.consumer.plan !== 'free' &&
      auth.consumer.plan !== plan.slug &&
      plan.isFree

    const actionLink =
      plan.ctaLink ||
      (plan.onClickCTA
        ? ''
        : isDowngrade
        ? '/dashboard'
        : `/signup?plan=${plan.slug}`)

    return (
      <Paper className={theme(styles, 'plan', className)} {...rest}>
        <h3 className={theme(styles, 'name')}>
          {plan.name} {inline ? 'Plan' : ''}
        </h3>

        <Divider />

        {(plan.context?.hasMeteredBilling || plan.context?.hasRateLimits) &&
          plan.context.showMeteredBilling && (
            <Fragment>
              <div className={theme(styles, 'pricing')}>
                <div />

                <div className={theme(styles, 'column')}>Price</div>

                <div className={theme(styles, 'column')}>Rate Limit</div>

                {plan.requests && (
                  <Fragment>
                    <div className={theme(styles, 'emphasis')}>API Calls</div>

                    <div>{plan.requests.price}</div>

                    {plan.requests.rateLimit || (
                      <img
                        alt='unlimited'
                        src={infinity}
                        className={theme(styles, 'infinity')}
                      />
                    )}
                  </Fragment>
                )}

                {plan.metrics &&
                  plan.metrics.map((metric) => (
                    <Fragment key={metric.slug}>
                      <div className={theme(styles, 'emphasis')}>
                        {metric.label}
                      </div>

                      <div>{metric.price}</div>

                      {metric.rateLimit || (
                        <img
                          alt='unlimited'
                          src={infinity}
                          className={theme(styles, 'infinity')}
                        />
                      )}
                    </Fragment>
                  ))}
              </div>

              {(!plan.features || !plan.features.length) && (
                <div className={theme(styles, 'flex')} />
              )}

              <Divider />
            </Fragment>
          )}

        {plan.features && plan.features.length > 0 && (
          <Fragment>
            <div className={theme(styles, 'features')}>
              {plan.features.map((feature, index) => (
                <div className={theme(styles, 'feature')} key={index}>
                  {typeof feature === 'string' ? (
                    <ReactMarkdown
                      source={feature}
                      allowedTypes={allowedTypes}
                      unwrapDisallowed
                    />
                  ) : (
                    feature
                  )}
                </div>
              ))}
            </div>

            <div className={theme(styles, 'flex')} />

            <Divider />
          </Fragment>
        )}

        {plan.desc && (
          <div
            className={theme(styles, 'desc')}
            style={{ color: theme['@primary-color'] }}
          >
            {plan.desc}
          </div>
        )}

        {plan.price && (
          <div className={theme(styles, 'price')}>
            <span className={theme(styles, 'dollas')}>{plan.price}</span>
            {plan.interval && <span> / {plan.interval}</span>}
          </div>
        )}

        {!inline &&
          (isCurrentPlan ? (
            <CTAButton disabled type={plan.type}>
              Current plan
            </CTAButton>
          ) : (
            <CustomLink to={actionLink} onClick={plan.onClickCTA}>
              <CTAButton
                type={plan.type}
                className={cs(
                  plan.type === 'secondary' &&
                    theme(styles, 'secondaryCTAButton')
                )}
              >
                {plan.cta ||
                  (isDowngrade
                    ? 'Downgrade'
                    : auth.consumer?.enabled
                    ? auth.consumer?.plan === 'free'
                      ? 'Upgrade'
                      : 'Switch plans'
                    : 'Get started')}
              </CTAButton>
            </CustomLink>
          ))}
      </Paper>
    )
  }
}
