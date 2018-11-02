import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { TIMEOUT_EVENT } from './../../util/constants'
import { eventBus } from './../../util/eventBus'
import { SecurityService } from './Security.service'

import './style.sass'
import { addTrailingSlash } from '../../util/formatters'

const logoutUrl = `${addTrailingSlash(process.env.CANS_BASE_PATH)}user/logout`

export class TimeoutWarning extends Component {
  constructor(context) {
    super(context)
    this.state = {
      isOpened: false,
    }
    this.refresh = this.refresh.bind(this)
    this.logout = this.logout.bind(this)
    this.onTimeoutEvent = this.onTimeoutEvent.bind(this)
  }

  componentDidMount() {
    eventBus.subscribe(TIMEOUT_EVENT, this.onTimeoutEvent)
  }

  onTimeoutEvent() {
    this.setState({
      isOpened: true,
    })
  }

  refresh() {
    SecurityService.refresh()
    this.setState({
      isOpened: false,
    })
  }

  logout() {
    window.location.href = logoutUrl
  }

  render() {
    return (
      <Modal className="warning-modal" isOpen={this.state.isOpened}>
        <ModalBody className="warning-modal-body">
          <div className="warning-modal-exclamation-triangle">
            <i className="fa fa-exclamation-triangle" />
          </div>
          <div className="warning-modal-heading">Session timeout!</div>
          <div>Due to inactivity, your session is about to timeout. Any unsaved work will be lost.</div>
          <div>Would you like to continue?</div>
        </ModalBody>
        <ModalFooter className="warning-modal-footer">
          <Button className="warning-modal-logout" onClick={this.logout}>
            Logout
          </Button>{' '}
          <Button className="warning-modal-stay-logged-in" onClick={this.refresh}>
            Stay Logged In
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default TimeoutWarning
