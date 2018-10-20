import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { isEmpty } from '../../util/common';
import { isoToJsDate, isValidLocalDate, jsDateToIso, localToIsoDate } from '../../util/dateHelper';
import { LOCAL_DATE_FORMAT } from '../../util/constants';
import './style.sass';

Moment.locale('en');
momentLocalizer();

const dateValue = value => (isEmpty(value) ? null : isoToJsDate(value));

class DateField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dateValue(this.props.value),
      key: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, currentState) {
    const value = dateValue(nextProps.value);
    return value !== currentState.value ? { value } : null;
  }

  handleOnChange = date => {
    if (date === null) {
      this.props.onChange('');
      return;
    }
    this.setState({ value: date });
    this.props.onChange(jsDateToIso(date));
  };

  handleOnBlur = event => {
    const date = event.target.value;
    if (isEmpty(date) || !isValidLocalDate(date)) {
      // recreate <DateTimePicker> to clear raw data in it as a workaround
      if (this.state.value !== date) {
        this.setState({ key: Math.random() });
      }
      return;
    }
    this.props.onChange(localToIsoDate(date));
  };

  render() {
    const { id, isRequired, ariaLabelledBy, ariaDescribedBy, onKeyUp } = this.props;
    const { value, key } = this.state;
    return (
      <DateTimePicker
        id={id}
        key={key}
        value={value}
        date={true}
        time={false}
        format={LOCAL_DATE_FORMAT}
        onBlur={this.handleOnBlur}
        onChange={this.handleOnChange}
        onKeyUp={onKeyUp}
        placeholder={'mm/dd/yyyy'}
        required={isRequired}
        aria-required={isRequired}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
    );
  }
}

DateField.defaultProps = {
  isRequired: false,
  ariaLabelledBy: null,
  ariaDescribedBy: null,
  onKeyUp: () => {},
  value: null,
};

DateField.propTypes = {
  ariaDescribedBy: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func,
  value: PropTypes.string,
};

export default DateField;
