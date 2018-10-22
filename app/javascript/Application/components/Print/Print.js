import React from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import { isFirefox } from '../../util/common'

import './style.sass'

const printFrameId = 'print-frame'

class Print extends React.Component {
  componentDidMount() {
    this.print()
  }

  printInFirefox() {
    const frame = document.getElementById(printFrameId)
    frame.focus()
    frame.contentDocument.body.innerHTML = ''
    frame.contentDocument.write(renderToString(this.props.node))
    frame.contentWindow.print()
  }

  printInOtherBrowser() {
    const frameContentWindow = document.getElementById(printFrameId).contentWindow
    frameContentWindow.focus()
    frameContentWindow.document.open()
    frameContentWindow.document.write(renderToString(this.props.node))
    frameContentWindow.document.close()
    frameContentWindow.print()
  }

  print() {
    if (isFirefox) {
      this.printInFirefox()
    } else if (!this.props.isTest) {
      this.printInOtherBrowser()
    }
    this.props.onClose()
  }

  render() {
    return <iframe id={printFrameId} title={printFrameId} />
  }
}

Print.propTypes = {
  isTest: PropTypes.bool,
  node: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

Print.defaultProps = {
  isTest: false,
}

export default Print
