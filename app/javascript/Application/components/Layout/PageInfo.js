import React, { PureComponent, Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'

import './style.sass'

class PageInfo extends PureComponent {
  render() {
    const { title, actionNode } = this.props
    return (
      <Fragment>
        <Row>
          <Col xs="12">
            <div className={'page-info-title-wrapper'}>
              <div className={'title'}>{title}</div>
              {actionNode && <div className={'page-info-action'}>{actionNode}</div>}
            </div>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

PageInfo.propTypes = {
  actionNode: PropTypes.node,
  title: PropTypes.string.isRequired,
}

PageInfo.defaultProps = {
  actionNode: null,
}

export default PageInfo
