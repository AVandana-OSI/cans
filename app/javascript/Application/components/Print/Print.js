import React from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import { print } from './PrintHelper'

import './style.sass'

const printFrameId = 'print-frame'

class Print extends React.Component {
  componentDidMount() {
    print(printFrameId, renderToString(this.props.node))
    this.props.onClose()
  }

  render() {
    return <iframe id={printFrameId} title={printFrameId} />
  }
}

Print.propTypes = {
  node: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

Print.defaultProps = {
  isTest: false,
}

export default Print
