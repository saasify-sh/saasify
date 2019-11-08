import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import ReactFromJSON from 'react-from-json'

import { Checkbox, Input, InputNumber } from 'lib/antd'

import styles from './styles.module.css'

const ServiceInputWrapper = ({ children }) => (
  <div className={theme(styles, 'service-form__input-wrapper')}>{children}</div>
)

const ServiceInputWrapperWithLabel = ({ children, propKey, description }) => (
  <ServiceInputWrapper>
    <label>
      <div className={theme(styles, 'service-form__input-label')}>
        <span className={theme(styles, 'service-form__input-name')}>
          {propKey} -{' '}
        </span>

        <span className={theme(styles, 'service-form__input-description')}>
          {description}
        </span>
      </div>
      {children}
    </label>
  </ServiceInputWrapper>
)

const ServiceInput = ({
  default: defaultValue,
  type,
  onChange,
  propKey,
  ...props
}) => (
  <ServiceInputWrapperWithLabel propKey={propKey} {...props}>
    <Input
      type={type}
      value={defaultValue}
      onChange={onChange}
      name={propKey}
    />
  </ServiceInputWrapperWithLabel>
)

const ServiceInputNumber = ({
  default: defaultValue,
  type,
  onChange,
  name,
  ...props
}) => (
  <ServiceInputWrapperWithLabel {...props}>
    <InputNumber
      type={type}
      value={defaultValue}
      onChange={onChange}
      name={name}
    />
  </ServiceInputWrapperWithLabel>
)

const ServiceCheckbox = ({
  default: defaultValue,
  type,
  propKey,
  onChange,
  name
}) => (
  <ServiceInputWrapper>
    <Checkbox
      type={type}
      checked={defaultValue}
      onChange={onChange}
      name={name}
    >
      {propKey}
    </Checkbox>
  </ServiceInputWrapper>
)

// props is the "properties" object, where the values are React components
const ServiceEntry = ({ propKey, _type, onChange, ...props }) => (
  <React.Fragment>{Object.values(props)}</React.Fragment>
)

const mapProp = (prop, onChange) => {
  if (prop && prop !== onChange && prop.type) {
    const { type, ...props } = prop

    return {
      type,
      props: {
        ...props,
        onChange,
        name: props.propKey
      }
    }
  }

  return prop
}

const ReactFromDefinition = ({ definition, mapping, onChange }) => (
  <ReactFromJSON
    entry={{ ...definition.params.schema.properties, type: 'entry' }}
    mapping={mapping}
    mapProp={(prop) => mapProp(prop, onChange)}
  />
)

const restrictDefinitionToExample = (definition, example, values) => ({
  ...definition,
  params: {
    schema: {
      properties: Object.keys(example.input).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            type: typeof example.input[key], // Catch rest params
            ...definition.params.schema.properties[key],
            default:
              typeof values[key] !== 'undefined'
                ? values[key]
                : example.input[key]
          }
        }),
        {}
      )
    }
  }
})

const mergeInValues = (definition, values) => {
  const { properties } = definition.params.schema

  return {
    ...definition,
    params: {
      schema: {
        properties: Object.keys(properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              ...properties[key],
              default: values[key]
            }
          }),
          {}
        )
      }
    }
  }
}

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
        <ReactFromDefinition
          definition={definition}
          onChange={this._handleOnChange}
          mapping={{
            default: ({ _type }) => (
              <div style={{ whiteSpace: 'nowrap' }}>
                Missing input for {_type}
              </div>
            ),
            entry: ServiceEntry,
            boolean: ServiceCheckbox,
            number: ServiceInputNumber,
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
