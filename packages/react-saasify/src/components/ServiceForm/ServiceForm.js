import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { ReactFromJSONSchema } from './ReactFromJSONSchema'
import { ServiceEntry } from './ServiceEntry'
import { ServiceInput } from './ServiceInput'
import { ServiceInputCheckbox } from './ServiceInputCheckbox'
import { ServiceInputJSON } from './ServiceInputJSON'
import { ServiceInputNumber } from './ServiceInputNumber'
import { ServiceInputSelect } from './ServiceInputSelect'
import { ServiceInputMultiSelect } from './ServiceInputMultiSelect'
import { restrictDefinitionToExample, mergeInValues } from './helpers'

import styles from './styles.module.css'

export class ServiceForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    restrictToFirstExample: PropTypes.bool,
    service: PropTypes.object
  }

  state = {
    definition: {},
    values: {}
  }

  static getDerivedStateFromProps(props, state) {
    const definition = props.restrictToFirstExample
      ? restrictDefinitionToExample(
          props.service.definition,
          props.service.examples[0],
          state.values
        )
      : mergeInValues(props.service.definition)

    return {
      ...state,
      definition
    }
  }

  render() {
    const { definition } = this.state

    return (
      <div className={theme(styles, 'service-form')}>
        <ReactFromJSONSchema
          definition={definition}
          onChange={this._handleOnChange}
          mapping={{
            default: ({ _type }) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                Missing input for {_type}
              </div>
            ),
            entry: ServiceEntry,
            array: ServiceInputMultiSelect,
            boolean: ServiceInputCheckbox,
            enum: ServiceInputSelect,
            number: ServiceInputNumber,
            object: ServiceInputJSON,
            string: ServiceInput
          }}
        />
      </div>
    )
  }

  _handleOnChange = (e) => {
    const values = {
      ...this.state.values,
      [e.target.name]: e.target.value
    }

    this.setState({
      values
    })

    this.props.onChange(values)
  }
}
