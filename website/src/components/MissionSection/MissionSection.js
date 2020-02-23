import React, { Component } from 'react'

import { Section, Paper, theme } from 'react-saasify'

import styles from './styles.module.css'

export class MissionSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='mission'
        title='Mission'
        className={theme(styles, 'mission', className)}
        {...rest}
      >
        <Paper className={theme(styles, 'mission-body')}>
          <p>
            <b>To my fellow software developers,</b>
          </p>

          <p>
            I'm at my absolute best when I'm working on a side project that I'm
            passionate about.
          </p>

          <p>
            Whether it's an open source project, a cool demo app, or learning a
            new technology, my productivity and the satisfaction I get from
            these projects is 10x my normal experience at work.
          </p>

          <p>
            And yet, I'm forced to treat these projects as a hobby because it
            takes so much effort to even try and monetize them, much less give
            up the financial stability of being a full time software engineer.
          </p>

          <p>And I'm not alone in this frustration.</p>

          <p>
            There are thousands of talented developers around the world who
            struggle with a similar tension between their day jobs as software
            engineers and their passion projects.
          </p>

          <p>
            Personally, this presents an opportunity to help solve a problem
            that I care a lot about, and this is precisely why I started working
            on Saasify.
          </p>

          <h5 className={theme(styles, 'mission-statement')}>
            Our mission is to help developers realize the full potential of
            their passion projects.
          </h5>

          <p>
            Whether you call it Indie SaaS, Indie Hackers, Micro SaaS, or
            sustainable startups,{' '}
            <i>the movement to address this problem is the same</i>.
          </p>

          <p>
            <b>It's a movement</b> towards more flexible, remote, fulfilling
            lifestyles.
          </p>

          <p>
            <b>It's a movement</b> towards small, independent, profitable SaaS
            businesses.
          </p>

          <p>
            <b>It's a movement</b> towards empowering ambitious developers to
            focus on their passion.
          </p>

          <p>And I genuinely love this movement.</p>

          <p>
            <b>Saasify is a Shopify for SaaS</b>. Our goal is make it easier for
            developers to launch their own SaaS, join this movement, and start
            reaping the benefits of flexible, remote, passive income.
          </p>

          <p>
            Because we're all better versions of ourselves when we're able to
            focus on our passion.
          </p>

          <p>
            Travis Fischer
            <br />
            Founder
          </p>
        </Paper>
      </Section>
    )
  }
}
