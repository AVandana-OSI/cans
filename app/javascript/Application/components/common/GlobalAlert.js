import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { CloseableAlert } from './CloseableAlert'
import { globalAlertService } from '../../util/GlobalAlertService'
import { clone } from '../../util/common'

let nextKey = 0

export class GlobalAlert extends Component {
  constructor(context) {
    super(context)
    this.state = {
      alerts: [],
    }
    globalAlertService.subscribe(this.onAlertEvent)
  }

  onAlertEvent = ({ message, type }) => {
    const alerts = clone(this.state.alerts)
    alerts.push({
      message: message,
      type: type,
    })

    this.setState({
      alerts: alerts,
    })
  }

  onAlertClose = index => {
    const alerts = clone(this.state.alerts)
    alerts.splice(index, 1)
    this.setState({
      alerts: alerts,
    })
  }

  render() {
    if (!this.state.alerts.length) {
      return null
    }

    const alerts = this.state.alerts
    return (
      <Container>
        {alerts.map((alert, index) => (
          <Row key={`global-alert-${index}`}>
            <Col>
              <CloseableAlert
                key={nextKey++}
                className={'global-alert'}
                message={alert.message}
                type={alert.type}
                isCloseable={true}
                onClose={() => this.onAlertClose(index)}
              />
            </Col>
          </Row>
        ))}
      </Container>
    )
  }
}
