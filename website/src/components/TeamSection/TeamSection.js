import React, { Component } from 'react'
import { Section, Icon, theme } from 'react-saasify'

import { team } from './team'

import styles from './styles.module.css'

const social = ['linkedin', 'github', 'twitter']

export class TeamSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='team'
        title='Team'
        className={theme(styles, 'team', className)}
        {...rest}
      >
        <div className={theme(styles, 'members')}>
          {team.map((member) => (
            <div className={theme(styles, 'member')} key={member.name}>
              <a
                href={member.linkedin}
                rel='noopener noreferrer'
                target='_blank'
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className={theme(styles, 'photo')}
                />
              </a>

              <h3>{member.name}</h3>

              <p>{member.title}</p>

              <div className={theme(styles, 'links')}>
                {social.map(
                  (social) =>
                    member[social] && (
                      <a
                        key={social}
                        href={member[social]}
                        rel='noopener noreferrer'
                        target='_blank'
                        className={theme(styles, 'link')}
                      >
                        <Icon type={social} />
                      </a>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    )
  }
}
