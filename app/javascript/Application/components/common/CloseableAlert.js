import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from '@cwds/components'
import { DEFAULT_AUTO_HIDE_TIMEOUT } from '../../util/constants'

import './style.sass'

export const alertType = Object.freeze({
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
})

export class CloseableAlert extends Component {
  constructor(context) {
    super(context)
    this.timer = null
    this.state = {
      isClosed: false,
    }
  }

  componentDidMount() {
    if (this.props.isAutoCloseable) {
      this.timer = setTimeout(this.handleCloseAlert, DEFAULT_AUTO_HIDE_TIMEOUT)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  handleCloseAlert = () => {
    clearTimeout(this.timer)
    this.setState({ isClosed: true })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    if (this.state.isClosed) {
      return null
    }

    const { message, type, isCloseable, className } = this.props
    return (
      <Alert color={type} className={className}>
        {message}
        {isCloseable && (
          <div className="float-right">
            <i
              className="fa fa-times close-icon"
              onClick={this.handleCloseAlert}
              onKeyPress={this.handleCloseAlert}
              role={'button'}
              tabIndex={'0'}
            />
          </div>
        )}
      </Alert>
    )
  }
}

CloseableAlert.propTypes = {
  className: PropTypes.string,
  isAutoCloseable: PropTypes.bool,
  isCloseable: PropTypes.bool,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onClose: PropTypes.func,
  type: PropTypes.oneOf([alertType.SUCCESS, alertType.INFO, alertType.WARNING, alertType.DANGER]).isRequired,
}

CloseableAlert.defaultProps = {
  className: null,
  isAutoCloseable: false,
  isCloseable: false,
  onClose: null,
}
