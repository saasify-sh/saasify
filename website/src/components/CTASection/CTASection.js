import React, { Component } from 'react'
import { CTAButton, Section } from 'react-saasify'

import { DialogManager } from '../../lib/DialogManager'

export class CTASection extends Component {
  render() {
    return (
      <Section {...this.props}>
        <CTAButton onClick={this._onClickRequestAccess}>
          Request Early Access
        </CTAButton>
      </Section>
    )
  }

  _onClickRequestAccess = () => {
    DialogManager.isSignupDialogOpen = true
  }
}
