import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputMask from 'react-input-mask'
import { TextField } from '@material-ui/core'
import { isValidDate, isoToLocalDate, localToIsoDateOrNull } from '../../util/dateHelper'

const defaultDateMask = '99/99/9999'

class MaskedDateField extends Component {
  constructor(props) {
    super(props)
    const maskedValue = props.value ? isoToLocalDate(props.value) : ''
    const isValid = isValidDate(maskedValue, { allowFutureDate: this.props.isFutureDatesAllowed })
    this.state = {
      isValid,
      maskedValue,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const maskedValue = event.target.value
    const isValid = isValidDate(maskedValue, { allowFutureDate: this.props.isFutureDatesAllowed })

    if (this.props.onChange && (isValid || this.state.isValid)) {
      event.target.value = isValid ? localToIsoDateOrNull(maskedValue) : null
      this.props.onChange(event)
    }

    this.setState({
      isValid,
      maskedValue,
    })
  }

  render() {
    const futureDateHelperText = !this.props.isFutureDatesAllowed ? ' Future dates will not be accepted.' : ''
    return (
      <InputMask mask={defaultDateMask} value={this.state.maskedValue} onChange={event => this.handleChange(event)}>
        {() => (
          <TextField
            required={this.props.isRequired}
            id={this.props.id}
            label={this.props.label}
            error={!this.state.isValid}
            className={`masked-date-field ${this.props.className}`}
            inputProps={this.props.inputProps}
            margin="normal"
            helperText={!this.state.isValid ? `Enter valid date (MM/DD/YYYY).${futureDateHelperText}` : null}
            InputLabelProps={this.props.InputLabelProps}
            FormHelperTextProps={this.props.FormHelperTextProps}
          />
        )}
      </InputMask>
    )
  }
}

MaskedDateField.propTypes = {
  FormHelperTextProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  isFutureDatesAllowed: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
}

MaskedDateField.defaultProps = {
  FormHelperTextProps: {},
  className: '',
  isFutureDatesAllowed: true,
  id: '',
  InputLabelProps: {},
  inputProps: {},
  isRequired: false,
  required: false,
  label: '',
  onChange: () => {},
  value: null,
}

export default MaskedDateField
